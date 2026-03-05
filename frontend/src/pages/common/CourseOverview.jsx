import { useEffect, useState, Fragment } from "react";
import { useNavigate, useParams } from "react-router";
import { Dialog, Transition } from "@headlessui/react";
import { useCourseStore } from "../../store/useCourseStore";

import {
  Star,
  Users,
  Clock,
  GraduationCap,
  PlayCircle,
  Lock,
  Video,
  FileText,
  File,
  ChevronDown,
  CheckCircle,
  X,
} from "lucide-react";

import Loader from "../../components/Loader";

const CourseOverview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    course,
    contents,
    purchased,
    fetchCourseById,
    fetchCourseContents,
    isLoading,
  } = useCourseStore();

  const [openIndex, setOpenIndex] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchCourseById(id);
    fetchCourseContents(id);
  }, [id]);

  if (isLoading || !course) return <Loader />;

  const getIcon = (type) => {
    if (type === "video") return <Video size={16} />;
    if (type === "pdf") return <FileText size={16} />;
    return <File size={16} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090918] via-[#12122a] to-[#090918] text-white">
      {/* ================= VIDEO MODAL ================= */}

      <Transition appear show={!!preview} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setPreview(null)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-6">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setPreview(null)}
              className="absolute top-8 right-56 z-50 bg-gray-200 backdrop-blur-md p-2 rounded-full hover:bg-gray-300 transition cursor-pointer"
            >
              <X size={20} />
            </button>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="scale-95 opacity-0"
              enterTo="scale-100 opacity-100"
              leave="ease-in duration-200"
              leaveFrom="scale-100 opacity-100"
              leaveTo="scale-95 opacity-0"
            >
              <Dialog.Panel className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl">
                {preview?.type === "video" && (
                  <video
                    src={preview.url}
                    controls
                    controlsList="nodownload noplaybackrate"
                    disablePictureInPicture
                    autoPlay
                    className="w-full rounded-2xl"
                  />
                )}

                {(preview?.type === "pdf" || preview?.type === "document") && (
                  <iframe
                    src={preview.url}
                    className="w-full h-[650px] bg-white rounded-2xl"
                  />
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* ================= HERO ================= */}

      <section className="max-w-7xl mx-auto px-6 pt-28 pb-16 grid lg:grid-cols-[1fr_380px] gap-14">
        {/* LEFT SIDE */}

        <div className="space-y-7">
          <span className="px-3 py-1 text-xs bg-purple-600/20 text-purple-400 rounded-full">
            {course.category}
          </span>

          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            {course.title}
          </h1>

          <p className="text-gray-400 text-lg max-w-3xl">
            {course.description}
          </p>

          {/* STATS */}

          <div className="flex flex-wrap gap-6 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <Star size={18} className="text-yellow-400" />
              {course.averageRating?.toFixed(1) || "4.5"}
            </div>

            <div className="flex items-center gap-2">
              <Users size={18} />
              {course.studentsEnrolled} students
            </div>

            <div className="flex items-center gap-2">
              <Clock size={18} />
              {course.duration}
            </div>

            <div className="flex items-center gap-2">
              <GraduationCap size={18} />
              {course.level}
            </div>
          </div>

          {/* INSTRUCTOR */}

          <div className="flex items-center gap-4 pt-6 border-t border-white/10">
            <img
              src={course.instructor?.profilePic || "https://i.pravatar.cc/100"}
              className="w-12 h-12 rounded-full"
            />

            <div>
              <p className="text-sm text-gray-400">Instructor</p>
              <p className="font-semibold">{course.instructor?.username}</p>
            </div>
          </div>

          {/* WHAT YOU'LL LEARN */}

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-xl font-semibold mb-4">What you'll learn</h2>

            <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-300">
              {course.learningPoints?.map((point, i) => (
                <div key={i} className="flex gap-2">
                  <CheckCircle size={16} className="text-green-400 mt-[2px]" />
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PURCHASE CARD */}

        <div className="sticky top-28 h-fit">
          <div className="bg-[#161633] border border-white/10 rounded-2xl overflow-hidden shadow-xl backdrop-blur-lg">
            <img src={course.image} className="w-full h-52 object-cover" />

            <div className="p-6 space-y-5">
              <div className="text-3xl font-bold text-purple-400">
                ₹ {course.finalFee}
              </div>

              {purchased ? (
                <button
                  onClick={() => navigate(`/student/my-courses/${course._id}`)}
                  className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 transition font-semibold shadow-lg cursor-pointer"
                >
                  Continue Learning
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/checkout/${course._id}`)}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition font-semibold shadow-lg cursor-pointer"
                >
                  Enroll Now
                </button>
              )}

              <div className="border-t border-white/10 pt-4 text-sm text-gray-400 space-y-2">
                <div className="flex justify-between">
                  <span>Duration</span>
                  <span>{course.duration}</span>
                </div>

                <div className="flex justify-between">
                  <span>Lectures</span>
                  <span>{course.totalLectures}</span>
                </div>

                <div className="flex justify-between">
                  <span>Level</span>
                  <span>{course.level}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CURRICULUM ================= */}

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-semibold mb-6">Course Curriculum</h2>

        <div className="border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/10">
          {contents.map((lecture, index) => {
            const locked = !lecture.isFreePreview && !purchased;

            return (
              <div
                key={lecture._id}
                className="p-5 hover:bg-white/5 transition"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {locked ? (
                      <Lock size={16} className="text-gray-400" />
                    ) : (
                      getIcon(lecture.type)
                    )}

                    <span className="text-sm font-medium">
                      {index + 1}. {lecture.title}
                    </span>

                    {lecture.isFreePreview && (
                      <span className="text-xs bg-green-600/20 text-green-400 px-2 py-[2px] rounded">
                        Preview
                      </span>
                    )}
                  </div>

                  <ChevronDown
                    size={18}
                    className={`transition ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openIndex === index && (
                  <div className="mt-4 text-sm text-gray-400 space-y-3">
                    <p>{lecture.description}</p>

                    {!locked && lecture.contentUrl && (
                      <button
                        onClick={() =>
                          setPreview({
                            url: lecture.contentUrl,
                            type: lecture.type,
                          })
                        }
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-medium px-4 py-2 rounded-full hover:shadow-lg transition-all duration-200 cursor-pointer"
                      >
                        <PlayCircle size={14} />
                        Preview Lecture
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default CourseOverview;
