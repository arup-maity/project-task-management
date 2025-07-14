'use client'
import EditTask from '@/components/task-page/edit-task'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React from 'react'

const TasksPage = () => {
   const [openEditTask, setOpenEditTask] = React.useState(false)
   const [selectedTaskID, setSelectedTaskID] = React.useState(null)
   return (
      <>
         <div className='p-4'>
            <div className="border rounded-2xl p-6">
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Task List</h2>
                  <Button
                     onClick={() => setOpenEditTask(prev => !prev)}
                  >
                     <Plus />
                     Add Task
                  </Button>
               </div>
            </div>
         </div>
         <EditTask
            open={openEditTask}
            close={() => { setOpenEditTask(prev => !prev); setSelectedTaskID(null) }}
            taskID={selectedTaskID}
         />
      </>
   )
}

export default TasksPage