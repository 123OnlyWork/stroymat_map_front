import Link from 'next/link'

import Heading from '@/ui/Heading'

export default function NotFound() {
	return (
		<>
			<Heading>Не найдено </Heading>
			<p>Не удалось найти запрошенный ресурс</p>
			<p>
				View{' '}
				<Link href='/explorer' className='text-primary'>
					Все товары:
				</Link>
			</p>
		</>
	)
}
