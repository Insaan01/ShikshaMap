"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
  isActive: boolean;
}

export function StatCard({ icon: Icon, label, value, color, isActive }: StatCardProps) {
  return (
    <motion.div 
      className={`p-6 rounded-2xl border transition-all duration-300 ${
        isActive ? 'bg-white/[0.06] border-white/10' : 'bg-white/[0.02] border-white/5'
      } hover:bg-white/[0.08]`}
    >
      <Icon className={`w-5 h-5 mb-4 ${color} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </motion.div>
  );
}