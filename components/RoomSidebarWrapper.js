// components/RoomSidebarWrapper.js
'use client'
import { usePathname } from 'next/navigation'
import RoomSidebar from './RoomSidebar'

export default function RoomSidebarWrapper({ profile, room }) {
  const pathname = usePathname()

  // map pathname → active id
  // เช่น /room/abc123/attendance → 'attendance'
  const segment = pathname.split('/')[3] ?? 'home'

  return <RoomSidebar profile={profile} room={room} active={segment} />
}