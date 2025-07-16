'use client'
import { z } from "zod";
import TextareaAutosize from 'react-textarea-autosize';
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { axiosInstance } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

const schemaValidation = z.object({
   title: z.string(),
   description: z.string(),
   status: z.string(),
});

type Inputs = z.infer<typeof schemaValidation>;
type bodyType = Inputs & { userID: string }

const EditProject = ({ open, close, projectID, userId }: { open: boolean; close: () => void; projectID?: string, userId: string }) => {
   const queryClient = useQueryClient()
   const defaultValues = { title: "", description: "", status: "active" };

   const { register, control, handleSubmit, reset, setValue, formState: { errors }, } = useForm<Inputs>({
      defaultValues,
      mode: "onChange",
      resolver: zodResolver(schemaValidation)
   })
   const createMutation = useMutation({
      mutationKey: ['create-project'],
      mutationFn: (data: bodyType) => axiosInstance.post('/projects/create-project', data).then(res => res.data),
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: ['projects']
         })
         close();
         reset();
      },
      onError: (error) => {
         console.log(error)
      }
   })
   const updateMutation = useMutation({
      mutationKey: ['create-project'],
      mutationFn: (data: bodyType) => axiosInstance.put(`/projects/update-project/${projectID}`, data).then(res => res.data),
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: ['projects']
         })
         close();
         reset();
      },
      onError: (error) => {
         console.log(error)
      }
   })
   const { isLoading } = useQuery({
      queryKey: ['read-project'],
      queryFn: () => axiosInstance.get(`/projects/read-project/${projectID}`).then(res => {
         for (const key in defaultValues) {
            setValue(key as keyof Inputs, res.data[key])
         }
         return res.data
      }),
      enabled: !!projectID,
   })
   const onSubmit: SubmitHandler<Inputs> = (data) => projectID ? updateMutation.mutate({ ...data, userID: userId }) : createMutation.mutate({ ...data, userID: userId })
   return (
      <>
         <Sheet open={open} onOpenChange={() => { close(); reset() }}>
            <SheetContent className='w-full lg:w-8/12 flex flex-col rounded-l-xl'>
               <SheetHeader>
                  <SheetTitle className="text-lg">
                     {projectID ? 'Update Project' : 'Add Project'}
                  </SheetTitle>
                  <SheetDescription className='hidden'></SheetDescription>
               </SheetHeader>
               {
                  isLoading ?
                     <div className="">
                        <h2 className="text-2xl font-semibold">Loading...</h2>
                     </div>
                     :
                     <form onSubmit={handleSubmit(onSubmit)} className='flex-grow flex flex-col overflow-y-auto'>
                        <div className="grow overflow-y-auto">
                           <div className="space-y-4 px-4">

                              <div className="flex flex-wrap -m-2">
                                 <fieldset className="w-7/12 p-2">
                                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Title</label>
                                    <Input {...register('title')} />
                                    {errors.title && <span>{errors.title.message}</span>}
                                 </fieldset>
                                 <fieldset className="w-5/12 p-2">
                                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Status</label>
                                    <Controller
                                       name="status"
                                       control={control}
                                       render={({ field }) => (
                                          <Select value={field.value} onValueChange={field.onChange}>
                                             <SelectTrigger className="w-80">
                                                <SelectValue placeholder="Status" />
                                             </SelectTrigger>
                                             <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="complete">Complete</SelectItem>
                                             </SelectContent>
                                          </Select>
                                       )}
                                    />
                                 </fieldset>
                                 <fieldset className="w-full p-2">
                                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Description</label>
                                    <Controller
                                       name="description"
                                       control={control}
                                       render={({ field }) => (
                                          <TextareaAutosize value={field.value} onChange={field.onChange} minRows={5} className="w-full border border-gray-300 p-2 rounded-md" />
                                       )}
                                    />
                                    {errors.description && <span>{errors.description.message}</span>}
                                 </fieldset>
                              </div>
                           </div>
                        </div>
                        <div className="flex gap-2 p-4">
                           <Button type='submit' className='w-32'
                              disabled={createMutation.isPending || updateMutation.isPending}
                           >
                              {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              {projectID ? 'Update' : 'Add'}
                           </Button>
                           <Button variant='secondary' className='w-32'
                              onClick={() => { close(); reset() }}
                              disabled={createMutation.isPending || updateMutation.isPending}
                           >
                              Cancel
                           </Button>
                        </div>
                     </form>
               }
            </SheetContent>
         </Sheet>
      </>
   )
}

export default EditProject