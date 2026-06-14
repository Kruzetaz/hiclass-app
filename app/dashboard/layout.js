// app/dashboard/layout.js
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import SidebarWrapper from '@/components/SidebarWrapper'

export default async function DashboardLayout({ children }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <SidebarWrapper profile={profile} />
      <main style={{ flex: 1, overflowY: 'auto', background: '#f9fafb' }}>
        {children}
      </main>
    </div>
  )
}