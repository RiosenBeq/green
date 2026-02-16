"use client";

import { useState } from "react";
import { useFixtures } from "@/context/FixtureContext";
import FixtureTable from "@/components/FixtureTable";
import { Anchor, Globe, Ship } from "lucide-react";

export default function AllFixturesPage() {
    const { filteredIstanbul, filteredDubai } = useFixtures();
    const [activeTab, setActiveTab] = useState<"istanbul" | "dubai">("istanbul");

    const data = activeTab === "istanbul" ? filteredIstanbul : filteredDubai;

    // Sorting logic for regional views (newest first)
    const sortedFixtures = [...data].sort((a, b) => {
        const numA = parseInt(a.no.match(/\d+/)?.at(0) || "0");
        const numB = parseInt(b.no.match(/\d+/)?.at(0) || "0");
        return numB - numA;
    });

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }} className="anim-fade">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--green-500)15", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--green-500)20" }}>
                    <Ship size={18} className="text-[var(--green-500)]" />
                </div>
                <div>
                    <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>All Fixtures</h1>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
                        {filteredIstanbul.length} Istanbul · {filteredDubai.length} Dubai
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
                        {filteredIstanbul.length}
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
                        {filteredDubai.length}
                    </span>
                </button>
            </div>

            {/* Table */}
            <FixtureTable fixtures={sortedFixtures} />
        </div>
    );
}
