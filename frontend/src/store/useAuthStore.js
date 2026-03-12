import { create } from "zustand";
import axiosInstance from "../config/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  user: null,
  isCheckingAuth: true,
  isLoading: false,
  error: null,

  // LOGIN
  login: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const res = await axiosInstance.post("/auth/login", data);

      set({
        user: res.data.user,
        isLoading: false,
      });

      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.message || "Login failed",
        isLoading: false,
      });

      return { success: false };
    }
  },

  // SIGNUP
  signup: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const res = await axiosInstance.post("/auth/signup", data);

      set({
        user: res.data.user,
        isLoading: false,
      });

      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.message || "Signup failed",
        isLoading: false,
      });

      return { success: false };
    }
  },

  // LOGOUT
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (err) {
      // ignore 401
    }
    set({ user: null });
  },

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/profile", data);
      set({ user: res.data.user });
      toast.success("Profile updated!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  },

  changePassword: async (passwords) => {
    try {
      await axiosInstance.put("/auth/change-password", passwords);
      toast.success("Password changed successfully!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Password change failed");
    }
  },

  // GET PROFILE (refresh user on reload)
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      set({ user: res.data, isCheckingAuth: false });
    } catch (err) {
      set({ user: null, isCheckingAuth: false });
    }
  },
}));
