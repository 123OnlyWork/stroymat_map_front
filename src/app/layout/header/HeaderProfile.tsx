'use client'
import { FiLogOut } from 'react-icons/fi'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/ui/button/Button'
import { FC, useRef, useState } from 'react' // Добавляем useState для хранения состояния авторизации

import { useProfile } from '@/hooks/useProfile'

import { useActions } from '@/hooks/useActions'
import { useAuth } from '@/hooks/useAuth'

const HeaderProfile: FC = () => {
	const { profile } = useProfile()
	const { user } = useAuth()
	const { logout } = useActions()

	const [isDropdownOpen, setIsDropdownOpen] = useState(false) // Состояние для отображения выпадающего меню
	const dropdownRef = useRef<HTMLDivElement>(null) // Создаем ссылку на div с выпадающим меню

	
					
	// Обработчик клика по кнопке аватара
	const handleAvatarClick = () => {
		setIsDropdownOpen(!isDropdownOpen) // Переключаем состояние отображения выпадающего меню
	}

	return (
		<div className='relative' style={{ flexShrink: 0 }}>
			<button onClick={handleAvatarClick}>
				<Image
					width={40}
					height={40}
					src={profile?.avatarPath || 'https://cdn-icons-png.flaticon.com/512/1085/1085409.png'} // Указываем путь к дефолтному аватару, если аватар не загружен
					alt='profile'
				/>
			</button>
			{/* Выпадающее меню */}

			<div
				ref={dropdownRef}
				className={`absolute w-40 right-2 z-20 ${isDropdownOpen ? '' : 'hidden'}`} // Отображаем или скрываем выпадающее меню в зависимости от состояния
				style={{
					top: 'calc(100% + 1rem)'
				}}
			>
				{!user && (
                    <Link 
						href='/favorites'
                         className= 'bg-white shadow py-2 px-4 block w-full rounded-md hover:text-primary duration-300 transition-colors'
						 >
                            Войти в аккаунт
                        
                    </Link>
                )}
				{!!user && (
				<Link
					href='/my-orders'
					className='bg-white shadow py-2 px-4 block w-full rounded-md hover:text-primary duration-300 transition-colors'
				>
					Заказы
				</Link>
				)}
				{!!user && (
					<button
						className='bg-white shadow py-2 px-4 block w-full rounded-md hover:text-primary duration-300 transition-colors'
						onClick={() => logout()}
					>
						Выход
					</button>
				)}
			</div>
		</div>
	)
}

export default HeaderProfile	
