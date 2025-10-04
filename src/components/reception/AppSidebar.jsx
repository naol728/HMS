import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BedDouble,
  CalendarCheck,
  CreditCard,
  Settings,
  Home,
} from "lucide-react";

const items = [
  {
    title: "Reserved Rooms",
    url: "/reception",
    icon: CalendarCheck,
  },
  {
    title: "Reserve Room",
    url: "/reception/reserveroom",
    icon: BedDouble,
  },
  {
    title: "Pay to Reservation",
    url: "/reception/payreservation",
    icon: CreditCard,
  },
  {
    title: "Profile Settings",
    url: "/reception/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar className="flex flex-col h-screen border-r border-border bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100">
      {/* Hotel Brand Section */}
      <div className="px-4 py-6 text-center border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-extrabold text-primary tracking-tight">
          <Link to="/">Samrawi Hotel</Link>
        </h1>
        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
          Reception Dashboard
        </p>
      </div>

      <SidebarContent className="flex-1 flex flex-col overflow-y-auto">
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="px-4 pt-6 text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase">
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent className="mt-3 flex-1">
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                          active
                            ? "bg-primary text-white shadow-lg"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5 transition-colors duration-200",
                            active ? "text-white" : "text-primary"
                          )}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 text-center">
        <p>© 2025 Samrawi Hotel</p>
      </div>
    </Sidebar>
  );
}
