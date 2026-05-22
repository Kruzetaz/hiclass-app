'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../../../../lib/supabase'
import { useRouter, useParams } from 'next/navigation'

const AVATAR_COLORS = ['#6C5CE7','#10b981','#e17055','#f59e0b','#3b82f6','#8b5cf6','#ec4899','#06b6d4']

export default function FoodPage() {
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
    const [{ data: roomData }, { data: studs }, { data: recData }] = await Promise.all([
      supabase.from('rooms').select('*').eq('id', roomId).single(),
      supabase.from('students').select('*').eq('room_id', roomId).eq('is_active', true).order('sort_order').order('created_at'),
      supabase.from('food_records').select('*').eq('room_id', roomId).eq('date', selectedDate),
    ])
    setRoom(roomData)
    setStudents(studs || [])
    const recMap = {}
    ;(recData || []).forEach(r => { recMap[r.student_id] = r.received })
    setRecords(recMap)
    setLoading(false)
  }

  function toggle(id) { setRecords(prev => ({ ...prev, [id]: !prev[id] })); setSaved(false) }
  function setAll(val) { const m = {}; students.forEach(s => { m[s.id] = val }); setRecords(m); setSaved(false) }

  async function saveRecords() {
    setSaving(true)
    const supabase = createClient()
    for (const s of students) {
      await supabase.from('food_records').upsert({
        room_id: roomId, student_id: s.id,
        date: selectedDate, received: records[s.id] || false,
      }, { onConflict: 'student_id,date' })
    }
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const receivedCount = students.filter(s => records[s.id]).length
  const thaiDate = selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('th-TH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }) : ''

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
        .stu-row { display: flex; align-items: center; gap: 12px; padding: 11px 16px; border-bottom: 1px solid #f3f4f6; transition: background 0.1s; cursor: pointer; animation: slideUp 0.2s ease both; }
        .stu-row:hover { background: #fafafa; }
        .stu-row:last-child { border-bottom: none; }
        .date-input { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 6px 12px; color: #f1f5f9; font-size: 12px; font-family: inherit; outline: none; cursor: pointer; }
        .date-input::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.7; cursor: pointer; }
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
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>🍱 อาหารกลางวัน</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>{room?.name} · {students.length} คน</div>
            </div>
            <input type="date" value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="date-input" />
          </div>

          {/* Stats Strip */}
          <div style={{ padding: '14px 20px 16px', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ fontSize: 11, color: '#4b5563' }}>{thaiDate}</div>
            <div style={{ width: 1, height: 20, background: '#252b3b' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: 12, color: '#10b981', fontWeight: 700 }}>{receivedCount}</span>
              <span style={{ fontSize: 11, color: '#4b5563' }}>รับแล้ว</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 700 }}>{students.length - receivedCount}</span>
              <span style={{ fontSize: 11, color: '#4b5563' }}>ยังไม่รับ</span>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 640, margin: '0 auto', padding: '16px' }}>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#6b7280' }}>ตั้งทั้งหมดเป็น:</span>
            <button onClick={() => setAll(true)} style={{
              padding: '5px 14px', borderRadius: 99, border: '1px solid #a7f3d0',
              background: '#ecfdf5', color: '#10b981', fontSize: 11, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>รับทั้งหมด</button>
            <button onClick={() => setAll(false)} style={{
              padding: '5px 14px', borderRadius: 99, border: '1px solid #fecaca',
              background: '#fef2f2', color: '#ef4444', fontSize: 11, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>ล้างทั้งหมด</button>
          </div>

          {/* Student List */}
          {students.length === 0 ? (
            <div style={{ background: '#fff', border: '1.5px dashed #d1d5db', borderRadius: 16, padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>👤</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>ยังไม่มีนักเรียนในห้องนี้</div>
            </div>
          ) : (
            <div style={{ background: '#fff', border: '1px solid #e8eaed', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', marginBottom: 16 }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ width: 32, flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ชื่อ-นามสกุล</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>รับอาหาร</div>
              </div>

              {students.map((s, i) => {
                const received = records[s.id] || false
                return (
                  <div key={s.id} className="stu-row"
                    onClick={() => toggle(s.id)}
                    style={{ animationDelay: `${i * 0.03}s` }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: '#fff',
                    }}>{s.full_name[0]}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.full_name}
                      </div>
                      {s.code && <div style={{ fontSize: 10, color: '#9ca3af' }}>รหัส {s.code}</div>}
                    </div>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: received ? '#ecfdf5' : '#f3f4f6',
                      border: `2px solid ${received ? '#10b981' : '#e5e7eb'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, transition: 'all 0.15s',
                    }}>
                      {received ? '✅' : ''}
                    </div>
                  </div>
                )
              })}

              <div style={{ padding: '10px 16px', background: '#f9fafb', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>กดที่ชื่อเพื่อเปลี่ยนสถานะ</span>
                <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>รับแล้ว {receivedCount}/{students.length} คน</span>
              </div>
            </div>
          )}

          {/* Save Button */}
          {students.length > 0 && (
            <button onClick={saveRecords} disabled={saving} style={{
              width: '100%', padding: '14px', borderRadius: 12, border: 'none',
              cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
              background: saved
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #1a1f2e, #252d42)',
              color: saved ? '#fff' : '#f5c842',
              boxShadow: saved ? '0 4px 14px rgba(16,185,129,0.35)' : '0 4px 14px rgba(0,0,0,0.2)',
              opacity: saving ? 0.7 : 1,
            }}>
              {saving ? '⏳ กำลังบันทึก...' : saved ? '✅ บันทึกแล้ว!' : '💾 บันทึกอาหารกลางวัน'}
            </button>
          )}
        </div>
      </div>
    </>
  )
}