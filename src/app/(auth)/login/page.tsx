'use client'
import React, { useContext } from 'react'

import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form"

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { handleApiError } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AuthContext } from '@/context/auth-context';

const schemaValidation = z.object({
   email: z.string().min(1, { message: "This field has to be filled." }).email("This is not a valid email."),
   password: z.string().min(1, { message: "This field has to be filled." }).regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$/, {
      message: "Your password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
   })
});

type FormData = z.infer<typeof schemaValidation>;


const LoginPage = () => {
   const router = useRouter();
   const session = useContext(AuthContext)
   const [showPassword, setShowPassword] = React.useState(false);
   const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
      mode: 'onSubmit',
      resolver: zodResolver(schemaValidation),
   })

   const loginMutation = useMutation({
      mutationKey: ['login'],
      mutationFn: (data: FormData) => axiosInstance.post('/auth/login', data).then(res => res.data),
      onSuccess: (data) => {
         toast.success("Login successful")
         session?.updateValue({ login: true, user: data?.user })
         router.push('/')
      },
      onError: (error) => {
         handleApiError(error)
      }
   })

   const onSubmit: SubmitHandler<FormData> = (data) => loginMutation.mutate(data)
   if (!session?.loading && session?.login) {
      return router.push('/')
   }
   return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
         <div className="w-full max-w-md">
            <div className="flex flex-col gap-6" >
               <Card>
                  <CardHeader>
                     <CardTitle>Login to your account</CardTitle>
                     <CardDescription>
                        Enter your email below to login to your account
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <form onSubmit={handleSubmit(onSubmit)} >
                        <div className="flex flex-col gap-6">
                           <div className="">
                              <Label htmlFor="email" className='mb-2'>Email</Label>
                              <Input {...register('email')} placeholder="m@example.com" />
                              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                           </div>
                           <div className="">
                              <Label htmlFor="password" className='mb-2'>Password</Label>
                              <div className="relative">
                                 <Input {...register('password')} placeholder="password" type={showPassword ? 'text' : 'password'} />
                                 <div className="absolute top-3 right-3 cursor-pointer" onClick={() => setShowPassword(prev => !prev)}>
                                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                                 </div>
                              </div>
                              {errors.password && <p className=" text-sm text-red-500">{errors.password.message}</p>}
                           </div>
                           <div className="flex flex-col gap-3">
                              <Button
                                 type="submit"
                                 disabled={loginMutation.isPending}
                                 className="w-full"
                              >
                                 {loginMutation.isPending ? <Loader2 className="mr-2 animate-spin" /> : 'Login'}
                              </Button>
                           </div>
                        </div>
                     </form>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   )
}

export default LoginPage