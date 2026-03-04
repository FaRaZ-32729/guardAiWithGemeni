import { Search, Filter, ShieldCheck, ShieldAlert } from "lucide-react";
import { useState } from "react";

const students = [
    { id: "S-001", name: "Ahmed Raza", grade: "10-A", violations: 3, status: "flagged" },
    { id: "S-002", name: "Sara Khan", grade: "11-B", violations: 1, status: "flagged" },
    { id: "S-003", name: "Bilal Qureshi", grade: "9-C", violations: 7, status: "flagged" },
    { id: "S-004", name: "Hira Fatima", grade: "12-A", violations: 0, status: "clear" },
    { id: "S-005", name: "Usman Ali", grade: "10-B", violations: 5, status: "flagged" },
    { id: "S-006", name: "Zara Malik", grade: "11-A", violations: 0, status: "clear" },
    { id: "S-007", name: "Faisal Iqbal", grade: "9-A", violations: 2, status: "flagged" },
    { id: "S-008", name: "Nadia Yousuf", grade: "12-B", violations: 0, status: "clear" },
    { id: "S-009", name: "Omar Sheikh", grade: "10-C", violations: 4, status: "flagged" },
    { id: "S-010", name: "Ayesha Siddiqui", grade: "11-C", violations: 0, status: "clear" },
];

export default function Students() {
    const [search, setSearch] = useState("");

    const filtered = students.filter(
        (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.id.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-5 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-white text-xl font-bold tracking-tight">Students</h1>
                    <p className="text-slate-500 text-xs mt-0.5">1,284 enrolled · {students.filter(s => s.status === "flagged").length} flagged</p>
                </div>

                {/* Search */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0d0f16] border border-[#1e2535] sm:w-64">
                    <Search size={14} className="text-slate-500 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search student..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-transparent text-white text-xs placeholder-slate-600 outline-none"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-[#1e2535] bg-[#0d0f16] overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1e2535] bg-[#1a2035]">
                    <span className="text-slate-500 text-[11px] uppercase tracking-widest w-16">ID</span>
                    <span className="text-slate-500 text-[11px] uppercase tracking-widest flex-1">Name</span>
                    <span className="text-slate-500 text-[11px] uppercase tracking-widest w-16 hidden sm:block">Grade</span>
                    <span className="text-slate-500 text-[11px] uppercase tracking-widest w-20 text-center">Violations</span>
                    <span className="text-slate-500 text-[11px] uppercase tracking-widest w-20 text-center">Status</span>
                </div>

                {filtered.map((s, i) => (
                    <div
                        key={s.id}
                        className={`flex items-center gap-3 px-4 py-3 hover:bg-[#1a2035] transition-colors cursor-pointer ${i !== filtered.length - 1 ? "border-b border-[#1e2535]/50" : ""}`}
                    >
                        <span className="text-slate-600 text-xs font-mono w-16">{s.id}</span>
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-[10px] font-bold shrink-0">
                                {s.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <span className="text-white text-xs font-medium truncate">{s.name}</span>
                        </div>
                        <span className="text-slate-400 text-xs w-16 hidden sm:block">{s.grade}</span>
                        <span className={`text-xs font-bold w-20 text-center ${s.violations > 3 ? "text-red-400" : s.violations > 0 ? "text-amber-400" : "text-slate-500"}`}>
                            {s.violations}
                        </span>
                        <div className="flex items-center justify-center w-20">
                            {s.status === "clear"
                                ? <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold"><ShieldCheck size={10} /> Clear</span>
                                : <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold"><ShieldAlert size={10} /> Flagged</span>
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}