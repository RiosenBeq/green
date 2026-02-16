"use client";

import React, { createContext, useContext, useState } from "react";
import { Fixture } from "@/types";
import {
    FIXTURE_LIST_DATA,
    ISTANBUL_DATA,
    DUBAI_DATA,
    IST_DEMURRAGE_DATA,
    DUB_DEMURRAGE_DATA,
    OPS_USERS,
} from "@/lib/seedData";

interface FixtureContextType {
    // Fixture List = Active/Ongoing fixtures
    fixtures: Fixture[];
    // Regional data (archived per-office view)
    istanbulFixtures: Fixture[];
    dubaiFixtures: Fixture[];
    istDemurrage: Fixture[];
    dubDemurrage: Fixture[];
    // OPS team
    opsUsers: typeof OPS_USERS;
    // CRUD
    addFixture: (fixture: Fixture) => void;
    updateFixture: (id: string, updates: Partial<Fixture>) => void;
    archiveFixture: (id: string) => void;
    restoreFixture: (id: string) => void;
    deleteFixture: (id: string) => void;
    getFixture: (id: string) => Fixture | undefined;
}

const FixtureContext = createContext<FixtureContextType | undefined>(undefined);

export function FixtureProvider({ children }: { children: React.ReactNode }) {
    const [fixtures, setFixtures] = useState<Fixture[]>(FIXTURE_LIST_DATA);
    const [istanbulFixtures] = useState<Fixture[]>(ISTANBUL_DATA);
    const [dubaiFixtures] = useState<Fixture[]>(DUBAI_DATA);
    const [istDemurrage] = useState<Fixture[]>(IST_DEMURRAGE_DATA);
    const [dubDemurrage] = useState<Fixture[]>(DUB_DEMURRAGE_DATA);

    const addFixture = (fixture: Fixture) => {
        setFixtures((prev) => [fixture, ...prev]);
    };

    const updateFixture = (id: string, updates: Partial<Fixture>) => {
        setFixtures((prev) =>
            prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
        );
    };

    const archiveFixture = (id: string) => {
        setFixtures((prev) =>
            prev.map((f) => (f.id === id ? { ...f, archived: true } : f))
        );
    };

    const restoreFixture = (id: string) => {
        setFixtures((prev) =>
            prev.map((f) => (f.id === id ? { ...f, archived: false } : f))
        );
    };

    const deleteFixture = (id: string) => {
        setFixtures((prev) => prev.filter((f) => f.id !== id));
    };

    const getFixture = (id: string) => {
        return fixtures.find((f) => f.id === id);
    };

    return (
        <FixtureContext.Provider
            value={{
                fixtures,
                istanbulFixtures,
                dubaiFixtures,
                istDemurrage,
                dubDemurrage,
                opsUsers: OPS_USERS,
                addFixture,
                updateFixture,
                archiveFixture,
                restoreFixture,
                deleteFixture,
                getFixture,
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
