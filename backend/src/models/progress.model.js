import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
      required: true,
      unique: true,
    },

    completedPercentage: {
      type: Number,
      default: 0,
    },

    completedModules: {
      type: Number,
      default: 0,
    },

    totalModules: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Progress", progressSchema);
