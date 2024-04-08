import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import config from "../config/index.js";
import { Snowflake } from "@theinternetfolks/snowflake";

const generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: '30d',
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

    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, 
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
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader && authHeader.split(' ')[1];

    if (!bearerToken) {
      return res.status(401).json({ status: false, message: "Unauthorized: Access token is missing" });
    }

    const tokenData = jwt.verify(bearerToken, config.JWT_SECRET);
    const userId = tokenData.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const response = {
      status: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ status: false, message: "Forbidden: Invalid token" });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ status: false, message: "Unauthorized: Token expired" });
    }
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};
