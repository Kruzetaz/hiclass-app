'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../../../../lib/supabase'
import { useRouter, useParams } from 'next/navigation'

const AVATAR_COLORS = ['#6C5CE7','#10b981','#e17055','#f59e0b','#3b82f6','#8b5cf6','#ec4899','#06b6d4']

export default function ToothPage() {
  const [students, setStudents] = useState([])
  const [records, setRecords] = useState({})
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const router = useRouter()
  const params = useParams()
  const roomId = params.id

  useEffect(() => { loadData() }, [selectedDate])

  async function loadData() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { data: roomData } = await supabase.from('rooms').select('*').eq('id', roomId).single()
    setRoom(roomData)
    const { data: studentsData } = await supabase
      .from('students').select('*').eq('room_id', roomId)
      .eq('is_active', true)
    const sorted = (studentsData || []).sort((a, b) => (a.seat_number ?? 9999) - (b.seat_number ?? 9999))
    setStudents(sorted)
    const { data: recData } = await supabase
      .from('tooth_brushing').select('*').eq('room_id', roomId).eq('date', selectedDate)
    const recMap = {}
    ;(recData || []).forEach(r => { recMap[r.student_id] = r.done })
    setRecords(recMap)
    setLoading(false)
  }

  function toggle(studentId) {
    setRecords(prev => ({ ...prev, [studentId]: !prev[studentId] }))
    setSaved(false)
  }

  function selectAll() {
    const m = {}
    students.forEach(s => m[s.id] = true)
    setRecords(m)
    setSaved(false)
  }

  function clearAll() {
    setRecords({})
    setSaved(false)
  }

  async function saveRecords() {
    setSaving(true)
    const supabase = createClient()
    for (const student of students) {
      await supabase.from('tooth_brushing').upsert({
        room_id: roomId, student_id: student.id,
        date: selectedDate, done: records[student.id] || false
      }, { onConflict: 'student_id,date' })
    }
    setSaving(false)
    setSaved(true)
  }

  const doneCount = students.filter(s => records[s.id]).length
  const thaiDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('th-TH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
  const pct = students.length > 0 ? Math.round((doneCount / students.length) * 100) : 0

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f5f7', fontFamily: 'Noto Sans Thai, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9ca3af', fontSize: 14 }}>
        <span style={{ fontSize: 20 }}>⏳</span> กำลังโหลด...
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Noto Sans Thai', sans-serif; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .stu-card { background: #fff; border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; gap: 12px; cursor: pointer; border: 1.5px solid #e8eaed; transition: all 0.15s; }
        .stu-card:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .date-input { background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 7px 12px; font-size: 13px; color: #f1f5f9; outline: none; font-family: inherit; cursor: pointer; }
        .date-input::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.7; }
        .action-btn { flex: 1; padding: 9px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; border: none; transition: all 0.15s; }
        .action-btn:hover { opacity: 0.85; transform: translateY(-1px); }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f4f5f7', fontFamily: 'Noto Sans Thai, sans-serif' }}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1a1f2e 0%, #252d42 100%)', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
          <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #252b3b' }}>
            <button onClick={() => router.back()} style={{
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8, padding: '5px 12px', cursor: 'pointer',
              color: '#e2e8f0', fontSize: 12, fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>← กลับ</button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>🪥 แปรงฟัน</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>{room?.name} · {thaiDate}</div>
            </div>
            <input type="date" value={selectedDate}
              onChange={e => { setSelectedDate(e.target.value); setSaved(false) }}
              className="date-input" />
          </div>

          {/* Stats strip */}
          <div style={{ padding: '14px 20px 16px', display: 'flex', gap: 20, alignItems: 'center' }}>
            {[
              { label: 'แปรงแล้ว',   val: doneCount,                    icon: '🪥', color: '#3b82f6' },
              { label: 'ยังไม่แปรง', val: students.length - doneCount,  icon: '⬜', color: '#f87171' },
              { label: 'ทั้งหมด',    val: students.length,              icon: '👥', color: '#f5c842' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {i > 0 && <div style={{ width: 1, height: 28, background: '#252b3b', marginRight: 8 }} />}
                <span style={{ fontSize: 16 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: s.color, lineHeight: 1.2 }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: '#4b5563' }}>{s.label}</div>
                </div>
              </div>
            ))}

            {/* Progress bar */}
            <div style={{ flex: 1, marginLeft: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#f5c842' }}>{pct}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 99,
                  width: `${pct}%`,
                  background: pct === 100 ? '#10b981' : '#3b82f6',
                  transition: 'width 0.4s ease',
                }} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 16px' }}>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button className="action-btn" onClick={selectAll}
              style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff' }}>
              ✓ เลือกทั้งหมด
            </button>
            <button className="action-btn" onClick={clearAll}
              style={{ background: '#ffffff', color: '#6b7280', border: '1px solid #e5e7eb' }}>
              ✗ ล้างทั้งหมด
            </button>
          </div>

          {/* Student list */}
          {students.length === 0 ? (
            <div style={{ background: '#fff', border: '1.5px dashed #d1d5db', borderRadius: 16, padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>👤</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>ยังไม่มีนักเรียน</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {students.map((s, i) => {
                const done = records[s.id]
                return (
                  <div key={s.id} className="stu-card"
                    onClick={() => toggle(s.id)}
                    style={{
                      borderColor: done ? '#3b82f6' : '#e8eaed',
                      background: done ? '#eff6ff' : '#ffffff',
                      animation: `slideUp 0.2s ease ${i * 0.03}s both`,
                    }}>
                    {/* เลขที่ */}
                    <div style={{
                      width: 28, textAlign: 'center', flexShrink: 0,
                      fontSize: 12, fontWeight: 700,
                      color: done ? '#3b82f6' : '#9ca3af',
                    }}>
                      {s.seat_number ?? i + 1}
                    </div>

                    {/* Avatar */}
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      background: done ? '#3b82f6' : (s.gender === 'female' ? '#f472b6' : s.gender === 'male' ? '#60a5fa' : AVATAR_COLORS[i % AVATAR_COLORS.length]),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, color: '#fff',
                      transition: 'background 0.2s',
                    }}>
                      {done ? '🪥' : s.full_name[0]}
                    </div>

                    {/* ชื่อ */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: done ? '#1d4ed8' : '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.full_name}
                      </div>
                      {s.code && <div style={{ fontSize: 10, color: '#9ca3af' }}>รหัส {s.code}</div>}
                    </div>

                    {/* Status badge */}
                    <div style={{
                      padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                      background: done ? '#dbeafe' : '#f3f4f6',
                      color: done ? '#1d4ed8' : '#9ca3af',
                      transition: 'all 0.2s', flexShrink: 0,
                    }}>
                      {done ? '✓ แปรงแล้ว' : 'ยังไม่แปรง'}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Save button */}
          {students.length > 0 && (
            <button onClick={saveRecords} disabled={saving} style={{
              width: '100%', padding: '14px', borderRadius: 12, border: 'none',
              cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
              background: saved
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #f5c842, #e6a800)',
              color: saved ? '#fff' : '#1a1f2e',
              boxShadow: saved
                ? '0 4px 14px rgba(16,185,129,0.4)'
                : '0 4px 14px rgba(245,200,66,0.4)',
              opacity: saving ? 0.7 : 1,
            }}>
              {saving ? '⏳ กำลังบันทึก...' : saved ? '✅ บันทึกแล้ว!' : '💾 บันทึกข้อมูล'}
            </button>
          )}
        </div>
      </div>
    </>
  )
}