import { create } from "zustand";
import axiosInstance from "../config/axios";
import toast from "react-hot-toast";

export const useCourseStore = create((set) => ({
  isLoading: false,
  error: null,
  course: null,
  contents: [],

  createCourse: async (courseData) => {
    try {
      set({ isLoading: true, error: null });

      const res = await axiosInstance.post("/courses", courseData);

      set({ isLoading: false });
      return { success: true, data: res.data };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Course creation failed",
      });
      toast.error(error.response?.data?.message || "Course creation failed");

      return { success: false };
    }
  },

  addCourseContent: async (courseContent) => {
    try {
      set({ isLoading: true, error: null });

      const res = await axiosInstance.post("/course-contents", courseContent);

      set({ isLoading: false });
      return { success: true, data: res.data };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Content upload failed",
      });
      toast.error(error.response?.data?.message || "Content upload failed");
      return { success: false };
    }
  },

  fetchInstructorCourses: async () => {
    try {
      set({ isLoading: true });

      const res = await axiosInstance.get("/courses/instructor");

      set({
        courses: res.data,
        isLoading: false,
      });
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch courses";

      set({ isLoading: false, error: message });
      toast.error(message);
    }
  },

  fetchCourseContents: async (courseId) => {
    try {
      set({ isLoading: true });

      const res = await axiosInstance.get(`/course-contents/${courseId}`);

      set({
        contents: res.data,
        isLoading: false,
      });
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch contents";

      set({ isLoading: false, error: message });
      toast.error(message);
    }
  },

  fetchCourseById: async (courseId) => {
    try {
      const res = await axiosInstance.get(`/courses/${courseId}`);

      set({
        course: res.data.course,
        contents: res.data.contents,
      });
    } catch (error) {
      toast.error("Failed to load course");
    }
  },

  updateCourse: async (id, courseData) => {
    try {
      const res = await axiosInstance.put(`/courses/${id}`, courseData);
      toast.success("Course updated");
      return { success: true, data: res.data };
    } catch (error) {
      toast.error("Update failed");
      return { success: false };
    }
  },

  updateCourseContent: async (id, data) => {
    try {
      await axiosInstance.put(`/course-contents/${id}`, data);
      toast.success("Lecture updated");
      return { success: true };
    } catch (error) {
      toast.error("Update failed");
      return { success: false };
    }
  },

  deleteCourse: async (id) => {
    try {
      await axiosInstance.delete(`/courses/${id}`);
      toast.success("Course deleted");
      return { success: true };
    } catch (error) {
      toast.error("Delete failed");
      return { success: false };
    }
  },

  deleteCourseContent: async (id) => {
    try {
      await axiosInstance.delete(`/course-contents/${id}`);
      // toast.success("Content deleted");
      return { success: true };
    } catch (error) {
      toast.error("Delete failed");
      return { success: false };
    }
  },
}));
