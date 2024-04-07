import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Snowflake } from "@theinternetfolks/snowflake";

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        default: () => Snowflake.generate().toString(),
    },
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        minLength: [2, 'Name must be at least 2 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minLength: [6, 'Password must be at least 6 characters'],
        required: true
    },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        this.password = await bcrypt.hash(this.password, 8);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
