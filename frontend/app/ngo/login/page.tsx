"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/ui/login-form";

export default function NGOLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8000/api/ngo/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("ngoName", data.org_name);
      router.push("/landingPage");
    } else {
      alert(data.detail || "Login Failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md p-10 rounded-[40px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl">
        <button onClick={() => router.push("/")} className="text-white/30 hover:text-white mb-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-3xl font-bold text-white tracking-tighter mb-8 text-center">NGO Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email" placeholder="Organization Email"
            className="w-full h-16 px-6 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password" placeholder="Password"
            className="w-full h-16 px-6 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full h-16 rounded-2xl bg-white text-black font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-4 hover:bg-green-500 hover:text-white transition-all">
            Login <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}