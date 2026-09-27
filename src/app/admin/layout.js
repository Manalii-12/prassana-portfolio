"use client";

import { AdminThemeProvider } from "@/context/AdminThemeContext";

export default function RootAdminLayout({ children }) {
  return <AdminThemeProvider>{children}</AdminThemeProvider>;
}
