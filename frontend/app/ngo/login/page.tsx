"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NGOLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingText, setLoadingText] = useState("Authenticating...");
  const router = useRouter();

  const handleNavigation = (path: string) => {
    setLoadingText("Redirecting...");
    setIsNavigating(true);
    setTimeout(() => {
      router.push(path);
    }, 800);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsNavigating(true);
    setLoadingText("Authenticating...");

    try {
      const res = await fetch("http://localhost:8000/api/ngo/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("ngoName", data.org_name);
        setLoadingText("Access Granted...");
        setTimeout(() => router.push("/landingPage"), 800);
      } else {
        setIsNavigating(false);
        alert(data.detail || "Login Failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("API Error:", error);
      // UI FALLBACK: Allows you to test the flow even if the backend is offline
      setLoadingText("Bypassing for UI Testing...");
      setTimeout(() => router.push("/landingPage"), 800);
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
              className="text-white/80 text-xs font-bold tracking-[0.3em] uppercase"
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
          animate={{ opacity: 0.05, rotate: 360 }}
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

          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF9933]" />
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#138808]" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/50">Secure Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight text-center">
              Welcome <br />
              <span className="text-white/20 italic">Back.</span>
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#FF9933] transition-colors" />
              <input
                type="email"
                placeholder="Organization Email"
                required
                className="w-full h-14 pl-14 pr-5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FF9933]/50 focus:bg-white/[0.07] transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#138808] transition-colors" />
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full h-14 pl-14 pr-5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#138808]/50 focus:bg-white/[0.07] transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="group w-full h-14 mt-4 rounded-xl bg-white text-black font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              Access Portal
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

      {/* Rotating Tricolor Rays - Smoother, more vibrant implementation */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[100%] -bottom-[100%] -left-[100%] -right-[100%] z-10 opacity-50"
        style={{
          background: `conic-gradient(
            from 0deg,
            transparent 0deg,
            rgba(255, 153, 51, 0.8) 45deg, /* Vibrant Saffron */
            transparent 90deg,
            transparent 120deg,
            rgba(255, 255, 255, 0.8) 165deg, /* Bright White */
            transparent 210deg,
            transparent 240deg,
            rgba(19, 136, 8, 0.8) 285deg, /* Deep Green */
            transparent 330deg,
            transparent 360deg
          )`,
          filter: "blur(100px)",
        }}
      />

      {/* Radial Vignette Mask to fade out the edges and ensure text is readable */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: "radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 60%, #000000 100%)"
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
