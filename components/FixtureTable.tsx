"use client";

import { useState } from "react";
import { Fixture, DUBAI_BROKERS } from "@/types";
import {
    ChevronDown,
    ChevronUp,
    Search,
    Archive,
    RotateCcw,
    Ship,
    Edit3,
    XCircle,
    CheckCircle2,
    X,
    Save
} from "lucide-react";
import { useFixtures } from "@/context/FixtureContext";

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
    const { updateFixture, cancelFixture, uncancelFixture } = useFixtures();
    const [term, setTerm] = useState("");
    const [sortCol, setSortCol] = useState<keyof Fixture>("cpDate");
    const [sortAsc, setSortAsc] = useState(false);

    // Edit State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingFixture, setEditingFixture] = useState<Fixture | null>(null);

    const filtered = fixtures.filter((f) => {
        if (!term) return true;
        return Object.values(f).some((v) => String(v).toUpperCase().includes(term.toUpperCase()));
    });

    const sorted = [...filtered].sort((a, b) => {
        // Special handling for 'no' as it might be 'IST-1' or just '1'
        if (sortCol === 'no') {
            const getNum = (s: string) => {
                const m = s.match(/\d+/);
                return m ? parseInt(m[0]) : 0;
            };
            const numA = getNum(a.no);
            const numB = getNum(b.no);
            return sortAsc ? numA - numB : numB - numA;
        }

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
        { key: "layFrom", label: "Laycan", w: 160 }, // Wider for time
        { key: "loadPort", label: "Load Port", w: 120 },
        { key: "dischPort", label: "Discharge", w: 140 },
        { key: "cargo", label: "Cargo", w: 120 },
        { key: "charterer", label: "Charterer", w: 100 },
    ];

    const handleSort = (key: keyof Fixture) => {
        if (sortCol === key) setSortAsc(!sortAsc);
        else { setSortCol(key); setSortAsc(true); }
    };

    const handleEditClick = (f: Fixture) => {
        setEditingFixture({ ...f });
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = () => {
        if (editingFixture) {
            updateFixture(editingFixture.id, editingFixture);
            setIsEditModalOpen(false);
            setEditingFixture(null);
        }
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
                position: "relative"
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
                            <th style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)", textAlign: "right", fontSize: 10, color: "var(--text-muted)", width: 100 }}>ACTIONS</th>
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
                                    background: f.cancelled ? "rgba(239, 68, 68, 0.08)" : "transparent"
                                }}
                                onMouseEnter={(e) => {
                                    if (!f.cancelled) e.currentTarget.style.background = "var(--bg-elevated)";
                                }}
                                onMouseLeave={(e) => {
                                    if (!f.cancelled) e.currentTarget.style.background = "transparent";
                                }}
                            >
                                <td style={{ padding: "12px", fontSize: 12, fontFamily: "var(--font-mono)", color: f.cancelled ? "var(--red-400)" : "var(--text-muted)" }}>{f.no}</td>
                                <td style={{ padding: "12px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <div
                                            style={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: 8,
                                                background: f.cancelled ? "rgba(239, 68, 68, 0.15)" : "var(--green-glow)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 12,
                                                fontWeight: 800,
                                                color: f.cancelled ? "var(--red-400)" : "var(--green-500)",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {f.vessel[0]}
                                        </div>
                                        <span style={{
                                            fontWeight: 600,
                                            fontSize: 13,
                                            color: f.cancelled ? "var(--red-400)" : "var(--text-primary)",
                                            textDecoration: f.cancelled ? "line-through" : "none"
                                        }}>
                                            {f.vessel}
                                        </span>
                                        {f.cancelled && (
                                            <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "rgba(239, 68, 68, 0.15)", color: "var(--red-400)", fontWeight: 700 }}>CANCELLED</span>
                                        )}
                                        {f.hasDem && !f.cancelled && (
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
                                            background: f.cancelled ? "rgba(239, 68, 68, 0.1)" : `${brokerColor(f.broker)}14`,
                                            color: f.cancelled ? "#f87171" : brokerColor(f.broker),
                                        }}
                                    >
                                        {f.broker}
                                    </span>
                                </td>
                                <td style={{ padding: "12px" }}>
                                    <span
                                        style={{
                                            fontSize: 11,
                                            fontWeight: 700,
                                            padding: "3px 8px",
                                            borderRadius: 6,
                                            background: f.cancelled ? "rgba(239, 68, 68, 0.1)" : `${opColor(f.operator)}14`,
                                            color: f.cancelled ? "#f87171" : opColor(f.operator),
                                        }}
                                    >
                                        {f.operator}
                                    </span>
                                </td>
                                <td style={{ padding: "12px", fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
                                    {f.cpDate}
                                </td>
                                <td style={{ padding: "12px", fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                        <div>{f.layFrom} <span style={{ color: "var(--text-muted)", fontSize: 10 }}>{f.layFromTime}</span></div>
                                        {f.layTo && (
                                            <div>{f.layTo} <span style={{ color: "var(--text-muted)", fontSize: 10 }}>{f.layToTime}</span></div>
                                        )}
                                    </div>
                                </td>
                                <td style={{ padding: "12px", fontSize: 12, color: "var(--text-secondary)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {f.loadPort}
                                </td>
                                <td style={{ padding: "12px", fontSize: 12, color: "var(--text-secondary)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {f.dischPort}
                                </td>
                                <td style={{ padding: "12px", fontSize: 12, fontWeight: 600, color: f.cancelled ? "var(--text-muted)" : "var(--green-400)" }}>
                                    {f.cargo || f.product || "—"}
                                </td>
                                <td style={{ padding: "12px", fontSize: 12, color: "var(--text-secondary)" }}>{f.charterer || "—"}</td>
                                <td style={{ padding: "12px", textAlign: "right" }}>
                                    <div style={{ display: "inline-flex", gap: 4 }}>
                                        {/* Edit */}
                                        <button
                                            onClick={() => handleEditClick(f)}
                                            title="Edit Fixture"
                                            style={{
                                                background: "transparent",
                                                border: "none",
                                                cursor: "pointer",
                                                color: "var(--text-muted)",
                                                padding: 6,
                                                borderRadius: 6,
                                                transition: "all 0.15s",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = "var(--green-400)";
                                                e.currentTarget.style.background = "var(--bg-input)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = "var(--text-muted)";
                                                e.currentTarget.style.background = "transparent";
                                            }}
                                        >
                                            <Edit3 size={14} />
                                        </button>

                                        {/* Cancel/Uncancel */}
                                        {f.cancelled ? (
                                            <button
                                                onClick={() => uncancelFixture(f.id)}
                                                title="Uncancel"
                                                style={{
                                                    background: "transparent",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    color: "var(--green-500)",
                                                    padding: 6,
                                                    borderRadius: 6,
                                                    transition: "all 0.15s",
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-input)"}
                                                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                            >
                                                <CheckCircle2 size={14} />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => cancelFixture(f.id)}
                                                title="Cancel Fixture"
                                                style={{
                                                    background: "transparent",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    color: "var(--red-500)",
                                                    padding: 6,
                                                    borderRadius: 6,
                                                    transition: "all 0.15s",
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-input)"}
                                                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                            >
                                                <XCircle size={14} />
                                            </button>
                                        )}

                                        {/* Archive/Restore */}
                                        {onArchive && !f.archived && (
                                            <button
                                                onClick={() => onArchive(f.id)}
                                                title="Archive"
                                                style={{
                                                    background: "transparent",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    color: "var(--text-muted)",
                                                    padding: 6,
                                                    borderRadius: 6,
                                                    transition: "all 0.15s",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.color = "#f59e0b";
                                                    e.currentTarget.style.background = "var(--bg-input)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.color = "var(--text-muted)";
                                                    e.currentTarget.style.background = "transparent";
                                                }}
                                            >
                                                <Archive size={14} />
                                            </button>
                                        )}
                                        {onRestore && f.archived && (
                                            <button
                                                onClick={() => onRestore(f.id)}
                                                title="Restore"
                                                style={{
                                                    background: "transparent",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    color: "var(--text-muted)",
                                                    padding: 6,
                                                    borderRadius: 6,
                                                    transition: "all 0.15s",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.color = "#22c55e";
                                                    e.currentTarget.style.background = "var(--bg-input)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.color = "var(--text-muted)";
                                                    e.currentTarget.style.background = "transparent";
                                                }}
                                            >
                                                <RotateCcw size={14} />
                                            </button>
                                        )}
                                    </div>
                                </td>
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

            {/* Edit Modal */}
            {isEditModalOpen && editingFixture && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.8)",
                    backdropFilter: "blur(4px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000,
                    padding: 20
                }}>
                    <div style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: 20,
                        width: "100%",
                        maxWidth: 600,
                        maxHeight: "90vh",
                        overflowY: "auto",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
                    }} className="anim-fade">
                        <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Edit Fixture</h2>
                            <button onClick={() => setIsEditModalOpen(false)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><X size={20} /></button>
                        </div>

                        <div style={{ padding: "32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Vessel</label>
                                <input value={editingFixture.vessel} onChange={e => setEditingFixture({ ...editingFixture, vessel: e.target.value })} style={modalInputStyle} />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Broker</label>
                                <input value={editingFixture.broker} onChange={e => setEditingFixture({ ...editingFixture, broker: e.target.value })} style={modalInputStyle} />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Operator</label>
                                <input value={editingFixture.operator} onChange={e => setEditingFixture({ ...editingFixture, operator: e.target.value })} style={modalInputStyle} />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>C/P Date</label>
                                <input type="date" value={editingFixture.cpDate} onChange={e => setEditingFixture({ ...editingFixture, cpDate: e.target.value })} style={modalInputStyle} />
                            </div>

                            <div style={{ gridColumn: "1/-1", height: 1, background: "var(--border)", margin: "10px 0" }}></div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Laycan From</label>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <input type="date" value={editingFixture.layFrom} onChange={e => setEditingFixture({ ...editingFixture, layFrom: e.target.value })} style={{ ...modalInputStyle, flex: 1 }} />
                                    <input type="time" value={editingFixture.layFromTime} onChange={e => setEditingFixture({ ...editingFixture, layFromTime: e.target.value })} style={{ ...modalInputStyle, width: 90 }} />
                                </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Laycan To</label>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <input type="date" value={editingFixture.layTo} onChange={e => setEditingFixture({ ...editingFixture, layTo: e.target.value })} style={{ ...modalInputStyle, flex: 1 }} />
                                    <input type="time" value={editingFixture.layToTime} onChange={e => setEditingFixture({ ...editingFixture, layToTime: e.target.value })} style={{ ...modalInputStyle, width: 90 }} />
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Load Port</label>
                                <input value={editingFixture.loadPort} onChange={e => setEditingFixture({ ...editingFixture, loadPort: e.target.value })} style={modalInputStyle} />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Disch Port</label>
                                <input value={editingFixture.dischPort} onChange={e => setEditingFixture({ ...editingFixture, dischPort: e.target.value })} style={modalInputStyle} />
                            </div>
                        </div>

                        <div style={{ padding: "24px 32px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: 12 }}>
                            <button onClick={() => setIsEditModalOpen(false)} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-primary)", padding: "10px 20px", borderRadius: 12, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                            <button onClick={handleSaveEdit} style={{ background: "var(--green-500)", border: "none", color: "#000", padding: "10px 24px", borderRadius: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                                <Save size={18} /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const modalInputStyle = {
    background: "var(--bg-input)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "12px 16px",
    fontSize: 14,
    color: "var(--text-primary)",
    outline: "none",
    width: "100%",
    transition: "border-color 0.2s",
};
