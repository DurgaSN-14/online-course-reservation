import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
