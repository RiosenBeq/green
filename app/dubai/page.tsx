"use client";

import FixtureTable from "@/components/FixtureTable";
import { useFixtures } from "@/context/FixtureContext";

export default function DubaiPage() {
    const { dubaiFixtures } = useFixtures();

    return (
        <div className="space-y-6 anim-fade">
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>
                🌍 Dubai Clean Fixtures
                <span style={{
                    marginLeft: 10, fontSize: 12, color: "var(--text-muted)",
                    fontFamily: "var(--font-mono)", background: "var(--bg-input)",
                    padding: "2px 10px", borderRadius: 20
                }}>
                    {dubaiFixtures.length}
                </span>
            </h2>
            <FixtureTable fixtures={dubaiFixtures} />
        </div>
    );
}
