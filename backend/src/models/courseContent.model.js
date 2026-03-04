import mongoose from "mongoose";

const courseContentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: ["video", "pdf", "document", "youtube", "quiz", "assignment"],
      required: true,
    },

    thumbnail: {
      type: String,
      default: "",
    },

    contentUrl: {
      type: String,
      required: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    maxMarks: {
      type: Number,
      default: 0,
    },

    weightage: {
      type: Number,
      default: 0,
    },

    isFreePreview: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("CourseContent", courseContentSchema);
