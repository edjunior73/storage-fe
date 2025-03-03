"use client"

import type React from "react"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AuthProvider } from "@/components/auth-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen">
          <AppSidebar />
          <div className="flex-1 pl-[16rem] transition-[padding] duration-300 ease-in-out data-[collapsed=true]:pl-[4rem]">
            {children}
          </div>
        </div>
      </SidebarProvider>
    </AuthProvider>
  )
}

