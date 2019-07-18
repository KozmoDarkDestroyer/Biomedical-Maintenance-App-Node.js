const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    port: process.env.PORT,
    url_mongo: process.env.url_mongo,
    AUTH_JWT_SECRET: process.env.AUTH_JWT_SECRET,
    TOKEN_EXPIRATION: process.env.TOKEN_EXPIRATION
}