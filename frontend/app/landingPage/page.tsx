"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, Users, GraduationCap, Activity, ArrowLeft, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import IndiaMap from "../../components/IndiaMap";

export default function LandingPage() {
  const router = useRouter();
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [stateData, setStateData] = useState<Record<string, any>>({});

  // Drill-down States
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [districts, setDistricts] = useState<any[]>([]);

  // 1. Fetch State Metrics on Load
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/map/state-metrics");
        if (response.ok) {
          const data = await response.json();
          setStateData(data);
        }
      } catch (error) {
        console.error("Failed to fetch map data:", error);
      }
    };
    fetchMetrics();
  }, []);

  // 2. Fetch District Metrics when a State is Clicked
  useEffect(() => {
    if (selectedState) {
      const fetchDistricts = async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/map/state/${selectedState}/districts`);
          if (response.ok) {
            const data = await response.json();
            setDistricts(data);
          }
        } catch (error) {
          console.error("Failed to fetch districts:", error);
        }
      };
      fetchDistricts();
    }
  }, [selectedState]);

  const handleLogout = () => {
    localStorage.removeItem("ngoName");
    router.push("/");
  };

  const currentStats = stateData[hoveredState || ""] || {
    schools: "--", literacy: "--", poverty: "--", activeNGOs: 0
  };

  // --- DISTRICT VIEW ---
  if (selectedState) {
    return (
      <main className="bg-black min-h-screen p-8 sm:p-16">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setSelectedState(null)}
          className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 uppercase text-[10px] font-bold tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Back to National Map
        </motion.button>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-6xl font-bold text-white tracking-tighter mb-16"
        >
          {selectedState} <br />
          <span className="text-white/20 italic font-light text-3xl sm:text-5xl">Ground Intelligence.</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {districts.map((d: any, index: number) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
            >
              <h4 className="text-xl font-bold text-white mb-8 uppercase tracking-tight opacity-70 group-hover:opacity-100 transition-opacity">
                {d.district_name}
              </h4>
              <div className="space-y-6">
                <MetricRow label="Literacy" value={d.literacy} color="text-white" />
                <MetricRow label="Poverty Gap" value={d.poverty} color="text-[#138808]" />
                <MetricRow label="Schools" value={d.schools} color="text-[#FF9933]" />
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    );
  }

  // --- NATIONAL MAP VIEW ---
  return (
    <main className="bg-black min-h-screen relative">
      {/* Top Right Navigation */}
      <div className="absolute top-8 right-8 z-[110]">
        <button
          onClick={handleLogout}
          className="group flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all uppercase text-[10px] font-bold tracking-widest"
        >
          <LogOut className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
          Sign Out
        </button>
      </div>

      <section className="relative bg-[#020202] py-24 sm:py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 w-full order-2 lg:order-1">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                <h2 className="text-sm font-bold tracking-[0.3em] text-[#138808] uppercase mb-4">
                  Ground Intelligence
                </h2>
                <h3 className="text-4xl sm:text-6xl font-bold text-white tracking-tighter mb-6">
                  Explore the <br />
                  <span className="text-white/20">Data Landscape.</span>
                </h3>
                <p className="text-white/40 max-w-md font-light leading-relaxed">
                  Hover over a state for real-time metrics. Click to view
                  granular district data.
                </p>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                <StatCard icon={GraduationCap} label="Schools Needing Aid" value={currentStats.schools} color="text-[#FF9933]" isActive={hoveredState !== null} />
                <StatCard icon={Activity} label="Literacy Rate" value={currentStats.literacy} color="text-white" isActive={hoveredState !== null} />
                <StatCard icon={TrendingUp} label="Poverty Gap" value={currentStats.poverty} color="text-[#138808]" isActive={hoveredState !== null} />
                <StatCard icon={Users} label="Active NGOs" value={currentStats.activeNGOs} color="text-blue-400" isActive={hoveredState !== null} />
              </div>

              <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                    Selected Region:
                  </span>
                </div>
                <AnimatePresence mode="popLayout">
                  <motion.span key={hoveredState || "default"} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-bold text-white">
                    {hoveredState || "Hover on map"}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            <div className="flex-1 relative order-1 lg:order-2 w-full">
              <IndiaMap
                hoveredState={hoveredState}
                setHoveredState={setHoveredState}
                onStateClick={(name) => setSelectedState(name)}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function MetricRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em]">
      <span className="text-white/20">{label}</span>
      <span className={color}>{value}</span>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, isActive }: { icon: any; label: string; value: string | number; color: string; isActive: boolean; }) {
  return (
    <motion.div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-white/10 transition-colors">
      <Icon className={`w-5 h-5 mb-4 ${color} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </motion.div>
  );
}