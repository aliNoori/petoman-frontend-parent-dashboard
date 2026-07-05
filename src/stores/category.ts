// stores/categoryStore.ts
import {defineStore} from 'pinia'
import {inject, ref} from 'vue'
import type {AxiosInstance} from 'axios'
import {axiosKey} from '../plugins/axiosPlugins'

export interface Category {
    id: string
    title: string
    slug: string
    description?: string
    typeId?: string
    type?: { id: string; name: string; displayName?: string }
    parentId?: string | null
    parent?: Category | null
    children?: Category[]
    color:string
    isActive: boolean
    sortOrder: number
    createdAt: string
    updatedAt: string
}

export const useCategoryStore = defineStore('categoryStore', () => {
    // state
    const categories = ref<Category[]>([])
    const categoryTree = ref<Category[]>([])
    const selectedCategory = ref<Category | null>(null)
    const fetched = ref(false)

    // inject axios
    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')

    // fetch all categories flat
    const fetchCategories = async (filters?: { typeId?: string;contentType?:string; activeOnly?: boolean }) => {

        try {
            const { data } = await axios.get('/categories', { params: filters })
            categories.value = data
            console.log('ccc',categories.value)
            fetched.value = true
        } catch (error) {
            console.error('❌ خطا در دریافت دسته‌بندی‌ها:', error)
        }
    }

    // fetch tree by type
    const fetchCategoryTree = async (typeId?: string,contentType?:string) => {
        try {
            const { data } = await axios.get('/categories/tree', { params: { typeId,contentType } })
            categoryTree.value = data
        } catch (error) {
            console.error('❌ خطا در دریافت درخت دسته‌بندی‌ها:', error)
        }
    }

    // fetch single category
    const fetchCategory = async (id: string) => {
        try {
            const { data } = await axios.get(`/categories/${id}`)
            selectedCategory.value = data
        } catch (error) {
            console.error('❌ خطا در دریافت دسته‌بندی:', error)
        }
    }
    const uploadImage = (file: File): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            try {
                const formData = new FormData()
                formData.append('file', file)

                const { data } = await axios.post('/v1/uploads/image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })

                if (!data?.url) throw new Error('No URL returned from server')
                resolve(data.url.toString())
            } catch (error: any) {
                console.error('❌ Image upload failed', error)
                reject(error?.message || 'Upload failed')
            }
        })
    }

    // add new category
    const addCategory = async (newCategory: Partial<Category>) => {
        try {
            const { data } = await axios.post('/categories', newCategory)
            categories.value.unshift(data)
            console.log('✅ دسته‌بندی ثبت شد')
            return data
        } catch (error) {
            console.error('❌ خطا در ثبت دسته‌بندی:', error)
        }
    }
    const addCategoryWithImages = async (
        newCategory: Partial<Category> & {
            cover?: string | File | null
            image?: string | File | null
        }
    ) => {
        try {
            let coverUrl = newCategory.cover as string | undefined
            let logoUrl = newCategory.image as string | undefined

            if (coverUrl && coverUrl.startsWith('data:image')) {
                const blob = await fetch(coverUrl).then(res => res.blob())
                const file = new File([blob], 'cover.png', { type: blob.type })
                coverUrl = await uploadImage(file)
            } else if (newCategory.cover instanceof File) {
                coverUrl = await uploadImage(newCategory.cover)
            }

            // اگر لوگو به صورت data:image بود → تبدیل به فایل و آپلود
            if (logoUrl && logoUrl.startsWith('data:image')) {
                const blob = await fetch(logoUrl).then(res => res.blob())
                const file = new File([blob], 'logo.png', { type: blob.type })
                logoUrl = await uploadImage(file)
            } else if (newCategory.image instanceof File) {
                logoUrl = await uploadImage(newCategory.image)
            }

            const payload: any = {
                title: newCategory.title,
                description: newCategory.description,
                color: newCategory.color,
                slug: newCategory.slug,
                parentId: newCategory.parentId,
                typeId: newCategory.typeId,
                contentType:newCategory.contentType,
                isActive: newCategory.isActive,
                sortOrder: newCategory.sortOrder,
                cover: coverUrl || null,
                logo: logoUrl || null,
            }

            delete payload.image // چون image فقط برای ورودی بود

            // ارسال به API
            const { data } = await axios.post('/categories', payload)

            //categories.value.unshift(data)

            console.log('✅ دسته‌بندی با فایل‌ها ثبت شد')
            return data
        } catch (error) {
            console.error('❌ خطا در addCategoryWithImages:', error)
            throw error
        }
    }
    const updateCategoryWithImages = async (
        updatedCategory: Partial<Category> & {
            id: string
            cover?: string | File | null
            image?: string | File | null
        }
    ) => {
        try {
            let coverUrl = updatedCategory.cover as string | undefined
            let logoUrl = updatedCategory.image as string | undefined

            // اگر کاور به صورت data:image بود → تبدیل به فایل و آپلود
            if (coverUrl && coverUrl.startsWith('data:image')) {
                const blob = await fetch(coverUrl).then(res => res.blob())
                const file = new File([blob], 'cover.png', { type: blob.type })
                coverUrl = await uploadImage(file)
            } else if (updatedCategory.cover instanceof File) {
                coverUrl = await uploadImage(updatedCategory.cover)
            }

            // اگر لوگو به صورت data:image بود → تبدیل به فایل و آپلود
            if (logoUrl && logoUrl.startsWith('data:image')) {
                const blob = await fetch(logoUrl).then(res => res.blob())
                const file = new File([blob], 'logo.png', { type: blob.type })
                logoUrl = await uploadImage(file)
            } else if (updatedCategory.image instanceof File) {
                logoUrl = await uploadImage(updatedCategory.image)
            }

            // فقط فیلدهای مجاز
            const payload: any = {
                title: updatedCategory.title,
                description: updatedCategory.description,
                color: updatedCategory.color,
                slug: updatedCategory.slug,
                parentId: updatedCategory.parentId,
                typeId: updatedCategory.typeId,
                contentType:updatedCategory.contentType,
                isActive: updatedCategory.isActive,
                sortOrder: updatedCategory.sortOrder,
                cover: coverUrl || null,
                logo: logoUrl || null,
            }

            delete payload.image // چون image فقط برای ورودی بود

            // ارسال به API برای ویرایش
            const { data } = await axios.patch(`/categories/${updatedCategory.id}`, payload)

            // جایگزینی در لیست محلی
            const index = categories.value.findIndex(cat => cat.id === updatedCategory.id)
            if (index !== -1) {
                categories.value[index] = data
            }

            console.log('✅ دسته‌بندی با فایل‌ها ویرایش شد')
            return data
        } catch (error) {
            console.error('❌ خطا در updateCategoryWithImages:', error)
            throw error
        }
    }

    // update category
    const editCategory = async (updatedCategory: Partial<Category> & { id: string }) => {
        try {
            const { id, ...body } = updatedCategory
            delete body.type
            delete body.documents
            delete body.createdAt
            delete body.updatedAt
            delete body.deletedAt
            const { data } = await axios.patch(`/categories/${id}`, body)
            const index = categories.value.findIndex(c => c.id === data.id)
            if (index !== -1) categories.value[index] = data
            return data
        } catch (error) {
            console.error('❌ خطا در ویرایش دسته‌بندی:', error)
        }
    }

    // delete category
    const removeCategory = async (id: string) => {
        try {
            await axios.delete(`/categories/${id}`)
            categories.value = categories.value.filter(c => c.id !== id)
            console.log('✅ دسته‌بندی حذف شد')
        } catch (error) {
            console.error('❌ خطا در حذف دسته‌بندی:', error)
        }
    }

    // toggle active status
    const toggleStatus = async (id: string, isActive: boolean) => {
        try {
            const { data } = await axios.patch(`/categories/${id}/status`, { isActive })
            const index = categories.value.findIndex(c => c.id === id)
            if (index !== -1) categories.value[index].isActive = data.isActive
            console.log(`✅ وضعیت دسته‌بندی ${id} تغییر کرد به ${data.isActive}`)
        } catch (error) {
            console.error('❌ خطا در تغییر وضعیت دسته‌بندی:', error)
        }
    }

    // move category (change parent or sortOrder)
    const moveCategory = async (id: string, newParentId?: string | null, newSortOrder?: number) => {
        try {
            const { data } = await axios.patch(`/categories/${id}/move`, { newParentId, newSortOrder })
            const index = categories.value.findIndex(c => c.id === data.id)
            if (index !== -1) categories.value[index] = data
            return data
        } catch (error) {
            console.error('❌ خطا در تغییر والد/ترتیب دسته‌بندی:', error)
        }
    }

    return {
        categories,
        categoryTree,
        selectedCategory,
        fetched,
        fetchCategories,
        fetchCategoryTree,
        fetchCategory,
        addCategory,
        addCategoryWithImages,
        updateCategoryWithImages,
        editCategory,
        removeCategory,
        toggleStatus,
        moveCategory,
    }
})