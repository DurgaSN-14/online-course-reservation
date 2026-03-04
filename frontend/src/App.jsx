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
import About from "./pages/common/About";

import StudentDashboard from "./pages/student/StudentDashboard";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateCourse from "./pages/instructor/CreateCourse";
import InstructorLayout from "./layouts/InstructorLayout";
import InstructorCourses from "./pages/instructor/InstructorCourses";
import AddCourseContent from "./pages/instructor/AddCourseContent";
import ManageCourse from "./pages/instructor/ManageCourse";

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
        <Route path="/about" element={<About />} />

        {/* Student Dashboard */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Instructor Dashboard */}
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
        </Route>

        {/* Admin Dashboard */}
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
