'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

// ─── AddRoomModal ─────────────────────────────────────────────
function AddRoomModal({ onClose, onCreate }) {
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
      backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
      animation: 'fadeIn 0.15s ease',
    }}>
      <div style={{
        background: '#ffffff', borderRadius: 16, padding: 24, width: 380,
        border: '1px solid #e5e7eb', boxShadow: '0 25px 60px rgba(0,0,0,0.15)',
        animation: 'slideUp 0.2s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>เพิ่มห้องเรียนใหม่</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 18 }}>✕</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, display: 'block', marginBottom: 6 }}>ชื่อห้อง *</label>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="เช่น ป.2, ม.1/1" autoFocus
              onKeyDown={e => e.key === 'Enter' && name && onCreate(name, subject)}
              style={inputStyleLight} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              ชื่อวิชา <span style={{ color: '#d1d5db', fontWeight: 400 }}>(ไม่บังคับ)</span>
            </label>
            <input value={subject} onChange={e => setSubject(e.target.value)}
              placeholder="เช่น คณิตศาสตร์, ภาษาไทย"
              style={inputStyleLight} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          <button onClick={onClose} style={{ ...btnLight, flex: 1 }}>ยกเลิก</button>
          <button onClick={() => name && onCreate(name, subject)} disabled={!name}
            style={{ ...btnGold, flex: 1, opacity: name ? 1 : 0.5 }}>
            + สร้างห้องเรียน
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Shared styles ────────────────────────────────────────────
const inputStyleLight = {
  width: '100%', padding: '9px 12px', borderRadius: 8, fontSize: 13,
  background: '#f9fafb', border: '1.5px solid #e5e7eb', color: '#111827',
  outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  transition: 'border-color 0.15s',
}
const btnGold = {
  padding: '9px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
  fontSize: 12, fontWeight: 700, color: '#1a1f2e',
  background: 'linear-gradient(135deg, #f5c842, #e6a800)',
  boxShadow: '0 4px 14px rgba(245,200,66,0.35)',
  transition: 'all 0.15s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
}
const btnLight = {
  padding: '9px 18px', borderRadius: 8, cursor: 'pointer',
  fontSize: 12, fontWeight: 600, color: '#6b7280',
  background: '#f4f5f7', border: '1px solid #e5e7eb',
  transition: 'all 0.15s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
}

// ─── Room Card ────────────────────────────────────────────────
const ROOM_EMOJIS  = ['📚','🔬','🎨','🌏','🔢','🎵','💻','🌱']
const ROOM_ACCENTS = ['#4f7ef5','#10b981','#ec4899','#8b5cf6','#f59e0b','#06b6d4','#ef4444','#84cc16']
const ROOM_BG      = ['#eff4ff','#ecfdf5','#fdf2f8','#f5f3ff','#fffbeb','#ecfeff','#fef2f2','#f7fee7']

function RoomCard({ room, index, onClick }) {
  const [hover, setHover] = useState(false)
  const accent  = ROOM_ACCENTS[index % ROOM_ACCENTS.length]
  const bgLight = ROOM_BG[index % ROOM_BG.length]
  const emoji   = ROOM_EMOJIS[index % ROOM_EMOJIS.length]

  return (
    <div onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? '#fafbff' : '#ffffff',
        border: `1px solid ${hover ? accent : '#e8eaed'}`,
        borderRadius: 14, padding: '18px 20px', cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: hover ? 'translateY(-3px)' : 'none',
        boxShadow: hover ? `0 8px 24px rgba(0,0,0,0.08), 0 0 0 2px ${accent}25` : '0 1px 4px rgba(0,0,0,0.05)',
        animation: `slideUp 0.25s ease ${index * 0.06}s both`,
      }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 10, fontSize: 20,
          background: bgLight, border: `1px solid ${accent}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{emoji}</div>
        <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 99, fontWeight: 700, background: '#ecfdf5', color: '#059669', border: '1px solid #bbf7d0' }}>ฟรี</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 4 }}>{room.name}</div>
      <div style={{ fontSize: 11, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 4 }}>
        <span>📖</span> {room.subject || 'เช็คชื่อประจำวัน'}
      </div>
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: accent, fontWeight: 600 }}>เปิดห้องเรียน</span>
        <span style={{ fontSize: 16, color: accent, transition: 'transform 0.15s', transform: hover ? 'translateX(3px)' : 'none' }}>→</span>
      </div>
    </div>
  )
}

// ─── Dashboard Page ───────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState(null)
  const [rooms, setRooms] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const [{ data: prof }, { data: roomData }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('rooms').select('*').eq('owner_id', user.id).eq('is_archived', false).order('created_at'),
      ])
      setProfile(prof)
      setRooms(roomData || [])
      setLoading(false)
    }
    load()
  }, [])

  async function createRoom(name, subject) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('rooms').insert({ owner_id: user.id, name, subject }).select().single()
    if (data) setRooms(r => [...r, data])
    setShowAdd(false)
  }

  if (loading) return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f4f5f7', color: '#6b7280', fontSize: 14, gap: 8 }}>
      <span style={{ fontSize: 20 }}>⏳</span> กำลังโหลด...
    </div>
  )

  const maxRooms = profile?.plan_id === 'free' ? 3 : 999
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'อรุณสวัสดิ์' : hour < 17 ? 'สวัสดีตอนบ่าย' : 'สวัสดีตอนเย็น'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Noto Sans Thai', sans-serif; }
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .add-room-btn:hover { background: #f0f4ff !important; border-color: #4f7ef5 !important; }
        .add-room-btn:hover .plus-icon { color: #4f7ef5 !important; }
        .add-room-btn:hover .plus-label { color: #4f7ef5 !important; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.08) !important; }
        input:focus { border-color: #f5c842 !important; box-shadow: 0 0 0 3px rgba(245,200,66,0.12) !important; }
      `}</style>

      <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* Topbar */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          background: '#ffffff', borderBottom: '1px solid #e9eaec',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '11px 24px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 18 }}>👋</span>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>{greeting}ครับ</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>คุณครู {profile?.full_name}</span>
          <div style={{ marginLeft: 'auto' }}>
            <div style={{
              fontSize: 11, padding: '4px 12px', borderRadius: 99,
              background: 'rgba(245,200,66,0.1)', color: '#b45309',
              border: '1px solid rgba(245,200,66,0.3)', fontWeight: 600,
            }}>
              {new Date().toLocaleDateString('th-TH', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

        <div style={{ padding: '24px', flex: 1 }}>

          {/* Hero Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1f2e 0%, #252d42 60%, #1f2a1a 100%)',
            borderRadius: 16, padding: '24px 28px', marginBottom: 22,
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)', animation: 'slideUp 0.3s ease',
          }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 130, height: 130, borderRadius: '50%', background: 'rgba(245,200,66,0.06)', border: '1px solid rgba(245,200,66,0.12)' }} />
            <div style={{ position: 'absolute', bottom: -25, right: 70, width: 80, height: 80, borderRadius: '50%', background: 'rgba(245,200,66,0.04)' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              <div>
                <div style={{ fontSize: 10, color: '#f5c842', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>📌 ภาพรวมระบบ</div>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 8, lineHeight: 1.3 }}>
                  {greeting}ครับ คุณครู{profile?.full_name ? ` ${profile.full_name.split(' ')[0]}` : ''} 🎯
                </h1>
                <p style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.6 }}>
                  คุณมี <span style={{ color: '#f5c842', fontWeight: 700 }}>{rooms.length} ห้องเรียน</span> ที่กำลังใช้งาน
                  {rooms.length < maxRooms && maxRooms !== 999 && (
                    <> · เพิ่มได้อีก <span style={{ color: '#4ade80', fontWeight: 700 }}>{maxRooms - rooms.length} ห้อง</span></>
                  )}
                </p>
              </div>
              <button onClick={() => setShowAdd(true)}
                style={{ ...btnGold, padding: '10px 22px', fontSize: 13, whiteSpace: 'nowrap' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(245,200,66,0.5)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(245,200,66,0.35)' }}
              >
                + เพิ่มห้องเรียน
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24, animation: 'slideUp 0.35s ease 0.05s both' }}>
            {[
              { label: 'รวมห้องเรียน',  val: rooms.length,                                           icon: '🏫', accent: '#b45309', iconBg: '#fef9ec', border: '#fde68a' },
              { label: 'ห้องธรรมดา',   val: `${rooms.length}/${maxRooms === 999 ? '∞' : maxRooms}`, icon: '🏠', accent: '#1d4ed8', iconBg: '#eff6ff', border: '#bfdbfe' },
              { label: 'ห้องโควตา',    val: profile?.extra_rooms || 0,                               icon: '⭐', accent: '#7c3aed', iconBg: '#f5f3ff', border: '#ddd6fe' },
              { label: 'แผนปัจจุบัน', val: profile?.plan_id === 'free' ? 'ฟรี' : 'Pro',             icon: '💎', accent: '#059669', iconBg: '#ecfdf5', border: '#a7f3d0' },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{
                background: '#ffffff', border: `1px solid ${s.border}`,
                borderRadius: 12, padding: '16px 18px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.2s ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{s.icon}</div>
                  <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>{s.label}</span>
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.accent }}>{s.val}</div>
              </div>
            ))}
          </div>

          {/* Room List Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, animation: 'slideUp 0.35s ease 0.1s both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>🚪</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>ห้องเรียนของฉัน</span>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>({rooms.length} ห้อง)</span>
            </div>
            {rooms.length > 0 && (
              <button onClick={() => setShowAdd(true)}
                style={{ ...btnLight, fontSize: 11, padding: '6px 14px' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#f5c842'; e.currentTarget.style.color = '#b45309'; e.currentTarget.style.background = '#fffbeb' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.background = '#f4f5f7' }}
              >+ เพิ่มห้อง</button>
            )}
          </div>

          {/* Rooms Grid */}
          {rooms.length === 0 ? (
            <div style={{
              background: '#ffffff', border: '1.5px dashed #d1d5db', borderRadius: 16,
              padding: '50px 24px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              animation: 'slideUp 0.35s ease 0.15s both',
            }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>🏫</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#374151', marginBottom: 6 }}>ยังไม่มีห้องเรียน</div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 20 }}>กดปุ่มด้านล่างเพื่อสร้างห้องเรียนแรกของคุณ</div>
              <button onClick={() => setShowAdd(true)} style={{ ...btnGold, padding: '10px 24px' }}>+ สร้างห้องเรียนแรก</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
              {rooms.map((room, i) => (
                <RoomCard key={room.id} room={room} index={i} onClick={() => router.push(`/room/${room.id}`)} />
              ))}
              {rooms.length < maxRooms && (
                <button className="add-room-btn" onClick={() => setShowAdd(true)} style={{
                  background: 'transparent', border: '2px dashed #d1d5db', borderRadius: 14,
                  padding: '18px 20px', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                  minHeight: 140, transition: 'all 0.2s',
                }}>
                  <div className="plus-icon" style={{ fontSize: 26, color: '#d1d5db', transition: 'color 0.2s' }}>+</div>
                  <span className="plus-label" style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500, transition: 'color 0.2s' }}>เพิ่มห้องเรียนใหม่</span>
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {showAdd && <AddRoomModal onClose={() => setShowAdd(false)} onCreate={createRoom} />}
    </>
  )
}