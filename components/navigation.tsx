"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, DollarSign, Settings, Bell, Plus, Home, BookOpen, UserPlus } from "lucide-react"
import { useData } from "@/lib/data-context"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navigation() {
  const pathname = usePathname()
  const { payments } = useData()

  const pendingPayments = payments.filter((p) => p.status === "pending" || p.status === "overdue").length
  const overduePayments = payments.filter((p) => p.status === "overdue").length

  const navItems = [
    {
      href: "/",
      label: "Dashboard",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      href: "/students",
      label: "Students",
      icon: Users,
      isActive: pathname.startsWith("/students"),
    },
    {
      href: "/classes",
      label: "Classes",
      icon: BookOpen,
      isActive: pathname.startsWith("/classes"),
    },
    {
      href: "/registration",
      label: "Registration",
      icon: UserPlus,
      isActive: pathname.startsWith("/registration"),
    },
    {
      href: "/attendance",
      label: "Attendance",
      icon: Calendar,
      isActive: pathname.startsWith("/attendance"),
    },
    {
      href: "/payments",
      label: "Payments",
      icon: DollarSign,
      isActive: pathname.startsWith("/payments"),
      badge: pendingPayments > 0 ? pendingPayments : undefined,
      badgeVariant: overduePayments > 0 ? "destructive" : "secondary",
    },
    {
      href: "/admin",
      label: "Admin",
      icon: Settings,
      isActive: pathname.startsWith("/admin"),
    },
  ]

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-slate-900">DanceFlow Studio</h1>
                <p className="text-xs text-slate-500">Management System</p>
              </div>
            </Link>
          </div>

          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`relative ${
                      item.isActive
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                    {item.badge && (
                      <Badge variant={item.badgeVariant as any} className="ml-2 h-5 min-w-5 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="relative text-slate-700 hover:text-slate-900 hover:bg-slate-100"
            >
              <Bell className="w-4 h-4" />
              {(pendingPayments > 0 || overduePayments > 0) && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
            <Link href="/students">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 shadow-lg text-white font-medium border-0"
                style={{ background: "rgb(37, 99, 235)", color: "rgb(255, 255, 255)" }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Quick Add
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
