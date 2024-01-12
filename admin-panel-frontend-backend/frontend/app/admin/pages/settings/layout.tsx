import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Настройки',
  description: 'Settings module',
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>{children}</>
  )
}
