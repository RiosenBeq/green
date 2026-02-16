"use client";

import { useState } from "react";
import { useFixtures } from "@/context/FixtureContext";
import FixtureTable from "@/components/FixtureTable";
import { Ship, Archive as ArchiveIcon, RotateCcw } from "lucide-react";

export default function FixturesPage() {
    const { fixtures, archiveFixture, restoreFixture } = useFixtures();
    const [showArchived, setShowArchived] = useState(false);

    const activeFixtures = fixtures.filter((f) => !f.archived);
    const archivedFixtures = fixtures.filter((f) => f.archived);

    const displayed = showArchived ? archivedFixtures : activeFixtures;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }} className="anim-fade">
            {/* Top bar */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Ship size={20} style={{ color: "var(--green-500)" }} />
                    <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Fixture List</h1>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                    <button
                        onClick={() => setShowArchived(false)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "8px 16px",
                            borderRadius: 10,
                            border: "1px solid var(--border)",
                            background: !showArchived ? "var(--green-glow)" : "transparent",
                            color: !showArchived ? "var(--green-500)" : "var(--text-muted)",
                            fontWeight: 600,
                            fontSize: 12,
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                    >
                        <Ship size={14} /> Ongoing
                        <span
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 11,
                                background: !showArchived ? "var(--green-500)" : "var(--bg-elevated)",
                                color: !showArchived ? "#000" : "var(--text-muted)",
                                padding: "1px 8px",
                                borderRadius: 99,
                                fontWeight: 700,
                            }}
                        >
                            {activeFixtures.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setShowArchived(true)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "8px 16px",
                            borderRadius: 10,
                            border: "1px solid var(--border)",
                            background: showArchived ? "#f59e0b18" : "transparent",
                            color: showArchived ? "#f59e0b" : "var(--text-muted)",
                            fontWeight: 600,
                            fontSize: 12,
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                    >
                        <ArchiveIcon size={14} /> Archived
                        <span
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 11,
                                background: showArchived ? "#f59e0b" : "var(--bg-elevated)",
                                color: showArchived ? "#000" : "var(--text-muted)",
                                padding: "1px 8px",
                                borderRadius: 99,
                                fontWeight: 700,
                            }}
                        >
                            {archivedFixtures.length}
                        </span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <FixtureTable
                fixtures={displayed}
                onArchive={!showArchived ? archiveFixture : undefined}
                onRestore={showArchived ? restoreFixture : undefined}
            />
        </div>
    );
}
