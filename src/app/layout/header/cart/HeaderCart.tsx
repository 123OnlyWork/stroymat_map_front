'use client'

import Link from 'next/link'
import { FC } from 'react'
import { RiShoppingCartLine } from 'react-icons/ri'
import { RiShoppingCart2Fill } from 'react-icons/ri';

import SquareButton from '@/ui/button/SquareButton'

import { useCart } from '@/hooks/useCart'
import { useOutside } from '@/hooks/useOutside'

import { convertPrice } from '@/utils/convertPrice'

import styles from './Cart.module.scss'
import CartItem from './cart-item/CartItem'

const Cart: FC = () => {
	const { isShow, setIsShow, ref } = useOutside(false)

	const { items, total } = useCart()

	return (
		<div 
		className=' relative' ref={ref}>
			<SquareButton
				Icon={RiShoppingCart2Fill}
				onClick={() => {
					setIsShow(!isShow)
				}}
				number={items.length}
			/>

			{isShow && (
				<div className={styles.cartWrapper}>
					<div 
						className=' font-normal text-lg mb-5'>Корзина</div>

					<div className={styles.cart}>
						{items.length ? (
							items.map(item => <CartItem item={item} key={item.id} />)
						) : (
							<div 
								className='font-light'>Нет товаров!</div>
						)}
					</div>
					<div className={styles.footer}>
						<div>Цена:</div>
						<div>{convertPrice(total)}</div>
					</div>
					{!!items.length && (
						<div
							 className=' text-center mt-7 mb-7'>
							<Link
								className=''
								href='/checkout'
								onClick={() => setIsShow(false)}
							>
								К оформлению заказа
							</Link>
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default Cart
