"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Users,
  IndianRupee,
  Building2,
  Calendar,
  Heart,
  ArrowLeft,
  FilterX,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Data Constants (Matching your Registration Form) ---
const focusAreas = [
  { id: "education", label: "Education", icon: "📚" },
  { id: "healthcare", label: "Healthcare", icon: "🏥" },
  { id: "environment", label: "Environment", icon: "🌱" },
  { id: "women", label: "Women Empowerment", icon: "👩" },
  { id: "children", label: "Child Welfare", icon: "👶" },
  { id: "elderly", label: "Elderly Care", icon: "👴" },
  { id: "disability", label: "Disability Support", icon: "♿" },
  { id: "livelihood", label: "Livelihood", icon: "💼" },
  { id: "rural", label: "Rural Development", icon: "🏘️" },
  { id: "disaster", label: "Disaster Relief", icon: "🆘" },
];

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh",
];

const budgetRanges = [
  "Below ₹5 Lakhs", "₹5-25 Lakhs", "₹25-50 Lakhs", "₹50 Lakhs - 1 Crore", "₹1-5 Crores", "Above ₹5 Crores"
];

// --- Mock Data: Madhya Pradesh Focus ---
const MOCK_NGOS = [
  {
    id: "1",
    orgName: "Bhopal Social Welfare Society",
    orgType: "Society",
    yearFounded: "2012",
    state: "Madhya Pradesh",
    district: "Bhopal",
    focusAreas: ["education", "children", "women"],
    teamSize: "16-50 members",
    budget: "₹25-50 Lakhs",
    beneficiaries: "12,500",
  },
  {
    id: "2",
    orgName: "Clean Indore Initiative",
    orgType: "Non-Profit Organization",
    yearFounded: "2016",
    state: "Madhya Pradesh",
    district: "Indore",
    focusAreas: ["environment", "healthcare"],
    teamSize: "51-100 members",
    budget: "₹50 Lakhs - 1 Crore",
    beneficiaries: "40,000",
  },
  {
    id: "3",
    orgName: "Gramin Livelihood Mission",
    orgType: "Registered Trust",
    yearFounded: "2008",
    state: "Madhya Pradesh",
    district: "Sehore",
    focusAreas: ["rural", "livelihood", "women"],
    teamSize: "6-15 members",
    budget: "₹5-25 Lakhs",
    beneficiaries: "3,200",
  },
  {
    id: "4",
    orgName: "Narmada Educational Trust",
    orgType: "Registered Trust",
    yearFounded: "1998",
    state: "Madhya Pradesh",
    district: "Jabalpur",
    focusAreas: ["education", "rural"],
    teamSize: "100+ members",
    budget: "₹1-5 Crores",
    beneficiaries: "85,000",
  },
  {
    id: "5",
    orgName: "MP Disaster Relief Force",
    orgType: "Community Based Organization",
    yearFounded: "2021",
    state: "Madhya Pradesh",
    district: "Bhopal",
    focusAreas: ["disaster", "healthcare"],
    teamSize: "16-50 members",
    budget: "₹5-25 Lakhs",
    beneficiaries: "8,000",
  },
  {
    id: "6",
    orgName: "Mahakal Women Empowerment",
    orgType: "Self Help Group",
    yearFounded: "2015",
    state: "Madhya Pradesh",
    district: "Ujjain",
    focusAreas: ["women", "livelihood"],
    teamSize: "6-15 members",
    budget: "Below ₹5 Lakhs",
    beneficiaries: "800",
  },
  {
    id: "7",
    orgName: "Gwalior Heritage & Environment",
    orgType: "Section 8 Company",
    yearFounded: "2019",
    state: "Madhya Pradesh",
    district: "Gwalior",
    focusAreas: ["environment", "education"],
    teamSize: "1-5 members",
    budget: "Below ₹5 Lakhs",
    beneficiaries: "1,500",
  },
  {
    id: "8",
    orgName: "Tribal Child Welfare Society",
    orgType: "Society",
    yearFounded: "2004",
    state: "Madhya Pradesh",
    district: "Khandwa",
    focusAreas: ["children", "education", "rural"],
    teamSize: "51-100 members",
    budget: "₹50 Lakhs - 1 Crore",
    beneficiaries: "22,000",
  }
];

export default function NGODirectory() {
  const router = useRouter();

  // --- Filter States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedFocus, setSelectedFocus] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");

  // --- Filtering Logic ---
  const filteredNGOs = useMemo(() => {
    return MOCK_NGOS.filter((ngo) => {
      const matchesSearch = ngo.orgName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ngo.district.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesState = selectedState ? ngo.state === selectedState : true;
      const matchesFocus = selectedFocus ? ngo.focusAreas.includes(selectedFocus) : true;
      const matchesBudget = selectedBudget ? ngo.budget === selectedBudget : true;

      return matchesSearch && matchesState && matchesFocus && matchesBudget;
    });
  }, [searchTerm, selectedState, selectedFocus, selectedBudget]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedState("");
    setSelectedFocus("");
    setSelectedBudget("");
  };

  const hasActiveFilters = searchTerm || selectedState || selectedFocus || selectedBudget;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden pb-24">
      {/* Background */}
      <CustomGodRays />

      {/* Header Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push("/landingPage")}
          className="text-white/40 hover:text-white mb-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 w-max mb-4 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-[#138808] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Live Directory</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Intelligence <span className="text-[#FF9933] italic">Network.</span>
            </h1>
          </div>
          <p className="text-white/40 text-sm max-w-sm md:text-right">
            Discover, filter, and connect with verified non-profit organizations across Bharat.
          </p>
        </motion.div>

        {/* --- Filters & Search Bar --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#050505]/80 backdrop-blur-2xl border border-white/10 p-4 rounded-3xl flex flex-col lg:flex-row gap-4 shadow-2xl"
        >
          {/* Search */}
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-white transition-colors" />
            <input
              type="text"
              placeholder="Search by NGO name or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 pl-14 pr-5 rounded-2xl bg-white/5 border border-white/5 text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-all"
            />
          </div>

          {/* Select Drops */}
          <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
            <FilterSelect
              value={selectedState}
              onChange={setSelectedState}
              options={indianStates}
              placeholder="All States"
            />
            <FilterSelect
              value={selectedFocus}
              onChange={setSelectedFocus}
              options={focusAreas.map(f => ({ value: f.id, label: `${f.icon} ${f.label}` }))}
              placeholder="All Focus Areas"
            />
            <FilterSelect
              value={selectedBudget}
              onChange={setSelectedBudget}
              options={budgetRanges}
              placeholder="Any Budget"
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="h-14 px-6 rounded-2xl bg-[#FF9933]/10 text-[#FF9933] font-bold text-xs uppercase tracking-widest hover:bg-[#FF9933]/20 transition-colors flex items-center justify-center gap-2 shrink-0"
            >
              <FilterX className="w-4 h-4" /> Clear
            </button>
          )}
        </motion.div>
      </div>

      {/* --- NGO Grid Section --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-medium text-white/50">
            Showing <span className="text-white font-bold">{filteredNGOs.length}</span> Organizations
          </p>
        </div>

        {filteredNGOs.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredNGOs.map((ngo, index) => (
                <NGOCard key={ngo.id} ngo={ngo} index={index} focusAreasList={focusAreas} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="w-full py-32 flex flex-col items-center justify-center text-center bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-sm"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-white/20" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No organizations found</h3>
            <p className="text-white/40 max-w-md">
              We couldn't find any NGOs matching your current filter criteria. Try adjusting your search or clearing filters.
            </p>
            <button
              onClick={clearFilters}
              className="mt-8 px-8 py-3 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-white/90 transition-colors"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// --- Sub-Components ---

// Reusable Filter Dropdown
function FilterSelect({ value, onChange, options, placeholder }: { value: string, onChange: (v: string) => void, options: any[], placeholder: string }) {
  return (
    <div className="relative group w-full sm:w-48">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-14 pl-5 pr-12 rounded-2xl bg-white/5 border border-white/5 text-white text-sm focus:outline-none focus:border-white/20 transition-all appearance-none cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt} className="bg-[#0a0a0a]">
            {opt.label || opt}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none group-hover:text-white/70 transition-colors" />
    </div>
  );
}

// NGO Display Card
function NGOCard({ ngo, index, focusAreasList }: { ngo: any, index: number, focusAreasList: any[] }) {
  // Map raw focus IDs to the nice labels & icons
  const ngoFocusAreas = ngo.focusAreas.map((focusId: string) =>
    focusAreasList.find(f => f.id === focusId)
  ).filter(Boolean);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-[#050505] border border-white/10 rounded-3xl p-6 hover:border-white/20 hover:bg-white/[0.02] transition-all duration-300 flex flex-col h-full"
    >
      <div className="flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#FF9933]/10 group-hover:border-[#FF9933]/30 transition-colors">
            <Building2 className="w-6 h-6 text-white/50 group-hover:text-[#FF9933] transition-colors" />
          </div>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-white/50">
            {ngo.orgType}
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{ngo.orgName}</h3>

        <div className="flex items-center gap-2 text-white/50 text-sm mb-6">
          <MapPin className="w-4 h-4 text-[#138808]" />
          <span>{ngo.district}, {ngo.state}</span>
        </div>

        {/* Focus Area Badges */}
        <div className="flex flex-wrap gap-2 mb-8">
          {ngoFocusAreas.map((area: any) => (
            <div key={area.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-white/70">
              <span>{area.icon}</span>
              <span>{area.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10 mt-auto">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Founded
          </p>
          <p className="text-sm font-medium text-white/80">{ngo.yearFounded}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1 flex items-center gap-1">
            <Users className="w-3 h-3" /> Team Size
          </p>
          <p className="text-sm font-medium text-white/80">{ngo.teamSize}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1 flex items-center gap-1">
            <IndianRupee className="w-3 h-3" /> Budget
          </p>
          <p className="text-sm font-medium text-white/80">{ngo.budget}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1 flex items-center gap-1">
            <Heart className="w-3 h-3" /> Impact
          </p>
          <p className="text-sm font-medium text-white/80">{ngo.beneficiaries} lives</p>
        </div>
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------
// Custom Crash-Free "God Rays" Background Component
// ----------------------------------------------------
function CustomGodRays() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 fixed">
      <div className="absolute inset-0 bg-black z-0" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[100%] -bottom-[100%] -left-[100%] -right-[100%] z-10 opacity-[0.15]" // Lowered opacity for the directory so text remains ultra-readable
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
    </div>
  );
}
