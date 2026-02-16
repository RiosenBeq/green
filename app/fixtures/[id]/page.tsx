"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FixtureForm from "@/components/FixtureForm";
import { useFixtures } from "@/context/FixtureContext";
import { Fixture } from "@/types";

export default function EditFixturePage({ params }: { params: Promise<{ id: string }> }) {
    const { getFixture } = useFixtures();
    const router = useRouter();
    const [data, setData] = useState<Fixture | null>(null);

    // Unwrap params using React.use()
    const { id } = use(params);

    useEffect(() => {
        const fixture = getFixture(id);
        if (fixture) {
            setData(fixture);
        } else {
            // If not found, maybe redirect or show error
            // router.push("/fixtures");
        }
    }, [id, getFixture, router]);

    if (!data) return <div className="text-center py-20 text-[var(--text-muted)]">Loading fixture...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <FixtureForm initialData={data} isEdit={true} />
        </div>
    );
}
