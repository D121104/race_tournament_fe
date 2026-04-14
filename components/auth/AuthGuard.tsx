"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/services/authService";
import { Spin } from "antd";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/login") {
      setChecked(true);
      return;
    }

    if (!authService.isAuthenticated()) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, [pathname, router]);

  if (!checked && pathname !== "/login") {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Spin size="large" tip="Đang kiểm tra phiên đăng nhập..." />
      </div>
    );
  }

  return <>{children}</>;
}
