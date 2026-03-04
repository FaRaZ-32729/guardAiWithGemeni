import { AlertTriangle, Clock } from "lucide-react";

const violations = [
  { id: 1, student: "Ahmed Raza", type: "Uniform Violation", time: "2 min ago", camera: "CAM-04", severity: "low" },
  { id: 2, student: "Sara Khan", type: "Restricted Area", time: "11 min ago", camera: "CAM-07", severity: "high" },
  { id: 3, student: "Bilal Qureshi", type: "Smoking Detected", time: "34 min ago", camera: "CAM-02", severity: "high" },
  { id: 4, student: "Hira Fatima", type: "Late Arrival", time: "1 hr ago", camera: "CAM-01", severity: "low" },
//   { id: 5, student: "Usman Ali", type: "Fighting Alert", time: "2 hr ago", camera: "CAM-09", severity: "critical" },
];

const severityStyles = {
  low: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  high: "bg-red-500/10 text-red-400 border-red-500/20",
  critical: "bg-rose-600/10 text-rose-400 border-rose-500/20 animate-pulse",
};

export default function RecentViolations() {
  return (
    <div className="flex flex-col gap-3 p-5 rounded-2xl border border-[#1e2535] bg-[#0d0f16]">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-sm tracking-wide">
          Recent Violations
        </h3>
        <button className="text-[11px] text-cyan-400 hover:text-cyan-300 tracking-widest uppercase transition-colors">
          View All
        </button>
      </div>

      <div className="flex flex-col gap-3.5 ">
        {violations.map((v) => (
          <div
            key={v.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-[#1a2035] border border-[#1e2535] hover:border-[#2a3550] transition-all group"
          >
            <div className={`p-2 rounded-lg border ${severityStyles[v.severity]}`}>
              <AlertTriangle size={14} />
            </div>

            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-white text-xs font-semibold truncate">
                {v.student}
              </span>
              <span className="text-slate-500 text-[11px] truncate">
                {v.type} · {v.camera}
              </span>
            </div>

            <div className="flex items-center gap-1 text-slate-600 shrink-0">
              <Clock size={11} />
              <span className="text-[10px]">{v.time}</span>
            </div>

            <span
              className={`hidden sm:inline text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-widest ${severityStyles[v.severity]}`}
            >
              {v.severity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}