'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/alternatif', label: 'Alternatif' },
  { href: '/kriteria', label: 'Kriteria' },
  { href: '/bobot', label: 'Bobot' },
  { href: '/saw', label: 'SAW' },
  { href: '/smart', label: 'SMART' },
  { href: '/profile-matching', label: 'Profile Matching' },
  { href: '/goal-programming', label: 'Goal Programming' },
  { href: '/perbandingan', label: 'Perbandingan' },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-[#1E3A5F] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#4F9CF9] rounded-lg flex items-center justify-center font-bold text-white">
              SPK
            </div>
            <span className="text-xl font-bold">SPK Smartphone</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? 'default' : 'ghost'}
                  className={
                    pathname === item.href
                      ? 'bg-[#4F9CF9] text-white hover:bg-[#4F9CF9]/90'
                      : 'text-white hover:bg-[#2A4A75] hover:text-white'
                  }
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-[#2A4A75] focus:outline-none"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={pathname === item.href ? 'default' : 'ghost'}
                    className={`w-full justify-start ${
                      pathname === item.href
                        ? 'bg-[#4F9CF9] text-white hover:bg-[#4F9CF9]/90'
                        : 'text-white hover:bg-[#2A4A75] hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Tagline */}
        <div className="text-right">
          <p className="text-xs italic text-[#4F9CF9]">Saya bangga jadi anak ibu dan bapak</p>
        </div>
      </div>
    </nav>
  )
}
