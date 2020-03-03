// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const client = require('./lib/client.js');
const request = require('superagent');

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
app.get('/listings', async(req, res) => {

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

app.get('/listings/:listingID', async(req, res) => {
    try {
        const result = await client.query(`
            SELECT *
            FROM air_listings
            WHERE id = ${req.params.listingID}
        `);

        res.json(result.rows);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});

//edit listing
app.put('/listings/:listingID', async(req, res) => {
    // using req.body instead of req.params or req.query (which belong to /GET requests)
    try {
        console.log(req.body);
        // make a new cat out of the cat that comes in req.body;
        const result = await client.query(`
            UPDATE air_listings
            SET program_name = '${req.body.program_name}', 
                address = '${req.body.address}', 
                city = '${req.body.city}', 
                state = '${req.body.state}',
                zip_code = '${req.body.zip_code}',
                country = '${req.body.country}',
                continent = '${req.body.continent}',
                phone_num = '${req.body.phone_num}',
                email = '${req.body.email}',
                art_medium = '${req.body.art_medium}',
                img_url = '${req.body.img_url}',
                link_url = '${req.body.link_url}',
                description = '${req.body.description}',
                user_id = '${req.body.user_id}',
                is_grant = '${req.body.is_grant}'

            WHERE id = ${req.params.listingID};
        `,
        );

        res.json(result.rows[0]); // return just the first result of our query
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});

app.get('/api/geocode', async(req, res) => {
    const data = await request.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${req.query.search}&key=${process.env.GOOGLE_MAPS_API_KEY}`);

    res.json(data.body);
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