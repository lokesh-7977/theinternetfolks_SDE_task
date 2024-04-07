import mongoose from "mongoose";
import config from './index.js';

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(config.DATABASE_URI, {
       
        });
        console.log(`DB CONNECTED TO  : MONGODB`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;