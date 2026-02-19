import { create } from "zustand";
import axios from "../lib/axios";

export const useAuthStore = create((set) => ({
    user: null,
    isLoading: false,
    error: null,

    // LOGIN
    login: async (data) => {
        try {
            set({ isLoading: true, error: null });

            const res = await axios.post("/auth/login", data);

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

            const res = await axios.post("/auth/signup", data);

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
        await axios.post("/auth/logout");
        set({ user: null });
    },

    // GET PROFILE (refresh user on reload)
    checkAuth: async () => {
        try {
            const res = await axios.get("/auth/me");
            set({ user: res.data });
        } catch {
            set({ user: null });
        }
    },
}));