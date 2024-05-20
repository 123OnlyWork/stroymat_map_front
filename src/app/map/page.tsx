// page.tsx
import type { Metadata } from 'next'
import { useEffect, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import MapComponent from './Dostavka'

export const metadata: Metadata = {
  title: 'Карта доставки',
}

export const revalidate = 60

export default function DeliveryMapPage() {
  return (
    <div>
      <MapComponent />
    </div>
  )
}
