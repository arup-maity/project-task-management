'use client'
import PaginationComponent from '@/components/common/pagination-component'
import EditProject from '@/components/project-page/edit-project'
import { Button } from '@/components/ui/button'
import { AuthContext } from '@/context/auth-context'
import { axiosInstance } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import React, { useContext } from 'react'


interface Project {
   _id: string;
   title: string;
   description: string;
   status: string;
}

const ProjectsPage = () => {
   const session = useContext(AuthContext)
   const userId = session?.user?.id || ""
   const [openEditProject, setOpenEditProject] = React.useState(false)
   const [selectedProjectID, setSelectedProjectID] = React.useState("")

   // pagination
   const [currentPage, setCurrentPage] = React.useState(1)
   const [totalItems, setTotalItems] = React.useState(1)

   const { data, isLoading } = useQuery({
      queryKey: ['projects'],
      queryFn: () => axiosInstance.get('/projects/all-projects', { params: { userId, page: currentPage, limit: 5 } }).then(res =>{
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
                  <div className="mb-5">
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
                                 <tr><td colSpan={4} className='p-2 border text-center'>Loading...</td></tr>
                                 :
                                 data?.projects?.length === 0 ?
                                    <tr><td colSpan={4} className='p-2 border text-center'>No projects found</td></tr>
                                    :
                                    data?.projects.map((project: Project) => (
                                       <tr key={project._id}>
                                          <td className='p-2 border'>{project.title}</td>
                                          <td className='p-2 border'>{project.description}</td>
                                          <td className='p-2 border'>{project.status}</td>
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
                  <PaginationComponent
                     currentPage={currentPage}
                     perPage={5}
                     totalItems={totalItems}
                     onPageChange={(page) => setCurrentPage(page)}
                  />
               </div>
            </div>
         </div>
         <EditProject
            open={openEditProject}
            close={() => { setOpenEditProject(prev => !prev); setSelectedProjectID("") }}
            projectID={selectedProjectID}
            userId={userId}
         />
      </>
   )
}

export default ProjectsPage