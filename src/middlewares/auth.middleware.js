import User from "../models/user.model";
import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            throw new Error();
        }

        req.user = user;
        req.token = token;
        next();

    } catch (error) {
        res.status(401).send({ error: 'Please authenticate' ,message : error.message });
        
    }
}