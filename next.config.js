/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		SERVER_URL: process.env.SERVER_URL,
		APP_URL: process.env.APP_URL
	},
	images: {
		domains: [
			'vecteezy.com',
			'www.aptronixindia.com',
			'cloudflare-ipfs.com',
			'avatars.githubusercontent.com',
			'disk.yandex.ru',
			'ru.freepik.com',
			'i.pinimg.com',
			'cdn.leroymerlin.ru',
			's.leroymerlin.kz',
			'cdn-icons-png.flaticon.com',
			'icons8.ru',
			'tse2.mm.bing.net',
			'flaticon.com'
		]
	},
	async rewrites() {
		return [
			{
				source: '/uploads/:path*',
				destination: 'http://localhost:4200/uploads/:path*'
			}
		]
	}
}

module.exports = nextConfig
