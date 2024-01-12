import { NextRequest,NextMiddleware,NextResponse} from 'next/server'
import RefreshTokenMiddleware from '@/src/middlewares/RefreshTokenMiddleware'
import PrivateRoutesMiddleWare from '@/src/middlewares/PrivateRoutesMiddleware'
import { chain } from './src/middlewares/chain'


export default chain([RefreshTokenMiddleware,PrivateRoutesMiddleWare])
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
  }