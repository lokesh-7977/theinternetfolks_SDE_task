import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import config from "../config/index.js";

const Auth = async (req, res, next) => {
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

    // Attach user object to request for further use in downstream middleware or routes
    req.user = user;
    req.token = bearerToken;

    // Call next middleware or route handler
    next();
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

export default Auth;
