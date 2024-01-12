import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Слайдер',
  description: 'Slider module',
}

export default function SliderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>{children}</>
  )
}
