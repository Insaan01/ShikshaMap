"use client";

import { ShieldCheck, Mail, MapPin, Trash2 } from "lucide-react";
import { NGO } from "@/types";

interface NGOCardProps {
  ngo: NGO;
  onApprove?: (id: number) => void;
  onRemove?: (id: number) => void;
  showActions?: boolean;
}

export function NGOCard({ ngo, onApprove, onRemove, showActions = true }: NGOCardProps) {
  return (
    <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 flex justify-between items-center group hover:border-white/10 transition-all">
      <div>
        <h3 className="text-2xl font-bold">{ngo.org_name}</h3>
        <p className="text-white/40 text-sm">{ngo.email} • {ngo.state}</p>
        <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mt-4 inline-block ${
          ngo.is_approved 
            ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
            : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
        }`}>
          {ngo.is_approved ? "Approved" : "Pending Approval"}
        </span>
      </div>

      {showActions && (
        <div className="flex gap-3">
          {!ngo.is_approved && onApprove && (
            <button
              onClick={() => onApprove(ngo.id)}
              className="bg-white text-black px-6 py-3 rounded-xl font-bold text-[10px] uppercase hover:bg-green-500 hover:text-white transition-all"
            >
              Approve
            </button>
          )}
          {onRemove && (
            <button
              onClick={() => onRemove(ngo.id)}
              className="bg-white/5 border border-white/10 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 px-4 py-3 rounded-xl transition-all"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}