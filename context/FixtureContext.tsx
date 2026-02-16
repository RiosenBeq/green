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
    istanbulFixtures: Fixture[];
    dubaiFixtures: Fixture[];
    istDemurrage: Fixture[];
    dubDemurrage: Fixture[];
    opsUsers: OpsUser[];
    addFixture: (fixture: Fixture) => void;
    updateFixture: (id: string, updates: Partial<Fixture>) => void;
    archiveFixture: (id: string) => void;
    restoreFixture: (id: string) => void;
    cancelFixture: (id: string) => void;
    uncancelFixture: (id: string) => void;
    deleteFixture: (id: string) => void;
    getFixture: (id: string) => Fixture | undefined;
}

const FixtureContext = createContext<FixtureContextType | undefined>(undefined);

export function FixtureProvider({ children }: { children: React.ReactNode }) {
    const [fixtures, setFixtures] = useState<Fixture[]>(FIXTURE_LIST_DATA);
    const [istanbulFixtures, setIstanbulFixtures] = useState<Fixture[]>(ISTANBUL_DATA);
    const [dubaiFixtures, setDubaiFixtures] = useState<Fixture[]>(DUBAI_DATA);
    const [istDemurrage] = useState<Fixture[]>(IST_DEMURRAGE_DATA);
    const [dubDemurrage] = useState<Fixture[]>(DUB_DEMURRAGE_DATA);

    const addFixture = (fixture: Fixture) => {
        setFixtures((prev) => [fixture, ...prev]);
    };

    const updateFixture = (id: string, updates: Partial<Fixture>) => {
        const doUpdate = (list: Fixture[]) =>
            list.map((f) => (f.id === id ? { ...f, ...updates } : f));
        setFixtures(doUpdate);
        setIstanbulFixtures(doUpdate);
        setDubaiFixtures(doUpdate);
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
                cancelFixture,
                uncancelFixture,
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
