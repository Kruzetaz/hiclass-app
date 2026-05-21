'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase'

const btnGold = {
  padding: '9px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
  fontSize: 12, fontWeight: 700, color: '#1a1f2e',
  background: 'linear-gradient(135deg, #f5c842, #e6a800)',
  boxShadow: '0 4px 14px rgba(245,200,66,0.35)',
  transition: 'all 0.15s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  fontFamily: 'inherit',
}

function Sidebar({ profile, active }) {
  const router = useRouter()
  const supabase = createClient()

  const nav = [
    { id: 'dashboard', label: 'ห้องเรียนของฉัน', icon: '🏠' },
    { id: 'news',      label: 'ประชาสัมพันธ์',    icon: '📢' },
    { id: 'profile',   label: 'ข้อมูลส่วนตัว',    icon: '👤' },
    { id: 'upgrade',   label: 'สมัครแผน',          icon: '✨' },
  ]

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside style={{
      width: 220, minWidth: 220, background: '#1a1f2e',
      display: 'flex', flexDirection: 'column', height: '100%',
      borderRight: '1px solid #252b3b',
    }}>
      <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid #252b3b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #f5c842, #e6a800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🏫</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#f5c842', lineHeight: 1.2 }}>Class Smart</div>
            <div style={{ fontSize: 10, color: '#6b7280', lineHeight: 1.2 }}>Teacher</div>
          </div>
        </div>
      </div>

      {profile && (
        <div style={{ margin: '12px 10px 0', padding: '10px 12px', borderRadius: 10, background: '#252b3b', border: '1px solid #2d3449' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #f5c842, #e6a800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#1a1f2e', flexShrink: 0 }}>
              {(profile.full_name || 'T')[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {profile.full_name || 'คุณครู'}
              </div>
              <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 99, background: '#1a3a2a', color: '#4ade80', fontWeight: 600 }}>
                {profile.plan_id === 'free' ? 'ฟรี' : 'Pro'}
              </span>
            </div>
          </div>
        </div>
      )}

      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <div style={{ fontSize: 9, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, padding: '0 8px 6px' }}>เมนู</div>
        {nav.map(item => {
          const isActive = active === item.id
          return (
            <button key={item.id}
              onClick={() => router.push(`/${item.id}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: 9, width: '100%',
                padding: '9px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: isActive ? 600 : 500, textAlign: 'left',
                background: isActive ? 'rgba(245,200,66,0.12)' : 'transparent',
                color: isActive ? '#f5c842' : '#9ca3af',
                transition: 'all 0.15s', marginBottom: 2, fontFamily: 'inherit',
                ...(isActive ? { boxShadow: 'inset 3px 0 0 #f5c842', paddingLeft: 13 } : {}),
              }}>
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>

      <div style={{ margin: '0 10px 8px', padding: '10px 12px', borderRadius: 10, background: '#252b3b', border: '1px solid #2d3449' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 9, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Storage</span>
          <span style={{ fontSize: 9, color: '#6b7280' }}>0%</span>
        </div>
        <div style={{ height: 3, background: '#374151', borderRadius: 99 }}>
          <div style={{ height: 3, width: '0%', background: '#f5c842', borderRadius: 99 }} />
        </div>
      </div>

      <div style={{ borderTop: '1px solid #252b3b' }}>
        <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '12px 18px', border: 'none', cursor: 'pointer', background: 'transparent', fontSize: 12, fontWeight: 500, color: '#ef4444', transition: 'background 0.15s', fontFamily: 'inherit' }}>
          <span>🚪</span> ออกจากระบบ
        </button>
      </div>
    </aside>
  )
}

export default function UpgradePage() {
  const [selected, setSelected] = useState('pro_yearly')
  const [profile, setProfile] = useState(null)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
    }
    load()
  }, [])

  const plans = [
    {
      id: 'free', name: 'แพลนฟรี', price: 0, period: '', color: '#6b7280', badge: null,
      features: [
        { text: 'ห้องเรียน 3 ห้อง', ok: true },
        { text: 'นักเรียนสูงสุด 50 คน/ห้อง', ok: true },
        { text: 'เช็คชื่อ อาหาร แปรงฟัน ดื่มนม ออมเงิน', ok: true },
        { text: 'ข้อมูลเดือนปัจจุบัน', ok: true },
        { text: 'Export รายงาน', ok: false },
        { text: 'ประวัติย้อนหลังไม่จำกัด', ok: false },
      ]
    },
    {
      id: 'pro_monthly', name: 'Pro รายเดือน', price: 89, period: '/เดือน', color: '#3b82f6', badge: null,
      features: [
        { text: 'ห้องเรียนไม่จำกัด', ok: true },
        { text: 'นักเรียนสูงสุด 50 คน/ห้อง', ok: true },
        { text: 'เช็คชื่อ อาหาร แปรงฟัน ดื่มนม ออมเงิน', ok: true },
        { text: 'ประวัติย้อนหลัง 30 วัน', ok: true },
        { text: 'Export รายงาน Excel/PDF', ok: true },
        { text: 'ประวัติย้อนหลังไม่จำกัด', ok: false },
      ]
    },
    {
      id: 'pro_yearly', name: 'Pro รายปี', price: 890, period: '/ปี', color: '#f5c842', badge: 'ประหยัดกว่า 17%',
      features: [
        { text: 'ห้องเรียนไม่จำกัด', ok: true },
        { text: 'นักเรียนสูงสุด 50 คน/ห้อง', ok: true },
        { text: 'เช็คชื่อ อาหาร แปรงฟัน ดื่มนม ออมเงิน', ok: true },
        { text: 'ประวัติย้อนหลังไม่จำกัด', ok: true },
        { text: 'Export รายงาน Excel/PDF', ok: true },
        { text: 'Priority Support', ok: true },
      ]
    },
    {
      id: 'quota', name: 'โควตาห้อง', price: 99, period: '/ห้อง', color: '#a78bfa', badge: 'ซื้อเพิ่มทีละห้อง',
      features: [
        { text: 'เพิ่มห้องเรียน 1 ห้อง', ok: true },
        { text: 'นักเรียนสูงสุด 50 คน/ห้อง', ok: true },
        { text: 'ฟีเจอร์ครบทุกอย่าง', ok: true },
        { text: 'ประวัติไม่จำกัด', ok: true },
        { text: 'Export รายงาน', ok: true },
        { text: 'เหมาะสำหรับผู้ใช้แพลนฟรี', ok: true },
      ]
    },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Noto Sans Thai', sans-serif; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .plan-card { transition: all 0.2s; cursor: pointer; }
        .plan-card:hover { transform: translateY(-4px); }
      `}</style>

      <div style={{ display: 'flex', height: '100vh', background: '#f4f5f7', overflow: 'hidden', fontFamily: 'Noto Sans Thai, sans-serif' }}>
        <Sidebar profile={profile} active="upgrade" />

        <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

          {/* Topbar */}
          <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#ffffff', borderBottom: '1px solid #e9eaec', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '11px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16 }}>💎</span>
            <div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>Class Smart Teacher</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>สมัครแผน</div>
            </div>
          </div>

          <div style={{ flex: 1, padding: '24px', maxWidth: 1000, margin: '0 auto', width: '100%' }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 32, animation: 'slideUp 0.3s ease' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>💎</div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 8 }}>เลือกแพลนที่เหมาะกับคุณ</h1>
              <p style={{ fontSize: 13, color: '#6b7280' }}>ยกเลิกได้ทุกเมื่อ ไม่มีค่าใช้จ่ายแอบแฝง</p>
            </div>

            {/* Plan Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28, animation: 'slideUp 0.3s ease 0.05s both' }}>
              {plans.map(plan => (
                <div key={plan.id} className="plan-card"
                  onClick={() => setSelected(plan.id)}
                  style={{
                    background: selected === plan.id ? '#1a1f2e' : 'white',
                    border: `2px solid ${selected === plan.id ? plan.color : '#e5e7eb'}`,
                    borderRadius: 16, padding: '22px 18px', position: 'relative',
                    boxShadow: selected === plan.id ? '0 8px 32px rgba(0,0,0,0.2)' : '0 1px 4px rgba(0,0,0,0.05)',
                  }}>

                  {plan.badge && (
                    <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: plan.color, color: plan.id === 'pro_yearly' ? '#1a1f2e' : 'white', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                      {plan.badge}
                    </div>
                  )}

                  <div style={{ fontSize: 13, fontWeight: 700, color: selected === plan.id ? plan.color : '#374151', marginBottom: 10 }}>{plan.name}</div>

                  <div style={{ marginBottom: 18 }}>
                    <span style={{ fontSize: 32, fontWeight: 800, color: selected === plan.id ? '#f1f5f9' : '#111827' }}>
                      {plan.price === 0 ? 'ฟรี' : `฿${plan.price.toLocaleString()}`}
                    </span>
                    {plan.period && <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 3 }}>{plan.period}</span>}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {plan.features.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 11 }}>
                        <span style={{ color: f.ok ? plan.color : '#4b5563', flexShrink: 0, marginTop: 1 }}>{f.ok ? '✓' : '✗'}</span>
                        <span style={{ color: selected === plan.id ? (f.ok ? '#d1d5db' : '#4b5563') : (f.ok ? '#374151' : '#9ca3af'), textDecoration: f.ok ? 'none' : 'line-through' }}>
                          {f.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {selected === plan.id && (
                    <div style={{ marginTop: 14, textAlign: 'center', fontSize: 11, color: plan.color, fontWeight: 600 }}>✓ เลือกแพลนนี้</div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA */}
            {selected !== 'free' ? (
              <div style={{ background: '#1a1f2e', border: '1px solid #252b3b', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, animation: 'slideUp 0.3s ease 0.1s both' }}>
                <div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 3 }}>แพลนที่เลือก</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>{plans.find(p => p.id === selected)?.name}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#f5c842', marginTop: 3 }}>
                    ฿{plans.find(p => p.id === selected)?.price.toLocaleString()}
                    <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 400 }}>{plans.find(p => p.id === selected)?.period}</span>
                  </div>
                </div>
                <button style={{ ...btnGold, padding: '14px 28px', fontSize: 14 }}>💳 ชำระเงิน</button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <p style={{ color: '#6b7280', fontSize: 13 }}>คุณกำลังใช้แพลนฟรีอยู่แล้วครับ 😊</p>
                <button onClick={() => router.push('/dashboard')} style={{ color: '#f5c842', background: 'none', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', marginTop: 8 }}>
                  กลับหน้าหลัก →
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}