// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const client = require('./lib/client.js');
// Initiate database connection
client.connect();

// Application Setup
const app = express();
const PORT = process.env.PORT;
app.use(morgan('dev')); // http logging
app.use(cors()); // enable CORS request
app.use(express.static('public')); // server files from /public folder
app.use(express.json()); // enable reading incoming json data
app.use(express.urlencoded({ extended:true })); //security parsing an encoded url


// Auth Routes
// const createAuthRoutes = require('./lib/auth/create-auth-routes');

// const authRoutes = createAuthRoutes({
//     selectUser(email) {
//         return client.query(`
//             SELECT id, email, hash 
//             FROM users
//             WHERE email = $1;
//         `,
//         [email]
//         ).then(result => result.rows[0]);
//     },
//     insertUser(user, hash) {
//         return client.query(`
//             INSERT into users (email, hash)
//             VALUES ($1, $2)
//             RETURNING id, email;
//         `,
//         [user.email, hash]
//         ).then(result => result.rows[0]);
//     }
// });

//before ensure auth, but after other middleware... 
//the create-auth-route will be on top of this... 
//so api/auth/signup... or api/auth/signin

// app.use('/api/auth', authRoutes);

//for every route make sure there is a token
// const ensureAuth = require('./lib/auth/ensure-auth');

// app.use('/api', ensureAuth);

//API ROUTES!!!
// *** TODOS ***
app.get('/listings', async (req, res) => {

    try {

        const result = await client.query(`
            SELECT * FROM air_listings 
        `,);

        res.json(result.rows);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});

// before ensure auth, but after other middleware:
// app.use('/api/auth', authRoutes);
app.get('*', (req, res) => {
    res.send('404 error... Page not found');
});


// Start the server
app.listen(PORT, () => {
    console.log('server running on PORT', PORT);
});