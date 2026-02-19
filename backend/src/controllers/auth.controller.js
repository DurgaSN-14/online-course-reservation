import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

export const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        message: "Email already exists.",
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({
        message: "Username already taken.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "student",
    });

    generateToken(user, res);

    res.status(201).json({
      message: "Registration successful.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.log("Error in signup controller: ", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const user = await User.findOne({ email });

    if (!user || !user.isActive) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    generateToken(user, res);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.log("Error in login controller: ", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;

    let updateData = {
      username,
      bio,
    };

    if (req.file) {
      const uploaded = await uploadToCloudinary(
        req.file.path,
        "online-course-system/profile-pics",
      );
      updateData.profilePic = uploaded.url;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
    }).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log("Error in updateProfile controller:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.log("Error in changePassword controller: ", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");

    res.status(200).json({
      message: "Logged out successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getProfile controller: ", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deactivateAccount = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      isActive: false,
    });

    res.status(200).json({
      message: "Account deactivated.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
