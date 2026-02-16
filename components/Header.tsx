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
        <Link href="/" className="logo">
          <div className="logo-mark">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
              <path d="M12 2L4 8h16L12 2z" fill="rgba(255,255,255,.7)" />
            </svg>
          </div>
          <div>
            <div className="logo-name">GREEN & BLACK</div>
            <div className="logo-desc">Chemical Tanker Brokerage</div>
          </div>
        </Link>

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
        <Link href="/" className={`nav-tab ${isActive("/") ? "active" : ""}`}>
          📊 Dashboard
        </Link>
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
