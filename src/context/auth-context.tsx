'use client';

import { axiosInstance } from '@/lib/axios';
import { createContext, useLayoutEffect, useState, ReactNode } from 'react';

// Define the type for the user object decoded from JWT
export interface User {
   id?: string;
   name?: string;
   email?: string;
}

// Auth context type
interface AuthContextType {
   loading: boolean;
   login: boolean;
   user?: User;
   updateValue: (value: {
      loading?: boolean;
      login?: boolean;
      user?: User;
   }) => void;
}

// Initial empty context value
export const AuthContext = createContext<AuthContextType>({
   loading: true,
   login: false,
   user: {},
   updateValue: () => { },
});

// Props for the provider
interface SessionProviderProps {
   children: ReactNode;
}

// SessionProvider component
export default function SessionProvider({ children }: SessionProviderProps) {
   const [loading, setLoading] = useState(true);
   const [login, setLogin] = useState(false);
   const [user, setUser] = useState<User | undefined>(undefined);

   useLayoutEffect(() => {
      decodeToken();
   }, []);

   const decodeToken = async () => {
      try {
         const res = await axiosInstance.get('/auth/check-token');

         if (res.data.success && res.data.login && res.data.user) {
            setUser(res.data.user);
            setLogin(true);
         } else {
            setUser(undefined);
            setLogin(false);
         }
      } catch {
         setUser(undefined);
         setLogin(false);
      } finally {
         setLoading(false);
      }
   };

   const updateValue = ({
      loading,
      login,
      user,
   }: {
      loading?: boolean;
      login?: boolean;
      user?: User;
   }) => {
      if (loading !== undefined) setLoading(loading);
      if (login !== undefined) setLogin(login);
      if (user !== undefined) setUser(user);
   };

   return (
      <AuthContext.Provider value={{ loading, login, user, updateValue }}>
         {children}
      </AuthContext.Provider>
   );
}
