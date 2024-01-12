import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Медиа',
  description: 'Media module',
}

export default function MediaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>{children}</>
  )
}
