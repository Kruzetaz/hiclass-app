'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../../../../lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

const AVATAR_COLORS = ['#6C5CE7','#10b981','#e17055','#f59e0b','#3b82f6','#8b5cf6','#ec4899','#06b6d4']

export default function StudentsPage() {
  const [students, setStudents] = useState([])
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCode, setNewCode] = useState('')
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const router = useRouter()
  const params = useParams()
  const roomId = params.id

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const [{ data: roomData }, { data: studs }] = await Promise.all([
      supabase.from('rooms').select('*').eq('id', roomId).single(),
      supabase.from('students').select('*').eq('room_id', roomId)
        .eq('is_active', true).order('sort_order').order('created_at'),
    ])
    setRoom(roomData)
    setStudents(studs || [])
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
      sort_order: students.length + 1,
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

  const filtered = students.filter(s =>
    s.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (s.code || '').includes(search)
  )

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
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .stu-row { display: flex; align-items: center; gap: 12px; padding: 11px 16px; border-bottom: 1px solid #f3f4f6; transition: background 0.1s; }
        .stu-row:hover { background: #fafafa; }
        .stu-row:last-child { border-bottom: none; }
        .del-btn { opacity: 0; transition: opacity 0.15s; padding: 4px 10px; border-radius: 6px; border: 1px solid #fee2e2; background: transparent; color: #ef4444; font-size: 11px; cursor: pointer; font-family: inherit; }
        .stu-row:hover .del-btn { opacity: 1; }
        .search-input { background: #f9fafb; border: 1.5px solid #e5e7eb; border-radius: 8px; padding: 8px 12px 8px 34px; font-size: 13px; color: #111827; outline: none; width: 100%; font-family: inherit; transition: border-color 0.15s; }
        .search-input:focus { border-color: #f5c842; box-shadow: 0 0 0 3px rgba(245,200,66,0.12); }
        .field-input { background: #f9fafb; border: 1.5px solid #e5e7eb; border-radius: 8px; padding: 9px 12px; font-size: 13px; color: #111827; outline: none; width: 100%; font-family: inherit; transition: border-color 0.15s; }
        .field-input:focus { border-color: #f5c842; box-shadow: 0 0 0 3px rgba(245,200,66,0.12); }
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
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>รายชื่อนักเรียน</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>{room?.name} · {students.length} คน</div>
            </div>
            <button onClick={() => setShowAdd(true)} style={{
              background: 'linear-gradient(135deg, #f5c842, #e6a800)',
              border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer',
              color: '#1a1f2e', fontSize: 11, fontWeight: 700, fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 4,
              boxShadow: '0 3px 10px rgba(245,200,66,0.35)',
            }}>+ เพิ่มนักเรียน</button>
          </div>

          {/* Stats */}
          <div style={{ padding: '14px 20px 16px', display: 'flex', gap: 20, alignItems: 'center' }}>
            {[
              { label: 'นักเรียนทั้งหมด', val: students.length, icon: '👥', color: '#f5c842' },
              { label: 'ใช้งานอยู่', val: students.length, icon: '✅', color: '#10b981' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: s.color, lineHeight: 1.2 }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: '#4b5563' }}>{s.label}</div>
                </div>
                {i < 1 && <div style={{ width: 1, height: 28, background: '#252b3b', marginLeft: 8 }} />}
              </div>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 16px' }}>

          {/* Add Form */}
          {showAdd && (
            <div style={{ background: '#ffffff', border: '1px solid #e9eaec', borderRadius: 16, padding: '20px', marginBottom: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', animation: 'slideUp 0.2s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>➕ เพิ่มนักเรียนใหม่</div>
                <button onClick={() => { setShowAdd(false); setNewName(''); setNewCode('') }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 18 }}>✕</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    ชื่อ-นามสกุล *
                  </label>
                  <input className="field-input" autoFocus value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addStudent()}
                    placeholder="เด็กชายสมชาย ใจดี" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    รหัสนักเรียน
                  </label>
                  <input className="field-input" value={newCode}
                    onChange={e => setNewCode(e.target.value)}
                    placeholder="เช่น 1234" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={addStudent} disabled={saving || !newName.trim()} style={{
                  flex: 1, padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #f5c842, #e6a800)', color: '#1a1f2e',
                  fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
                  opacity: saving || !newName.trim() ? 0.5 : 1,
                  boxShadow: '0 3px 10px rgba(245,200,66,0.3)',
                }}>
                  {saving ? '⏳ กำลังบันทึก...' : '✓ บันทึก'}
                </button>
                <button onClick={() => { setShowAdd(false); setNewName(''); setNewCode('') }} style={{
                  padding: '10px 20px', borderRadius: 8, cursor: 'pointer',
                  background: '#f4f5f7', border: '1px solid #e5e7eb',
                  color: '#6b7280', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                }}>ยกเลิก</button>
              </div>
            </div>
          )}

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#9ca3af' }}>🔍</span>
            <input className="search-input" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={`ค้นหาในห้อง ${room?.name}...`} />
          </div>

          {/* Student List */}
          {students.length === 0 ? (
            <div style={{ background: '#ffffff', border: '1.5px dashed #d1d5db', borderRadius: 16, padding: '40px 24px', textAlign: 'center', animation: 'slideUp 0.3s ease' }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>👤</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#374151', marginBottom: 6 }}>ยังไม่มีนักเรียน</div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 16 }}>กดปุ่ม "เพิ่มนักเรียน" เพื่อเริ่มต้น</div>
              <button onClick={() => setShowAdd(true)} style={{
                background: 'linear-gradient(135deg, #f5c842, #e6a800)', color: '#1a1f2e',
                border: 'none', borderRadius: 8, padding: '10px 20px',
                fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 3px 10px rgba(245,200,66,0.3)',
              }}>+ เพิ่มนักเรียนคนแรก</button>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ background: '#ffffff', border: '1px solid #e8eaed', borderRadius: 14, padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>ไม่พบนักเรียนที่ค้นหา</div>
            </div>
          ) : (
            <div style={{ background: '#ffffff', border: '1px solid #e8eaed', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', animation: 'slideUp 0.3s ease' }}>
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ width: 32, flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ชื่อ-นามสกุล</div>
                <div style={{ width: 60, fontSize: 11, fontWeight: 600, color: '#6b7280', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>รหัส</div>
                <div style={{ width: 50 }} />
              </div>

              {filtered.map((s, i) => (
                <div key={s.id} className="stu-row" style={{ animation: `slideUp 0.2s ease ${i * 0.04}s both` }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, color: '#fff',
                  }}>
                    {s.full_name[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.full_name}
                    </div>
                  </div>
                  <div style={{ width: 60, textAlign: 'center' }}>
                    {s.code ? (
                      <span style={{ fontSize: 11, color: '#6b7280', background: '#f3f4f6', padding: '2px 8px', borderRadius: 99 }}>{s.code}</span>
                    ) : (
                      <span style={{ fontSize: 11, color: '#d1d5db' }}>—</span>
                    )}
                  </div>
                  <button className="del-btn" onClick={() => deleteStudent(s.id)}>ลบ</button>
                </div>
              ))}

              {/* Footer */}
              <div style={{ padding: '10px 16px', background: '#f9fafb', borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>
                  {search ? `พบ ${filtered.length} จาก ${students.length} คน` : `ทั้งหมด ${students.length} คน`}
                </span>
                <button onClick={() => setShowAdd(true)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 11, color: '#f5c842', fontWeight: 600, fontFamily: 'inherit',
                }}>+ เพิ่มนักเรียน</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}