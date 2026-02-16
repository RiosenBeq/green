"use client";

import { useFixtures } from "@/context/FixtureContext";
import { Fixture, DUBAI_BROKERS } from "@/types";
import {
  Anchor,
  Globe,
  Clock,
  Users,
  TrendingUp,
  Ship,
  ChevronRight,
  User
} from "lucide-react";
import KpiCard from "@/components/KpiCard";
import LaycanCard from "@/components/LaycanCard";

export default function Dashboard() {
  const { fixtures, filteredIstanbul, filteredDubai, filteredIstDemurrage, filteredDubDemurrage, opsUsers } = useFixtures();

  // Helper to format dates to dd.mm.yyyy
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  };

  // Grouping by Operator
  const activeFixtures = fixtures.filter(f => !f.archived && !f.cancelled);
  const shipmentsByOperator = opsUsers
    .filter(u => u.role === "Operator")
    .map(op => ({
      ...op,
      shipments: activeFixtures.filter(f => f.operator.toUpperCase() === op.name.toUpperCase())
    }));

  // Stats
  const istBrokers = ['BATU', 'EMRE', 'OZGUR'];
  const dubBrokers = ['GUROL', 'YOAN'];

  const getBrokerCount = (list: Fixture[], brokerName: string) =>
    list.filter(f => f.broker.toUpperCase() === brokerName.toUpperCase()).length;

  return (
    <div className="flex flex-col gap-6 anim-fade">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Fixtures"
          value={fixtures.length}
          icon={<Ship size={20} />}
          trend="+2"
          color="var(--green-500)"
          gradient="linear-gradient(135deg, rgba(34, 197, 94, 0.1), transparent)"
        />
        <KpiCard
          title="Istanbul Clean"
          value={filteredIstanbul.length}
          icon={<Anchor size={20} />}
          trend="Active"
          color="#60a5fa"
          gradient="linear-gradient(135deg, rgba(96, 165, 250, 0.1), transparent)"
        />
        <KpiCard
          title="Dubai Clean"
          value={filteredDubai.length}
          icon={<Globe size={20} />}
          trend="Active"
          color="#f59e0b"
          gradient="linear-gradient(135deg, rgba(245, 158, 11, 0.1), transparent)"
        />
        <KpiCard
          title="Demurrage"
          value={filteredIstDemurrage.length + filteredDubDemurrage.length}
          icon={<Clock size={20} />}
          trend="Claims"
          color="#a855f7"
          gradient="linear-gradient(135deg, rgba(168, 85, 247, 0.1), transparent)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Istanbul Brokers Performance */}
        <div className="panel">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#60a5fa', boxShadow: '0 0 10px #60a5fa' }} />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">Istanbul Brokers</h3>
            </div>
            <TrendingUp size={16} className="text-[#60a5fa]" />
          </div>
          <div className="space-y-4">
            {istBrokers.map(b => (
              <div key={b} className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-[var(--text-primary)]">{b}</span>
                  <span className="text-[10px] font-mono text-[#60a5fa]">{getBrokerCount(filteredIstanbul, b)} fixtures</span>
                </div>
                <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#60a5fa]"
                    style={{
                      width: `${(getBrokerCount(filteredIstanbul, b) / 10) * 100}%`,
                      boxShadow: '0 0 10px rgba(96, 165, 250, 0.3)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dubai Brokers Performance */}
        <div className="panel">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 10px #f59e0b' }} />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">Dubai Brokers</h3>
            </div>
            <TrendingUp size={16} className="text-[#f59e0b]" />
          </div>
          <div className="space-y-4">
            {dubBrokers.map(b => (
              <div key={b} className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-[var(--text-primary)]">{b}</span>
                  <span className="text-[10px] font-mono text-[#f59e0b]">{getBrokerCount(filteredDubai, b)} fixtures</span>
                </div>
                <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#f59e0b]"
                    style={{
                      width: `${(getBrokerCount(filteredDubai, b) / 10) * 100}%`,
                      boxShadow: '0 0 10px rgba(245, 158, 11, 0.3)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ongoing Shipments - Grouped by Operator */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-[var(--green-glow)]">
            <Users size={18} className="text-[var(--green-500)]" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Ongoing Shipments</h2>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest">Operator Workload</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {shipmentsByOperator.map((op) => (
            <div key={op.name} className="panel" style={{ borderTop: `4px solid ${getOpColor(op.name)}`, padding: '20px' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      width: 32, height: 32, borderRadius: 10,
                      background: `${getOpColor(op.name)}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: getOpColor(op.name), fontWeight: 800, fontSize: 13
                    }}
                  >
                    {op.name[0]}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{op.name}</h3>
                    <p className="text-[10px] text-[var(--text-muted)]">{op.shipments.length} vessels</p>
                  </div>
                </div>
                <div className="text-[var(--green-500)] bg-[var(--green-glow)] p-1.5 rounded-full">
                  <User size={14} />
                </div>
              </div>

              <div className="space-y-3">
                {op.shipments.length > 0 ? (
                  op.shipments.map(s => (
                    <div key={s.id} className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--green-400)] transition-all group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold truncate pr-2 group-hover:text-[var(--green-400)] transition-colors">{s.vessel}</span>
                        <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-card)] px-1.5 rounded">{s.no}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
                        <Clock size={10} />
                        <span>{formatDate(s.layFrom)} — {formatDate(s.layTo)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center border-2 border-dashed border-[var(--border)] rounded-xl">
                    <p className="text-[10px] text-[var(--text-muted)]">No active shipments</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getOpColor(name: string) {
  const colors: Record<string, string> = {
    BERK: "#22c55e",
    DUYGU: "#a855f7",
    GIZEM: "#ec4899",
    EZGI: "#06b6d4",
  };
  return colors[name.toUpperCase()] || "#6b7280";
}
