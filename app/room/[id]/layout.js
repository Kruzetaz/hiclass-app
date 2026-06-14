// app/room/[id]/layout.js
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import RoomSidebarWrapper from '@/components/RoomSidebarWrapper'

export default async function RoomLayout({ children, params }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: room }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('rooms').select('*').eq('id', id).single(),
  ])

  if (!room) redirect('/dashboard')

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <RoomSidebarWrapper profile={profile} room={room} />
      <main style={{ flex: 1, overflowY: 'auto', background: '#f4f5f7' }}>
        {children}
      </main>
    </div>
  )
}