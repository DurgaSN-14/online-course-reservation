import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router";
import { useAuthStore } from "./store/useAuthStore";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

import Home from "./pages/common/Home";
import Signup from "./pages/common/Signup";
import Login from "./pages/common/Login";
import Courses from "./pages/common/Courses";
import CourseOverview from "./pages/common/CourseOverview";
import About from "./pages/common/About";

import StudentLayout from "./layouts/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentCourses from "./pages/student/StudentCourses";
import Checkout from "./pages/student/Checkout";

import InstructorLayout from "./layouts/InstructorLayout";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import InstructorCourses from "./pages/instructor/InstructorCourses";
import CreateCourse from "./pages/instructor/CreateCourse";
import AddCourseContent from "./pages/instructor/AddCourseContent";
import ManageCourse from "./pages/instructor/ManageCourse";

import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentCoursePlayer from "./pages/student/StudentCoursePlayer";
import ManageStudents from "./pages/instructor/ManageStudents";
import InstructorAnalytics from "./pages/instructor/InstructorAnalytics";
import InstructorSettings from "./pages/instructor/InstructorSettings";

const App = () => {
  const { checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const authRoutes = ["/login", "/signup"];
  const dashboardRoutes = ["/student", "/instructor", "/admin"];

  const hideNavbar =
    authRoutes.includes(location.pathname) ||
    dashboardRoutes.some((route) => location.pathname.startsWith(route));

  const hideFooter = hideNavbar;

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courseoverview/:id" element={<CourseOverview />} />
        <Route path="/checkout/:courseId" element={<Checkout />} />
        <Route path="/about" element={<About />} />

        {/* Student */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/my-courses" element={<StudentCourses />} />
          <Route
            path="/student/course/:courseId"
            element={<StudentCoursePlayer />}
          />
        </Route>

        {/* Instructor */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["instructor"]}>
              <InstructorLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/instructor/dashboard"
            element={<InstructorDashboard />}
          />
          <Route path="/instructor/courses" element={<InstructorCourses />} />
          <Route path="/instructor/create-course" element={<CreateCourse />} />

          <Route
            path="/instructor/courses/:courseId/add-content"
            element={<AddCourseContent />}
          />

          <Route
            path="/instructor/courses/:courseId/manage"
            element={<ManageCourse />}
          />

          <Route path="/instructor/students" element={<ManageStudents />} />
          <Route
            path="/instructor/analytics"
            element={<InstructorAnalytics />}
          />
          <Route path="/instructor/settings" element={<InstructorSettings />} />
        </Route>

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Toaster position="top-center" containerStyle={{ left: 130 }} />

      {!hideFooter && <Footer />}
    </>
  );
};

export default App;
