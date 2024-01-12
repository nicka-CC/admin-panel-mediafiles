export interface AccessTokenData {
    payload: {
        id: number,
        name: string,
        email: string,
        superuser: boolean,
        role: {
            id: number,
            name: string,
            [key:string]: any,
            system_role: boolean,
            role_creator_id: number,
            roles_accessed: any[]
        }
    },
    iat: number,
    exp: number,
}