'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../../../../lib/supabase'
import { useRouter, useParams } from 'next/navigation'

export default function AttendancePage() {
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
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

    const { data: attData } = await supabase
      .from('attendance').select('*')
      .eq('room_id', roomId).eq('date', selectedDate)

    const attMap = {}
    ;(attData || []).forEach(a => { attMap[a.student_id] = a.status })
    // ถ้ายังไม่มีข้อมูล ให้ default เป็น 'present'
    ;(studentsData || []).forEach(s => {
      if (!attMap[s.id]) attMap[s.id] = 'present'
    })
    setAttendance(attMap)
    setLoading(false)
  }

  function setStatus(studentId, status) {
    setAttendance(prev => ({ ...prev, [studentId]: status }))
    setSaved(false)
  }

  async function saveAttendance() {
    setSaving(true)
    const supabase = createClient()
    for (const student of students) {
      await supabase.from('attendance').upsert({
        room_id: roomId,
        student_id: student.id,
        date: selectedDate,
        status: attendance[student.id] || 'present'
      }, { onConflict: 'student_id,date' })
    }
    setSaving(false)
    setSaved(true)
  }

  const statusConfig = {
    present: { label: 'มา',    color: '#4CAF50', bg: '#E8F5E9', emoji: '✅' },
    absent:  { label: 'ขาด',   color: '#F44336', bg: '#FFEBEE', emoji: '❌' },
    leave:   { label: 'ลา',    color: '#FF9800', bg: '#FFF3E0', emoji: '📋' },
    late:    { label: 'สาย',   color: '#2196F3', bg: '#E3F2FD', emoji: '⏰' },
  }

  const summary = {
    present: students.filter(s => attendance[s.id] === 'present').length,
    absent:  students.filter(s => attendance[s.id] === 'absent').length,
    leave:   students.filter(s => attendance[s.id] === 'leave').length,
    late:    students.filter(s => attendance[s.id] === 'late').length,
  }

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

      {/* Header */}
      <div style={{background: 'linear-gradient(135deg, #e07b39 0%, #f5a25d 100%)'}}>
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => router.back()} className="text-white text-xl">←</button>
            <div>
              <h1 className="text-lg font-bold text-white">เช็คชื่อ</h1>
              <p className="text-xs" style={{color: '#ffe5cc'}}>{room?.name}</p>
            </div>
          </div>

          {/* เลือกวันที่ */}
          <input type="date" value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="w-full rounded-xl px-4 py-2 text-sm font-medium focus:outline-none"
            style={{color: '#e07b39'}} />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">

        {/* วันที่ไทย */}
        <p className="text-sm font-medium text-center mb-4" style={{color: '#a0856c'}}>{thaiDate}</p>

        {/* สรุป */}
        <div className="flex gap-2 mb-4">
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <div key={key} className="flex-1 rounded-xl py-2 text-center"
              style={{background: cfg.bg}}>
              <p className="text-lg font-bold" style={{color: cfg.color}}>{summary[key]}</p>
              <p className="text-xs" style={{color: cfg.color}}>{cfg.label}</p>
            </div>
          ))}
        </div>

        {/* รายชื่อ */}
        {students.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">👦</div>
            <p style={{color: '#a0856c'}}>ยังไม่มีนักเรียน</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 mb-4">
            {students.map((s, i) => {
              const status = attendance[s.id] || 'present'
              const cfg = statusConfig[status]
              return (
                <div key={s.id} className="bg-white rounded-2xl px-4 py-3 shadow-sm border flex items-center gap-3"
                  style={{borderColor: cfg.color + '40'}}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{background: '#e07b39'}}>{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{color: '#333'}}>{s.full_name}</p>
                    {s.code && <p className="text-xs" style={{color: '#aaa'}}>รหัส {s.code}</p>}
                  </div>
                  {/* ปุ่มสถานะ */}
                  <div className="flex gap-2">
                    {Object.entries(statusConfig).map(([key, c]) => (
                      <button key={key} onClick={() => setStatus(s.id, key)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold transition"
                        style={{
                          background: status === key ? c.color : '#f0f0f0',
                          color: status === key ? 'white' : '#bbb',
                          minWidth: '36px'
                        }}>
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ปุ่มบันทึก */}
        {students.length > 0 && (
          <button onClick={saveAttendance} disabled={saving}
            className="w-full text-white py-4 rounded-2xl font-bold text-base hover:opacity-90 disabled:opacity-50 transition shadow-md"
            style={{background: saved ? '#4CAF50' : 'linear-gradient(135deg, #e07b39, #f5a25d)'}}>
            {saving ? '⏳ กำลังบันทึก...' : saved ? '✅ บันทึกแล้ว!' : '💾 บันทึกการเช็คชื่อ'}
          </button>
        )}
      </div>
    </div>
  )
}