import { motion } from "framer-motion";
import { BookOpen, Award, Clock, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Enrolled Courses",
    value: "08",
    icon: BookOpen,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    title: "Completed",
    value: "03",
    icon: Award,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    title: "Learning Hours",
    value: "120h",
    icon: Clock,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
  {
    title: "Progress Rate",
    value: "75%",
    icon: TrendingUp,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
];

const progressCourses = [
  { name: "React Mastery", progress: 80 },
  { name: "Node.js Advanced", progress: 60 },
  { name: "MongoDB Bootcamp", progress: 40 },
];

const activities = [
  { text: "Completed React Basics Lecture", time: "2h ago" },
  { text: "Enrolled in Node Advanced", time: "Yesterday" },
  { text: "Updated Profile", time: "2 days ago" },
];

const StudentDashboard = () => {
  return (
    <div className="space-y-10">
      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="
              bg-white
              border border-purple-200
              rounded-2xl
              shadow-sm
              p-6
              flex items-center justify-between
              transition-all
              hover:shadow-lg
              "
            >
              <div>
                <p className="text-gray-500 text-sm">{item.title}</p>

                <h3 className="text-3xl font-bold mt-1 text-gray-800">
                  {item.value}
                </h3>
              </div>

              <div className={`p-3 rounded-xl ${item.bg}`}>
                <Icon size={22} className={item.color} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* MAIN GRID */}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* COURSE PROGRESS */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="
          bg-white
          border border-purple-200
          rounded-2xl
          p-7
          shadow-sm
          hover:shadow-lg
          transition
          "
        >
          <h2 className="text-lg font-semibold mb-6 text-gray-800">
            Course Progress
          </h2>

          <div className="space-y-6">
            {progressCourses.map((course, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700">{course.name}</span>

                  <span className="text-purple-600 font-medium">
                    {course.progress}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${course.progress}%`,
                    }}
                    transition={{ duration: 1 }}
                    className="
                    bg-gradient-to-r
                    from-purple-500
                    to-indigo-500
                    h-2.5
                    rounded-full
                    "
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RECENT ACTIVITY */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="
          bg-white
          border border-purple-200
          rounded-2xl
          p-7
          shadow-sm
          hover:shadow-lg
          transition
          "
        >
          <h2 className="text-lg font-semibold mb-6 text-gray-800">
            Recent Activity
          </h2>

          <div className="space-y-6">
            {activities.map((item, index) => (
              <div key={index} className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-2.5 h-2.5 bg-purple-500 rounded-full mt-2"></div>

                  <p className="text-sm text-gray-700">{item.text}</p>
                </div>

                <span className="text-xs text-gray-400">{item.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;
