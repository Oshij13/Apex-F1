import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
  Loader2,
  Wind,
  Thermometer,
  Droplets,
  Maximize2,
  X,
  ChevronRight,
  Zap,
  Target,
  Activity,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { drivers } from "@/lib/f1-data";
import { TireBadge } from "@/components/TireBadge";
import type { Tire } from "@/lib/f1-data";

interface DriverData {
  x: number[];
  y: number[];
  v: number[];
  d: number[];
  th: number[];
  br: number[];
  lap: number[];
  age: number[];
  comp: string[];
  t_end: number;
  stints: {
    stint: number;
    compound: string;
    start_lap: number;
    end_lap: number;
    initial_age: number;
  }[];
  pit_stops: { type: "in" | "out"; lap: number; t: number }[];
  final_status: string;
  final_pos: number;
  team: string;
  color: string;
}

interface SimulationData {
  event: string;
  track_path: { x: number; y: number }[];
  drs_zones?: {
    path: { x: number; y: number }[];
  }[];
  aspect_ratio: number;
  drivers: Record<string, DriverData>;
  weather?: Record<string, number[]>;
  track_status?: { t: number; status: string; message: string }[];
  total_laps: number;
  fps: number;
  duration: number;
}

interface RaceSimulationProps {
  year: number;
  round: number;
}

export const RaceSimulation: React.FC<RaceSimulationProps> = ({
  year,
  round,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<SimulationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingTimer, setLoadingTimer] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLiveMode, setIsLiveMode] = useState(false);

  // Playback State
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const requestRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number | undefined>(undefined);

  // Notification State
  const [notification, setNotification] = useState<{
    message: string;
    type: "incident" | "pit" | "sc";
  } | null>(null);
  const [activeStatus, setActiveStatus] = useState<string | null>(null);
  const lastPitStatus = useRef<Record<string, boolean>>({});

  // Control States
  const [showDRS, setShowDRS] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(true);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);

  // 1. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:8000/api/telemetry/${year}/${round}`,
        );
        if (!res.ok) throw new Error("Failed to fetch telemetry");
        const json = await res.json();
        console.log("Telemetry Data Loaded:", {
          event: json.event,
          hasDRSZones: !!json.drs_zones,
          drsCount: json.drs_zones?.length || 0
        });
        setData(json);
        setCurrentTime(0);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [year, round]);

  // 1b. Loading Timer Logic
  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setLoadingTimer(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // 3. Status & Pit Notification Logic
  useEffect(() => {
    if (!data) return;

    // 3a. Track Status / Incidents
    const statuses = data.track_status || [];
    let currentS = null;
    for (let i = statuses.length - 1; i >= 0; i--) {
      if (currentTime >= statuses[i].t) {
        currentS = statuses[i];
        break;
      }
    }

    if (currentS && currentS.status !== activeStatus) {
      setActiveStatus(currentS.status);

      // Filter logic: Only show meaningful cards, suppress "VSC Deployed" if we can show "YELLOW FLAG"
      // User specifically wants the "Red Card" style for Yellow Flags/Incidents
      if (currentS.status !== "1") {
        const isVSC = currentS.status === "6" || currentS.status === "7";
        const isSC = currentS.status === "4";

        // Detailed involvement detection
        const involvedData = Object.entries(data.drivers)
          .filter(([_, d]) => {
            const isDNF =
              !d.final_status.includes("Finished") &&
              !d.final_status.includes("+") &&
              !d.final_status.includes("Lap");
            // Broaden window for end-of-race incidents
            const timeDiff = Math.abs(d.t_end - (currentS?.t || 0));
            return isDNF && timeDiff < 120;
          })
          .map(([code, d]) => {
            const driver = drivers.find((drv) => drv.code === code);
            const name = driver ? driver.lastName : code;

            // Extract core issue
            let reason = d.final_status.toUpperCase();
            if (reason.includes("SPUN")) reason = "SKIDDED";
            else if (reason.includes("ACCIDENT")) reason = "ACCIDENT";
            else if (reason.includes("COLLISION")) reason = "COLLISION";
            // Common fallbacks for "Retired" if we know it's a Power Unit race (like HAM in Aus 24)
            else if (
              reason === "RETIRED" &&
              code === "HAM" &&
              year === 2024 &&
              round === 3
            )
              reason = "POWER UNIT";

            return { name, reason };
          });

        const involvementText =
          involvedData.length > 0
            ? ` (${involvedData.map((i) => `${i.name} ${i.reason}`).join(", ")})`
            : "";

        // Override message: if it's VSC/SC, user wants "YELLOW FLAG" instead
        let finalMessage = currentS.message;
        if (isVSC || isSC || currentS.status === "2") {
          finalMessage = `YELLOW FLAG${involvementText}`;
        } else if (currentS.status === "5") {
          finalMessage = `RED FLAG${involvementText}`;
        }

        setNotification({
          message: finalMessage,
          type: "incident",
        });

        setTimeout(() => setNotification(null), 15000);
      }
    }

    // 3b. Pit Notifications
    Object.entries(data.drivers).forEach(([code, d]) => {
      const pitIn = d.pit_stops.find(
        (ps) => ps.type === "in" && Math.abs(currentTime - ps.t) < 0.5,
      );
      if (pitIn && !lastPitStatus.current[code]) {
        const nextStint = [...d.stints]
          .reverse()
          .find((s) => pitIn.lap + 1 >= s.start_lap);
        const driver = drivers.find((drv) => drv.code === code);

        const compoundNames: Record<string, string> = {
          S: "SOFT",
          M: "MEDIUM",
          H: "HARD",
          I: "INTERMEDIATE",
          W: "WET",
        };
        const compName = compoundNames[nextStint?.compound || ""] || "new";

        setNotification({
          message: `${driver?.lastName || code} PITTING — Switched to ${compName} tires`,
          type: "pit",
        });
        setTimeout(() => setNotification(null), 10000);
        lastPitStatus.current[code] = true;
      } else if (!pitIn) {
        lastPitStatus.current[code] = false;
      }
    });
  }, [currentTime, data, activeStatus]);

  // 2. Animation Loop
  const animate = (time: number) => {
    if (lastTimeRef.current !== undefined) {
      const deltaTime = (time - lastTimeRef.current) / 1000;
      setCurrentTime((prev) => {
        const totalDuration = data?.duration || 1;
        // User wants 30x to finish in 60s.
        // multiplier = (totalDuration / 60) * (playbackSpeed / 30)
        let actualSpeed = playbackSpeed;
        if (playbackSpeed > 1) {
          actualSpeed = (totalDuration / 60) * (playbackSpeed / 30);
        }

        const next = prev + deltaTime * actualSpeed;
        if (totalDuration > 0 && next >= totalDuration) {
          setIsPlaying(false);
          return totalDuration;
        }
        return next;
      });
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      lastTimeRef.current = undefined;
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, playbackSpeed, data]);

  const currentFrame = useMemo(() => {
    if (!data) return null;
    const time = currentTime;
    const idx = time * data.fps;
    const i1 = Math.floor(idx);
    const i2 = Math.min(i1 + 1, Math.floor(data.duration * data.fps));
    const alpha = idx - i1;

    const frameDrivers: Record<string, any> = {};
    Object.entries(data.drivers).forEach(([code, d]) => {
      const p1 = Math.min(i1, d.x.length - 1);
      const p2 = Math.min(i2, d.x.length - 1);

      const lerp = (a: number, b: number) => a + (b - a) * alpha;

      if (p1 >= 0) {
        // Official DNF check: Status must not contain "Finished", "+", or "Lap"
        const isOfficialDNF =
          !d.final_status.includes("Finished") &&
          !d.final_status.includes("+") &&
          !d.final_status.includes("Lap");
        // Fix DNF/DNS logic: finishers are always active
        const is_active = isOfficialDNF ? currentTime <= d.t_end : true;

        const currentLap = d.lap[p1];
        const currentStint = [...d.stints]
          .reverse()
          .find((s) => currentLap >= s.start_lap);

        // Calculate Age based on Stint start to ensure instant snap on pit exit
        const calculatedAge = currentStint
          ? Math.max(1, currentLap - currentStint.start_lap + currentStint.initial_age)
          : d.age?.[p1] || 1;

        // Precise Pit Status
        let is_pitting = false;
        try {
          is_pitting = d.pit_stops.some((ps) => {
            if (ps.type === "in") {
              const nextOut = d.pit_stops.find(
                (o) => o.type === "out" && o.t > ps.t,
              );
              return (
                currentTime >= ps.t &&
                (nextOut ? currentTime <= nextOut.t : currentTime <= ps.t + 25)
              );
            }
            return false;
          });
        } catch (e) {
          /* fail-safe */
        }

        frameDrivers[code] = {
          x: lerp(d.x[p1], d.x[p2]),
          y: lerp(d.y[p1], d.y[p2]),
          v: lerp(d.v[p1], d.v[p2]),
          d: lerp(d.d[p1], d.d[p2]),
          th: d.th[p1],
          br: d.br[p1],
          lap: currentLap,
          age: calculatedAge,
          compound: d.comp?.[p1] || "M",
          is_active,
          is_pitting,
          final_pos: d.final_pos,
          team: d.team,
          color: d.color,
        };
      }
    });

    const weatherFrame: Record<string, number> = {};
    if (data.weather) {
      Object.entries(data.weather).forEach(([key, values]) => {
        weatherFrame[key] = values[i1] || 0;
      });
    }

    return {
      t: currentTime,
      drivers: frameDrivers,
      weather: weatherFrame,
    };
  }, [currentTime, data]);

  const leaderboard = useMemo(() => {
    if (!currentFrame) return [];
    const totalDuration = data?.duration || 1;
    const isRaceOver = currentTime >= totalDuration - 5; // Use official results if near the end

    const sorted = Object.entries(currentFrame.drivers)
      .map(([code, d]) => ({ code, ...d }))
      .sort((a, b) => {
        // 1. Active drivers always stay above inactive ones (DNF/DNS)
        if (a.is_active && !b.is_active) return -1;
        if (!a.is_active && b.is_active) return 1;

        // 2. If both are active, sort by track distance (live leaderboard)
        if (a.is_active && b.is_active) {
          if (isRaceOver) return a.final_pos - b.final_pos;
          return b.d - a.d;
        }

        // 3. If both are inactive, sort by their final finishing order
        return a.final_pos - b.final_pos;
      });

    // Auto-select top 3 if nothing selected
    if (selectedDrivers.length === 0 && sorted.length > 0) {
      setSelectedDrivers(sorted.slice(0, 3).map(d => d.code));
    }

    return sorted;
  }, [currentFrame, currentTime, data, selectedDrivers.length]);

  const sessionLap = useMemo(() => {
    if (!currentFrame) return 1;
    const laps = Object.values(currentFrame.drivers)
      .filter((d: any) => d.is_active)
      .map((d: any) => d.lap || 1);
    return laps.length > 0 ? Math.max(...laps) : 1;
  }, [currentFrame]);

  // 4. Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === "Space") setIsPlaying((prev) => !prev);
      if (e.code === "KeyR") setCurrentTime(0);
      if (e.code === "KeyD") {
        console.log("DRS Toggle pressed");
        setShowDRS((prev) => !prev);
        // Quick visual flash or alert for feedback
        if (!showDRS) console.warn("--- DRS VISUALS ENABLED ---");
      }
      if (e.code === "KeyB") {
        console.log("Progress Bar Toggle pressed");
        setShowProgressBar((prev) => !prev);
      }

      // Speed Controls
      if (e.code === "ArrowUp") setPlaybackSpeed(prev => prev + 0.5);
      if (e.code === "ArrowDown") setPlaybackSpeed(prev => Math.max(0.5, prev - 0.5));

      // Time Controls
      if (e.code === "ArrowRight") setCurrentTime(prev => Math.min(data?.duration || prev, prev + 10));
      if (e.code === "ArrowLeft") setCurrentTime(prev => Math.max(0, prev - 10));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [data?.duration]);

  // 5. Fullscreen Logic
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsLiveMode(true);
    } else {
      document.exitFullscreen();
      setIsLiveMode(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      if (!document.fullscreenElement) setIsLiveMode(false);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // 6. Canvas Render (Exactly like the Analog Reference Image)
  useEffect(() => {
    if (!canvasRef.current || !data || !currentFrame) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Pure Black Background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const margin = 100;
    const canvasW = canvas.width - margin * 2;
    const canvasH = canvas.height - margin * 2;

    let drawW = canvasW;
    let drawH = canvasH;
    let offsetX = 0;
    let offsetY = 0;

    const trackRatio = data.aspect_ratio || 1;
    const canvasRatio = canvasW / canvasH;

    if (trackRatio > canvasRatio) {
      // Track is wider than canvas
      drawH = canvasW / trackRatio;
      offsetY = (canvasH - drawH) / 2;
    } else {
      // Track is taller than canvas
      drawW = canvasH * trackRatio;
      offsetX = (canvasW - drawW) / 2;
    }

    const finalMarginX = margin + offsetX;
    const finalMarginY = margin + offsetY;

    // 1. High Quality Track Base (Darker, realistic asphalt feel)
    ctx.beginPath();
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 24;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    data.track_path.forEach((p, i) => {
      const x = finalMarginX + p.x * drawW;
      const y = finalMarginY + p.y * drawH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 2. Track Road (Medium grey)
    ctx.beginPath();
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 18;
    data.track_path.forEach((p, i) => {
      const x = finalMarginX + p.x * drawW;
      const y = finalMarginY + p.y * drawH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 3. High-Contrast Track Outlines (Bright White)
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1.5;
    data.track_path.forEach((p, i) => {
      const x = finalMarginX + p.x * drawW;
      const y = finalMarginY + p.y * drawH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // 4. DRS Zones (Vibrant Blue Glow on Track) - MOVED TO TOP LAYER
    if (showDRS && data.drs_zones && data.drs_zones.length > 0) {
      data.drs_zones.forEach((zone: any, zIdx: number) => {
        if (!zone.path || zone.path.length < 2) return;

        console.log(`Rendering DRS Zone ${zIdx}, points: ${zone.path.length}`);

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0, 100, 255, 0.8)"; // Solid Bright Blue
        ctx.lineWidth = 22; // Very thick
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Strong Glow
        ctx.shadowBlur = 25;
        ctx.shadowColor = "rgba(0, 100, 255, 1)";

        zone.path.forEach((p: any, i: number) => {
          const x = finalMarginX + p.x * drawW;
          const y = finalMarginY + p.y * drawH;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Sharp inner line
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 4;
        ctx.shadowBlur = 0;
        ctx.stroke();

        // Label
        const startP = zone.path[0];
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 12px sans-serif";
        ctx.fillText(
          "DRS ACTIVATION",
          finalMarginX + startP.x * drawW,
          finalMarginY + startP.y * drawH - 25,
        );
        ctx.restore();
      });
    }

    // DIAGNOSTIC: Draw a red circle at the start line if showDRS is true
    if (showDRS) {
      // On-screen data check
      ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
      ctx.fillRect(20, 20, 120, 40);
      ctx.fillStyle = "white";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText(`DRS Zones: ${data.drs_zones?.length || 0}`, 30, 45);

      ctx.beginPath();
      ctx.arc(finalMarginX + data.track_path[0].x * drawW, finalMarginY + data.track_path[0].y * drawH, 40, 0, Math.PI * 2);
      ctx.strokeStyle = "red";
      ctx.lineWidth = 6;
      ctx.stroke();

      ctx.fillStyle = "red";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("DRS MODE ACTIVE", finalMarginX + data.track_path[0].x * drawW - 80, finalMarginY + data.track_path[0].y * drawH - 50);
    }

    // 4. Start/Finish Line (Bright Red/White Checkered Style)
    if (data.track_path.length > 0) {
      const p = data.track_path[0];
      const x = finalMarginX + p.x * drawW;
      const y = finalMarginY + p.y * drawH;

      ctx.save();
      ctx.translate(x, y);
      // Draw a proper line
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-15, -15);
      ctx.lineTo(15, 15);
      ctx.stroke();

      ctx.strokeStyle = "#FF0000";
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(-15, -15);
      ctx.lineTo(15, 15);
      ctx.stroke();
      ctx.restore();
    }

    // Draw Drivers (Bright High-Contrast Dots)
    leaderboard.forEach((d) => {
      const x = finalMarginX + d.x * drawW;
      const y = finalMarginY + d.y * drawH;

      // Outer Ring for visibility
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.fill();

      // Main Dot
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = d.color;
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();

      // Sharp Label (White text with black outline for readability)
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";

      // Text Background/Glow
      ctx.shadowBlur = 4;
      ctx.shadowColor = "black";
      ctx.fillStyle = selectedDrivers.includes(d.code) ? "#00FF00" : "#FFFFFF";
      ctx.fillText(d.code, x, y - 12);
      ctx.shadowBlur = 0;

      // Draw active DRS indicator
      if (showDRS && d.drs) {
        ctx.strokeStyle = "#00FFFF";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  }, [currentFrame, data, leaderboard, selectedDrivers, showDRS]);

  if (loading)
    return (
      <div className="flex h-[600px] flex-col items-center justify-center gap-4 rounded-xl border border-border bg-surface-1">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
          <div className="absolute font-mono text-[10px] font-bold text-primary">
            {loadingTimer}s
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-white">
            Initializing Race Simulations
          </p>
          <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-widest animate-pulse">
            Fetching Telemetry & Satellite Data...
          </p>
          <p className="text-[9px] text-primary/40 mt-4 uppercase tracking-[0.1em]">
            This process typically takes 60 seconds to reload the race
          </p>
        </div>
      </div>
    );

  if (error)
    return <div className="p-12 text-center text-red-400">Error: {error}</div>;

  return (
    <div ref={containerRef} className="w-full">
      {!isLiveMode ? (
        <div className="relative h-[600px] w-full overflow-hidden rounded-2xl border border-border bg-surface-1 group">
          <div className="flex h-full flex-col items-center justify-center p-12 text-center">
            <div className="mb-6 rounded-full bg-primary/10 p-5 text-primary">
              <Zap size={48} fill="currentColor" />
            </div>
            <h3 className="text-3xl font-display uppercase tracking-wider text-white">
              Race Simulations Ready
            </h3>
            <p className="mt-2 text-sm text-muted-foreground uppercase tracking-[0.3em]">
              Session: {data?.event}
            </p>
            <button
              onClick={toggleFullscreen}
              className="mt-12 flex items-center gap-3 rounded-full bg-primary px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:scale-105 shadow-xl"
            >
              Launch Reference Replay <ChevronRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 z-[9999] flex bg-[#000000] overflow-hidden font-sans select-none text-white p-6">
          {/* NOTIFICATION OVERLAY */}
          {notification && (
            <div
              className={`absolute top-24 left-1/2 -translate-x-1/2 z-[100] px-8 py-5 rounded-xl border-4 animate-in slide-in-from-top-4 fade-in zoom-in duration-500 flex items-center gap-6 ${notification.type === "pit"
                ? "bg-blue-600 border-blue-400 shadow-[0_0_40px_rgba(37,99,235,0.5)]"
                : "bg-red-600 border-red-400 shadow-[0_0_40px_rgba(220,38,38,0.5)]"
                }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 animate-pulse">
                {notification.type === "pit" ? (
                  <Target className="text-white" size={32} />
                ) : (
                  <Activity className="text-white" size={32} />
                )}
              </div>
              <div className="text-3xl font-black uppercase tracking-tighter text-white drop-shadow-2xl font-display">
                {notification.message}
              </div>
            </div>
          )}

          {/* PERSISTENT SAFETY CAR INDICATOR */}
          {(activeStatus === "4" || activeStatus === "6") && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-yellow-500 text-black px-8 py-2.5 rounded-full font-black animate-pulse shadow-[0_0_20px_rgba(234,179,8,0.5)] border-2 border-yellow-300">
              <Zap size={20} fill="black" />{" "}
              {activeStatus === "4" ? "SAFETY CAR" : "VIRTUAL SAFETY CAR"}{" "}
              DEPLOYED
            </div>
          )}

          {/* CENTER: TRACK */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <canvas
              ref={canvasRef}
              width={2000}
              height={1200}
              className="w-full h-full object-contain"
            />
          </div>

          {/* TOP CENTER: LAP COUNT */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-center">
            <p className="text-2xl font-bold">
              Lap: {sessionLap}/{data?.total_laps}
            </p>
            <p className="text-sm opacity-80">
              Race Time:{" "}
              {new Date(currentTime * 1000).toISOString().substr(11, 8)} (x
              {playbackSpeed.toFixed(1)})
            </p>
          </div>

          {/* LEFT PANEL: WEATHER, CARDS, CONTROLS */}
          <div className="absolute top-6 left-6 z-20 bottom-6 flex flex-col w-[220px]">
            <div className="space-y-1 text-[11px] opacity-90 mb-4">
              <p className="font-bold mb-1 text-sm">Race Conditions</p>
              <div className="flex items-center gap-2">
                🌡️ Track: {currentFrame?.weather?.TrackTemp?.toFixed(1) || "—"}
                °C
              </div>
              <div className="flex items-center gap-2">
                🌡️ Air: {currentFrame?.weather?.AirTemp?.toFixed(1) || "—"}°C
              </div>
              <div className="flex items-center gap-2">
                💧 Humidity:{" "}
                {currentFrame?.weather?.Humidity?.toFixed(0) || "—"}%
              </div>
              <div className="flex items-center gap-2">
                💨 Wind: {currentFrame?.weather?.WindSpeed?.toFixed(1) || "—"}{" "}
                km/h
              </div>
              <div className="flex items-center gap-2">
                🌧️ Rain: {currentFrame?.weather?.Rainfall ? "WET" : "DRY"}
              </div>
            </div>

            {/* DRIVER CARDS */}
            <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
              {leaderboard
                .filter(d => selectedDrivers.includes(d.code))
                .sort((a, b) => selectedDrivers.indexOf(a.code) - selectedDrivers.indexOf(b.code))
                .map((d) => (
                  <div
                    key={d.code}
                    className="border bg-black shadow-lg"
                    style={{ borderColor: d.color }}
                  >
                    <div
                      className="px-2 py-0.5 text-[11px] font-bold uppercase text-black flex justify-between items-center"
                      style={{ backgroundColor: d.color }}
                    >
                      <span>
                        {(() => {
                          const driver = drivers.find(
                            (drv) => drv.code === d.code,
                          );
                          return driver ? (
                            <span className="font-bold">
                              {driver.lastName}
                            </span>
                          ) : (
                            d.code
                          );
                        })()}
                      </span>
                      <span className="text-[9px] opacity-60">{d.team}</span>
                    </div>
                    <div className="p-2 flex justify-between h-[80px]">
                      <div className="space-y-0.5 text-[10px]">
                        <p>Speed: {Math.floor(d.v)} km/h</p>
                        <p>Gear: {d.g}</p>
                        <p>DRS: {d.drs ? "ON" : "OFF"}</p>
                      </div>

                      <div className="flex gap-1.5 h-full items-end pb-1">
                        <div className="flex flex-col items-center gap-0.5 h-full">
                          <div className="w-2.5 h-full bg-[#222] relative">
                            <div
                              className="absolute bottom-0 w-full bg-[#00FF00]"
                              style={{ height: `${d.th}%` }}
                            />
                          </div>
                          <span className="text-[6px] opacity-60">THR</span>
                        </div>
                        <div className="flex flex-col items-center gap-0.5 h-full">
                          <div className="w-2.5 h-full bg-[#222] relative">
                            <div
                              className="absolute bottom-0 w-full bg-[#AAAAAA]"
                              style={{ height: `${d.br}%` }}
                            />
                          </div>
                          <span className="text-[6px] opacity-60">BRK</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* CONTROLS */}
            <div className="text-[9px] font-mono leading-relaxed mt-4 opacity-80">
              <p className="font-bold text-[10px] mb-1">Controls:</p>
              <p>[SPACE] Pause/Resume</p>
              <p>[←/→] Rewind / FastForward</p>
              <p>[↑/↓] Speed +/-</p>
              <p>[R] Restart</p>
              <p>[D] Toggle DRS Zones</p>
              <p>[B] Toggle Progress Bar</p>
              <p>[Shift + Click] Select Drivers</p>
            </div>
          </div>

          {/* RIGHT PANEL: LEADERBOARD */}
          <div className="absolute top-6 right-6 z-20 w-[200px] bottom-16 flex flex-col">
            <p className="text-sm font-bold mb-2">Leaderboard</p>
            <div className="space-y-0 text-[11px] font-bold overflow-y-auto custom-scrollbar pr-2 flex-1">
              {leaderboard.map((d, i) => {
                const isDNF = !d.is_active;
                return (
                  <div
                    key={d.code}
                    onClick={(e) => {
                      if (e.shiftKey) {
                        setSelectedDrivers(prev =>
                          prev.includes(d.code)
                            ? prev.filter(c => c !== d.code)
                            : [...prev, d.code].slice(-3) // Max 3 for UI space
                        );
                      } else {
                        setSelectedDrivers([d.code]);
                      }
                    }}
                    className={`flex justify-between items-center py-0.5 group cursor-pointer hover:bg-white/10 ${isDNF ? "opacity-40 grayscale" : ""} ${selectedDrivers.includes(d.code) ? "bg-white/5" : ""}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 text-right opacity-60">
                        {i + 1}.
                      </span>
                      {(() => {
                        const driver = drivers.find(
                          (drv) => drv.code === d.code,
                        );
                        return driver ? (
                          <span
                            style={{ color: d.color }}
                          >
                            {driver.lastName.toUpperCase()}
                          </span>
                        ) : (
                          <span style={{ color: d.color }}>{d.code}</span>
                        );
                      })()}
                      {isDNF && (
                        <span className="text-[8px] text-yellow-500 ml-1 font-bold">
                          {d.final_status
                            ?.toUpperCase()
                            .includes("DID NOT START")
                            ? "DNS"
                            : d.final_status
                              ?.toUpperCase()
                              .includes("DISQUALIFIED")
                              ? "DSQ"
                              : "DNF"}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {!isDNF && (
                        <div className="flex items-center gap-1">
                          {/* Diagnostic DRS indicator for the active driver */}
                          {d.drs && <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse border border-white" />}
                          <TireBadge
                            compound={(d.is_pitting ? "P" : d.compound?.charAt(0).toUpperCase()) as any}
                            age={d.age}
                            size="sm"
                          />
                        </div>
                      )}
                      <span className="w-12 text-right opacity-80 font-mono">
                        {isDNF ? (
                          ""
                        ) : d.is_pitting ? (
                          <span className="text-blue-400 font-bold">PS</span>
                        ) : i === 0 ? (
                          "INTERVAL"
                        ) : (
                          `+${((leaderboard[0].d - d.d) / 100).toFixed(1)}s`
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BOTTOM CENTER: PLAYBACK & PROGRESS */}
          <div className="absolute bottom-6 left-[260px] right-[240px] flex flex-col items-center gap-4 z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentTime(Math.max(0, currentTime - 5))}
                className="w-7 h-7 bg-[#222] rounded-full flex items-center justify-center opacity-80 hover:opacity-100"
              >
                <Rewind size={12} />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-9 h-9 bg-[#222] rounded-full flex items-center justify-center opacity-80 hover:opacity-100"
              >
                {isPlaying ? (
                  <Pause size={14} />
                ) : (
                  <Play size={14} className="ml-0.5" />
                )}
              </button>
              <button
                onClick={() => setCurrentTime(currentTime + 5)}
                className="w-7 h-7 bg-[#222] rounded-full flex items-center justify-center opacity-80 hover:opacity-100"
              >
                <FastForward size={12} />
              </button>
              <div className="flex items-center gap-2 bg-[#222] rounded px-2 py-1 ml-4 h-7">
                <button
                  onClick={() =>
                    setPlaybackSpeed(Math.max(0.5, playbackSpeed - 0.5))
                  }
                  className="opacity-60 hover:opacity-100"
                >
                  -
                </button>
                <span className="text-[10px] font-bold w-8 text-center">
                  {playbackSpeed.toFixed(1)}x
                </span>
                <button
                  onClick={() => setPlaybackSpeed(playbackSpeed + 0.5)}
                  className="opacity-60 hover:opacity-100"
                >
                  +
                </button>
              </div>
              <button
                onClick={toggleFullscreen}
                className="opacity-40 hover:opacity-100 ml-4"
              >
                <Maximize2 size={14} />
              </button>
            </div>
            <div className={`w-full transition-opacity duration-300 ${showProgressBar ? 'opacity-100' : 'opacity-0'}`}>
              <div className="h-3 w-full bg-green-900 border border-[#333] relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-[#00FF00] z-10 transition-all duration-300"
                  style={{
                    width: `${((currentFrame?.drivers[leaderboard[0]?.code]?.lap || 0) / (data?.total_laps || 1)) * 100}%`,
                  }}
                />

                {data?.track_status?.map((statusObj: any, idx: number) => {
                  if (statusObj.status === "1") return null; // Track Clear

                  const totalTime = data?.duration || 1;
                  const leftPercent = Math.max(
                    0,
                    (statusObj.t / totalTime) * 100,
                  );

                  const nextStatus = data?.track_status?.[idx + 1];
                  const endT = nextStatus ? nextStatus.t : statusObj.t + 30; // 30s default minimum width
                  const widthPercent = Math.max(
                    0.2,
                    ((endT - statusObj.t) / totalTime) * 100,
                  );

                  let color = "transparent";
                  if (statusObj.status === "2") color = "rgb(234, 179, 8)"; // Yellow
                  if (statusObj.status === "4") color = "white"; // SC
                  if (statusObj.status === "5") color = "red"; // Red
                  if (statusObj.status === "6") color = "rgb(249, 115, 22)"; // VSC
                  if (statusObj.status === "7") color = "rgb(249, 115, 22)"; // VSC Ending

                  if (color === "transparent") return null;

                  return (
                    <div
                      key={idx}
                      className="absolute top-0 h-[3px] z-20"
                      title={statusObj.message}
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                        backgroundColor: color,
                      }}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-[8px] opacity-60 mt-1 px-1">
                {(() => {
                  const laps = data?.total_laps || 50;
                  const step = Math.max(5, Math.ceil(laps / 10));
                  const ticks = [];
                  for (let i = 1; i < laps; i += step) ticks.push(i);
                  ticks.push(laps);
                  return ticks.map((t) => <span key={t}>{t}</span>);
                })()}
              </div>
            </div>
          </div>

          {/* BOTTOM RIGHT: LEGEND */}
          <div className="absolute bottom-6 right-6 flex items-center gap-3 text-[8px] font-bold opacity-60 z-20">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-yellow-500" /> YELLOW
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-red-500" /> RED
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-white" /> SC
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-orange-500" /> VSC
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
