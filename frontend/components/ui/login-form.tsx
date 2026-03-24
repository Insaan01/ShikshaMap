"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  title: string;
  subtitle?: string;
  buttonText: string;
  icon?: React.ReactNode;
  fields: Array<{
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: React.ReactNode;
  }>;
}

export function LoginForm({ onSubmit, title, subtitle, buttonText, icon, fields }: LoginFormProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md p-10 rounded-[40px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl">
        {icon && <div className="flex flex-col items-center mb-10 text-center">{icon}</div>}
        
        <h1 className="text-3xl font-bold text-white tracking-tighter mb-8 text-center">{title}</h1>
        {subtitle && <p className="text-white/30 text-xs uppercase tracking-[0.2em] font-bold mt-2 mb-8 text-center">{subtitle}</p>}

        <form onSubmit={onSubmit} className="space-y-4">
          {fields.map((field, idx) => (
            <div key={idx} className={field.icon ? "relative group" : ""}>
              {field.icon && (
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-orange-500 transition-colors">
                  {field.icon}
                </span>
              )}
              <input
                type={field.type}
                placeholder={field.placeholder}
                className={`w-full h-16 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50 ${field.icon ? "pl-14 pr-6" : "px-6"}`}
                value={field.value}
                onChange={field.onChange}
              />
            </div>
          ))}
          <button className="w-full h-16 rounded-2xl bg-white text-black font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-4 hover:bg-green-500 hover:text-white transition-all">
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}