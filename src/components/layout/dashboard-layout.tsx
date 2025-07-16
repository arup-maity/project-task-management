'use client'
import React, { useContext } from 'react'

import { useRouter } from 'next/navigation'
import { AuthContext } from '@/context/auth-context'
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

const DashBoardLayout = ({ children }: { children: React.ReactNode }) => {
   const session = useContext(AuthContext)
   const router = useRouter();
   if (!session?.loading && !session?.login) {
      router.push('/login')
      return (
         <div className="h-dvh w-screen flex flex-row gap-2 justify-center items-center text-md font-extrabold text-gray-800">
            <span className="leading-none tracking-none animate-ping">L</span>
            <span className="leading-none tracking-none animate-ping delay_1">O</span>
            <span className="leading-none tracking-none animate-ping delay_2">A</span>
            <span className="leading-none tracking-none animate-ping delay_3">D</span>
            <span className="leading-none tracking-none animate-ping delay_4">I</span>
            <span className="leading-none tracking-none animate-ping delay_5">N</span>
            <span className="leading-none tracking-none animate-ping delay_6">G</span>
         </div>
      )
   }
   return (
      <SidebarProvider>
         <AppSidebar />
         <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
               <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator
                     orientation="vertical"
                     className="mr-2 data-[orientation=vertical]:h-4"
                  />
               </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
               {children}
            </div>
         </SidebarInset>
      </SidebarProvider>
   )
}

export default DashBoardLayout