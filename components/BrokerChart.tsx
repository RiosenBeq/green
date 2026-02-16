import { Fixture } from "@/types";

interface BrokerChartProps {
    fixtures: Fixture[];
}

export default function BrokerChart({ fixtures }: BrokerChartProps) {
    const brokerStats: Record<string, number> = {};

    fixtures.forEach(f => {
        const broker = (f.broker || 'Unknown').toUpperCase();
        brokerStats[broker] = (brokerStats[broker] || 0) + 1;
    });

    const sortedBrokers = Object.entries(brokerStats)
        .sort(([, a], [, b]) => b - a);

    const maxVal = Math.max(...Object.values(brokerStats), 1);

    return (
        <div className="space-y-4">
            {sortedBrokers.map(([broker, count]) => (
                <div key={broker} className="broker-row">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold text-[var(--text-primary)]">{broker}</span>
                        <span className="font-mono text-xs text-[var(--text-muted)]">{count} fixtures</span>
                    </div>
                    <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 rounded-full transition-all duration-500"
                            style={{ width: `${(count / maxVal) * 100}%` }}
                        />
                    </div>
                </div>
            ))}
            {sortedBrokers.length === 0 && (
                <div className="text-sm text-[var(--text-muted)] text-center py-4">No data available</div>
            )}
        </div>
    );
}
