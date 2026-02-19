import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  try {
    let token;

    if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.userId).select("-password");

    next();
  } catch (error) {
    console.log("Error in authMiddleware: ", error);
    res.status(401).json({
      message: "Invalid token",
    });
  }
};

export default authMiddleware;
