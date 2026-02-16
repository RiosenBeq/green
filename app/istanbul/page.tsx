"use client";

import { useFixtures } from "@/context/FixtureContext";
import FixtureTable from "@/components/FixtureTable";
import { Anchor } from "lucide-react";

export default function IstanbulPage() {
    const { istanbulFixtures } = useFixtures();

    const sortedFixtures = [...istanbulFixtures].sort((a, b) => {
        const numA = parseInt(a.no.match(/\d+/)?.at(0) || "0");
        const numB = parseInt(b.no.match(/\d+/)?.at(0) || "0");
        return numA - numB;
    });

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }} className="anim-fade">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#60a5fa18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Anchor size={18} style={{ color: "#60a5fa" }} />
                </div>
                <div>
                    <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Istanbul Clean Fixtures</h1>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
                        {istanbulFixtures.length} fixtures · BATU, EMRE, OZGUR
                    </p>
                </div>
            </div>
            <FixtureTable fixtures={sortedFixtures} />
        </div>
    );
}
