"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.replace("/dashboard/tournament");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <p>Đang chuyển hướng...</p>
    </div>
  );
}
