import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, Camera, Save, ShieldAlert, Trash2 } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore"; // Adjust import path
import toast from "react-hot-toast";

const InstructorSettings = () => {
  const { user, updateProfile, changePassword } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  // Form States
  const [profileForm, setProfileForm] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
    image: null,
  });
  const [preview, setPreview] = useState(user?.profilePic || "");

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setProfileForm({ ...profileForm, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const onUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateProfile(profileForm);
    setLoading(false);
  };

  const onChangePass = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    setLoading(true);
    const success = await changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
    if (success)
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    setLoading(false);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm";
  const labelClass =
    "block text-xs font-black text-slate-400 uppercase tracking-widest mb-2";

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          Settings
        </h1>
        <p className="text-slate-500">
          Manage your account preferences and instructor profile.
        </p>
      </div>

      <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeTab === "profile" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          <User size={18} /> Public Profile
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeTab === "security" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          <Lock size={18} /> Security
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "profile" ? (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
          >
            <form onSubmit={onUpdateProfile} className="p-8 md:p-12 space-y-8">
              <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-slate-50 shadow-inner">
                    <img
                      src={preview || "https://via.placeholder.com/150"}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="absolute -bottom-2 -right-2 p-3 bg-indigo-600 text-white rounded-2xl shadow-xl cursor-pointer hover:bg-indigo-700 transition-all scale-90 group-hover:scale-100">
                    <Camera size={20} />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <h3 className="text-xl font-bold text-slate-800">
                    Profile Picture
                  </h3>
                  <p className="text-sm text-slate-400">
                    JPG, GIF or PNG. Max size of 2MB.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-6">
                <div className="space-y-1">
                  <label className={labelClass}>Username</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={profileForm.username}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        username: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Email Address</label>
                  <input
                    type="email"
                    disabled
                    className={`${inputClass} bg-slate-50 text-slate-400 cursor-not-allowed`}
                    value={user?.email}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClass}>Instructor Bio</label>
                <textarea
                  rows={4}
                  className={inputClass}
                  placeholder="Tell your students about your expertise..."
                  value={profileForm.bio}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, bio: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95  cursor-pointer disabled:bg-indigo-300 disabled:cursor-not-allowed"
              >
                <Save size={18} /> {loading ? "Updating..." : "Save Profile"}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-12">
              <form onSubmit={onChangePass} className="max-w-md space-y-6">
                <div className="space-y-1">
                  <label className={labelClass}>Current Password</label>
                  <input
                    type="password"
                    className={inputClass}
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>New Password</label>
                  <input
                    type="password"
                    className={inputClass}
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Confirm New Password</label>
                  <input
                    type="password"
                    className={inputClass}
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  Update Password
                </button>
              </form>
            </div>

            <div className="bg-red-50/50 rounded-[2.5rem] border border-red-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                  <ShieldAlert />
                </div>
                <div>
                  <h4 className="font-bold text-red-900">Deactivate Account</h4>
                  <p className="text-sm text-red-700/70">
                    Once you deactivate, your courses will be hidden from
                    students.
                  </p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-200 cursor-pointer disabled:bg-red-300 disabled:cursor-not-allowed">
                <Trash2 size={18} /> Deactivate
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InstructorSettings;
