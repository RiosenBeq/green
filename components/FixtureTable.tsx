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
    Save,
    Clock,
    RefreshCw,
    DollarSign,
    X
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
    const { updateFixture, cancelFixture, uncancelFixture, deleteFixture, searchQuery, setSearchQuery } = useFixtures();
    const [sortCol, setSortCol] = useState<keyof Fixture>("no");
    const [sortAsc, setSortAsc] = useState(false); // Default to descending

    // Edit State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingFixture, setEditingFixture] = useState<Fixture | null>(null);

    const filtered = fixtures.filter((f) => {
        if (!searchQuery) return true;
        const term = searchQuery.toUpperCase();
        return (
            (f.vessel?.toUpperCase() || "").includes(term) ||
            (f.charterer?.toUpperCase() || "").includes(term) ||
            (f.owner?.toUpperCase() || "").includes(term) ||
            (f.loadPort?.toUpperCase() || "").includes(term) ||
            (f.dischPort?.toUpperCase() || "").includes(term) ||
            (f.no?.toUpperCase() || "").includes(term) ||
            (f.cargo?.toUpperCase() || "").includes(term)
        );
    });

    const getRiskLevel = (dateStr: string | undefined, received: boolean | undefined) => {
        if (!dateStr || received) return 'none';
        const diff = Date.now() - new Date(dateStr).getTime();
        const days = diff / (1000 * 60 * 60 * 24);
        if (days >= 60) return 'high';
        if (days >= 30) return 'medium';
        return 'low';
    };

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

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to PERMANENTLY delete this fixture?")) {
            deleteFixture(id);
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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Quick search..."
                        className="fi"
                        style={{ width: 220, paddingLeft: 32, height: 36, borderRadius: 10, fontSize: 12 }}
                    />
                </div>
            </div>

            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
                            <th onClick={() => handleSort('no')} style={thStyle}>#</th>
                            <th onClick={() => handleSort('vessel')} style={thStyle}>Vessel</th>
                            <th onClick={() => handleSort('broker')} style={thStyle}>Broker / Risk</th>
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
                        {sorted.map((f) => {
                            const riskF = getRiskLevel(f.commFreightInvoiceDate, f.commFreightReceived);
                            const riskD = getRiskLevel(f.commDemInvoiceDate, f.commDemReceived);

                            return (
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
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: `${brokerColor(f.broker)}20`, color: brokerColor(f.broker), width: "fit-content" }}>{f.broker}</span>
                                                <div style={{ display: "flex", gap: 3 }}>
                                                    {riskF !== 'none' && <div title="Freight Comm Risk" style={{ width: 6, height: 6, borderRadius: '50%', background: riskF === 'high' ? '#ef4444' : riskF === 'medium' ? '#f59e0b' : '#22c55e' }} />}
                                                    {riskD !== 'none' && <div title="Demurrage Comm Risk" style={{ width: 6, height: 6, borderRadius: '50%', border: '1px solid currentColor', background: riskD === 'high' ? '#ef4444' : riskD === 'medium' ? '#f59e0b' : '#22c55e' }} />}
                                                </div>
                                            </div>
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
                                            <button onClick={() => handleEditClick(f)} className="p-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--green-400)]" title="Edit Fixture">
                                                <Edit3 size={14} />
                                            </button>

                                            {f.archived ? (
                                                <div style={{ display: "flex", gap: 4 }}>
                                                    {onRestore && (
                                                        <button onClick={() => onRestore(f.id)} className="p-1.5 rounded-lg bg-[var(--bg-elevated)] text-[var(--green-500)]" title="Restore">
                                                            <RotateCcw size={14} />
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleDelete(f.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20" title="Permanently Delete">
                                                        <XCircle size={14} className="opacity-70" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    {onArchive && (
                                                        <button onClick={() => onArchive(f.id)} className="p-1.5 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-amber-500" title="Archive">
                                                            <Archive size={14} />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && editingFixture && (
                <div style={modalOverlayStyle}>
                    <div className="panel anim-fadeUp" style={{ width: "100%", maxWidth: 1000, padding: 32, maxHeight: '95vh', overflowY: 'auto' }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                            <div className="flex items-center gap-3">
                                <h2 style={{ fontSize: 18, fontWeight: 900 }}>Edit Fixture #{editingFixture.no}</h2>
                                {editingFixture.cancelled && <span className="text-[10px] font-black bg-red-500 text-white px-2 py-0.5 rounded uppercase">Cancelled</span>}
                            </div>
                            <button onClick={() => setIsEditModalOpen(false)} style={{ color: "var(--text-muted)" }}><X size={20} /></button>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
                            {/* Row 1: Vessel info & Status */}
                            <div className="col-span-full grid grid-cols-4 gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 items-end">
                                <div className="flex flex-col gap-1">
                                    <label style={labelStyle}>Vessel</label>
                                    <input value={editingFixture.vessel} onChange={e => setEditingFixture({ ...editingFixture, vessel: e.target.value.toUpperCase() })} className="fi" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label style={labelStyle}>Broker</label>
                                    <input value={editingFixture.broker} onChange={e => setEditingFixture({ ...editingFixture, broker: e.target.value.toUpperCase() })} className="fi" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label style={labelStyle}>Operator</label>
                                    <input value={editingFixture.operator} onChange={e => setEditingFixture({ ...editingFixture, operator: e.target.value.toUpperCase() })} className="fi" />
                                </div>
                                <div className="flex flex-col gap-2 justify-center items-end">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Cancelled Status</span>
                                        <div className="relative">
                                            <input type="checkbox" checked={editingFixture.cancelled} onChange={e => setEditingFixture({ ...editingFixture, cancelled: e.target.checked })} className="sr-only" />
                                            <div className={`w-12 h-6 rounded-full transition-all ${editingFixture.cancelled ? 'bg-red-500' : 'bg-[var(--border)]'}`}></div>
                                            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md transition-all ${editingFixture.cancelled ? 'translate-x-6' : ''}`}></div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Section: Cargo & Logistics */}
                            <div className="col-span-2 space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--green-500)] opacity-60">Logistics & Cargo</h3>
                                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="flex flex-col gap-1">
                                        <label style={labelStyle}>CP Date</label>
                                        <input type="date" value={editingFixture.cpDate} onChange={e => setEditingFixture({ ...editingFixture, cpDate: e.target.value })} className="fi" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label style={labelStyle}>Charterer</label>
                                        <input value={editingFixture.charterer} onChange={e => setEditingFixture({ ...editingFixture, charterer: e.target.value.toUpperCase() })} className="fi" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label style={labelStyle}>Load Port</label>
                                        <input value={editingFixture.loadPort} onChange={e => setEditingFixture({ ...editingFixture, loadPort: e.target.value.toUpperCase() })} className="fi" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label style={labelStyle}>Disch Port</label>
                                        <input value={editingFixture.dischPort} onChange={e => setEditingFixture({ ...editingFixture, dischPort: e.target.value.toUpperCase() })} className="fi" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label style={labelStyle}>Product</label>
                                        <input value={editingFixture.product} onChange={e => setEditingFixture({ ...editingFixture, product: e.target.value.toUpperCase() })} className="fi" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label style={labelStyle}>Quantity</label>
                                        <input value={editingFixture.quantity} onChange={e => setEditingFixture({ ...editingFixture, quantity: e.target.value })} className="fi" />
                                    </div>
                                </div>
                            </div>

                            {/* Section: Laycan */}
                            <div className="col-span-2 space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--green-500)] opacity-60">Laycan Schedule</h3>
                                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="flex flex-col gap-1">
                                        <label style={labelStyle}>Lay From</label>
                                        <input type="date" value={editingFixture.layFrom} onChange={e => setEditingFixture({ ...editingFixture, layFrom: e.target.value })} className="fi" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label style={labelStyle}>Start Time</label>
                                        <input type="time" value={editingFixture.layFromTime} onChange={e => setEditingFixture({ ...editingFixture, layFromTime: e.target.value })} className="fi" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label style={labelStyle}>Lay To</label>
                                        <input type="date" value={editingFixture.layTo} onChange={e => setEditingFixture({ ...editingFixture, layTo: e.target.value })} className="fi" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label style={labelStyle}>End Time</label>
                                        <input type="time" value={editingFixture.layToTime} onChange={e => setEditingFixture({ ...editingFixture, layToTime: e.target.value })} className="fi" />
                                    </div>
                                </div>
                            </div>

                            {/* Commission Tracking Section */}
                            <div className="col-span-full border-t border-[var(--border)] pt-8 mt-2">
                                <div className="flex items-center gap-2 mb-6">
                                    <DollarSign size={16} className="text-[var(--green-500)]" />
                                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Commission & Financials</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Freight */}
                                    <div className="space-y-4 p-5 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="flex justify-between items-center">
                                            <div className="text-[10px] font-black uppercase tracking-widest opacity-60 text-[var(--green-500)]">Freight Tracking</div>
                                            <div className="text-[10px] font-mono opacity-40">COMM_OVER_FREIGHT</div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 items-end">
                                            <label className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5 cursor-pointer hover:border-[var(--green-500)/30] transition-all">
                                                <input type="checkbox" checked={editingFixture.commFreightInvoiced} onChange={e => setEditingFixture({ ...editingFixture, commFreightInvoiced: e.target.checked })} className="w-4 h-4 rounded border-[var(--border)] text-[var(--green-500)]" />
                                                <span className="text-[10px] uppercase font-bold tracking-tight">Invoiced</span>
                                            </label>
                                            <div className="flex flex-col gap-1">
                                                <label style={labelStyle}>Inv Date</label>
                                                <input type="date" value={editingFixture.commFreightInvoiceDate || ''} onChange={e => setEditingFixture({ ...editingFixture, commFreightInvoiceDate: e.target.value })} className="fi text-xs h-10" />
                                            </div>
                                            <label className="col-span-full flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5 cursor-pointer hover:border-[var(--green-500)/30] transition-all">
                                                <input type="checkbox" checked={editingFixture.commFreightReceived} onChange={e => setEditingFixture({ ...editingFixture, commFreightReceived: e.target.checked })} className="w-4 h-4 rounded border-[var(--border)] text-[var(--green-500)]" />
                                                <span className="text-[10px] uppercase font-bold tracking-tight">Freight Comm Received / Paid</span>
                                            </label>
                                        </div>
                                    </div>
                                    {/* Demurrage */}
                                    <div className="space-y-4 p-5 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="flex justify-between items-center">
                                            <div className="text-[10px] font-black uppercase tracking-widest opacity-60 text-amber-500">Demurrage Tracking</div>
                                            <div className="text-[10px] font-mono opacity-40">COMM_OVER_DEM</div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 items-end">
                                            <label className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5 cursor-pointer hover:border-amber-500/30 transition-all">
                                                <input type="checkbox" checked={editingFixture.commDemInvoiced} onChange={e => setEditingFixture({ ...editingFixture, commDemInvoiced: e.target.checked })} className="w-4 h-4 rounded border-[var(--border)] text-amber-500" />
                                                <span className="text-[10px] uppercase font-bold tracking-tight">Invoiced</span>
                                            </label>
                                            <div className="flex flex-col gap-1">
                                                <label style={labelStyle}>Inv Date</label>
                                                <input type="date" value={editingFixture.commDemInvoiceDate || ''} onChange={e => setEditingFixture({ ...editingFixture, commDemInvoiceDate: e.target.value })} className="fi text-xs h-10" />
                                            </div>
                                            <label className="col-span-full flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5 cursor-pointer hover:border-amber-500/30 transition-all">
                                                <input type="checkbox" checked={editingFixture.commDemReceived} onChange={e => setEditingFixture({ ...editingFixture, commDemReceived: e.target.checked })} className="w-4 h-4 rounded border-[var(--border)] text-amber-500" />
                                                <span className="text-[10px] uppercase font-bold tracking-tight">Dem Comm Received / Paid</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Claims & Dem Details (Standalone or integrated) */}
                            <div className="col-span-full border-t border-[var(--border)] pt-8 mt-4 grid grid-cols-4 gap-6">
                                <div className="flex flex-col gap-1">
                                    <label style={labelStyle}>Dem Rate</label>
                                    <input value={editingFixture.demRate} onChange={e => setEditingFixture({ ...editingFixture, demRate: e.target.value })} className="fi" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label style={labelStyle}>Agreed LT</label>
                                    <input value={editingFixture.agreedLt} onChange={e => setEditingFixture({ ...editingFixture, agreedLt: e.target.value })} className="fi" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label style={labelStyle}>Initial Claim</label>
                                    <input value={editingFixture.demInitialAmt} onChange={e => setEditingFixture({ ...editingFixture, demInitialAmt: e.target.value })} className="fi" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label style={labelStyle}>Final Claim</label>
                                    <input value={editingFixture.demDiscountedAmt} onChange={e => setEditingFixture({ ...editingFixture, demDiscountedAmt: e.target.value })} className="fi" />
                                </div>
                            </div>

                            <div className="col-span-full pt-8 flex gap-4 justify-end border-t border-[var(--border)] mt-4">
                                <button onClick={() => setIsEditModalOpen(false)} className="px-8 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-muted)] font-bold text-sm hover:bg-white/5 transition-colors">Cancel</button>
                                <button onClick={handleSaveEdit} className="btn-primary" style={{ height: 44, padding: "0 32px" }}>
                                    <Save size={18} /> Save All Changes
                                </button>
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
