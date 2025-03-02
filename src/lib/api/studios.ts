import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
const { initDataRaw } = retrieveLaunchParams()
const apiHost = import.meta.env.VITE_API_HOST
// Dto 
// import { Studio } from "@/types/studios";

class StudiosApi {
    async getStudios() {
        const api = `${apiHost}/studios`
        const response = await fetch(api, {
            method: 'GET',
            headers: {
                Authorization: `tma ${initDataRaw}`
            }
        })

        return await response.json()
    }
    
    async getPreviewStudios(page: number, limit: number, metro?: string) {
        const api = `${apiHost}/studios/preview/paginated?page=${page}&limit=${limit}${metro ? metro : ''}`
        const response = await fetch(api, {
            method: 'GET',
            headers: {
                Authorization: `tma ${initDataRaw}`
            }
        })

        return await response.json()
    }
    
    async getStudio(id: any) {
        const api = `${apiHost}/studios/${id}`
        const response = await fetch(api, {
            method: 'GET',
            headers: {
                Authorization: `tma ${initDataRaw}`
            }
        })

        return await response.json()
    }
    
    async getFilters() {
        const api = `${apiHost}/studios/filters`
        const response = await fetch(api, {
            method: 'GET',
            headers: {
                Authorization: `tma ${initDataRaw}`
            }
        })

        return await response.json()
    }
}

export default new StudiosApi()