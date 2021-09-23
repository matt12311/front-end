import { COLORS } from 'constants/ChartConstant';

export const weeklyRevenueData = {
	series: [
	  {
		name: 'Earning',
		data: []
	  }
	],
	categories:[
	]
}

export const topProductData = [
	{
		name: 'Blue Jacket',
		image: '/img/thumbs/thumb-7.jpg',
		category: 'Cloths',
		sales: 0,
		status: 'up'
	},
	{
		name: 'White Sneaker',
		image: '/img/thumbs/thumb-12.jpg',
		category: 'Cloths',
		sales: 0,
		status: 'up'
	},
	{
		name: 'Red Beat Headphone',
		image: '/img/thumbs/thumb-14.jpg',
		category: 'Devices',
		sales: 0,
		status: 'down'
	},
	{
		name: 'Apple Watch',
		image: '/img/thumbs/thumb-17.jpg',
		category: 'Devices',
		sales: 0,
		status: 'up'
	},
	{
		name: 'Blue Backpack',
		image: '/img/thumbs/thumb-11.jpg',
		category: 'Bags',
		sales: 0,
		status: 'down'
	},
]

export const customerChartData = [
	{
		name: 'Store Customers',
		data: [0, 0, 0, 0, 0, 0, 0]
	}
]

export const sessionColor = [COLORS[0], COLORS[1], COLORS[3], COLORS[5]]
export const sessionData = [0, 0, 0, 0]
export const sessionLabels = ['Cloths', 'Devices', 'Bags', 'Watches']
const jointSessionData = () => {
	let arr = []
	for (let i = 0; i < sessionData.length; i++) {
		const data = sessionData[i];
		const label = sessionLabels[i];
		const color = sessionColor[i]
		arr = [...arr, {
			data: data,
			label: label,
			color: color
		}]
	}
	return arr
}
export const conbinedSessionData = jointSessionData()

export const recentOrderData = [
	{
		id: '#5331',
		name: 'Eileen Horton',
		image: '/img/avatars/thumb-1.jpg',
		date: 1573430400,
		amount: 677,
		paymentStatus: 'Paid',
		orderStatus: 'Ready'
	},
	{
		id: '#5328',
		name: 'Terrance Moreno',
		image: '/img/avatars/thumb-2.jpg',
		date: 1572393600,
		amount: 1328.35,
		paymentStatus: 'Paid',
		orderStatus: 'Ready'
	},
	{
		id: '#5321',
		name: 'Ron Vargas',
		image: '/img/avatars/thumb-3.jpg',
		date: 1593949805,
		amount: 629,
		paymentStatus: 'Paid',
		orderStatus: 'Shipped'
	},
	{
		id: '#5287',
		name: 'Luke Cook',
		image: '/img/avatars/thumb-4.jpg',
		date: 1579132800,
		amount: 25.9,
		paymentStatus: 'Paid',
		orderStatus: 'Shipped'
	},
	{
		id: '#5351',
		name: 'Joyce Freeman',
		image: '/img/avatars/thumb-5.jpg',
		date: 1591286400,
		amount: 817.5,
		paymentStatus: 'Pending',
		orderStatus: 'Ready'
	},
]