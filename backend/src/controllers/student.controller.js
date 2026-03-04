import Payment from "../models/payment.model.js";
import Reservation from "../models/reservation.model.js";

export const getMyCourses = async (req, res) => {
  try {
    const reservations = await Reservation.find({
      student: req.user._id,
      status: "active",
    }).populate("course");

    const courses = reservations.map((r) => r.course);

    res.status(200).json({
      count: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate("course", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: payments.length,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("course", "title")
      .populate("user", "name email");

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
