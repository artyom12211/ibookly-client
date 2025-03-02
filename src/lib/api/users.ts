import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
const { initDataRaw } = retrieveLaunchParams()
const apiHost = import.meta.env.VITE_API_HOST
// Dto 
import { User } from "@/types/users";

class UsersApi {
    async createUser(user: User) {
        const api = `${apiHost}/users`
        const payload = JSON.stringify(user) 

        const response = await fetch(api, {
            method: 'POST',
            body: payload,
            
            headers: {
                Authorization: `tma ${initDataRaw}`,
                'Content-Type': 'application/json;charset=utf-8'
            }
        })

        return await response.json()
    }

    async getUser(userid: number) {
        const api = `${apiHost}/users/${userid}`

        const response = await fetch(api, {
            method: 'GET',
            headers: {
                Authorization: `tma ${initDataRaw}`
            }
        })

        return await response.json()
    }
}

export default new UsersApi()