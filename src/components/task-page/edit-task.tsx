'use client'
import { z } from "zod";
import TextareaAutosize from 'react-textarea-autosize';
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
// import { MultiSelect } from "../common/multiple-select";

const schemaValidation = z.object({
   title: z.string(),
   description: z.string(),
   status: z.string(),
});

type Inputs = z.infer<typeof schemaValidation>;

const EditTask = ({ open, close, taskID }: { open: boolean; close: () => void; taskID?: string }) => {
   const defaultValues = { title: "", description: "", status: "todo" };

   const { register, control, handleSubmit, reset, setValue, formState: { errors }, } = useForm<Inputs>({
      defaultValues,
      mode: "onChange",
      resolver: zodResolver(schemaValidation)
   })
   const createMutation = useMutation({
      mutationKey: ['create-task'],
      mutationFn: (data: Inputs) => axiosInstance.post('/tasks/create-task', data).then(res => res.data),
      onSuccess: () => {
         close();
         reset();
      },
      onError: (error) => {
         console.log(error)
      }
   })
   const updateMutation = useMutation({
      mutationKey: ['create-task'],
      mutationFn: (data: Inputs) => axiosInstance.put(`/tasks/update-task/${taskID}`, data).then(res => res.data),
      onSuccess: () => {
         close();
         reset();
      },
      onError: (error) => {
         console.log(error)
      }
   })
   const { isLoading } = useQuery({
      queryKey: ['read-task'],
      queryFn: () => axiosInstance.get(`/tasks/read-task/${taskID}`).then(res => {
         for (const key in defaultValues) {
            setValue(key as keyof Inputs, res.data[key])
         }
         return res.data
      }),
      enabled: !!taskID,
   })
   console.log(errors)
   const onSubmit: SubmitHandler<Inputs> = (data) => taskID ? updateMutation.mutate(data) : createMutation.mutate(data)
   return (
      <>
         <Sheet open={open} onOpenChange={() => { close(); reset() }}>
            <SheetContent className='w-full lg:w-8/12 flex flex-col rounded-l-xl'>
               <SheetHeader>
                  <SheetTitle className="text-lg">
                     {taskID ? 'Update Task' : 'Add Task'}
                  </SheetTitle>
                  <SheetDescription className='hidden'></SheetDescription>
               </SheetHeader>
               {
                  isLoading ?
                     <div className=""></div> :
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
                                                <SelectItem value="todo">todo</SelectItem>
                                                <SelectItem value="in-progress">in-progress</SelectItem>
                                                <SelectItem value="done">done</SelectItem>
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
                                          <TextareaAutosize value={field.value} onChange={(e) => field.onChange(e.target.value)} minRows={5} className="w-full border border-gray-300 p-2 rounded-md" />
                                       )}
                                    />
                                    {errors.description && <span>{errors.description.message}</span>}
                                 </fieldset>
                                 {/* <fieldset className="w-full p-2">
                              <label className="block text-sm font-medium text-gray-900 mb-1.5">tags</label>
                              <MultiSelect />
                              {errors.lastName && <span>{errors.lastName.message}</span>}
                           </fieldset> */}
                              </div>
                           </div>
                        </div>
                        <div className="flex gap-2 p-4">
                           <Button type='submit' className='w-32'
                           >
                              {taskID ? 'Update' : 'Add'}
                           </Button>
                           <Button variant='secondary' className='w-32'
                              onClick={() => { close(); reset() }}
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

export default EditTask