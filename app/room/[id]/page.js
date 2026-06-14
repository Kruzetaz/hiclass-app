'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../../../lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

const MENUS = [
  { icon: '✅', label: 'เช็คชื่อ',        key: 'attendance', color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.2)'  },
  { icon: '🍱', label: 'อาหารกลางวัน',   key: 'food',       color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.2)'  },
  { icon: '🪥', label: 'แปรงฟัน',         key: 'tooth',      color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.2)'  },
  { icon: '🥛', label: 'ดื่มนม',           key: 'milk',       color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.2)'  },
  { icon: '💰', label: 'ออมเงิน',          key: 'savings',    color: '#f5c842', bg: 'rgba(245,200,66,0.1)',  border: 'rgba(245,200,66,0.25)' },
  { icon: '👥', label: 'รายชื่อนักเรียน', key: 'students',   color: '#6b7280', bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.2)' },
]

const AVATAR_COLORS = ['#6C5CE7','#10b981','#e17055','#f59e0b','#3b82f6','#8b5cf6','#ec4899','#06b6d4']

export default function RoomPage() {
  const [room, setRoom] = useState(null)
  const [students, setStudents] = useState([])
  const [quickStats, setQuickStats] = useState({ attendance: null, food: null, savings: null })
  const [loading, setLoading] = useState(true)
  const [hoveredMenu, setHoveredMenu] = useState(null)
  const router = useRouter()
  const params = useParams()
  const roomId = params.id

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const todayStr = new Date().toISOString().split('T')[0]

    const [
      { data: roomData },
      { data: studs },
      { data: attendanceData },
      { data: foodData },
      { data: savingsData },
    ] = await Promise.all([
      supabase.from('rooms').select('*').eq('id', roomId).single(),
      supabase.from('students').select('*').eq('room_id', roomId).eq('is_active', true),
      supabase.from('attendance')
        .select('id', { count: 'exact' })
        .eq('room_id', roomId)
        .eq('date', todayStr)
        .eq('status', 'present'),
      supabase.from('food_records')
        .select('id', { count: 'exact' })
        .eq('room_id', roomId)
        .eq('date', todayStr),
      supabase.from('savings')
        .select('deposit, withdraw')   // ✅ แก้จาก amount
        .eq('room_id', roomId),
    ])

    setRoom(roomData)
    const sorted = (studs || []).sort((a, b) => (a.seat_number ?? 9999) - (b.seat_number ?? 9999))
    setStudents(sorted)

    // ✅ แก้สูตรคำนวณ
    const totalSavings = (savingsData || []).reduce(
      (sum, r) => sum + (r.deposit || 0) - (r.withdraw || 0), 0
    )

    setQuickStats({
      attendance: attendanceData?.length ?? 0,
      food: foodData?.length ?? 0,
      savings: totalSavings,
    })

    setLoading(false)
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f5f7', fontFamily: 'Noto Sans Thai, sans-serif', minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9ca3af', fontSize: 14 }}>
        <span style={{ fontSize: 20 }}>⏳</span> กำลังโหลด...
      </div>
    </div>
  )

  const today = new Date().toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const formatSavings = (val) => {
    if (val === null) return '—'
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`
    return `${val} ฿`
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Noto Sans Thai', sans-serif; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .menu-card { border-radius: 14px; padding: 20px 16px; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; gap: 10px; text-decoration: none; }
        .menu-card:hover { transform: translateY(-3px); }
        .stu-row { display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-bottom: 1px solid #f3f4f6; transition: background 0.1s; }
        .stu-row:hover { background: #fafafa; }
        .stu-row:last-child { border-bottom: none; }
      `}</style>

      {/* ✅ แก้ wrapper — เอา minHeight: 100vh ออก เปลี่ยนเป็น minHeight: 100% */}
      <div style={{ background: '#f4f5f7', fontFamily: 'Noto Sans Thai, sans-serif', minHeight: '100%' }}>

        {/* ── Header ── */}
        <div style={{ background: 'linear-gradient(135deg, #1a1f2e 0%, #252d42 100%)', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
          {/* ✅ ลบปุ่ม ← กลับ ออกแล้ว เหลือแค่ชื่อห้องและปุ่มจัดการนักเรียน */}
          <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #252b3b' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{room?.name}</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>
                {room?.subject || 'เช็คชื่อประจำวัน'} · {students.length} คน
              </div>
            </div>
            <Link href={`/room/${roomId}/students`} style={{
              background: 'linear-gradient(135deg, #f5c842, #e6a800)',
              border: 'none', borderRadius: 8, padding: '6px 14px',
              color: '#1a1f2e', fontSize: 11, fontWeight: 700, textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 4,
              boxShadow: '0 3px 10px rgba(245,200,66,0.35)',
            }}>👥 จัดการนักเรียน</Link>
          </div>

          {/* Stats strip */}
          <div style={{ padding: '14px 20px 16px', display: 'flex', gap: 16, alignItems: 'center' }}>
            {[
              { label: 'นักเรียนทั้งหมด', val: students.length, icon: '👥', color: '#f5c842' },
              { label: 'วันนี้', val: today, icon: '📅', color: '#a5b4fc', small: true },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: s.small ? 11 : 18, fontWeight: 700, color: s.color, lineHeight: 1.2 }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: '#4b5563' }}>{s.label}</div>
                </div>
                {i < 1 && <div style={{ width: 1, height: 28, background: '#252b3b', marginLeft: 8 }} />}
              </div>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 16px' }}>

          {/* ── เมนูกิจกรรม ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <span style={{ fontSize: 14 }}>⚡</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>เลือกกิจกรรม</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
            {MENUS.map((menu, i) => (
              <Link key={i} href={`/room/${roomId}/${menu.key}`}
                className="menu-card"
                onMouseEnter={() => setHoveredMenu(i)}
                onMouseLeave={() => setHoveredMenu(null)}
                style={{
                  background: '#ffffff',
                  border: `1px solid ${hoveredMenu === i ? menu.color : '#e8eaed'}`,
                  boxShadow: hoveredMenu === i
                    ? `0 8px 24px rgba(0,0,0,0.08), 0 0 0 2px ${menu.border}`
                    : '0 1px 4px rgba(0,0,0,0.05)',
                  animation: `slideUp 0.25s ease ${i * 0.05}s both`,
                }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: menu.bg, border: `1px solid ${menu.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22,
                  transform: hoveredMenu === i ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.2s',
                }}>{menu.icon}</div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#374151', textAlign: 'center', lineHeight: 1.3 }}>
                  {menu.label}
                </span>
              </Link>
            ))}
          </div>

          {/* ── Quick Stats ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
            {[
              {
                label: 'เช็คชื่อวันนี้',
                val: quickStats.attendance === null ? '—' : `${quickStats.attendance}/${students.length}`,
                color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0',
              },
              {
                label: 'รับอาหารแล้ว',
                val: quickStats.food === null ? '—' : `${quickStats.food}/${students.length}`,
                color: '#f59e0b', bg: '#fffbeb', border: '#fde68a',
              },
              {
                label: 'ออมเงินรวม',
                val: formatSavings(quickStats.savings),
                color: '#f5c842', bg: '#fef9ec', border: '#fde68a',
              },
            ].map((s, i) => (
              <div key={i} style={{
                background: s.bg, border: `1px solid ${s.border}`,
                borderRadius: 10, padding: '10px 12px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── รายชื่อนักเรียน ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14 }}>👤</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>รายชื่อนักเรียน</span>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>({students.length} คน)</span>
            </div>
            <Link href={`/room/${roomId}/students`} style={{ fontSize: 11, color: '#f5c842', fontWeight: 700, textDecoration: 'none' }}>
              จัดการทั้งหมด →
            </Link>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e8eaed', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            {students.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>👤</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>ยังไม่มีนักเรียน</div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 14 }}>เพิ่มนักเรียนเพื่อเริ่มใช้งาน</div>
                <Link href={`/room/${roomId}/students`} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: 'linear-gradient(135deg, #f5c842, #e6a800)',
                  color: '#1a1f2e', padding: '8px 16px', borderRadius: 8,
                  fontSize: 12, fontWeight: 700, textDecoration: 'none',
                  boxShadow: '0 3px 10px rgba(245,200,66,0.3)',
                }}>+ เพิ่มนักเรียนคนแรก</Link>
              </div>
            ) : (
              <>
                {students.slice(0, 6).map((s, i) => (
                  <div key={s.id} className="stu-row">
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: s.gender === 'female' ? '#f472b6' : s.gender === 'male' ? '#60a5fa' : AVATAR_COLORS[i % AVATAR_COLORS.length],
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
                    }}>{s.full_name[0]}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.full_name}
                      </div>
                      {s.code && <div style={{ fontSize: 10, color: '#9ca3af' }}>รหัส {s.code}</div>}
                    </div>
                    <div style={{ fontSize: 11, color: '#d1d5db', fontWeight: 500 }}>
                      #{s.seat_number ?? i + 1}
                    </div>
                  </div>
                ))}
                {students.length > 6 && (
                  <Link href={`/room/${roomId}/students`} style={{
                    display: 'block', textAlign: 'center', padding: '11px',
                    fontSize: 12, color: '#f5c842', fontWeight: 600,
                    textDecoration: 'none', background: '#fffbeb',
                    borderTop: '1px solid #fef3c7',
                  }}>ดูทั้งหมด {students.length} คน →</Link>
                )}
              </>
            )}
          </div>

          {/* ── Quick Actions ── */}
          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Link href={`/room/${roomId}/attendance`} style={{
              display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none',
              background: 'linear-gradient(135deg, #1a1f2e, #252d42)',
              border: '1px solid #2d3449', borderRadius: 12, padding: '12px 16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✅</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9' }}>เช็คชื่อวันนี้</div>
                <div style={{ fontSize: 10, color: '#6b7280' }}>บันทึกการเข้าเรียน</div>
              </div>
            </Link>
            <Link href={`/room/${roomId}/students`} style={{
              display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none',
              background: '#ffffff', border: '1px solid #e8eaed', borderRadius: 12, padding: '12px 16px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(245,200,66,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>➕</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>เพิ่มนักเรียน</div>
                <div style={{ fontSize: 10, color: '#9ca3af' }}>จัดการรายชื่อ</div>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </>
  )
}