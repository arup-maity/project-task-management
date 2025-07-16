import axios from "axios";
import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs))
}

export function handleApiError(error: unknown) {
   if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || 'Something went wrong';

      if (status === 409) {
         toast.error(` ${message}`);
      } else if (status === 401) {
         toast.error(` ${message}`);
      } else {
         toast.error(message);
      }
   } else {
      toast.error('Unexpected error');
   }
}
