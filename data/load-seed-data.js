require('dotenv').config();
const pg = require('pg');
const Client = pg.Client;
// import seed data:
const data = require('./data.json');

run();

async function run() {
    const client = new Client(process.env.DATABASE_URL);
    try {
        await client.connect();

        await client.query(`
                    INSERT INTO users (email, hash)
                    VALUES ($1, $2)
       `,
        ['mysweeetemail@gmail.com', 'supersecrettokenmofo']);

        await Promise.all(
            data.map(listing => {
                return client.query(`
                    INSERT INTO air_listings (program_name, address, city, state, zip_code, country, continent, phone_num, email, art_medium, img_url, link_url, description, user_id, is_grant)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);
                `,
                [listing.program_name, listing.address, listing.city, listing.state, listing.zip_code, listing.country, listing.continent, listing.phone_num, listing.email, listing.art_medium, listing.img_url, listing.link_url, listing.description, listing.user_id, listing.is_grant]);
            })
        );

        console.log('seed data load complete');
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.end();
    }
    
}