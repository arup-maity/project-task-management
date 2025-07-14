'use client'
import { Button } from '@/components/ui/button'
import EditUser from '@/components/users-page/edit-user'
import { Plus } from 'lucide-react'
import React from 'react'

const UserListPage = () => {
   const [openEditUser, setOpenEditUser] = React.useState(false)
   return (
      <>
         <div className='p-4'>
            <div className="border rounded-2xl p-6">
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">User List</h2>
                  <Button
                     onClick={() => setOpenEditUser(prev => !prev)}
                  >
                     <Plus />
                     Add User
                  </Button>
               </div>
            </div>
         </div>
         <EditUser open={openEditUser} close={() => setOpenEditUser(false)} />
      </>
   )
}

export default UserListPage