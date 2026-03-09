import { useState, useEffect } from "react";
import {
    AlertTriangle, Clock, Search, X,
    Cigarette, Swords, CheckCircle, XCircle,
    FileText, Shield, Printer, Calendar,
    User, Hash, Building2, Phone
} from "lucide-react";
import ChallanModal from "../components/violation/challanModal";

const API_URL = "http://localhost:5053/api/challan/all";

const severityMap = {
    smoking: {
        pill: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        dot: "bg-amber-400",
        icon: "bg-amber-500/10 text-amber-400 border border-amber-500/20"
    },
    fighting: {
        pill: "bg-red-500/10 text-red-400 border-red-500/20",
        dot: "bg-red-400",
        icon: "bg-red-500/10 text-red-400 border border-red-500/20"
    },
};

const statusConfig = {
    unpaid: { label: "Unpaid", cls: "bg-red-500/10 text-red-400 border border-red-500/20" },
    paid: { label: "Paid", cls: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
    overdue: { label: "Overdue", cls: "bg-rose-600/10 text-rose-400 border border-rose-500/30" },
    null: { label: "N/A", cls: "bg-slate-500/10 text-slate-400 border border-slate-500/20" },
};

const FILTERS = [
    { id: "all", label: "All" },
    { id: "smoking", label: "Smoking", icon: Cigarette },
    { id: "fighting", label: "Fighting", icon: Swords },
    { id: "registered", label: "Registered", icon: CheckCircle },
    { id: "Anonymous", label: "Anonymous", icon: XCircle },
];

const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric"
    });
};

// ── Convert Windows absolute path → accessible URL ──────────────────────
const getImageUrl = (filePath) => {
    if (!filePath) return null;
    const filename = filePath.split("\\").pop();
    return `http://localhost:5053/violations/${filename}`;
};

// ── Challan Modal ─────────────────────────────────────────────────────────
// function ChallanModal({ v, onClose }) {
//     const isAnon = v.isAnonymous;
//     const student = v.studentId || {};
//     const total = (v.previousChallanBalance || 0) + (v.currentChallan || 0);

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
//             <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden text-gray-800">

//                 <button onClick={onClose}
//                     className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors">
//                     <X size={15} />
//                 </button>

//                 {/* Header */}
//                 <div className="bg-[#0d1117] px-6 pt-6 pb-5 flex flex-col items-center gap-1 text-center">
//                     <div className="flex items-center gap-2">
//                         <Shield size={18} className="text-cyan-400" />
//                         <span className="text-white font-extrabold tracking-widest uppercase text-sm">Campus-Guard AI</span>
//                     </div>
//                     <p className="text-slate-500 text-[10px] tracking-[0.2em] uppercase">Disciplinary Committee · Campus Security</p>
//                     <div className="mt-2 px-4 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10">
//                         <span className="text-cyan-400 text-[11px] font-bold tracking-widest uppercase">Violation Fine Challan</span>
//                     </div>
//                 </div>

//                 {/* Decorative cut */}
//                 <div className="flex">
//                     {Array.from({ length: 20 }).map((_, i) => (
//                         <div key={i} className="flex-1 h-2" style={{
//                             clipPath: i % 2 === 0 ? "polygon(0 0, 100% 0, 50% 100%)" : "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
//                             background: i % 2 === 0 ? "#0d1117" : "white",
//                         }} />
//                     ))}
//                 </div>

//                 {/* Body */}
//                 <div className="px-6 py-4 flex flex-col gap-4 bg-gray-50 max-h-[60vh] overflow-y-auto">

//                     {/* Challan numbers */}
//                     <div className="flex justify-between text-xs">
//                         <div>
//                             <p className="text-gray-400 text-[10px] uppercase tracking-widest">Challan No.</p>
//                             <p className="font-bold font-mono text-gray-800">{v._id?.slice(-8).toUpperCase()}</p>
//                         </div>
//                         <div className="text-right">
//                             <p className="text-gray-400 text-[10px] uppercase tracking-widest">Type</p>
//                             <p className="font-bold font-mono text-gray-800 capitalize">{v.violationType}</p>
//                         </div>
//                     </div>

//                     <hr className="border-dashed border-gray-300" />

//                     {/* Student info */}
//                     <div>
//                         <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">
//                             {isAnon ? "Person Information" : "Student Information"}
//                         </p>

//                         {isAnon ? (
//                             /* Anonymous - show evidence image */
//                             <div className="flex flex-col items-center gap-2">
//                                 {v.evidenceImage ? (
//                                     <img
//                                         src={getImageUrl(v.evidenceImage)}
//                                         alt="Violation Evidence"
//                                         className="w-full max-h-48 object-cover rounded-xl border border-gray-200"
//                                     />
//                                 ) : (
//                                     <div className="w-full h-32 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
//                                         No image available
//                                     </div>
//                                 )}
//                                 <span className="text-[11px] text-gray-500">No student record found</span>
//                             </div>
//                         ) : (
//                             <div className="grid grid-cols-2 gap-2.5">
//                                 {[
//                                     { Icon: User, label: "Full Name", val: student.name || "N/A" },
//                                     { Icon: Hash, label: "Roll No.", val: student.studentRollNumber || "N/A" },
//                                     { Icon: Building2, label: "Department", val: student.department || "N/A" },
//                                     { Icon: Phone, label: "Email", val: student.email || "N/A" },
//                                 ].map(({ Icon, label, val }) => (
//                                     <div key={label} className="flex flex-col gap-0.5 bg-white rounded-lg p-2 border border-gray-100">
//                                         <span className="text-[9px] text-gray-400 uppercase tracking-widest flex items-center gap-1">
//                                             <Icon size={8} /> {label}
//                                         </span>
//                                         <span className="text-gray-800 text-[11px] font-semibold leading-tight">{val}</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     <hr className="border-dashed border-gray-300" />

//                     {/* Violation details */}
//                     <div>
//                         <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Violation Details</p>
//                         <div className="grid grid-cols-2 gap-2.5">
//                             <div className="flex flex-col gap-0.5 bg-white rounded-lg p-2 border border-gray-100">
//                                 <span className="text-[9px] text-gray-400 uppercase tracking-widest">Type</span>
//                                 <span className={`inline-flex items-center gap-1 w-fit text-[11px] font-bold px-2 py-0.5 rounded-full border mt-0.5
//                                     ${v.violationType === "smoking"
//                                         ? "bg-amber-50 text-amber-600 border-amber-200"
//                                         : "bg-red-50 text-red-600 border-red-200"}`}>
//                                     {v.violationType === "smoking" ? <Cigarette size={9} /> : <Swords size={9} />}
//                                     {v.violationType?.charAt(0).toUpperCase() + v.violationType?.slice(1)}
//                                 </span>
//                             </div>
//                             <div className="flex flex-col gap-0.5 bg-white rounded-lg p-2 border border-gray-100">
//                                 <span className="text-[9px] text-gray-400 uppercase tracking-widest flex items-center gap-1">
//                                     <Calendar size={8} /> Issue Date
//                                 </span>
//                                 <span className="text-gray-800 text-[11px] font-semibold">{formatDate(v.challanIssueDate)}</span>
//                             </div>
//                             <div className="flex flex-col gap-0.5 bg-white rounded-lg p-2 border border-red-100 col-span-2">
//                                 <span className="text-[9px] text-gray-400 uppercase tracking-widest flex items-center gap-1">
//                                     <Calendar size={8} /> Due Date
//                                 </span>
//                                 <span className="text-red-600 text-[11px] font-bold">{formatDate(v.challanDueDate)}</span>
//                             </div>
//                         </div>

//                         {/* Description */}
//                         {v.description && (
//                             <div className="mt-2 bg-white rounded-lg p-2 border border-gray-100">
//                                 <span className="text-[9px] text-gray-400 uppercase tracking-widest">AI Description</span>
//                                 <p className="text-gray-700 text-[11px] mt-0.5">{v.description}</p>
//                             </div>
//                         )}
//                     </div>

//                     {/* Fee breakdown - only for registered */}
//                     {!isAnon && (
//                         <>
//                             <hr className="border-dashed border-gray-300" />
//                             <div>
//                                 <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Fee Breakdown</p>
//                                 <div className="rounded-xl border border-gray-200 overflow-hidden">
//                                     <div className="flex justify-between items-center px-4 py-2.5 bg-white border-b border-gray-100">
//                                         <span className="text-gray-500 text-xs">Previous Balance</span>
//                                         <span className="text-gray-700 text-xs font-semibold font-mono">PKR {(v.previousChallanBalance || 0).toLocaleString()}</span>
//                                     </div>
//                                     <div className="flex justify-between items-center px-4 py-2.5 bg-white border-b border-gray-100">
//                                         <span className="text-gray-500 text-xs capitalize">{v.violationType} Fine</span>
//                                         <span className="text-gray-700 text-xs font-semibold font-mono">PKR {(v.currentChallan || 0).toLocaleString()}</span>
//                                     </div>
//                                     <div className="flex justify-between items-center px-4 py-3 bg-[#0d1117]">
//                                         <span className="text-white text-sm font-bold uppercase tracking-widest">Total Payable</span>
//                                         <span className="text-cyan-400 text-sm font-bold font-mono">PKR {total.toLocaleString()}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </>
//                     )}

//                     {/* Status */}
//                     {v.status && (
//                         <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 bg-white">
//                             <span className="text-gray-400 text-[11px] uppercase tracking-widest">Payment Status</span>
//                             <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${statusConfig[v.status]?.cls || statusConfig.null.cls}`}>
//                                 {statusConfig[v.status]?.label || "N/A"}
//                             </span>
//                         </div>
//                     )}

//                     <p className="text-center text-[10px] text-gray-400 leading-relaxed px-2">
//                         This is a system-generated challan. For disputes, contact the Disciplinary Committee within 3 working days.
//                     </p>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex gap-2 px-6 py-4 bg-white border-t border-gray-100">
//                     {!isAnon && (
//                         <button onClick={() => window.print()}
//                             className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0d1117] text-cyan-400 text-xs font-bold uppercase tracking-widest hover:bg-[#1a2035] transition-colors">
//                             <Printer size={13} /> Print Challan
//                         </button>
//                     )}
//                     <button onClick={onClose}
//                         className="flex-1 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-xs font-bold hover:bg-gray-50 transition-colors">
//                         Close
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// ── Main Page ─────────────────────────────────────────────────────────────
export default function Violations() {
    const [challans, setChallans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [selectedChallan, setSelectedChallan] = useState(null);

    useEffect(() => {
        const fetchChallans = async () => {
            try {
                const res = await fetch(`${API_URL}?limit=100`);
                const data = await res.json();
                setChallans(data.challans || []);
            } catch (err) {
                console.error("Failed to fetch challans:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchChallans();
    }, []);

    const filtered = challans.filter((v) => {
        const matchFilter =
            activeFilter === "all" ? true :
                activeFilter === "smoking" ? v.violationType === "smoking" :
                    activeFilter === "fighting" ? v.violationType === "fighting" :
                        activeFilter === "registered" ? !v.isAnonymous :
                            activeFilter === "Anonymous" ? v.isAnonymous : true;

        const q = search.toLowerCase();
        const name = v.isAnonymous ? "anonymous" : (v.studentId?.name || "");
        const roll = v.studentId?.studentRollNumber || "";
        const matchSearch = !q || name.toLowerCase().includes(q) || roll.toLowerCase().includes(q) || v._id.includes(q);

        return matchFilter && matchSearch;
    });

    return (
        <div className="flex flex-col gap-5 p-4 sm:p-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-white text-xl font-bold tracking-tight">Violations Log</h1>
                    <p className="text-slate-500 text-xs mt-0.5">
                        {filtered.length} of {challans.length} incidents · AI-detected
                    </p>
                </div>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#0d0f16] border border-[#1e2535] focus-within:border-cyan-500/40 transition-all flex-1 sm:max-w-xs">
                    <Search size={14} className="text-slate-500 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search student, roll no..."
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
                        <button key={id} onClick={() => setActiveFilter(id)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border
                            ${activeFilter === id
                                    ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400"
                                    : "bg-[#0d0f16] border-[#1e2535] text-slate-500 hover:text-slate-300 hover:border-[#2a3550]"}`}>
                            {Icon && <Icon size={11} />}
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-3">
                {loading ? (
                    <div className="flex items-center justify-center py-16 text-slate-600 text-sm">Loading...</div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-700">
                        <AlertTriangle size={32} />
                        <p className="text-sm">No violations match your filters.</p>
                    </div>
                ) : filtered.map((v) => {
                    const isAnon = v.isAnonymous;
                    const cfg = severityMap[v.violationType] || severityMap.smoking;
                    const studentName = isAnon ? "Anonymous Person" : (v.studentId?.name || "Unknown");
                    const roll = v.studentId?.studentRollNumber;

                    return (
                        <div key={v._id}
                            className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl bg-[#0d0f16] border border-[#1e2535] hover:border-[#2a3550] transition-all">

                            {/* Icon */}
                            <div className={`p-2.5 rounded-xl self-start ${cfg.icon}`}>
                                <AlertTriangle size={18} />
                            </div>

                            {/* Info */}
                            <div className="flex flex-col flex-1 min-w-0 gap-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-white text-sm font-bold">{studentName}</span>

                                    <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border
                                        ${v.violationType === "smoking"
                                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                            : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                                        {v.violationType === "smoking" ? <Cigarette size={9} /> : <Swords size={9} />}
                                        {v.violationType}
                                    </span>

                                    <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border
                                        ${!isAnon
                                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                            : "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
                                        {!isAnon ? <CheckCircle size={9} /> : <XCircle size={9} />}
                                        {!isAnon ? "Registered" : "Anonymous"}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                                    {!isAnon && roll && (
                                        <span className="flex items-center gap-1"><Hash size={10} />{roll}</span>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <Clock size={10} />{formatDate(v.challanIssueDate)}
                                    </span>
                                </div>
                            </div>

                            {/* Right side */}
                            <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-wrap shrink-0">

                                {/* Anonymous: show evidence image */}
                                {isAnon && v.evidenceImage ? (
                                    <img
                                        src={getImageUrl(v.evidenceImage)}
                                        alt="Evidence"
                                        className="w-16 h-16 object-cover rounded-xl border border-slate-700"
                                    />
                                ) : (
                                    /* Registered: show status + view challan */
                                    <>
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusConfig[v.status]?.cls || statusConfig.null.cls}`}>
                                            {statusConfig[v.status]?.label || "N/A"}
                                        </span>
                                        <button
                                            onClick={() => setSelectedChallan(v)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-bold hover:bg-cyan-500/20 transition-all">
                                            <FileText size={12} /> View Challan
                                        </button>
                                    </>
                                )}

                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedChallan && (
                <ChallanModal v={selectedChallan} onClose={() => setSelectedChallan(null)} />
            )}
        </div>
    );
}