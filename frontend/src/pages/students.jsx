// import { ShieldCheck, ShieldAlert, UserPlus, Pencil, Trash2 } from "lucide-react";
// import { useState } from "react";
// import RegisterStudentModal from "../components/students/RegisterStudentModal";

// const students = [
//     { id: "S-001", name: "Ahmed Raza", email: "ahmed.raza@campus.edu", grade: "10-A", violations: 3, status: "flagged" },
//     { id: "S-002", name: "Sara Khan", email: "sara.khan@campus.edu", grade: "11-B", violations: 1, status: "flagged" },
//     { id: "S-003", name: "Bilal Qureshi", email: "bilal.qureshi@campus.edu", grade: "9-C", violations: 7, status: "flagged" },
//     { id: "S-004", name: "Hira Fatima", email: "hira.fatima@campus.edu", grade: "12-A", violations: 0, status: "clear" },
//     { id: "S-005", name: "Usman Ali", email: "usman.ali@campus.edu", grade: "10-B", violations: 5, status: "flagged" },
//     { id: "S-006", name: "Zara Malik", email: "zara.malik@campus.edu", grade: "11-A", violations: 0, status: "clear" },
//     { id: "S-007", name: "Faisal Iqbal", email: "faisal.iqbal@campus.edu", grade: "9-A", violations: 2, status: "flagged" },
//     { id: "S-008", name: "Nadia Yousuf", email: "nadia.yousuf@campus.edu", grade: "12-B", violations: 0, status: "clear" },
//     { id: "S-009", name: "Omar Sheikh", email: "omar.sheikh@campus.edu", grade: "10-C", violations: 4, status: "flagged" },
//     { id: "S-010", name: "Ayesha Siddiqui", email: "ayesha.siddiqui@campus.edu", grade: "11-C", violations: 0, status: "clear" },
// ];

// export default function Students() {
//     const [data, setData] = useState(students);
//     const [showModal, setShowModal] = useState(false);

//     const handleDelete = (id) => setData((prev) => prev.filter((s) => s.id !== id));

//     const handleStudentAdded = (newStudent) => {
//         // getAllStudents();
//     };

//     return (
//         <div className="flex flex-col gap-5 p-4 sm:p-6">

//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//                 <div>
//                     <h1 className="text-white text-xl font-bold tracking-tight">Students</h1>
//                     <p className="text-slate-500 text-xs mt-0.5">
//                         {data.length} enrolled · {data.filter(s => s.status === "flagged").length} flagged
//                     </p>
//                 </div>

//                 <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest uppercase hover:bg-cyan-500/20 transition-all">
//                     <UserPlus size={15} /> Add Student
//                 </button>
//             </div>

//             {/* Table */}
//             <div className="rounded-2xl border border-[#1e2535] bg-[#0d0f16] overflow-hidden overflow-x-auto">

//                 {/* Table Header */}
//                 <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1e2535] bg-[#1a2035] min-w-[560px]">
//                     <span className="text-slate-500 text-[11px] uppercase tracking-widest w-16">ID</span>
//                     <span className="text-slate-500 text-[11px] uppercase tracking-widest w-36">Name</span>
//                     <span className="text-slate-500 text-[11px] uppercase tracking-widest flex-1">Email</span>
//                     {/* <span className="text-slate-500 text-[11px] uppercase tracking-widest w-20 text-center">Status</span> */}
//                     <span className="text-slate-500 text-[11px] uppercase tracking-widest w-24 text-center">Actions</span>
//                 </div>

//                 {/* Rows */}
//                 {data.map((s, i) => (
//                     <div
//                         key={s.id}
//                         className={`flex items-center gap-3 px-4 py-3 hover:bg-[#1a2035] transition-colors min-w-[560px]
//                             ${i !== data.length - 1 ? "border-b border-[#1e2535]/50" : ""}`}
//                     >
//                         {/* ID */}
//                         <span className="text-slate-600 text-xs font-mono w-16">{s.id}</span>

//                         {/* Name */}
//                         <div className="flex items-center gap-2 w-36 min-w-0">
//                             <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-[10px] font-bold shrink-0">
//                                 {s.name.split(" ").map(n => n[0]).join("")}
//                             </div>
//                             <span className="text-white text-xs font-medium truncate">{s.name}</span>
//                         </div>

//                         {/* Email */}
//                         <span className="text-slate-400 text-xs flex-1 truncate">{s.email}</span>

//                         {/* Status */}
//                         {/* <div className="flex items-center justify-center w-20">
//                             {s.status === "clear"
//                                 ? <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
//                                     <ShieldCheck size={10} /> Clear
//                                 </span>
//                                 : <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold">
//                                     <ShieldAlert size={10} /> Flagged
//                                 </span>
//                             }
//                         </div> */}

//                         {/* Actions */}
//                         <div className="flex items-center justify-center gap-2 w-24">
//                             <button className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold hover:bg-cyan-500/20 transition-all cursor-pointer">
//                                 <Pencil size={10} /> Edit
//                             </button>
//                             <button
//                                 onClick={() => handleDelete(s.id)}
//                                 className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold hover:bg-red-500/20 transition-all cursor-pointer"
//                             >
//                                 <Trash2 size={10} /> Del
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//             {showModal && <RegisterStudentModal onClose={() => setShowModal(false)} onSuccess={handleStudentAdded} />}
//         </div>
//     );
// }


import { useEffect, useState } from "react";
import { UserPlus, Pencil, Trash2, Loader2, AlertTriangle } from "lucide-react";
import EditStudentModal from "../components/students/EditStudentModal";
import { useStudent } from "../context/StudentContext";
import RegisterStudentModal from "../components/students/RegisterStudentModal";

export default function Students() {
    const { students, loading, error, getAllStudents, deleteStudent, addStudent } = useStudent();

    const [showRegister, setShowRegister] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null); // holds student object
    const [deletingId, setDeletingId] = useState(null); // tracks which row is deleting

    // Fetch on mount
    useEffect(() => {
        getAllStudents();
    }, []);

    const handleDelete = async (id) => {
        setDeletingId(id);
        await deleteStudent(id);
        setDeletingId(null);
    };

    const handleStudentAdded = (newStudent) => {
        addStudent(newStudent);
    };

    return (
        <div className="flex flex-col gap-5 p-4 sm:p-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-white text-xl font-bold tracking-tight">Students</h1>
                    <p className="text-slate-500 text-xs mt-0.5">
                        {loading
                            ? "Loading..."
                            : `${students.length} enrolled`
                        }
                    </p>
                </div>

                <button
                    onClick={() => setShowRegister(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest uppercase hover:bg-cyan-500/20 transition-all self-start"
                >
                    <UserPlus size={15} /> Add Student
                </button>
            </div>

            {/* Error banner */}
            {error && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                    <AlertTriangle size={14} className="shrink-0" /> {error}
                </div>
            )}

            {/* Loading state */}
            {loading ? (
                <div className="flex items-center justify-center py-20 gap-3 text-slate-600">
                    <Loader2 size={20} className="animate-spin" />
                    <span className="text-sm">Fetching students...</span>
                </div>

            ) : students.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-600">
                    <div className="p-4 rounded-2xl bg-[#0d0f16] border border-[#1e2535]">
                        <UserPlus size={28} className="text-slate-600" />
                    </div>
                    <div className="text-center">
                        <p className="text-white text-sm font-bold">No Students Registered</p>
                        <p className="text-slate-500 text-xs mt-1">Add a student to start tracking.</p>
                    </div>
                    <button
                        onClick={() => setShowRegister(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest uppercase hover:bg-cyan-500/20 transition-all"
                    >
                        <UserPlus size={13} /> Register First Student
                    </button>
                </div>

            ) : (
                /* Table */
                <div className="rounded-2xl border border-[#1e2535] bg-[#0d0f16] overflow-hidden overflow-x-auto">

                    {/* Table header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1e2535] bg-[#1a2035] min-w-[600px]">
                        <span className="text-slate-500 text-[11px] uppercase tracking-widest w-10">#</span>
                        <span className="text-slate-500 text-[11px] uppercase tracking-widest w-36">Name</span>
                        <span className="text-slate-500 text-[11px] uppercase tracking-widest w-32">Roll No.</span>
                        <span className="text-slate-500 text-[11px] uppercase tracking-widest flex-1">Email</span>
                        <span className="text-slate-500 text-[11px] uppercase tracking-widest w-28 text-center">Actions</span>
                    </div>

                    {/* Rows */}
                    {students.map((s, i) => (
                        <div
                            key={s._id}
                            className={`flex items-center gap-3 px-4 py-3 hover:bg-[#1a2035] transition-colors min-w-[600px]
                                ${i !== students.length - 1 ? "border-b border-[#1e2535]/50" : ""}`}
                        >
                            {/* Index */}
                            <span className="text-slate-600 text-xs font-mono w-10">{i + 1}</span>

                            {/* Name + avatar */}
                            <div className="flex items-center gap-2 w-36 min-w-0">
                                {s.face ? (
                                    <img
                                        src={s.face}
                                        alt={s.name}
                                        className="w-7 h-7 rounded-full object-cover border border-cyan-500/20 shrink-0"
                                    />
                                ) : (
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-[10px] font-bold shrink-0">
                                        {s.name?.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                    </div>
                                )}
                                <span className="text-white text-xs font-medium truncate">{s.name}</span>
                            </div>

                            {/* Roll number */}
                            <span className="text-slate-500 text-xs font-mono w-32 truncate">
                                {s.studentRollNumber || "—"}
                            </span>

                            {/* Email */}
                            <span className="text-slate-400 text-xs flex-1 truncate">{s.email}</span>

                            {/* Actions */}
                            <div className="flex items-center justify-center gap-2 w-28">
                                <button
                                    onClick={() => setEditingStudent(s)}
                                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold hover:bg-cyan-500/20 transition-all"
                                >
                                    <Pencil size={10} /> Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(s._id)}
                                    disabled={deletingId === s._id}
                                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold hover:bg-red-500/20 transition-all disabled:opacity-40"
                                >
                                    {deletingId === s._id
                                        ? <Loader2 size={10} className="animate-spin" />
                                        : <Trash2 size={10} />
                                    }
                                    Del
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Register modal */}
            {showRegister && (
                <RegisterStudentModal
                    onClose={() => setShowRegister(false)}
                    onSuccess={handleStudentAdded}
                />
            )}

            {/* Edit modal */}
            {editingStudent && (
                <EditStudentModal
                    student={editingStudent}
                    onClose={() => setEditingStudent(null)}
                />
            )}
        </div>
    );
}