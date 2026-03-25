"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LogOut, TrendingUp, Users, GraduationCap, Activity, Search, Globe, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStateMetrics, useDistricts, useDistrictNGOs } from "@/hooks/use-api";
import { DUMMY_DISTRICT_STATS, District } from "@/types";
import { StatCard } from "@/components/ui/stat-card";
import IndiaMap from "@/components/IndiaMap";
import { StateView } from "@/components/ui/state-view";
import { DistrictPanel } from "@/components/ui/district-panel";

// --- Helper to generate realistic deterministic data if API is empty ---
const generateMockStateStats = (stateName: string | null) => {
  if (!stateName) return { schools: "--", literacy: "--", poverty: "--", activeNGOs: 0 };

  // Create a simple hash from the state name so the numbers are always the same for that state
  const hash = stateName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return {
    schools: (hash % 1500 + 300).toLocaleString(), // e.g., 1,420
    literacy: (65 + (hash % 30)) + "." + (hash % 9) + "%", // e.g., 78.4%
    poverty: (10 + (hash % 25)) + "." + (hash % 9) + "%", // e.g., 18.2%
    activeNGOs: hash % 200 + 40 // e.g., 145
  };
};

export default function LandingPage() {
  const router = useRouter();
  const { data: stateData } = useStateMetrics();
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  // Navigation State for smooth transitions
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingText, setLoadingText] = useState("Accessing Data...");

  const { data: districts } = useDistricts(selectedState);
  const { data: districtNGOs } = useDistrictNGOs(selectedDistrict?.district_name || null);

  // --- Smooth Transition Handlers ---
  const handleLogout = () => {
    setLoadingText("Signing Out...");
    setIsNavigating(true);
    setTimeout(() => {
      localStorage.removeItem("ngoName");
      router.push("/");
    }, 800);
  };

  const handleDirectoryNavigation = () => {
    setLoadingText("Accessing Global Directory...");
    setIsNavigating(true);
    setTimeout(() => {
      router.push("/ngo/organizations");
    }, 800);
  };

  const handleStateClick = (stateName: string) => {
    setLoadingText(`Accessing ${stateName} Database...`);
    setIsNavigating(true);
    setTimeout(() => {
      setIsNavigating(false); // Turn off loader
      setSelectedState(stateName); // Show state view
      setHoveredState(null);
    }, 800);
  };

  const handleBackToNational = () => {
    setLoadingText("Returning to National View...");
    setIsNavigating(true);
    setTimeout(() => {
      setIsNavigating(false);
      setSelectedState(null);
      setHoveredState(null);
    }, 800);
  };

  const currentMetrics = useMemo(() => {
    if (!selectedState) return { schools: "--", literacy: "--", poverty: "--" };

    const apiDistrictMetrics = districts?.find(
      (d: any) => d.district_name.toLowerCase() === hoveredState?.toLowerCase()
    );

    const dummyDistrictMetrics = hoveredState
      ? (DUMMY_DISTRICT_STATS[hoveredState] || DUMMY_DISTRICT_STATS.Default)
      : null;

    const stateMetricsFallback = stateData?.[selectedState] || generateMockStateStats(selectedState);

    return apiDistrictMetrics || dummyDistrictMetrics || stateMetricsFallback;
  }, [selectedState, hoveredState, districts, stateData]);

  const handleDistrictClick = (name: string) => {
    const data = districts?.find((d: any) => d.district_name?.toLowerCase() === name?.toLowerCase())
      || { district_name: name, schools: DUMMY_DISTRICT_STATS[name]?.schools || "850", literacy: DUMMY_DISTRICT_STATS[name]?.literacy || "68.5%" };
    if (data) setSelectedDistrict(data);
  };

  // --- Safe Stats Resolution for Hovering ---
  // Uses API data if available, otherwise uses our realistic deterministic generator
  const stats = stateData?.[hoveredState || ""] || generateMockStateStats(hoveredState);

  // ==========================================
  // VIEW: STATE DRILL-DOWN
  // ==========================================
  if (selectedState) {
    return (
      <div className="bg-black min-h-screen relative">
        {/* Loader overlay needs to exist here too for the "Back" button transition */}
        <AnimatePresence>
          {isNavigating && <TransitionLoader text={loadingText} />}
        </AnimatePresence>

        <StateView
          stateName={selectedState}
          hoveredDistrict={hoveredState}
          districts={districts || []}
          currentMetrics={currentMetrics}
          onBack={handleBackToNational}
          onLogout={handleLogout}
          onDistrictHover={setHoveredState}
          onDistrictClick={handleDistrictClick}
        />
        <DistrictPanel
          district={selectedDistrict}
          ngos={districtNGOs}
          onClose={() => setSelectedDistrict(null)}
        />
      </div>
    );
  }

  // ==========================================
  // VIEW: NATIONAL DASHBOARD
  // ==========================================
  return (
    <div className="relative min-h-screen bg-[#020202] text-white overflow-hidden">

      {/* --- Smooth Transition Overlay --- */}
      <AnimatePresence>
        {isNavigating && <TransitionLoader text={loadingText} />}
      </AnimatePresence>

      {/* --- Background Effects --- */}
      <CustomGodRays />

      <motion.div
        animate={{ opacity: 0.05, rotate: 360 }}
        transition={{ rotate: { duration: 45, repeat: Infinity, ease: "linear" } }}
        className="absolute -right-[20%] -top-[20%] pointer-events-none z-0"
      >
        <AshokaChakra size={800} color="#AAAAAA" />
      </motion.div>

      {/* --- Top Navigation Bar --- */}
      <nav className="absolute top-0 left-0 w-full p-6 sm:p-8 flex justify-between items-center z-[110]">
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hidden sm:flex">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF9933]" />
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#138808]" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Command Center</span>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDirectoryNavigation}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-md hover:bg-white/20 transition-all uppercase text-[10px] font-bold tracking-widest shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">NGO Directory</span>
            <span className="sm:hidden">Directory</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 hover:text-white hover:bg-red-500 transition-all uppercase text-[10px] font-bold tracking-widest"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </motion.button>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <section className="relative z-10 pt-32 pb-24 px-6 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row gap-16 items-center">

            {/* Left Column: Intelligence Panel */}
            <div className="flex-1 w-full order-2 lg:order-1">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-px bg-[#138808]"></span>
                  <h2 className="text-sm font-bold tracking-[0.3em] text-[#138808] uppercase">Ground Intelligence</h2>
                </div>
                <h3 className="text-4xl sm:text-6xl font-bold text-white tracking-tighter mb-6">
                  Explore the <br />
                  <span className="text-white/20 italic">Data Landscape.</span>
                </h3>
                <p className="text-white/40 max-w-md font-light leading-relaxed">
                  Hover over a state for real-time metrics. Click to view granular district data and active interventions.
                </p>
              </motion.div>

              {/* Stats Grid inside a frosted container */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="p-6 bg-[#050505]/60 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl"
              >
                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#138808] animate-pulse" />
                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Selected Region:</span>
                  </div>
                  <motion.span
                    key={hoveredState || "default"}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm font-bold text-[#FF9933]"
                  >
                    {hoveredState || "Hover on map"}
                  </motion.span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <StatCard icon={GraduationCap} label="Schools Needing Aid" value={stats.schools} color="text-[#FF9933]" isActive={hoveredState !== null} />
                  <StatCard icon={Activity} label="Literacy Rate" value={stats.literacy} color="text-white" isActive={hoveredState !== null} />
                  <StatCard icon={TrendingUp} label="Poverty Gap" value={stats.poverty} color="text-[#138808]" isActive={hoveredState !== null} />
                  <StatCard icon={Users} label="Active NGOs" value={stats.activeNGOs} color="text-blue-400" isActive={hoveredState !== null} />
                </div>
              </motion.div>

              {/* Contextual CTA for Directory */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                onClick={handleDirectoryNavigation}
                className="mt-6 group cursor-pointer p-5 bg-gradient-to-r from-white/[0.05] to-transparent border border-white/10 rounded-2xl hover:bg-white/[0.08] transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50 group-hover:text-white transition-colors">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-0.5">Search All Organizations</h4>
                    <p className="text-xs text-white/40">Filter NGOs by state, focus area, and budget.</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </motion.div>

            </div>

            {/* Right Column: India Map */}
            <div className="flex-1 relative order-1 lg:order-2 w-full flex justify-center lg:justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full max-w-3xl lg:scale-110 filter drop-shadow-[0_0_50px_rgba(255,255,255,0.05)]"
              >
                <IndiaMap
                  hoveredState={hoveredState}
                  setHoveredState={setHoveredState}
                  onStateClick={handleStateClick} // <--- Updated to use our new loader handler
                />
              </motion.div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

// ----------------------------------------------------
// Reusable Loader Component
// ----------------------------------------------------
function TransitionLoader({ text }: { text: string }) {
  return (
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
            borderRightColor: ["#FF9933", "#FFFFFF", "#138808", "#FF9933"]
          }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        />
      </motion.div>
      <motion.p
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        className="text-white/80 text-xs font-bold tracking-[0.3em] uppercase"
      >
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
        className="absolute -top-[100%] -bottom-[100%] -left-[100%] -right-[100%] z-10 opacity-[0.25]"
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
          filter: "blur(120px)",
        }}
      />
      <div
        className="absolute inset-0 z-20"
        style={{
          background: "radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 50%, #000000 100%)"
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
