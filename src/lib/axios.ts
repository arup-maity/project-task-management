import axios, { AxiosInstance } from "axios";

export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const axiosInstance: AxiosInstance = axios.create({
   baseURL: apiUrl,
   withCredentials: true
});
