"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Users,
  GraduationCap,
  Activity,
  ArrowLeft,
  LogOut,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import IndiaMap from "../../components/IndiaMap";
import MadhyaPradesh from "../../components/MadhyaPradeshMap";

// --- DUMMY DATA DICTIONARY ---
// This acts as a fallback while your API is being built.
const DUMMY_DISTRICT_STATS: Record<string, { schools: string; literacy: string; poverty: string }> = {
  Bhopal: { schools: "1,245", literacy: "80.37%", poverty: "12.4%" },
  Indore: { schools: "1,890", literacy: "80.87%", poverty: "10.2%" },
  Gwalior: { schools: "1,102", literacy: "76.65%", poverty: "15.1%" },
  Jabalpur: { schools: "1,450", literacy: "81.07%", poverty: "11.8%" },
  Ujjain: { schools: "980", literacy: "72.34%", poverty: "18.3%" },
  Sagar: { schools: "1,340", literacy: "76.46%", poverty: "14.5%" },
  Rewa: { schools: "1,120", literacy: "71.62%", poverty: "19.2%" },
  Satna: { schools: "1,050", literacy: "72.26%", poverty: "17.8%" },
  Default: { schools: "850", literacy: "68.50%", poverty: "16.0%" }
};

export default function LandingPage() {
  const router = useRouter();

  // 1. Core State Hooks (Top Level)
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [stateData, setStateData] = useState<Record<string, any>>({});
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [districts, setDistricts] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [districtNGOs, setDistrictNGOs] = useState<any[]>([]);

  // 2. Fetch National Metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/map/state-metrics");
        if (response.ok) {
          const data = await response.json();
          setStateData(data);
        }
      } catch (error) {
        console.error("Map fetch error:", error);
      }
    };
    fetchMetrics();
  }, []);

  // 3. Fetch District Metrics on State Selection
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
          console.error("District fetch error:", error);
        }
      };
      fetchDistricts();
    }
  }, [selectedState]);

  // 4. Fetch NGOs for Selected District
  useEffect(() => {
    if (selectedDistrict) {
      const fetchNGOs = async () => {
        try {
          const res = await fetch(`http://localhost:8000/api/ngo/district/${selectedDistrict.district_name}`);
          if (res.ok) {
            const data = await res.json();
            setDistrictNGOs(data);
          }
        } catch (err) {
          console.error("NGO fetch failed:", err);
        }
      };
      fetchNGOs();
    }
  }, [selectedDistrict]);

  const handleLogout = () => {
    localStorage.removeItem("ngoName");
    router.push("/");
  };

  // --- DISTRICT VIEW (Drill-down) ---
  if (selectedState) {
    // Priority 1: Check actual API data for the hovered district
    const apiDistrictMetrics = districts.find(
      d => d.district_name.toLowerCase() === hoveredState?.toLowerCase()
    );

    // Priority 2: Use Dummy Data if hovered, falling back to 'Default' dummy numbers
    const dummyDistrictMetrics = hoveredState
      ? (DUMMY_DISTRICT_STATS[hoveredState] || DUMMY_DISTRICT_STATS.Default)
      : null;

    // Priority 3: Fallback to State-level metrics if nothing is hovered
    const stateMetricsFallback = stateData[selectedState] || { schools: "--", literacy: "--", poverty: "--" };

    // Set the metrics to display!
    const currentMetrics = apiDistrictMetrics || dummyDistrictMetrics || stateMetricsFallback;

    return (
      <main className="bg-black min-h-screen p-8 sm:p-20 relative overflow-hidden text-white">
        <div className="flex justify-between items-center mb-16 relative z-10">
          <button
            onClick={() => {
              setSelectedState(null);
              setHoveredState(null);
            }}
            className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors uppercase text-[10px] font-bold tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" /> National Map
          </button>
          <button onClick={handleLogout} className="text-white/20 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">
            Sign Out
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-20 items-start relative z-10">
          <div className="flex-1 space-y-12">
            <div>
              <h2 className="text-sm font-bold tracking-[0.3em] text-[#FF9933] uppercase mb-4">State Intelligence</h2>
              <h3 className="text-5xl sm:text-7xl font-bold tracking-tighter">
                {selectedState} <br />
                <span className="text-white/20 italic font-light text-4xl leading-tight">Granular Metrics.</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StatCard icon={GraduationCap} label="District Schools" value={currentMetrics.schools} color="text-[#FF9933]" isActive={hoveredState !== null} />
              <StatCard icon={Activity} label="Literacy Rate" value={currentMetrics.literacy} color="text-white" isActive={hoveredState !== null} />
              <StatCard icon={TrendingUp} label="Poverty Index" value={currentMetrics.poverty} color="text-[#138808]" isActive={hoveredState !== null} />
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 group transition-all hover:bg-white/[0.04]">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Status</p>
                <p className="text-2xl font-bold text-white uppercase tracking-tighter group-hover:text-green-500 transition-colors">Active</p>
              </div>
            </div>

            <p className="text-white/20 text-xs uppercase tracking-widest font-bold">Click a district on the map for deep-dive analytics</p>
          </div>

          <div className="flex-1 w-full">
            <MadhyaPradesh
              stateName={selectedState}
              hoveredDistrict={hoveredState}
              setHoveredDistrict={setHoveredState}
              onDistrictClick={(name) => {
                // Allows mock clicking while API is down
                const data = districts.find(d => d.district_name.toLowerCase() === name.toLowerCase())
                  || { district_name: name, schools: DUMMY_DISTRICT_STATS[name]?.schools || "850", literacy: DUMMY_DISTRICT_STATS[name]?.literacy || "68.5%" };
                if (data) setSelectedDistrict(data);
              }}
            />
          </div>
        </div>

        {/* DISTRICT INTELLIGENCE SLIDE-OUT */}
        <AnimatePresence>
          {selectedDistrict && (
            <div className="fixed inset-0 z-[120] flex items-center justify-end p-4 sm:p-8">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSelectedDistrict(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />
              <motion.div
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-lg h-full bg-[#050505] border-l border-white/10 p-12 shadow-2xl overflow-y-auto"
              >
                <button onClick={() => setSelectedDistrict(null)} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>

                <h4 className="text-sm font-bold tracking-[0.4em] text-[#138808] uppercase mb-4">District Profile</h4>
                <h2 className="text-5xl font-bold text-white tracking-tighter mb-12">{selectedDistrict.district_name}</h2>

                <div className="space-y-12">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2">Total Schools</p>
                      <p className="text-3xl font-bold text-white">{selectedDistrict.schools}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2">Literacy Rate</p>
                      <p className="text-3xl font-bold text-white">{selectedDistrict.literacy}</p>
                    </div>
                  </div>

                  <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] font-bold text-[#FF9933] uppercase tracking-widest mb-6">NGO Activity Log</p>
                    <div className="space-y-4">
                      {districtNGOs.length > 0 ? (
                        districtNGOs.map((ngo, idx) => (
                          <div key={idx} className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <div>
                              <p className="text-sm font-bold text-white">{ngo.org_name}</p>
                              <p className="text-[10px] text-white/40 uppercase tracking-widest">{ngo.org_type}</p>
                            </div>
                            <button className="text-[10px] font-bold text-[#138808] uppercase tracking-tighter hover:underline">
                              View Impact
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-white/40 text-xs italic">No NGOs currently registered in this district.</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    );
  }

  // --- NATIONAL VIEW ---
  const nationalStats = stateData[hoveredState || ""] || {
    schools: "--", literacy: "--", poverty: "--", activeNGOs: 0
  };

  return (
    <main className="bg-black min-h-screen relative text-white">
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
                setHoveredState={setHoveredState}
                onStateClick={(name) => {
                  setSelectedState(name);
                  setHoveredState(null); // Reset hover on transition
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// --- HELPER COMPONENTS ---

function StatCard({ icon: Icon, label, value, color, isActive }: { icon: any; label: string; value: string | number; color: string; isActive: boolean; }) {
  return (
    <motion.div className={`p-6 rounded-2xl border transition-all duration-300 ${isActive ? 'bg-white/[0.06] border-white/10' : 'bg-white/[0.02] border-white/5'} hover:bg-white/[0.08]`}>
      <Icon className={`w-5 h-5 mb-4 ${color} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </motion.div>
  );
}
