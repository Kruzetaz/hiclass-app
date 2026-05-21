'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../../../lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function RoomPage() {
  const [room, setRoom] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const roomId = params.id

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: roomData } = await supabase
      .from('rooms').select('*').eq('id', roomId).single()
    setRoom(roomData)

    const { data: studentsData } = await supabase
      .from('students').select('*').eq('room_id', roomId)
      .eq('is_active', true).order('sort_order')
    setStudents(studentsData || [])
    setLoading(false)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background: '#fff8f0'}}>
      <p style={{color: '#e07b39'}}>กำลังโหลด...</p>
    </div>
  )

  const menus = [
    { icon: '✅', label: 'เช็คชื่อ',       href: `/room/${roomId}/attendance`,  color: '#4CAF50' },
    { icon: '🍱', label: 'อาหารกลางวัน',  href: `/room/${roomId}/food`,         color: '#FF9800' },
    { icon: '🪥', label: 'แปรงฟัน',        href: `/room/${roomId}/tooth`,        color: '#2196F3' },
    { icon: '🥛', label: 'ดื่มนม',          href: `/room/${roomId}/milk`,         color: '#9C27B0' },
    { icon: '💰', label: 'ออมเงิน',         href: `/room/${roomId}/savings`,      color: '#F44336' },
    { icon: '👥', label: 'รายชื่อนักเรียน', href: `/room/${roomId}/students`,     color: '#607D8B' },
  ]

  return (
    <div className="min-h-screen" style={{background: '#fff8f0'}}>

      {/* Header */}
      <div style={{background: 'linear-gradient(135deg, #e07b39 0%, #f5a25d 100%)'}}>
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/dashboard')}
              className="text-white text-xl hover:opacity-70 transition">←</button>
            <div>
              <h1 className="text-lg font-bold text-white">{room?.name}</h1>
              <p className="text-xs" style={{color: '#ffe5cc'}}>
                {room?.subject || 'ไม่ระบุวิชา'} • {students.length} คน
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5">

        {/* เมนูหลัก */}
        <p className="text-sm font-medium mb-3" style={{color: '#a0856c'}}>เลือกกิจกรรม</p>
        <div className="grid gap-3 mb-6" style={{display:'grid', gridTemplateColumns:'1fr 1fr'}}>
          {menus.map((menu, i) => (
            <Link key={i} href={menu.href}>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-orange-50 flex flex-col items-center gap-2 hover:shadow-md hover:border-orange-200 transition cursor-pointer">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                  style={{background: menu.color + '20'}}>
                  {menu.icon}
                </div>
                <p className="text-sm font-semibold text-center" style={{color: '#333'}}>{menu.label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* รายชื่อนักเรียนด่วน */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-orange-50 flex items-center justify-between">
            <p className="font-semibold text-sm" style={{color: '#333'}}>รายชื่อนักเรียน ({students.length} คน)</p>
            <Link href={`/room/${roomId}/students`}
              className="text-xs font-medium" style={{color: '#e07b39'}}>จัดการ →</Link>
          </div>
          {students.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm" style={{color: '#a0856c'}}>ยังไม่มีนักเรียน</p>
              <Link href={`/room/${roomId}/students`}
                className="text-sm font-semibold mt-1 block" style={{color: '#e07b39'}}>
                + เพิ่มนักเรียน
              </Link>
            </div>
          ) : (
            <div>
              {students.slice(0, 5).map((s, i) => (
                <div key={s.id} className="px-4 py-3 flex items-center gap-3 border-b border-gray-50">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{background: '#e07b39'}}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{color: '#333'}}>{s.full_name}</p>
                    {s.code && <p className="text-xs" style={{color: '#aaa'}}>รหัส {s.code}</p>}
                  </div>
                </div>
              ))}
              {students.length > 5 && (
                <div className="px-4 py-3 text-center">
                  <Link href={`/room/${roomId}/students`}
                    className="text-xs" style={{color: '#e07b39'}}>
                    ดูทั้งหมด {students.length} คน →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}