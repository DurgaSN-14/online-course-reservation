import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, X } from "lucide-react";
import { useCourseStore } from "../store/useCourseStore";

const EditLectureModal = ({ lecture, close }) => {
  const { updateCourseContent } = useCourseStore();

  const [form, setForm] = useState({
    title: lecture.title,
    description: lecture.description || "",
    type: lecture.type,
    contentUrl: lecture.contentUrl,
    order: lecture.order,
    maxMarks: lecture.maxMarks,
    weightage: lecture.weightage,
    isFreePreview: lecture.isFreePreview,
  });

  const [thumbnail, setThumbnail] = useState(lecture.thumbnail);
  const [contentFile, setContentFile] = useState(null);
  const [contentPreview, setContentPreview] = useState(lecture.contentUrl);

  const getAcceptType = () => {
    if (form.type === "video") return "video/*";
    if (form.type === "pdf") return "application/pdf";
    if (form.type === "document") return ".doc,.docx,.txt";
    if (form.type === "assignment") return ".pdf,.doc,.docx";
    return "*";
  };

  const handleThumb = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setThumbnail(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const requiresUrl = ["youtube", "quiz"].includes(form.type);

  const handleContentUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setContentFile(reader.result);
      setContentPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const removeContent = () => {
    setContentFile(null);
    setContentPreview(null);

    setForm({
      ...form,
      contentUrl: "",
    });
  };
  const handleUpdate = async () => {
    const res = await updateCourseContent(lecture._id, {
      ...form,
      contentFile,
      thumbnailFile: thumbnail,
    });

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
        className="bg-white w-[720px] max-h-[95vh] rounded-2xl shadow-2xl flex flex-col"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-purple-300">
          <h2 className="text-xl font-semibold text-gray-800">Edit Lecture</h2>

          <button
            onClick={close}
            className="p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* THUMBNAIL */}
          <div>
            <label className={labelStyle}>Lecture Thumbnail</label>

            <div className="relative group overflow-hidden rounded-xl border border-gray-200">
              {thumbnail && (
                <img
                  src={thumbnail}
                  alt="Thumbnail"
                  className="w-full h-40 object-cover"
                />
              )}

              <label className="absolute bottom-3 right-3 bg-white shadow-md px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer text-sm hover:bg-gray-100 transition">
                <UploadCloud size={16} />
                Change Thumbnail
                <input hidden type="file" onChange={handleThumb} />
              </label>
            </div>
          </div>

          {/* TITLE */}
          <div>
            <label className={labelStyle}>Lecture Title</label>

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

          {/* TYPE */}
          <div>
            <label className={labelStyle}>Content Type</label>

            <select
              value={form.type}
              onChange={(e) => {
                const newType = e.target.value;

                setForm({
                  ...form,
                  type: newType,
                  contentUrl: "",
                });

                setContentFile(null);
                setContentPreview(null);
              }}
              className={inputStyle}
            >
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
              <option value="document">Document</option>
              <option value="youtube">YouTube</option>
              <option value="quiz">Quiz</option>
              <option value="assignment">Assignment</option>
            </select>
          </div>

          {/* CONTENT */}
          <div>
            <label className={labelStyle}>Lecture Content</label>

            {requiresUrl ? (
              <input
                value={form.contentUrl || ""}
                onChange={(e) =>
                  setForm({ ...form, contentUrl: e.target.value })
                }
                placeholder={
                  form.type === "youtube"
                    ? "Paste YouTube video URL"
                    : "Paste quiz URL"
                }
                className={inputStyle}
              />
            ) : (
              <>
                {contentPreview && (
                  <div className="space-y-3">
                    {form.type === "video" && (
                      <video
                        controls
                        src={contentPreview}
                        className="w-full rounded-xl border"
                      />
                    )}

                    {form.type === "pdf" && (
                      <iframe
                        src={contentPreview}
                        className="w-full h-60 rounded-xl border"
                      />
                    )}

                    <button
                      onClick={removeContent}
                      type="button"
                      className="text-white text-sm bg-red-500 hover:bg-red-600 rounded-full px-3 py-1 cursor-pointer"
                    >
                      Remove Content
                    </button>
                  </div>
                )}

                <label className="mt-3 border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center cursor-pointer hover:border-purple-500 transition">
                  <UploadCloud size={24} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">
                    Upload {form.type} file
                  </span>

                  <input
                    hidden
                    type="file"
                    accept={getAcceptType()}
                    onChange={handleContentUpload}
                  />
                </label>
              </>
            )}
          </div>

          {/* SETTINGS */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelStyle}>Lecture Order</label>

              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Max Marks</label>

              <input
                type="number"
                value={form.maxMarks}
                onChange={(e) => setForm({ ...form, maxMarks: e.target.value })}
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Weightage %</label>

              <input
                type="number"
                value={form.weightage}
                onChange={(e) =>
                  setForm({ ...form, weightage: e.target.value })
                }
                className={inputStyle}
              />
            </div>
          </div>

          {/* FREE PREVIEW */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="isFreePreview"
              checked={form.isFreePreview}
              onChange={(e) =>
                setForm({ ...form, isFreePreview: e.target.checked })
              }
              className="w-4 h-4 accent-purple-600"
            />

            <label className="text-sm text-gray-600" htmlFor="isFreePreview">
              Allow Free Preview
            </label>
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
            onClick={handleUpdate}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition cursor-pointer"
          >
            Update Lecture
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditLectureModal;
