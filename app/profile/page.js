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
        <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '12px 18px', border: 'none', cursor: 'pointer', background: 'transparent', fontSize: 12, fontWeight: 500, color: '#ef4444', fontFamily: 'inherit' }}>
          <span>🚪</span> ออกจากระบบ
        </button>
      </div>
    </aside>
  )
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({ full_name: '', nickname: '', phone: '', school_name: '', district: '', province: '' })
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      setForm({
        full_name: data?.full_name || '',
        nickname: data?.nickname || '',
        phone: data?.phone || '',
        school_name: data?.school_name || '',
        district: data?.district || '',
        province: data?.province || '',
      })
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('profiles').update({ ...form, updated_at: new Date().toISOString() }).eq('id', user.id)
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function update(field, value) { setForm(prev => ({ ...prev, [field]: value })); setSaved(false) }

  const fields = [
    { key: 'full_name',   label: 'ชื่อ-นามสกุล',  placeholder: 'ครูสมใจ ใจดี',         icon: '👤', required: true,  span: 2 },
    { key: 'nickname',    label: 'ชื่อเล่น',        placeholder: 'ครูใจ',                 icon: '😊', required: false, span: 1 },
    { key: 'phone',       label: 'เบอร์โทรศัพท์',  placeholder: '08x-xxx-xxxx',          icon: '📱', required: false, span: 1 },
    { key: 'school_name', label: 'ชื่อโรงเรียน',   placeholder: 'โรงเรียนบ้านสุขสันต์', icon: '🏫', required: false, span: 2 },
    { key: 'district',    label: 'อำเภอ/เขต',       placeholder: 'เมือง',                 icon: '📍', required: false, span: 1 },
    { key: 'province',    label: 'จังหวัด',          placeholder: 'เชียงใหม่',             icon: '🗺️', required: false, span: 1 },
  ]

  if (loading) return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f4f5f7', color: '#6b7280', fontSize: 14, gap: 8 }}>
      <span style={{ fontSize: 20 }}>⏳</span> กำลังโหลด...
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Noto Sans Thai', sans-serif; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .field-input { background: #f9fafb; border: 1.5px solid #e5e7eb; border-radius: 8px; padding: 9px 12px; font-size: 13px; color: #111827; outline: none; width: 100%; font-family: inherit; transition: border-color 0.15s; }
        .field-input:focus { border-color: #f5c842; box-shadow: 0 0 0 3px rgba(245,200,66,0.12); }
      `}</style>

      <div style={{ display: 'flex', height: '100vh', background: '#f4f5f7', overflow: 'hidden', fontFamily: 'Noto Sans Thai, sans-serif' }}>
        <Sidebar profile={profile} active="profile" />

        <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

          {/* Topbar */}
          <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#ffffff', borderBottom: '1px solid #e9eaec', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '11px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 16 }}>👤</span>
              <div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>Class Smart Teacher</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>ข้อมูลส่วนตัว</div>
              </div>
            </div>
            <button onClick={handleSave} disabled={saving} style={{
              ...btnGold, padding: '8px 20px',
              background: saved ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #f5c842, #e6a800)',
              color: saved ? 'white' : '#1a1f2e',
            }}>
              {saving ? '⏳ กำลังบันทึก...' : saved ? '✅ บันทึกแล้ว!' : '💾 บันทึก'}
            </button>
          </div>

          <div style={{ flex: 1, padding: '24px', maxWidth: 800, margin: '0 auto', width: '100%' }}>

            {/* Profile Header */}
            <div style={{ background: 'linear-gradient(135deg, #1a1f2e, #252d42)', borderRadius: 16, padding: '24px 28px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20, animation: 'slideUp 0.3s ease', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #f5c842, #e6a800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0, boxShadow: '0 4px 16px rgba(245,200,66,0.4)' }}>
                {(form.full_name || 'T')[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{form.full_name || 'คุณครู'}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>{form.school_name || 'ยังไม่ได้ระบุโรงเรียน'}</div>
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'rgba(245,200,66,0.15)', color: '#f5c842', border: '1px solid rgba(245,200,66,0.3)', fontWeight: 600 }}>
                  {profile?.plan_id === 'free' ? 'แพลนฟรี' : 'Pro'}
                </span>
              </div>
              <button onClick={() => router.push('/upgrade')} style={{ ...btnGold, padding: '10px 18px', whiteSpace: 'nowrap' }}>
                ⬆️ อัปเกรด
              </button>
            </div>

            {/* Form Card */}
            <div style={{ background: '#ffffff', border: '1px solid #e9eaec', borderRadius: 16, padding: '24px 28px', marginBottom: 20, animation: 'slideUp 0.3s ease 0.05s both', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                ✏️ แก้ไขข้อมูล
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {fields.map(f => (
                  <div key={f.key} style={{ gridColumn: `span ${f.span}` }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {f.icon} {f.label} {f.required && <span style={{ color: '#f5c842' }}>*</span>}
                    </label>
                    <input className="field-input" type="text" value={form[f.key]}
                      onChange={e => update(f.key, e.target.value)}
                      placeholder={f.placeholder} />
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button onClick={handleSave} disabled={saving} style={{
              width: '100%', padding: '14px', borderRadius: 12, border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
              background: saved ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #f5c842, #e6a800)',
              color: saved ? 'white' : '#1a1f2e',
              boxShadow: '0 4px 14px rgba(245,200,66,0.3)', transition: 'all 0.2s',
            }}>
              {saving ? '⏳ กำลังบันทึก...' : saved ? '✅ บันทึกสำเร็จ!' : '💾 บันทึกข้อมูล'}
            </button>
          </div>
        </main>
      </div>
    </>
  )
}