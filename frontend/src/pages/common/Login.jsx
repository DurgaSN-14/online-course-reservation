import { Link } from "react-router";
import { Mail, Lock, Eye, EyeOff, BookOpen } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../../components/FormInput";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f0c29] via-[#1a1a3a] to-[#0f0c29] text-white relative overflow-hidden ">
      {/* Glow Effects */}
      <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -top-40 -left-40"></div>
      <div className="absolute w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -bottom-40 -right-40"></div>

      {/* LEFT SECTION */}
      <div className="hidden lg:flex w-1/2 items-center justify-center px-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl space-y-10"
        >
          {/* Logo */}
          <div className="mt-4 flex items-center gap-3">
            <BookOpen size={36} className="text-purple-500" />
            <h1 className="text-2xl font-semibold tracking-wide">Learnify</h1>
          </div>

          <div>
            <h2 className="text-5xl font-bold leading-tight">
              Elevate Your Skills.
            </h2>
            <p className="text-gray-400 mt-6 text-lg">
              Join thousands of learners upgrading their careers every day.
            </p>
          </div>

          {/* Proper Image Placement */}
          <div className="flex justify-center">
            <img
              src="https://learn.begalileo.com/assets/login_page/student_acc.webp"
              alt="Learning"
              className="max-w-md w-full object-contain drop-shadow-2xl"
            />
          </div>
        </motion.div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex flex-1 items-center justify-center px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl shadow-[0_0_60px_rgba(139,92,246,0.15)]"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold">Welcome Back 👋</h2>
            <p className="text-gray-400 text-sm mt-2">Login to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormInput
              label="Email"
              type="email"
              placeholder="Enter your email"
              icon={Mail}
              error={errors.email}
              {...register("email")}
            />

            <div className="relative">
              <FormInput
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                icon={Lock}
                error={errors.password}
                {...register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-10 text-gray-400 hover:text-white cursor-pointer transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex justify-end text-sm">
              <Link
                to="/forgot-password"
                className="text-purple-400 hover:text-purple-300 cursor-pointer transition"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-semibold hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
            >
              Login
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-700"></div>
              <span className="text-gray-500 text-xs">OR CONTINUE WITH</span>
              <div className="flex-1 h-px bg-gray-700"></div>
            </div>

            {/* Google */}
            <button
              type="button"
              className="w-full py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition cursor-pointer"
            >
              Continue with Google
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-8">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-purple-400 hover:text-purple-300 font-medium cursor-pointer"
            >
              Signup
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
