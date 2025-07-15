'use client'
import EditProject from '@/components/project-page/edit-project'
import { Button } from '@/components/ui/button'
import { axiosInstance } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import React from 'react'


interface Project {
   _id: string;
   title: string;
   description: string;
   status: string;
}

const ProjectsPage = () => {
   const [openEditProject, setOpenEditProject] = React.useState(false)
   const [selectedProjectID, setSelectedProjectID] = React.useState("")

   const { data, isLoading } = useQuery({
      queryKey: ['projects'],
      queryFn: () => axiosInstance.get('/projects/all-projects').then(res => res.data),
   })
   return (
      <>
         <div className='p-4'>
            <div className="border rounded-2xl p-6">
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">Projects List</h2>
                  <Button
                     onClick={() => setOpenEditProject(prev => !prev)}
                  >
                     <Plus />
                     Add Project
                  </Button>
               </div>
               <div className="">
                  <table className='w-full border'>
                     <thead>
                        <tr>
                           <th className='w-80 text-left p-2 border'>Project Name</th>
                           <th className='w-auto text-left p-2 border'>Description</th>
                           <th className='w-auto text-left p-2 border'>Status</th>
                           <th className='w-60 text-left p-2 border'>Options</th>
                        </tr>
                     </thead>
                     <tbody>
                        {
                           isLoading ?
                              <tr><td colSpan={3} className='p-2 border'>Loading...</td></tr>
                              :
                              data?.length === 0 ?
                                 <tr><td colSpan={3} className='p-2 border'>No projects found</td></tr>
                                 :

                                 data?.map((project: Project) => (
                                    <tr key={project._id}>
                                       <td className='p-2 border'>{project.title}</td>
                                       <td className='p-2 border'>{project.description}</td>
                                       <td className='p-2 border'>{project.status === "active" ? "Active" : "Complete"}</td>
                                       <td className='p-2 border'>
                                          <div className='flex gap-2'>
                                             <Button onClick={() => { setOpenEditProject(prev => !prev); setSelectedProjectID(project._id) }}>
                                                Edit
                                             </Button>
                                          </div>
                                       </td>
                                    </tr>
                                 ))
                        }
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
         <EditProject
            open={openEditProject}
            close={() => { setOpenEditProject(prev => !prev); setSelectedProjectID("") }}
            projectID={selectedProjectID}
         />
      </>
   )
}

export default ProjectsPage