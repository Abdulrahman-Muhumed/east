// app/(marketing)/components/LoaderOverlay.jsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { brand } from "../../config/brand";

const PRIMARY = brand?.colors?.primary ?? "#0B2A6B";
const ACCENT  = brand?.colors?.accent  ?? "#FFD028";

export default function LoaderOverlay({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="fx-loader-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[70] bg-white/55 backdrop-blur-md flex items-center justify-center"
        >
          <div className="relative h-14 w-14">
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
              style={{ borderTopColor: PRIMARY }}
            />
            <div
              className="absolute inset-2 rounded-full border-4 border-transparent animate-[spin_1.4s_linear_infinite]"
              style={{ borderTopColor: ACCENT }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
