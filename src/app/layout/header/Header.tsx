'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import { AiFillHeart } from 'react-icons/ai'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'

import { useAuth } from '@/hooks/useAuth'
import { useIsAdminPanel } from '@/hooks/useIsAdminPanel'

import HeaderProfile from './HeaderProfile'
import Search from './Search'
import HeaderCart from './cart/HeaderCart'

const Header: FC = () => {
	const { isAdminPanel } = useIsAdminPanel()
	const { user } = useAuth()

	return (
		<header
			className='bg-secondary w-full py-6 px-6 grid'
			style={{
				gridTemplateColumns: '0.43fr 0.4fr 0.3fr 0.3fr 0.3fr 0.3fr 0.7fr',
				gap: '10px',
				alignItems: 'center'
			}
		}
		>
			<Link href='/'>
				{isAdminPanel ? (
					<h2 className=
						'text-3xl text-white font-semibold'>Admin Panel</h2>
				) : (
					<h1 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '34px' }}>StroyMarket</h1>

				)}
			</Link>
			<Search />
			<span>
			</span>
					<Link 
						href='/explorer'
                         className= 'hover:text-primary transition-colors duration-200 text-white inline-block text-lg'
						 >
                            Каталог
                    </Link>
					<Link 
						href='/map'
                         className= 'hover:text-primary transition-colors duration-200 text-white inline-block text-lg'
						 >
                            Доставка
                    </Link>
					<Link 
						href='/O_NAS'
                         className= 'hover:text-primary transition-colors duration-200 text-white inline-block text-lg'
						 >
                            О нас
                    </Link>
					
			<div 
				className='flex align-end justify-end gap-10'>
				{user?.isAdmin && !isAdminPanel && (
					<Link
						href='/admin'
						className='hover:text-primary transition-colors duration-200 text-white inline-block text-lg'
					>
						<MdOutlineAdminPanelSettings size={40} />
					</Link>
				)}
				<Link href='/favorites'
				 className='hover:text-red transition-colors duration-200 text-white inline-block text-lg'>
					<AiFillHeart size={40} />
				</Link>
				<HeaderCart />
				<HeaderProfile />
			</div>
		</header>
	)
}

export default Header
