"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  onLogout: () => void;
}

export function LogoutButton({ onLogout }: LogoutButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    onLogout();
    router.push("/");
  };

  return (
    <button
      onClick={handleClick}
      className="group flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all uppercase text-[10px] font-bold tracking-widest"
    >
      <LogOut className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
      Sign Out
    </button>
  );
}