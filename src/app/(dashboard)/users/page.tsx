'use client'
import { Button } from '@/components/ui/button'
import EditUser from '@/components/users-page/edit-user'
import { axiosInstance } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import React from 'react'


interface User {
   id: string
   firstname: string
   lastname: string
   email: string
}

const UserListPage = () => {
   const [openEditUser, setOpenEditUser] = React.useState(false)
   const { data, isLoading } = useQuery({
      queryKey: ['users'],
      queryFn: () => axiosInstance.get('/user/all-users').then(res => res.data),
   })
   return (
      <>
         <div className='p-4'>
            <div className="border rounded-2xl p-6">
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">User List</h2>
                  <Button
                     onClick={() => setOpenEditUser(prev => !prev)}
                  >
                     <Plus />
                     Add User
                  </Button>
               </div>
               <div className="">
                  <table className='w-full border'>
                     <thead>
                        <tr>
                           <th className='w-80 text-left p-2 border'>Name</th>
                           <th className='w-auto text-left p-2 border'>Email</th>
                        </tr>
                     </thead>
                     <tbody>
                        {
                           isLoading ?
                              <tr>
                                 <td colSpan={2} className='text-center p-2 border'>Loading...</td>
                              </tr>
                              :
                              data?.length === 0 ?
                                 <tr>
                                    <td colSpan={2} className='text-center p-2 border'>No users found</td>
                                 </tr>
                                 :
                                 data.map((user: User) => (
                                    <tr key={user.id}>
                                       <td className='p-2 border'>{user.firstname} {user.lastname}</td>
                                       <td className='p-2 border'>{user.email}</td>
                                    </tr>
                                 ))
                        }
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
         <EditUser open={openEditUser} close={() => setOpenEditUser(false)} />
      </>
   )
}

export default UserListPage