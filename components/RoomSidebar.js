// components/RoomSidebar.js
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RoomSidebar({ profile, room, active }) {
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()

  const menuGroups = [
    {
      label: 'ห้องเรียน',
      items: [
        { id: 'home',       label: 'ภาพรวม',          icon: '🏠', path: '' },
        { id: 'attendance', label: 'เช็คชื่อ',          icon: '✅', path: '/attendance' },
        { id: 'students',   label: 'รายชื่อนักเรียน',  icon: '👥', path: '/students' },
      ],
    },
    {
      label: 'กิจกรรมรายวัน',
      items: [
        { id: 'food',    label: 'อาหารกลางวัน', icon: '🍱', path: '/food' },
        { id: 'dental',  label: 'แปรงฟัน',      icon: '🦷', path: '/dental' },
        { id: 'milk',    label: 'ดื่มนม',        icon: '🥛', path: '/milk' },
        { id: 'saving',  label: 'ออมเงิน',       icon: '💰', path: '/saving' },
      ],
    },
    {
      label: 'บันทึก & รายงาน',
      items: [
        { id: 'daily',  label: 'บันทึกรายวัน', icon: '📝', path: '/daily' },
        { id: 'sar',    label: 'SAR ครู',       icon: '📊', path: '/sar' },
        { id: 'eval',   label: 'ประเมินผล',     icon: '📋', path: '/eval' },
      ],
    },
    {
      label: 'ดูแลนักเรียน',
      items: [
        { id: 'learn',  label: 'การเรียนรู้',  icon: '📚', path: '/learn' },
        { id: 'alert',  label: 'แจ้งเตือน',    icon: '🔔', path: '/alert' },
        { id: 'risk',   label: 'กลุ่มเสี่ยง',  icon: '⚠️', path: '/risk' },
      ],
    },
  ]

  function NavBtn({ item }) {
    const isActive = active === item.id
    const basePath = `/room/${room?.id}${item.path}`

    return (
      <button
        title={item.label}
        onClick={() => router.push(basePath)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: collapsed ? 0 : 9,
          width: '100%',
          padding: collapsed ? '10px 0' : '8px 10px',
          borderRadius: 8,
          border: 'none',
          cursor: 'pointer',
          fontSize: 12,
          fontWeight: isActive ? 600 : 500,
          textAlign: 'left',
          background: isActive ? 'rgba(245,200,66,0.12)' : 'transparent',
          color: isActive ? '#f5c842' : '#9ca3af',
          transition: 'all 0.15s',
          marginBottom: 1,
          fontFamily: 'inherit',
          ...(isActive && !collapsed
            ? { boxShadow: 'inset 3px 0 0 #f5c842', paddingLeft: 13 }
            : {}),
        }}
        onMouseEnter={e => {
          if (!isActive) {
            e.currentTarget.style.background = '#252b3b'
            e.currentTarget.style.color = '#e2e8f0'
          }
        }}
        onMouseLeave={e => {
          if (!isActive) {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#9ca3af'
          }
        }}
      >
        <span style={{ fontSize: collapsed ? 18 : 14, flexShrink: 0 }}>{item.icon}</span>
        {!collapsed && item.label}
      </button>
    )
  }

  return (
    <aside style={{
      width: collapsed ? 60 : 220,
      minWidth: collapsed ? 60 : 220,
      background: '#1a1f2e',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      borderRight: '1px solid #252b3b',
      transition: 'width 0.22s cubic-bezier(0.4,0,0.2,1), min-width 0.22s cubic-bezier(0.4,0,0.2,1)',
      overflow: 'hidden',
    }}>

      {/* ── Header: ชื่อห้อง + Toggle ── */}
      <div style={{
        padding: '14px 12px',
        borderBottom: '1px solid #252b3b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        gap: 8,
        minHeight: 64,
      }}>
        {/* ปุ่มกลับ dashboard */}
        <button
          title="กลับหน้าหลัก"
          onClick={() => router.push('/dashboard')}
          style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: 'linear-gradient(135deg, #f5c842, #e6a800)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, border: 'none', cursor: 'pointer',
          }}
        >🏫</button>

        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontWeight: 700, fontSize: 13, color: '#f5c842',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {room?.name || 'ห้องเรียน'}
            </div>
            <div style={{ fontSize: 10, color: '#6b7280', lineHeight: 1.2 }}>
              {room?.subject || 'เช็คชื่อประจำวัน'}
            </div>
          </div>
        )}

        {/* Toggle button */}
        <button
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? 'ขยาย sidebar' : 'ย่อ sidebar'}
          style={{
            background: '#252b3b',
            border: '1px solid #2d3449',
            borderRadius: 6,
            cursor: 'pointer',
            color: '#6b7280',
            fontSize: 11,
            width: 24, height: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            transition: 'color 0.15s, background 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#f5c842'
            e.currentTarget.style.background = '#2d3449'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#6b7280'
            e.currentTarget.style.background = '#252b3b'
          }}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* ── Nav Groups ── */}
      <nav style={{ flex: 1, padding: '10px 10px 0', overflowY: 'auto', overflowX: 'hidden' }}>
        {menuGroups.map((group, gi) => (
          <div key={gi} style={{ marginBottom: 8 }}>
            {/* Group label — ซ่อนเมื่อ collapsed */}
            {!collapsed && (
              <div style={{
                fontSize: 9, color: '#4b5563',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                fontWeight: 700, padding: '0 8px 5px',
                marginTop: gi > 0 ? 6 : 0,
              }}>
                {group.label}
              </div>
            )}
            {/* Divider เมื่อ collapsed */}
            {collapsed && gi > 0 && (
              <div style={{ height: 1, background: '#252b3b', margin: '6px 8px' }} />
            )}
            {group.items.map(item => <NavBtn key={item.id} item={item} />)}
          </div>
        ))}
      </nav>

      {/* ── Profile pill (ย่อ) ── */}
      {!collapsed && profile && (
        <div style={{
          margin: '8px 10px',
          padding: '8px 12px',
          borderRadius: 10,
          background: '#252b3b',
          border: '1px solid #2d3449',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #f5c842, #e6a800)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#1a1f2e',
          }}>
            {(profile.full_name || 'T')[0]}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 11, fontWeight: 600, color: '#e2e8f0',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {profile.full_name || 'คุณครู'}
            </div>
            <span style={{
              fontSize: 9, padding: '1px 5px', borderRadius: 99,
              background: profile.plan_id === 'free' ? '#1a3a2a' : '#2d1f4e',
              color: profile.plan_id === 'free' ? '#4ade80' : '#a78bfa',
              fontWeight: 600,
            }}>
              {profile.plan_id === 'free' ? 'ฟรี' : 'Pro'}
            </span>
          </div>
        </div>
      )}

      {/* ── Back to Dashboard button ── */}
      <div style={{ borderTop: '1px solid #252b3b' }}>
        <button
          onClick={() => router.push('/dashboard')}
          title="กลับหน้าหลัก"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: collapsed ? 0 : 9,
            width: '100%',
            padding: collapsed ? '14px 0' : '12px 18px',
            border: 'none',
            cursor: 'pointer',
            background: 'transparent',
            fontSize: collapsed ? 18 : 12,
            fontWeight: 500,
            color: '#6b7280',
            transition: 'background 0.15s, color 0.15s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#252b3b'
            e.currentTarget.style.color = '#e2e8f0'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#6b7280'
          }}
        >
          <span>←</span>
          {!collapsed && ' กลับหน้าหลัก'}
        </button>
      </div>
    </aside>
  )
}