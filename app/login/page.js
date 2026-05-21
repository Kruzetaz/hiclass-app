'use client'
import { useState } from 'react'
import { createClient } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  async function handleLogin() {
    if (!email || !password) { setError('กรุณากรอกข้อมูลให้ครบ'); return }
    setLoading(true); setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    else router.push('/dashboard')
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Noto Sans Thai', sans-serif; }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        .field-wrap { display:flex; align-items:center; gap:10px; background:#252b3b; border:1.5px solid #374151; border-radius:10px; padding:12px 14px; transition:border-color 0.15s, box-shadow 0.15s; }
        .field-wrap:focus-within { border-color:#f5c842 !important; box-shadow:0 0 0 3px rgba(245,200,66,0.15) !important; }
        .field-wrap input { background:transparent; border:none; outline:none; flex:1; font-size:14px; font-family:inherit; color:#f1f5f9; }
        .field-wrap input::placeholder { color:#4b5563; }
        .btn-gold { background:linear-gradient(135deg,#f5c842,#e6a800); color:#1a1f2e; font-weight:700; font-size:14px; border:none; border-radius:12px; padding:14px; width:100%; cursor:pointer; box-shadow:0 4px 16px rgba(245,200,66,0.35); transition:all 0.2s; font-family:inherit; }
        .btn-gold:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 24px rgba(245,200,66,0.5); }
        .btn-gold:disabled { opacity:0.5; cursor:not-allowed; }
        @media(min-width:768px) { .left-panel { display:flex !important; } .mobile-logo { display:none !important; } }
      `}</style>

      <div style={{ minHeight:'100vh', display:'flex', background:'linear-gradient(135deg,#0f1117 0%,#1a1f2e 100%)', animation:'fadeIn 0.3s ease' }}>

        {/* Left Panel — desktop only */}
        <div className="left-panel" style={{
          display:'none', flexDirection:'column', justifyContent:'space-between',
          width:'42%', padding:'48px 40px',
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
            <h2 style={{ fontSize:28, fontWeight:800, color:'#f1f5f9', lineHeight:1.5, marginBottom:16 }}>
              จัดการห้องเรียน<br/>
              <span style={{ color:'#f5c842' }}>ง่าย เร็ว ครบ</span>
            </h2>
            <p style={{ fontSize:13, color:'#6b7280', lineHeight:1.9, marginBottom:32 }}>
              ระบบเช็คชื่อ บันทึกอาหาร แปรงฟัน<br/>ดื่มนม และออมเงิน ในที่เดียว
            </p>
            <div style={{ background:'rgba(245,200,66,0.08)', border:'1px solid rgba(245,200,66,0.2)', borderRadius:14, padding:'16px 20px' }}>
              <div style={{ fontSize:13, fontWeight:600, color:'#f5c842', marginBottom:10 }}>ทำไมต้องใช้ Class Smart Teacher?</div>
              {['ใช้งานง่าย ไม่ต้องฝึกอบรม','ข้อมูลปลอดภัย เก็บบน Cloud','รองรับทุกอุปกรณ์ มือถือ แท็บเล็ต PC','อัพเดทฟีเจอร์ใหม่ตลอดเวลา'].map((t,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:8, color:'rgba(255,255,255,0.7)', fontSize:12, padding:'4px 0' }}>
                  <span style={{ color:'#f5c842', flexShrink:0 }}>✓</span>{t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ fontSize:11, color:'#374151' }}>© 2568 Class Smart Teacher</div>
        </div>

        {/* Right — Form */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 20px' }}>
          <div style={{ width:'100%', maxWidth:400, animation:'slideUp 0.35s ease' }}>

            {/* Mobile logo */}
            <div className="mobile-logo" style={{ textAlign:'center', marginBottom:32 }}>
              <div style={{ width:60, height:60, borderRadius:16, margin:'0 auto 14px', background:'linear-gradient(135deg,#f5c842,#e6a800)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, boxShadow:'0 8px 24px rgba(245,200,66,0.4)' }}>🏫</div>
              <div style={{ fontWeight:700, fontSize:20, color:'#f5c842', marginBottom:6 }}>Class Smart Teacher</div>
              <div style={{ fontSize:14, color:'#6b7280' }}>ยินดีต้อนรับกลับมา 👋</div>
            </div>

            {/* Card */}
            <div style={{ background:'#1e2436', border:'1px solid #2d3449', borderRadius:20, padding:'32px 28px', boxShadow:'0 20px 60px rgba(0,0,0,0.4)' }}>
              <h2 style={{ fontSize:18, fontWeight:700, color:'#f1f5f9', marginBottom:6 }}>เข้าสู่ระบบ</h2>
              <p style={{ fontSize:13, color:'#6b7280', marginBottom:24 }}>กรอกอีเมลและรหัสผ่านของคุณ</p>

              {error && (
                <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:10, padding:'10px 14px', marginBottom:18 }}>
                  <span>⚠️</span>
                  <span style={{ fontSize:13, color:'#fca5a5' }}>{error}</span>
                </div>
              )}

              <div style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#9ca3af', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em' }}>อีเมล</label>
                <div className="field-wrap">
                  <span style={{ fontSize:16, flexShrink:0 }}>📧</span>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="teacher@email.com" />
                </div>
              </div>

              <div style={{ marginBottom:28 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#9ca3af', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em' }}>รหัสผ่าน</label>
                <div className="field-wrap">
                  <span style={{ fontSize:16, flexShrink:0 }}>🔒</span>
                  <input type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="••••••••" />
                  <button onClick={() => setShowPassword(v => !v)}
                    style={{ background:'none', border:'none', cursor:'pointer', fontSize:16, opacity:0.5, padding:0, flexShrink:0 }}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button onClick={handleLogin} disabled={loading} className="btn-gold">
                {loading ? '⏳ กำลังเข้าสู่ระบบ...' : '🚀 เข้าสู่ระบบ'}
              </button>

              <div style={{ display:'flex', alignItems:'center', gap:10, margin:'20px 0' }}>
                <div style={{ flex:1, height:1, background:'#252b3b' }}/>
                <span style={{ fontSize:12, color:'#4b5563' }}>หรือ</span>
                <div style={{ flex:1, height:1, background:'#252b3b' }}/>
              </div>

              <p style={{ textAlign:'center', fontSize:13, color:'#4b5563' }}>
                ยังไม่มีบัญชี?{' '}
                <Link href="/register" style={{ color:'#f5c842', fontWeight:700, textDecoration:'none' }}>
                  สมัครสมาชิกฟรี →
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