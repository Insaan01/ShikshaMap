"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  Building2,
  MapPin,
  Activity,
  AlertCircle,
  Database
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNGOList } from "@/hooks/use-api";

// --- Fallback Mock Data in case API is offline ---
const MOCK_ADMIN_NGOS = [
  {
    id: 1,
    orgName: "Vidhya Foundation",
    orgType: "Registered Trust",
    district: "Pune",
    state: "Maharashtra",
    status: "pending",
    email: "contact@vidhya.org",
    focusAreas: ["education", "children"]
  },
  {
    id: 2,
    orgName: "Arogya Bharat",
    orgType: "Section 8 Company",
    district: "New Delhi",
    state: "Delhi",
    status: "approved",
    email: "info@arogyabharat.in",
    focusAreas: ["healthcare", "women"]
  },
  {
    id: 3,
    orgName: "Gramin Livelihood Mission",
    orgType: "Society",
    district: "Sehore",
    state: "Madhya Pradesh",
    status: "pending",
    email: "support@glm-mp.org",
    focusAreas: ["rural", "livelihood"]
  }
];

export default function AdminDashboard() {
  const router = useRouter();
  const { data: apiNgos, refetch } = useNGOList();

  // Use API data if available, otherwise use mock data for UI testing
  const ngos = apiNgos || MOCK_ADMIN_NGOS;

  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingText, setLoadingText] = useState("Processing...");
  const [processingId, setProcessingId] = useState<number | null>(null);

  const handleNavigation = (path: string) => {
    setLoadingText("Closing Secure Session...");
    setIsNavigating(true);
    setTimeout(() => {
      router.push(path);
    }, 800);
  };

  const handleApprove = async (id: number) => {
    setProcessingId(id);
    try {
      const response = await fetch(`http://localhost:8000/api/ngo/${id}/approve`, { method: "POST" });
      if (response.ok) {
        if (refetch) refetch();
      } else {
        console.warn("Backend unavailable, simulating approval for UI.");
      }
    } catch (error) {
      console.warn("Backend unavailable, simulating approval for UI.");
    } finally {
      setTimeout(() => setProcessingId(null), 500); // UI delay for effect
    }
  };

  const handleRemove = async (id: number) => {
    if (window.confirm("SECURITY OVERRIDE: Are you sure you want to permanently remove this organization from the network?")) {
      setProcessingId(id);
      try {
        const response = await fetch(`http://localhost:8000/api/ngo/${id}`, { method: "DELETE" });
        if (response.ok) {
          if (refetch) refetch();
        } else {
          console.warn("Backend unavailable, simulating removal for UI.");
        }
      } catch (error) {
        console.warn("Backend unavailable, simulating removal for UI.");
      } finally {
        setTimeout(() => setProcessingId(null), 500);
      }
    }
  };

  // Calculate quick stats
  const stats = useMemo(() => {
    const total = ngos.length;
    const pending = ngos.filter((n: any) => n.status === "pending").length;
    const approved = ngos.filter((n: any) => n.status === "approved").length;
    return { total, pending, approved };
  }, [ngos]);

  return (
    <div className="relative min-h-screen bg-[#020202] text-white overflow-hidden pb-24">

      {/* --- Smooth Transition Overlay --- */}
      <AnimatePresence>
        {isNavigating && <TransitionLoader text={loadingText} />}
      </AnimatePresence>

      {/* --- Background Effects (Saffron Tinted for Admin) --- */}
      <CustomGodRays />
      <motion.div
        animate={{ opacity: 0.05, rotate: -360 }}
        transition={{ rotate: { duration: 60, repeat: Infinity, ease: "linear" } }}
        className="absolute -right-[10%] -top-[10%] pointer-events-none z-0"
      >
        <AshokaChakra size={600} color="#FF9933" />
      </motion.div>

      {/* --- Header Section --- */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => handleNavigation("/")}
          className="text-white/40 hover:text-[#FF9933] mb-12 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Terminate Session
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8"
        >
          <div>
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#FF9933]/10 border border-[#FF9933]/20 w-max mb-4 backdrop-blur-md shadow-[0_0_15px_rgba(255,153,51,0.1)]">
              <ShieldCheck className="w-3 h-3 text-[#FF9933]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF9933]">Level 5 Clearance</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Command <span className="text-[#FF9933] italic">Control.</span>
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">System Status</p>
              <div className="flex items-center gap-2 justify-end">
                <div className="w-2 h-2 rounded-full bg-[#138808] animate-pulse" />
                <p className="text-sm font-medium text-[#138808]">Network Online</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- Top Metrics Row --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <Database className="w-6 h-6 text-white/30 mb-4" />
            <p className="text-3xl font-bold text-white mb-1">{stats.total}</p>
            <p className="text-xs uppercase tracking-widest text-white/40 font-bold">Total Registered</p>
          </div>
          <div className="bg-[#FF9933]/5 border border-[#FF9933]/20 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#FF9933]/10 rounded-full blur-xl" />
            <AlertCircle className="w-6 h-6 text-[#FF9933] mb-4" />
            <p className="text-3xl font-bold text-white mb-1">{stats.pending}</p>
            <p className="text-xs uppercase tracking-widest text-[#FF9933]/70 font-bold">Pending Verification</p>
          </div>
          <div className="bg-[#138808]/5 border border-[#138808]/20 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#138808]/10 rounded-full blur-xl" />
            <Activity className="w-6 h-6 text-[#138808] mb-4" />
            <p className="text-3xl font-bold text-white mb-1">{stats.approved}</p>
            <p className="text-xs uppercase tracking-widest text-[#138808]/70 font-bold">Verified Active</p>
          </div>
        </motion.div>

        {/* --- Main List --- */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold tracking-[0.3em] text-white/50 uppercase mb-6 flex items-center gap-4">
            <span className="w-8 h-px bg-white/20"></span>
            Organization Queue
          </h2>

          <AnimatePresence>
            {ngos.map((ngo: any, index: number) => (
              <AdminNGORow
                key={ngo.id}
                ngo={ngo}
                index={index}
                isProcessing={processingId === ngo.id}
                onApprove={() => handleApprove(ngo.id)}
                onRemove={() => handleRemove(ngo.id)}
              />
            ))}
          </AnimatePresence>

          {ngos.length === 0 && (
            <div className="w-full py-20 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center bg-white/[0.02]">
              <CheckCircle2 className="w-10 h-10 text-[#138808]/50 mb-4" />
              <p className="text-white/70 font-bold">Queue is empty</p>
              <p className="text-white/40 text-sm">All organizations have been processed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Custom Admin NGO Row Component
// ----------------------------------------------------
function AdminNGORow({ ngo, index, isProcessing, onApprove, onRemove }: any) {
  const isPending = ngo.status === "pending";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`relative overflow-hidden group bg-[#050505]/80 border rounded-2xl p-6 transition-all duration-300 backdrop-blur-md ${isPending ? "border-[#FF9933]/30 hover:border-[#FF9933]/60" : "border-white/10 hover:border-white/20"
        }`}
    >
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between relative z-10">

        {/* Left: Info */}
        <div className="flex items-start gap-5 flex-1">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isPending ? "bg-[#FF9933]/10 text-[#FF9933]" : "bg-white/5 text-white/50"
            }`}>
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-bold text-white">{ngo.orgName}</h3>
              {isPending ? (
                <span className="px-2 py-0.5 rounded bg-[#FF9933]/20 text-[#FF9933] text-[9px] uppercase tracking-widest font-bold border border-[#FF9933]/20">
                  Needs Review
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-[#138808]/20 text-[#138808] text-[9px] uppercase tracking-widest font-bold border border-[#138808]/20">
                  Verified
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {ngo.district}, {ngo.state}</span>
              <span className="flex items-center gap-1.5 border-l border-white/10 pl-4 text-white/40">{ngo.orgType}</span>
              <span className="flex items-center gap-1.5 border-l border-white/10 pl-4 text-white/40">{ngo.email}</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 w-full lg:w-auto pt-4 lg:pt-0 border-t border-white/5 lg:border-none">
          {isPending && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onApprove}
              disabled={isProcessing}
              className="flex-1 lg:flex-none h-10 px-6 rounded-lg bg-[#138808]/10 border border-[#138808]/30 text-[#138808] font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#138808] hover:text-white transition-all disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : <><CheckCircle2 className="w-4 h-4" /> Verify</>}
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRemove}
            disabled={isProcessing}
            className="flex-1 lg:flex-none h-10 px-6 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
          >
            {isProcessing ? "..." : <><Trash2 className="w-4 h-4" /> Revoke</>}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------
// Reusable Loader Component
// ----------------------------------------------------
function TransitionLoader({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md pointer-events-none flex flex-col items-center justify-center gap-6"
    >
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} className="relative w-16 h-16 flex items-center justify-center">
        <motion.span
          className="absolute inset-0 border-4 border-transparent rounded-full"
          animate={{ borderTopColor: ["#FF9933", "#FFFFFF", "#138808", "#FF9933"], borderRightColor: ["#FF9933", "#FFFFFF", "#138808", "#FF9933"] }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        />
      </motion.div>
      <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="text-white/80 text-xs font-bold tracking-[0.3em] uppercase">
        {text}
      </motion.p>
    </motion.div>
  );
}

// ----------------------------------------------------
// Custom Crash-Free "God Rays" Background Component
// ----------------------------------------------------
function CustomGodRays() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-black z-0" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[100%] -bottom-[100%] -left-[100%] -right-[100%] z-10 opacity-[0.20]"
        style={{
          background: `conic-gradient(
            from 0deg,
            transparent 0deg,
            rgba(255, 153, 51, 0.8) 45deg,
            transparent 90deg,
            transparent 120deg,
            rgba(255, 255, 255, 0.5) 165deg,
            transparent 210deg,
            transparent 240deg,
            rgba(19, 136, 8, 0.5) 285deg,
            transparent 330deg,
            transparent 360deg
          )`,
          filter: "blur(120px)",
        }}
      />
      <div className="absolute inset-0 z-20" style={{ background: "radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 60%, #000000 100%)" }} />
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
