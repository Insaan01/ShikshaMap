"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, Users, GraduationCap, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import IndiaMap from "../../components/IndiaMap";

export default function LandingPage() {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [stateData, setStateData] = useState<Record<string, any>>({});

  // Fetch data from FastAPI backend on load
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

  // Fallback if data isn't loaded or hovering over empty space
  const currentStats = stateData[hoveredState || ""] || {
    schools: "--", literacy: "--", poverty: "--", activeNGOs: 0
  };

  return (
    <main className="bg-black min-h-screen">
      <section className="relative bg-[#020202] py-24 sm:py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 w-full order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-10"
              >
                <h2 className="text-sm font-bold tracking-[0.3em] text-[#138808] uppercase mb-4">
                  Ground Intelligence
                </h2>
                <h3 className="text-4xl sm:text-6xl font-bold text-white tracking-tighter mb-6">
                  Explore the <br />
                  <span className="text-white/20">Data Landscape.</span>
                </h3>
                <p className="text-white/40 max-w-md font-light leading-relaxed">
                  Hover over a state to pull real-time social metrics from our
                  verified NGO database.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="grid grid-cols-2 gap-4"
              >
                <StatCard
                  icon={GraduationCap}
                  label="Schools Needing Aid"
                  value={currentStats.schools}
                  color="text-[#FF9933]"
                  isActive={hoveredState !== null}
                />
                <StatCard
                  icon={Activity}
                  label="Literacy Rate"
                  value={currentStats.literacy}
                  color="text-white"
                  isActive={hoveredState !== null}
                />
                <StatCard
                  icon={TrendingUp}
                  label="Poverty Gap"
                  value={currentStats.poverty}
                  color="text-[#138808]"
                  isActive={hoveredState !== null}
                />
                <StatCard
                  icon={Users}
                  label="Active NGOs"
                  value={currentStats.activeNGOs}
                  color="text-blue-400"
                  isActive={hoveredState !== null}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                    Selected Region:
                  </span>
                </div>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={hoveredState || "default"}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-bold text-white inline-block"
                  >
                    {hoveredState || "Hover on map"}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex-1 relative order-1 lg:order-2 w-full"
            >
              <div className="relative w-full max-w-[650px] mx-auto group">
                <IndiaMap
                  hoveredState={hoveredState}
                  setHoveredState={setHoveredState}
                />
                <div className="absolute bottom-4 right-4 text-white/10 uppercase text-[10px] tracking-[0.5em] flex flex-col items-center pointer-events-none">
                  <span>N</span>
                  <div className="w-px h-10 bg-white/10 my-2" />
                  <span>S</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  isActive,
}: {
  icon: any;
  label: string;
  value: string | number;
  color: string;
  isActive: boolean;
}) {
  return (
    <motion.div
      className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-white/10 transition-colors"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Icon
        className={`w-5 h-5 mb-4 ${color} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
      />
      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">
        {label}
      </p>
      <AnimatePresence mode="popLayout">
        <motion.p
          key={String(value)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="text-2xl font-bold text-white inline-block"
        >
          {value}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}