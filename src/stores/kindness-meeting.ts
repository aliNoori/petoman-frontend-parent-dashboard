// src/stores/kindnessMeetingStore.ts
import { defineStore } from 'pinia'
import {computed, inject, ref} from 'vue'
import { useRouter } from 'vue-router'
import type { AxiosInstance } from 'axios'
import { axiosKey } from '../plugins/axiosPlugins'
import { toGregorianDate, toJalaliDate } from '../utils/date'

export interface KindnessMeeting {
    id?: string
    type: 'financial' | 'volunteer'
    title: string
    description: string
    goal?: number
    current?: number
    location?: string
    eventDate?: string
    eventTime?: string
    capacity?: number
    manager: string
    startDate: string
    startTime: string
    endDate: string
    endTime: string
    duration?: string
    status: 'active' | 'inactive'
    category?: string
    image?: File | null
    showTimer: boolean
    timerType: 'countdown' | 'fixed'
    timerAlert: boolean
    alertDays?: string
    showOnHomepage: boolean
}

export const useKindnessMeetingStore = defineStore('kindnessMeetingStore', () => {
    const kindnessMeetings = ref<KindnessMeeting[]>([])
    const kindnessMeeting = ref<KindnessMeeting | null>(null)
    const selectedMeeting = ref<KindnessMeeting | null>(null)
    const fetched = ref(false)
    const loading = ref(false)

    const router = useRouter()
    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')

    const topProjects = computed(() => {
        return [...kindnessMeetings.value]
            .filter((m: any) => m.type === 'financial')
            .map(m => {
                // مجموع کمک‌ها از donations
                const totalAmount = Array.isArray(m.donations)
                    ? m.donations.reduce((sum: number, d: { amount: any }) => sum + Number(d.amount || 0), 0)
                    : 0

                return {
                    id: m.id,
                    title: m.title,
                    category: m.category || 'عمومی',
                    amount: totalAmount,
                    donations: m.donations?.length || 0,
                    progress: m.goal
                        ? Math.min(Math.round((totalAmount / Number(m.goal)) * 100), 100)
                        : 0
                }
            })
            .filter(p => p.amount > 0)
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5)
    })
    const topProjectsForDashboard = computed(() => {
        return [...kindnessMeetings.value]
            .filter((m: any) => m.type === 'financial')
            .map(m => {
                const totalAmount = Array.isArray(m.donations)
                    ? m.donations.reduce((sum: number, d: { amount: any }) => sum + Number(d.amount || 0), 0)
                    : 0

                return {
                    id: m.id,
                    title: m.title,
                    current: totalAmount,
                    goal: Number(m.goal) || 0,
                    supporters: m.donations?.length || 0,
                    progress: m.goal
                        ? Math.min(Math.round((totalAmount / Number(m.goal)) * 100), 100)
                        : 0
                }
            })
            .filter(p => p.current > 0)
            .sort((a, b) => b.current - a.current)
            .slice(0, 5)
    })

    const fetchKindnessMeetings = async () => {
        loading.value = true
        try {
            const { data } = await axios.get('/v1/kindness-meetings')
            kindnessMeetings.value = data.map((item:any) => {

                // مجموع مبلغ کمک‌ها
                const totalAmount = Array.isArray(item.donations)
                    ? item.donations.reduce((sum: number, d: { amount: any }) => sum + Number(d.amount || 0), 0)
                    : 0

                // محاسبه درصد پیشرفت
                const progress = item.goal
                    ? Math.min(Math.round((totalAmount / Number(item.goal)) * 100), 100)
                    : 0

                return {
                    ...item,
                    category:item.category?.title??'',
                    donations: item.donations,
                    supporters: item.donations.length,
                    progress,            // ← اینجا اضافه شد
                    current:totalAmount,         // ← اگر خواستی بعداً هم استفاده کنی
                    startDate: item.startDate ? toJalaliDate(item.startDate) : null,
                    endDate: item.endDate ? toJalaliDate(item.endDate) : null,
                    eventDate: item.eventDate ? toJalaliDate(item.eventDate) : null,
                    createdAt: toJalaliDate(item.createdAt),
                    updatedAt: toJalaliDate(item.updatedAt)
                }
            })
            fetched.value = true
        } catch (error) {
            console.error('❌ خطا در دریافت لیست قرارهای مهربانی:', error)
        } finally {
            loading.value = false
        }
    }

    const fetchKindnessMeeting = async (id: string) => {
        loading.value = true
        try {
            const { data } = await axios.get(`/v1/kindness-meetings/${id}`)
            // توجه: این endpoint یک «آبجکت تکی» برمی‌گرداند، نه آرایه.
            // قبلاً به اشتباه data.map زده می‌شد که کرش می‌کرد.
            const item = data
            kindnessMeeting.value = {
                ...item,
                _createdAtRaw: item.createdAt,
                startDate: item.startDate ? toJalaliDate(item.startDate): null,
                endDate: item.endDate ? toJalaliDate(item.endDate): null,
                eventDate: item.eventDate ? toJalaliDate(item.eventDate): null,
                createdAt: toJalaliDate(item.createdAt),
                updatedAt: toJalaliDate(item.updatedAt)
            }
        } catch (error) {
            console.error('❌ خطا در دریافت قرار مهربانی:', error)
        } finally {
            loading.value = false
        }
    }

    const addKindnessMeeting = async (payload:any) => {
        loading.value = true
        try {
            const { data } = await axios.post('/v1/kindness-meetings', payload)
            // کنترلر مستقیماً entity برمی‌گرداند (نه داخل data.data)
            kindnessMeetings.value.unshift(data)
        } catch (error) {
            console.error('❌ خطا در ثبت قرار مهربانی:', error)
        } finally {
            loading.value = false
        }
    }

    const updateKindnessMeeting = async (payload:any,id:string) => {
        loading.value = true
        try {
            const { data } = await axios.patch(`/v1/kindness-meetings/${id}`, payload)
        } catch (error) {
            console.error('❌ خطا در بروزرسانی قرار مهربانی:', error)
        } finally {
            loading.value = false
        }
    }

    const removeKindnessMeeting = async (id: string) => {
        try {
            await axios.delete(`/v1/kindness-meetings/${id}`)
            console.log('✅ قرار مهربانی با موفقیت حذف شد:', id)
        } catch (error) {
            console.error('❌ خطا در حذف قرار مهربانی:', error)
        }
    }

    const toggleKindnessMeetingStatus = async (id: string,status:string) => {
        try {
            await axios.patch(`/v1/kindness-meetings/${id}/status`,{status})
            console.log('✅ قرار مهربانی با موفقیت تغییر وضعیت شد:', id)
        } catch (error) {
            console.error('❌ خطا در تفییر وضعیت قرار مهربانی:', error)
        }
    }
    const totalProjects = computed(() => {
        return kindnessMeetings.value.length
    })

    const countCompletedKindnessMeetings = computed(() => {
        return kindnessMeetings.value.filter(d => d.status === 'active').length
    })

    // داخل استور kindnessMeetingStore، بعد از countCompletedKindnessMeetings اضافه کن

    function parseProjectDate(project: KindnessMeeting): Date {
        return new Date(project._createdAtRaw || project.createdAt)
    }

// ✅ پروژه‌های کامل شده ماه جاری
    const completedProjectsThisMonth = computed(() => {
        const now = new Date()
        return kindnessMeetings.value.filter(p => {
            const d = parseProjectDate(p)
            return (
                p.status === 'active' &&
                d.getFullYear() === now.getFullYear() &&
                d.getMonth() === now.getMonth()
            )
        }).length
    })

// ✅ پروژه‌های کامل شده هفته جاری
    const completedProjectsThisWeek = computed(() => {
        const now = new Date()
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay()) // شنبه تا جمعه
        return kindnessMeetings.value.filter(p => {
            const d = parseProjectDate(p)
            return p.status === 'active' && d >= startOfWeek && d <= now
        }).length
    })

// ✅ پروژه‌های کامل شده سه ماه اخیر
    const completedProjectsLastThreeMonths = computed(() => {
        const now = new Date()
        const threeMonthsAgo = new Date(now)
        threeMonthsAgo.setMonth(now.getMonth() - 2)
        return kindnessMeetings.value.filter(p => {
            const d = parseProjectDate(p)
            return p.status === 'active' && d >= threeMonthsAgo
        }).length
    })

// ✅ پروژه‌های کامل شده سال جاری
    const completedProjectsThisYear = computed(() => {
        const now = new Date()
        return kindnessMeetings.value.filter(p => {
            const d = parseProjectDate(p)
            return p.status === 'active' && d.getFullYear() === now.getFullYear()
        }).length
    })


    return {
        kindnessMeetings,
        kindnessMeeting,
        selectedMeeting,
        fetched,
        loading,
        completedProjectsThisYear,
        completedProjectsLastThreeMonths,
        completedProjectsThisWeek,
        completedProjectsThisMonth,

        fetchKindnessMeetings,
        fetchKindnessMeeting,
        addKindnessMeeting,
        updateKindnessMeeting,
        removeKindnessMeeting,
        toggleKindnessMeetingStatus,
        topProjects,
        totalProjects,
        topProjectsForDashboard,
        countCompletedKindnessMeetings
    }
})