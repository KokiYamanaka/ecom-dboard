import { useEffect, useState } from "react";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { useToast } from "@/hooks/use-toast";
import ProductMetricsSummary from "@/components/ProductMetricsSummary";
import ProductMetricsTable from "@/components/ProductMetricsTable";
import { PerformanceData } from "@/types/performance";

export default function ProductMetricsPage() {
  const [data, setData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axiosPrivate.get("/performance");
        setData(response.data.data || []);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load product metrics",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, [axiosPrivate, toast]);

  const calculateStats = () => {
    if (data.length === 0) return { total: 0, avgScore: "0", avgChange: "0" };
    const totalProducts = data.length;
    const avgScore =
      data.reduce((sum, item) => sum + (item.match_score || 0), 0) /
      totalProducts;
    const avgChange =
      data.reduce((sum, item) => sum + (item.pct_change || 0), 0) /
      totalProducts;
    return {
      total: totalProducts,
      avgScore: avgScore.toFixed(1),
      avgChange: avgChange.toFixed(1),
    };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Header - Not Sticky */}
      <div className="pb-4">
        <h1 className="text-3xl font-bold">Product Metrics</h1>
        <p className="text-gray-500 mt-2">
          Track product performance and metrics
        </p>
      </div>

      {/* Summary Cards - Not Sticky */}
      <ProductMetricsSummary stats={stats} />

      {/* Scrollable Table */}
      <ProductMetricsTable data={data} loading={loading} />
    </div>
  );
}
