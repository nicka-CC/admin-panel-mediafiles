import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server";

export default function PrivateRoutesMiddleWare(middleware: NextMiddleware) {
    return async (request: NextRequest, event: NextFetchEvent) => {
        const path = request.nextUrl.pathname
        const isPublicPath = path === '/admin/login' || path === '/admin/register'
    
        const access_token: string | undefined = request.cookies.get('access_token')?.value
        const refresh_token: string | undefined = request.cookies.get('refresh_token')?.value
        if (!isPublicPath && (!access_token || !refresh_token)){
            return NextResponse.redirect(new URL('/admin/login', request.nextUrl))
        }
        if(isPublicPath && (access_token && refresh_token)){
            return NextResponse.redirect(new URL('/admin', request.nextUrl))
        }
      return middleware(request, event)
    }
  }
