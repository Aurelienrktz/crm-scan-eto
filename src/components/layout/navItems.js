import { LayoutDashboard, Users, Clock, Handshake } from 'lucide-react'

export const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/prospects', label: 'Prospects', icon: Users },
  { to: '/relances', label: 'À relancer', icon: Clock },
  { to: '/clients', label: 'Clients', icon: Handshake },
]
