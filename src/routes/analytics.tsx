import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { getAISummary } from "@/lib/api";
import { SectionHeader } from "@/components/SectionHeader";
import {
  Cpu,
  Zap,
  Trophy,
  Target,
  Activity,
  History,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Award,
  Database,
  BarChart4,
  Flame,
  Search,
  TrendingUp,
  Clock,
  Gauge,
  BrainCircuit,
  Settings2,
  Maximize2,
  Layout,
  Plus,
  MousePointer2,
  ZoomIn,
  ZoomOut,
  GripVertical,
  X,
  Waves,
  Wind,
  Thermometer,
  Radio,
  Users,
  Fingerprint,
  Microscope,
  Scale,
  Heart,
  ZapOff,
  Anchor,
  Construction,
  HardDrive,
  Share2,
} from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Modular Intelligence Bureau · APEX F1" },
      {
        name: "description",
        content:
          "Interactive whiteboard-style F1 analytics engine with 20+ specialized modules and technical graphing.",
      },
    ],
  }),
  component: AnalyticsPage,
});

// --- TYPES ---
type ModuleInstance = {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  content: any;
  graphData?: any;
};

// --- ANALYTICS ENGINE PAGE ---
function AnalyticsPage() {
  const [loading, setLoading] = useState(false);
  const [researching, setResearching] = useState(false);
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [d1Input, setD1Input] = useState("");
  const [d2Input, setD2Input] = useState("");

  // WHITEBOARD STATE
  const [zoom, setZoom] = useState(0.8);
  const [placedModules, setPlacedModules] = useState<ModuleInstance[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const addLog = useCallback(
    (msg: string) => setLogs((prev) => [...prev.slice(-4), msg]),
    [],
  );

  const spawnModule = (type: string, label: string, customX?: number, customY?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    const content =
      type === "verdict" ? data?.verdict :
      type === "radar" ? data?.radar :
      data?.modules[type] || "No synthesis available for this vector.";
      
    // Generate some synthetic graph data based on the module type
    const graphData = Array.from({ length: 10 }, (_, i) => ({
      x: i,
      v1: 50 + Math.random() * 40,
      v2: 50 + Math.random() * 40,
    }));
    setPlacedModules((prev) => [
      ...prev,
      { 
        id, 
        type, 
        label, 
        x: customX ?? 200, 
        y: customY ?? 200, 
        w: type === "verdict" ? 900 : 480, 
        h: type === "verdict" ? 500 : 420, 
        content, 
        graphData 
      },
    ]);
  };

  const runEngine = async () => {
    setLoading(true);
    setResearching(true);
    setError(null);
    setStep(1);
    setLogs([]);

    try {
      addLog("Step 1: Initializing Neural Registry Lookup...");
      await new Promise((r) => setTimeout(r, 600));
      setStep(2);
      addLog("Step 2: Synthesizing Career Race Records (20+ Vectors)...");
      await new Promise((r) => setTimeout(r, 800));
      setStep(3);
      addLog("Step 3: Analyzing Technical & Psychological Archives...");
      await new Promise((r) => setTimeout(r, 800));
      setStep(4);
      addLog("Step 4: Compiling 20+ Modular Comparison Packets...");

      const prompt = `Perform an ULTRA-HIGH DEPTH technical comparison between ${d1Input} and ${d2Input}.
      CRITICAL: You are a Senior F1 Technical Analyst. You provide exhaustive, high-depth technical comparisons. You write a 250-word dossier with heavy engineering terminology. You strictly follow JSON format.
      CRITICAL FORMATTING: You MUST use double newlines (\\n\\n) between paragraphs.
      CRITICAL LENGTH: The "verdict" must be EXACTLY 4 surgical paragraphs. EACH paragraph MUST be ~60 words. 
      Total verdict length MUST be ~250 words. Provide only the high-impact technical delta.
      Demanded Structure:
      - Paragraph 1 (PHASE 1): Philosophical & Rivalry context. Exhaustively analyze the era-defining mindsets and psychological warfare.
      - Paragraph 2 (PHASE 2): Statistical deep-dive. Use specific career-defining outliers, win ratios, and dominant seasons with high-fidelity technical data.
      - Paragraph 3 (PHASE 3): Engineering Adaptation. Analyze "thermal scrub radius", "MGU-H harvesting", "downforce-to-drag efficiency", and "brake migration".
      - Paragraph 4 (PHASE 4): Definitive technical G.O.A.T synthesis. Provide a final, high-credibility technical verdict on who is superior in specific conditions.

      For EACH module below, provide a unique 3-4 sentence technical audit. No placeholders.
      
      Return ONLY a minified JSON:
      {
        "radar": {"labels": ["Pace", "Quali", "Consistency", "Aggression", "Longevity", "Titles"], "v1": [80,90,70,85,60,50], "v2": [85,80,95,75,90,100]},
        "modules": {
          "tyres": "...", "wet": "...", "fuel": "...", "ers": "...", "braking": "...",
          "gears": "...", "street": "...", "highspeed": "...", "radio": "...", "leadership": "...",
          "strategy": "...", "mentality": "...", "fitness": "...", "media": "...", "development": "...",
          "overtaking": "...", "defence": "...", "consistency": "...", "one_lap": "...", "pressure": "..."
        },
        "d1": {"name": "${d1Input}", "code": "DRV1"},
        "d2": {"name": "${d2Input}", "code": "DRV2"},
        "verdict": "PHASE 1: ... \\n\\nPHASE 2: ... \\n\\nPHASE 3: ... \\n\\nPHASE 4: ..."
      }`;

      const res = await getAISummary(prompt);
      const jsonMatch = res.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Format Mismatch.");
      const parsed = JSON.parse(
        jsonMatch[0].replace(/[\u0000-\u001F\u007F-\u009F]/g, ""),
      );

      addLog("Step 5: Intelligence Matrix Stabilized.");
      setStep(5);
      await new Promise((r) => setTimeout(r, 600));

      setData(parsed);
      setResearching(false);
      setLoading(false);

      setPlacedModules([
        {
          id: "v1",
          type: "verdict",
          label: "Detailed Synthetic Verdict",
          x: 50,
          y: 50,
          w: 900,
          h: 500,
          content: parsed.verdict,
        },
        {
          id: "r1",
          type: "radar",
          label: "Technical Skill Vector",
          x: 50,
          y: 580,
          w: 400,
          h: 420,
          content: parsed.radar,
        },
      ]);
    } catch (e: any) {
      setError(e.message);
      setResearching(false);
      setLoading(false);
    }
  };

  const handleUpdateModule = useCallback((id: string, updates: any) => {
    setPlacedModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    );
  }, []);

  // PANNING LOGIC
  const workspaceRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const panStartPos = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  const onPanStart = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    if ((e.target as HTMLElement).closest(".whiteboard-card")) return; // Don't pan if dragging a card
    
    setIsPanning(true);
    if (workspaceRef.current) {
      panStartPos.current = {
        x: e.clientX,
        y: e.clientY,
        scrollLeft: workspaceRef.current.scrollLeft,
        scrollTop: workspaceRef.current.scrollTop
      };
    }
  };

  useEffect(() => {
    if (!isPanning) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!workspaceRef.current) return;
      const dx = e.clientX - panStartPos.current.x;
      const dy = e.clientY - panStartPos.current.y;
      workspaceRef.current.scrollLeft = panStartPos.current.scrollLeft - dx;
      workspaceRef.current.scrollTop = panStartPos.current.scrollTop - dy;
    };

    const onMouseUp = () => {
      setIsPanning(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isPanning]);

  // DRAG & DROP LOGIC
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("moduleType");
    const label = e.dataTransfer.getData("moduleLabel");
    if (!type || !workspaceRef.current) return;

    const rect = workspaceRef.current.getBoundingClientRect();
    // Adjust for zoom and initial p-2000 offset
    const x = (e.clientX - rect.left + workspaceRef.current.scrollLeft) / zoom - 2000;
    const y = (e.clientY - rect.top + workspaceRef.current.scrollTop) / zoom - 2000;

    spawnModule(type, label, x, y);
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-[#050505] overflow-hidden flex flex-col relative select-none">
      {researching && <LoadingOverlay step={step} logs={logs} />}

      {/* TOOLBAR */}
      <div className="h-16 border-b border-border bg-surface-1/80 backdrop-blur-2xl px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <SectionHeader
            eyebrow="Intelligence Bureau"
            title="Technical Whiteboard"
          />
          <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5 ml-4">
            <input
              type="text"
              placeholder="DRIVER 1"
              className="bg-black/40 border border-white/10 rounded-lg px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 transition-colors w-[180px]"
              value={d1Input}
              onChange={(e) => setD1Input(e.target.value)}
            />
            <input
              type="text"
              placeholder="DRIVER 2"
              className="bg-black/40 border border-white/10 rounded-lg px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 transition-colors w-[180px]"
              value={d2Input}
              onChange={(e) => setD2Input(e.target.value)}
            />
          </div>
          <button
            onClick={runEngine}
            disabled={loading}
            className="bg-primary text-primary-foreground h-9 px-6 rounded-lg font-bold uppercase tracking-wider text-[11px] flex items-center gap-2 shadow-2xl shadow-primary/30 active:scale-95 transition-all"
          >
            <Cpu className="h-3.5 w-3.5" /> Initialize Research
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm("Clear Workspace?")) setPlacedModules([]);
            }}
            className="h-8 px-4 rounded-md border border-destructive/20 text-destructive text-[10px] font-bold uppercase tracking-wider hover:bg-destructive/10 transition-colors"
          >
            Reset
          </button>
          <div className="flex items-center bg-black/40 rounded-lg p-1 border border-white/5">
            <button
              onClick={() => setZoom((z) => Math.max(0.2, z - 0.1))}
              className="p-1.5 hover:bg-white/5 rounded text-white/40"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="text-[10px] font-mono text-white/20 w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
              className="p-1.5 hover:bg-white/5 rounded text-white/40"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg transition-all ${sidebarOpen ? "bg-primary/20 text-primary" : "text-white/40 hover:bg-white/5"}`}
          >
            <Layout className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        <div
          className={`border-r border-border bg-surface-1 transition-all duration-500 flex flex-col ${sidebarOpen ? "w-80" : "w-0 overflow-hidden"}`}
        >
          <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-2">
              <Database className="h-3 w-3" /> Intelligence Repository
            </h3>

            <div className="space-y-4">
              {!data ? (
                <div className="text-[11px] text-white/10 italic border border-dashed border-white/5 p-8 rounded-3xl text-center flex flex-col items-center gap-4">
                  <Database className="h-10 w-10 opacity-5" />
                  Workspace Inactive.
                </div>
              ) : (
                <>
                  <ModuleGroup title="Synthesis Intelligence">
                    <InventoryItem
                      label="Detailed Synthetic Verdict"
                      type="verdict"
                      icon={<Sparkles />}
                      spawn={spawnModule}
                    />
                    <InventoryItem
                      label="Technical Skill Vector"
                      type="radar"
                      icon={<Activity />}
                      spawn={spawnModule}
                    />
                  </ModuleGroup>
                  <ModuleGroup title="Technical Dynamics">
                    <InventoryItem
                      label="Tyre Thermal Profile"
                      type="tyres"
                      icon={<Waves />}
                      spawn={spawnModule}
                    />
                    <InventoryItem
                      label="Wet Grip Sensitivity"
                      type="wet"
                      icon={<Thermometer />}
                      spawn={spawnModule}
                    />
                    <InventoryItem
                      label="Fuel Lift-and-Coast"
                      type="fuel"
                      icon={<Gauge />}
                      spawn={spawnModule}
                    />
                    <InventoryItem
                      label="ERS Battery Harvest"
                      type="ers"
                      icon={<Zap />}
                      spawn={spawnModule}
                    />
                    <InventoryItem
                      label="Braking Telemetry"
                      type="braking"
                      icon={<Microscope />}
                      spawn={spawnModule}
                    />
                    <InventoryItem
                      label="Gear Shift Load"
                      type="gears"
                      icon={<Settings2 />}
                      spawn={spawnModule}
                    />
                  </ModuleGroup>
                  <ModuleGroup title="Circuit Adaptation">
                    <InventoryItem
                      label="Street Proximity"
                      type="street"
                      icon={<Anchor />}
                      spawn={spawnModule}
                    />
                    <InventoryItem
                      label="High-G Cornering"
                      type="highspeed"
                      icon={<Wind />}
                      spawn={spawnModule}
                    />
                    <InventoryItem
                      label="Q3 Peak Performance"
                      type="one_lap"
                      icon={<Activity />}
                      spawn={spawnModule}
                    />
                    <InventoryItem
                      label="Pace Deviation"
                      type="consistency"
                      icon={<TrendingUp />}
                      spawn={spawnModule}
                    />
                  </ModuleGroup>
                  <ModuleGroup title="Psychological Profile">
                    <InventoryItem
                      label="Mentality Logic"
                      type="mentality"
                      icon={<Fingerprint />}
                      spawn={spawnModule}
                    />
                    <InventoryItem
                      label="Pressure Tolerance"
                      type="pressure"
                      icon={<Scale />}
                      spawn={spawnModule}
                    />
                    <InventoryItem
                      label="Leadership Matrix"
                      type="leadership"
                      icon={<Users />}
                      spawn={spawnModule}
                    />
                  </ModuleGroup>
                </>
              )}
            </div>
          </div>
        </div>

        {/* WORKSPACE */}
        <div 
          ref={workspaceRef}
          className={`flex-1 relative overflow-hidden bg-dots group transition-all ${isPanning ? "cursor-grabbing" : "cursor-grab"}`}
          onMouseDown={onPanStart}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          <div
            className="absolute origin-top-left p-[2000px] min-w-[8000px] min-h-[8000px] will-change-transform"
            style={{ transform: `scale(${zoom})` }}
          >
            {placedModules.map((mod) => (
              <WhiteboardCard
                key={mod.id}
                mod={mod}
                data={data}
                zoom={zoom}
                onRemove={() =>
                  setPlacedModules((p) => p.filter((m) => m.id !== mod.id))
                }
                onUpdate={handleUpdateModule}
              />
            ))}
          </div>

          {!data && !researching && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <MousePointer2 className="h-20 w-20 text-primary mb-6 animate-pulse opacity-10" />
              <div className="text-[18px] font-display uppercase tracking-[1em] text-white/10">
                Neural Workspace Initialized
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- SUBCOMPONENTS ---

function ModuleGroup({ title, children }: any) {
  return (
    <div className="mb-6">
      <div className="text-[9px] font-black text-white/20 mb-3 px-2 tracking-[0.4em] uppercase border-l-2 border-primary/20 ml-1">
        {title}
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function InventoryItem({ label, type, icon, spawn }: any) {
  return (
    <button
      onClick={() => spawn(type, label)}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("moduleType", type);
        e.dataTransfer.setData("moduleLabel", label);
      }}
      className="w-full flex items-center justify-between p-3 hover:bg-primary/10 border border-white/5 hover:border-primary/30 rounded-xl transition-all text-left group cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-center gap-3 pointer-events-none">
        <span className="text-white/30 group-hover:text-primary transition-colors">
          {icon}
        </span>
        <span className="text-[10px] font-bold text-white/50 group-hover:text-white transition-colors uppercase tracking-widest">
          {label}
        </span>
      </div>
      <Plus className="h-3 w-3 text-white/5 group-hover:text-primary transition-colors" />
    </button>
  );
}

function WhiteboardCard({ mod, data, zoom, onRemove, onUpdate }: any) {
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent, type: "drag" | "resize") => {
    e.preventDefault();
    e.stopPropagation();
    startPos.current = { x: e.clientX, y: e.clientY };
    if (type === "drag") setDragging(true);
    else setResizing(true);
  };

  useEffect(() => {
    if (!dragging && !resizing) return;

    const onMouseMove = (e: MouseEvent) => {
      const dx = (e.clientX - startPos.current.x) / zoom;
      const dy = (e.clientY - startPos.current.y) / zoom;
      startPos.current = { x: e.clientX, y: e.clientY };

      if (dragging) {
        onUpdate(mod.id, { x: mod.x + dx, y: mod.y + dy });
      } else if (resizing) {
        onUpdate(mod.id, {
          w: Math.max(300, mod.w + dx),
          h: Math.max(200, mod.h + dy),
        });
      }
    };

    const onMouseUp = () => {
      setDragging(false);
      setResizing(false);
      document.body.classList.remove("select-none");
    };

    document.body.classList.add("select-none");
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, resizing, mod.id, mod.x, mod.y, mod.w, mod.h, zoom, onUpdate]);

  return (
    <div
      className={`whiteboard-card absolute bg-surface-1/95 backdrop-blur-3xl border border-border rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col ${dragging ? "z-[99] ring-2 ring-primary ring-offset-8 ring-offset-black scale-[1.01] cursor-grabbing" : "z-10"} ${resizing ? "z-[99] cursor-nwse-resize" : ""} will-change-transform`}
      style={{ left: mod.x, top: mod.y, width: mod.w, minHeight: mod.h }}
    >
      <div
        className="h-14 border-b border-white/5 bg-black/40 flex items-center justify-between px-8"
        onMouseDown={(e) => onMouseDown(e, "drag")}
      >
        <div className="flex items-center gap-4 cursor-grab active:cursor-grabbing flex-1 h-full">
          <GripVertical className="h-4 w-4 text-white/10" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              {mod.label}
            </span>
            <span className="text-[8px] text-white/20 uppercase font-mono tracking-widest">
              {mod.id} / SYNTHETIC
            </span>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="p-2.5 text-white/20 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-10 flex-1 overflow-auto custom-scrollbar select-text">
        {mod.type === "radar" ? (
          <RadarChart data={mod.content} />
        ) : mod.type === "verdict" ? (
          <div className="prose prose-invert max-w-none">
            {mod.content
              .split(/\n\n|\n(?=[A-Z])/)
              .filter((p: string) => p.trim().length > 0)
              .map((p: any, i: number) => (
                <p
                  key={i}
                  className="text-[16px] leading-[1.8] text-white/90 mb-10 font-normal tracking-wide drop-shadow-sm"
                >
                  {p.trim()}
                </p>
              ))}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="p-4 bg-primary/10 rounded-3xl text-primary border border-primary/20">
                <Database className="h-6 w-6" />
              </div>
              <p className="text-[15px] leading-relaxed text-white/90 font-medium">
                {mod.content}
              </p>
            </div>
            {/* TECHNICAL GRAPH */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[9px] uppercase font-bold text-white/20 tracking-widest">
                  Performance Telemetry
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-[8px] font-black text-white/40 uppercase">
                      {data.d1.name.split(" ").pop()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-info" />
                    <span className="text-[8px] font-black text-white/40 uppercase">
                      {data.d2.name.split(" ").pop()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="h-24 w-full">
                <ModuleGraph data={mod.graphData} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        className="absolute bottom-4 right-4 w-10 h-10 cursor-nwse-resize flex items-center justify-center text-white/5 hover:text-primary transition-colors"
        onMouseDown={(e) => onMouseDown(e, "resize")}
      >
        <Maximize2 className="h-5 w-5 rotate-90" />
      </div>
    </div>
  );
}

function ModuleGraph({ data }: any) {
  if (!data) return null;
  const max = 100;
  const points1 = data
    .map((d: any, i: number) => `${(i / 9) * 100},${100 - (d.v1 / max) * 100}`)
    .join(" ");
  const points2 = data
    .map((d: any, i: number) => `${(i / 9) * 100},${100 - (d.v2 / max) * 100}`)
    .join(" ");
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="overflow-visible"
    >
      <polyline
        points={points1}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        className="opacity-80"
      />
      <polyline
        points={points2}
        fill="none"
        stroke="var(--info)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        className="opacity-80"
      />
    </svg>
  );
}

function RadarChart({ data }: any) {
  if (!data || !data.labels || !data.v1 || !data.v2) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-dashed border-white/5 rounded-3xl bg-black/20">
        <Activity className="h-8 w-8 text-white/5 mb-3 animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">
          Neural Vector Unavailable
        </span>
      </div>
    );
  }

  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const r = 100;
  const points = data.labels.map((_: any, i: number) => {
    const angle = (i * 2 * Math.PI) / data.labels.length - Math.PI / 2;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      lx: cx + (r + 40) * Math.cos(angle),
      ly: cy + (r + 40) * Math.sin(angle),
    };
  });
  const getPoly = (values: number[]) =>
    values
      .map((v, i) => {
        const angle = (i * 2 * Math.PI) / data.labels.length - Math.PI / 2;
        return `${cx + r * (v / 100) * Math.cos(angle)},${cy + r * (v / 100) * Math.sin(angle)}`;
      })
      .join(" ");
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible">
        {[0.25, 0.5, 0.75, 1].map((scale) => (
          <polygon
            key={scale}
            points={points
              .map(
                (p: any) =>
                  `${cx + (p.x - cx) * scale},${cy + (p.y - cy) * scale}`,
              )
              .join(" ")}
            fill="none"
            stroke="var(--border)"
            strokeWidth="1"
            opacity="0.1"
          />
        ))}
        <polygon
          points={getPoly(data.v1)}
          fill="var(--primary)"
          fillOpacity="0.1"
          stroke="var(--primary)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <polygon
          points={getPoly(data.v2)}
          fill="var(--info)"
          fillOpacity="0.1"
          stroke="var(--info)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {points.map((p: any, i: number) => (
          <text
            key={i}
            x={p.lx}
            y={p.ly}
            textAnchor="middle"
            className="text-[9px] font-black uppercase fill-white/20 tracking-widest"
          >
            {data.labels[i]}
          </text>
        ))}
      </svg>
    </div>
  );
}

function LoadingOverlay({ step, logs }: any) {
  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center p-10 backdrop-blur-3xl">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="max-w-xl w-full space-y-12 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="text-[14px] font-black uppercase tracking-[0.5em] text-primary">
              Intelligence Synthesis Active
            </div>
            <div className="text-[10px] text-white/30 font-mono tracking-widest">
              AGENTIC_PIPELINE_V7.5 // {new Date().getFullYear()}
            </div>
          </div>
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>

        <div className="space-y-5">
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary shadow-[0_0_30px_var(--primary)] transition-all duration-700 ease-out"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-white/30 uppercase tracking-[0.2em]">
            <span>Processing Data Vectors...</span>
            <span>{Math.round((step / 5) * 100)}%</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 font-mono text-[12px] text-primary/70 space-y-4 h-56 flex flex-col justify-end overflow-hidden backdrop-blur-md">
          {logs.map((log: string, i: number) => (
            <div
              key={i}
              className="flex gap-4 animate-in slide-in-from-left-6 duration-500"
            >
              <span className="text-white/10">
                [{new Date().toLocaleTimeString()}]
              </span>
              <span className="flex-1 truncate uppercase tracking-widest opacity-80">
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
