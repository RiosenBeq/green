"use client";

import { FixtureProvider } from "@/context/FixtureContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <FixtureProvider>
            {children}
        </FixtureProvider>
    );
}
