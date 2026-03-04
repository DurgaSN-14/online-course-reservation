import PDFDocument from "pdfkit";
import cloudinary from "./cloudinary.js";
import streamifier from "streamifier";

export const generateCertificatePDF = (
  studentName,
  courseTitle,
  certificateNumber,
) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
      });

      const buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));

      doc.on("end", async () => {
        try {
          const pdfBuffer = Buffer.concat(buffers);

          const result = await uploadToCloudinary(pdfBuffer, certificateNumber);

          resolve({
            url: result.secure_url,
            buffer: pdfBuffer,
          });
        } catch (err) {
          reject(err);
        }
      });

      // ===== DESIGN =====

      const safeStudent = studentName ? studentName.toUpperCase() : "STUDENT";

      const safeCourse = courseTitle || "COURSE";

      doc
        .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
        .lineWidth(4)
        .stroke("#1e3a8a");

      doc
        .fontSize(40)
        .fillColor("#1e3a8a")
        .text("E-Learning Pro Academy", { align: "center" });

      doc.moveDown(1);

      doc
        .fontSize(28)
        .fillColor("black")
        .text("Certificate of Completion", { align: "center" });

      doc.moveDown(2);

      doc
        .fontSize(22)
        .text("This is to proudly certify that", { align: "center" });

      doc.moveDown(1);

      doc
        .fontSize(34)
        .fillColor("#0f172a")
        .text(safeStudent, { align: "center" });

      doc.moveDown(1);

      doc.fontSize(22).text("has successfully completed the course", {
        align: "center",
      });

      doc.moveDown(1);

      doc
        .fontSize(28)
        .fillColor("#1e3a8a")
        .text(safeCourse, { align: "center" });

      doc.moveDown(2);

      doc
        .fontSize(16)
        .fillColor("black")
        .text(`Certificate No: ${certificateNumber}`, {
          align: "center",
        });

      doc.fontSize(16).text(`Date: ${new Date().toLocaleDateString()}`, {
        align: "center",
      });

      doc.moveDown(1);

      doc
        .fontSize(12)
        .fillColor("gray")
        .text(`Verify at: https://yourdomain.com/verify/${certificateNumber}`, {
          align: "center",
        });

      // 🔥 VERY IMPORTANT
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
const uploadToCloudinary = (buffer, certificateNumber) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "online-course-system/certificates",
        resource_type: "image",
        public_id: `certificate-${certificateNumber}`,
        format: "pdf",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};
