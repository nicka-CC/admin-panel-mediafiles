/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        AUTH_REG: process.env.HOST + process.env.AUTH_REG,
        AUTH_LOGIN: process.env.HOST + process.env.AUTH_LOGIN,
        AUTH_LOGOUT: process.env.HOST + process.env.AUTH_LOGOUT,
        AUTH_FULL_LOGOUT: process.env.HOST + process.env.AUTH_FULL_LOGOUT,
        AUTH_REFRESH_TOKEN: process.env.HOST + process.env.AUTH_REFRESH_TOKEN,
        USERS: process.env.HOST + process.env.USERS,
        NEXT_PUBLIC_URL: process.env.HOST,
        FILES_SEARCH: process.env.HOST + process.env.FILES_SEARCH,
        FILES_UPDATE: process.env.HOST + process.env.FILES_UPDATE,
        FILES_NEW: process.env.HOST + process.env.FILES_NEW,
        FILE_DELETE: process.env.HOST + process.env.FILE_DELETE,
        FILES_GET_MINIATURE: process.env.HOST + process.env.FILES_GET_MINIATURE,
        FILES_GET_INFO: process.env.HOST + process.env.FILES_GET_INFO,

    },
    images: {
        domains: ['localhost'],
        remotePatterns: [
          {
            protocol: 'https',
            hostname: "fakestoreapi.com",
            port: '',
          },
          {
            protocol: 'https',
            hostname: "localhost:5000",
            port: '',
          },
        ],
      },
    
}

module.exports = nextConfig
