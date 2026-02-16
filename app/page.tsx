"use client";

import { Activity, Anchor, Globe, PieChart, TrendingUp } from "lucide-react";
import StatCard from "@/components/StatCard";
import BrokerChart from "@/components/BrokerChart";
import LaycanList from "@/components/LaycanList";
import { DUBAI_BROKERS } from "@/types";
import { useFixtures } from "@/context/FixtureContext";

export default function DashboardPage() {
  const { fixtures, istanbulFixtures, dubaiFixtures } = useFixtures();

  // Only count non-archived fixtures for stats
  const activeFixtures = fixtures.filter((f) => !f.archived);

  const totalFixtures = activeFixtures.length;
  const istCount = istanbulFixtures.length;
  const dubCount = dubaiFixtures.length;
  const demCount = activeFixtures.filter((f) => f.hasDem).length;

  // This month's fixtures
  const now = new Date();
  const thisMonth = activeFixtures.filter((f) => {
    if (!f.cpDate) return false;
    const d = new Date(f.cpDate);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-6 anim-fade">
      {/* KPI Row */}
      <div className="stat-row">
        <StatCard label="Total Fixtures" value={totalFixtures} icon="📊" color="var(--green-500)" />
        <StatCard label="Istanbul" value={istCount} icon="⚓" color="var(--green-500)" />
        <StatCard label="Dubai" value={dubCount} icon="🌍" color="var(--blue-500)" />
        <StatCard label="Demurrage" value={demCount} icon="⏰" color="var(--purple-500)" />
        <StatCard label="This Month" value={thisMonth} icon="📅" color="var(--amber-500)" />
      </div>

      {/* Charts */}
      <div className="dash-grid">
        {/* Broker Performance */}
        <div className="panel">
          <div className="panel-title">
            <TrendingUp size={18} className="text-[var(--green-500)]" />
            Broker Performance
          </div>
          <BrokerChart fixtures={activeFixtures} />
        </div>

        {/* Upcoming Laycans */}
        <div className="panel">
          <div className="panel-title">
            <Anchor size={18} className="text-[var(--green-500)]" />
            Upcoming Laycans
          </div>
          <LaycanList fixtures={activeFixtures} />
        </div>
      </div>
    </div>
  );
}
