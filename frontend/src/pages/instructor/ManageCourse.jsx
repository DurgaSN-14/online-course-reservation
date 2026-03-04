import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  BookOpen,
  Pencil,
  Plus,
  Trash2,
  FileVideo,
  FileText,
  Link,
} from "lucide-react";

import { useCourseStore } from "../../store/useCourseStore";
import EditCourseModal from "../../components/EditCourseModal";
import EditLectureModal from "../../components/EditLectureModal";

const ManageCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const {
    fetchCourseById,
    deleteCourse,
    deleteCourseContent,
    course,
    contents,
  } = useCourseStore();

  const [editCourseOpen, setEditCourseOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);

  useEffect(() => {
    fetchCourseById(courseId);
  }, [courseId]);

  const handleDeleteLecture = async (id) => {
    if (!confirm("Delete lecture?")) return;

    const res = await deleteCourseContent(id);

    if (res.success) {
      fetchCourseById(courseId);
    }
  };

  const handleDeleteCourse = async () => {
    if (!confirm("Delete course permanently?")) return;

    const res = await deleteCourse(courseId);

    if (res.success) {
      navigate("/instructor/courses");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <BookOpen className="text-purple-600" />
          <h1 className="text-2xl font-semibold">Manage Course</h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() =>
              navigate(`/instructor/courses/${courseId}/add-content`)
            }
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white cursor-pointer hover:bg-purple-700 transition"
          >
            <Plus size={16} />
            Add Lecture
          </button>

          <button
            onClick={() => setEditCourseOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border rounded-xl cursor-pointer hover:bg-gray-200 transition"
          >
            <Pencil size={16} />
            Edit Course
          </button>

          <button
            onClick={handleDeleteCourse}
            className="flex items-center gap-2 px-4 py-2 border text-red-500 rounded-xl cursor-pointer hover:bg-red-100 transition"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* COURSE DETAILS */}
      <div className="bg-white rounded-2xl shadow p-6 flex gap-6">
        <img
          src={course?.image}
          className="w-48 h-28 object-cover rounded-lg"
        />

        <div>
          <h2 className="text-xl font-semibold">{course?.title}</h2>
          <p className="text-gray-500 text-sm">{course?.description}</p>

          <div className="flex gap-5 mt-3 text-sm text-gray-500">
            <span>Category: {course?.category}</span>
            <span>Duration: {course?.duration}</span>
            <span>Lectures: {contents?.length}</span>
          </div>
        </div>
      </div>

      {/* LECTURES */}
      {/* LECTURES */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Course Lectures</h2>

        {contents?.map((lecture, index) => (
          <motion.div
            key={lecture._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-between items-center bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
          >
            <div className="flex gap-4 items-start">
              {/* Thumbnail */}
              <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
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
                    {lecture.type === "youtube" && <Link size={18} />}
                  </>
                )}
              </div>

              {/* Lecture Info */}
              <div className="flex flex-col">
                <h3 className="font-medium text-gray-800">
                  {index + 1}. {lecture.title}
                </h3>

                {lecture.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 max-w-md">
                    {lecture.description}
                  </p>
                )}

                <div className="text-xs text-gray-500 flex gap-3 mt-1">
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedLecture(lecture)}
                className="p-2 rounded-lg border border-purple-300 hover:bg-gray-100 transition cursor-pointer"
              >
                <Pencil size={16} className="text-gray-600" />
              </button>

              <button
                onClick={() => handleDeleteLecture(lecture._id)}
                className="p-2 rounded-lg border border-red-300 hover:bg-red-50 transition cursor-pointer"
              >
                <Trash2 size={16} className="text-red-500" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {editCourseOpen && (
        <EditCourseModal
          course={course}
          close={() => setEditCourseOpen(false)}
          courseId={courseId}
        />
      )}

      {selectedLecture && (
        <EditLectureModal
          lecture={selectedLecture}
          close={() => setSelectedLecture(null)}
        />
      )}
    </div>
  );
};

export default ManageCourse;
