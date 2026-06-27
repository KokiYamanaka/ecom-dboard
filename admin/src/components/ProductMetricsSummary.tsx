interface SummaryStats {
  total: number;
  avgScore: string;
  avgChange: string;
}

interface ProductMetricsSummaryProps {
  stats: SummaryStats;
}

export default function ProductMetricsSummary({ stats }: ProductMetricsSummaryProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <p className="text-sm text-gray-600">Total Products</p>
        <p className="text-3xl font-bold mt-2">{stats.total}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <p className="text-sm text-gray-600">Avg Match Score</p>
        <p className="text-3xl font-bold mt-2">{stats.avgScore}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <p className="text-sm text-gray-600">Avg % Change</p>
        <p className="text-3xl font-bold mt-2">{stats.avgChange}%</p>
      </div>
    </div>
  );
}
