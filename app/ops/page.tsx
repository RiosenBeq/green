"use client";

import { useFixtures } from "@/context/FixtureContext";
import { Users, Shield, Briefcase, Mail } from "lucide-react";

const OP_COLORS: Record<string, string> = {
    BERK: "#22c55e",
    DUYGU: "#a855f7",
    GIZEM: "#ec4899",
    EZGI: "#06b6d4",
};

const BROKER_COLORS: Record<string, string> = {
    BATU: "#60a5fa",
    EMRE: "#60a5fa",
    GUROL: "#f59e0b",
    OZGUR: "#60a5fa",
    YOAN: "#f59e0b",
};

export default function OpsPage() {
    const { opsUsers, istanbulFixtures, dubaiFixtures } = useFixtures();

    const operators = opsUsers.filter((u) => u.role === "Operator");
    const brokers = opsUsers.filter((u) => u.role === "Broker");

    // Count fixtures per broker
    const brokerCounts: Record<string, { ist: number; dub: number }> = {};
    brokers.forEach((b) => {
        brokerCounts[b.name] = { ist: 0, dub: 0 };
    });
    istanbulFixtures.forEach((f) => {
        const b = f.broker.toUpperCase();
        if (brokerCounts[b]) brokerCounts[b].ist++;
    });
    dubaiFixtures.forEach((f) => {
        const b = f.broker.toUpperCase();
        if (brokerCounts[b]) brokerCounts[b].dub++;
    });

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }} className="anim-fade">
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--green-glow)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Users size={18} style={{ color: "var(--green-500)" }} />
                </div>
                <div>
                    <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>OPS Distribution List</h1>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
                        {operators.length} operators · {brokers.length} brokers
                    </p>
                </div>
            </div>

            {/* Operators */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 14, fontWeight: 700 }}>
                    <Shield size={16} style={{ color: "var(--green-500)" }} />
                    Operators
                    <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginLeft: "auto" }}>{operators.length} members</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                    {operators.map((u) => {
                        const color = OP_COLORS[u.name] || "var(--green-500)";
                        return (
                            <div
                                key={u.name}
                                style={{
                                    background: "var(--bg-elevated)",
                                    border: "1px solid var(--border)",
                                    borderRadius: 14,
                                    padding: "20px 16px",
                                    textAlign: "center",
                                    borderTop: `3px solid ${color}`,
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                }}
                            >
                                <div
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 14,
                                        background: `${color}18`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 12px",
                                        fontSize: 20,
                                        fontWeight: 800,
                                        color,
                                    }}
                                >
                                    {u.name[0]}
                                </div>
                                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "var(--text-primary)" }}>{u.name}</div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 11, color: "var(--text-muted)" }}>
                                    <Mail size={10} /> {u.email}
                                </div>
                                <div style={{ marginTop: 8 }}>
                                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: `${color}18`, color, textTransform: "uppercase" }}>
                                        Operator
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Brokers */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 14, fontWeight: 700 }}>
                    <Briefcase size={16} style={{ color: "#60a5fa" }} />
                    Brokers
                    <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginLeft: "auto" }}>{brokers.length} members</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                    {brokers.map((u) => {
                        const color = BROKER_COLORS[u.name] || "#60a5fa";
                        const counts = brokerCounts[u.name] || { ist: 0, dub: 0 };
                        const totalFix = counts.ist + counts.dub;
                        const isDubai = ["GUROL", "YOAN"].includes(u.name);
                        return (
                            <div
                                key={u.name}
                                style={{
                                    background: "var(--bg-elevated)",
                                    border: "1px solid var(--border)",
                                    borderRadius: 14,
                                    padding: "20px 16px",
                                    textAlign: "center",
                                    borderTop: `3px solid ${color}`,
                                }}
                            >
                                <div
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 14,
                                        background: `${color}18`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 12px",
                                        fontSize: 20,
                                        fontWeight: 800,
                                        color,
                                    }}
                                >
                                    {u.name[0]}
                                </div>
                                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "var(--text-primary)" }}>{u.name}</div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>
                                    <Mail size={10} /> {u.email}
                                </div>
                                <div style={{ display: "flex", gap: 4, justifyContent: "center", flexWrap: "wrap" }}>
                                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: isDubai ? "#f59e0b18" : "#60a5fa18", color: isDubai ? "#f59e0b" : "#60a5fa" }}>
                                        {isDubai ? "Dubai" : "Istanbul"}
                                    </span>
                                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "var(--bg-card)", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
                                        {totalFix} fix
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
