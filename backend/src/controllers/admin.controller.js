import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";


export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      total: payments.length,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      total: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      total: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Prevent blocking another admin
    if (user.role === "admin") {
      return res.status(400).json({
        message: "Admin cannot be blocked",
      });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      message: user.isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
