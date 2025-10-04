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
  Calendar,
  Home,
  Users,
  Inbox,
  PlusSquare,
  Settings,
  MessageSquare,
} from "lucide-react";

const items = [
  { title: "Overview", url: "/dashboard", icon: Home },
  { title: "Rooms", url: "/dashboard/rooms", icon: PlusSquare },
  { title: "Users", url: "/dashboard/users", icon: Users },
  // { title: "Report", url: "/dashboard/reservations", icon: Calendar },
  { title: "Feedbacks", url: "/dashboard/comments", icon: MessageSquare },
  { title: "Profile Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar className="flex flex-col h-screen border-r border-border bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <SidebarContent className="flex-1 flex flex-col overflow-y-auto">
        {/* Hotel Brand Section */}
        <div className="px-4 py-6 text-center border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-primary">
            <Link to="/">Samrawi Hotel </Link>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Admin Dashboard
          </p>
        </div>

        {/* Navigation */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="px-4 pt-6 text-gray-500 dark:text-gray-400 text-sm">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2 flex-1">
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
                        <item.icon className="h-5 w-5" />
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
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <p>© 2025 Samrawi Hotel</p>
      </div>
    </Sidebar>
  );
}
