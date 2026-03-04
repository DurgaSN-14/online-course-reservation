import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCourseStore } from "../../store/useCourseStore";
import { UploadCloud } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import FormInput from "../../components/FormInput";
import toast from "react-hot-toast";

const courseSchema = z.object({
  title: z.string().min(3, "Title required"),
  description: z.string().min(10, "Description too short"),
  category: z.string().min(2, "Category required"),
  duration: z.string().min(1, "Duration required"),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  fee: z.string().min(1, "Fee required"),
  discount: z.string().optional(),
  image: z.string().min(1, "Course image is required"),
});

const CreateCourse = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const { createCourse, isLoading, error } = useCourseStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: { level: "Beginner", image: "" },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
      setPreview(reader.result);

      setValue("image", reader.result); // register image in form
    };

    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    const res = await createCourse(data);

    if (res.success) {
      toast.success("Course created successfully!");
      reset();
      setImage(null);
      setPreview(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100"
      >
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          Create New Course
        </h1>
        <p className="text-gray-500 mb-8 text-sm">
          Fill in the details below to publish your course.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* TITLE */}
          <FormInput
            label="Course Title"
            placeholder="React Mastery"
            error={errors.title}
            variant="light"
            {...register("title")}
          />

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm text-gray-600 font-medium mb-1 block">
              Description
            </label>

            <textarea
              {...register("description")}
              rows={4}
              className={`w-full px-4 py-3 rounded-xl bg-white border outline-none resize-none
            ${
              errors.description
                ? "border-red-500"
                : "border-gray-200 focus:border-purple-500"
            }`}
            />

            {errors.description && (
              <p className="text-xs text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* CATEGORY + DURATION */}
          <div className="grid md:grid-cols-2 gap-6">
            <FormInput
              label="Category"
              placeholder="Web Development"
              error={errors.category}
              variant="light"
              {...register("category")}
            />

            <FormInput
              label="Duration"
              placeholder="10 hours"
              error={errors.duration}
              variant="light"
              {...register("duration")}
            />
          </div>

          {/* LEVEL */}
          <div>
            <label className="text-sm text-gray-600 font-medium mb-1 block">
              Level
            </label>

            <select
              {...register("level")}
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-purple-500 outline-none"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          {/* FEE + DISCOUNT */}
          <div className="grid md:grid-cols-2 gap-6">
            <FormInput
              label="Course Fee"
              type="number"
              error={errors.fee}
              variant="light"
              {...register("fee")}
            />

            <FormInput
              label="Discount (%)"
              type="number"
              variant="light"
              {...register("discount")}
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            {!preview ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-purple-500 transition bg-gray-50">
                <UploadCloud size={32} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  Click to upload course image
                </span>

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </label>
            ) : (
              <div className="relative group">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-64 object-cover rounded-xl shadow-md"
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center gap-4">
                  <label className="px-4 py-2 bg-white text-sm rounded-lg cursor-pointer">
                    Change
                    <input type="file" hidden onChange={handleImageChange} />
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setPreview(null);
                    }}
                    className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {errors.image && (
              <p className="text-red-500 text-sm mt-2">
                {errors.image.message}
              </p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* SUBMIT */}
          <button
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-semibold text-white
          bg-gradient-to-r from-purple-600 to-indigo-600
          hover:shadow-xl transition cursor-pointer"
          >
            {isLoading ? "Creating Course..." : "Create Course"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateCourse;
