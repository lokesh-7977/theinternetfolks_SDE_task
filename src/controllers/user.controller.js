import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import config from "../config/index.js";
import { Snowflake } from "@theinternetfolks/snowflake";

const generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRATION,
  });
};


export const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ status: false, message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "User already exists" });
    }

    const userId = Snowflake.generate().toString(); 
    console.log("Snowflake ID: ", userId)
    const user = new User({
      _id: userId, 
      name,
      email,
      password,
      archived: false,
    });
    await user.save();

    const token = generateToken(user._id);

    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, 
    });

    res.status(201).json({
      status: true,
      content: {
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          created_at: user.createdAt,
        },
        meta: {
          access_token: token,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



export const signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: false, message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "User does not exist" });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    // Set access_token cookie
    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({
      status: true,
      content: {
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          created_at: user.createdAt,
        },
        meta: {
          access_token: token,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const profile = async (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized: Access token is missing",
      });
    }

    const decodedToken = jwt.verify(token, config.JWT_SECRET);
    const userId = decodedToken.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res.status(200).json({
      status: true,
      content: {
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          created_at: user.createdAt,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
