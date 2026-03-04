import Review from "../models/review.model.js";
import Reservation from "../models/reservation.model.js";

/* =========================
   Add Review
========================= */
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Check if student enrolled in course
    const reservation = await Reservation.findOne({
      student: req.user._id,
      course: req.params.courseId,
      status: "active",
    });

    if (!reservation) {
      return res.status(403).json({
        message: "You must enroll before reviewing this course",
      });
    }

    // Prevent duplicate review
    const existing = await Review.findOne({
      student: req.user._id,
      course: req.params.courseId,
    });

    if (existing) {
      return res.status(400).json({
        message: "You already reviewed this course",
      });
    }

    const review = await Review.create({
      student: req.user._id,
      course: req.params.courseId,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Get Course Reviews
========================= */
export const getCourseReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      course: req.params.courseId,
    }).populate("student", "name");

    res.status(200).json({
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Delete Review (Admin)
========================= */
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    await review.deleteOne();

    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
