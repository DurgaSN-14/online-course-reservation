import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import courseContentRoutes from "./routes/courseContent.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import instructorRoutes from "./routes/instructor.routes.js";
import studentRoutes from "./routes/student.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import certificateRoutes from "./routes/certificate.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/course-contents", courseContentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/instructor", instructorRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/reviews", reviewRoutes);

app.use("/api/reservations", reservationRoutes);
app.use("/api/payments", paymentRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
}

app.get("/*splat", (_, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
