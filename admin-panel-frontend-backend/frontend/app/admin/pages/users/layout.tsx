import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Пользователи',
  description: 'Users module',
}

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>{children}</>
  )
}
