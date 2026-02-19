import jwt from "jsonwebtoken";

const generateToken = (user, res) => {
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "strict",
  });

  return token;
};

export default generateToken;
