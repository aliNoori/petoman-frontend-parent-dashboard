// src/stores/auth.ts
import {defineStore} from 'pinia'
import {ref, inject} from 'vue'
import type {AxiosInstance} from 'axios'
import {axiosKey} from '../plugins/axiosPlugins'
import {User, useUserStore} from "./user";

export const useAuthStore = defineStore('authStore', () => {

    // ---- States ----
    const token = ref(localStorage.getItem('token') || '')
    const userStore=useUserStore()
    const user = ref<User|null>()
    const loading = ref(false)
    const error = ref<string | null>(null)

    // ---- Inject Axios ----
    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')

    // ---- Getters ----
    const isAuthenticated = () => !!token.value

    // ---- Actions ----
    const login = async (email: string, password: string) => {
        loading.value = true
        error.value = null

        try {
            const {data} = await axios.post('/v1/auth/login', {
                email,
                password
            })

            const accessToken = data?.accessToken
            token.value = accessToken

            userStore.user = data?.user

            localStorage.setItem('token', accessToken)
            if (data?.user) {
                localStorage.setItem('user', JSON.stringify(data.user))
            } else {
                localStorage.removeItem('user')
            }
            // تنظیم هدر پیش‌فرض
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

            return true
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Login failed!'
            return false
        } finally {
            loading.value = false
        }
    }

    const logout = () => {
        token.value = ''
        user.value = null

        //userStore.$reset()

        localStorage.removeItem('user')
        localStorage.removeItem('token')


        delete axios.defaults.headers.common['Authorization']
    }

    return {
        token,
        user,
        loading,
        error,
        isAuthenticated,
        login,
        logout
    }
})