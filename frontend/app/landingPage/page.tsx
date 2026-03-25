"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LogOut, TrendingUp, Users, GraduationCap, Activity, Search, Globe, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Custom Hooks & Component Imports ---
import { useStateMetrics, useDistricts, useDistrictNGOs } from "@/hooks/use-api";
import { DUMMY_DISTRICT_STATS, District } from "@/types";
import { StatCard } from "@/components/ui/stat-card";
import IndiaMap from "@/components/IndiaMap";
import { StateView } from "@/components/ui/state-view";
import { DistrictPanel } from "@/components/ui/district-panel";

// --- Helper to generate realistic deterministic data if API is empty ---
const generateMockStateStats = (stateName: string | null) => {
  if (!stateName) return { schools: "--", literacy: "--", poverty: "--", activeNGOs: 0 };

  const hash = stateName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return {
    schools: (hash % 1500 + 300).toLocaleString(),
    literacy: (65 + (hash % 30)) + "." + (hash % 9) + "%",
    poverty: (10 + (hash % 25)) + "." + (hash % 9) + "%",
    activeNGOs: hash % 200 + 40
  };
};

export default function LandingPage() {
  const router = useRouter();

  const { data: stateData } = useStateMetrics();
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingText, setLoadingText] = useState("Accessing Data...");

  const { data: districts } = useDistricts(selectedState);
  const { data: districtNGOs } = useDistrictNGOs(selectedDistrict?.district_name || null);

  // --- Handlers ---

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
      setIsNavigating(false);
      setSelectedState(stateName);
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

  const handleDistrictClick = (name: string) => {
    const data = districts?.find((d: any) => d.district_name?.toLowerCase() === name?.toLowerCase())
      || { district_name: name, schools: DUMMY_DISTRICT_STATS[name]?.schools || "850", literacy: DUMMY_DISTRICT_STATS[name]?.literacy || "68.5%" };

    if (data) setSelectedDistrict(data);
  };

  // --- Dynamic Metrics Calculation ---
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

  // Resolution for National Hovering
  const stats = stateData?.[hoveredState || ""] || generateMockStateStats(hoveredState);

  // ==========================================
  // VIEW: STATE DRILL-DOWN (Includes sidebar)
  // ==========================================
  if (selectedState) {
    return (
      <div className="bg-black min-h-screen relative">
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
          ngos={districtNGOs || []}
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
      <AnimatePresence>
        {isNavigating && <TransitionLoader text={loadingText} />}
      </AnimatePresence>

      <CustomGodRays />

      <motion.div
        animate={{ opacity: 0.05, rotate: 360 }}
        transition={{ rotate: { duration: 45, repeat: Infinity, ease: "linear" } }}
        className="absolute -right-[20%] -top-[20%] pointer-events-none z-0"
      >
        <AshokaChakra size={800} color="#AAAAAA" />
      </motion.div>

      {/* Navigation */}
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
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-md hover:bg-white/20 transition-all uppercase text-[10px] font-bold tracking-widest"
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

      {/* Main Map & Intelligence Panel */}
      <section className="relative z-10 pt-32 pb-24 px-6 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row gap-16 items-center">

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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="p-6 bg-[#050505]/60 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl"
              >
                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#138808] animate-pulse" />
                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Selected:</span>
                  </div>
                  <motion.span className="text-sm font-bold text-[#FF9933]">
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
            </div>

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
                  onStateClick={handleStateClick}
                />
              </motion.div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

// --- Internal Helper Components ---

function TransitionLoader({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center gap-6"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="relative w-16 h-16 border-4 border-transparent border-t-[#FF9933] border-r-[#138808] rounded-full"
      />
      <p className="text-white/80 text-xs font-bold tracking-[0.3em] uppercase">{text}</p>
    </motion.div>
  );
}

function CustomGodRays() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[100%] -bottom-[100%] -left-[100%] -right-[100%] z-10 opacity-[0.25]"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, rgba(255,153,51,0.8) 45deg, transparent 90deg, transparent 120deg, rgba(255,255,255,0.8) 165deg, transparent 210deg, transparent 240deg, rgba(19,136,8,0.8) 285deg, transparent 330deg, transparent 360deg)`,
          filter: "blur(120px)",
        }}
      />
      <div className="absolute inset-0 bg-radial-vignette z-20" />
    </div>
  );
}

function AshokaChakra({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="0.05">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="2" />
      {[...Array(24)].map((_, i) => (
        <line key={i} x1="12" y1="12" x2={12 + 10 * Math.cos((i * 15 * Math.PI) / 180)} y2={12 + 10 * Math.sin((i * 15 * Math.PI) / 180)} />
      ))}
    </svg>
  );
}