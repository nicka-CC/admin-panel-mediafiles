
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Вход',
  description: 'Login module',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>{children}</>
  )
}
