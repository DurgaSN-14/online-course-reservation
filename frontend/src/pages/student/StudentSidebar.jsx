import { Link, NavLink } from "react-router";
import {
  LayoutDashboard,
  BookOpen,
  User,
  LogOut,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/useAuthStore";

const StudentSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();

  const navItems = [
    { name: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
    { name: "My Learning", path: "/student/my-courses", icon: BookOpen },
    { name: "Profile", path: "/student/profile", icon: User },
    { name: "Settings", path: "/student/settings", icon: Settings },
  ];

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.25 }}
      className="h-screen sticky top-0 flex flex-col justify-between
      bg-gradient-to-b from-[#0f0c29] via-[#171636] to-[#0f0c29]
      border-r border-white/10 shadow-2xl text-white"
    >
      {/* TOP */}
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Link to="/courses" className="flex items-center gap-3">
              <BookOpen size={28} className="text-purple-400" />
              {!collapsed && (
                <h1 className="text-2xl font-extrabold leading-tight bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                  Learnify
                </h1>
              )}
            </Link>
          </div>

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

        {/* NAV */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink key={item.name} to={item.path}>
                {({ isActive }) => (
                  <div
                    className={`
                    relative flex items-center
                    ${collapsed ? "justify-center" : "gap-4 px-4"}
                    py-3 rounded-xl cursor-pointer mb-2
                    transition-all duration-300 group
                    
                    ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg"
                        : "hover:bg-white/10"
                    }
                  `}
                  >
                    {/* glow indicator */}
                    {isActive && (
                      <div className="absolute left-0 w-1 h-8 bg-purple-400 rounded-r-lg shadow-[0_0_10px_#a855f7]" />
                    )}

                    <Icon
                      size={22}
                      className="shrink-0 group-hover:scale-110 transition"
                    />

                    {!collapsed && (
                      <span className="font-medium">{item.name}</span>
                    )}

                    {/* tooltip when collapsed */}
                    {collapsed && (
                      <span
                        className="absolute left-16 scale-0 group-hover:scale-100
                        bg-black text-xs px-2 py-1 rounded-md whitespace-nowrap
                        transition"
                      >
                        {item.name}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* USER SECTION */}
        <div className="border-t border-white/10 p-4">
          {!collapsed && (
            <div className="flex items-center gap-3 mb-2">
              <img
                src="https://i.pravatar.cc/40"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm font-medium">
                  {user?.username || "Student"}
                </p>
                <p className="text-xs text-gray-400">
                  {user?.email || "student@email.com"}
                </p>
              </div>
            </div>
          )}

          <button
            className={`flex items-center cursor-pointer ${
              collapsed ? "justify-center" : "gap-3 px-4"
            } w-full py-3 rounded-xl hover:bg-red-500/20 text-red-300 transition`}
            onClick={logout}
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default StudentSidebar;
