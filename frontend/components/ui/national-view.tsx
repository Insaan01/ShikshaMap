"use client";

import { TrendingUp, Users, GraduationCap, Activity, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StatCard } from "./stat-card";
import IndiaMap from "@/components/IndiaMap";

interface NationalViewProps {
  hoveredState: string | null;
  stateData: Record<string, any>;
  onStateHover: (state: string | null) => void;
  onStateClick: (state: string) => void;
  onLogout: () => void;
}

export function NationalView({ hoveredState, stateData, onStateHover, onStateClick, onLogout }: NationalViewProps) {
  const nationalStats = stateData[hoveredState || ""] || {
    schools: "--", literacy: "--", poverty: "--", activeNGOs: 0
  };

  return (
    <main className="bg-black min-h-screen relative text-white">
      <div className="absolute top-8 right-8 z-[110]">
        <button
          onClick={onLogout}
          className="group flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all uppercase text-[10px] font-bold tracking-widest"
        >
          <LogOutIcon className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
          Sign Out
        </button>
      </div>

      <section className="relative bg-[#020202] py-24 sm:py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 w-full order-2 lg:order-1">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                <h2 className="text-sm font-bold tracking-[0.3em] text-[#138808] uppercase mb-4">Ground Intelligence</h2>
                <h3 className="text-4xl sm:text-6xl font-bold text-white tracking-tighter mb-6">Explore the <br /><span className="text-white/20">Data Landscape.</span></h3>
                <p className="text-white/40 max-w-md font-light leading-relaxed">Hover over a state for real-time metrics. Click to view granular district data.</p>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                <StatCard icon={GraduationCap} label="Schools Needing Aid" value={nationalStats.schools} color="text-[#FF9933]" isActive={hoveredState !== null} />
                <StatCard icon={Activity} label="Literacy Rate" value={nationalStats.literacy} color="text-white" isActive={hoveredState !== null} />
                <StatCard icon={TrendingUp} label="Poverty Gap" value={nationalStats.poverty} color="text-[#138808]" isActive={hoveredState !== null} />
                <StatCard icon={Users} label="Active NGOs" value={nationalStats.activeNGOs} color="text-blue-400" isActive={hoveredState !== null} />
              </div>

              <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Selected Region:</span>
                </div>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={hoveredState || "default"}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-bold text-white"
                  >
                    {hoveredState || "Hover on map"}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            <div className="flex-1 relative order-1 lg:order-2 w-full">
              <IndiaMap
                hoveredState={hoveredState}
                setHoveredState={onStateHover}
                onStateClick={onStateClick}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function LogOutIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" x2="9" y1="12" y2="12"/>
    </svg>
  );
}