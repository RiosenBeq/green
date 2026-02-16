"use client";

import FixtureTable from "@/components/FixtureTable";
import { useFixtures } from "@/context/FixtureContext";
import { useState } from "react";

export default function DemurragePage() {
    const { istDemurrage, dubDemurrage, fixtures } = useFixtures();
    const [tab, setTab] = useState<"ist" | "dub">("ist");

    // Also show fixtures from main list that have demurrage
    const mainDem = fixtures.filter((f) => f.hasDem && !f.archived);
    const demData = tab === "ist" ? istDemurrage : dubDemurrage;

    return (
        <div className="space-y-6 anim-fade">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>
                    ⏰ Demurrage Claims
                </h2>
                <div style={{ display: "flex", gap: 4 }}>
                    <button
                        className={`btn btn-sm ${tab === "ist" ? "btn-primary" : "btn-ghost"}`}
                        onClick={() => setTab("ist")}
                    >
                        Istanbul
                    </button>
                    <button
                        className={`btn btn-sm ${tab === "dub" ? "btn-primary" : "btn-ghost"}`}
                        onClick={() => setTab("dub")}
                    >
                        Dubai
                    </button>
                </div>
            </div>

            {demData.length > 0 ? (
                <FixtureTable fixtures={demData} />
            ) : (
                <div className="panel" style={{ textAlign: "center", padding: 48, color: "var(--text-muted)" }}>
                    <p style={{ fontSize: 32, marginBottom: 8 }}>📋</p>
                    <p>No {tab === "ist" ? "Istanbul" : "Dubai"} Demurrage claims yet.</p>
                </div>
            )}
        </div>
    );
}
