import { NextResponse, type NextFetchEvent, type NextMiddleware, type NextRequest } from 'next/server'
import { AccessTokenData } from './middlewares.dto'
import { refresh } from '@/app/api/route'
import jwtDecode from 'jwt-decode'
export function RefreshTokenMiddleware(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const access_token: string | undefined = request.cookies.get('access_token')?.value
    const refresh_token: string | undefined = request.cookies.get('refresh_token')?.value
    const res = NextResponse.next()
    if(access_token && refresh_token){
        const access_decoded: AccessTokenData = jwtDecode<AccessTokenData>(access_token);
        if (access_decoded) {
            if(access_decoded.exp - Date.now() / 1000 <= 0){
                const token: string | null = (await refresh(
                    `refresh_token=${refresh_token};access_token=${access_token}`
                )).headers.get('Set-cookie')
                if (token) {
                res.cookies.set('access_token', token.match(/access_token=([^;]+)/)[1], {expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)})
                return res
                }
                return middleware(request, event)
            }
            return middleware(request, event)
        }
        return middleware(request, event)
    }
    return middleware(request, event)
  }
}
export default RefreshTokenMiddleware