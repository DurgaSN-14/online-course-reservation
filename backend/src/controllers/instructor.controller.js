import Payment from "../models/payment.model.js";
import Course from "../models/course.model.js";
import Reservation from "../models/reservation.model.js";
import Progress from "../models/progress.model.js";

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

export const getInstructorDashboardStats = async (req, res) => {
  try {
    const instructorId = req.user._id;

    const courses = await Course.find({ instructor: instructorId });
    const courseIds = courses.map((c) => c._id);

    const enrollments = await Reservation.find({
      course: { $in: courseIds },
      status: "active",
    })
      .populate("student", "username email")
      .populate("course", "title");

    const payments = await Payment.find({
      course: { $in: courseIds },
      status: "success",
    });
    const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);

    const recentEnrollments = enrollments
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
      .map((e) => ({
        studentName: e.student?.username || "A student",
        courseName: e.course?.title,
        time: e.createdAt,
      }));

    res.status(200).json({
      stats: [
        {
          title: "Total Courses",
          value: courses.length.toString().padStart(2, "0"),
        },
        { title: "Total Students", value: enrollments.length.toLocaleString() },
        { title: "Revenue", value: `₹${totalEarnings.toLocaleString()}` },
        { title: "Enrollment Rate", value: "85%" }, // Logic can be added later
      ],
      coursePerformance: courses
        .map((c) => ({
          name: c.title,
          students: enrollments.filter(
            (e) => e.course._id.toString() === c._id.toString(),
          ).length,
        }))
        .sort((a, b) => b.students - a.students)
        .slice(0, 4),
      recentEnrollments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInstructorStudents = async (req, res) => {
  try {
    const instructorId = req.user._id;

    // 1. Get all courses by this instructor
    const courses = await Course.find({ instructor: instructorId }).select(
      "_id title",
    );
    const courseIds = courses.map((c) => c._id);

    // 2. Find all active reservations for these courses
    const enrollments = await Reservation.find({
      course: { $in: courseIds },
      status: "active",
    })
      .populate("student", "username email profilePic")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    // 3. For each enrollment, fetch the current progress percentage
    const studentsWithProgress = await Promise.all(
      enrollments.map(async (enrol) => {
        const progress = await Progress.findOne({
          student: enrol.student._id,
          course: enrol.course._id,
        });

        return {
          id: enrol._id,
          studentName: enrol.student?.username || "Unknown",
          email: enrol.student?.email,
          avatar: enrol.student?.profilePic,
          courseName: enrol.course?.title,
          enrollmentDate: enrol.createdAt,
          progress: progress ? progress.completedPercentage : 0,
          status: progress?.status || "in-progress",
        };
      }),
    );

    res.status(200).json(studentsWithProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const globalSearch = async (req, res) => {
  try {
    const { query } = req.query;
    const instructorId = req.user._id;

    const courses = await Course.find({
      instructor: instructorId,
      title: { $regex: query, $options: "i" },
    }).limit(5);

    const enrolledStudents = await Reservation.find({ status: "active" })
      .populate({
        path: "student",
        match: { username: { $regex: query, $options: "i" } },
        select: "username profilePic email",
      })
      .populate("course", "title");

    const students = enrolledStudents
      .filter((e) => e.student !== null)
      .map((e) => ({
        id: e.student._id,
        name: e.student.username,
        course: e.course.title,
        image: e.student.profilePic,
      }))
      .slice(0, 5);

    res.json({ courses, students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markNotificationsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      await Notification.findByIdAndUpdate(id, { isRead: true });
    } else {
      await Notification.updateMany(
        { recipient: req.user._id },
        { isRead: true },
      );
    }

    res.status(200).json({ message: "Notifications updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
