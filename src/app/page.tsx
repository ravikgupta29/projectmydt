"use client"
import { useRouter } from "next/navigation";
import  React, {useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const isAuthenticated = typeof window !== "undefined" && localStorage.getItem("token"); 

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null; 
}
