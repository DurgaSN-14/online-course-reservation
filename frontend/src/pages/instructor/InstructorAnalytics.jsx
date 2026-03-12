import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Download,
  BarChart3,
  PieChart as PieIcon,
} from "lucide-react";
import { useCourseStore } from "../../store/useCourseStore";
import Loader from "../../components/Loader";

const COLORS = ["#6366f1", "#a855f7", "#ec4899", "#f59e0b"];

const InstructorAnalytics = () => {
  const { instructorStats, fetchInstructorStats, isLoading } = useCourseStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    fetchInstructorStats();
    // Delay the chart rendering slightly to ensure container dimensions are stable
    const timer = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(timer);
  }, [fetchInstructorStats]);

  if (isLoading || !instructorStats) return <Loader />;

  const chartData = instructorStats.coursePerformance.map((item) => ({
    name:
      item.name.length > 12 ? item.name.substring(0, 10) + "..." : item.name,
    students: item.students,
  }));

  const totalStudents = chartData.reduce((acc, curr) => acc + curr.students, 0);

  return (
    <div className="space-y-8 min-h-screen">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Analytics Overview
          </h1>
          <p className="text-slate-500 font-medium">
            Monitor your course performance and student engagement.
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm cursor-pointer">
          <Download size={18} className="text-indigo-600" /> Export Dataset
        </button>
      </header>

      {/* METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {instructorStats.stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1">
              {stat.title}
            </p>
            <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
            <div className="mt-3 flex items-center gap-1.5 text-emerald-600 font-bold text-[11px] bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
              <TrendingUp size={12} /> +12.5%
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* AREA CHART */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[450px]"
        >
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <BarChart3 size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Enrollment Growth</h3>
            </div>
          </div>

          <div className="w-full h-[320px]">
            {isReady && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 0, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorStudents"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: "#64748b" }}
                    dy={15}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: "#64748b" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "20px",
                      border: "none",
                      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="#6366f1"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorStudents)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* PIE CHART */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col min-h-[450px]"
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <PieIcon size={20} />
            </div>
            <h3 className="font-bold text-slate-800">Distribution</h3>
          </div>

          <div className="relative w-full h-[250px]">
            {isReady && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius="70%"
                    outerRadius="95%"
                    paddingAngle={8}
                    dataKey="students"
                    stroke="none"
                  >
                    {chartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                Total
              </span>
              <span className="text-2xl font-black text-slate-800">
                {totalStudents}
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-3 overflow-y-auto no-scrollbar">
            {chartData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="text-xs font-bold text-slate-600">
                    {item.name}
                  </span>
                </div>
                <span className="text-xs font-black text-slate-800">
                  {item.students}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InstructorAnalytics;
