"use client";

import { useState } from "react";
import Link from "next/link";
import { Fixture, DUBAI_BROKERS } from "@/types";
import { ChevronDown, ChevronUp, Search, Eye, Archive, RotateCcw } from "lucide-react";

interface FixtureTableProps {
    fixtures: Fixture[];
    onArchive?: (id: string) => void;
    onRestore?: (id: string) => void;
}

export default function FixtureTable({
    fixtures,
    onArchive,
    onRestore,
}: FixtureTableProps) {
    const [term, setTerm] = useState("");
    const [sortCol, setSortCol] = useState<keyof Fixture>("cpDate");
    const [sortAsc, setSortAsc] = useState(false);

    const isDubai = (broker: string) => DUBAI_BROKERS.includes((broker || '').toUpperCase());

    const filtered = fixtures.filter(f => {
        if (!term) return true;
        return Object.values(f).some(v =>
            String(v).toUpperCase().includes(term.toUpperCase())
        );
    });

    const sorted = [...filtered].sort((a, b) => {
        const valA = String(a[sortCol] || "");
        const valB = String(b[sortCol] || "");
        if (valA === valB) return 0;
        const cmp = valA > valB ? 1 : -1;
        return sortAsc ? cmp : -cmp;
    });

    const headers: { key: keyof Fixture; label: string }[] = [
        { key: "no", label: "No." },
        { key: "vessel", label: "Vessel" },
        { key: "broker", label: "Broker" },
        { key: "operator", label: "Operator" },
        { key: "cpDate", label: "C/P Date" },
        { key: "layFrom", label: "Laycan" },
        { key: "loadPort", label: "Load" },
        { key: "dischPort", label: "Discharge" },
        { key: "cargo", label: "Cargo" },
        { key: "charterer", label: "Charterer" },
    ];

    const handleSort = (key: keyof Fixture) => {
        if (sortCol === key) {
            setSortAsc(!sortAsc);
        } else {
            setSortCol(key);
            setSortAsc(true);
        }
    };

    return (
        <div className="panel animate-[fadeUp_0.4s_ease-out]">
            <div className="tbl-header">
                <div className="tbl-title">
                    <div className="tbl-bar bg-[var(--green-500)]" />
                    Fixtures
                    <span className="tbl-count">{filtered.length}</span>
                </div>
                <div className="tbl-filters">
                    <div className="relative">
                        <input
                            value={term}
                            onChange={e => setTerm(e.target.value)}
                            placeholder="Search..."
                            className="filter-input pl-8"
                        />
                        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    </div>
                </div>
            </div>

            <div className="tbl-scroll">
                <table>
                    <thead>
                        <tr>
                            {headers.map(h => (
                                <th key={h.key} onClick={() => handleSort(h.key)} className={sortCol === h.key ? "sorted" : ""}>
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-[var(--green-400)] transition-colors">
                                        {h.label}
                                        {sortCol === h.key && (sortAsc ? <ChevronUp size={10} /> : <ChevronDown size={10} />)}
                                    </div>
                                </th>
                            ))}
                            {(onArchive || onRestore) && <th className="w-16"></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map(f => (
                            <tr key={f.id} className="group">
                                <td className="c-no">{f.no}</td>
                                <td className="c-vessel">
                                    <div className="flex items-center gap-2">
                                        {f.vessel}
                                        {f.hasDem && (
                                            <span className="text-[9px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded uppercase font-bold">Dem</span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${isDubai(f.broker) ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-400'}`}>
                                        {f.broker}
                                    </span>
                                </td>
                                <td>
                                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-500/10 text-green-400">
                                        {f.operator}
                                    </span>
                                </td>
                                <td className="c-date">{f.cpDate}</td>
                                <td className="c-date font-mono text-[var(--text-secondary)]">
                                    {f.layFrom}{f.layTo ? ` – ${f.layTo}` : ""}
                                </td>
                                <td>{f.loadPort}</td>
                                <td>{f.dischPort}</td>
                                <td className="font-semibold text-[var(--green-500)]">{f.cargo || f.product}</td>
                                <td className="text-xs">{f.charterer}</td>
                                {(onArchive || onRestore) && (
                                    <td className="text-right">
                                        <div className="c-actions opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 justify-end">
                                            {onArchive && (
                                                <button
                                                    onClick={() => onArchive(f.id)}
                                                    className="icon-btn ib-amber"
                                                    title="Archive"
                                                >
                                                    <Archive size={14} />
                                                </button>
                                            )}
                                            {onRestore && (
                                                <button
                                                    onClick={() => onRestore(f.id)}
                                                    className="icon-btn ib-green"
                                                    title="Restore"
                                                >
                                                    <RotateCcw size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {sorted.length === 0 && (
                            <tr>
                                <td colSpan={11} className="tbl-empty">
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
