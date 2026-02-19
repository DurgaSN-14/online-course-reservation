import cloudinary from "./cloudinary.js";

const uploadToCloudinary = async (
  filePath,
  folder = "online-course-system",
) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto",
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    throw new Error("Cloudinary upload failed: " + error.message);
  }
};

export default uploadToCloudinary;
