import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    teacher: {
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

    description: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    skillLevel: {
      type: String,
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
