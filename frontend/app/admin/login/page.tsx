"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, ArrowRight } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardware-coded check for now as requested
    if (password === "admin123") {
      router.push("/admin");
    } else {
      alert("Invalid Admin Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md p-10 rounded-[40px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 rounded-3xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6">
            <ShieldCheck className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter text-white">Admin Access</h1>
          <p className="text-white/30 text-xs uppercase tracking-[0.2em] font-bold mt-2">Security Protocol Required</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="password"
              placeholder="Enter Admin Password"
              className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-orange-500/50 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="w-full h-16 rounded-2xl bg-white text-black font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-4 hover:bg-orange-500 hover:text-white transition-all">
            Authorize <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}