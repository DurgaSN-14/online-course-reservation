import { useEffect, useState } from "react";
import {
  Bell,
  Search,
  Sparkles,
  User,
  Book,
  CheckCheck,
  X,
} from "lucide-react";
import axiosInstance from "../../config/axios";
import { Link } from "react-router";
import { formatDistanceToNow } from "date-fns";

const InstructorTopbar = () => {
  // Search States
  const [search, setSearch] = useState("");
  const [results, setResults] = useState({ courses: [], students: [] });
  const [showResults, setShowResults] = useState(false);

  // Notification States
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);

  // 1. Handle Global Search (with Debounce)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (search.length > 2) {
        try {
          const { data } = await axiosInstance.get(
            `/instructor/search?query=${search}`,
          );
          setResults(data);
          setShowResults(true);
        } catch (err) {
          console.error("Search error:", err);
        }
      } else {
        setShowResults(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // 2. Fetch Notifications
  const fetchNotifications = async () => {
    try {
      const { data } = await axiosInstance.get("/instructor/notifications");
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Auto-refresh every minute
    return () => clearInterval(interval);
  }, []);

  // 3. Mark Notifications as Read
  const handleMarkAllRead = async () => {
    try {
      await axiosInstance.patch("/instructor/notifications/mark-read");
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark all read");
    }
  };

  const handleMarkOneRead = async (id) => {
    try {
      await axiosInstance.patch(`/instructor/notifications/mark-read/${id}`);
      fetchNotifications();
    } catch (err) {
      console.error("Failed to update notification");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-gray-200/60">
      <div className="px-10 py-4 flex items-center justify-between relative">
        {/* LEFT SECTION */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="text-indigo-600" size={20} />
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              Workspace
            </h1>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Growth & Insight
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-6">
          {/* SEARCHBAR CONTAINER */}
          <div className="relative hidden lg:block">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students, courses..."
              className="w-80 pl-11 pr-5 py-2.5 rounded-2xl bg-white/80 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all shadow-sm"
              onFocus={() => search.length > 2 && setShowResults(true)}
            />

            {/* SEARCH RESULTS DROPDOWN */}
            {showResults && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-[1.5rem] shadow-2xl border border-gray-100 p-2 overflow-hidden z-50">
                <div className="flex justify-between items-center px-3 py-2 border-b border-slate-50 mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Results
                  </span>
                  <X
                    size={14}
                    className="text-slate-400 cursor-pointer hover:text-red-500"
                    onClick={() => setShowResults(false)}
                  />
                </div>

                {results.courses.length > 0 && (
                  <div className="mb-2">
                    <p className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase">
                      Courses
                    </p>
                    {results.courses.map((c) => (
                      <Link
                        key={c._id}
                        to={`/instructor/courses/${c._id}/manage`}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-indigo-50 rounded-xl transition-colors group"
                      >
                        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <Book size={14} />
                        </div>
                        <span className="text-sm font-semibold text-slate-700">
                          {c.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                {results.students.length > 0 && (
                  <div>
                    <p className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase">
                      Students
                    </p>
                    {results.students.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 rounded-xl transition-colors group"
                      >
                        <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          <User size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            {s.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {s.course}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {results.courses.length === 0 &&
                  results.students.length === 0 && (
                    <div className="py-4 text-center text-slate-400 text-xs font-medium">
                      No matches found
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* NOTIFICATIONS DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 flex items-center justify-center bg-indigo-600 text-[9px] font-bold text-white rounded-full border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotif && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-4 z-50 overflow-hidden">
                <div className="flex justify-between items-center mb-4 px-2">
                  <h3 className="font-bold text-slate-800">Activity</h3>
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter flex items-center gap-1 hover:opacity-70 transition-opacity"
                  >
                    <CheckCheck size={14} /> Mark all read
                  </button>
                </div>

                <div className="space-y-1 max-h-96 overflow-y-auto no-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        onClick={() => !n.isRead && handleMarkOneRead(n._id)}
                        className={`p-4 rounded-2xl transition-all cursor-pointer border border-transparent ${
                          !n.isRead
                            ? "bg-indigo-50/40 border-indigo-100/50"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <p
                          className={`text-xs leading-tight ${!n.isRead ? "font-bold text-slate-800" : "text-slate-500"}`}
                        >
                          {n.message}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-2 font-medium">
                          {formatDistanceToNow(new Date(n.createdAt))} ago
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center text-slate-400 text-xs font-medium">
                      All caught up!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default InstructorTopbar;
