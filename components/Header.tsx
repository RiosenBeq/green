"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import { useFixtures } from "@/context/FixtureContext";

export default function Header() {
  const pathname = usePathname();
  const { fixtures, istanbulFixtures, dubaiFixtures, istDemurrage, dubDemurrage } = useFixtures();

  const activeFixtures = fixtures.filter((f) => !f.archived);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="header-top">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-[var(--green-500)] uppercase tracking-[0.3em] bg-[var(--green-glow)] px-3 py-1 rounded-full border border-[var(--green-500)/10]">
            System Online
          </span>
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
            {pathname.split('/').filter(Boolean).at(-1) || 'Overview'}
          </span>
        </div>

        <div className="header-right">
          <button className="btn btn-ghost btn-sm" onClick={() => alert('Search coming soon')}>
            <Search size={14} /> <span className="btn-label">Search</span>
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => alert('Export coming soon')}>
            <Download size={14} /> <span className="btn-label">Export</span>
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => window.location.reload()}>
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
          📋 Fixtures <span className="nav-badge">{activeFixtures.length}</span>
        </Link>
        <Link href="/istanbul" className={`nav-tab ${isActive("/istanbul") ? "active" : ""}`}>
          ⚓ Istanbul <span className="nav-badge">{istanbulFixtures.length}</span>
        </Link>
        <Link href="/dubai" className={`nav-tab ${isActive("/dubai") ? "active" : ""}`}>
          🌍 Dubai <span className="nav-badge">{dubaiFixtures.length}</span>
        </Link>
        <Link href="/demurrage" className={`nav-tab ${isActive("/demurrage") ? "active" : ""}`}>
          ⏰ Demurrage <span className="nav-badge">{istDemurrage.length + dubDemurrage.length}</span>
        </Link>
        <Link href="/ops" className={`nav-tab ${isActive("/ops") ? "active" : ""}`}>
          👥 OPS List
        </Link>
      </nav>
    </header>
  );
}
