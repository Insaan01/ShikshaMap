"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Users, Target, Globe, ChevronDown } from "lucide-react";
import { NGO } from "@/types";

interface DistrictPanelProps {
  district: {
    district_name: string;
    schools?: string;
    literacy?: string;
  } | null;
  ngos: NGO[];
  onClose: () => void;
}

export function DistrictPanel({ district, ngos, onClose }: DistrictPanelProps) {
  const [expandedNgo, setExpandedNgo] = useState<string | null>(null);

  if (!district) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-end p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-lg h-full bg-[#050505] border-l border-white/10 p-12 shadow-2xl overflow-y-auto"
        >
          <button onClick={onClose} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>

          <h4 className="text-sm font-bold tracking-[0.4em] text-[#138808] uppercase mb-4">District Profile</h4>
          <h2 className="text-5xl font-bold text-white tracking-tighter mb-12">{district.district_name}</h2>

          <div className="space-y-12">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2">Total Schools</p>
                <p className="text-3xl font-bold text-white">{district.schools || "--"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2">Literacy Rate</p>
                <p className="text-3xl font-bold text-white">{district.literacy || "--"}</p>
              </div>
            </div>

            <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5">
              <p className="text-[10px] font-bold text-[#FF9933] uppercase tracking-widest mb-6">NGO Activity Log</p>
              <div className="space-y-4">
                {ngos.length > 0 ? (
                  ngos.map((ngo, idx) => {
                    const isExpanded = expandedNgo === ngo.org_name;
                    return (
                      <div key={idx} className={`overflow-hidden rounded-xl border transition-all duration-300 ${isExpanded ? "bg-white/[0.07] border-white/20" : "bg-white/5 border-white/5"}`}>
                        <div className="flex justify-between items-center p-4 cursor-pointer" onClick={() => setExpandedNgo(isExpanded ? null : ngo.org_name)}>
                          <div>
                            <p className="text-sm font-bold text-white">{ngo.org_name}</p>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest">{ngo.org_type || "NGO"}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold text-[#138808] uppercase tracking-tighter">{isExpanded ? "Close" : "View Impact"}</span>
                            <ChevronDown className={`w-4 h-4 text-white/20 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </div>
                        </div>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-4 pb-6 border-t border-white/5">
                              <div className="pt-4 grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-3 h-3 text-[#FF9933]" />
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Founded: <span className="text-white">{ngo.yearFounded || "2018"}</span></p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="w-3 h-3 text-[#FF9933]" />
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Beneficiaries: <span className="text-white">{ngo.beneficiaries || "500+"}</span></p>
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <Target className="w-3 h-3 text-[#138808]" />
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Focus: <span className="text-white">Education</span></p>
                                  </div>
                                  <div className="flex items-center gap-2 cursor-pointer group">
                                    <Globe className="w-3 h-3 text-[#138808]" />
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">Website: <span className="text-white underline">{ngo.website ? "Visit" : "N/A"}</span></p>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-white/40 text-xs italic">No NGOs currently registered in this district.</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}