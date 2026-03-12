import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="min-h-[400px] flex items-center justify-center py-10">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
        />

        <p className="text-gray-400 text-sm tracking-wide">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
