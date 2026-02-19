import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    slug: {
      type: String,
      lowercase: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    totalLectures: {
      type: Number,
      default: 0,
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    discount: {
      type: Number,
    },

    fee: {
      type: Number,
      required: true,
    },

    finalFee: {
      type: Number,
    },

    studentsEnrolled: {
      type: Number,
      default: 0,
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    totalRatings: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Course", courseSchema);
