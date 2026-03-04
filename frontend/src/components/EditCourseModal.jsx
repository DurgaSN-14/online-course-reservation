import { useState } from "react";
import { motion } from "framer-motion";
import { ImagePlus, X } from "lucide-react";
import { useCourseStore } from "../store/useCourseStore";

const EditCourseModal = ({ course, close, courseId }) => {
  const { updateCourse } = useCourseStore();

  const [form, setForm] = useState({
    title: course.title || "",
    description: course.description || "",
    category: course.category || "",
    duration: course.duration || "",
    level: course.level || "beginner",
    fee: course.fee || "",
    discount: course.discount || "",
    image: "",
  });

  const [preview, setPreview] = useState(course.image);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm({ ...form, image: reader.result });
      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    const res = await updateCourse(courseId, form);
    if (res.success) close();
  };

  const inputStyle =
    "w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none transition";

  const labelStyle = "text-sm font-medium text-gray-600 mb-1 block";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-white w-[700px] max-h-[95vh] rounded-2xl shadow-2xl flex flex-col"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-purple-300">
          <h2 className="text-xl font-semibold text-gray-800">Edit Course</h2>

          <button
            onClick={close}
            className="p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* IMAGE */}
          <div>
            <label className={labelStyle}>Course Image</label>

            <div className="relative group overflow-hidden rounded-xl border border-gray-200">
              {preview && (
                <img
                  src={preview}
                  alt="Course preview"
                  className="w-full h-44 object-cover select-none"
                />
              )}

              <label className="absolute bottom-3 right-3 bg-white shadow-md px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer text-sm hover:bg-gray-100 transition">
                <ImagePlus size={16} />
                Change Image
                <input type="file" hidden onChange={handleImage} />
              </label>
            </div>
          </div>

          {/* TITLE */}
          <div>
            <label className={labelStyle}>Course Title</label>

            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputStyle}
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className={labelStyle}>Description</label>

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows="3"
              className={inputStyle}
            />
          </div>

          {/* CATEGORY + DURATION */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Category</label>

              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Duration</label>

              <input
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className={inputStyle}
              />
            </div>
          </div>

          {/* LEVEL + FEE */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Course Level</label>

              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className={inputStyle}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className={labelStyle}>Course Fee (₹)</label>

              <input
                type="number"
                value={form.fee}
                onChange={(e) => setForm({ ...form, fee: e.target.value })}
                className={inputStyle}
              />
            </div>
          </div>

          {/* DISCOUNT */}
          <div>
            <label className={labelStyle}>Discount (%)</label>

            <input
              type="number"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
              className={inputStyle}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-5 border-t border-purple-300 bg-gray-50">
          <button
            onClick={close}
            className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg cursor-pointer hover:shadow-lg transition"
          >
            Update Course
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditCourseModal;
