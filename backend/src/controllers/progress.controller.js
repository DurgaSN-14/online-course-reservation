import Progress from "../models/progress.model.js";
import CourseContent from "../models/courseContent.model.js";
import Reservation from "../models/reservation.model.js";

export const createProgress = async (req, res) => {
  try {
    const { reservationId, totalModules } = req.body;

    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    const existing = await Progress.findOne({
      reservation: reservationId,
    });

    if (existing) {
      return res.status(400).json({
        message: "Progress already exists",
      });
    }

    const progress = await Progress.create({
      student: reservation.student,
      course: reservation.course,
      reservation: reservation._id,
      totalModules,
    });

    res.status(201).json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { contentId, marksObtained = 0 } = req.body;
    const { courseId } = req.params;

    const progress = await Progress.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!progress) {
      return res.status(404).json({
        message: "Progress not found",
      });
    }

    const content = await CourseContent.findById(contentId);

    if (!content) {
      return res.status(404).json({
        message: "Course content not found",
      });
    }

    // Check if already completed
    const alreadyCompleted = progress.completedContents.find(
      (item) => item.content.toString() === contentId,
    );

    if (!alreadyCompleted) {
      progress.completedContents.push({
        content: contentId,
        marksObtained,
      });
    }

    const allContents = await CourseContent.find({
      course: courseId,
    });

    if (allContents.length === 0) {
      progress.completedPercentage = 0;
      await progress.save();
      return res.status(200).json(progress);
    }

    const hasWeightage = allContents.some(
      (c) => c.weightage && c.weightage > 0,
    );

    let completedScore = 0;
    let totalScore = 0;

    if (hasWeightage) {
      // WEIGHTAGE BASED CALCULATION
      totalScore = allContents.reduce((sum, c) => sum + (c.weightage || 0), 0);

      progress.completedContents.forEach((item) => {
        const matched = allContents.find(
          (c) => c._id.toString() === item.content.toString(),
        );

        if (matched) {
          if (matched.maxMarks && matched.weightage) {
            // partial based on marks
            const percentage = item.marksObtained / matched.maxMarks;

            completedScore += percentage * matched.weightage;
          } else {
            // full weightage for non-assessment
            completedScore += matched.weightage || 0;
          }
        }
      });
    } else {
      // EQUAL DISTRIBUTION
      totalScore = allContents.length;

      completedScore = progress.completedContents.length;
    }

    progress.completedPercentage =
      totalScore === 0 ? 0 : (completedScore / totalScore) * 100;

    if (progress.completedPercentage >= 100) {
      progress.completedPercentage = 100;
      progress.status = "completed";
    }

    await progress.save();

    res.status(200).json({
      message: "Progress updated",
      progress,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      student: req.user._id,
      course: req.params.courseId,
    });

    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseProgress = async (req, res) => {
  try {
    const progress = await Progress.find({
      course: req.params.courseId,
    }).populate("student", "name email");

    res.status(200).json({
      count: progress.length,
      progress,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
