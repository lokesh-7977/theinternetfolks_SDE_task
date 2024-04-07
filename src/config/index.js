import dotenv from 'dotenv';
dotenv.config();

const config = {
    PORT: process.env.PORT || 4000,
    DATABASE_URI: process.env.DATABASE_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRATION: process.env.JWT_EXPIRATION,
}

export default config;


