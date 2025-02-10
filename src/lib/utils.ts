"use client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    //@ts-ignore
    return window?.apiUrl || "";
  }
  return "";
};

export const getGatewayID = () => {
  if (typeof window !== "undefined") {
    //@ts-ignore
    return window?.gatewayID || 0;
  }
  return 0;
};

export const getActionFlowID = () => {
  if (typeof window !== "undefined") {
    //@ts-ignore
    return window?.actionFlowID || 0;
  }
  return 0;
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    //@ts-ignore
    return window?.token || "";
  }
  return "";
};
