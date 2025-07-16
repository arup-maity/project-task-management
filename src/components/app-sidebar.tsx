"use client"

import * as React from "react"

import { FileChartColumn, GalleryVerticalEnd, SquareCheck, User } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { AuthContext } from "@/context/auth-context"
import { useMutation } from "@tanstack/react-query"
import { axiosInstance } from "@/lib/axios"
import { toast } from "sonner"
import { handleApiError } from "@/lib/utils"
import { useRouter } from "next/navigation"

// This is sample data.
const data = {
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
   ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   const session = React.useContext(AuthContext)
   const router = useRouter();
   const logutMutation = useMutation({
      mutationKey: ['logout'],
      mutationFn: () => axiosInstance.get('/auth/logout').then(res => res.data),
      onSuccess: () => {
         toast.success("Logout successful")
         session?.updateValue({ login: false, user: { name: "", email: "" } })
         router.push('/login')
      },
      onError: (error) => {
         handleApiError(error)
      }
   })

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
            <NavUser user={session?.user || { name: "", email: "" }} logout={() => logutMutation.mutate()} />
         </SidebarFooter>
         <SidebarRail />
      </Sidebar>
   )
}
