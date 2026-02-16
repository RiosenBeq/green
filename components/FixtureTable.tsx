"use client";

import { useState } from "react";
import { Fixture } from "@/types";
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
    Save,
    Clock,
    RefreshCw
} from "lucide-react";
import { useFixtures } from "@/context/FixtureContext";

interface FixtureTableProps {
    fixtures: Fixture[];
    isDemurrage?: boolean;
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

export default function FixtureTable({ fixtures, isDemurrage = false, onArchive, onRestore }: FixtureTableProps) {
    const { updateFixture, cancelFixture, uncancelFixture } = useFixtures();
    const [term, setTerm] = useState("");
    const [sortCol, setSortCol] = useState<keyof Fixture>("no");
    const [sortAsc, setSortAsc] = useState(true);

    // Edit State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingFixture, setEditingFixture] = useState<Fixture | null>(null);

    const filtered = fixtures.filter((f) => {
        if (!term) return true;
        return Object.values(f).some((v) => String(v).toUpperCase().includes(term.toUpperCase()));
    });

    const sorted = [...filtered].sort((a, b) => {
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

    const handleSort = (key: keyof Fixture) => {
        if (sortCol === key) setSortAsc(!sortAsc);
        else { setSortCol(key); setSortAsc(true); }
    };

    const handleStatusChange = (id: string, status: any) => {
        updateFixture(id, { demStatus: status });
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
    const statusColor = (status: string) => {
        switch (status) {
            case 'Paid': return '#22c55e';
            case 'Pending': return '#f59e0b';
            case 'Unpaid': return '#ef4444';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
            {/* Table Search & Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Ship size={16} className="text-[var(--green-500)]" />
                    <span style={{ fontWeight: 700 }}>{isDemurrage ? 'Demurrage Claims' : 'Fixtures'}</span>
                    <span className="nav-badge">{filtered.length}</span>
                </div>
                <div style={{ position: "relative" }}>
                    <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        placeholder="Quick search..."
                        className="fi"
                        style={{ width: 200, paddingLeft: 32, height: 36, borderRadius: 10 }}
                    />
                </div>
            </div>

            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
                            <th onClick={() => handleSort('no')} style={thStyle}>#</th>
                            <th onClick={() => handleSort('vessel')} style={thStyle}>Vessel</th>
                            <th onClick={() => handleSort('broker')} style={thStyle}>Broker</th>
                            <th style={thStyle}>Logistics</th>
                            {isDemurrage ? (
                                <>
                                    <th style={thStyle}>Target Amt</th>
                                    <th style={thStyle}>Initial Amt</th>
                                    <th style={thStyle}>Discounted</th>
                                    <th style={thStyle}>Status</th>
                                </>
                            ) : (
                                <>
                                    <th style={thStyle}>Cargo Info</th>
                                    <th style={thStyle}>Charterer/Owner</th>
                                </>
                            )}
                            <th onClick={() => handleSort('operator')} style={thStyle}>Operator</th>
                            <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((f) => (
                            <tr key={f.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors border-b border-[var(--border)]" style={{ background: f.cancelled ? "rgba(239, 68, 68, 0.08)" : "transparent" }}>
                                <td style={{ padding: "12px", fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{f.no}</td>
                                <td style={{ padding: "12px" }}>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: f.cancelled ? "var(--red-400)" : "var(--text-primary)", textDecoration: f.cancelled ? "line-through" : "none" }}>{f.vessel}</span>
                                        <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{f.cargo} — {f.quantity}</span>
                                    </div>
                                </td>
                                <td style={{ padding: "12px" }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                        <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: `${brokerColor(f.broker)}20`, color: brokerColor(f.broker), width: "fit-content" }}>{f.broker}</span>
                                        {f.coBroker && <span style={{ fontSize: 9, color: "var(--text-muted)" }}>CO: {f.coBroker}</span>}
                                    </div>
                                </td>
                                <td style={{ padding: "12px", fontSize: 11, color: "var(--text-secondary)" }}>
                                    <div>{f.layFrom} <span style={{ opacity: 0.6 }}>{f.layFromTime}</span></div>
                                    <div style={{ color: "var(--green-500)", fontSize: 10, marginTop: 2 }}>{f.loadPort} → {f.dischPort}</div>
                                </td>

                                {isDemurrage ? (
                                    <>
                                        <td style={{ padding: "12px", fontSize: 12, fontWeight: 700 }}>{f.demAmt} {f.demCcy}</td>
                                        <td style={{ padding: "12px", fontSize: 12, color: "var(--text-secondary)" }}>{f.demInitialAmt || '—'}</td>
                                        <td style={{ padding: "12px", fontSize: 12, color: "var(--green-400)", fontWeight: 700 }}>{f.demDiscountedAmt || '—'}</td>
                                        <td style={{ padding: "12px" }}>
                                            <select
                                                value={f.demStatus}
                                                onChange={(e) => handleStatusChange(f.id, e.target.value)}
                                                style={{
                                                    padding: "4px 8px", borderRadius: 6,
                                                    background: `${statusColor(f.demStatus || "Unpaid")}15`,
                                                    color: statusColor(f.demStatus || "Unpaid"),
                                                    border: "none", fontSize: 10, fontWeight: 800, cursor: "pointer"
                                                }}
                                            >
                                                <option value="Unpaid">UNPAID</option>
                                                <option value="Pending">PENDING</option>
                                                <option value="Paid">PAID</option>
                                            </select>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td style={{ padding: "12px", fontSize: 11 }}>
                                            <div style={{ color: "var(--text-primary)" }}>{f.product}</div>
                                            <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Comm: {f.commission}</div>
                                        </td>
                                        <td style={{ padding: "12px", fontSize: 11 }}>
                                            <div style={{ fontWeight: 600 }}>{f.charterer}</div>
                                            <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Owner: {f.owner}</div>
                                        </td>
                                    </>
                                )}

                                <td style={{ padding: "12px" }}>
                                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: `${opColor(f.operator)}15`, color: opColor(f.operator), border: `1px solid ${opColor(f.operator)}20` }}>{f.operator}</span>
                                </td>
                                <td style={{ padding: "12px", textAlign: "right" }}>
                                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                                        <button onClick={() => handleEditClick(f)} className="p-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--green-400)]">
                                            <Edit3 size={14} />
                                        </button>
                                        {f.cancelled ? (
                                            <button onClick={() => uncancelFixture(f.id)} className="p-1.5 rounded-lg bg-[var(--green-glow)] text-[var(--green-500)]">
                                                <RefreshCw size={14} />
                                            </button>
                                        ) : (
                                            <button onClick={() => cancelFixture(f.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20">
                                                <X size={14} />
                                            </button>
                                        )}
                                        {onArchive && !f.archived && (
                                            <button onClick={() => onArchive(f.id)} className="p-1.5 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-muted)]">
                                                <Archive size={14} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && editingFixture && (
                <div style={modalOverlayStyle}>
                    <div className="panel anim-fadeUp" style={{ width: "100%", maxWidth: 600, padding: 32 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                            <h2 style={{ fontSize: 18, fontWeight: 900 }}>Edit Fixture</h2>
                            <button onClick={() => setIsEditModalOpen(false)} style={{ color: "var(--text-muted)" }}><X size={20} /></button>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div className="flex flex-col gap-1">
                                <label style={labelStyle}>Vessel</label>
                                <input value={editingFixture.vessel} onChange={e => setEditingFixture({ ...editingFixture, vessel: e.target.value.toUpperCase() })} className="fi" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label style={labelStyle}>Broker</label>
                                <input value={editingFixture.broker} onChange={e => setEditingFixture({ ...editingFixture, broker: e.target.value.toUpperCase() })} className="fi" />
                            </div>
                            {isDemurrage && (
                                <>
                                    <div className="flex flex-col gap-1">
                                        <label style={labelStyle}>Initial Amt</label>
                                        <input value={editingFixture.demInitialAmt} onChange={e => setEditingFixture({ ...editingFixture, demInitialAmt: e.target.value })} className="fi" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label style={labelStyle}>Discounted Amt</label>
                                        <input value={editingFixture.demDiscountedAmt} onChange={e => setEditingFixture({ ...editingFixture, demDiscountedAmt: e.target.value })} className="fi" />
                                    </div>
                                </>
                            )}
                            <div className="col-span-full pt-4 flex gap-3 justify-end">
                                <button onClick={() => setIsEditModalOpen(false)} className="btn btn-ghost">Cancel</button>
                                <button onClick={handleSaveEdit} className="btn btn-primary"><Save size={16} /> Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const thStyle: React.CSSProperties = {
    padding: "12px",
    textAlign: "left",
    fontSize: 10,
    fontWeight: 700,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: 1,
    cursor: "pointer"
};

const labelStyle: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 700,
    color: "var(--text-muted)",
    textTransform: "uppercase"
};

const modalOverlayStyle: React.CSSProperties = {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000, padding: 20
};
