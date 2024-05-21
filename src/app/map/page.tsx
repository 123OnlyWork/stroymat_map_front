import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: 'Delivery calc',
}

export const revalidate = 60

const MapComponent = dynamic(() => import('./Dostavka'), {
  ssr: false, // Disable server-side rendering for this component
})

export default function DeliveryMapPage() {
  return (
    <div>
      <MapComponent />
    </div>
  )
}
