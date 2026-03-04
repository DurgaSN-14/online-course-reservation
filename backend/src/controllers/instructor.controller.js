import Payment from "../models/payment.model.js";
import Course from "../models/course.model.js";
import Reservation from "../models/reservation.model.js";

export const getInstructorRevenue = async (req, res) => {
  const payments = await Payment.find({
    status: "success",
  }).populate("course");

  const instructorPayments = payments.filter(
    (p) => p.course.instructor.toString() === req.user._id.toString(),
  );

  const totalRevenue = instructorPayments.reduce((sum, p) => sum + p.amount, 0);

  res.json({ totalRevenue });
};

export const getInstructorEnrollments = async (req, res) => {
  const reservations = await Reservation.find({ status: "active" })
    .populate("student")
    .populate("course");

  const filtered = reservations.filter(
    (r) => r.course.instructor.toString() === req.user._id.toString(),
  );

  res.json(filtered);
};

export const getInstructorEarnings = async (req, res) => {
  try {
    const courses = await Course.find({
      instructor: req.user._id,
    }).select("_id");

    const courseIds = courses.map((course) => course._id);

    const payments = await Payment.find({
      course: { $in: courseIds },
      status: { $in: ["success", "refunded", "voided"] },
    }).populate("course", "title");

    const totalEarnings = payments
      .filter((p) => p.status === "success")
      .reduce((sum, p) => sum + p.amount, 0);

    res.status(200).json({
      totalEarnings,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getCourseStudents = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized access",
      });
    }

    const reservations = await Reservation.find({
      course: req.params.id,
      status: "active",
    }).populate("student", "name email");

    res.status(200).json({
      totalStudents: reservations.length,
      students: reservations,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
