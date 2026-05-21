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
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .login-input:focus-within { border-color: #f5c842 !important; box-shadow: 0 0 0 3px rgba(245,200,66,0.15) !important; }
        .login-input input { background: transparent; border: none; outline: none; width: 100%; font-size: 13px; font-family: inherit; color: #f1f5f9; }
        .login-input input::placeholder { color: #4b5563; }
        .btn-gold { background: linear-gradient(135deg, #f5c842, #e6a800); color: #1a1f2e; font-weight: 700; font-size: 14px; border: none; border-radius: 12px; padding: 14px; width: 100%; cursor: pointer; box-shadow: 0 4px 16px rgba(245,200,66,0.35); transition: all 0.2s; font-family: inherit; }
        .btn-gold:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(245,200,66,0.5); }
        .btn-gold:disabled { opacity: 0.5; cursor: not-allowed; }
        .feature-item { display: flex; align-items: center; gap: 10px; color: rgba(255,255,255,0.8); font-size: 12px; padding: 6px 0; }
        .feature-dot { width: 6px; height: 6px; border-radius: 50%; background: #f5c842; flex-shrink: 0; }
      `}</style>

      <div style={{
        minHeight: '100vh', display: 'flex',
        background: 'linear-gradient(135deg, #0f1117 0%, #1a1f2e 100%)',
        animation: 'fadeIn 0.3s ease',
      }}>

        {/* ── Left Panel (desktop) ── */}
        <div style={{
          display: 'none', flexDirection: 'column', justifyContent: 'space-between',
          width: '42%', padding: '48px 40px',
          background: 'linear-gradient(160deg, #1a1f2e 0%, #12161f 100%)',
          borderRight: '1px solid #252b3b',
          // show on lg
        }}
          className="left-panel">
          <div>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'linear-gradient(135deg, #f5c842, #e6a800)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>🏫</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#f5c842' }}>Class Smart Teacher</div>
                <div style={{ fontSize: 11, color: '#4b5563' }}>ระบบจัดการห้องเรียนอัจฉริยะ</div>
              </div>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.4, marginBottom: 16 }}>
              จัดการห้องเรียน<br />
              <span style={{ color: '#f5c842' }}>ง่าย เร็ว ครบ</span>
            </h2>
            <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.8, marginBottom: 32 }}>
              ระบบเช็คชื่อ บันทึกอาหาร แปรงฟัน ดื่มนม และออมเงิน<br />ในที่เดียว ใช้ได้ทุกอุปกรณ์
            </p>
            <div>
              {[
                'เช็คชื่อนักเรียนด้วยคลิกเดียว',
                'ดูสถิติภาพรวมห้องเรียนทันที',
                'บันทึกกิจกรรมรายวันครบครัน',
                'ใช้ได้ฟรี ไม่มีค่าใช้จ่ายแอบแฝง',
              ].map((t, i) => (
                <div key={i} className="feature-item">
                  <div className="feature-dot" />
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 11, color: '#374151' }}>© 2568 Class Smart Teacher</div>
        </div>

        {/* ── Right: Form ── */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '32px 20px',
        }}>
          <div style={{
            width: '100%', maxWidth: 380,
            animation: 'slideUp 0.35s ease',
          }}>
            {/* Mobile logo */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14, margin: '0 auto 12px',
                background: 'linear-gradient(135deg, #f5c842, #e6a800)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
                boxShadow: '0 8px 24px rgba(245,200,66,0.35)',
              }}>🏫</div>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#f5c842', marginBottom: 4 }}>
                Class Smart Teacher
              </div>
              <div style={{ fontSize: 12, color: '#4b5563' }}>ยินดีต้อนรับกลับมา 👋</div>
            </div>

            {/* Card */}
            <div style={{
              background: '#1e2436',
              border: '1px solid #2d3449',
              borderRadius: 20,
              padding: '28px 24px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>
                เข้าสู่ระบบ
              </h2>

              {/* Error */}
              {error && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: 10, padding: '10px 12px', marginBottom: 16,
                }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
                  <span style={{ fontSize: 12, color: '#fca5a5' }}>{error}</span>
                </div>
              )}

              {/* Email */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#9ca3af', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  อีเมล
                </label>
                <div className="login-input" style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: '#252b3b', border: '1.5px solid #374151',
                  borderRadius: 10, padding: '11px 14px',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}>
                  <span style={{ fontSize: 15, flexShrink: 0 }}>📧</span>
                  <input
                    type="email" value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    placeholder="teacher@email.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#9ca3af', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  รหัสผ่าน
                </label>
                <div className="login-input" style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: '#252b3b', border: '1.5px solid #374151',
                  borderRadius: 10, padding: '11px 14px',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}>
                  <span style={{ fontSize: 15, flexShrink: 0 }}>🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    placeholder="••••••••"
                  />
                  <button onClick={() => setShowPassword(v => !v)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, flexShrink: 0, opacity: 0.6, padding: 0 }}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button onClick={handleLogin} disabled={loading} className="btn-gold">
                {loading ? '⏳ กำลังเข้าสู่ระบบ...' : '🚀 เข้าสู่ระบบ'}
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0' }}>
                <div style={{ flex: 1, height: 1, background: '#252b3b' }} />
                <span style={{ fontSize: 11, color: '#4b5563' }}>หรือ</span>
                <div style={{ flex: 1, height: 1, background: '#252b3b' }} />
              </div>

              <p style={{ textAlign: 'center', fontSize: 12, color: '#4b5563' }}>
                ยังไม่มีบัญชี?{' '}
                <Link href="/register" style={{ color: '#f5c842', fontWeight: 700, textDecoration: 'none' }}>
                  สมัครสมาชิกฟรี →
                </Link>
              </p>
            </div>

            <p style={{ textAlign: 'center', fontSize: 11, color: '#374151', marginTop: 20 }}>
              © 2568 Class Smart Teacher
            </p>
          </div>
        </div>
      </div>
    </>
  )
}