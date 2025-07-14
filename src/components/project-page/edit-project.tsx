'use client'
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import TextareaAutosize from 'react-textarea-autosize';
import { MultiSelect } from "../common/multiple-select";

const schemaValidation = z.object({
   firstName: z.string(),
   lastName: z.string(),
   email: z.string().email(),
   password: z.string().min(6),
});

type Inputs = z.infer<typeof schemaValidation>;

const EditProject = ({ open, close, projectID }: { open: boolean; close: () => void; projectID?: number | null }) => {
   const defaultValues = { firstName: "", lastName: "", email: "", password: "" };

   const { register, handleSubmit, reset, formState: { errors }, } = useForm<Inputs>({
      defaultValues,
      mode: "onChange",
      resolver: zodResolver(schemaValidation)
   })
   const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)
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
               <form onSubmit={handleSubmit(onSubmit)} className='flex-grow flex flex-col overflow-y-auto'>
                  <div className="grow overflow-y-auto">
                     <div className="space-y-4 px-4">

                        <div className="flex flex-wrap -m-2">
                           <fieldset className="w-7/12 p-2">
                              <label className="block text-sm font-medium text-gray-900 mb-1.5">Title</label>
                              <Input {...register('firstName')} />
                              {errors.firstName && <span>{errors.firstName.message}</span>}
                           </fieldset>
                           <fieldset className="w-5/12 p-2">
                              <label className="block text-sm font-medium text-gray-900 mb-1.5">Status</label>
                              <Select>
                                 <SelectTrigger className="w-80">
                                    <SelectValue placeholder="Status" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="complete">Complete</SelectItem>
                                 </SelectContent>
                              </Select>
                              {errors.email && <span>{errors.email.message}</span>}
                           </fieldset>
                           <fieldset className="w-full p-2">
                              <label className="block text-sm font-medium text-gray-900 mb-1.5">Description</label>
                              <TextareaAutosize minRows={5} className="w-full border border-gray-300 p-2 rounded-md" />
                              {errors.lastName && <span>{errors.lastName.message}</span>}
                           </fieldset>
                           <fieldset className="w-full p-2">
                              <label className="block text-sm font-medium text-gray-900 mb-1.5">Select User</label>
                              <MultiSelect />
                              {errors.lastName && <span>{errors.lastName.message}</span>}
                           </fieldset>
                        </div>
                     </div>
                  </div>
                  <div className="flex gap-2 p-4">
                     <Button type='submit' className='w-32'
                     >
                        {projectID ? 'Update' : 'Add'}
                     </Button>
                     <Button variant='secondary' className='w-32'
                        onClick={() => { close(); reset() }}
                     >
                        Cancel
                     </Button>
                  </div>
               </form>
            </SheetContent>
         </Sheet>
      </>
   )
}

export default EditProject