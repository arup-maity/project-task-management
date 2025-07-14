"use client"

import * as React from "react"

import { FileChartColumn, GalleryVerticalEnd, SquareCheck, User } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

// This is sample data.
const data = {
   user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
   },

   navMain: [
      {
         title: "Projects",
         url: "/projects",
         icon: FileChartColumn,
      },
      {
         title: "Tasks",
         url: "/tasks",
         icon: SquareCheck,
      },
      {
         title: "Users",
         url: "/users",
         icon: User,
      }
      // {
      //    title: "Models",
      //    url: "#",
      //    icon: Bot,
      //    items: [
      //       {
      //          title: "Genesis",
      //          url: "#",
      //       },
      //       {
      //          title: "Explorer",
      //          url: "#",
      //       },
      //       {
      //          title: "Quantum",
      //          url: "#",
      //       },
      //    ],
      // },
      // {
      //    title: "Documentation",
      //    url: "#",
      //    icon: BookOpen,
      //    items: [
      //       {
      //          title: "Introduction",
      //          url: "#",
      //       },
      //       {
      //          title: "Get Started",
      //          url: "#",
      //       },
      //       {
      //          title: "Tutorials",
      //          url: "#",
      //       },
      //       {
      //          title: "Changelog",
      //          url: "#",
      //       },
      //    ],
      // },
      // {
      //    title: "Settings",
      //    url: "#",
      //    icon: Settings2,
      //    items: [
      //       {
      //          title: "General",
      //          url: "#",
      //       },
      //       {
      //          title: "Team",
      //          url: "#",
      //       },
      //       {
      //          title: "Billing",
      //          url: "#",
      //       },
      //       {
      //          title: "Limits",
      //          url: "#",
      //       },
      //    ],
      // },
   ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   return (
      <Sidebar collapsible="icon" {...props}>
         <SidebarHeader>
            <div className="flex items-center gap-4">
               <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
               </div>
               <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Task management</span>
                  <span className="truncate text-xs">Dashboard</span>
               </div>
            </div>
         </SidebarHeader>
         <SidebarContent>
            <NavMain items={data.navMain} />
         </SidebarContent>
         <SidebarFooter>
            <NavUser user={data.user} />
         </SidebarFooter>
         <SidebarRail />
      </Sidebar>
   )
}
