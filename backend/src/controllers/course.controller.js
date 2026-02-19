import Course from "../models/course.model.js";
import CourseContent from "../models/courseContent.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import slugify from "slugify";

export const createCourse = async (req, res) => {
  try {
    const { title, description, category, duration, level, fee, discount } =
      req.body;

    if (!title || !description || !category || !duration || !fee) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    let imageUrl = "";

    if (req.file) {
      const uploaded = await uploadToCloudinary(
        req.file.path,
        "online-course-system/courses",
      );

      imageUrl = uploaded.url;
    }

    // calculate final fee
    let finalFee = fee;
    if (discount) {
      finalFee = fee - (fee * discount) / 100;
    }

    const slug = slugify(title, { lower: true });

    const course = await Course.create({
      instructor: req.user._id,
      title,
      description,
      category,
      duration,
      level,
      discount,
      fee,
      finalFee,
      image: imageUrl,
      slug,
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.log("Error in createCourse: ", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const { title, description, category, duration, level, fee, discount } =
      req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // only instructor can update
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized.",
      });
    }

    let imageUrl = course.image;

    if (req.file) {
      const uploaded = await uploadToCloudinary(
        req.file.path,
        "online-course-system/courses",
      );

      imageUrl = uploaded.url;
    }

    // calculate final fee
    let finalFee = fee;
    if (discount) {
      finalFee = fee - (fee * discount) / 100;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        title,
        description,
        category,
        duration,
        level,
        fee,
        discount,
        finalFee,
        image: imageUrl,
      },
      { new: true },
    );

    res.status(200).json({
      message: "Course updated",
      course: updatedCourse,
    });
  } catch (error) {
    console.log("Error in updateCourse: ", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const publishCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { isPublished: true },
      { new: true },
    );

    res.status(200).json({
      message: "Course published",
      course,
    });
  } catch (error) {
    console.log("Error in publishCourse: ", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      isPublished: true,
    }).populate("instructor", "username profilePic");

    res.status(200).json(courses);
  } catch (error) {
    console.log("Error in getAllCourses: ", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "username profilePic bio",
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const contents = await CourseContent.find({
      course: course._id,
    }).sort({ order: 1 });

    res.status(200).json({
      course,
      contents,
    });
  } catch (error) {
    console.log("Error in getCourseById: ", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      instructor: req.user._id,
    });

    res.status(200).json(courses);
  } catch (error) {
    console.log("Error in getInstructorCourses: ", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);

    await CourseContent.deleteMany({
      course: req.params.id,
    });

    res.status(200).json({
      message: "Course deleted successfully.",
    });
  } catch (error) {
    console.log("Error in deleteCourse: ", error);
    res.status(500).json({
      message: error.message,
    });
  }
};
