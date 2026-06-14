// components/Sidebar.js
'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function Sidebar({ profile, active }) {
  const router = useRouter()
  const supabase = createClient()

  const navMain = [
    { id: 'dashboard', label: 'ห้องเรียนของฉัน',   icon: '🏠', path: '/dashboard' },
    { id: 'news',      label: 'ประชาสัมพันธ์',       icon: '📢', path: '/news'      },
    { id: 'profile',   label: 'ข้อมูลส่วนตัว',       icon: '👤', path: '/profile'   },
    { id: 'upgrade',   label: 'สมัครแผน/เพิ่มห้อง', icon: '✨', path: '/upgrade'   },
  ]

  const navExtra = [
    { id: 'compare', label: 'เปรียบเทียบแผน',   icon: '📊', path: '/compare' },
    { id: 'guide',   label: 'คู่มือใช้งาน',      icon: '📖', path: '/guide',  newTab: true },
    { id: 'terms',   label: 'เงื่อนไขการใช้งาน', icon: '📄', path: '/terms'  },
  ]

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const storageUsed = 0
  const storageMax  = profile?.plan_id === 'free' ? 100 : 1000
  const storagePct  = Math.min(100, Math.round((storageUsed / storageMax) * 100))

  function NavBtn({ item }) {
    const isActive = active === item.id
    return (
      <button
        onClick={() => item.newTab ? window.open(item.path, '_blank') : router.push(item.path)}
        style={{
          display: 'flex', alignItems: 'center', gap: 9, width: '100%',
          padding: '9px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
          fontSize: 12, fontWeight: isActive ? 600 : 500, textAlign: 'left',
          background: isActive ? 'rgba(245,200,66,0.12)' : 'transparent',
          color: isActive ? '#f5c842' : '#9ca3af',
          transition: 'all 0.15s', marginBottom: 2, fontFamily: 'inherit',
          ...(isActive ? { boxShadow: 'inset 3px 0 0 #f5c842', paddingLeft: 13 } : {}),
        }}
        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#252b3b'; e.currentTarget.style.color = '#e2e8f0' } }}
        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9ca3af' } }}
      >
        <span style={{ fontSize: 14 }}>{item.icon}</span>
        {item.label}
        {item.newTab && <span style={{ fontSize: 9, color: '#4b5563', marginLeft: 'auto' }}>↗</span>}
      </button>
    )
  }

  return (
    <aside style={{
      width: 220, minWidth: 220, background: '#1a1f2e',
      display: 'flex', flexDirection: 'column', height: '100%',
      borderRight: '1px solid #252b3b',
    }}>

      {/* Logo */}
      <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid #252b3b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #f5c842, #e6a800)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, flexShrink: 0,
          }}>🏫</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#f5c842', lineHeight: 1.2 }}>Class Smart</div>
            <div style={{ fontSize: 10, color: '#6b7280', lineHeight: 1.2 }}>Teacher</div>
          </div>
        </div>
      </div>

      {/* Profile pill */}
      {profile && (
        <div style={{ margin: '12px 10px 0', padding: '10px 12px', borderRadius: 10, background: '#252b3b', border: '1px solid #2d3449' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg, #f5c842, #e6a800)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#1a1f2e', flexShrink: 0,
            }}>
              {(profile.full_name || 'T')[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {profile.full_name || 'คุณครู'}
              </div>
              <div style={{ marginTop: 2 }}>
                <span style={{
                  fontSize: 10, padding: '1px 6px', borderRadius: 99,
                  background: profile.plan_id === 'free' ? '#1a3a2a' : '#2d1f4e',
                  color: profile.plan_id === 'free' ? '#4ade80' : '#a78bfa',
                  fontWeight: 600,
                }}>
                  {profile.plan_id === 'free' ? 'ฟรี' : 'Pro'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px 0', overflowY: 'auto' }}>
        <div style={{ fontSize: 9, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, padding: '0 8px 6px' }}>
          เมนู
        </div>
        {navMain.map(item => <NavBtn key={item.id} item={item} />)}

        <div style={{ height: 1, background: '#252b3b', margin: '10px 0' }} />

        <div style={{ fontSize: 9, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, padding: '0 8px 6px' }}>
          ข้อมูล
        </div>
        {navExtra.map(item => <NavBtn key={item.id} item={item} />)}
      </nav>

      {/* Storage */}
      <div style={{ margin: '10px 10px 8px', padding: '10px 12px', borderRadius: 10, background: '#252b3b', border: '1px solid #2d3449' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 11 }}>🗄️</span>
            <span style={{ fontSize: 9, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              HICLASS STORAGE
            </span>
          </div>
          <span style={{ fontSize: 9, color: storagePct > 80 ? '#f87171' : '#6b7280', fontWeight: 600 }}>
            {storagePct}%
          </span>
        </div>
        <div style={{ height: 4, background: '#374151', borderRadius: 99 }}>
          <div style={{
            height: 4, borderRadius: 99, transition: 'width 0.4s ease',
            width: `${storagePct}%`,
            background: storagePct > 80
              ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
              : 'linear-gradient(90deg, #f5c842, #10b981)',
          }} />
        </div>
        {profile?.plan_id === 'free' && (
          <div style={{ marginTop: 8, fontSize: 9, color: '#4b5563', textAlign: 'center' }}>
            อัปเกรดเพื่อพื้นที่เพิ่มเติม{' '}
            <span onClick={() => router.push('/upgrade')}
              style={{ color: '#f5c842', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>
              สมัคร Pro
            </span>
          </div>
        )}
      </div>

      {/* Logout */}
      <div style={{ borderTop: '1px solid #252b3b' }}>
        <button onClick={logout} style={{
          display: 'flex', alignItems: 'center', gap: 9, width: '100%',
          padding: '12px 18px', border: 'none', cursor: 'pointer', background: 'transparent',
          fontSize: 12, fontWeight: 500, color: '#ef4444', transition: 'background 0.15s', fontFamily: 'inherit',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          <span>🚪</span> ออกจากระบบ
        </button>
      </div>
    </aside>
  )
}