"use client";

import FixtureTable from "@/components/FixtureTable";
import { useFixtures } from "@/context/FixtureContext";
import { useState } from "react";
import { Archive, RotateCcw } from "lucide-react";

export default function FixturesPage() {
    const { fixtures, archiveFixture, restoreFixture } = useFixtures();
    const [showArchived, setShowArchived] = useState(false);

    const activeFixtures = fixtures.filter((f) => !f.archived);
    const archivedFixtures = fixtures.filter((f) => f.archived);
    const displayFixtures = showArchived ? archivedFixtures : activeFixtures;

    return (
        <div className="space-y-6 anim-fade">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>
                    {showArchived ? "Archived Fixtures" : "Ongoing Fixtures"}
                    <span style={{
                        marginLeft: 10, fontSize: 12, color: "var(--text-muted)",
                        fontFamily: "var(--font-mono)", background: "var(--bg-input)",
                        padding: "2px 10px", borderRadius: 20
                    }}>
                        {displayFixtures.length}
                    </span>
                </h2>
                <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowArchived(!showArchived)}
                >
                    {showArchived ? <RotateCcw size={14} /> : <Archive size={14} />}
                    {showArchived ? "Show Ongoing" : "Show Archived"}
                </button>
            </div>
            <FixtureTable
                fixtures={displayFixtures}
                onArchive={showArchived ? undefined : archiveFixture}
                onRestore={showArchived ? restoreFixture : undefined}
            />
        </div>
    );
}
