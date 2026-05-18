'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Smartphone,
  List,
  Scale,
  Calculator,
  BarChart3,
  Target,
  GitCompare,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/alternatif', label: 'Alternatif', icon: Smartphone },
  { href: '/kriteria', label: 'Kriteria', icon: List },
  { href: '/bobot', label: 'Bobot', icon: Scale },
  { href: '/saw', label: 'SAW', icon: Calculator },
  { href: '/smart', label: 'SMART', icon: Calculator },
  { href: '/profile-matching', label: 'Profile Matching', icon: Target },
  { href: '/goal-programming', label: 'Goal Programming', icon: Calculator },
  { href: '/perbandingan', label: 'Perbandingan', icon: GitCompare },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-64 bg-[#1E3A5F] text-white transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-[#2A4A75]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#4F9CF9] rounded-lg flex items-center justify-center font-bold text-white shrink-0">
              SI
            </div>
            <div>
              <span className="text-xl font-bold whitespace-nowrap block leading-tight">SIPEMAS</span>
              <span className="text-xs text-white/70 whitespace-nowrap block">Sistem Pendukung Keputusan</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-white hover:bg-[#2A4A75] hover:text-white"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-120px)]">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3 transition-colors',
                    isActive
                      ? 'bg-[#4F9CF9] text-white hover:bg-[#4F9CF9]/90'
                      : 'text-white/70 hover:bg-[#2A4A75] hover:text-white'
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Tagline */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2A4A75]">
          <p className="text-xs italic text-[#4F9CF9] text-center">
            Saya bangga jadi anak ibu dan bapak
          </p>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90 border-[#4F9CF9]"
      >
        <Menu size={20} />
      </Button>
    </>
  )
}
