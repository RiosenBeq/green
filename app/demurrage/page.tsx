"use client";

import { useState } from "react";
import { useFixtures } from "@/context/FixtureContext";
import FixtureTable from "@/components/FixtureTable";
import { Clock, Anchor, Globe } from "lucide-react";

export default function DemurragePage() {
    const { filteredIstDemurrage, filteredDubDemurrage } = useFixtures();
    const [activeTab, setActiveTab] = useState<"istanbul" | "dubai">("istanbul");

    const data = activeTab === "istanbul" ? filteredIstDemurrage : filteredDubDemurrage;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }} className="anim-fade">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#a855f718", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Clock size={18} style={{ color: "#a855f7" }} />
                </div>
                <div>
                    <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Demurrage Claims</h1>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
                        {filteredIstDemurrage.length + filteredDubDemurrage.length} total claims
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 8 }}>
                <button
                    onClick={() => setActiveTab("istanbul")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 16px",
                        borderRadius: 10,
                        border: "1px solid var(--border)",
                        background: activeTab === "istanbul" ? "#60a5fa18" : "transparent",
                        color: activeTab === "istanbul" ? "#60a5fa" : "var(--text-muted)",
                        fontWeight: 600,
                        fontSize: 12,
                        cursor: "pointer",
                        transition: "all 0.2s",
                    }}
                >
                    <Anchor size={14} /> Istanbul
                    <span
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            padding: "1px 8px",
                            borderRadius: 99,
                            background: activeTab === "istanbul" ? "#60a5fa" : "var(--bg-elevated)",
                            color: activeTab === "istanbul" ? "#000" : "var(--text-muted)",
                            fontWeight: 700,
                        }}
                    >
                        {filteredIstDemurrage.length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab("dubai")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 16px",
                        borderRadius: 10,
                        border: "1px solid var(--border)",
                        background: activeTab === "dubai" ? "#f59e0b18" : "transparent",
                        color: activeTab === "dubai" ? "#f59e0b" : "var(--text-muted)",
                        fontWeight: 600,
                        fontSize: 12,
                        cursor: "pointer",
                        transition: "all 0.2s",
                    }}
                >
                    <Globe size={14} /> Dubai
                    <span
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            padding: "1px 8px",
                            borderRadius: 99,
                            background: activeTab === "dubai" ? "#f59e0b" : "var(--bg-elevated)",
                            color: activeTab === "dubai" ? "#000" : "var(--text-muted)",
                            fontWeight: 700,
                        }}
                    >
                        {filteredDubDemurrage.length}
                    </span>
                </button>
            </div>

            {/* Table */}
            {data.length > 0 ? (
                <FixtureTable fixtures={data} isDemurrage={true} />
            ) : (
                <div
                    style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: 16,
                        padding: "64px 24px",
                        textAlign: "center",
                    }}
                >
                    <Clock size={32} style={{ color: "var(--text-muted)", marginBottom: 12, opacity: 0.4 }} />
                    <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0 }}>
                        No demurrage claims for {activeTab === "istanbul" ? "Istanbul" : "Dubai"}
                    </p>
                    <p style={{ color: "var(--text-muted)", fontSize: 12, margin: "4px 0 0", opacity: 0.6 }}>
                        Claims will appear here when added to the Excel sheet
                    </p>
                </div>
            )}
        </div>
    );
}
