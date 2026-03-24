"use client";
import React, { useEffect } from "react";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useNGOList } from "@/hooks/use-api";
import { NGOCard } from "@/components/ui/ngo-card";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: ngos, refetch } = useNGOList();

  const handleApprove = async (id: number) => {
    const response = await fetch(`http://localhost:8000/api/ngo/${id}/approve`, { method: "POST" });
    if (response.ok) refetch();
  };

  const handleRemove = async (id: number) => {
    if (window.confirm("Are you sure you want to permanently remove this NGO?")) {
      const response = await fetch(`http://localhost:8000/api/ngo/${id}`, { method: "DELETE" });
      if (response.ok) refetch();
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
          <NGOCard
            key={ngo.id}
            ngo={ngo}
            onApprove={handleApprove}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
}