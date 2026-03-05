import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlayCircle, Clock, BarChart3 } from "lucide-react";
import { useCourseStore } from "../../store/useCourseStore";
import { Link } from "react-router";

const StudentCourses = () => {
  const { getMyCourses } = useCourseStore();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      const data = await getMyCourses();
      if (data) setCourses(data);
    };

    loadCourses();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">My Learning</h1>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8 transition">
        {courses.map((item, index) => {
          const course = item.course;
          const progress = item.progress || 0;

          return (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="
                bg-white
                rounded-2xl
                overflow-hidden
                shadow-md
                hover:shadow-xl
                transition hover:transition-all
                border border-purple-200
              "
            >
              {/* IMAGE */}

              <div className="relative transition-all">
                <img src={course.image} className="w-full h-48 object-cover" />

                {/* CATEGORY BADGE */}

                <span
                  className="
                  absolute top-3 left-3
                  bg-purple-600
                  text-white
                  text-xs
                  px-3 py-1
                  rounded-full
                  shadow
                "
                >
                  {course.category}
                </span>
              </div>

              <div className="p-6 space-y-4">
                {/* TITLE */}

                <h3 className="text-lg font-semibold line-clamp-2">
                  {course.title}
                </h3>

                {/* COURSE META */}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {course.duration}
                  </div>

                  <div className="flex items-center gap-1">
                    <BarChart3 size={14} />
                    {course.level}
                  </div>
                </div>

                {/* PROGRESS */}

                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-500">Progress</span>

                    <span className="text-purple-600 font-semibold">
                      {progress}%
                    </span>
                  </div>

                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      style={{ width: `${progress}%` }}
                      className="
                        h-2 rounded-full
                        bg-gradient-to-r
                        from-purple-500
                        to-indigo-500
                      "
                    />
                  </div>
                </div>

                {/* CONTINUE BUTTON */}

                <Link
                  to={`/student/course/${course._id}`}
                  className="
                    flex items-center justify-center gap-2
                    w-full
                    py-2.5
                    rounded-xl
                    text-sm
                    font-semibold
                    text-white
                    bg-gradient-to-r
                    from-purple-600
                    to-indigo-600
                    hover:from-purple-700
                    hover:to-indigo-700
                    transition
                    shadow
                  "
                >
                  <PlayCircle size={16} />
                  Continue Learning
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentCourses;
