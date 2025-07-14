import DashBoardLayout from '@/components/layout/dashboard-layout'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
   return (
      <DashBoardLayout>
         {children}
      </DashBoardLayout>
   )
}

export default Layout