import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import dropin from "braintree-web-drop-in";
import { Lock, ShieldCheck } from "lucide-react";

import { useCourseStore } from "../../store/useCourseStore";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";

const Checkout = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const {
    fetchCourseById,
    course,
    reserveCourse,
    getClientToken,
    checkoutCourse,
  } = useCourseStore();

  const [clientToken, setClientToken] = useState(null);
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        setPageLoading(true);

        await fetchCourseById(courseId);

        const reservation = await reserveCourse(courseId);
        if (!reservation.success) return;

        const token = await getClientToken();

        if (!token) {
          // toast.error("Payment gateway failed to load");
          return;
        }

        setClientToken(token);
      } catch (err) {
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    };

    initialize();
  }, [courseId]);

  useEffect(() => {
    if (!clientToken) return;

    let dropinInstance;

    dropin.create(
      {
        authorization: clientToken,
        container: "#dropin",
      },
      (err, instance) => {
        if (err) {
          console.error("Dropin error:", err);
          return;
        }

        dropinInstance = instance;
        setInstance(instance);
      },
    );

    return () => {
      if (dropinInstance) {
        dropinInstance.teardown();
      }
    };
  }, [clientToken]);

  const handlePayment = async () => {
    if (!instance) return;

    try {
      setLoading(true);

      const { nonce } = await instance.requestPaymentMethod();

      const res = await checkoutCourse(nonce, courseId);

      if (res.success) {
        navigate("/my-courses");
      }
    } catch (err) {
      console.error(err);
      // toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b1f] via-[#111132] to-[#090918] text-white py-24 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
        {/* COURSE SUMMARY */}

        <div className="bg-[#161633] border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-lg sticky top-28 h-fit">
          <img
            src={course?.image}
            className="w-full h-60 object-cover rounded-xl mb-6"
          />

          <h2 className="text-2xl font-semibold mb-2">{course?.title}</h2>

          <p className="text-gray-400 text-sm mb-6">{course?.description}</p>

          <div className="border-t border-white/10 pt-5 space-y-3">
            <div className="flex justify-between text-gray-400 text-sm">
              <span>Course price</span>
              <span>₹ {course?.finalFee}</span>
            </div>

            <div className="flex justify-between text-gray-400 text-sm">
              <span>Tax</span>
              <span>₹ 0</span>
            </div>

            <div className="flex justify-between text-lg font-semibold pt-3 border-t border-white/10">
              <span>Total</span>
              <span className="text-purple-400">₹ {course?.finalFee}</span>
            </div>
          </div>
        </div>

        {/* PAYMENT SECTION */}

        <div className="bg-[#161633] border border-white/10 rounded-2xl p-8 shadow-xl backdrop-blur-lg">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck size={20} className="text-green-400" />

            <h3 className="text-xl font-semibold">Secure Payment</h3>
          </div>

          {/* PAYMENT FORM */}

          <div id="dropin" className="bg-white rounded-lg p-4 shadow-inner" />

          {/* PAY BUTTON */}

          <button
            onClick={handlePayment}
            disabled={loading || !instance}
            className="
            w-full mt-8 py-3 rounded-xl font-semibold
            bg-gradient-to-r from-purple-600 to-indigo-600
            hover:from-purple-700 hover:to-indigo-700
            transition-all duration-200
            shadow-lg
            cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          "
          >
            <Lock size={16} />

            {loading ? "Processing Payment..." : `Pay ₹ ${course?.finalFee}`}
          </button>

          {/* TRUST TEXT */}

          <p className="text-xs text-gray-400 mt-5 text-center">
            Payments are securely processed via Braintree. Your card details are
            encrypted and never stored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
