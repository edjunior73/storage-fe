'use client'

import { Home, LogOut, User } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar
} from '@/components/ui/sidebar'
import { ThemeToggle } from '@/components/theme-toggle'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

const menuItems = [
  {
    title: 'Home',
    icon: Home,
    href: '/'
  }
]

export function AppSidebar() {
  const pathname = usePathname()
  const { isCollapsed } = useSidebar()
  const { toast } = useToast()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()

      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.'
      })

      router.push('/login')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive'
      })
    }
  }

  return (
    <Sidebar className="fixed inset-y-0 left-0 z-30 w-64 transition-all duration-300 ease-in-out data-[collapsed=true]:w-16 md:w-64 w-full">
      <SidebarHeader className="flex h-14 items-center border-b px-8">
        <div className="flex items-center transition-opacity duration-300 data-[collapsed=true]:opacity-0">
          <span className="font-semibold">Files</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map(item => (
            <div key={item.title}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={isCollapsed ? item.title : undefined}
                  className="w-full rounded-md px-8 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-accent-foreground"
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="truncate transition-opacity duration-300 data-[collapsed=true]:opacity-0">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </div>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto border-t p-4 md:p-4 p-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between md:px-2 px-1">
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="sm" className="rounded-full">
                  <User className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-xs text-muted-foreground">{user?.email || 'user@example.com'}</div>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
