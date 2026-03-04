import { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { BookOpen, PlusCircle } from "lucide-react";
import { useCourseStore } from "../../store/useCourseStore";

const InstructorCourses = () => {
  const navigate = useNavigate();
  const { courses, fetchInstructorCourses, isLoading } = useCourseStore();

  useEffect(() => {
    fetchInstructorCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">My Courses</h1>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!courses?.length) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <BookOpen size={60} className="mx-auto text-gray-300 mb-4" />

        <h2 className="text-xl font-semibold text-gray-700">No courses yet</h2>

        <p className="text-gray-500 mt-2">
          Start by creating your first course.
        </p>

        <button
          onClick={() => navigate("/instructor/create-course")}
          className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-xl"
        >
          Create Course
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 mb-1">
            My Courses
          </h1>
          <p className="text-gray-500 text-sm">
            Manage and update your courses
          </p>
        </div>

        <button
          onClick={() => navigate("/instructor/create-course")}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-white
          bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg hover:scale-105 transition cursor-pointer"
        >
          <PlusCircle size={18} />
          Create Course
        </button>
      </div>

      {/* COURSE GRID */}
      <div className="grid md:grid-cols-3 gap-7">
        {courses.map((course, index) => (
          <motion.div
            key={course._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group bg-white rounded-2xl overflow-hidden border border-purple-500/50 shadow-sm hover:shadow-xl transition"
          >
            {/* IMAGE */}
            <div className="relative">
              <img
                src={course.image || "/placeholder.jpg"}
                alt={course.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
              />

              <span className="absolute top-3 left-3 px-3 py-1 text-xs bg-black/70 text-white rounded-full">
                {course.category}
              </span>
            </div>

            {/* CONTENT */}
            <div className="p-3">
              <h3 className="font-semibold text-gray-800 line-clamp-1">
                {course.title}
              </h3>

              {/* COURSE DESCRIPTION */}
              {course.description && (
                <p
                  className="text-sm text-gray-500 mt-1 line-clamp-2"
                  title={course.description}
                >
                  {course.description}
                </p>
              )}

              <p className="text-xs text-gray-400 mt-2">{course.duration}</p>

              {/* STATS */}
              <div className="flex justify-between text-sm text-gray-500 mt-4">
                <span>₹{course.finalFee || course.fee}</span>
                <span>{course.totalLectures || 0} lectures</span>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() =>
                    navigate(`/instructor/courses/${course._id}/add-content`)
                  }
                  className="flex-1 py-2 text-sm rounded-lg text-white
                  bg-purple-600 hover:bg-purple-700 transition cursor-pointer"
                >
                  Add Content
                </button>

                <button
                  onClick={() =>
                    navigate(`/instructor/courses/${course._id}/manage`)
                  }
                  className="flex-1 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition"
                >
                  Manage
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InstructorCourses;
