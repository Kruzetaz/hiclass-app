import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{background: 'linear-gradient(160deg, #fff8f0 0%, #ffe8cc 100%)'}}>

      {/* Logo Circle */}
      <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-lg"
        style={{background: 'linear-gradient(135deg, #e07b39, #f5a25d)'}}>
        🍎
      </div>

      {/* ชื่อแอป */}
      <h1 className="text-3xl font-bold mb-2 text-center" style={{color: '#e07b39'}}>
        Class Smart Teacher
      </h1>
      <p className="text-sm text-center mb-10" style={{color: '#b08060'}}>
        ระบบจัดการห้องเรียนสำหรับครู
      </p>

      {/* Features */}
      <div className="w-full max-w-sm mb-10">
        {[
          { icon: '✅', text: 'เช็คชื่อนักเรียนได้ง่ายๆ' },
          { icon: '🍱', text: 'ติดตามอาหารกลางวัน' },
          { icon: '💰', text: 'บันทึกการออมเงิน' },
          { icon: '📊', text: 'ดูรายงานสรุปได้ทันที' },
        ].map((f, i) => (
          <div key={i} className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{background: 'white', boxShadow: '0 2px 8px rgba(224,123,57,0.15)'}}>
              {f.icon}
            </div>
            <p className="text-sm font-medium" style={{color: '#7a5c44'}}>{f.text}</p>
          </div>
        ))}
      </div>

      {/* ปุ่ม */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        <Link href="/login"
          className="block text-center text-white py-4 rounded-2xl font-bold text-base shadow-md hover:opacity-90 transition"
          style={{background: 'linear-gradient(135deg, #e07b39, #f5a25d)'}}>
          เข้าสู่ระบบ
        </Link>
        <Link href="/register"
          className="block text-center py-4 rounded-2xl font-bold text-base border-2 hover:opacity-80 transition bg-white"
          style={{color: '#e07b39', borderColor: '#e07b39'}}>
          สมัครสมาชิกใหม่
        </Link>
      </div>

      <p className="text-xs mt-8" style={{color: '#c4a882'}}>
        Class Smart Teacher © 2025
      </p>
    </div>
  )
}