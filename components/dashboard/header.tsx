"use client"

import type { User } from "@supabase/supabase-js"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"

interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
}

interface DashboardHeaderProps {
  user: User
  profile: Profile | null
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/assessment": "Psychometric Assessment",
  "/dashboard/chat": "AI Career Advisor",
  "/dashboard/roadmap": "Career Roadmap",
  "/dashboard/explore": "Knowledge Graph",
  "/dashboard/documents": "Documents",
  "/dashboard/settings": "Settings",
}

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  const pathname = usePathname()
  const pageTitle = pageTitles[pathname] || "Dashboard"

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium">{pageTitle}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto text-sm text-muted-foreground">
        Welcome, <span className="font-medium text-foreground">{profile?.full_name || "Student"}</span>
      </div>
    </header>
  )
}
