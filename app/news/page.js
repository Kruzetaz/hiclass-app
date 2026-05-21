'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase'

const NEWS = [
  {
    id: 1, tag: 'ฟีเจอร์ใหม่', tagColor: '#f5c842', tagBg: 'rgba(245,200,66,0.12)',
    emoji: '✨', title: 'เพิ่มระบบบันทึกการออมเงินนักเรียน',
    date: '20 พ.ค. 2568',
    desc: 'ครูสามารถบันทึกยอดฝาก-ถอนรายวันของนักเรียนได้แล้ว พร้อมดูยอดรวมรายห้องอัตโนมัติ',
    full: 'ฟีเจอร์ออมเงินใหม่ช่วยให้ครูบันทึกการออมเงินของนักเรียนได้ทุกวัน ระบบจะแสดงยอดสะสมรายคนและรายห้อง สามารถบันทึกทั้งยอดฝากและยอดถอน เหมาะสำหรับโครงการออมทรัพย์ในโรงเรียน เริ่มใช้งานได้เลยที่เมนู "ออมเงิน" ในห้องเรียนของคุณ',
  },
  {
    id: 2, tag: 'อัปเดต', tagColor: '#3b82f6', tagBg: 'rgba(59,130,246,0.12)',
    emoji: '🎨', title: 'ปรับปรุง UI หน้า Dashboard ใหม่ทั้งหมด',
    date: '15 พ.ค. 2568',
    desc: 'รีดีไซน์หน้าหลักให้ดูทันสมัย Sidebar สีกรมท่า accent ทอง และ Card ห้องเรียนใหม่',
    full: 'อัปเดต UI ครั้งใหญ่! หน้า Dashboard ได้รับการรีดีไซน์ใหม่ทั้งหมด ด้วย Sidebar สีกรมท่า (#1a1f2e) accent สีทอง (#f5c842) Card ห้องเรียนที่ดูทันสมัย และ Topbar สีขาวสะอาด ระบบรองรับการใช้งานบนมือถือด้วย',
  },
  {
    id: 3, tag: 'แจกฟรี', tagColor: '#10b981', tagBg: 'rgba(16,185,129,0.12)',
    emoji: '🎁', title: 'แจกฟรี!! เทมเพลตรายงานสรุปห้องเรียน',
    date: '10 พ.ค. 2568',
    desc: 'ดาวน์โหลดเทมเพลต Google Sheets สำหรับสรุปผลการเข้าเรียนรายเดือน พร้อมกราฟอัตโนมัติ',
    full: 'เทมเพลต Google Sheets สำหรับสรุปผลการเข้าเรียนรายเดือน ประกอบด้วยตารางบันทึกการเข้าเรียน กราฟแสดงสถิติ และช่องสรุปผลรายนักเรียน ดาวน์โหลดได้ฟรีและนำไปใช้ได้ทันที ไม่มีค่าใช้จ่าย',
  },
  {
    id: 4, tag: 'ประกาศ', tagColor: '#a78bfa', tagBg: 'rgba(167,139,250,0.12)',
    emoji: '📣', title: 'เปิดตัว Class Smart Teacher เวอร์ชันใหม่',
    date: '1 พ.ค. 2568',
    desc: 'ระบบจัดการห้องเรียนครบวงจร เช็คชื่อ อาหาร แปรงฟัน ดื่มนม และออมเงิน ในที่เดียว',
    full: 'Class Smart Teacher เวอร์ชันใหม่พร้อมให้บริการแล้ว! ระบบจัดการห้องเรียนครบวงจรสำหรับครูไทย รองรับการเช็คชื่อนักเรียน บันทึกอาหารกลางวัน แปรงฟัน ดื่มนม และออมเงิน ทั้งหมดในที่เดียว ใช้ฟรีสูงสุด 3 ห้องเรียน',
  },
]

function Sidebar({ active }) {
  const router = useRouter()
  const supabase = createClient()
  const nav = [
    { id: 'dashboard', label: 'ห้องเรียนของฉัน', icon: '🏠', href: '/dashboard' },
    { id: 'news',      label: 'ประชาสัมพันธ์',    icon: '📢', href: '/news' },
    { id: 'profile',   label: 'ข้อมูลส่วนตัว',    icon: '👤', href: '/profile' },
    { id: 'upgrade',   label: 'สมัครแผน',          icon: '✨', href: '/upgrade' },
  ]
  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
  }
  return (
    <aside style={{ width: 220, minWidth: 220, background: '#1a1f2e', display: 'flex', flexDirection: 'column', height: '100%', borderRight: '1px solid #252b3b' }}>
      <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid #252b3b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #f5c842, #e6a800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏫</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#f5c842' }}>Class Smart</div>
            <div style={{ fontSize: 10, color: '#6b7280' }}>Teacher</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        <div style={{ fontSize: 9, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, padding: '0 8px 6px' }}>เมนู</div>
        {nav.map(item => {
          const isActive = active === item.id
          return (
            <button key={item.id} onClick={() => router.push(item.href)}
              style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '9px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: isActive ? 600 : 500, textAlign: 'left', background: isActive ? 'rgba(245,200,66,0.12)' : 'transparent', color: isActive ? '#f5c842' : '#9ca3af', transition: 'all 0.15s', marginBottom: 2, ...(isActive ? { boxShadow: 'inset 3px 0 0 #f5c842', paddingLeft: 13 } : {}) }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#252b3b'; e.currentTarget.style.color = '#e2e8f0' } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9ca3af' } }}>
              <span style={{ fontSize: 14 }}>{item.icon}</span>{item.label}
            </button>
          )
        })}
      </nav>
      <div style={{ margin: '0 10px 8px', padding: '10px 12px', borderRadius: 10, background: '#252b3b', border: '1px solid #2d3449' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 9, color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>Storage</span>
          <span style={{ fontSize: 9, color: '#6b7280' }}>0%</span>
        </div>
        <div style={{ height: 3, background: '#374151', borderRadius: 99 }}>
          <div style={{ height: 3, width: '0%', background: '#f5c842', borderRadius: 99 }} />
        </div>
      </div>
      <div style={{ borderTop: '1px solid #252b3b' }}>
        <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '12px 18px', border: 'none', cursor: 'pointer', background: 'transparent', fontSize: 12, color: '#ef4444', transition: 'background 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
          <span>🚪</span> ออกจากระบบ
        </button>
      </div>
    </aside>
  )
}

export default function NewsPage() {
  const [selected, setSelected] = useState(null)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Noto Sans Thai', sans-serif; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        .news-card { background: #ffffff; border: 1px solid #e8eaed; border-radius: 14px; padding: 18px 20px; cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
        .news-card:hover { border-color: #f5c842; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08), 0 0 0 2px rgba(245,200,66,0.2); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.35); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 50; animation: fadeIn 0.15s ease; padding: 20px; }
        .modal-box { background: #ffffff; border-radius: 20px; padding: 28px; width: 100%; max-width: 480px; box-shadow: 0 25px 60px rgba(0,0,0,0.2); animation: slideUp 0.2s ease; }
      `}</style>

      <div style={{ display: 'flex', height: '100vh', background: '#f4f5f7', overflow: 'hidden' }}>
        <Sidebar active="news" />

        <main style={{ flex: 1, overflowY: 'auto' }}>
          {/* Topbar */}
          <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#ffffff', borderBottom: '1px solid #e9eaec', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '11px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>📢</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>ประชาสัมพันธ์</span>
            <span style={{ fontSize: 11, color: '#9ca3af' }}>ข่าวสารและอัปเดตจาก Class Smart Teacher</span>
          </div>

          <div style={{ padding: 24 }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #1a1f2e 0%, #252d42 100%)', borderRadius: 16, padding: '20px 24px', marginBottom: 20, position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
              <div style={{ position: 'absolute', top: -15, right: -15, width: 100, height: 100, borderRadius: '50%', background: 'rgba(245,200,66,0.06)', border: '1px solid rgba(245,200,66,0.1)' }} />
              <div style={{ fontSize: 10, color: '#f5c842', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>📌 ข่าวสารล่าสุด</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>ประชาสัมพันธ์</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>อัปเดตฟีเจอร์ใหม่ ข่าวสาร และสิ่งที่น่าสนใจจากทีมงาน</div>
            </div>

            {/* News Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
              {NEWS.map((n, i) => (
                <div key={n.id} className="news-card"
                  onClick={() => setSelected(n)}
                  style={{ animation: `slideUp 0.25s ease ${i * 0.06}s both` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: n.tagBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{n.emoji}</div>
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, fontWeight: 700, background: n.tagBg, color: n.tagColor }}>{n.tag}</span>
                    </div>
                    <span style={{ fontSize: 10, color: '#9ca3af' }}>{n.date}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#111827', marginBottom: 6, lineHeight: 1.5 }}>{n.title}</div>
                  <div style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.6 }}>{n.desc}</div>
                  <div style={{ marginTop: 12, fontSize: 11, color: '#f5c842', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    อ่านต่อ <span>→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      {selected && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="modal-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: selected.tagBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{selected.emoji}</div>
              <div>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, fontWeight: 700, background: selected.tagBg, color: selected.tagColor }}>{selected.tag}</span>
                <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>{selected.date}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#9ca3af', padding: 4 }}>✕</button>
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 10, lineHeight: 1.5 }}>{selected.title}</div>
            <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.8, borderTop: '1px solid #f3f4f6', paddingTop: 12 }}>{selected.full}</div>
            <button onClick={() => setSelected(null)}
              style={{ marginTop: 20, width: '100%', padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #f5c842, #e6a800)', color: '#1a1f2e', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}>
              ปิด
            </button>
          </div>
        </div>
      )}
    </>
  )
}