"use client";
import React, { useEffect, useState } from "react";
import { ShieldCheck, Mail, MapPin, ArrowLeft, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [ngos, setNgos] = useState([]);
  const router = useRouter();

  const fetchNgos = () => {
    fetch("http://localhost:8000/api/ngo/list").then(res => res.json()).then(setNgos);
  };

  useEffect(() => { fetchNgos(); }, []);

  const handleApprove = async (id: number) => {
    const response = await fetch(`http://localhost:8000/api/ngo/${id}/approve`, { method: "POST" });
    if (response.ok) fetchNgos();
  };

  const handleRemove = async (id: number) => {
    if (window.confirm("Are you sure you want to permanently remove this NGO?")) {
      const response = await fetch(`http://localhost:8000/api/ngo/${id}`, { method: "DELETE" });
      if (response.ok) fetchNgos();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-12 sm:p-20">
      <button
        onClick={() => router.push("/")}
        className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 uppercase text-[10px] font-bold tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Portal
      </button>

      <h1 className="text-4xl font-bold mb-12 flex items-center gap-4 tracking-tighter">
        <ShieldCheck className="text-orange-500" /> Admin Control
      </h1>

      <div className="grid gap-6">
        {ngos.map((ngo: any) => (
          <div key={ngo.id} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 flex justify-between items-center group hover:border-white/10 transition-all">
            <div>
              <h3 className="text-2xl font-bold">{ngo.org_name}</h3>
              <p className="text-white/40 text-sm">{ngo.email} • {ngo.state}</p>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mt-4 inline-block ${ngo.is_approved ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'}`}>
                {ngo.is_approved ? "Approved" : "Pending Approval"}
              </span>
            </div>

            <div className="flex gap-3">
              {!ngo.is_approved && (
                <button
                  onClick={() => handleApprove(ngo.id)}
                  className="bg-white text-black px-6 py-3 rounded-xl font-bold text-[10px] uppercase hover:bg-green-500 hover:text-white transition-all"
                >
                  Approve
                </button>
              )}
              <button
                onClick={() => handleRemove(ngo.id)}
                className="bg-white/5 border border-white/10 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 px-4 py-3 rounded-xl transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}