"use client";

import { useFixtures } from "@/context/FixtureContext";
import FixtureTable from "@/components/FixtureTable";
import { Globe } from "lucide-react";

export default function DubaiPage() {
    const { dubaiFixtures } = useFixtures();

    const sortedFixtures = [...dubaiFixtures].sort((a, b) => {
        const numA = parseInt(a.no.match(/\d+/)?.at(0) || "0");
        const numB = parseInt(b.no.match(/\d+/)?.at(0) || "0");
        return numA - numB;
    });

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }} className="anim-fade">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f59e0b18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Globe size={18} style={{ color: "#f59e0b" }} />
                </div>
                <div>
                    <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Dubai Clean Fixtures</h1>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
                        {dubaiFixtures.length} fixtures · GUROL, YOAN
                    </p>
                </div>
            </div>
            <FixtureTable fixtures={sortedFixtures} />
        </div>
    );
}
