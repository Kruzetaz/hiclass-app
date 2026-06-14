// components/SidebarWrapper.js
'use client'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'

export default function SidebarWrapper({ profile }) {
  const pathname = usePathname()

  const activeMap = {
    '/dashboard': 'dashboard',
    '/news':      'news',
    '/profile':   'profile',
    '/upgrade':   'upgrade',
    '/compare':   'compare',
    '/guide':     'guide',
    '/terms':     'terms',
  }

  const active = activeMap[pathname] ?? 'dashboard'

  return <Sidebar profile={profile} active={active} />
}