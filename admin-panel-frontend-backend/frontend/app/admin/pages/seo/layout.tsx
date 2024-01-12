import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SEO',
  description: 'SEO module',
}

export default function SEOLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>{children}</>
  )
}
