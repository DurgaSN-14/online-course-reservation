import transporter from "./mail.js";

export const sendCertificateMail = async (
  email,
  pdfBuffer,
  certificateNumber,
) => {
  await transporter.sendMail({
    from: `"E-Learning Pro Academy" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🎓 Your Course Completion Certificate",
    html: `
      <h2>Congratulations 🎉</h2>
      <p>Your certificate is attached below.</p>
    `,
    attachments: [
      {
        filename: `certificate-${certificateNumber}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
};
