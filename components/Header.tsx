"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Download, RefreshCw, Plus, X } from "lucide-react";
import { useFixtures } from "@/context/FixtureContext";
import * as XLSX from "xlsx";

export default function Header() {
  const pathname = usePathname();
  const {
    fixtures,
    filteredFixtures,
    filteredIstanbul,
    filteredDubai,
    filteredIstDemurrage,
    filteredDubDemurrage,
    searchQuery,
    setSearchQuery
  } = useFixtures();

  const activeFixtures = fixtures.filter((f) => !f.archived);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const handleExport = () => {
    try {
      const wb = XLSX.utils.book_new();

      // Sheet 1: All Active Fixtures
      const wsAll = XLSX.utils.json_to_sheet(filteredFixtures);
      XLSX.utils.book_append_sheet(wb, wsAll, "All Fixtures");

      // Sheet 2: Istanbul
      const wsIst = XLSX.utils.json_to_sheet(filteredIstanbul);
      XLSX.utils.book_append_sheet(wb, wsIst, "Istanbul View");

      // Sheet 3: Dubai
      const wsDub = XLSX.utils.json_to_sheet(filteredDubai);
      XLSX.utils.book_append_sheet(wb, wsDub, "Dubai View");

      // Generate file
      const fileName = `GNB_Fixtures_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export Excel file.");
    }
  };

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="header-top">
        <div className="flex items-center gap-4 flex-1">
          <span className="text-[10px] font-black text-[var(--green-500)] uppercase tracking-[0.3em] bg-[var(--green-glow)] px-3 py-1 rounded-full border border-[var(--green-500)/10] shrink-0">
            System Online
          </span>

          <div className="relative flex-1 max-w-sm ml-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={14} />
            <input
              type="text"
              placeholder="Search vessel, charterer, port..."
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-full py-2 pl-10 pr-10 text-xs font-medium focus:outline-none focus:border-[var(--green-500)] transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        <div className="header-right">
          <button className="btn btn-ghost btn-sm" onClick={handleExport}>
            <Download size={14} /> <span className="btn-label">Export</span>
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => { setSearchQuery(""); window.location.reload(); }}>
            <RefreshCw size={14} /> <span className="btn-label">Reset</span>
          </button>
          <Link href="/fixtures/new" className="btn btn-primary">
            <Plus size={14} /> <span className="btn-label">Add Fixture</span>
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="nav">
        <Link href="/fixtures" className={`nav-tab ${isActive("/fixtures") ? "active" : ""}`}>
          📋 Ongoing <span className="nav-badge">{filteredFixtures.filter(f => !f.archived).length}</span>
        </Link>
        <Link href="/all-fixtures" className={`nav-tab ${isActive("/all-fixtures") ? "active" : ""}`}>
          ⚓ All Fixtures <span className="nav-badge">{filteredIstanbul.length + filteredDubai.length}</span>
        </Link>
        <Link href="/demurrage" className={`nav-tab ${isActive("/demurrage") ? "active" : ""}`}>
          ⏰ Demurrage <span className="nav-badge">{filteredIstDemurrage.length + filteredDubDemurrage.length}</span>
        </Link>
        <Link href="/ops" className={`nav-tab ${isActive("/ops") ? "active" : ""}`}>
          👥 OPS List
        </Link>
      </nav>
    </header>
  );
}
