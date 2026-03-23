"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  ArrowRight,
  ArrowLeft,
  Building2,
  Mail,
  MapPin,
  Database,
  TrendingUp,
  Users,
  Phone,
  User,
  Calendar,
  FileText,
  Target,
  Globe,
  CheckCircle2,
  Briefcase,
  IndianRupee,
  Heart,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const organizationTypes = [
  "Registered Trust", "Society", "Section 8 Company", "Non-Profit Organization",
  "Community Based Organization", "Self Help Group",
];

const teamSizeOptions = ["1-5 members", "6-15 members", "16-50 members", "51-100 members", "100+ members"];
const budgetRanges = ["Below ₹5 Lakhs", "₹5-25 Lakhs", "₹25-50 Lakhs", "₹50 Lakhs - 1 Crore", "₹1-5 Crores", "Above ₹5 Crores"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function HeroSection() {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Central State to prevent data loss across steps
  const [formState, setFormState] = useState({
    orgName: "", email: "", password: "", regNumber: "", orgType: "",
    yearFounded: "", contactName: "", phone: "", designation: "",
    altEmail: "", website: "", state: "", district: "", city: "",
    pincode: "", teamSize: "", budget: "", beneficiaries: "", operatingDistricts: ""
  });

  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleExpand = () => setIsExpanded(true);
  const handleClose = () => {
    setIsExpanded(false);
    setCurrentStep(1);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      return;
    }

    const payload = {
      ...formState,
      email: formState.email.toLowerCase().trim(),
      focusAreas: selectedFocusAreas,
    };

    try {
      const response = await fetch("http://localhost:8000/api/ngo/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsExpanded(false);
        router.push("/landingPage");
      } else {
        const errorData = await response.json();
        alert(`Registration Error: ${errorData.detail || "Please check all fields."}`);
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const handleBack = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const toggleFocusArea = (id: string) => {
    setSelectedFocusAreas(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  useEffect(() => {
    document.body.style.overflow = isExpanded ? "hidden" : "unset";
  }, [isExpanded]);

  const stepTitles = ["Organization Details", "Contact Information", "Location & Focus", "Organization Profile"];

  return (
    <>
      {/* Top Right Navigation */}
      <div className="absolute top-8 right-8 z-[110] flex items-center gap-4">
        <button
          onClick={() => router.push("/landingPage")}
          className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
        >
          Guest Explore
        </button>
        <button
          onClick={() => router.push("/admin/login")}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-500/20 group transition-all"
        >
          <ShieldCheck className="w-5 h-5 text-white/30 group-hover:text-orange-500 transition-colors" />
        </button>
      </div>

      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0a0a] to-black" />

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative z-10 flex flex-col items-center gap-8 text-center max-w-5xl mx-auto">
          <motion.div variants={itemVariants} className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF9933]" />
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#138808]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">National Social Portal</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-6xl sm:text-8xl md:text-9xl font-bold tracking-tighter text-white">Bridge the Gap</motion.h1>
          <motion.p variants={itemVariants} className="text-lg sm:text-2xl text-white/40 font-light max-w-2xl leading-relaxed">Intelligence for the growth of Bharat.</motion.p>

          {!isExpanded && (
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <motion.button
                variants={itemVariants}
                layoutId="modal"
                onClick={handleExpand}
                className="h-16 px-10 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-4 transition-all active:scale-95"
              >
                Register NGO <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                variants={itemVariants}
                onClick={() => router.push("/ngo/login")}
                className="h-16 px-10 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-4 transition-all active:scale-95"
              >
                NGO Login <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </motion.div>
      </section>

      <section className="relative bg-black py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-sm font-bold tracking-[0.3em] text-[#FF9933] uppercase mb-12">The Mission Framework</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 rounded-3xl overflow-hidden border border-white/10">
            {[
              { icon: Database, title: "Real-Time Intelligence", step: "01" },
              { icon: MapPin, title: "Priority Mapping", step: "02" },
              { icon: TrendingUp, title: "Impact Analysis", step: "03" },
              { icon: Users, title: "Strategic Network", step: "04" },
            ].map((f, i) => (
              <motion.div key={i} className="group bg-black p-12 hover:bg-white/[0.02] transition-colors relative">
                <span className="absolute top-8 right-8 text-4xl font-bold text-white/[0.03]">{f.step}</span>
                <f.icon className="w-10 h-10 text-white/30 group-hover:text-[#B35D2B] mb-6 transition-colors" />
                <h4 className="text-xl font-bold text-white mb-2">{f.title}</h4>
                <p className="text-white/40 text-sm">Access live metrics for granular national development.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
            <motion.div layoutId="modal" className="relative w-full max-w-5xl my-4 overflow-hidden bg-[#050505] sm:rounded-[40px] border border-white/10 flex flex-col lg:flex-row min-h-[600px] lg:min-h-[700px]">
              <div className="lg:w-[320px] p-8 sm:p-10 flex flex-col justify-between bg-white/[0.01] border-b lg:border-b-0 lg:border-r border-white/10">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">Join the <br /><span className="text-white/20 italic">Network.</span></h2>
                  <p className="text-white/40 text-sm mt-4">Register your organization to access real-time intelligence.</p>
                  <div className="mt-10 space-y-4">
                    {stepTitles.map((title, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${currentStep > index + 1 ? "bg-[#138808] text-white" : currentStep === index + 1 ? "bg-white text-black" : "bg-white/10 text-white/30"}`}>
                          {currentStep > index + 1 ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                        </div>
                        <span className={`text-sm transition-colors duration-300 ${currentStep === index + 1 ? "text-white font-medium" : "text-white/30"}`}>{title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-1 p-8 sm:p-10 bg-white/[0.02] overflow-y-auto max-h-[70vh] lg:max-h-none">
                <form onSubmit={handleSubmit} className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">{stepTitles[currentStep - 1]}</h3>
                    <span className="text-xs text-white/40">Step {currentStep} of {totalSteps}</span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex-1 space-y-5">
                      {currentStep === 1 && (
                        <>
                          <CustomInput icon={Building2} placeholder="Organization Name" name="orgName" value={formState.orgName} onChange={handleInputChange} />
                          <CustomInput icon={Mail} placeholder="Official Email" type="email" name="email" value={formState.email} onChange={handleInputChange} />
                          <CustomInput icon={Lock} placeholder="Create Password" type="password" name="password" value={formState.password} onChange={handleInputChange} />
                          <CustomInput icon={FileText} placeholder="Registration Number (Optional)" name="regNumber" value={formState.regNumber} onChange={handleInputChange} />
                          <CustomSelect icon={Briefcase} placeholder="Organization Type" options={organizationTypes} name="orgType" value={formState.orgType} onChange={handleInputChange} />
                          <CustomInput icon={Calendar} placeholder="Year Founded (e.g., 2015)" name="yearFounded" value={formState.yearFounded} onChange={handleInputChange} />
                        </>
                      )}
                      {currentStep === 2 && (
                        <>
                          <CustomInput icon={User} placeholder="Contact Person Name" name="contactName" value={formState.contactName} onChange={handleInputChange} />
                          <CustomInput icon={Phone} placeholder="Phone Number" type="tel" name="phone" value={formState.phone} onChange={handleInputChange} />
                          <CustomInput icon={Briefcase} placeholder="Designation" name="designation" value={formState.designation} onChange={handleInputChange} />
                          <CustomInput icon={Mail} placeholder="Alt Email" type="email" name="altEmail" value={formState.altEmail} onChange={handleInputChange} />
                          <CustomInput icon={Globe} placeholder="Website" name="website" value={formState.website} onChange={handleInputChange} />
                        </>
                      )}
                      {currentStep === 3 && (
                        <>
                          <CustomSelect icon={MapPin} placeholder="State" options={indianStates} name="state" value={formState.state} onChange={handleInputChange} />
                          <div className="grid grid-cols-2 gap-4">
                            <CustomInput icon={MapPin} placeholder="District" name="district" value={formState.district} onChange={handleInputChange} />
                            <CustomInput icon={MapPin} placeholder="City/Town" name="city" value={formState.city} onChange={handleInputChange} />
                          </div>
                          <CustomInput icon={MapPin} placeholder="PIN Code" name="pincode" value={formState.pincode} onChange={handleInputChange} />
                          <div className="mt-6">
                            <div className="grid grid-cols-2 gap-2">
                              {focusAreas.map((area) => (
                                <button key={area.id} type="button" onClick={() => toggleFocusArea(area.id)} className={`p-3 rounded-xl text-left text-sm flex items-center gap-2 transition-all ${selectedFocusAreas.includes(area.id) ? "bg-[#FF9933]/20 border-[#FF9933]/50 text-white border" : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"}`}>
                                  <span>{area.icon}</span><span>{area.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                      {currentStep === 4 && (
                        <>
                          <CustomSelect icon={Users} placeholder="Team Size" options={teamSizeOptions} name="teamSize" value={formState.teamSize} onChange={handleInputChange} />
                          <CustomSelect icon={IndianRupee} placeholder="Annual Budget" options={budgetRanges} name="budget" value={formState.budget} onChange={handleInputChange} />
                          <CustomInput icon={Heart} placeholder="Beneficiaries Served" name="beneficiaries" value={formState.beneficiaries} onChange={handleInputChange} />
                          <CustomInput icon={Target} placeholder="Operating Districts" name="operatingDistricts" value={formState.operatingDistricts} onChange={handleInputChange} />
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
                    {currentStep > 1 && (
                      <button type="button" onClick={handleBack} className="h-14 px-6 rounded-xl bg-white/5 border border-white/10 text-white font-medium flex items-center gap-2 hover:bg-white/10 transition-all">
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                    )}
                    <button type="submit" className="flex-1 h-14 rounded-xl bg-white text-black font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/90 transition-all">
                      {currentStep === totalSteps ? <>Complete Registration <CheckCircle2 className="w-5 h-5" /></> : <>Continue <ArrowRight className="w-5 h-5" /></>}
                    </button>
                  </div>
                </form>
              </div>

              <button onClick={handleClose} className="absolute right-4 top-4 sm:right-6 sm:top-6 p-2 text-white/30 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function CustomInput({ icon: Icon, ...props }: any) {
  return (
    <div className="relative group">
      <Icon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white/50 transition-colors" />
      <input {...props} className="w-full h-14 pl-14 pr-5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all" />
    </div>
  );
}

function CustomSelect({ icon: Icon, placeholder, options, ...props }: any) {
  return (
    <div className="relative group">
      <Icon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white/50 transition-colors pointer-events-none" />
      <select {...props} className="w-full h-14 pl-14 pr-5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all appearance-none cursor-pointer">
        <option value="" disabled className="bg-[#0a0a0a] text-white/30">{placeholder}</option>
        {options.map((opt: string) => <option key={opt} value={opt} className="bg-[#0a0a0a] text-white">{opt}</option>)}
      </select>
    </div>
  );
}