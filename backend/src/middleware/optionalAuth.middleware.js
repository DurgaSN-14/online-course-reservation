import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);

    const user = await User.findById(decoded.userId).select("-password");

    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    next();
  }
};

export default optionalAuth;
