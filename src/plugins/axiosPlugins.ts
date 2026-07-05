// src/plugins/axios.ts
import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { App } from 'vue'

export const axiosKey = Symbol('axios') // ✅ کلید یکتا برای inject

export default {
    install(app: App) {
        const instance = axios.create({
            baseURL:import.meta.env.VITE_API_URL,
            //baseURL: 'https://api.petoman.com/api',
        })

        instance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token')
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
                return config
            },
            (error) => Promise.reject(error)
        )

        app.provide(axiosKey, instance) // ✅ provide کردن Axios
    }
}
