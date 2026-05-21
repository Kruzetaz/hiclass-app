'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../../../../lib/supabase'
import { useRouter, useParams } from 'next/navigation'

export default function SavingsPage() {
  const [students, setStudents] = useState([])
  const [balances, setBalances] = useState({})
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('deposit')
  const [note, setNote] = useState('')
  const router = useRouter()
  const params = useParams()
  const roomId = params.id

  useEffect(() => { loadData() }, [])

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
    const { data: savData } = await supabase
      .from('savings').select('*').eq('room_id', roomId)
    const balMap = {}
    ;(savData || []).forEach(r => {
      if (!balMap[r.student_id]) balMap[r.student_id] = 0
      balMap[r.student_id] += (r.deposit || 0) - (r.withdraw || 0)
    })
    setBalances(balMap)
    setLoading(false)
  }

  async function handleSave() {
    if (!selectedStudent || !amount || parseFloat(amount) <= 0) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('savings').insert({
      room_id: roomId,
      student_id: selectedStudent,
      date: new Date().toISOString().split('T')[0],
      deposit: type === 'deposit' ? parseFloat(amount) : 0,
      withdraw: type === 'withdraw' ? parseFloat(amount) : 0,
      note: note || null
    })
    setSelectedStudent(null); setAmount(''); setNote(''); setType('deposit')
    await loadData()
    setSaving(false)
  }

  const totalSavings = Object.values(balances).reduce((sum, b) => sum + b, 0)

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
              <h1 className="text-lg font-bold text-white">💰 ออมเงิน</h1>
              <p className="text-xs" style={{color: '#ffe5cc'}}>{room?.name}</p>
            </div>
          </div>
          {/* ยอดรวม */}
          <div className="bg-white bg-opacity-20 rounded-2xl px-5 py-3 text-center">
            <p className="text-xs text-white opacity-80">ยอดออมรวมทั้งห้อง</p>
            <p className="text-3xl font-bold text-white">{totalSavings.toLocaleString()} ฿</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">

        {/* Form บันทึก */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-orange-100 mb-4">
          <h2 className="font-bold mb-4" style={{color: '#e07b39'}}>บันทึกรายการ</h2>

          {/* เลือกนักเรียน */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1" style={{color: '#555'}}>เลือกนักเรียน</label>
            <select value={selectedStudent || ''} onChange={e => setSelectedStudent(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={{color: '#333'}}>
              <option value="">-- เลือกนักเรียน --</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.full_name}</option>
              ))}
            </select>
          </div>

          {/* ประเภท */}
          <div className="flex gap-2 mb-3">
            <button onClick={() => setType('deposit')}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition"
              style={{background: type === 'deposit' ? '#4CAF50' : '#f5f5f5',
                      color: type === 'deposit' ? 'white' : '#888'}}>
              ฝากเงิน
            </button>
            <button onClick={() => setType('withdraw')}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition"
              style={{background: type === 'withdraw' ? '#F44336' : '#f5f5f5',
                      color: type === 'withdraw' ? 'white' : '#888'}}>
              ถอนเงิน
            </button>
          </div>

          {/* จำนวนเงิน */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1" style={{color: '#555'}}>จำนวนเงิน (บาท)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={{color: '#333'}} placeholder="0" min="0" />
          </div>

          {/* หมายเหตุ */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" style={{color: '#555'}}>หมายเหตุ (ไม่บังคับ)</label>
            <input type="text" value={note} onChange={e => setNote(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={{color: '#333'}} placeholder="เช่น ฝากประจำวันจันทร์" />
          </div>

          <button onClick={handleSave} disabled={saving || !selectedStudent || !amount}
            className="w-full text-white py-3 rounded-2xl font-semibold disabled:opacity-50 transition"
            style={{background: 'linear-gradient(135deg, #e07b39, #f5a25d)'}}>
            {saving ? '⏳ กำลังบันทึก...' : '💾 บันทึก'}
          </button>
        </div>

        {/* ยอดเงินแต่ละคน */}
        <p className="text-sm font-medium mb-3" style={{color: '#a0856c'}}>ยอดเงินแต่ละคน</p>
        <div className="flex flex-col gap-2">
          {students.map((s, i) => (
            <div key={s.id} className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-orange-50 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{background: '#e07b39'}}>{i + 1}</div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{color: '#333'}}>{s.full_name}</p>
                {s.code && <p className="text-xs" style={{color: '#aaa'}}>รหัส {s.code}</p>}
              </div>
              <div className="text-right">
                <p className="font-bold" style={{color: (balances[s.id] || 0) >= 0 ? '#4CAF50' : '#F44336'}}>
                  {(balances[s.id] || 0).toLocaleString()} ฿
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}