import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PerformanceData } from "@/types/performance";

interface ProductMetricsTableProps {
  data: PerformanceData[];
  loading: boolean;
}

const monthlyColumns = [
  "2025-08",
  "2025-09",
  "2025-10",
  "2025-11",
  "2025-12",
  "2026-01",
  "2026-02",
  "2026-03",
  "2026-04",
];

const getStatusColor = (status: string) => {
  if (!status) return "bg-gray-200";
  if (status.includes("監視")) return "bg-yellow-200 text-yellow-800";
  if (status.includes("赤")) return "bg-red-200 text-red-800";
  return "bg-green-200 text-green-800";
};

const getFlagColor = (flag: string | undefined) => {
  switch (flag) {
    case "Watch":
      return "bg-orange-200 text-orange-800";
    case "Alert":
      return "bg-red-200 text-red-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

export default function ProductMetricsTable({
  data,
  loading,
}: ProductMetricsTableProps) {
  const [columnFilters, setColumnFilters] = useState<
    Record<string, string | number>
  >({});
  const [memos, setMemos] = useState<Record<string, string>>({});
  const [flags, setFlags] = useState<Record<string, string>>({});

  const columns: ColumnDef<PerformanceData>[] = useMemo(
    () => [
      {
        accessorKey: "brand",
        header: "Brand",
        size: 80,
        cell: ({ row }) => (
          <div className="truncate text-sm">{row.getValue("brand")}</div>
        ),
      },
      {
        accessorKey: "product_name_identifier",
        header: "Product ID",
        size: 120,
        cell: ({ row }) => (
          <div className="truncate text-sm" title={row.getValue("product_name_identifier")}>
            {row.getValue("product_name_identifier")}
          </div>
        ),
      },
      {
        accessorKey: "new_product",
        header: "New",
        size: 70,
        cell: ({ row }) => (
          <Badge variant="outline" className="text-xs">
            {row.getValue("new_product") || "N/A"}
          </Badge>
        ),
      },
      {
        accessorKey: "starting_month",
        header: "Start",
        size: 80,
        cell: ({ row }) => <div className="text-sm">{row.getValue("starting_month") || "-"}</div>,
      },
      {
        accessorKey: "ending_month",
        header: "End",
        size: 80,
        cell: ({ row }) => <div className="text-sm">{row.getValue("ending_month") || "-"}</div>,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 80,
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          return (
            <Badge className={getStatusColor(status)}>
              {status || "N/A"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "pct_change",
        header: "Change %",
        size: 70,
        cell: ({ row }) => {
          const value = row.getValue("pct_change") as number;
          return <div className="text-sm font-semibold">{Number(value)?.toFixed(1) || "-"}%</div>;
        },
      },
      {
        accessorKey: "pct_change_available_start_month",
        header: "Change Start",
        size: 80,
        cell: ({ row }) => {
          const value = row.getValue("pct_change_available_start_month") as number;
          return <div className="text-sm">{Number(value)?.toFixed(1) || "-"}%</div>;
        },
      },
      ...monthlyColumns.map((month) => ({
        id: month,
        header: month,
        size: 75,
        cell: ({ row }: { row: any }) => {
          const value = row.original[month];
          const num = value != null && value !== "" ? Number(value) : null;
          return (
            <div className="text-sm text-right">
              {num != null ? `${num.toFixed(1)}%` : "-"}
            </div>
          );
        },
      })),
      {
        id: "memo",
        header: "Memo",
        size: 150,
        cell: ({ row }) => (
          <Textarea
            value={memos[row.original._id] || ""}
            onChange={(e) =>
              setMemos((prev) => ({
                ...prev,
                [row.original._id]: e.target.value,
              }))
            }
            placeholder="Add memo..."
            className="min-h-8 text-xs"
          />
        ),
      },
      {
        id: "flag",
        header: "Flag",
        size: 100,
        cell: ({ row }) => (
          <Select
            value={flags[row.original._id] || "Normal"}
            onValueChange={(val) =>
              setFlags((prev) => ({
                ...prev,
                [row.original._id]: val,
              }))
            }
          >
            <SelectTrigger className="w-20 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Normal">Normal</SelectItem>
              <SelectItem value="Watch">Watch</SelectItem>
              <SelectItem value="Alert">Alert</SelectItem>
            </SelectContent>
          </Select>
        ),
      },
    ],
    [memos, flags]
  );

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      for (const [key, filterValue] of Object.entries(columnFilters)) {
        const itemValue = item[key];
        const filterStr = String(filterValue).toLowerCase();
        if (
          itemValue === null ||
          itemValue === undefined ||
          !String(itemValue).toLowerCase().includes(filterStr)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [data, columnFilters]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="p-8 text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="overflow-x-auto flex-1">
        <div className="inline-block min-w-full">
          <table className="table-fixed w-full border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-gray-100">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="p-2 text-left text-xs font-semibold border-b border-gray-300"
                      style={{ width: `${header.getSize()}px`, minWidth: `${header.getSize()}px` }}
                    >
                      <div className="truncate">{flexRender(header.column.columnDef.header, header.getContext())}</div>
                      {header.column.columnDef.accessorKey && (
                        <Input
                          placeholder="Filter..."
                          value={columnFilters[header.column.columnDef.accessorKey as string] || ""}
                          onChange={(e) =>
                            setColumnFilters((prev) => ({
                              ...prev,
                              [header.column.columnDef.accessorKey as string]: e.target.value,
                            }))
                          }
                          className="mt-1 h-7 text-xs"
                        />
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 border-b border-gray-100">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="p-2 text-sm"
                      style={{
                        width: `${cell.column.columnDef.size}px`,
                        minWidth: `${cell.column.columnDef.size}px`,
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="border-t border-gray-200 p-2 bg-gray-50 text-sm text-gray-600">
        Showing {table.getRowModel().rows.length} of {data.length} rows
      </div>
    </div>
  );
}
