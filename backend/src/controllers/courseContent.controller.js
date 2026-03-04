import CourseContent from "../models/courseContent.model.js";
import Course from "../models/course.model.js";
import cloudinary from "../utils/cloudinary.js";

export const addCourseContent = async (req, res) => {
  try {
    const {
      courseId,
      title,
      description,
      type,
      contentFile,
      thumbnailFile,
      contentUrl,
      order,
      maxMarks,
      weightage,
      isFreePreview,
    } = req.body;

    let finalContentUrl = contentUrl || "";
    let thumbnailUrl = "";

    if (contentFile) {
      const uploaded = await cloudinary.uploader.upload(contentFile, {
        folder: "online-course-system/course-contents",
        resource_type: "auto",
      });

      finalContentUrl = uploaded.secure_url;
    }

    if (thumbnailFile) {
      const uploaded = await cloudinary.uploader.upload(thumbnailFile, {
        folder: "online-course-system/course-thumbnails",
        resource_type: "auto",
      });

      thumbnailUrl = uploaded.secure_url;
    }

    const content = await CourseContent.create({
      course: courseId,
      title,
      description,
      type,
      contentUrl: finalContentUrl,
      thumbnail: thumbnailUrl,
      order,
      maxMarks,
      weightage,
      isFreePreview,
    });

    // update lecture count
    await Course.findByIdAndUpdate(courseId, {
      $inc: { totalLectures: 1 },
    });

    res.status(201).json({
      message: "Content added successfully.",
      content,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateCourseContent = async (req, res) => {
  try {
    const contentId = req.params.id;

    const {
      title,
      description,
      type,
      contentFile,
      thumbnailFile,
      contentUrl,
      order,
      maxMarks,
      weightage,
      isFreePreview,
    } = req.body;

    const content = await CourseContent.findById(contentId);

    if (!content) {
      return res.status(404).json({
        message: "Content not found",
      });
    }

    let finalContentUrl = content.contentUrl;
    let thumbnailUrl = content.thumbnail;

    if (contentFile) {
      const uploaded = await cloudinary.uploader.upload(contentFile, {
        folder: "online-course-system/course-contents",
      });

      finalContentUrl = uploaded.secure_url;
    } else if (contentUrl) {
      finalContentUrl = contentUrl;
    }

    if (thumbnailFile) {
      const uploadedThumb = await cloudinary.uploader.upload(thumbnailFile, {
        folder: "online-course-system/course-thumbnails",
      });

      thumbnailUrl = uploadedThumb.secure_url;
    }

    const updatedContent = await CourseContent.findByIdAndUpdate(
      contentId,
      {
        title,
        description,
        type,
        contentUrl: finalContentUrl,
        thumbnail: thumbnailUrl,
        order,
        maxMarks,
        weightage,
        isFreePreview,
      },
      { new: true },
    );

    res.status(200).json({
      message: "Content updated successfully",
      content: updatedContent,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getCourseContents = async (req, res) => {
  try {
    const contents = await CourseContent.find({
      course: req.params.courseId,
    }).sort({ order: 1 });

    res.status(200).json(contents);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteCourseContent = async (req, res) => {
  try {
    const content = await CourseContent.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        message: "Content not found",
      });
    }

    await CourseContent.findByIdAndDelete(req.params.id);

    await Course.findByIdAndUpdate(content.course, {
      $inc: { totalLectures: -1 },
    });

    res.status(200).json({
      message: "Content deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
