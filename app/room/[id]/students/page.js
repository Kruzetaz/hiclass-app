'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../../../../lib/supabase'
import { useRouter, useParams } from 'next/navigation'

export default function StudentsPage() {
  const [students, setStudents] = useState([])
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCode, setNewCode] = useState('')
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const params = useParams()
  const roomId = params.id

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { data: roomData } = await supabase.from('rooms').select('*').eq('id', roomId).single()
    setRoom(roomData)
    const { data: studentsData } = await supabase
      .from('students').select('*').eq('room_id', roomId)
      .eq('is_active', true).order('sort_order').order('created_at')
    setStudents(studentsData || [])
    setLoading(false)
  }

  async function addStudent() {
    if (!newName.trim()) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('students').insert({
      room_id: roomId,
      full_name: newName.trim(),
      code: newCode.trim() || null,
      sort_order: students.length + 1
    })
    setNewName(''); setNewCode(''); setShowAdd(false)
    await loadData()
    setSaving(false)
  }

  async function deleteStudent(id) {
    if (!confirm('ลบนักเรียนคนนี้?')) return
    const supabase = createClient()
    await supabase.from('students').update({ is_active: false }).eq('id', id)
    loadData()
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background: '#fff8f0'}}>
      <p style={{color: '#e07b39'}}>กำลังโหลด...</p>
    </div>
  )

  return (
    <div className="min-h-screen" style={{background: '#fff8f0'}}>

      {/* Header */}
      <div style={{background: 'linear-gradient(135deg, #e07b39 0%, #f5a25d 100%)'}}>
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="text-white text-xl">←</button>
          <div>
            <h1 className="text-lg font-bold text-white">รายชื่อนักเรียน</h1>
            <p className="text-xs" style={{color: '#ffe5cc'}}>{room?.name} • {students.length} คน</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5">

        {/* ปุ่มเพิ่ม */}
        <button onClick={() => setShowAdd(true)}
          className="w-full text-white py-3 rounded-2xl font-semibold mb-4 hover:opacity-90 transition"
          style={{background: 'linear-gradient(135deg, #e07b39, #f5a25d)'}}>
          + เพิ่มนักเรียน
        </button>

        {/* Form เพิ่มนักเรียน */}
        {showAdd && (
          <div className="bg-white rounded-2xl p-5 mb-4 shadow-md border border-orange-100">
            <h2 className="font-bold mb-4" style={{color: '#e07b39'}}>เพิ่มนักเรียน</h2>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1" style={{color: '#555'}}>ชื่อ-นามสกุล *</label>
              <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-300"
                style={{color: '#333'}} placeholder="เด็กชายสมชาย ใจดี" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" style={{color: '#555'}}>รหัสนักเรียน (ไม่บังคับ)</label>
              <input type="text" value={newCode} onChange={e => setNewCode(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-300"
                style={{color: '#333'}} placeholder="เช่น 1234" />
            </div>
            <div className="flex gap-2">
              <button onClick={addStudent} disabled={saving}
                className="flex-1 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
                style={{background: '#e07b39'}}>
                {saving ? 'กำลังบันทึก...' : '✓ บันทึก'}
              </button>
              <button onClick={() => { setShowAdd(false); setNewName(''); setNewCode('') }}
                className="flex-1 py-3 rounded-xl text-sm border border-gray-200"
                style={{color: '#888'}}>ยกเลิก</button>
            </div>
          </div>
        )}

        {/* รายชื่อ */}
        {students.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">👦</div>
            <p style={{color: '#a0856c'}}>ยังไม่มีนักเรียน</p>
            <p className="text-sm mt-1" style={{color: '#c4a882'}}>กดปุ่มด้านบนเพื่อเพิ่ม</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
            {students.map((s, i) => (
              <div key={s.id} className="px-4 py-3 flex items-center gap-3 border-b border-gray-50 last:border-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{background: '#e07b39'}}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{color: '#333'}}>{s.full_name}</p>
                  {s.code && <p className="text-xs" style={{color: '#aaa'}}>รหัส {s.code}</p>}
                </div>
                <button onClick={() => deleteStudent(s.id)}
                  className="text-xs px-3 py-1 rounded-lg border border-red-100 hover:bg-red-50 transition"
                  style={{color: '#e57373'}}>ลบ</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}