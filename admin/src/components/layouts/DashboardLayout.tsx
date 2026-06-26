import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import useAuthStore from "@/store/useAuthStore";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

export default function DashboardLayout() {
  const { isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div
        className={cn(
          "flex flex-col flex-1 w-full max-w-(--breakpoint-2xl) transition-all duration-300",
          sidebarOpen ? "md:ml-64" : "md:ml-20"
        )}
      >
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30 ml-20 md:ml-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
