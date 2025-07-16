'use client'
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { Loader2 } from "lucide-react";

const schemaValidation = z.object({
   firstname: z.string().min(1, { message: "This field has to be filled." }),
   lastname: z.string(),
   email: z.string().min(1, { message: "This field has to be filled." }).email("This is not a valid email."),
   password: z.string().min(1, { message: "This field has to be filled." }).regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$/, {
      message: "Your password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
   })
});

type Inputs = z.infer<typeof schemaValidation>;

const EditUser = ({ open, close, employeeId }: { open: boolean; close: () => void; employeeId?: number | null }) => {
   const queryClient = useQueryClient()
   const defaultValues = { firstname: "", lastname: "", email: "", password: "" };

   const { register, handleSubmit, reset, formState: { errors }, } = useForm<Inputs>({
      defaultValues,
      mode: "onChange",
      resolver: zodResolver(schemaValidation)
   })
   const createMutation = useMutation({
      mutationKey: ['create-user'],
      mutationFn: (data: Inputs) => axiosInstance.post('/user/create-user', data).then(res => res.data),
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: ['users']
         })
         close();
         reset();
      },
      onError: (error) => {
         console.log(error)
      }
   })
   const onSubmit: SubmitHandler<Inputs> = (data) => {
      createMutation.mutate(data)
   }
   return (
      <>
         <Sheet open={open} onOpenChange={() => { close(); reset() }}>
            <SheetContent className='w-full lg:w-6/12 flex flex-col rounded-l-xl'>
               <SheetHeader>
                  <SheetTitle className="text-lg">
                     {employeeId ? 'Update User' : 'Add User'}
                  </SheetTitle>
                  <SheetDescription className='hidden'></SheetDescription>
               </SheetHeader>
               <form onSubmit={handleSubmit(onSubmit)} className='flex-grow flex flex-col overflow-y-auto'>
                  <div className="grow overflow-y-auto">
                     <div className="space-y-4 px-4">

                        <div className="flex flex-wrap -m-2">
                           <fieldset className="w-6/12 p-2">
                              <label className="block text-sm font-medium text-gray-900 mb-1.5">firstname</label>
                              <Input {...register('firstname')} />
                              {errors.firstname && <p className="text-red-500 test-sm">{errors.firstname.message}</p>}
                           </fieldset>

                           <fieldset className="w-6/12 p-2">
                              <label className="block text-sm font-medium text-gray-900 mb-1.5">lastname</label>
                              <Input {...register('lastname')} />
                           </fieldset>

                           <fieldset className="w-full p-2">
                              <label className="block text-sm font-medium text-gray-900 mb-1.5">Email</label>
                              <Input {...register('email')} className="w-6/12" />
                              {errors.email && <p className="text-red-500 test-sm">{errors.email.message}</p>}
                           </fieldset>

                           <fieldset className="w-full p-2">
                              <label className="block text-sm font-medium text-gray-900 mb-1.5">Password</label>
                              <Input {...register('password')} className="w-6/12" />
                              {errors.password && <p className="text-red-500 test-sm">{errors.password.message}</p>}
                           </fieldset>
                        </div>
                     </div>
                  </div>
                  <div className="flex gap-2 p-4">
                     <Button
                        type='submit'
                        className='w-32'
                        disabled={createMutation.isPending}
                     >
                        {createMutation.isPending && <Loader2 className="mr-2 animate-spin" />}
                        Save
                     </Button>
                     <Button
                        variant='secondary'
                        className='w-32'
                        disabled={createMutation.isPending}
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

export default EditUser