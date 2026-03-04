import { Users, AlertTriangle, UserX, Cctv   } from "lucide-react";
import StatCard from "../components/statCards";
import ViolationChart from "../components/violationChart";
import RecentViolations from "../components/recentViolation";


const stats = [
    {
        title: "total Cameras",
        value: "5",
        icon: Cctv  ,
        color: "emerald",
        trend: "Live",
    },
    {
        title: "Total Students",
        value: "1,284",
        icon: Users,
        color: "cyan",
        trend: "+12 new",
    },
    {
        title: "Total Violations",
        value: "342",
        icon: AlertTriangle,
        color: "red",
        trend: "↑ 8%",
    },
    {
        title: "Violators Today",
        value: "26",
        icon: UserX,
        color: "amber",
        trend: "Live",
    },

];

export default function Home() {
    return (
        <div className="flex flex-col gap-5 p-4 sm:p-6">
            {/* Page Header */}
            {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                    <h1 className="text-white text-xl font-bold tracking-tight">
                        Dashboard Overview
                    </h1>
                    <p className="text-slate-500 text-xs mt-0.5 tracking-wide">
                        Wednesday, 04 March 2026 · Real-time surveillance active
                    </p>
                </div>
            </div> */}

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>

            {/* Chart + Recent Violations */}
            <div className="flex flex-col xl:flex-row gap-4">
                {/* Chart takes more space */}
                <div className="flex-1 min-w-0">
                    <ViolationChart />
                </div>
                {/* Recent violations list */}
                <div className="xl:w-80 shrink-0">
                    <RecentViolations />
                </div>
            </div>
        </div>
    );
}