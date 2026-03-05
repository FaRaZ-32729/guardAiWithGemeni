import { Camera, WifiOff, Trash2, VideoOff } from "lucide-react";
import AddCameraModal from "../components/camera/AddCamera";
import { useState } from "react";
import { useCamera } from "../context/CameraContext";

export default function Cameras() {
    const { cameras, deleteCamera, getAllCameras } = useCamera();
    const [showModal, setShowModal] = useState(false);

    const handleCameraAdded = () => getAllCameras();

    return (
        <div className="flex flex-col gap-5 p-4 sm:p-6">

            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                    <h1 className="text-white text-xl font-bold tracking-tight">Camera Feed</h1>
                    <p className="text-slate-500 text-xs mt-0.5">
                        {cameras.length === 0
                            ? "No cameras registered"
                            : `${cameras.filter(c => c.status === "online").length} of ${cameras.length} cameras online`
                        }
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest uppercase hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-300 transition-all cursor-pointer self-start"
                >
                    <Camera size={15} />
                    Add Camera
                </button>
            </div>

            {/* ── Empty state ── */}
            {cameras.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-5 py-20 px-6">

                    {/* Pulsing icon */}
                    <div className="relative flex items-center justify-center">
                        <div className="absolute w-24 h-24 rounded-full border border-slate-700/40 animate-ping opacity-20" />
                        <div
                            className="absolute w-16 h-16 rounded-full border border-slate-700/50 animate-ping opacity-30"
                            style={{ animationDelay: "0.4s" }}
                        />
                        <div className="relative p-5 rounded-2xl bg-[#0d0f16] border border-[#1e2535]">
                            <VideoOff size={28} className="text-slate-600" />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="flex flex-col items-center gap-1.5 text-center max-w-xs">
                        <h3 className="text-white text-sm font-bold tracking-wide">
                            No Cameras Registered
                        </h3>
                        <p className="text-slate-500 text-xs leading-relaxed">
                            The surveillance network has no active feeds. Register a camera to begin real-time monitoring.
                        </p>
                    </div>


                    {/* CTA */}
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest uppercase hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-300 transition-all"
                    >
                        <Camera size={14} />
                        Register First Camera
                    </button>
                </div>

            ) : (

                /* ── Camera grid ── */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {cameras.map((cam) => (
                        <div
                            key={cam._id}
                            className="flex flex-col rounded-2xl border border-[#1e2535] bg-[#0d0f16] overflow-hidden hover:border-cyan-500/30 transition-all group"
                        >
                            {/* Feed preview */}
                            <div className="relative h-36 bg-[#0a0c12] flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-[#0a0c12]" />

                                {cam.status === "online" ? (
                                    <>
                                        <Camera size={32} className="text-slate-700 relative z-10" />
                                        <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                            <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Live</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <WifiOff size={28} className="text-slate-700 relative z-10" />
                                        <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                            <span className="text-red-400 text-[10px] font-bold uppercase tracking-widest">Offline</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Info row */}
                            <div className="flex items-center justify-between px-4 py-3">
                                <div className="min-w-0">
                                    <p className="text-white text-xs font-semibold truncate">{cam.cameraName}</p>
                                    <p className="text-slate-500 text-[11px] truncate">{cam.streamUrl}</p>
                                </div>
                                <Trash2
                                    size={15}
                                    className="text-slate-600 hover:text-red-400 cursor-pointer transition-colors shrink-0 ml-3"
                                    onClick={() => deleteCamera(cam._id)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <AddCameraModal
                    onClose={() => setShowModal(false)}
                    onSuccess={handleCameraAdded}
                />
            )}
        </div>
    );
}