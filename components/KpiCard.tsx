"use client";

import { ReactNode } from "react";

interface KpiCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    trend?: string;
    color: string;
    gradient: string;
}

export default function KpiCard({ title, value, icon, trend, color, gradient }: KpiCardProps) {
    return (
        <div
            className="panel group hover:scale-[1.02] transition-all cursor-default"
            style={{
                background: `var(--bg-card)`,
                border: `1px solid var(--border)`,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: gradient,
                    opacity: 0.5,
                    pointerEvents: 'none'
                }}
            />

            <div className="flex justify-between items-start relative z-10">
                <div
                    style={{
                        padding: 10,
                        borderRadius: 12,
                        background: `${color}15`,
                        color: color,
                        boxShadow: `0 8px 16px ${color}10`
                    }}
                >
                    {icon}
                </div>
                {trend && (
                    <span
                        style={{
                            fontSize: 10,
                            fontWeight: 800,
                            padding: "4px 8px",
                            borderRadius: 20,
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid var(--border)",
                            color: "var(--text-muted)",
                            letterSpacing: 0.5
                        }}
                    >
                        {trend}
                    </span>
                )}
            </div>

            <div className="mt-4 relative z-10">
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--text-muted)] mb-1">{title}</h3>
                <p className="text-2xl font-black text-[var(--text-primary)]">{value}</p>
            </div>

            <div
                className="absolute -bottom-2 -right-2 w-16 h-16 opacity-[0.03] group-hover:scale-125 group-hover:opacity-[0.06] transition-all duration-500 pointer-events-none"
                style={{ color: color }}
            >
                {icon}
            </div>
        </div>
    );
}
