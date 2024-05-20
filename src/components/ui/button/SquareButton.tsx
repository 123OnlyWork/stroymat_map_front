import { FC } from 'react'
import { IconType } from 'react-icons'


interface ISquareButton {
	Icon: IconType
	onClick?: () => void
	number?: number
}

const SquareButton: FC<ISquareButton> = ({ Icon, onClick, number }) => {
	return (
		<button
			onClick={onClick}
		>
			{!!number && (
				<span
					 className='flex h-4 w-4 items-center justify-center rounded-full bg-white p-0.5 text-[0.75rem] text-red absolute -top-1 -right-1'>
					{number}
				</span>
			)}
			<Icon 
				className='text-white items-center justify-center' size={40} />
		</button>
	)
}

export default SquareButton
