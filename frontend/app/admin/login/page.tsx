"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingText, setLoadingText] = useState("Verifying Admin Protocol...");
  const router = useRouter();

  const handleNavigation = (path: string) => {
    setLoadingText("Redirecting...");
    setIsNavigating(true);
    setTimeout(() => {
      router.push(path);
    }, 800);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setLoadingText("Authorization Granted...");
      setIsNavigating(true);
      setTimeout(() => {
        router.push("/admin");
      }, 800);
    } else {
      alert("Invalid Admin Credentials");
    }
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
  };

  return (
    <>
      {/* Full Screen Page Transition Overlay with Indian Flag Colors */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md pointer-events-none flex flex-col items-center justify-center gap-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              className="relative w-16 h-16 flex items-center justify-center"
            >
              <motion.span
                className="absolute inset-0 border-4 border-transparent rounded-full"
                animate={{
                  borderTopColor: ["#FF9933", "#FFFFFF", "#138808", "#FF9933"],
                  borderRightColor: ["#FF9933", "#FFFFFF", "#138808", "#FF9933"],
                }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              />
            </motion.div>
            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="text-white/80 text-xs font-bold tracking-[0.3em] uppercase text-center px-4"
            >
              {loadingText}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative min-h-screen bg-black flex items-center justify-center p-6 overflow-hidden">
        {/* The Tricolor Background */}
        <CustomGodRays />

        {/* Ashoka Chakra Animation */}
        <motion.div
          animate={{ opacity: 0.05, rotate: -360 }} // Reverse rotation for slight variation
          transition={{ rotate: { duration: 150, repeat: Infinity, ease: "linear" } }}
          className="absolute z-0 pointer-events-none"
        >
          <AshokaChakra size={900} color="#AAAAAA" />
        </motion.div>

        {/* Login Card Container */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-md p-10 rounded-[40px] bg-[#050505]/80 border border-white/10 backdrop-blur-2xl shadow-2xl"
        >
          <motion.button
            whileHover={{ x: -5 }}
            onClick={() => handleNavigation("/")}
            className="text-white/30 hover:text-white mb-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </motion.button>

          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 rounded-3xl bg-[#FF9933]/10 border border-[#FF9933]/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,153,51,0.1)]">
              <ShieldCheck className="w-8 h-8 text-[#FF9933]" />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter text-white">Admin Access</h1>
            <p className="text-[#FF9933]/50 text-[10px] uppercase tracking-[0.3em] font-bold mt-3">
              Security Protocol Required
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#FF9933] transition-colors" />
              <input
                type="password"
                placeholder="Enter Admin Password"
                required
                className="w-full h-14 pl-14 pr-6 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FF9933]/50 focus:bg-white/[0.07] transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="group w-full h-14 mt-4 rounded-xl bg-[#FF9933] text-black font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-[#FF9933]/90 transition-all shadow-[0_0_20px_rgba(255,153,51,0.2)] hover:shadow-[0_0_30px_rgba(255,153,51,0.4)]"
            >
              Authorize
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </>
  );
}

// ----------------------------------------------------
// Custom Crash-Free "God Rays" Background Component
// ----------------------------------------------------
function CustomGodRays() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-black z-0" />

      {/* Rotating Tricolor Rays */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[100%] -bottom-[100%] -left-[100%] -right-[100%] z-10 opacity-40" // Slightly lower opacity for admin
        style={{
          background: `conic-gradient(
            from 0deg,
            transparent 0deg,
            rgba(255, 153, 51, 0.8) 45deg,
            transparent 90deg,
            transparent 120deg,
            rgba(255, 255, 255, 0.8) 165deg,
            transparent 210deg,
            transparent 240deg,
            rgba(19, 136, 8, 0.8) 285deg,
            transparent 330deg,
            transparent 360deg
          )`,
          filter: "blur(100px)",
        }}
      />

      {/* Radial Vignette Mask */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: "radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 60%, #000000 100%)" // Slightly darker vignette for admin
        }}
      />
    </div>
  );
}

function AshokaChakra({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="0.1">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="2" />
      {[...Array(24)].map((_, i) => (
        <line
          key={i}
          x1="12"
          y1="12"
          x2={12 + 10 * Math.cos((i * 15 * Math.PI) / 180)}
          y2={12 + 10 * Math.sin((i * 15 * Math.PI) / 180)}
        />
      ))}
    </svg>
  );
}
