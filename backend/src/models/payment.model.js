import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
      required: true,
    },

    transactionId: {
      type: String, // Braintree transaction id
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    paymentMethod: {
      type: String, // card / paypal / google_pay
    },

    status: {
      type: String,
      enum: ["created", "success", "failed", "refunded", "voided"],
      default: "created",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Payment", paymentSchema);
