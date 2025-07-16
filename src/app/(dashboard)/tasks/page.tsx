'use client'
import EditTask from '@/components/task-page/edit-task'
import { Button } from '@/components/ui/button'
import { axiosInstance } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import React from 'react'

const TasksPage = () => {
   const [openEditTask, setOpenEditTask] = React.useState(false)
   const [selectedTaskID, setSelectedTaskID] = React.useState("")
   const { data, isLoading } = useQuery({
      queryKey: ['tasks-list'],
      queryFn: () => axiosInstance.get(`/tasks/all-tasks`).then(res => res.data)
   })
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
               <div className="">
                  <table className='w-full'>
                     <thead>
                        <tr>
                           <th className='w-80 text-left p-2 border'>Task Name</th>
                           <th className='w-auto text-left p-2 border'>Description</th>
                           <th className='w-auto text-left p-2 border'>Status</th>
                           <th className='w-60 text-left p-2 border'>Options</th>
                        </tr>
                     </thead>
                     <tbody>
                        {
                           isLoading ? <tr><td>Loading...</td></tr> :
                              data?.length === 0 ?
                                 <tr><td>No Task Found</td></tr> :
                                 data?.map((task: any) => (
                                    <tr key={task._id}>
                                       <td className='w-80 text-left p-2 border'>{task.title}</td>
                                       <td className='w-auto text-left p-2 border'>{task.description}</td>
                                       <td className='w-auto text-left p-2 border'>{task.status}</td>
                                       <td className='w-60 text-left p-2 border'>Options</td>
                                    </tr>
                                 ))
                        }
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
         <EditTask
            open={openEditTask}
            close={() => { setOpenEditTask(prev => !prev); setSelectedTaskID("") }}
            taskID={selectedTaskID}
         />
      </>
   )
}

export default TasksPage