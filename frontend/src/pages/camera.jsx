import { Camera, Wifi, Cctv, WifiOff, Trash2 } from "lucide-react";

const cameras = [
    { id: "CAM-01", location: "Main Entrance", status: "online", feed: "#" },
    { id: "CAM-02", location: "Cafeteria", status: "online", feed: "#" },
    { id: "CAM-03", location: "Library", status: "online", feed: "#" },
    { id: "CAM-04", location: "Hallway A", status: "online", feed: "#" },
    { id: "CAM-05", location: "Parking Lot", status: "offline", feed: "#" },
    // { id: "CAM-06", location: "Gymnasium", status: "online", feed: "#" },
    // { id: "CAM-07", location: "Restricted Zone", status: "online", feed: "#" },
    // { id: "CAM-08", location: "Admin Block", status: "online", feed: "#" },
    // { id: "CAM-09", location: "Sports Ground", status: "online", feed: "#" },
    // { id: "CAM-10", location: "Science Lab", status: "offline", feed: "#" },
    // { id: "CAM-11", location: "Computer Lab", status: "online", feed: "#" },
    // { id: "CAM-12", location: "Back Gate", status: "online", feed: "#" },
];

export default function Cameras() {
    return (
        <div className="flex flex-col gap-5 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                    <h1 className="text-white text-xl font-bold tracking-tight">Camera Feed</h1>
                    <p className="text-slate-500 text-xs mt-0.5">
                        {cameras.filter(c => c.status === "online").length} of {cameras.length} cameras online
                    </p>
                </div>
                {/* <button className="flex gap-2 cursor-pointer bg-blue ">  <Cctv /> Add</button> */}
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest uppercase hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-300 transition-all cursor-pointer">
                    <Camera size={15} />
                    Add Camera
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {cameras.map((cam) => (
                    <div
                        key={cam.id}
                        className="flex flex-col rounded-2xl border border-[#1e2535] bg-[#0d0f16] overflow-hidden hover:border-cyan-500/30 transition-all group"
                    >
                        {/* Fake camera feed */}
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
                            <span className="absolute bottom-2 right-2 text-slate-700 text-[10px] tracking-widest">{cam.id}</span>
                        </div>

                        {/* Info */}
                        <div className="flex items-center justify-between px-4 py-3">
                            <div>
                                <p className="text-white text-xs font-semibold">{cam.id}</p>
                                <p className="text-slate-500 text-[11px]">{cam.location}</p>
                            </div>
                            <Trash2 size={15} className="text-red-400" />
                            {/* {cam.status === "online"
                                ? <Wifi size={15} className="text-emerald-400" />
                                : <WifiOff size={15} className="text-red-400" />
                            } */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}