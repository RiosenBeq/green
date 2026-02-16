"use client";

import { useFixtures } from "@/context/FixtureContext";
import { useState } from "react";
import { UserPlus, Trash2, Mail } from "lucide-react";

export default function OpsPage() {
    const { opsUsers } = useFixtures();
    const [users, setUsers] = useState(opsUsers);

    return (
        <div className="space-y-6 anim-fade">
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>
                👥 OPS Distribution List
            </h2>

            {/* Team Summary */}
            <div className="stat-row" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                <div className="stat-card">
                    <div>
                        <div className="stat-label">Operators</div>
                        <div className="stat-val" style={{ color: "var(--green-500)" }}>
                            {users.filter((u) => u.role === "Operator").length}
                        </div>
                    </div>
                    <div className="stat-icon" style={{ background: "var(--green-glow)" }}>👤</div>
                </div>
                <div className="stat-card">
                    <div>
                        <div className="stat-label">Brokers</div>
                        <div className="stat-val" style={{ color: "var(--blue-500)" }}>
                            {users.filter((u) => u.role === "Broker").length}
                        </div>
                    </div>
                    <div className="stat-icon" style={{ background: "var(--blue-glow)" }}>🤝</div>
                </div>
                <div className="stat-card">
                    <div>
                        <div className="stat-label">Total Team</div>
                        <div className="stat-val" style={{ color: "var(--amber-500)" }}>
                            {users.length}
                        </div>
                    </div>
                    <div className="stat-icon" style={{ background: "rgba(245,158,11,.12)" }}>👥</div>
                </div>
            </div>

            {/* User List */}
            <div className="panel">
                <div className="panel-title">Team Members</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {users.map((user, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "14px 18px",
                                background: "var(--bg-input)",
                                borderRadius: "var(--r-md)",
                                border: "1px solid var(--border)",
                                transition: "var(--transition)",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                <div
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 10,
                                        background:
                                            user.role === "Operator"
                                                ? "var(--green-glow)"
                                                : "var(--blue-glow)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 18,
                                        color:
                                            user.role === "Operator"
                                                ? "var(--green-500)"
                                                : "var(--blue-500)",
                                        fontWeight: 700,
                                    }}
                                >
                                    {user.name[0]}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 14 }}>{user.name}</div>
                                    <div style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
                                        <Mail size={11} /> {user.email}
                                    </div>
                                </div>
                            </div>
                            <span
                                className={`badge ${user.role === "Operator" ? "badge-ist" : "badge-dub"}`}
                            >
                                {user.role}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
