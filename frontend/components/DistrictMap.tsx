"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DistrictMap({ stateName, hoveredDistrict, setHoveredDistrict, onDistrictClick }: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");

  // --- 1. THE TRANSLATION TABLE ---
  // Hover over the map, note the PATH number, and add the real name here.
  const idMap: Record<string, string> = {
    "PATH4959": "Bhopal",
    "PATH3007": "Indore", // Example: check your labels for these
    "PATH2102": "Gwalior",
    "PATH5512": "Jabalpur",
  };

  useEffect(() => {
    const loadSvg = async () => {
      try {
        const fileName = stateName.toLowerCase().replace(/\s+/g, "-");
        const response = await fetch(`/states/${fileName}.svg`);
        if (response.ok) {
          let text = await response.text();
          let cleanedText = text
            .replace(/<style([\s\S]*?)<\/style>/gi, "")
            .replace(/filter="url\(#.*?\)"/g, "")
            .replace(/<rect[^>]*\/>/gi, "") // Keeps background clean
            .replace(/<svg[^>]*>/i, (match) => {
               const viewBox = text.match(/viewBox="([^"]+)"/i)?.[1] || "0 0 1000 1000";
               return `<svg viewBox="${viewBox}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style="background:transparent; overflow:visible;">`;
            });
          setSvgContent(cleanedText);
        }
      } catch (e) { console.error("SVG Load Error:", e); }
    };
    loadSvg();
  }, [stateName]);

  useEffect(() => {
    if (!svgContent || !containerRef.current) return;
    const svg = containerRef.current.querySelector("svg");
    if (!svg) return;

    const paths = svg.querySelectorAll("path");
    paths.forEach((path: any) => {
      const rawId = path.id || path.getAttribute("name") || "";

      // --- 2. RESOLVE THE NAME ---
      // Check the map first; if not found, show the raw ID so you can map it
      const districtName = idMap[rawId] || rawId;

      if (!districtName || districtName.length < 3) {
        path.style.display = "none";
        return;
      }

      path.style.cursor = "pointer";
      path.style.transition = "all 0.2s ease";
      path.style.fill = "#FDFCF0";
      path.style.fillOpacity = "0.1";
      path.style.stroke = "rgba(253, 252, 240, 0.2)";

      path.onmouseover = (e: MouseEvent) => {
        e.stopPropagation();
        setHoveredDistrict(districtName); // Sends mapped name to LandingPage
        path.style.fill = "#138808";
        path.style.fillOpacity = "0.7";
        path.style.stroke = "#FDFCF0";
        path.style.strokeWidth = "1.5px";
      };

      path.onmouseleave = () => {
        setHoveredDistrict(null);
        path.style.fill = "#FDFCF0";
        path.style.fillOpacity = "0.1";
        path.style.stroke = "rgba(253, 252, 240, 0.2)";
        path.style.strokeWidth = "0.5px";
      };

      path.onclick = () => onDistrictClick(districtName);
    });
  }, [svgContent, setHoveredDistrict, onDistrictClick]);

  return (
    <div className="relative w-full aspect-square flex items-center justify-center bg-transparent rounded-[40px] border border-white/5 overflow-hidden">
      <div ref={containerRef} className="w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: svgContent }} />
      <AnimatePresence>
        {hoveredDistrict && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-10 bg-[#FDFCF0] text-black px-5 py-1.5 rounded-full z-[50] pointer-events-none shadow-xl border border-black/10"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">{hoveredDistrict}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}