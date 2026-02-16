"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Ship,
    Building2,
    MapPin,
    Anchor,
    ChevronRight,
    PanelLeftClose,
    PanelLeftOpen,
    Menu
} from "lucide-react";
import { useFixtures } from "@/context/FixtureContext";

export default function Sidebar() {
    const pathname = usePathname();
    const { fixtures } = useFixtures();
    const [isCollapsed, setIsCollapsed] = useState(false);

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
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <Link href="/" className="logo">
                    <div className="logo-mark">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                            <path d="M12 2L4 8h16L12 2z" fill="rgba(255,255,255,.7)" />
                        </svg>
                    </div>
                    {!isCollapsed && (
                        <div>
                            <div className="logo-name">GREEN & BLACK</div>
                            <div className="logo-desc">Operations Hub</div>
                        </div>
                    )}
                </Link>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="toggle-btn"
                    title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    {isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
                </button>
            </div>

            <div className="sidebar-content">
                <div className="sidebar-section">
                    <span className="sidebar-label">Main Menu</span>
                    <nav className="sidebar-nav">
                        <Link href="/" className={`sidebar-link ${isActive("/") ? "active" : ""}`}>
                            <LayoutDashboard size={18} />
                            <span>Dashboard</span>
                        </Link>
                    </nav>
                </div>

                <div className="sidebar-section">
                    <span className="sidebar-label">Parties</span>
                    <div className="entity-list">
                        {/* Grouping Owners, Charterers, Vessels under Parties as requested */}
                        <div className="mb-2">
                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-4 block">Vessels</span>
                            {topVessels.map(v => (
                                <div key={v} className="entity-item group" title={v}>
                                    <Ship size={14} className="opacity-40" />
                                    <span>{v}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mb-2">
                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-4 block">Charterers</span>
                            {topCharterers.map(c => (
                                <div key={c} className="entity-item group" title={c}>
                                    <Users size={14} className="opacity-40" />
                                    <span>{c}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mb-2">
                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-4 block">Owners</span>
                            {topOwners.map(o => (
                                <div key={o} className="entity-item group" title={o}>
                                    <Building2 size={14} className="opacity-40" />
                                    <span>{o}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="sidebar-section">
                    <span className="sidebar-label">Busiest Ports</span>
                    <div className="entity-list">
                        {topPorts.map(p => (
                            <div key={p} className="entity-item group" title={p}>
                                <MapPin size={14} className="opacity-40" />
                                <span>{p}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-4 mt-auto border-t border-[var(--border)]">
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--green-glow)] border border-[var(--green-500)/10]">
                    <div className="w-8 h-8 rounded-lg bg-[var(--green-500)] flex items-center justify-center font-bold text-black text-xs shrink-0">
                        OP
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col user-info-text">
                            <span className="text-xs font-bold text-[var(--green-500)]">Admin Mode</span>
                            <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest font-bold">Secure Session</span>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
