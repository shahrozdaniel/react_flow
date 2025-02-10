"use client";
import axios from "axios";
import { getBaseUrl, getToken } from "./utils";
const token = process.env.NEXT_PUBLIC_API_TOKEN;

const axiosInstance = axios.create({
  baseURL: "https://demo1.aycent.com/api/",
  headers: {
    Authorization: `Bearer 6rpd8ye1ctyvmz65d1i1n76w9il3j9rb9kctklq152s0srhy358humyvbymfjwuo`,
    "Content-Type": "application/json",
  },
  // .. other options
});

// axios.create({
//   baseURL: getBaseUrl(),
//   headers: {
//     Authorization: `Bearer ${getToken()}`,
//     "Content-Type": "application/json",
//   },
//   // .. other options
// });

export default axiosInstance;
