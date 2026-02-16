"use client";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: string;
    color?: string;
}

export default function StatCard({ label, value, icon, color = "var(--green-500)" }: StatCardProps) {
    return (
        <div className="stat-card">
            <div>
                <div className="stat-label">{label}</div>
                <div className="stat-val" style={{ color }}>{value}</div>
            </div>
            <div className="stat-icon" style={{ background: `${color}15`, fontSize: 24 }}>
                {icon}
            </div>
        </div>
    );
}
