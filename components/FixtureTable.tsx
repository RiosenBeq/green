"use client";

import { useState } from "react";
import { Fixture, DUBAI_BROKERS } from "@/types";
import { ChevronDown, ChevronUp, Search, Archive, RotateCcw, Ship } from "lucide-react";

interface FixtureTableProps {
    fixtures: Fixture[];
    onArchive?: (id: string) => void;
    onRestore?: (id: string) => void;
}

const BROKER_COLORS: Record<string, string> = {
    GUROL: "#f59e0b",
    YOAN: "#f59e0b",
    BATU: "#60a5fa",
    OZGUR: "#60a5fa",
    EMRE: "#60a5fa",
};

const OP_COLORS: Record<string, string> = {
    BERK: "#22c55e",
    DUYGU: "#a855f7",
    GIZEM: "#ec4899",
    EZGI: "#06b6d4",
};

export default function FixtureTable({ fixtures, onArchive, onRestore }: FixtureTableProps) {
    const [term, setTerm] = useState("");
    const [sortCol, setSortCol] = useState<keyof Fixture>("cpDate");
    const [sortAsc, setSortAsc] = useState(false);

    const filtered = fixtures.filter((f) => {
        if (!term) return true;
        return Object.values(f).some((v) => String(v).toUpperCase().includes(term.toUpperCase()));
    });

    const sorted = [...filtered].sort((a, b) => {
        const valA = String(a[sortCol] || "");
        const valB = String(b[sortCol] || "");
        if (valA === valB) return 0;
        const cmp = valA > valB ? 1 : -1;
        return sortAsc ? cmp : -cmp;
    });

    const headers: { key: keyof Fixture; label: string; w?: number }[] = [
        { key: "no", label: "#", w: 40 },
        { key: "vessel", label: "Vessel", w: 140 },
        { key: "broker", label: "Broker", w: 80 },
        { key: "operator", label: "Operator", w: 80 },
        { key: "cpDate", label: "C/P Date", w: 100 },
        { key: "layFrom", label: "Laycan", w: 110 },
        { key: "loadPort", label: "Load Port", w: 120 },
        { key: "dischPort", label: "Discharge", w: 140 },
        { key: "cargo", label: "Cargo", w: 120 },
        { key: "charterer", label: "Charterer", w: 100 },
    ];

    const handleSort = (key: keyof Fixture) => {
        if (sortCol === key) setSortAsc(!sortAsc);
        else { setSortCol(key); setSortAsc(true); }
    };

    const brokerColor = (broker: string) => BROKER_COLORS[broker.toUpperCase()] || "#6b7280";
    const opColor = (op: string) => OP_COLORS[op.toUpperCase()] || "#6b7280";

    return (
        <div
            style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                overflow: "hidden",
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 20px",
                    borderBottom: "1px solid var(--border)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Ship size={16} style={{ color: "var(--green-500)" }} />
                    <span style={{ fontWeight: 700, fontSize: 14 }}>Fixtures</span>
                    <span
                        style={{
                            fontSize: 11,
                            fontWeight: 700,
                            fontFamily: "var(--font-mono)",
                            background: "var(--green-glow)",
                            color: "var(--green-500)",
                            padding: "2px 10px",
                            borderRadius: 99,
                        }}
                    >
                        {filtered.length}
                    </span>
                </div>

                <div style={{ position: "relative" }}>
                    <Search
                        size={14}
                        style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
                    />
                    <input
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        placeholder="Search vessels, brokers..."
                        style={{
                            background: "var(--bg-input)",
                            border: "1px solid var(--border)",
                            borderRadius: 10,
                            padding: "8px 12px 8px 32px",
                            fontSize: 12,
                            color: "var(--text-primary)",
                            outline: "none",
                            width: 220,
                            transition: "border-color 0.2s",
                        }}
                    />
                </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            {headers.map((h) => (
                                <th
                                    key={h.key}
                                    onClick={() => handleSort(h.key)}
                                    style={{
                                        padding: "10px 12px",
                                        fontSize: 10,
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        letterSpacing: 1,
                                        color: sortCol === h.key ? "var(--green-400)" : "var(--text-muted)",
                                        textAlign: "left",
                                        cursor: "pointer",
                                        borderBottom: "1px solid var(--border)",
                                        background: "var(--bg-elevated)",
                                        whiteSpace: "nowrap",
                                        userSelect: "none",
                                        width: h.w,
                                    }}
                                >
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                                        {h.label}
                                        {sortCol === h.key && (sortAsc ? <ChevronUp size={10} /> : <ChevronDown size={10} />)}
                                    </span>
                                </th>
                            ))}
                            {(onArchive || onRestore) && (
                                <th style={{ width: 50, padding: "10px 12px", borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)" }} />
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((f, i) => (
                            <tr
                                key={f.id}
                                style={{
                                    borderBottom: "1px solid var(--border)",
                                    transition: "background 0.15s",
                                    cursor: "default",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-elevated)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                                <td style={{ padding: "12px", fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{f.no}</td>
                                <td style={{ padding: "12px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <div
                                            style={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: 8,
                                                background: "var(--green-glow)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 12,
                                                fontWeight: 800,
                                                color: "var(--green-500)",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {f.vessel[0]}
                                        </div>
                                        <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>{f.vessel}</span>
                                        {f.hasDem && (
                                            <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#a855f718", color: "#a855f7", fontWeight: 700 }}>DEM</span>
                                        )}
                                    </div>
                                </td>
                                <td style={{ padding: "12px" }}>
                                    <span
                                        style={{
                                            fontSize: 11,
                                            fontWeight: 700,
                                            padding: "3px 8px",
                                            borderRadius: 6,
                                            background: `${brokerColor(f.broker)}14`,
                                            color: brokerColor(f.broker),
                                        }}
                                    >
                                        {f.broker}
                                    </span>
                                    {f.coBroker && (
                                        <span style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 4 }}>+{f.coBroker}</span>
                                    )}
                                </td>
                                <td style={{ padding: "12px" }}>
                                    <span
                                        style={{
                                            fontSize: 11,
                                            fontWeight: 700,
                                            padding: "3px 8px",
                                            borderRadius: 6,
                                            background: `${opColor(f.operator)}14`,
                                            color: opColor(f.operator),
                                        }}
                                    >
                                        {f.operator}
                                    </span>
                                </td>
                                <td style={{ padding: "12px", fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
                                    {f.cpDate}
                                </td>
                                <td style={{ padding: "12px", fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
                                    {f.layFrom}
                                    {f.layTo && <span style={{ color: "var(--text-muted)" }}> → {f.layTo}</span>}
                                </td>
                                <td style={{ padding: "12px", fontSize: 12, color: "var(--text-secondary)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {f.loadPort}
                                </td>
                                <td style={{ padding: "12px", fontSize: 12, color: "var(--text-secondary)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {f.dischPort}
                                </td>
                                <td style={{ padding: "12px", fontSize: 12, fontWeight: 600, color: "var(--green-400)" }}>
                                    {f.cargo || f.product || "—"}
                                </td>
                                <td style={{ padding: "12px", fontSize: 12, color: "var(--text-secondary)" }}>{f.charterer || "—"}</td>
                                {(onArchive || onRestore) && (
                                    <td style={{ padding: "12px", textAlign: "center" }}>
                                        {onArchive && (
                                            <button
                                                onClick={() => onArchive(f.id)}
                                                title="Archive"
                                                style={{
                                                    background: "transparent",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    color: "var(--text-muted)",
                                                    padding: 4,
                                                    borderRadius: 6,
                                                    transition: "color 0.15s",
                                                }}
                                                onMouseEnter={(e) => (e.currentTarget.style.color = "#f59e0b")}
                                                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                                            >
                                                <Archive size={14} />
                                            </button>
                                        )}
                                        {onRestore && (
                                            <button
                                                onClick={() => onRestore(f.id)}
                                                title="Restore"
                                                style={{
                                                    background: "transparent",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    color: "var(--text-muted)",
                                                    padding: 4,
                                                    borderRadius: 6,
                                                    transition: "color 0.15s",
                                                }}
                                                onMouseEnter={(e) => (e.currentTarget.style.color = "#22c55e")}
                                                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                                            >
                                                <RotateCcw size={14} />
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                        {sorted.length === 0 && (
                            <tr>
                                <td
                                    colSpan={11}
                                    style={{ padding: 48, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}
                                >
                                    No fixtures found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
