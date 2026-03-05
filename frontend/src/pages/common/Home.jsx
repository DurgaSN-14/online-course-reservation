import { Link } from "react-router";
import { motion } from "framer-motion";
import { BookOpen, Star, Users, Clock, GraduationCap, Tag } from "lucide-react";
import coursesData from "../../data/courses.json";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#1a1a3a] to-[#0f0c29] text-white relative overflow-hidden">
      {/* Glow Background */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl -top-40 -left-40"></div>
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl -bottom-40 -right-40"></div>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-36 md:pt-40 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex justify-center mb-6">
            <BookOpen size={40} className="text-purple-500" />
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            Learn Without Limits.
          </h1>

          <p className="text-gray-400 mt-6 text-lg max-w-2xl mx-auto">
            Discover premium courses designed to boost your skills and elevate
            your career. Join thousands of learners on Learnify.
          </p>

          <div className="mt-10 flex justify-center gap-6">
            <Link
              to="/signup"
              className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] transition"
            >
              Get Started
            </Link>

            <Link
              to="/courses"
              className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/10 transition"
            >
              Browse Courses
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="relative px-10 z-10 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 text-center gap-10">
          {[
            { value: "10K+", label: "Active Students" },
            { value: "500+", label: "Premium Courses" },
            { value: "4.9 ★", label: "Average Rating" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl py-10"
            >
              <h3 className="text-4xl font-bold text-purple-400">
                {stat.value}
              </h3>
              <p className="text-gray-400 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* COURSE SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-semibold mb-12 text-center">
          Featured Courses 🚀
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {coursesData?.slice(0, 6).map((course, index) => (
            <motion.div
              key={course.title} // better key
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden transition duration-500"
            >
              {/* IMAGE */}
              <div className="relative overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-56 object-cover group-hover:scale-110 transition duration-700"
                />

                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 text-xs rounded-full bg-purple-600/80">
                  <Tag size={14} />
                  {course.category}
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-purple-400 transition">
                  {course.title}
                </h3>

                <p className="text-gray-400 text-sm line-clamp-2">
                  {course.description}
                </p>

                <div className="grid grid-cols-2 gap-y-3 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <Star size={14} className="text-yellow-400" />
                    <span>{course.averageRating}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    <span>{course.studentsEnrolled}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>{course.duration}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <GraduationCap size={14} />
                    <span>{course.level}</span>
                  </div>
                </div>

                <div className="border-t border-white/10"></div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-purple-400 font-semibold text-lg">
                    Free
                  </span>

                  {/* INTERNAL ROUTE FIXED */}
                  <Link
                    to={"/courses"}
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-sm font-medium hover:scale-105 transition"
                  >
                    View Course
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative z-10 text-center pb-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl py-16 px-6 max-w-4xl mx-auto shadow-[0_0_60px_rgba(139,92,246,0.15)]"
        >
          <h2 className="text-4xl font-bold mb-6">
            Ready to Upgrade Your Skills?
          </h2>

          <p className="text-gray-400 mb-8">
            Start learning today and transform your future with Learnify.
          </p>

          <Link
            to="/signup"
            className="px-10 py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:scale-105 hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] transition"
          >
            Join Learnify
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
