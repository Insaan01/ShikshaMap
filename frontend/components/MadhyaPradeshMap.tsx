"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DistrictMapProps {
  stateName: string;
  hoveredDistrict: string | null;
  setHoveredDistrict: (district: string | null) => void;
  onDistrictClick: (district: string) => void;
}

// Map the raw SVG path IDs to their real district names
// Keep the keys lowercase for consistent matching
const DISTRICT_ID_TO_NAME: Record<string, string> = {
  path4959: "Bhopal",
  path3007: "Indore",
  path2102: "Gwalior",
  path5512: "Jabalpur",
  path4917: "Ujjain",
  path4919: "Sagar",
  path4921: "Rewa",
  path4923: "Satna",
  path4925: "Khandwa",
  path4927: "Khargone",
  path4929: "Burhanpur",
  path4933: "Chhindwara",
  path4935: "Seoni",
  path4937: "Balaghat",
  path4939: "Mandla",
  path4941: "Dindori",
  path4943: "Anuppur",
  path4945: "Umaria",
  path4947: "Shahdol",
  path4949: "Katni",
  path4953: "Sidhi",
  path4955: "Singrauli",
  path4957: "Panna",
  path4961: "Damoh",
  path4963: "Chhatarpur",
  path4965: "Tikamgarh",
  path4967: "Niwari",
  path4969: "Datia",
  path4971: "Shivpuri",
  path4973: "Bhind",
  path4981: "Morena",
  path4985: "Sheopur",
  path4987: "Guna",
  path4989: "Ashoknagar",
  path4991: "Vidisha",
  path4993: "Rajgarh",
  path4995: "Sehore",
  path4997: "Raisen",
  path4999: "Hoshangabad",
  path5001: "Betul",
  path5003: "Harda",
  "path4931-1": "Narmadapuram",
  "path4951-9": "Narsinghpur",
  "path4975-1": "Jhabua",
  "path4977-5": "Barwani",
  "path4979-4": "Dhar",
  "path4983-0": "Alirajpur",
  path3583: "Ratlam",
  "path5005-7": "Mandsaur",
  path3184: "Neemuch",
  path3186: "Agar Malwa"
};

export default function DistrictMap({
  stateName,
  hoveredDistrict,
  setHoveredDistrict,
  onDistrictClick,
}: DistrictMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevHoveredIdRef = useRef<string | null>(null);
  const [svgContent, setSvgContent] = useState<string>("");

  // 1. Fetch and clean the SVG dynamically based on the selected state
  useEffect(() => {
    const loadSvg = async () => {
      try {
        const fileName = stateName.toLowerCase().replace(/\s+/g, "-");
        const response = await fetch(`/states/${fileName}.svg`);

        if (response.ok) {
          const text = await response.text();
          const cleanedText = text
            .replace(/<style([\s\S]*?)<\/style>/gi, "")
            .replace(/filter="url\(#.*?\)"/g, "")
            .replace(/<rect[^>]*\/>/gi, "")
            .replace(/<svg[^>]*>/i, (match) => {
              const viewBox = match.match(/viewBox="([^"]+)"/i)?.[1] || "0 0 1000 1000";
              return `<svg viewBox="${viewBox}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style="background:transparent; overflow:visible; filter: drop-shadow(0 10px 30px rgba(0,0,0,0.5));">`;
            });
          setSvgContent(cleanedText);
        }
      } catch (e) {
        console.error("SVG Load Error:", e);
      }
    };
    loadSvg();
  }, [stateName]);

  // 2. Styling Helpers
  const applyHoverStyle = (path: SVGPathElement) => {
    path.parentNode?.appendChild(path); // Bring to front
    path.style.fill = "#138808";
    path.style.fillOpacity = "0.8";
    path.style.stroke = "#FFFFFF";
    path.style.strokeWidth = "1.5px";
    path.style.filter = "drop-shadow(0px 8px 16px rgba(0,0,0,0.8)) brightness(1.15)";
  };

  const applyDefaultStyle = (path: SVGPathElement) => {
    path.style.fill = "#FDFCF0";
    path.style.fillOpacity = "0.15";
    path.style.stroke = "rgba(253, 252, 240, 0.4)";
    path.style.strokeWidth = "0.5px";
    path.style.filter = "none";
  };

  // 3. Initial SVG Setup (Run once when SVG content loads)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const svg = container.querySelector("svg");
    if (!svg) return;

    const paths = svg.querySelectorAll("path");
    paths.forEach((path) => {
      const rawId = (path.getAttribute("id") || path.getAttribute("name") || "").toLowerCase();
      const districtName = DISTRICT_ID_TO_NAME[rawId] || rawId;

      // Hide borders and unknown shapes
      if (!districtName || districtName.length < 3 || districtName.includes("border") || districtName.includes("_")) {
        path.style.display = "none";
        return;
      }

      applyDefaultStyle(path);
      path.style.cursor = "pointer";
      path.style.transition = "fill 0.2s ease, stroke 0.2s ease, filter 0.2s ease";
    });
  }, [svgContent]);

  // 4. Handle External State Changes (Updates styles when hoveredDistrict changes)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const svg = container.querySelector("svg");
    if (!svg) return;

    const prevId = prevHoveredIdRef.current;
    // Find the SVG ID based on the current hovered district name
    const currentId = hoveredDistrict
      ? Object.keys(DISTRICT_ID_TO_NAME).find((k) => DISTRICT_ID_TO_NAME[k] === hoveredDistrict) || null
      : null;

    if (prevId && prevId !== currentId) {
      const prevPath = svg.querySelector(`path[id="${prevId}"]`);
      if (prevPath) applyDefaultStyle(prevPath as SVGPathElement);
    }

    if (currentId) {
      const currentPath = svg.querySelector(`path[id="${currentId}"]`);
      if (currentPath) applyHoverStyle(currentPath as SVGPathElement);
    }

    prevHoveredIdRef.current = currentId;
  }, [hoveredDistrict]);

  // 5. Event Delegation (Attached to wrapper div to prevent glitches)
  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as SVGElement;
    if (target.tagName.toLowerCase() === "path") {
      const rawId = (target.getAttribute("id") || target.getAttribute("name") || "").toLowerCase();
      const districtName = DISTRICT_ID_TO_NAME[rawId];

      if (districtName && districtName !== hoveredDistrict) {
        setHoveredDistrict(districtName); // Passes state up to LandingPage to show stats!
      }
    }
  };

  const handleMouseLeave = () => {
    setHoveredDistrict(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as SVGElement;
    if (target.tagName.toLowerCase() === "path") {
      const rawId = (target.getAttribute("id") || target.getAttribute("name") || "").toLowerCase();
      const districtName = DISTRICT_ID_TO_NAME[rawId] || rawId;

      if (districtName && !districtName.includes("border") && !districtName.includes("_")) {
        console.log(`Clicked SVG Path ID: "${rawId}" -> Mapped to: "${districtName}"`);
        onDistrictClick(districtName);
      }
    }
  };

  return (
    <div className="relative w-full max-w-[650px] mx-auto aspect-square flex items-center justify-center">
      <div
        ref={containerRef}
        className="w-full h-full [&>svg]:w-full [&>svg]:h-auto flex items-center justify-center"
        onMouseOver={handleMouseOver}
        onClick={handleClick}
        onMouseLeave={handleMouseLeave}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />

      {/* 6. Static Pill Badge (Matches IndiaMap exactly) */}
      <AnimatePresence>
        {hoveredDistrict && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-1 rounded-full border border-white/20 pointer-events-none z-50"
          >
            <p className="text-white text-[10px] font-bold uppercase tracking-widest">
              {hoveredDistrict}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
