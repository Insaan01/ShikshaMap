"use client";

import { TrendingUp, Users, GraduationCap, Activity, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { StatCard } from "./stat-card";
import MadhyaPradesh from "@/components/MadhyaPradeshMap";

interface StateViewProps {
  stateName: string;
  hoveredDistrict: string | null;
  districts: any[];
  currentMetrics: {
    schools: string;
    literacy: string;
    poverty: string;
  };
  onBack: () => void;
  onLogout: () => void;
  onDistrictHover: (district: string | null) => void;
  onDistrictClick: (district: any) => void;
}

export function StateView({ 
  stateName, 
  hoveredDistrict, 
  districts, 
  currentMetrics, 
  onBack, 
  onLogout,
  onDistrictHover,
  onDistrictClick
}: StateViewProps) {
  return (
    <main className="bg-black min-h-screen p-8 sm:p-20 relative overflow-hidden text-white">
      <div className="flex justify-between items-center mb-16 relative z-10">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors uppercase text-[10px] font-bold tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> National Map
        </button>
        <button onClick={onLogout} className="text-white/20 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">
          Sign Out
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-20 items-start relative z-10">
        <div className="flex-1 space-y-12">
          <div>
            <h2 className="text-sm font-bold tracking-[0.3em] text-[#FF9933] uppercase mb-4">State Intelligence</h2>
            <h3 className="text-5xl sm:text-7xl font-bold tracking-tighter">
              {stateName} <br />
              <span className="text-white/20 italic font-light text-4xl leading-tight">Granular Metrics.</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard icon={GraduationCap} label="District Schools" value={currentMetrics.schools} color="text-[#FF9933]" isActive={hoveredDistrict !== null} />
            <StatCard icon={Activity} label="Literacy Rate" value={currentMetrics.literacy} color="text-white" isActive={hoveredDistrict !== null} />
            <StatCard icon={TrendingUp} label="Poverty Index" value={currentMetrics.poverty} color="text-[#138808]" isActive={hoveredDistrict !== null} />
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 group transition-all hover:bg-white/[0.04]">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Status</p>
              <p className="text-2xl font-bold text-white uppercase tracking-tighter group-hover:text-green-500 transition-colors">Active</p>
            </div>
          </div>

          <p className="text-white/20 text-xs uppercase tracking-widest font-bold">Click a district on the map for deep-dive analytics</p>
        </div>

        <div className="flex-1 w-full">
          <MadhyaPradesh
            stateName={stateName}
            hoveredDistrict={hoveredDistrict}
            setHoveredDistrict={onDistrictHover}
            onDistrictClick={onDistrictClick}
          />
        </div>
      </div>
    </main>
  );
}