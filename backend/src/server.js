import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import courseContentRoutes from "./routes/courseContent.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/course-contents", courseContentRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
