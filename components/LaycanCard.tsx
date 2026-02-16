"use client";

import { Fixture } from "@/types";
import { Clock } from "lucide-react";

interface LaycanCardProps {
    fixture: Fixture;
}

export default function LaycanCard({ fixture }: LaycanCardProps) {
    // Helper to format dates to dd.mm.yyyy
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "—";
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
    };

    return (
        <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--green-500)] transition-all group overflow-hidden relative">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="text-sm font-black group-hover:text-[var(--green-400)] transition-colors truncate max-w-[140px]">
                        {fixture.vessel}
                    </h4>
                    <p className="text-[9px] uppercase tracking-widest text-[var(--text-muted)]">{fixture.broker}</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)]">
                    {fixture.no}
                </span>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-[var(--text-secondary)] font-medium">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5">
                    <Clock size={10} className="text-[var(--green-500)]" />
                    <span>{formatDate(fixture.layFrom)}</span>
                </div>
                <span className="opacity-30">→</span>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5">
                    <span>{formatDate(fixture.layTo || fixture.layFrom)}</span>
                </div>
            </div>

            <div className="mt-3 flex justify-between items-center bg-black/20 -mx-4 -mb-4 px-4 py-2 border-t border-white/5">
                <span className="text-[9px] font-bold text-[var(--text-muted)] truncate">{fixture.loadPort} / {fixture.dischPort}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--green-500)] shadow-[0_0_5px_var(--green-500)]" />
            </div>
        </div>
    );
}
