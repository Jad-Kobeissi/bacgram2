import { motion } from "motion/react";

export function Loading({ className }: { className?: string }) {
  return (
    <motion.span
      className={`text-[1.5rem] text-center ${className}`}
      animate={{ scale: [0.9, 1, 0.9] }}
      transition={{ repeat: Infinity, repeatType: "loop", duration: 0.8 }}
    >
      Loading...
    </motion.span>
  );
}
