'use client'
import { useState } from 'react'
import { createClient } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName:'', email:'', password:'', phone:'', schoolName:'', province:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  function update(field, value) { setForm(prev => ({ ...prev, [field]: value })) }

  async function handleRegister() {
    if (!form.fullName || !form.email || !form.password || !form.schoolName) {
      setError('กรุณากรอกข้อมูลที่จำเป็นให้ครบ'); return
    }
    if (form.password.length < 6) { setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'); return }
    setLoading(true); setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { data: { full_name: form.fullName, phone: form.phone, school_name: form.schoolName, province: form.province } }
    })
    if (error) setError('สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่')
    else router.push('/dashboard')
    setLoading(false)
  }

  const fields = [
    { key:'fullName',   icon:'👩‍🏫', label:'ชื่อ-นามสกุล',  placeholder:'ครูสมใจ ใจดี',          required:true,  type:'text' },
    { key:'email',      icon:'📧',   label:'อีเมล',           placeholder:'teacher@email.com',      required:true,  type:'email' },
    { key:'password',   icon:'🔒',   label:'รหัสผ่าน',        placeholder:'อย่างน้อย 6 ตัวอักษร',  required:true,  type:'password' },
    { key:'schoolName', icon:'🏫',   label:'ชื่อโรงเรียน',   placeholder:'โรงเรียนบ้านสุขสันต์',   required:true,  type:'text' },
    { key:'phone',      icon:'📱',   label:'เบอร์โทรศัพท์',  placeholder:'08x-xxx-xxxx',           required:false, type:'tel' },
    { key:'province',   icon:'📍',   label:'จังหวัด',          placeholder:'เชียงใหม่',             required:false, type:'text' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'Noto Sans Thai', sans-serif; }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        .field-wrap { display:flex; align-items:center; gap:10px; background:#252b3b; border:1.5px solid #374151; border-radius:10px; padding:11px 14px; transition:border-color 0.15s, box-shadow 0.15s; }
        .field-wrap:focus-within { border-color:#f5c842 !important; box-shadow:0 0 0 3px rgba(245,200,66,0.15) !important; }
        .field-wrap input { background:transparent; border:none; outline:none; flex:1; font-size:14px; font-family:inherit; color:#f1f5f9; }
        .field-wrap input::placeholder { color:#4b5563; }
        .btn-gold { background:linear-gradient(135deg,#f5c842,#e6a800); color:#1a1f2e; font-weight:700; font-size:14px; border:none; border-radius:12px; padding:14px; width:100%; cursor:pointer; box-shadow:0 4px 16px rgba(245,200,66,0.35); transition:all 0.2s; font-family:inherit; }
        .btn-gold:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 24px rgba(245,200,66,0.5); }
        .btn-gold:disabled { opacity:0.5; cursor:not-allowed; }
        @media(min-width:768px) { .left-panel { display:flex !important; } .mobile-logo { display:none !important; } }
      `}</style>

      <div style={{ minHeight:'100vh', display:'flex', background:'linear-gradient(135deg,#0f1117 0%,#1a1f2e 100%)', animation:'fadeIn 0.3s ease' }}>

        {/* Left Panel */}
        <div className="left-panel" style={{
          display:'none', flexDirection:'column', justifyContent:'space-between',
          width:'38%', padding:'48px 40px',
          background:'linear-gradient(160deg,#1a1f2e 0%,#12161f 100%)',
          borderRight:'1px solid #252b3b',
        }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:48 }}>
              <div style={{ width:42, height:42, borderRadius:10, background:'linear-gradient(135deg,#f5c842,#e6a800)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🏫</div>
              <div>
                <div style={{ fontWeight:700, fontSize:15, color:'#f5c842' }}>Class Smart Teacher</div>
                <div style={{ fontSize:11, color:'#4b5563' }}>ระบบจัดการห้องเรียนอัจฉริยะ</div>
              </div>
            </div>
            <h2 style={{ fontSize:26, fontWeight:800, color:'#f1f5f9', lineHeight:1.5, marginBottom:16 }}>
              เริ่มต้นใช้งาน<br/>
              <span style={{ color:'#f5c842' }}>ฟรี ไม่มีค่าใช้จ่าย</span>
            </h2>
            <p style={{ fontSize:13, color:'#6b7280', lineHeight:1.9, marginBottom:32 }}>
              สมัครฟรีภายใน 1 นาที<br/>ไม่ต้องใช้บัตรเครดิต
            </p>
            <div style={{ background:'rgba(245,200,66,0.08)', border:'1px solid rgba(245,200,66,0.2)', borderRadius:14, padding:'16px 20px' }}>
              <div style={{ fontSize:13, fontWeight:600, color:'#f5c842', marginBottom:10 }}>แพลนฟรีรวมถึง:</div>
              {['ห้องเรียน 3 ห้อง','นักเรียนสูงสุด 50 คน/ห้อง','เช็คชื่อ อาหาร แปรงฟัน ดื่มนม ออมเงิน','ข้อมูลเดือนปัจจุบัน'].map((t,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:8, color:'rgba(255,255,255,0.7)', fontSize:12, padding:'4px 0' }}>
                  <span style={{ color:'#f5c842', flexShrink:0 }}>✓</span>{t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ fontSize:11, color:'#374151' }}>© 2568 Class Smart Teacher</div>
        </div>

        {/* Right — Form */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 20px', overflowY:'auto' }}>
          <div style={{ width:'100%', maxWidth:420, animation:'slideUp 0.35s ease' }}>

            {/* Mobile logo */}
            <div className="mobile-logo" style={{ textAlign:'center', marginBottom:28 }}>
              <div style={{ width:56, height:56, borderRadius:14, margin:'0 auto 12px', background:'linear-gradient(135deg,#f5c842,#e6a800)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, boxShadow:'0 8px 24px rgba(245,200,66,0.4)' }}>🏫</div>
              <div style={{ fontWeight:700, fontSize:20, color:'#f5c842', marginBottom:4 }}>Class Smart Teacher</div>
              <div style={{ fontSize:14, color:'#6b7280' }}>สร้างบัญชีใหม่ได้เลย 🎉</div>
            </div>

            {/* Card */}
            <div style={{ background:'#1e2436', border:'1px solid #2d3449', borderRadius:20, padding:'32px 28px', boxShadow:'0 20px 60px rgba(0,0,0,0.4)' }}>
              <h2 style={{ fontSize:18, fontWeight:700, color:'#f1f5f9', marginBottom:6 }}>สมัครสมาชิก</h2>
              <p style={{ fontSize:13, color:'#6b7280', marginBottom:24 }}>
                กรอกข้อมูลด้านล่าง — ใช้เวลาไม่ถึง 1 นาที
              </p>

              {error && (
                <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:10, padding:'10px 14px', marginBottom:18 }}>
                  <span>⚠️</span>
                  <span style={{ fontSize:13, color:'#fca5a5' }}>{error}</span>
                </div>
              )}

              <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:24 }}>
                {fields.map(f => (
                  <div key={f.key}>
                    <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#9ca3af', marginBottom:7, textTransform:'uppercase', letterSpacing:'0.06em' }}>
                      {f.label} {f.required && <span style={{ color:'#f5c842' }}>*</span>}
                    </label>
                    <div className="field-wrap">
                      <span style={{ fontSize:16, flexShrink:0 }}>{f.icon}</span>
                      <input type={f.type} value={form[f.key]} onChange={e => update(f.key, e.target.value)}
                        placeholder={f.placeholder} />
                    </div>
                  </div>
                ))}
              </div>

              <p style={{ fontSize:11, color:'#4b5563', marginBottom:18 }}>
                <span style={{ color:'#f5c842' }}>*</span> จำเป็นต้องกรอก
              </p>

              <button onClick={handleRegister} disabled={loading} className="btn-gold">
                {loading ? '⏳ กำลังสมัคร...' : '🎉 สมัครสมาชิกฟรี'}
              </button>

              <div style={{ display:'flex', alignItems:'center', gap:10, margin:'20px 0' }}>
                <div style={{ flex:1, height:1, background:'#252b3b' }}/>
                <span style={{ fontSize:12, color:'#4b5563' }}>หรือ</span>
                <div style={{ flex:1, height:1, background:'#252b3b' }}/>
              </div>

              <p style={{ textAlign:'center', fontSize:13, color:'#4b5563' }}>
                มีบัญชีแล้ว?{' '}
                <Link href="/login" style={{ color:'#f5c842', fontWeight:700, textDecoration:'none' }}>
                  เข้าสู่ระบบ →
                </Link>
              </p>
            </div>
            <p style={{ textAlign:'center', fontSize:11, color:'#374151', marginTop:20 }}>© 2568 Class Smart Teacher</p>
          </div>
        </div>
      </div>
    </>
  )
}