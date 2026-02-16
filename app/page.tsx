"use client";

import { useFixtures } from "@/context/FixtureContext";
import { DUBAI_BROKERS } from "@/types";
import { Fixture } from "@/types";
import { Anchor, Ship, Globe, Clock, TrendingUp, BarChart3, Users } from "lucide-react";

function BrokerBar({ name, count, max, color }: { name: string; count: number; max: number; color: string }) {
  const pct = (count / max) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
      <div style={{ width: 70, fontWeight: 700, fontSize: 13, color: "var(--text-primary)" }}>{name}</div>
      <div style={{ flex: 1, height: 8, background: "var(--bg-elevated)", borderRadius: 99, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
            borderRadius: 99,
            transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>
      <div style={{ width: 56, textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>
        {count} fix
      </div>
    </div>
  );
}

function KpiCard({ label, value, icon, accent }: { label: string; value: number | string; icon: React.ReactNode; accent: string }) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: "22px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--text-muted)", marginBottom: 6 }}>{label}</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: accent, fontFamily: "var(--font-mono)" }}>{value}</div>
      </div>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: `${accent}12`, display: "flex", alignItems: "center", justifyContent: "center", color: accent }}>
        {icon}
      </div>
    </div>
  );
}

function LaycanCard({ fixture }: { fixture: Fixture }) {
  const now = new Date();
  const layDate = new Date(fixture.layFrom);
  const diffDays = Math.ceil((layDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  let statusColor = "#22c55e";
  let statusLabel = "Upcoming";
  if (diffDays < 0) { statusColor = "#6b7280"; statusLabel = "Started"; }
  else if (diffDays <= 3) { statusColor = "#ef4444"; statusLabel = "Urgent"; }
  else if (diffDays <= 7) { statusColor = "#f59e0b"; statusLabel = "Soon"; }

  const isDub = DUBAI_BROKERS.includes(fixture.broker.toUpperCase());

  return (
    <div
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: "16px 18px",
        transition: "all 0.2s",
        cursor: "default",
        borderLeft: `3px solid ${statusColor}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>{fixture.vessel}</span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 8px",
            borderRadius: 99,
            background: `${statusColor}18`,
            color: statusColor,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {statusLabel}
        </span>
      </div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px" }}>
        <div><span style={{ opacity: 0.6 }}>Laycan </span><span style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{fixture.layFrom}</span></div>
        <div><span style={{ opacity: 0.6 }}>Broker </span><span style={{ color: isDub ? "#f59e0b" : "#60a5fa", fontWeight: 600 }}>{fixture.broker}</span></div>
        <div><span style={{ opacity: 0.6 }}>Cargo </span><span style={{ color: "var(--green-400)", fontWeight: 500 }}>{fixture.cargo || fixture.product || "—"}</span></div>
        <div><span style={{ opacity: 0.6 }}>Chart. </span><span style={{ color: "var(--text-secondary)" }}>{fixture.charterer || "—"}</span></div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { fixtures, istanbulFixtures, dubaiFixtures, istDemurrage, dubDemurrage } = useFixtures();
  const activeFixtures = fixtures.filter((f) => !f.archived);

  // ── KPIs ──
  const totalFixtures = activeFixtures.length;
  const istCount = istanbulFixtures.length;
  const dubCount = dubaiFixtures.length;
  const demCount = istDemurrage.length + dubDemurrage.length;
  const now = new Date();
  const thisMonth = activeFixtures.filter((f) => {
    if (!f.cpDate) return false;
    const d = new Date(f.cpDate);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  // ── Istanbul Broker counts (from Istanbul sheet) ──
  const istBrokerCounts: Record<string, number> = {};
  istanbulFixtures.forEach((f) => {
    const b = f.broker.toUpperCase() || "UNKNOWN";
    istBrokerCounts[b] = (istBrokerCounts[b] || 0) + 1;
  });
  const istBrokers = Object.entries(istBrokerCounts).sort(([, a], [, b]) => b - a);
  const istMax = Math.max(...Object.values(istBrokerCounts), 1);

  // ── Dubai Broker counts (from Dubai sheet) ──
  const dubBrokerCounts: Record<string, number> = {};
  dubaiFixtures.forEach((f) => {
    const b = f.broker.toUpperCase() || "UNKNOWN";
    dubBrokerCounts[b] = (dubBrokerCounts[b] || 0) + 1;
  });
  const dubBrokers = Object.entries(dubBrokerCounts).sort(([, a], [, b]) => b - a);
  const dubMax = Math.max(...Object.values(dubBrokerCounts), 1);

  // ── Upcoming laycans ──
  const upcoming = [...activeFixtures]
    .filter((f) => f.layFrom)
    .sort((a, b) => new Date(a.layFrom).getTime() - new Date(b.layFrom).getTime())
    .slice(0, 6);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }} className="anim-fade">
      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
        <KpiCard label="Total Fixtures" value={totalFixtures} icon={<BarChart3 size={22} />} accent="var(--green-500)" />
        <KpiCard label="Istanbul" value={istCount} icon={<Anchor size={22} />} accent="#60a5fa" />
        <KpiCard label="Dubai" value={dubCount} icon={<Globe size={22} />} accent="#f59e0b" />
        <KpiCard label="Demurrage" value={demCount} icon={<Clock size={22} />} accent="#a855f7" />
        <KpiCard label="This Month" value={thisMonth} icon={<TrendingUp size={22} />} accent="#ec4899" />
      </div>

      {/* Broker Performance — IST + DUB side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: "20px 24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontSize: 14, fontWeight: 700 }}>
            <Anchor size={16} style={{ color: "#60a5fa" }} />
            Istanbul Brokers
            <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{istCount} fixtures</span>
          </div>
          {istBrokers.map(([broker, count]) => (
            <BrokerBar key={broker} name={broker} count={count} max={istMax} color="#60a5fa" />
          ))}
        </div>

        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: "20px 24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontSize: 14, fontWeight: 700 }}>
            <Globe size={16} style={{ color: "#f59e0b" }} />
            Dubai Brokers
            <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{dubCount} fixtures</span>
          </div>
          {dubBrokers.map(([broker, count]) => (
            <BrokerBar key={broker} name={broker} count={count} max={dubMax} color="#f59e0b" />
          ))}
        </div>
      </div>

      {/* Upcoming Laycans */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: "20px 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontSize: 14, fontWeight: 700 }}>
          <Ship size={16} style={{ color: "var(--green-500)" }} />
          Upcoming Laycans
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {upcoming.map((f) => (
            <LaycanCard key={f.id} fixture={f} />
          ))}
          {upcoming.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 32, color: "var(--text-muted)" }}>
              No upcoming laycans
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
