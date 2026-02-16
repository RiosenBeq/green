"use client";

import React, { createContext, useContext, useState } from "react";
import { Fixture, DUBAI_BROKERS } from "@/types";
import {
    FIXTURE_LIST_DATA,
    ISTANBUL_DATA,
    DUBAI_DATA,
    IST_DEMURRAGE_DATA,
    DUB_DEMURRAGE_DATA,
    OPS_USERS,
} from "@/lib/seedData";

interface OpsUser {
    name: string;
    email: string;
    role: string;
}

interface FixtureContextType {
    fixtures: Fixture[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filteredFixtures: Fixture[];
    filteredIstanbul: Fixture[];
    filteredDubai: Fixture[];
    filteredIstDemurrage: Fixture[];
    filteredDubDemurrage: Fixture[];
    opsUsers: OpsUser[];
    addFixture: (fixture: Fixture) => void;
    updateFixture: (id: string, updates: Partial<Fixture>) => void;
    archiveFixture: (id: string) => void;
    restoreFixture: (id: string) => void;
    cancelFixture: (id: string) => void;
    uncancelFixture: (id: string) => void;
    deleteFixture: (id: string) => void;
    getFixture: (id: string) => Fixture | undefined;
    uniqueEntities: {
        vessels: string[];
        charterers: string[];
        owners: string[];
        ports: string[];
    };
    getEntityAffinities: (vesselName: string) => any;
}

const FixtureContext = createContext<FixtureContextType | undefined>(undefined);

export function FixtureProvider({ children }: { children: React.ReactNode }) {
    const [fixtures, setFixtures] = useState<Fixture[]>(() =>
        [...FIXTURE_LIST_DATA].sort((a, b) => (b.id || "").localeCompare(a.id || ""))
    );
    const [istanbulFixtures, setIstanbulFixtures] = useState<Fixture[]>(() =>
        [...ISTANBUL_DATA].sort((a, b) => (b.id || "").localeCompare(a.id || ""))
    );
    const [dubaiFixtures, setDubaiFixtures] = useState<Fixture[]>(() =>
        [...DUBAI_DATA].sort((a, b) => (b.id || "").localeCompare(a.id || ""))
    );
    const [istDemurrage, setIstDemurrage] = useState<Fixture[]>(() =>
        [...IST_DEMURRAGE_DATA].sort((a, b) => (b.id || "").localeCompare(a.id || ""))
    );
    const [dubDemurrage, setDubDemurrage] = useState<Fixture[]>(() =>
        [...DUB_DEMURRAGE_DATA].sort((a, b) => (b.id || "").localeCompare(a.id || ""))
    );

    const [searchQuery, setSearchQuery] = useState("");

    const filterFixtures = (list: Fixture[]) => {
        if (!searchQuery) return list;
        const lowQuery = searchQuery.toLowerCase();
        return list.filter(f =>
            f.vessel?.toLowerCase().includes(lowQuery) ||
            f.charterer?.toLowerCase().includes(lowQuery) ||
            f.loadPort?.toLowerCase().includes(lowQuery) ||
            f.dischPort?.toLowerCase().includes(lowQuery) ||
            f.id?.toLowerCase().includes(lowQuery) ||
            f.owner?.toLowerCase().includes(lowQuery)
        );
    };

    const filteredFixtures = filterFixtures(fixtures);
    const filteredIstanbul = filterFixtures(istanbulFixtures);
    const filteredDubai = filterFixtures(dubaiFixtures);
    const filteredIstDemurrage = filterFixtures(istDemurrage);
    const filteredDubDemurrage = filterFixtures(dubDemurrage);

    const addFixture = (fixture: Fixture) => {
        setFixtures((prev) => [fixture, ...prev]);
    };

    const updateFixture = (id: string, updates: Partial<Fixture>) => {
        const doUpdate = (list: Fixture[]) =>
            list.map((f) => (f.id === id ? { ...f, ...updates } : f));
        setFixtures(doUpdate);
        setIstanbulFixtures(doUpdate);
        setDubaiFixtures(doUpdate);
        setIstDemurrage(doUpdate);
        setDubDemurrage(doUpdate);
    };

    const archiveFixture = (id: string) => {
        updateFixture(id, { archived: true });
    };

    const restoreFixture = (id: string) => {
        updateFixture(id, { archived: false });
    };

    const cancelFixture = (id: string) => {
        updateFixture(id, { cancelled: true });
    };

    const uncancelFixture = (id: string) => {
        updateFixture(id, { cancelled: false });
    };

    const deleteFixture = (id: string) => {
        const doFilter = (prev: Fixture[]) => prev.filter((f) => f.id !== id);
        setFixtures(doFilter);
        setIstanbulFixtures(doFilter);
        setDubaiFixtures(doFilter);
        setIstDemurrage(doFilter);
        setDubDemurrage(doFilter);
    };

    const getFixture = (id: string) => {
        return fixtures.find((f) => f.id === id);
    };

    // Derived entity lists for autocomplete
    const uniqueEntities = {
        vessels: Array.from(new Set(fixtures.map(f => f.vessel))).filter(Boolean),
        charterers: Array.from(new Set(fixtures.map(f => f.charterer))).filter(Boolean),
        owners: Array.from(new Set(fixtures.map(f => f.owner))).filter(Boolean),
        ports: Array.from(new Set([...fixtures.map(f => f.loadPort), ...fixtures.map(f => f.dischPort)])).filter(Boolean),
    };

    // Helper to find "affinities" (e.g., typical owner for a vessel)
    const getEntityAffinities = (vesselName: string) => {
        const past = fixtures.find(f => f.vessel.toUpperCase() === vesselName.toUpperCase());
        if (past) {
            return {
                owner: past.owner,
                charterer: past.charterer,
                broker: past.broker,
                operator: past.operator
            };
        }
        return null;
    };

    return (
        <FixtureContext.Provider
            value={{
                fixtures,
                searchQuery,
                setSearchQuery,
                filteredFixtures,
                filteredIstanbul,
                filteredDubai,
                filteredIstDemurrage,
                filteredDubDemurrage,
                opsUsers: OPS_USERS,
                addFixture,
                updateFixture,
                archiveFixture,
                restoreFixture,
                cancelFixture,
                uncancelFixture,
                deleteFixture,
                getFixture,
                uniqueEntities,
                getEntityAffinities
            }}
        >
            {children}
        </FixtureContext.Provider>
    );
}

export function useFixtures() {
    const context = useContext(FixtureContext);
    if (context === undefined) {
        throw new Error("useFixtures must be used within a FixtureProvider");
    }
    return context;
}
