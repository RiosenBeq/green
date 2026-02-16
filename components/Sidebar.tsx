"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Ship,
    Building2,
    MapPin,
    Anchor,
    ChevronRight
} from "lucide-react";
import { useFixtures } from "@/context/FixtureContext";

export default function Sidebar() {
    const pathname = usePathname();
    const { fixtures } = useFixtures();

    const isActive = (path: string) => pathname === path;

    // Derive frequently used entities
    const getFrequency = (key: 'charterer' | 'vessel' | 'owner' | 'loadPort' | 'dischPort') => {
        const counts: Record<string, number> = {};
        fixtures.forEach(f => {
            const val = f[key];
            if (val) counts[val] = (counts[val] || 0) + 1;
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(entry => entry[0]);
    };

    const topCharterers = getFrequency('charterer');
    const topVessels = getFrequency('vessel');
    const topOwners = getFrequency('owner');
    const topPorts = Array.from(new Set([...getFrequency('loadPort'), ...getFrequency('dischPort')])).slice(0, 5);

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <Link href="/" className="logo">
                    <div className="logo-mark">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                            <path d="M12 2L4 8h16L12 2z" fill="rgba(255,255,255,.7)" />
                        </svg>
                    </div>
                    <div>
                        <div className="logo-name">GREEN & BLACK</div>
                        <div className="logo-desc">Operations Hub</div>
                    </div>
                </Link>
            </div>

            <div className="sidebar-content">
                <div className="sidebar-section">
                    <span className="sidebar-label">Main Menu</span>
                    <nav className="sidebar-nav">
                        <Link href="/" className={`sidebar-link ${isActive("/") ? "active" : ""}`}>
                            <LayoutDashboard size={18} />
                            Dashboard
                        </Link>
                    </nav>
                </div>

                <div className="sidebar-section">
                    <span className="sidebar-label">Recently Active Charterers</span>
                    <div className="entity-list">
                        {topCharterers.map(c => (
                            <div key={c} className="entity-item group flex justify-between items-center" title={c}>
                                <div className="flex items-center gap-2 truncate">
                                    <Users size={12} className="opacity-40" />
                                    <span>{c}</span>
                                </div>
                                <ChevronRight size={10} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="sidebar-section">
                    <span className="sidebar-label">Top Vessels</span>
                    <div className="entity-list">
                        {topVessels.map(v => (
                            <div key={v} className="entity-item group flex justify-between items-center" title={v}>
                                <div className="flex items-center gap-2 truncate">
                                    <Ship size={12} className="opacity-40" />
                                    <span>{v}</span>
                                </div>
                                <ChevronRight size={10} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="sidebar-section">
                    <span className="sidebar-label">Core Owners</span>
                    <div className="entity-list">
                        {topOwners.map(o => (
                            <div key={o} className="entity-item group flex justify-between items-center" title={o}>
                                <div className="flex items-center gap-2 truncate">
                                    <Building2 size={12} className="opacity-40" />
                                    <span>{o}</span>
                                </div>
                                <ChevronRight size={10} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="sidebar-section">
                    <span className="sidebar-label">Busiest Ports</span>
                    <div className="entity-list">
                        {topPorts.map(p => (
                            <div key={p} className="entity-item group flex justify-between items-center" title={p}>
                                <div className="flex items-center gap-2 truncate">
                                    <MapPin size={12} className="opacity-40" />
                                    <span>{p}</span>
                                </div>
                                <ChevronRight size={10} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-4 mt-auto border-t border-[var(--border)]">
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--green-glow)] border border-[var(--green-500)/10]">
                    <div className="w-8 h-8 rounded-lg bg-[var(--green-500)] flex items-center justify-center font-bold text-black text-xs">
                        OP
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-[var(--green-500)]">Admin Mode</span>
                        <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest font-bold">Secure Session</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
