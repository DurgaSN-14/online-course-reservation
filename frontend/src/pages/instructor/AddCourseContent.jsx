import { useEffect, useState } from "react";
import { useCourseStore } from "../../store/useCourseStore";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UploadCloud,
  Trash2,
  FileVideo,
  FileText,
  Link as LinkIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import FormInput from "../../components/FormInput";
import toast from "react-hot-toast";

const contentSchema = z
  .object({
    title: z.string().min(3, "Lecture title required"),
    description: z
      .string()
      .min(5, "Description must be at least 5 characters")
      .optional(),
    type: z.enum(["video", "pdf", "document", "youtube", "quiz", "assignment"]),
    order: z.coerce.number().min(1, "Order must be at least 1"),
    maxMarks: z.string().optional(),
    weightage: z.string().optional(),
    contentUrl: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    isFreePreview: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (["youtube", "quiz"].includes(data.type)) {
        return !!data.contentUrl;
      }
      return true;
    },
    {
      message: "URL is required for YouTube or Quiz",
      path: ["contentUrl"],
    },
  );

const AddCourseContent = () => {
  const [deleteId, setDeleteId] = useState(null);
  const { courseId } = useParams();
  const navigate = useNavigate();

  const {
    addCourseContent,
    fetchCourseContents,
    deleteCourseContent,
    contents,
    isLoading,
  } = useCourseStore();

  const [file, setFile] = useState(null);
  const [previewName, setPreviewName] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      type: "video",
      order: 1,
      description: "",
      maxMarks: "",
      weightage: "",
      isFreePreview: false,
      contentUrl: "",
      thumbnailUrl: "",
    },
  });

  const selectedType = watch("type");
  const requiresUrl = ["youtube", "quiz"].includes(selectedType);

  useEffect(() => {
    if (courseId) fetchCourseContents(courseId);
  }, [courseId]);

  /* ---------- convert file ---------- */
  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  /* ---------- file change ---------- */
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreviewName(selected.name);
  };

  const handleThumbnailChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setThumbnail(reader.result);
      setThumbnailPreview(reader.result);
    };

    reader.readAsDataURL(selected);
  };

  /* ---------- submit ---------- */
  const onSubmit = async (data) => {
    if (requiresUrl && !data.contentUrl) {
      return toast.error("Please provide URL");
    }

    if (!requiresUrl && !file) {
      return toast.error("Please upload a file");
    }

    let base64File = null;
    if (file) base64File = await convertToBase64(file);

    const payload = {
      ...data,
      courseId,
      contentFile: base64File,
      thumbnailFile: thumbnail,
    };

    const res = await addCourseContent(payload);

    if (res.success) {
      toast.success("Lecture added 🎉");
      reset();
      setFile(null);
      setPreviewName("");
      setThumbnail(null);
      setThumbnailPreview(null);
      fetchCourseContents(courseId);
    }
  };

  const confirmDelete = async () => {
    const res = await deleteCourseContent(deleteId);

    if (res.success) {
      toast.success("Lecture deleted");
      fetchCourseContents(courseId);
    } else {
      toast.error("Delete failed");
    }

    setDeleteId(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* ================= FORM ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-lg border border-purple-500/40 p-10"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Add Course Lecture
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* ---------- BASIC INFO ---------- */}
          <div className="space-y-6">
            <FormInput
              label="Lecture Title"
              variant="light"
              error={errors.title}
              {...register("title")}
            />

            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Lecture Description
              </label>

              <textarea
                rows={3}
                {...register("description")}
                className="w-full outline-none px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500"
                placeholder="Enter lecture description"
              />

              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* TYPE */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Content Type
              </label>

              <select
                {...register("type")}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500"
              >
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
                <option value="document">Document</option>
                <option value="youtube">YouTube</option>
                <option value="quiz">Quiz</option>
                <option value="assignment">Assignment</option>
              </select>
            </div>
          </div>

          {/* ---------- FILE OR LINK ---------- */}
          {requiresUrl && (
            <FormInput
              label={
                selectedType === "youtube"
                  ? "YouTube Video URL"
                  : "Quiz Link URL"
              }
              variant="light"
              error={errors.contentUrl}
              {...register("contentUrl")}
            />
          )}

          {!requiresUrl && (
            <div>
              <label className="text-sm text-gray-600 mb-2 block">
                Upload Content
              </label>

              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-purple-500 bg-gray-50">
                <UploadCloud size={30} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  Upload {selectedType} file
                </span>

                <input type="file" hidden onChange={handleFileChange} />
              </label>

              {previewName && (
                <div className="mt-3 flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <FileVideo size={20} className="text-green-600" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700">
                        {previewName}
                      </span>
                      <span className="text-xs text-green-600">
                        File ready to upload
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPreviewName("");
                    }}
                    className="text-red-500 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ---------- THUMBNAIL UPLOAD ---------- */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">
              Thumbnail Image
            </label>

            {!thumbnailPreview ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-purple-500 bg-gray-50 transition">
                <UploadCloud size={28} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  Upload thumbnail image
                </span>

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleThumbnailChange}
                />
              </label>
            ) : (
              <div className="relative w-48">
                <img
                  src={thumbnailPreview}
                  alt="thumbnail preview"
                  className="rounded-xl shadow object-cover w-full h-28"
                />

                <button
                  type="button"
                  onClick={() => {
                    setThumbnail(null);
                    setThumbnailPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded cursor-pointer hover:bg-gray-600"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* ---------- LECTURE SETTINGS ---------- */}
          <div className="border-t border-purple-300 pt-6 space-y-6">
            <h3 className="font-semibold text-gray-800">Lecture Settings</h3>

            <div className="grid md:grid-cols-3 gap-6">
              <FormInput
                label="Lecture Order"
                type="number"
                variant="light"
                error={errors.order}
                {...register("order")}
              />

              <FormInput
                label="Max Marks (quiz only)"
                type="number"
                variant="light"
                {...register("maxMarks")}
              />

              <FormInput
                label="Weightage %"
                type="number"
                variant="light"
                {...register("weightage")}
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                id="isFreePreview"
                type="checkbox"
                {...register("isFreePreview")}
                className="w-4 h-4 accent-purple-600"
              />
              <label className="text-gray-600 text-sm" htmlFor="isFreePreview">
                Allow free preview
              </label>
            </div>
          </div>

          <button
            disabled={isLoading}
            className="w-full py-3 rounded-xl text-white font-semibold
            bg-gradient-to-r from-purple-600 to-indigo-600 cursor-pointer hover:shadow-xl transition cursor-pointer"
          >
            {isLoading ? "Uploading..." : "Add Lecture"}
          </button>
        </form>
      </motion.div>

      {/* ================= LECTURE LIST ================= */}
      <div>
        <h3 className="text-xl font-semibold mb-6 text-gray-800">
          Course Lectures ({contents?.length || 0})
        </h3>

        {contents?.length === 0 ? (
          <div className="bg-gray-50 p-10 rounded-2xl text-center text-gray-500">
            No lectures added yet
          </div>
        ) : (
          <div className="space-y-4">
            {contents.map((lecture, index) => (
              <motion.div
                key={lecture._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between bg-white rounded-2xl p-5 shadow hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    {lecture.thumbnail ? (
                      <img
                        src={lecture.thumbnail}
                        alt={lecture.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        {lecture.type === "video" && <FileVideo size={18} />}
                        {lecture.type === "pdf" && <FileText size={18} />}
                        {lecture.type === "document" && <FileText size={18} />}
                        {lecture.type === "youtube" && <LinkIcon size={18} />}
                        {lecture.type === "quiz" && <FileText size={18} />}
                        {lecture.type === "assignment" && (
                          <FileText size={18} />
                        )}
                      </>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {index + 1}. {lecture.title}
                    </h4>

                    {lecture.description && (
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {lecture.description}
                      </p>
                    )}

                    <div className="flex gap-3 mt-1 text-xs text-gray-500">
                      <span className="capitalize">{lecture.type}</span>
                      {lecture.isFreePreview && (
                        <span className="text-green-600 font-medium">
                          Free Preview
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      navigate(`/instructor/courses/${courseId}/manage`)
                    }
                    className="px-4 py-2 text-sm rounded-lg bg-purple-600 text-white cursor-pointer hover:bg-purple-700"
                  >
                    Manage
                  </button>

                  <button
                    onClick={() => setDeleteId(lecture._id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500 cursor-pointer transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[350px] shadow-xl">
            <h3 className="font-semibold text-lg mb-2">Delete Lecture?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg border cursor-pointer hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white cursor-pointer hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCourseContent;
