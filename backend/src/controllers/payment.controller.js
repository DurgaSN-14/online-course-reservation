import gateway from "../utils/braintree.js";
import Payment from "../models/payment.model.js";
import Reservation from "../models/reservation.model.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import {
  notifyInstructorPurchase,
  sendStudentPurchaseMail,
} from "../services/email.services.js";

// Generate Client Token
export const generateClientToken = async (req, res) => {
  try {
    const response = await gateway.clientToken.generate({});
    res.status(200).json({ clientToken: response.clientToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Transaction
export const createTransaction = async (req, res) => {
  try {
    const { paymentMethodNonce, courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const reservation = await Reservation.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!reservation) {
      return res.status(400).json({
        message: "Please reserve the course first",
      });
    }

    const result = await gateway.transaction.sale({
      amount: course.finalFee.toString(),
      paymentMethodNonce: paymentMethodNonce,
      options: {
        submitForSettlement: true,
      },
    });

    if (result.success) {
      // Save Payment
      const payment = await Payment.create({
        user: req.user._id,
        course: courseId,
        reservation: reservation._id,
        transactionId: result.transaction.id,
        amount: course.finalFee,
        paymentMethod: result.transaction.paymentInstrumentType,
        status: "success",
      });

      reservation.status = "active";
      await reservation.save();

      const student = await User.findById(req.user._id);
      const instructor = await User.findById(course.instructor);

      try {
        await sendStudentPurchaseMail(student, course);
        await notifyInstructorPurchase(instructor, student, course);
      } catch (mailError) {
        console.log("Mail Error:", mailError.message);
      }

      res.status(200).json({
        message: "Payment Successful",
        payment,
      });
    } else {
      await Payment.create({
        user: req.user._id,
        course: courseId,
        reservation: reservation._id,
        amount: course.finalFee,
        status: "failed",
      });

      res.status(400).json({
        message: result.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const refundPayment = async (req, res) => {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({
        message: "Transaction ID is required",
      });
    }

    const payment = await Payment.findOne({ transactionId });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    // Prevent double refund
    if (payment.status === "refunded" || payment.status === "voided") {
      return res.status(400).json({
        message: "Payment already cancelled",
      });
    }

    // 🔥 Refund allowed only within 2 days
    const refundPeriodDays = 2;
    const differenceInDays =
      (new Date() - new Date(payment.createdAt)) / (1000 * 60 * 60 * 24);

    if (differenceInDays > refundPeriodDays) {
      return res.status(400).json({
        message: "Refund period expired",
      });
    }

    // 🔥 Get latest transaction from Braintree
    const transaction = await gateway.transaction.find(transactionId);

    let result;
    let newStatus;

    if (transaction.status === "settled") {
      // If money already settled → refund
      result = await gateway.transaction.refund(transactionId);
      newStatus = "refunded";
    } else if (
      transaction.status === "authorized" ||
      transaction.status === "submitted_for_settlement"
    ) {
      // If not settled → void
      result = await gateway.transaction.void(transactionId);
      newStatus = "voided";
    } else if (
      transaction.status === "voided" ||
      transaction.status === "refunded"
    ) {
      return res.status(400).json({
        message: `Transaction already ${transaction.status}`,
      });
    } else {
      return res.status(400).json({
        message: `Cannot refund transaction in ${transaction.status} state`,
      });
    }

    if (!result.success) {
      return res.status(400).json({
        message: result.message,
      });
    }

    // ✅ Update Payment status
    payment.status = newStatus;
    await payment.save();

    // ✅ Cancel reservation
    const reservation = await Reservation.findById(payment.reservation);
    if (reservation) {
      reservation.status = "cancelled";
      await reservation.save();
    }

    // ✅ Send emails (safe)
    try {
      const student = await User.findById(payment.user);
      const course = await Course.findById(payment.course);
      const instructor = await User.findById(course.instructor);

      await sendRefundMail(student, course);
      await notifyInstructorRefund(instructor, student, course);
    } catch (mailError) {
      console.log("Refund mail error:", mailError.message);
    }

    return res.status(200).json({
      message: "Refund processed successfully",
      status: newStatus,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
