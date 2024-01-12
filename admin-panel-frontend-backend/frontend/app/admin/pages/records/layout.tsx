
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Записи',
  description: 'Records module',
}

export default function RecordsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>{children}</>
  )
}
