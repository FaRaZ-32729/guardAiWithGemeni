import { useState } from "react";

const data = {
  today: [
    { time: "8AM", count: 1 },
    { time: "9AM", count: 3 },
    { time: "10AM", count: 2 },
    { time: "11AM", count: 5 },
    { time: "12PM", count: 4 },
    { time: "1PM", count: 6 },
    { time: "2PM", count: 2 },
    { time: "3PM", count: 3 },
  ],
  week: [
    { time: "Mon", count: 8 },
    { time: "Tue", count: 14 },
    { time: "Wed", count: 6 },
    { time: "Thu", count: 19 },
    { time: "Fri", count: 11 },
    { time: "Sat", count: 3 },
    { time: "Sun", count: 1 },
  ],
  month: [
    { time: "W1", count: 22 },
    { time: "W2", count: 38 },
    { time: "W3", count: 29 },
    { time: "W4", count: 45 },
  ],
};

const tabs = [
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
];

export default function ViolationChart() {
  const [active, setActive] = useState("today");
  const [hovered, setHovered] = useState(null);

  const points = data[active];
  const maxVal = Math.max(...points.map((p) => p.count));

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl border border-[#1e2535] bg-[#0d0f16]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-white font-semibold text-sm tracking-wide">
            Violation Analytics
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">
            Incidents detected by AI surveillance
          </p>
        </div>

        {/* Period tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#1a2035] border border-[#1e2535]">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                ${active === id
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "text-slate-500 hover:text-slate-300"
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end gap-2 h-40 sm:h-52 w-full relative">
        {/* Y-axis grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-t border-[#1e2535]/60 w-full" />
          ))}
        </div>

        {/* Bars */}
        {points.map((point, i) => {
          const heightPct = maxVal > 0 ? (point.count / maxVal) * 100 : 0;
          const isHovered = hovered === i;

          return (
            <div
              key={i}
              className="flex flex-col items-center gap-1.5 flex-1 h-full justify-end relative"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#1a2035] border border-cyan-500/30 text-cyan-300 text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap z-10">
                  {point.count} violations
                </div>
              )}

              {/* Bar */}
              <div
                className="w-full rounded-t-lg transition-all duration-500 relative overflow-hidden cursor-pointer"
                style={{ height: `${Math.max(heightPct, 4)}%` }}
              >
                <div
                  className={`
                    absolute inset-0 rounded-t-lg transition-all duration-200
                    ${isHovered
                      ? "bg-cyan-400"
                      : "bg-gradient-to-t from-cyan-600/40 to-cyan-400/80"
                    }
                  `}
                />
                {isHovered && (
                  <div className="absolute inset-0 bg-cyan-400/20 blur-sm" />
                )}
              </div>

              {/* Label */}
              <span className="text-[10px] text-slate-600 tracking-wide shrink-0">
                {point.time}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary row */}
      <div className="flex flex-wrap gap-3 pt-2 border-t border-[#1e2535]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-xs text-slate-400">
            Total:{" "}
            <span className="text-white font-semibold">
              {points.reduce((s, p) => s + p.count, 0)}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <span className="text-xs text-slate-400">
            Peak:{" "}
            <span className="text-white font-semibold">
              {maxVal} incidents
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[10px] text-slate-600 uppercase tracking-widest">
            AI Confidence: 94%
          </span>
        </div>
      </div>
    </div>
  );
}