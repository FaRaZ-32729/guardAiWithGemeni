import { Bell, Shield, Menu, X } from "lucide-react";

export default function Header({ sidebarOpen, setSidebarOpen }) {
    return (
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#0d0f16] border-b border-[#1e2535] z-30 shrink-0">
            {/* Left: Hamburger + Logo */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-[#1a2035] transition-all"
                >
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                        <Shield size={16} className="text-cyan-400" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-white text-sm font-bold tracking-widest uppercase">
                            SafeWatch
                        </span>
                        <span className="text-cyan-500 text-[10px] tracking-[0.2em] uppercase">
                            Campus AI
                        </span>
                    </div>
                </div>
            </div>

            {/* Right: Status + Bell */}
            {/* <div className="flex items-center gap-3 sm:gap-4">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400 text-xs tracking-widest uppercase">
                        Live
                    </span>
                </div>

                <button className="relative p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-[#1a2035] transition-all">
                    <Bell size={18} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-[#0d0f16]" />
                </button>

                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        AD
                    </div>
                    <div className="hidden sm:flex flex-col leading-none">
                        <span className="text-white text-xs font-semibold">Admin</span>
                        <span className="text-slate-500 text-[10px]">Supervisor</span>
                    </div>
                </div>
            </div> */}
        </header>
    );
}