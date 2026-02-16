import { Fixture } from "@/types";
import { Clock, AlertTriangle, CheckCircle } from "lucide-react";

interface LaycanListProps {
    fixtures: Fixture[];
}

export default function LaycanList({ fixtures }: LaycanListProps) {
    // Sort by layFrom date, only show future or recent
    const sorted = [...fixtures]
        .sort((a, b) => new Date(a.layFrom).getTime() - new Date(b.layFrom).getTime())
        .slice(0, 6);

    const getStatus = (dateStr: string) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diffTime = d.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { color: "text-gray-500", icon: CheckCircle, label: "Started" };
        if (diffDays <= 3) return { color: "text-red-400", icon: AlertTriangle, label: "Urgent" };
        if (diffDays <= 7) return { color: "text-amber-400", icon: Clock, label: "Coming Soon" };
        return { color: "text-green-500", icon: Clock, label: "Upcoming" };
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sorted.map(f => {
                const { color, icon: Icon, label } = getStatus(f.layFrom);
                return (
                    <div key={f.id} className="p-4 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)] hover:border-[var(--green-500)] transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-sm text-[var(--text-primary)]">{f.vessel}</h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--bg-card)] border border-[var(--border)] ${color}`}>
                                {label}
                            </span>
                        </div>
                        <div className="text-xs text-[var(--text-muted)] space-y-1">
                            <div className="flex justify-between">
                                <span>Laycan:</span>
                                <span className="font-mono text-[var(--text-secondary)]">{f.layFrom}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Chart/Own:</span>
                                <span className="text-[var(--text-secondary)] max-w-[100px] truncate">{f.charterer}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Cargo:</span>
                                <span className="text-[var(--green-400)] font-medium">{f.cargo}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
            {sorted.length === 0 && (
                <div className="col-span-full text-center py-8 text-[var(--text-muted)]">No upcoming laycans</div>
            )}
        </div>
    );
}
