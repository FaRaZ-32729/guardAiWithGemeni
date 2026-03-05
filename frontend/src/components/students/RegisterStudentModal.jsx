import { useState, useRef } from "react";
import {
    X, User, Mail, Hash, Phone, Users, Building2,
    Upload, ImagePlus, AlertTriangle, CheckCircle, UserPlus
} from "lucide-react";
import { api } from "../../config/AxiosInstance";


const INITIAL_FORM = {
    name: "",
    email: "",
    studentRollNumber: "",
    parentsEmail: "",
    parentsPhone: "",
    fatherName: "",
    department: "",
};

// ── Small reusable field ──────────────────────────────────────────────────
function Field({ label, name, type = "text", value, onChange, placeholder, icon: Icon, required, error }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-[10px] tracking-widest uppercase flex items-center gap-1.5">
                <Icon size={9} />
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border bg-[#0a0c12] transition-all
                ${error ? "border-red-500/40" :
                    value ? "border-cyan-500/40" :
                        "border-[#1e2535]"}
                focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/20`}>
                <Icon size={13} className="text-slate-500 shrink-0" />
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent text-white text-xs placeholder-slate-600 outline-none"
                />
            </div>
        </div>
    );
}

// ── Main Modal ────────────────────────────────────────────────────────────
export default function RegisterStudentModal({ onClose, onSuccess }) {
    const [form, setForm] = useState(INITIAL_FORM);
    const [faceFile, setFaceFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const fileRef = useRef(null);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
        setApiError("");
    };

    const handleFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setErrors((prev) => ({ ...prev, face: "Only image files are allowed." }));
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setErrors((prev) => ({ ...prev, face: "Image must be under 5 MB." }));
            return;
        }
        setFaceFile(file);
        setPreview(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, face: "" }));
    };

    const validate = () => {
        const errs = {};
        const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.name.trim()) errs.name = "Required";
        if (!emailRx.test(form.email)) errs.email = "Valid email required";
        if (!form.studentRollNumber.trim()) errs.studentRollNumber = "Required";
        if (!emailRx.test(form.parentsEmail)) errs.parentsEmail = "Valid email required";
        if (!form.parentsPhone.trim()) errs.parentsPhone = "Required";
        if (!form.fatherName.trim()) errs.fatherName = "Required";
        if (!form.department) errs.department = "Select a department";
        if (!faceFile) errs.face = "Face image is required";
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        const payload = new FormData();
        Object.entries(form).forEach(([k, v]) => payload.append(k, v));
        payload.append("face", faceFile);

        console.log("Face file:", faceFile);

        setLoading(true);
        setApiError("");
        try {
            // const data = await studentService.registerStudent(payload);

            // const response = await api.post("/student/register", payload, {
            //     headers: { "Content-Type": "multipart/form-data" },
            // });
            const response = await api.post("/student/register", payload);
            console.log(response)

            const data = response.data;
            console.log(data)


            setSuccess(true);
            setTimeout(() => { onSuccess?.(data.student); onClose(); }, 1300);
        } catch (err) {
            console.log("Full error:", err);
            console.log("err.response:", err.response);
            console.log("err.response?.data:", err.response?.data);
            setApiError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="relative w-full max-w-xl bg-[#0d0f16] border border-[#1e2535] rounded-2xl shadow-2xl flex flex-col max-h-[92vh]">

                {/* ── Header ── */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2535] shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                            <UserPlus size={16} className="text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="text-white text-sm font-bold tracking-wide">Register Student</h2>
                            <p className="text-slate-500 text-[11px] mt-0.5">Add a new student to the surveillance system</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-[#1a2035] transition-all"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* ── Scrollable body ── */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-5 overflow-y-auto">

                    {/* Face image upload */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-slate-400 text-[10px] tracking-widest uppercase flex items-center gap-1.5">
                            <ImagePlus size={9} /> Face Image <span className="text-red-500">*</span>
                        </label>

                        <div
                            onClick={() => fileRef.current?.click()}
                            className={`relative flex flex-col items-center justify-center gap-3 h-32 rounded-xl border-2 border-dashed cursor-pointer transition-all
                                ${errors.face
                                    ? "border-red-500/40 bg-red-500/5"
                                    : preview
                                        ? "border-cyan-500/40 bg-cyan-500/5"
                                        : "border-[#1e2535] bg-[#0a0c12] hover:border-cyan-500/30 hover:bg-cyan-500/5"
                                }`}
                        >
                            {preview ? (
                                <>
                                    <img
                                        src={preview}
                                        alt="Face preview"
                                        className="h-full w-full object-cover rounded-xl opacity-60"
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-xl bg-black/40">
                                        <Upload size={16} className="text-cyan-400" />
                                        <span className="text-cyan-400 text-[10px] font-semibold tracking-widest uppercase">Change Photo</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="p-3 rounded-xl bg-[#1a2035] border border-[#1e2535]">
                                        <ImagePlus size={20} className="text-slate-500" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-slate-400 text-xs font-semibold">Click to upload face image</p>
                                        <p className="text-slate-600 text-[10px] mt-0.5">PNG, JPG up to 1       5 MB</p>
                                    </div>
                                </>
                            )}
                        </div>

                        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                        {errors.face && (
                            <p className="text-red-400 text-[10px] flex items-center gap-1">
                                <AlertTriangle size={9} /> {errors.face}
                            </p>
                        )}
                    </div>

                    {/* Section: Personal Info */}
                    <div className="flex flex-col gap-3">
                        <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] border-b border-[#1e2535] pb-1.5">
                            Personal Information
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Field label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Ahmed Raza" icon={User} required error={errors.name} />
                            <Field label="Father Name" name="fatherName" value={form.fatherName} onChange={handleChange} placeholder="e.g. Raza Khan" icon={Users} required error={errors.fatherName} />
                            <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="student@campus.edu" icon={Mail} required error={errors.email} />
                            <Field label="Roll Number" name="studentRollNumber" value={form.studentRollNumber} onChange={handleChange} placeholder="BS-CS-F21-001" icon={Hash} required error={errors.studentRollNumber} />
                        </div>
                    </div>

                    {/* Section: Department */}
                    {/* <div className="flex flex-col gap-1.5">
                        <label className="text-slate-400 text-[10px] tracking-widest uppercase flex items-center gap-1.5">
                            <Building2 size={9} /> Department <span className="text-red-500">*</span>
                        </label>
                        <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border bg-[#0a0c12] transition-all
                            ${errors.department ? "border-red-500/40" : form.department ? "border-cyan-500/40" : "border-[#1e2535]"}
                            focus-within:border-cyan-500/60`}>
                            <Building2 size={13} className="text-slate-500 shrink-0" />
                            <select
                                value={form.department}
                                onChange={handleDeptChange}
                                className="flex-1 bg-transparent text-xs outline-none appearance-none cursor-pointer
                                    text-white [&>option]:bg-[#0d0f16] [&>option]:text-white"
                            >
                                <option value="" disabled>Select department</option>
                                {DEPARTMENTS.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>

                        </div>
                        {errors.department && (
                            <p className="text-red-400 text-[10px] flex items-center gap-1">
                                <AlertTriangle size={9} /> {errors.department}
                            </p>
                        )}
                    </div> */}
                    <Field
                        label="Department"
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                        placeholder="e.g. Computer Science"
                        icon={Building2}
                        required
                        error={errors.department}
                    />


                    {/* Section: Parent Info */}
                    <div className="flex flex-col gap-3">
                        <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] border-b border-[#1e2535] pb-1.5">
                            Parent / Guardian Information
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Field label="Parent Email" name="parentsEmail" type="email" value={form.parentsEmail} onChange={handleChange} placeholder="parent@email.com" icon={Mail} required error={errors.parentsEmail} />
                            <Field label="Parent Phone" name="parentsPhone" type="tel" value={form.parentsPhone} onChange={handleChange} placeholder="+92 300 0000000" icon={Phone} required error={errors.parentsPhone} />
                        </div>
                    </div>

                    {/* API Error */}
                    {apiError && (
                        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                            <AlertTriangle size={14} className="shrink-0" />
                            {apiError}
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                            <CheckCircle size={14} className="shrink-0" />
                            Student registered successfully!
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-1 pb-1">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 py-2.5 rounded-xl border border-[#1e2535] text-slate-400 text-xs font-bold uppercase tracking-widest hover:bg-[#1a2035] hover:text-slate-200 transition-all disabled:opacity-40"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || success}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all
                                ${loading || success
                                    ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 cursor-not-allowed"
                                    : "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-300"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Registering...
                                </>
                            ) : success ? (
                                <><CheckCircle size={13} /> Registered!</>
                            ) : (
                                <><UserPlus size={13} /> Register Student</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}