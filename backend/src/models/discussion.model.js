import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  message: String,
  createdAt: Date,
});

const discussionSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    question: String,

    replies: [replySchema],
  },
  { timestamps: true },
);

export default mongoose.model("Discussion", discussionSchema);
