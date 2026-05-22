'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../../../../lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

const AVATAR_COLORS = ['#6C5CE7','#10b981','#e17055','#f59e0b','#3b82f6','#8b5cf6','#ec4899','#06b6d4']

export default function SavingsPage() {
  const [students, setStudents] = useState([])
  const [balances, setBalances] = useState({})
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('deposit')
  const [note, setNote] = useState('')

  // Modal state
  const [modalStudent, setModalStudent] = useState(null)
  const [modalTxns, setModalTxns] = useState([])
  const [modalLoading, setModalLoading] = useState(false)

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
      .from('students').select('*').eq('room_id', roomId).eq('is_active', true)
    const sorted = (studentsData || []).sort((a, b) => (a.seat_number ?? 9999) - (b.seat_number ?? 9999))
    setStudents(sorted)
    const { data: savData } = await supabase.from('savings').select('*').eq('room_id', roomId)
    const balMap = {}
    ;(savData || []).forEach(r => {
      if (!balMap[r.student_id]) balMap[r.student_id] = 0
      balMap[r.student_id] += (r.deposit || 0) - (r.withdraw || 0)
    })
    setBalances(balMap)
    setLoading(false)
  }

  async function openModal(student) {
    setModalStudent(student)
    setModalLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('savings').select('*')
      .eq('student_id', student.id)
      .order('date', { ascending: false })
      .limit(5)
    setModalTxns(data || [])
    setModalLoading(false)
  }

  function closeModal() { setModalStudent(null); setModalTxns([]) }

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
      note: note || null,
    })
    setSelectedStudent(null); setAmount(''); setNote(''); setType('deposit')
    setSaved(true)
    await loadData()
    setSaving(false)
    setTimeout(() => setSaved(false), 2000)
  }

  const totalSavings = Object.values(balances).reduce((sum, b) => sum + b, 0)
  const studentsWithSavings = students.filter(s => (balances[s.id] || 0) > 0).length

  // คำนวณสรุปรายเดือนของนักเรียนที่เปิด Modal
  function getMonthlySum(txns) {
    const map = {}
    txns.forEach(r => {
      const m = r.date?.slice(0, 7) // YYYY-MM
      if (!m) return
      if (!map[m]) map[m] = { deposit: 0, withdraw: 0 }
      map[m].deposit += r.deposit || 0
      map[m].withdraw += r.withdraw || 0
    })
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]))
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f5f7', fontFamily: 'Noto Sans Thai, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9ca3af', fontSize: 14 }}>
        <span style={{ fontSize: 20 }}>⏳</span> กำลังโหลด...
      </div>
    </div>
  )

  const modalBal = modalStudent ? (balances[modalStudent.id] || 0) : 0

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Noto Sans Thai', sans-serif; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalUp { from { opacity: 0; transform: translateY(40px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .field-input { background: #f9fafb; border: 1.5px solid #e5e7eb; border-radius: 8px; padding: 9px 12px; font-size: 13px; color: #111827; outline: none; width: 100%; font-family: inherit; transition: border-color 0.15s; }
        .field-input:focus { border-color: #f5c842; box-shadow: 0 0 0 3px rgba(245,200,66,0.12); }
        .field-select { background: #f9fafb; border: 1.5px solid #e5e7eb; border-radius: 8px; padding: 9px 12px; font-size: 13px; color: #111827; outline: none; width: 100%; font-family: inherit; cursor: pointer; }
        .field-select:focus { border-color: #f5c842; box-shadow: 0 0 0 3px rgba(245,200,66,0.12); }
        .stu-row { background: #fff; border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; gap: 12px; border: 1px solid #e8eaed; transition: all 0.15s; cursor: pointer; }
        .stu-row:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); transform: translateY(-1px); border-color: #f5c842; }
        .txn-row { display: flex; align-items: center; gap: 10px; padding: 9px 0; border-bottom: 1px solid #f3f4f6; }
        .txn-row:last-child { border-bottom: none; }
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
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>💰 ออมเงิน</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>{room?.name}</div>
            </div>
          </div>
          <div style={{ padding: '14px 20px 16px', display: 'flex', gap: 20, alignItems: 'center' }}>
            {[
              { label: 'ยอดรวมทั้งห้อง', val: `${totalSavings.toLocaleString()} ฿`, icon: '💰', color: '#f5c842' },
              { label: 'มีเงินออม', val: `${studentsWithSavings} คน`, icon: '👥', color: '#10b981' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {i > 0 && <div style={{ width: 1, height: 28, background: '#252b3b', marginRight: 8 }} />}
                <span style={{ fontSize: 16 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: i === 0 ? 20 : 18, fontWeight: 700, color: s.color, lineHeight: 1.2 }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: '#4b5563' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 16px' }}>

          {/* Form บันทึก */}
          <div style={{ background: '#fff', border: '1px solid #e8eaed', borderRadius: 16, padding: '20px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', animation: 'slideUp 0.2s ease' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>📝</span> บันทึกรายการ
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>เลือกนักเรียน</label>
              <select className="field-select" value={selectedStudent || ''} onChange={e => setSelectedStudent(e.target.value)}>
                <option value="">-- เลือกนักเรียน --</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.seat_number ? `${s.seat_number}. ` : ''}{s.full_name}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ประเภท</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { val: 'deposit',  label: '⬆ ฝากเงิน', activeColor: '#10b981', activeBg: '#ecfdf5', activeBorder: '#10b981' },
                  { val: 'withdraw', label: '⬇ ถอนเงิน', activeColor: '#ef4444', activeBg: '#fef2f2', activeBorder: '#ef4444' },
                ].map(t => (
                  <button key={t.val} onClick={() => setType(t.val)} style={{
                    flex: 1, padding: '9px', borderRadius: 8, fontFamily: 'inherit',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                    border: `1.5px solid ${type === t.val ? t.activeBorder : '#e5e7eb'}`,
                    background: type === t.val ? t.activeBg : '#f9fafb',
                    color: type === t.val ? t.activeColor : '#9ca3af',
                  }}>{t.label}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>จำนวนเงิน (บาท)</label>
              <input className="field-input" type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>หมายเหตุ <span style={{ fontWeight: 400, textTransform: 'none' }}>(ไม่บังคับ)</span></label>
              <input className="field-input" value={note} onChange={e => setNote(e.target.value)} placeholder="เช่น ฝากประจำวันจันทร์" />
            </div>
            <button onClick={handleSave} disabled={saving || !selectedStudent || !amount || parseFloat(amount) <= 0} style={{
              width: '100%', padding: '12px', borderRadius: 10, border: 'none',
              fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
              background: saved ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #f5c842, #e6a800)',
              color: saved ? '#fff' : '#1a1f2e',
              boxShadow: saved ? '0 4px 14px rgba(16,185,129,0.4)' : '0 4px 14px rgba(245,200,66,0.35)',
              opacity: (saving || !selectedStudent || !amount) ? 0.5 : 1,
            }}>
              {saving ? '⏳ กำลังบันทึก...' : saved ? '✅ บันทึกแล้ว!' : '💾 บันทึกรายการ'}
            </button>
          </div>

          {/* ยอดเงินแต่ละคน */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>💳 ยอดเงินแต่ละคน</span>
            <span style={{ fontSize: 11, color: '#9ca3af' }}>({students.length} คน)</span>
            <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 4 }}>· กดเพื่อดูรายละเอียด</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {students.map((s, i) => {
              const bal = balances[s.id] || 0
              return (
                <div key={s.id} className="stu-row"
                  onClick={() => openModal(s)}
                  style={{ animation: `slideUp 0.2s ease ${i * 0.03}s both` }}>
                  <div style={{ width: 28, textAlign: 'center', flexShrink: 0, fontSize: 12, fontWeight: 700, color: '#9ca3af' }}>
                    {s.seat_number ?? i + 1}
                  </div>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    background: s.gender === 'female' ? '#f472b6' : s.gender === 'male' ? '#60a5fa' : AVATAR_COLORS[i % AVATAR_COLORS.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: '#fff',
                  }}>{s.full_name[0]}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.full_name}</div>
                    {s.code && <div style={{ fontSize: 10, color: '#9ca3af' }}>รหัส {s.code}</div>}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: bal > 0 ? '#10b981' : bal < 0 ? '#ef4444' : '#d1d5db' }}>
                      {bal.toLocaleString()} ฿
                    </div>
                    {bal === 0 && <div style={{ fontSize: 10, color: '#d1d5db' }}>ยังไม่มีรายการ</div>}
                  </div>
                  <div style={{ fontSize: 16, color: '#d1d5db', marginLeft: 4 }}>›</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── MODAL ── */}
      {modalStudent && (
        <div onClick={closeModal} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px', animation: 'fadeIn 0.2s ease',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#fff', borderRadius: 20, width: '100%', maxWidth: 440,
            maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
            boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
            animation: 'modalUp 0.25s ease',
          }}>
            {/* Modal Header */}
            <div style={{ background: 'linear-gradient(135deg, #1a1f2e, #252d42)', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%',
                background: modalStudent.gender === 'female' ? '#f472b6' : modalStudent.gender === 'male' ? '#60a5fa' : '#f5c842',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 700, color: '#fff', flexShrink: 0,
              }}>{modalStudent.full_name[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{modalStudent.full_name}</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>
                  {modalStudent.code ? `รหัส ${modalStudent.code} · ` : ''}ยอดคงเหลือ
                  <span style={{ color: modalBal >= 0 ? '#10b981' : '#ef4444', fontWeight: 700, marginLeft: 4 }}>
                    {modalBal.toLocaleString()} ฿
                  </span>
                </div>
              </div>
              <button onClick={closeModal} style={{
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8,
                width: 30, height: 30, cursor: 'pointer', color: '#9ca3af', fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>✕</button>
            </div>

            {/* Modal Body */}
            <div style={{ overflowY: 'auto', flex: 1, padding: '16px 20px' }}>
              {modalLoading ? (
                <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af', fontSize: 13 }}>⏳ กำลังโหลด...</div>
              ) : modalTxns.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px' }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>💰</div>
                  <div style={{ fontSize: 13, color: '#9ca3af' }}>ยังไม่มีรายการออมเงิน</div>
                </div>
              ) : (
                <>
                  {/* สรุปยอด */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                    {[
                      { label: 'ฝากรวม',   val: modalTxns.reduce((s, r) => s + (r.deposit || 0), 0),  color: '#10b981', bg: '#ecfdf5' },
                      { label: 'ถอนรวม',   val: modalTxns.reduce((s, r) => s + (r.withdraw || 0), 0), color: '#ef4444', bg: '#fef2f2' },
                    ].map((c, i) => (
                      <div key={i} style={{ background: c.bg, borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: c.color }}>{c.val.toLocaleString()} ฿</div>
                        <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>{c.label} (5 รายการล่าสุด)</div>
                      </div>
                    ))}
                  </div>

                  {/* รายการล่าสุด */}
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                    5 รายการล่าสุด
                  </div>
                  <div style={{ background: '#f9fafb', borderRadius: 10, padding: '4px 12px', marginBottom: 16 }}>
                    {modalTxns.map((r, i) => {
                      const isDeposit = (r.deposit || 0) > 0
                      return (
                        <div key={i} className="txn-row">
                          <div style={{
                            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                            background: isDeposit ? '#ecfdf5' : '#fef2f2',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
                          }}>{isDeposit ? '⬆' : '⬇'}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
                              {isDeposit ? 'ฝากเงิน' : 'ถอนเงิน'}
                            </div>
                            <div style={{ fontSize: 10, color: '#9ca3af' }}>
                              {new Date(r.date + 'T00:00:00').toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                              {r.note ? ` · ${r.note}` : ''}
                            </div>
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: isDeposit ? '#10b981' : '#ef4444' }}>
                            {isDeposit ? '+' : '-'}{(isDeposit ? r.deposit : r.withdraw).toLocaleString()} ฿
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer — ปุ่มดูเต็มหน้า */}
            <div style={{ padding: '12px 20px', borderTop: '1px solid #f3f4f6' }}>
              <Link href={`/room/${roomId}/savings/${modalStudent.id}`}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  width: '100%', padding: '12px', borderRadius: 10, textDecoration: 'none',
                  background: 'linear-gradient(135deg, #f5c842, #e6a800)',
                  color: '#1a1f2e', fontSize: 13, fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(245,200,66,0.35)',
                }}>
                📊 ดูรายละเอียดทั้งหมด →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}