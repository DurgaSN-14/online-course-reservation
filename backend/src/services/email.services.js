import transporter from "../utils/mail.js";

export const sendStudentPurchaseMail = async (student, course) => {
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: student.email,
    subject: "Course Purchase Confirmation",
    html: `
      <h2>Payment Successful 🎉</h2>
      <p>Hi ${student.name},</p>
      <p>You have successfully purchased <b>${course.title}</b>.</p>
      <p>You can now start learning.</p>
    `,
  });
};

export const notifyInstructorPurchase = async (instructor, student, course) => {
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: instructor.email,
    subject: "New Student Enrolled",
    html: `
      <h2>New Enrollment</h2>
      <p>${student.name} has enrolled in your course <b>${course.title}</b>.</p>
    `,
  });
};
