import { useState } from "react";
import {
    AlertTriangle, Clock, Camera, Search, X,
    Cigarette, Swords, CheckCircle, XCircle,
    FileText, Shield, Printer, Calendar,
    User, Hash, Building2, Phone
} from "lucide-react";

// ── Mock Data ─────────────────────────────────────────────────────────────
const violations = [
    {
        id: "V-1021", challanId: "CHL-2026-1021",
        student: "Bilal Qureshi", studentId: "STU-4421", rollNo: "BS-CS-F21-044",
        department: "Computer Science", phone: "+92 300 1234567",
        camera: "CAM-02", time: "Today, 1:12 PM",
        violationType: "smoking", registered: true, status: "unpaid",
        challanIssueDate: "04 Mar 2026", challanDueDate: "18 Mar 2026",
        previousBalance: 500, currentChallan: 2000, severity: "high",
    },
    {
        id: "V-1020", challanId: "CHL-2026-1020",
        student: "Usman Ali", studentId: "STU-3310", rollNo: "BS-SE-F22-011",
        department: "Software Engineering", phone: "+92 311 9876543",
        camera: "CAM-09", time: "Today, 11:34 AM",
        violationType: "fighting", registered: true, status: "overdue",
        challanIssueDate: "20 Feb 2026", challanDueDate: "05 Mar 2026",
        previousBalance: 1000, currentChallan: 5000, severity: "critical",
    },
    {
        id: "V-1019", challanId: "CHL-2026-1019",
        student: "Unknown Person", studentId: "UNK-001", rollNo: "N/A",
        department: "N/A", phone: "N/A",
        camera: "CAM-07", time: "Today, 10:05 AM",
        violationType: "smoking", registered: false, status: "unpaid",
        challanIssueDate: "04 Mar 2026", challanDueDate: "18 Mar 2026",
        previousBalance: 0, currentChallan: 2000, severity: "high",
    },
    {
        id: "V-1018", challanId: "CHL-2026-1018",
        student: "Ahmed Raza", studentId: "STU-5502", rollNo: "BS-IT-F20-088",
        department: "Information Technology", phone: "+92 333 4567890",
        camera: "CAM-04", time: "Today, 8:55 AM",
        violationType: "fighting", registered: true, status: "paid",
        challanIssueDate: "01 Mar 2026", challanDueDate: "15 Mar 2026",
        previousBalance: 0, currentChallan: 5000, severity: "low",
    },
    {
        id: "V-1017", challanId: "CHL-2026-1017",
        student: "Unknown Person", studentId: "UNK-002", rollNo: "N/A",
        department: "N/A", phone: "N/A",
        camera: "CAM-03", time: "Yesterday, 3:40 PM",
        violationType: "fighting", registered: false, status: "unpaid",
        challanIssueDate: "03 Mar 2026", challanDueDate: "17 Mar 2026",
        previousBalance: 0, currentChallan: 5000, severity: "high",
    },
    {
        id: "V-1016", challanId: "CHL-2026-1016",
        student: "Faisal Iqbal", studentId: "STU-6631", rollNo: "BS-CS-F23-019",
        department: "Computer Science", phone: "+92 345 6789012",
        camera: "CAM-01", time: "Yesterday, 2:10 PM",
        violationType: "smoking", registered: true, status: "unpaid",
        challanIssueDate: "03 Mar 2026", challanDueDate: "17 Mar 2026",
        previousBalance: 2000, currentChallan: 2000, severity: "low",
    },
];

// ── Config maps ───────────────────────────────────────────────────────────
const severityConfig = {
    low: { pill: "bg-amber-500/10 text-amber-400 border-amber-500/20", dot: "bg-amber-400", icon: "bg-amber-500/10 text-amber-400 border border-amber-500/20" },
    high: { pill: "bg-red-500/10 text-red-400 border-red-500/20", dot: "bg-red-400", icon: "bg-red-500/10 text-red-400 border border-red-500/20" },
    critical: { pill: "bg-rose-600/10 text-rose-400 border-rose-500/30", dot: "bg-rose-400 animate-pulse", icon: "bg-rose-600/10 text-rose-400 border border-rose-500/30" },
};

const statusConfig = {
    unpaid: { label: "Unpaid", cls: "bg-red-500/10 text-red-400 border border-red-500/20" },
    paid: { label: "Paid", cls: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
    overdue: { label: "Overdue", cls: "bg-rose-600/10 text-rose-400 border border-rose-500/30" },
};

const FILTERS = [
    { id: "all", label: "All", icon: null },
    { id: "smoking", label: "Smoking", icon: Cigarette },
    { id: "fighting", label: "Fighting", icon: Swords },
    { id: "registered", label: "Registered", icon: CheckCircle },
    { id: "unregistered", label: "Unregistered", icon: XCircle },
];

// ── Challan Modal ─────────────────────────────────────────────────────────
function ChallanModal({ v, onClose }) {
    const total = v.previousBalance + v.currentChallan;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden text-gray-800"
                style={{ fontFamily: "'Segoe UI', sans-serif" }}>

                {/* Close btn */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                >
                    <X size={15} />
                </button>

                {/* ── Challan header ── */}
                <div className="bg-[#0d1117] px-6 pt-6 pb-5 flex flex-col items-center gap-1 text-center">
                    <div className="flex items-center gap-2">
                        <Shield size={18} className="text-cyan-400" />
                        <span className="text-white font-extrabold tracking-widest uppercase text-sm">Campus-Guard AI</span>
                    </div>
                    <p className="text-slate-500 text-[10px] tracking-[0.2em] uppercase">Disciplinary Committee · Campus Security</p>
                    <div className="mt-2 px-4 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10">
                        <span className="text-cyan-400 text-[11px] font-bold tracking-widest uppercase">Violation Fine Challan</span>
                    </div>
                </div>

                {/* ── Decorative cut edge ── */}
                <div className="flex">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="flex-1 h-2 bg-white" style={{
                            clipPath: i % 2 === 0 ? "polygon(0 0, 100% 0, 50% 100%)" : "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                            background: i % 2 === 0 ? "#0d1117" : "white",
                        }} />
                    ))}
                </div>

                {/* ── Body ── */}
                <div className="px-6 py-4 flex flex-col gap-4 bg-gray-50 max-h-[60vh] overflow-y-auto">

                    {/* Challan / Violation numbers */}
                    <div className="flex justify-between text-xs">
                        <div>
                            <p className="text-gray-400 text-[10px] uppercase tracking-widest">Challan No.</p>
                            <p className="font-bold font-mono text-gray-800">{v.challanId}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 text-[10px] uppercase tracking-widest">Ref. ID</p>
                            <p className="font-bold font-mono text-gray-800">{v.id}</p>
                        </div>
                    </div>

                    <hr className="border-dashed border-gray-300" />

                    {/* Student details */}
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Student Information</p>
                        <div className="grid grid-cols-2 gap-2.5">
                            {[
                                { Icon: User, label: "Full Name", val: v.student },
                                { Icon: Hash, label: "Roll No.", val: v.rollNo },
                                { Icon: Building2, label: "Department", val: v.department },
                                { Icon: Phone, label: "Contact", val: v.phone },
                            ].map(({ Icon, label, val }) => (
                                <div key={label} className="flex flex-col gap-0.5 bg-white rounded-lg p-2 border border-gray-100">
                                    <span className="text-[9px] text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                        <Icon size={8} /> {label}
                                    </span>
                                    <span className="text-gray-800 text-[11px] font-semibold leading-tight">{val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="border-dashed border-gray-300" />

                    {/* Violation details */}
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Violation Details</p>
                        <div className="grid grid-cols-2 gap-2.5">
                            <div className="flex flex-col gap-0.5 bg-white rounded-lg p-2 border border-gray-100">
                                <span className="text-[9px] text-gray-400 uppercase tracking-widest">Type</span>
                                <span className={`inline-flex items-center gap-1 w-fit text-[11px] font-bold px-2 py-0.5 rounded-full border mt-0.5
                  ${v.violationType === "smoking"
                                        ? "bg-amber-50 text-amber-600 border-amber-200"
                                        : "bg-red-50 text-red-600 border-red-200"}`}>
                                    {v.violationType === "smoking" ? <Cigarette size={9} /> : <Swords size={9} />}
                                    {v.violationType.charAt(0).toUpperCase() + v.violationType.slice(1)}
                                </span>
                            </div>
                            <div className="flex flex-col gap-0.5 bg-white rounded-lg p-2 border border-gray-100">
                                <span className="text-[9px] text-gray-400 uppercase tracking-widest flex items-center gap-1"><Camera size={8} /> Detected By</span>
                                <span className="text-gray-800 text-[11px] font-semibold">{v.camera}</span>
                            </div>
                            <div className="flex flex-col gap-0.5 bg-white rounded-lg p-2 border border-gray-100">
                                <span className="text-[9px] text-gray-400 uppercase tracking-widest flex items-center gap-1"><Calendar size={8} /> Issue Date</span>
                                <span className="text-gray-800 text-[11px] font-semibold">{v.challanIssueDate}</span>
                            </div>
                            <div className="flex flex-col gap-0.5 bg-white rounded-lg p-2 border border-red-100">
                                <span className="text-[9px] text-gray-400 uppercase tracking-widest flex items-center gap-1"><Calendar size={8} /> Due Date</span>
                                <span className="text-red-600 text-[11px] font-bold">{v.challanDueDate}</span>
                            </div>
                        </div>
                    </div>

                    <hr className="border-dashed border-gray-300" />

                    {/* Fee breakdown */}
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Fee Breakdown</p>
                        <div className="rounded-xl border border-gray-200 overflow-hidden">
                            <div className="flex justify-between items-center px-4 py-2.5 bg-white border-b border-gray-100">
                                <span className="text-gray-500 text-xs">Previous Outstanding Balance</span>
                                <span className="text-gray-700 text-xs font-semibold font-mono">PKR {v.previousBalance.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center px-4 py-2.5 bg-white border-b border-gray-100">
                                <span className="text-gray-500 text-xs capitalize">{v.violationType} Violation Fine</span>
                                <span className="text-gray-700 text-xs font-semibold font-mono">PKR {v.currentChallan.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center px-4 py-3 bg-[#0d1117]">
                                <span className="text-white text-sm font-bold uppercase tracking-widest">Total Payable</span>
                                <span className="text-cyan-400 text-sm font-bold font-mono">PKR {total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status row */}
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 bg-white">
                        <span className="text-gray-400 text-[11px] uppercase tracking-widest">Payment Status</span>
                        <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${statusConfig[v.status].cls}`}>
                            {statusConfig[v.status].label}
                        </span>
                    </div>

                    {/* Fine print */}
                    <p className="text-center text-[10px] text-gray-400 leading-relaxed px-2">
                        Pay before the due date to avoid additional penalties.<br />
                        For disputes, contact the Disciplinary Committee within 3 working days.
                    </p>
                </div>

                {/* ── Actions ── */}
                <div className="flex gap-2 px-6 py-4 bg-white border-t border-gray-100">
                    <button
                        onClick={() => window.print()}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0d1117] text-cyan-400 text-xs font-bold uppercase tracking-widest hover:bg-[#1a2035] transition-colors"
                    >
                        <Printer size={13} /> Print Challan
                    </button>
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-xs font-bold hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main Violations Page ──────────────────────────────────────────────────
export default function Violations() {
    const [activeFilter, setActiveFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [selectedChallan, setSelectedChallan] = useState(null);

    const filtered = violations.filter((v) => {
        const matchFilter =
            activeFilter === "all" ? true :
                activeFilter === "smoking" ? v.violationType === "smoking" :
                    activeFilter === "fighting" ? v.violationType === "fighting" :
                        activeFilter === "registered" ? v.registered :
                            activeFilter === "unregistered" ? !v.registered : true;

        const q = search.toLowerCase();
        const matchSearch =
            !q ||
            v.student.toLowerCase().includes(q) ||
            v.rollNo.toLowerCase().includes(q) ||
            v.id.toLowerCase().includes(q) ||
            v.challanId.toLowerCase().includes(q);

        return matchFilter && matchSearch;
    });

    return (
        <div className="flex flex-col gap-5 p-4 sm:p-6">

            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-white text-xl font-bold tracking-tight">Violations Log</h1>
                    <p className="text-slate-500 text-xs mt-0.5">
                        {filtered.length} of {violations.length} incidents · AI-detected
                    </p>
                </div>
                {/* <div className="flex items-center gap-2 flex-wrap">
                    {["critical", "high", "low"].map((s) => (
                        <span key={s} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${severityConfig[s].pill}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${severityConfig[s].dot}`} />
                            {s}
                        </span>
                    ))}
                </div> */}
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#0d0f16] border border-[#1e2535] focus-within:border-cyan-500/40 transition-all flex-1 sm:max-w-xs">
                    <Search size={14} className="text-slate-500 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search student, roll no, challan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-transparent text-white text-xs placeholder-slate-600 outline-none"
                    />
                    {search && (
                        <button onClick={() => setSearch("")} className="text-slate-600 hover:text-slate-400">
                            <X size={12} />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                    {FILTERS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveFilter(id)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border
                ${activeFilter === id
                                    ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400"
                                    : "bg-[#0d0f16] border-[#1e2535] text-slate-500 hover:text-slate-300 hover:border-[#2a3550]"}`}
                        >
                            {Icon && <Icon size={11} />}
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-3">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-700">
                        <AlertTriangle size={32} />
                        <p className="text-sm">No violations match your filters.</p>
                    </div>
                ) : filtered.map((v) => {
                    const cfg = severityConfig[v.severity];
                    return (
                        <div
                            key={v.id}
                            className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl bg-[#0d0f16] border border-[#1e2535] hover:border-[#2a3550] transition-all"
                        >
                            {/* Icon */}
                            <div className={`p-2.5 rounded-xl self-start ${cfg.icon}`}>
                                <AlertTriangle size={18} />
                            </div>

                            {/* Info */}
                            <div className="flex flex-col flex-1 min-w-0 gap-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-white text-sm font-bold">{v.student}</span>

                                    <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border
                    ${v.violationType === "smoking"
                                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                            : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                                        {v.violationType === "smoking" ? <Cigarette size={9} /> : <Swords size={9} />}
                                        {v.violationType}
                                    </span>

                                    <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border
                    ${v.registered
                                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                            : "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
                                        {v.registered ? <CheckCircle size={9} /> : <XCircle size={9} />}
                                        {v.registered ? "Registered" : "Unregistered"}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                                    {v.registered && (
                                        <span className="flex items-center gap-1"><Hash size={10} />{v.rollNo}</span>
                                    )}
                                    <span className="flex items-center gap-1"><Camera size={10} />{v.camera}</span>
                                    <span className="flex items-center gap-1"><Clock size={10} />{v.time}</span>
                                </div>
                            </div>

                            {/* Right side */}
                            <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-wrap shrink-0">
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusConfig[v.status].cls}`}>
                                    {statusConfig[v.status].label}
                                </span>

                                <button
                                    onClick={() => setSelectedChallan(v)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-bold hover:bg-cyan-500/20 transition-all"
                                >
                                    <FileText size={12} /> View Challan
                                </button>

                                <span className="text-slate-700 font-mono text-[10px]">{v.id}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Challan Modal */}
            {selectedChallan && (
                <ChallanModal v={selectedChallan} onClose={() => setSelectedChallan(null)} />
            )}
        </div>
    );
}