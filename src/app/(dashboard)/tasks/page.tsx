'use client'
import PaginationComponent from '@/components/common/pagination-component'
import EditTask from '@/components/task-page/edit-task'
import { Button } from '@/components/ui/button'
import { AuthContext } from '@/context/auth-context'
import { axiosInstance } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import React, { useContext } from 'react'

type Project = {
   _id: string,
   title: string,
   description: string,
   status: string
}
type TaskType = {
   _id: string,
   title: string,
   description: string,
   status: string
   project: Project
}

const TasksPage = () => {
   const session = useContext(AuthContext)
   const userId = session?.user?.id || ""
   const [openEditTask, setOpenEditTask] = React.useState(false)
   const [selectedTaskID, setSelectedTaskID] = React.useState("")

   // pagination
   const [currentPage, setCurrentPage] = React.useState(1)
   const [totalItems, setTotalItems] = React.useState(1)

   const { data, isLoading } = useQuery({
      queryKey: ['tasks'],
      queryFn: () => axiosInstance.get(`/tasks/all-tasks`, { params: { userId: userId, page: currentPage, limit: 5 } }).then(res => {
         setTotalItems(res.data.count)
         return res.data
      }),
      enabled: !!userId
   })
   if (!session?.loading && !userId) {
      return <div className='p-4'>You are not logged in</div>
   }
   return (
      <>
         <div className='p-4'>
            <div className="border rounded-2xl p-6">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-semibold">Task List</h2>
                  <Button
                     onClick={() => setOpenEditTask(prev => !prev)}
                  >
                     <Plus />
                     Add Task
                  </Button>
               </div>
               <div className="w-full">
                  <div className="mb-5">
                     <table className='w-full'>
                        <thead>
                           <tr>
                              <th className='w-60 text-left p-2 border'>Task Title</th>
                              <th className='w-60 text-left p-2 border'>Project</th>
                              <th className='w-auto text-left p-2 border'>Description</th>
                              <th className='w-40 text-left p-2 border'>Status</th>
                              <th className='w-40 text-left p-2 border'>Options</th>
                           </tr>
                        </thead>
                        <tbody>
                           {
                              isLoading ? <tr><td colSpan={5} className='text-center'>Loading...</td></tr> :
                                 data?.tasks.length === 0 ?
                                    <tr><td colSpan={5} className='text-center'>No Task Found</td></tr> :
                                    data?.tasks.map((task: TaskType) => (
                                       <tr key={task._id}>
                                          <td className='w-60 p-2 border'>{task.title}</td>
                                          <td className='w-60 p-2 border'>{task?.project?.title}</td>
                                          <td className='w-auto p-2 border'>
                                             <p className='line-clamp-1'>{task.description}</p>
                                          </td>
                                          <td className='w-40 p-2 border'>{task.status}</td>
                                          <td className='w-40 p-2 border'>
                                             <Button
                                                onClick={() => { setOpenEditTask(prev => !prev); setSelectedTaskID(task._id) }}
                                             >
                                                Edit
                                             </Button>
                                          </td>
                                       </tr>
                                    ))
                           }
                        </tbody>
                     </table>
                  </div>
                  <PaginationComponent
                     currentPage={currentPage}
                     perPage={5}
                     totalItems={totalItems}
                     onPageChange={(page) => setCurrentPage(page)}
                  />
               </div>
            </div>
         </div>
         <EditTask
            open={openEditTask}
            close={() => { setOpenEditTask(prev => !prev); setSelectedTaskID("") }}
            taskID={selectedTaskID}
            userID={userId}
         />
      </>
   )
}

export default TasksPage