import { Loadfiles} from './dto/files.dto';

export const new_file = async (
    values: Loadfiles
): Promise<Response> => {
    console.log(values);
    
    return await fetch(process.env.FILES_NEW,{
        method: 'POST',
        credentials: 'include',
        body: values,

    })
}
export const GetOriginFile = async (
    id: number
): Promise<Response> => {
    return await fetch(process.env.FILES_GET_ORIGIN + `/${id}`,{
        method: 'GET',
        credentials: 'include',
        body:{
            'content-type' : 'application/json',
        }

    })
}

export const GetMiniatureFile = async (
    id : number
): Promise<Response> => {
    
    return await fetch(process.env.FILES_GET_MINIATURE + `${id}`,{
        method: 'GET',
        credentials: 'include',
        headers:{
            'content-type' : 'application/json',
        }

    })
}
export const GetInfoFile = async (
    id: number
): Promise<Response> => {
    return await fetch(process.env.FILES_GET_INFO + `${id}`,{
        method: 'GET',
        credentials: 'include',
        headers:{
            'content-type' : 'application/json',
        }

    })
}
export const DeleteFile = async (
    id : number[]
): Promise<Response> => {
    return await fetch(process.env.FILE_DELETE,{
        method: 'DELETE',
        credentials: 'include',
        headers:{
            'content-type' : 'application/json',
        },
        body: JSON.stringify({files_id: id})

    })
}
export const SearchFilesG = async (
    current_page : number,
    per_page: number,
    filename?: string,
    image?: boolean,
    
    
): Promise<Response> => {console.log(filename);
    
    return await fetch(process.env.FILES_SEARCH + `/${current_page}/${per_page}${filename ? `?filename=${filename}` : ``}${image?filename? `&image=${image}` : `?image=${image}` : ``}`,{
        method: 'GET',
        credentials: 'include',
        headers:{
            'content-type' : 'application/json',
        }
    })
}

export const FilesUpdate = async (
    values: Loadfiles
): Promise<Response> => {
    // Преобразование в число, если необходимо
    values.file_id = Number(values.file_id);
    console.log(values)
    return await fetch(process.env.FILES_UPDATE, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
        credentials: 'include',
    });
};