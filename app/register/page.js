'use client'
import { useState } from 'react'
import { createClient } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '', schoolName: '', province: '' })
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
    { key: 'fullName',   icon: '👩‍🏫', label: 'ชื่อ-นามสกุล',  placeholder: 'ครูสมใจ ใจดี',         required: true,  type: 'text' },
    { key: 'email',      icon: '📧',   label: 'อีเมล',           placeholder: 'teacher@email.com',     required: true,  type: 'email' },
    { key: 'password',   icon: '🔒',   label: 'รหัสผ่าน',        placeholder: 'อย่างน้อย 6 ตัวอักษร', required: true,  type: 'password' },
    { key: 'schoolName', icon: '🏫',   label: 'ชื่อโรงเรียน',   placeholder: 'โรงเรียนบ้านสุขสันต์',  required: true,  type: 'text' },
    { key: 'phone',      icon: '📱',   label: 'เบอร์โทรศัพท์',   placeholder: '08x-xxx-xxxx',          required: false, type: 'tel' },
    { key: 'province',   icon: '📍',   label: 'จังหวัด',          placeholder: 'เชียงใหม่',            required: false, type: 'text' },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{background: 'linear-gradient(160deg, #fff8f0 0%, #ffe8cc 100%)'}}>

      {/* Logo */}
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-5 shadow-lg"
        style={{background: 'linear-gradient(135deg, #e07b39, #f5a25d)'}}>
        🍎
      </div>
      <h1 className="text-2xl font-bold mb-1 text-center" style={{color: '#e07b39'}}>
        Class Smart Teacher
      </h1>
      <p className="text-sm text-center mb-8" style={{color: '#b08060'}}>
        สร้างบัญชีใหม่ได้เลย 🎉
      </p>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-md p-7 border border-orange-100">

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 mb-5">
            <span>⚠️</span>
            <p className="text-sm" style={{color: '#e53935'}}>{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-4 mb-7">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-sm font-semibold mb-2" style={{color: '#555'}}>
                {f.label} {f.required && <span style={{color: '#e07b39'}}>*</span>}
              </label>
              <div className="flex items-center border border-gray-200 rounded-2xl px-4 py-3 gap-3 focus-within:border-orange-300 transition" style={{background: '#fafafa'}}>
                <span>{f.icon}</span>
                <input type={f.type} value={form[f.key]} onChange={e => update(f.key, e.target.value)}
                  className="flex-1 text-sm bg-transparent focus:outline-none" style={{color: '#333'}}
                  placeholder={f.placeholder} />
              </div>
            </div>
          ))}
        </div>

        <button onClick={handleRegister} disabled={loading}
          className="w-full text-white py-4 rounded-2xl font-bold text-base hover:opacity-90 disabled:opacity-50 transition shadow-sm"
          style={{background: 'linear-gradient(135deg, #e07b39, #f5a25d)'}}>
          {loading ? '⏳ กำลังสมัคร...' : 'สมัครสมาชิก'}
        </button>

        <p className="text-center text-sm mt-5" style={{color: '#aaa'}}>
          มีบัญชีแล้ว?{' '}
          <Link href="/login" className="font-bold" style={{color: '#e07b39'}}>เข้าสู่ระบบ</Link>
        </p>
      </div>

      <p className="text-xs mt-8" style={{color: '#c4a882'}}>Class Smart Teacher © 2025</p>
    </div>
  )
}