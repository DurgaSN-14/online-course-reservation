import { v4 as uuidv4 } from "uuid";
import Certificate from "../models/certificate.model.js";
import Progress from "../models/progress.model.js";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import { generateCertificatePDF } from "../utils/generateCertificate.js";
import { sendCertificateMail } from "../utils/sendMail.js";

export const issueCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;

    const progress = await Progress.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!progress || progress.status !== "completed") {
      return res.status(400).json({
        message: "Course not completed",
      });
    }

    const existing = await Certificate.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (existing) {
      return res.status(400).json({
        message: "Certificate already issued",
      });
    }

    const user = await User.findById(req.user._id);
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const certificateNumber = uuidv4();
    const { url, buffer } = await generateCertificatePDF(
      user.username,
      course.title,
      certificateNumber,
    );

    await sendCertificateMail(user.email, buffer, certificateNumber);

    const certificate = await Certificate.create({
      student: user._id,
      course: course._id,
      progress: progress._id,
      certificateNumber,
      pdfUrl: url,
    });

    progress.certificateIssued = true;
    await progress.save();

    res.status(201).json({
      message: "Certificate issued successfully",
      certificate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({
      student: req.user._id,
    }).populate("course", "title");

    res.status(200).json({
      count: certificates.length,
      certificates,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      certificateNumber: req.params.certificateId,
    })
      .populate("student", "name email")
      .populate("course", "title");

    if (!certificate) {
      return res.status(404).json({
        message: "Invalid certificate ID",
      });
    }

    res.status(200).json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
