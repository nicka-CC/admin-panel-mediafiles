import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Страницы',
  description: 'Pages module',
}

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>{children}</>
  )
}
