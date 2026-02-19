import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

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

    certificateIssued: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

progressSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.model("Progress", progressSchema);
