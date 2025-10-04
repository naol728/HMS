import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";

export default function ReseptionLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen min-w-full bg-background">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <header className="flex items-center gap-2 p-4 border-b border-border">
            <SidebarTrigger />
            <h1 className="text-lg font-bold">Dashboard</h1>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-6 min-w-0">
            {/* Outlet now takes full available width */}
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
