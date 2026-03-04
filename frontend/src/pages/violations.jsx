import { AlertTriangle, Clock, Camera } from "lucide-react";

const violations = [
  { id: "V-1021", student: "Bilal Qureshi", type: "Smoking Detected", camera: "CAM-02", time: "Today, 1:12 PM", severity: "high" },
  { id: "V-1020", student: "Usman Ali", type: "Fighting Alert", camera: "CAM-09", time: "Today, 11:34 AM", severity: "critical" },
  { id: "V-1019", student: "Sara Khan", type: "Restricted Area", camera: "CAM-07", time: "Today, 10:05 AM", severity: "high" },
  { id: "V-1018", student: "Ahmed Raza", type: "Uniform Violation", camera: "CAM-04", time: "Today, 8:55 AM", severity: "low" },
  { id: "V-1017", student: "Omar Sheikh", type: "Vandalism", camera: "CAM-03", time: "Yesterday, 3:40 PM", severity: "high" },
  { id: "V-1016", student: "Faisal Iqbal", type: "Skipping Class", camera: "CAM-01", time: "Yesterday, 2:10 PM", severity: "low" },
  { id: "V-1015", student: "Hira Fatima", type: "Late Arrival", camera: "CAM-01", time: "Yesterday, 8:20 AM", severity: "low" },
];

const severityConfig = {
  low: {
    pill: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    dot: "bg-amber-400",
    icon: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  high: {
    pill: "bg-red-500/10 text-red-400 border border-red-500/20",
    dot: "bg-red-400",
    icon: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  critical: {
    pill: "bg-rose-600/10 text-rose-400 border border-rose-500/30",
    dot: "bg-rose-400 animate-pulse",
    icon: "bg-rose-600/10 text-rose-400 border-rose-500/30",
  },
};

export default function Violations() {
  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-white text-xl font-bold tracking-tight">Violations Log</h1>
          <p className="text-slate-500 text-xs mt-0.5">{violations.length} recent incidents · AI-detected</p>
        </div>

        <div className="flex items-center gap-2">
          {["critical", "high", "low"].map((s) => (
            <span key={s} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${severityConfig[s].pill}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${severityConfig[s].dot}`} />
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {violations.map((v) => {
          const cfg = severityConfig[v.severity];
          return (
            <div
              key={v.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl bg-[#0d0f16] border border-[#1e2535] hover:border-[#2a3550] transition-all"
            >
              <div className={`p-2.5 rounded-xl border self-start ${cfg.icon}`}>
                <AlertTriangle size={18} />
              </div>

              <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-white text-sm font-bold">{v.student}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.pill}`}>
                    {v.severity}
                  </span>
                </div>
                <span className="text-slate-400 text-xs">{v.type}</span>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-slate-500 sm:flex-col sm:gap-1 sm:items-end">
                <span className="flex items-center gap-1.5">
                  <Camera size={11} className="text-slate-600" />
                  {v.camera}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={11} className="text-slate-600" />
                  {v.time}
                </span>
                <span className="text-slate-600 font-mono text-[10px]">{v.id}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}