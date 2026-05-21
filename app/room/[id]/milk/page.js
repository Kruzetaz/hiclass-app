'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../../../../lib/supabase'
import { useRouter, useParams } from 'next/navigation'

export default function MilkPage() {
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
      .eq('is_active', true).order('sort_order').order('created_at')
    setStudents(studentsData || [])
    const { data: recData } = await supabase
      .from('milk_records').select('*').eq('room_id', roomId).eq('date', selectedDate)
    const recMap = {}
    ;(recData || []).forEach(r => { recMap[r.student_id] = r.received })
    setRecords(recMap)
    setLoading(false)
  }

  function toggle(studentId) {
    setRecords(prev => ({ ...prev, [studentId]: !prev[studentId] }))
    setSaved(false)
  }

  async function saveRecords() {
    setSaving(true)
    const supabase = createClient()
    for (const student of students) {
      await supabase.from('milk_records').upsert({
        room_id: roomId, student_id: student.id,
        date: selectedDate, received: records[student.id] || false
      }, { onConflict: 'student_id,date' })
    }
    setSaving(false); setSaved(true)
  }

  const receivedCount = students.filter(s => records[s.id]).length
  const thaiDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('th-TH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background: '#fff8f0'}}>
      <p style={{color: '#e07b39'}}>กำลังโหลด...</p>
    </div>
  )

  return (
    <div className="min-h-screen" style={{background: '#fff8f0'}}>
      <div style={{background: 'linear-gradient(135deg, #e07b39 0%, #f5a25d 100%)'}}>
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => router.back()} className="text-white text-xl">←</button>
            <div>
              <h1 className="text-lg font-bold text-white">🥛 ดื่มนม</h1>
              <p className="text-xs" style={{color: '#ffe5cc'}}>{room?.name}</p>
            </div>
          </div>
          <input type="date" value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="w-full rounded-xl px-4 py-2 text-sm font-medium focus:outline-none"
            style={{color: '#e07b39'}} />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">
        <p className="text-sm font-medium text-center mb-4" style={{color: '#a0856c'}}>{thaiDate}</p>
        <div className="flex gap-3 mb-4">
          <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-orange-100 text-center">
            <p className="text-3xl font-bold" style={{color: '#9C27B0'}}>{receivedCount}</p>
            <p className="text-xs mt-1" style={{color: '#a0856c'}}>รับนมแล้ว</p>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-orange-100 text-center">
            <p className="text-3xl font-bold" style={{color: '#F44336'}}>{students.length - receivedCount}</p>
            <p className="text-xs mt-1" style={{color: '#a0856c'}}>ยังไม่รับ</p>
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          <button onClick={() => { const m = {}; students.forEach(s => m[s.id] = true); setRecords(m); setSaved(false) }}
            className="flex-1 py-2 rounded-xl text-sm font-semibold text-white"
            style={{background: '#9C27B0'}}>✓ เลือกทั้งหมด</button>
          <button onClick={() => { setRecords({}); setSaved(false) }}
            className="flex-1 py-2 rounded-xl text-sm font-semibold border border-gray-200"
            style={{color: '#888'}}>✗ ล้างทั้งหมด</button>
        </div>
        <div className="flex flex-col gap-2 mb-4">
          {students.map((s, i) => (
            <div key={s.id} onClick={() => toggle(s.id)}
              className="bg-white rounded-2xl px-4 py-3 shadow-sm border flex items-center gap-3 cursor-pointer"
              style={{borderColor: records[s.id] ? '#9C27B0' : '#f0f0f0'}}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{background: '#e07b39'}}>{i + 1}</div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{color: '#333'}}>{s.full_name}</p>
                {s.code && <p className="text-xs" style={{color: '#aaa'}}>รหัส {s.code}</p>}
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                style={{background: records[s.id] ? '#F3E5F5' : '#f5f5f5'}}>
                {records[s.id] ? '🥛' : '⬜'}
              </div>
            </div>
          ))}
        </div>
        {students.length > 0 && (
          <button onClick={saveRecords} disabled={saving}
            className="w-full text-white py-4 rounded-2xl font-bold hover:opacity-90 disabled:opacity-50 transition shadow-md"
            style={{background: saved ? '#9C27B0' : 'linear-gradient(135deg, #e07b39, #f5a25d)'}}>
            {saving ? '⏳ กำลังบันทึก...' : saved ? '✅ บันทึกแล้ว!' : '💾 บันทึก'}
          </button>
        )}
      </div>
    </div>
  )
}