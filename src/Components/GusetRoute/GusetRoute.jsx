"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";

export default function GuestRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname(); 
  const { token } = useSelector((store) => store.authReducer);

  useEffect(() => {
    // ✅ لو في token ومحاول يدخل login أو signup
    if (token && (pathname === "/login" || pathname === "/signup")) {
      router.push("/");
    }
  }, [token, router, pathname]);

  // ✅ لو في token، امنع الـ render وارجعه للـ home
  if (token && (pathname === "/login" || pathname === "/signup")) {
    return null;
  }

  // ✅ لو مفيش token، اعرض الصفحة عادي
  return <>{children}</>;
}