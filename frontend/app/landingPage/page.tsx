"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LogOut, TrendingUp, Users, GraduationCap, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useStateMetrics, useDistricts, useDistrictNGOs } from "@/hooks/use-api";
import { DUMMY_DISTRICT_STATS, District } from "@/types";
import { StatCard } from "@/components/ui/stat-card";
import IndiaMap from "@/components/IndiaMap";
import { StateView } from "@/components/ui/state-view";
import { DistrictPanel } from "@/components/ui/district-panel";

export default function LandingPage() {
  const router = useRouter();
  const { data: stateData } = useStateMetrics();
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  const { data: districts } = useDistricts(selectedState);
  const { data: districtNGOs } = useDistrictNGOs(selectedDistrict?.district_name || null);

  const handleLogout = () => {
    localStorage.removeItem("ngoName");
    router.push("/");
  };

  const currentMetrics = useMemo(() => {
    if (!selectedState) return { schools: "--", literacy: "--", poverty: "--" };

    const apiDistrictMetrics = districts.find(
      d => d.district_name.toLowerCase() === hoveredState?.toLowerCase()
    );

    const dummyDistrictMetrics = hoveredState
      ? (DUMMY_DISTRICT_STATS[hoveredState] || DUMMY_DISTRICT_STATS.Default)
      : null;

    const stateMetricsFallback = stateData[selectedState] || { schools: "--", literacy: "--", poverty: "--" };

    return apiDistrictMetrics || dummyDistrictMetrics || stateMetricsFallback;
  }, [selectedState, hoveredState, districts, stateData]);

  const handleDistrictClick = (name: string) => {
    const data = districts.find(d => d.district_name.toLowerCase() === name.toLowerCase())
      || { district_name: name, schools: DUMMY_DISTRICT_STATS[name]?.schools || "850", literacy: DUMMY_DISTRICT_STATS[name]?.literacy || "68.5%" };
    if (data) setSelectedDistrict(data);
  };

  if (selectedState) {
    return (
      <>
        <StateView
          stateName={selectedState}
          hoveredDistrict={hoveredState}
          districts={districts}
          currentMetrics={currentMetrics}
          onBack={() => { setSelectedState(null); setHoveredState(null); }}
          onLogout={handleLogout}
          onDistrictHover={setHoveredState}
          onDistrictClick={(d: any) => handleDistrictClick(d.district_name)}
        />
        <DistrictPanel
          district={selectedDistrict}
          ngos={districtNGOs}
          onClose={() => setSelectedDistrict(null)}
        />
      </>
    );
  }

  const stats = stateData[hoveredState || ""] || { schools: "--", literacy: "--", poverty: "--", activeNGOs: 0 };

  return (
    <>
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
                <StatCard icon={GraduationCap} label="Schools Needing Aid" value={stats.schools} color="text-[#FF9933]" isActive={hoveredState !== null} />
                <StatCard icon={Activity} label="Literacy Rate" value={stats.literacy} color="text-white" isActive={hoveredState !== null} />
                <StatCard icon={TrendingUp} label="Poverty Gap" value={stats.poverty} color="text-[#138808]" isActive={hoveredState !== null} />
                <StatCard icon={Users} label="Active NGOs" value={stats.activeNGOs} color="text-blue-400" isActive={hoveredState !== null} />
              </div>

              <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Selected Region:</span>
                </div>
                <motion.span
                  key={hoveredState || "default"}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-bold text-white"
                >
                  {hoveredState || "Hover on map"}
                </motion.span>
              </div>
            </div>

            <div className="flex-1 relative order-1 lg:order-2 w-full">
              <IndiaMap
                hoveredState={hoveredState}
                setHoveredState={setHoveredState}
                onStateClick={(name) => { setSelectedState(name); setHoveredState(null); }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}