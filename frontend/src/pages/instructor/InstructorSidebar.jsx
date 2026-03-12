import { Link, NavLink } from "react-router";
import {
  LayoutDashboard,
  BookOpen,
  Upload,
  BarChart3,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  GraduationCap,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/useAuthStore";

const InstructorSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();

  const navItems = [
    {
      name: "Dashboard",
      path: "/instructor/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Courses",
      path: "/instructor/courses",
      icon: BookOpen,
    },
    {
      name: "Create Course",
      path: "/instructor/create-course",
      icon: Upload,
    },
    {
      name: "Students",
      path: "/instructor/students",
      icon: Users,
    },
    {
      name: "Analytics",
      path: "/instructor/analytics",
      icon: BarChart3,
    },
    {
      name: "Settings",
      path: "/instructor/settings",
      icon: Settings,
    },
  ];

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.25 }}
      className="h-screen sticky top-0 flex flex-col justify-between
      bg-gradient-to-b from-[#0a0a1f] via-[#12123a] to-[#0a0a1f]
      border-r border-white/10 shadow-2xl text-white"
    >
      {/* TOP */}
      <div>
        {/* LOGO */}
        <div className="flex items-center justify-between px-3 md:px-5 py-4 border-b border-white/10">
          <Link to="/courses">
            <div className="flex items-center gap-3">
              <GraduationCap size={28} className="text-indigo-400" />

              {!collapsed && (
                <span className="text-lg font-semibold tracking-wide">
                  Instructor
                </span>
              )}
            </div>
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <ChevronLeft
              size={18}
              className={`transition ${collapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="px-2 md:px-3 py-5 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink key={item.name} to={item.path}>
                {({ isActive }) => (
                  <div
                    className={`
                    relative flex items-center
                    ${collapsed ? "justify-center" : "gap-4 px-4"}
                    py-3 rounded-xl transition-all duration-300 group
                    
                    ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg"
                        : "hover:bg-white/10"
                    }
                  `}
                  >
                    {/* active glow */}
                    {isActive && (
                      <div className="absolute left-0 w-1 h-8 bg-indigo-400 rounded-r-lg shadow-[0_0_12px_#6366f1]" />
                    )}

                    <Icon
                      size={22}
                      className="shrink-0 group-hover:scale-110 transition"
                    />

                    {!collapsed && (
                      <span className="font-medium">{item.name}</span>
                    )}

                    {/* tooltip */}
                    {collapsed && (
                      <span className="absolute left-16 scale-0 group-hover:scale-100 bg-black text-xs px-2 py-1 rounded-md transition whitespace-nowrap">
                        {item.name}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM USER */}
      <div className="border-t border-white/10 p-4">
        {!collapsed && (
          <div className="flex items-center gap-3 mb-4">
            <img
              src="https://i.pravatar.cc/40"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-medium">
                {user?.username || "Instructor"}
              </p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className={`flex items-center cursor-pointer ${
            collapsed ? "justify-center" : "gap-3 px-4"
          } w-full py-3 rounded-xl hover:bg-red-500/20 text-red-300 transition`}
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default InstructorSidebar;
