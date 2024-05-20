import { ISelectItem } from '@/ui/select/select.interface'

import { EnumProductSort } from '@/services/product/product.types'

export const SORT_SELECT_DATA: ISelectItem<EnumProductSort>[] = [
	{
		key: EnumProductSort.HIGH_PRICE,
		label: 'Максимальная цена '
	},
	{
		key: EnumProductSort.LOW_PRICE,
		label: 'Минимальная цена'
	},
	{
		key: EnumProductSort.NEWEST,
		label: 'Недавно добавленные'
	},
	{
		key: EnumProductSort.OLDEST,
		label: 'Давно добавленные'
	}
]
