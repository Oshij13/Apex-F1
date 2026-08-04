import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  onComplete?: () => void;
}

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden">
      <div className="relative w-full max-w-4xl px-10">
        {/* THE CAR CONTAINER - Moving across the screen */}
        <div className="relative h-16 w-full overflow-hidden">
          <div className="absolute bottom-0 left-0 animate-sprint flex items-end">
            {/* F1 CAR SIDE VIEW SVG */}
            <svg
              width="120"
              height="40"
              viewBox="0 0 120 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_4px_10px_rgba(225,6,0,0.4)]"
            >
              {/* Main Body */}
              <path
                d="M10 32 L30 32 L40 25 L85 25 L100 32 L115 32 L118 30 L100 20 L40 20 L20 28 L10 28 Z"
                fill="#E10600"
              />
              {/* Rear Wing */}
              <path d="M5 15 L25 15 L25 18 L5 18 Z" fill="#E10600" />
              <path d="M10 15 L10 28" stroke="#E10600" strokeWidth="2" />
              {/* Front Wing */}
              <path d="M105 32 L118 32 L118 34 L105 34 Z" fill="#333" />
              {/* Tyres */}
              <circle
                cx="28"
                cy="32"
                r="6"
                fill="#111"
                stroke="#333"
                strokeWidth="1"
              />
              <circle
                cx="95"
                cy="32"
                r="6"
                fill="#111"
                stroke="#333"
                strokeWidth="1"
              />
              {/* Cockpit / Halo */}
              <path
                d="M55 20 C55 15 70 15 70 20"
                stroke="#111"
                strokeWidth="2"
                fill="none"
              />
            </svg>

            {/* EXHAUST SMOKE / SPEED LINES */}
            <div className="flex gap-1 mb-1 ml-[-10px]">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[2px] bg-primary/40 rounded-full animate-pulse"
                  style={{
                    width: `${20 - i * 5}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* THE TRACK LINE */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

        {/* LOADING TEXT - BELOW THE LINE */}
        <div className="mt-6 text-center">
          <div className="font-display text-lg tracking-[0.4em] text-foreground uppercase animate-pulse">
            Loading Apex Data
          </div>
          <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 italic">
            Synchronizing with 2026 Season Feed...
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes sprint {
          0% { transform: translateX(-150px); }
          30% { transform: translateX(20%); }
          70% { transform: translateX(80%); }
          100% { transform: translateX(calc(100% + 150px)); }
        }
        .animate-sprint {
          animation: sprint 1.2s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
          width: 100%;
        }
      `,
        }}
      />
    </div>
  );
}
