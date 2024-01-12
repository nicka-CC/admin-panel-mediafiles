
import { LoginFormDTO, RegisterFormDTO, } from './dto/auth.dto';
import { IdFiles, Loadfiles,SearchFiles} from './dto/files.dto'



export const login = async (
    values: LoginFormDTO | undefined
):  Promise<Response> => {
    let data: any = []
    await fetch(process.env.AUTH_LOGIN,{
        method: 'POST',
        body: JSON.stringify({email: values.email,password: values.password}),
        credentials: 'include',
        headers: { "Content-Type": "application/json" }
    }).then(response => data = response)
    return data;
}
export const refresh = async (
    token: string
): Promise<Response> => {
    return await fetch(process.env.AUTH_REFRESH_TOKEN,{
        method: 'POST',
        credentials: 'include',
        headers: {
            'cookie': token
        }
    })
}
export const register = async (
    values: RegisterFormDTO | undefined
):  Promise<Response> => {
    return await fetch(process.env.AUTH_REG,{
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({email: values.email,password: values.password,name: values.name}),
        headers: { "Content-Type": "application/json" }
    })
}
export const logout = async (
): Promise<Response> => {
    return await fetch(process.env.AUTH_LOGOUT,{
        method: 'GET',
        credentials: 'include',
    })
}



