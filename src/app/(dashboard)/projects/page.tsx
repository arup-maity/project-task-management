'use client'
import EditProject from '@/components/project-page/edit-project'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React from 'react'

const ProjectsPage = () => {
   const [openEditProject, setOpenEditProject] = React.useState(false)
   const [selectedProjectID, setSelectedProjectID] = React.useState(null)
   return (
      <>
         <div className='p-4'>
            <div className="border rounded-2xl p-6">
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Projects List</h2>
                  <Button
                     onClick={() => setOpenEditProject(prev => !prev)}
                  >
                     <Plus />
                     Add Project
                  </Button>
               </div>
            </div>
         </div>
         <EditProject
            open={openEditProject}
            close={() => { setOpenEditProject(prev => !prev); setSelectedProjectID(null) }}
            projectID={selectedProjectID}
         />
      </>
   )
}

export default ProjectsPage