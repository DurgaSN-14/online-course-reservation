import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Star,
  Users,
  Clock,
  GraduationCap,
  Tag,
  ArrowRight,
} from "lucide-react";
import coursesData from "../../data/courses.json";
import { useCourseStore } from "../../store/useCourseStore";
import { useEffect } from "react";
import Loader from "../../components/Loader";
import { Link } from "react-router";

const Courses = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const { courses, getAllCourses, isLoading } = useCourseStore();

  useEffect(() => {
    getAllCourses();
  }, []);

  const allCourses = [...courses, ...coursesData];

  const categories = [
    "All",
    ...new Set(allCourses.map((course) => course.category)),
  ];

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch =
      course.title?.toLowerCase().includes(search.toLowerCase()) ||
      course.headline?.toLowerCase().includes(search.toLowerCase()) ||
      course.description?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === "All" || course.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b1f] via-[#12122a] to-[#0b0b1f] text-white relative overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-3xl -top-60 -left-60"></div>
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl -bottom-60 -right-60"></div>

      {/* HEADER */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-5xl font-bold tracking-tight mb-4">
              Discover Premium Courses
            </h1>
            <p className="text-gray-400 max-w-2xl">
              Explore curated learning experiences designed to elevate your
              skills and accelerate your growth.
            </p>
          </div>

          {/* Search + Filter */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between shadow-xl">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full bg-white/5 border border-white/10 focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-3">
              {categories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm transition-all duration-300 cursor-pointer ${
                    category === cat
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-600/40"
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* COURSES GRID */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-28">
        {isLoading && <Loader />}

        {!isLoading && filteredCourses.length === 0 ? (
          <div className="text-center py-24 space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Search size={28} className="text-gray-400" />
            </div>
            <p className="text-gray-400 text-lg">
              No courses match your search.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course._id || course.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden transition duration-500 hover:shadow-2xl hover:shadow-purple-600/30"
              >
                {/* Accent Gradient Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition"></div>

                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-56 object-cover group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 text-xs rounded-full bg-purple-600/90 backdrop-blur-md">
                    <Tag size={14} />
                    {course.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                  <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-purple-400 transition">
                    {course.title}
                  </h3>

                  <p className="text-gray-400 text-sm line-clamp-2">
                    {course.description}
                  </p>

                  {/* Meta */}
                  <div className="grid grid-cols-2 gap-y-4 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <Star size={14} className="text-yellow-400" />
                      {course.averageRating}
                    </div>

                    <div className="flex items-center gap-2">
                      <Users size={14} />
                      {course.studentsEnrolled}
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      {course.duration}
                    </div>

                    <div className="flex items-center gap-2">
                      <GraduationCap size={14} />
                      {course.level}
                    </div>
                  </div>

                  <div className="border-t border-white/10"></div>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-3">
                    <span className="text-purple-400 font-semibold text-lg">
                      {course.price === 0 ? "Free" : `₹ ${course.finalFee}`}
                    </span>

                    <Link to={`/courseoverview/${course._id}`}>
                      <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-sm font-medium hover:scale-105 hover:shadow-lg hover:shadow-purple-600/40 transition cursor-pointer">
                        View
                        <ArrowRight size={16} />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Courses;
