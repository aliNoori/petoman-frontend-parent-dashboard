import {defineStore} from 'pinia'
import {ref, inject} from 'vue'
import type {AxiosInstance} from 'axios'
import {axiosKey} from '../plugins/axiosPlugins'
import {useUploader} from "../composables/useUploader";

// -------------------------
// 🎬 Documentary Entity
// -------------------------
export interface Documentary {
    id: string
    title: string
    description?: string
    category: string
    slug: string
    duration?: string
    publishDate?: string
    status: 'draft' | 'published'
    tags?: string[]
    seoTitle?: string
    seoDescription?: string
    seoKeywords?: string
    thumbnailUrl?: string
    videoUrl?: string
    createdAt: string
    updatedAt: string
}

// -------------------------
// ✏️ DTO Types
// -------------------------
export interface CreateDocumentaryDto {
    title: string
    description?: string
    category: string
    categoryId: string
    duration?: string
    publishDate?: string
    status?: 'draft' | 'published'
    tags?: string[]
    seoTitle?: string
    seoDescription?: string
    seoKeywords?: string
    slug?: string
    // media
    videoUploadMethod: 'url' | 'file'
    videoUrl?: string
    videoFile?: File | null
    thumbnailPreview?: string | null
}

// -------------------------
// 📦 Pinia Store
// -------------------------
export const useDocumentaryStore = defineStore('documentaryStore', () => {
    const documentaries = ref<Documentary[]>([])
    const documentary = ref<Documentary | null>(null)
    const loading = ref(false)
    const uploadProgress = ref<number>(0)
    const uploader = useUploader()
    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')

    // -------------------------
    // 📥 Fetch All
    // -------------------------
    const fetchDocumentaries = async () => {
        try {
            const {data} = await axios.get('/v1/documentaries')

            documentaries.value = data.map((doc: any) => ({
                ...doc,
                videoUrl: doc.videoUrl || '',
                videoFile: doc.videoFile || '',
                thumbnailUrl: doc.thumbnailPreview || '',
                tags: Array.isArray(doc.tags) ? doc.tags : JSON.parse(doc.tags || '[]')
            }))
        } catch (err) {
            console.error('❌ خطا در دریافت مستندها:', err)
        }
    }

    const selectDocumentary = (doc: Documentary) => {
        documentary.value = doc
    }


    // -------------------------
    // ➕ Add New Documentary
    // -------------------------
    const addDocumentary = async (form: CreateDocumentaryDto) => {
        try {
            loading.value = true
            uploadProgress.value = 0  // 👈 پیشرفت آپلود

            // 🖼️ آپلود تصویر بندانگشتی (اگر base64 هست)
            let thumbnailUrl: string | undefined
            if (form.thumbnailPreview) {
                thumbnailUrl = await uploader.uploadImage(form.thumbnailPreview)
            }

            // 🎞️ آپلود ویدیو با uploader
            let videoUrl = form.videoUrl  // پیش‌فرض: لینک واردشده توسط کاربر
            if (form.videoUploadMethod === 'file' && form.videoFile) {
                videoUrl = await uploader.uploadChunkedVideo(
                    form.videoFile,
                    (percent: number) => {
                        uploadProgress.value = percent
                    }
                )
            }

            // 🧹 حذف فیلدهای موقتی قبل از ارسال
            const {
                videoFile: _vf,
                videoUploadMethod: _vum,
                thumbnailPreview: _tp,
                category: _cat,
                ...cleanForm
            } = form

            // 📦 ساخت Payload نهایی (JSON)
            const payload = {
                ...cleanForm,
                tags: form.tags || [],
                videoUrl,
                categoryId: form.categoryId,
                thumbnailPreview: thumbnailUrl,
            }

            const {data} = await axios.post('/v1/documentaries', payload)
            documentaries.value.unshift(data)
            console.log('✅ مستند جدید ثبت شد')
            return data
        } catch (err) {
            console.error('❌ خطا در ثبت مستند:', err)
            throw err
        } finally {
            loading.value = false
            uploadProgress.value = 0
        }
    }


    // -------------------------
// ✏️ Update Documentary
// -------------------------
    const updateDocumentary = async (
        id: string,
        form: CreateDocumentaryDto
    ) => {
        try {
            loading.value = true
            uploadProgress.value = 0

            // 🎞️ ویدیو
            let videoUrl = form.videoUrl

            if (
                form.videoUploadMethod === 'file' &&
                form.videoFile
            ) {
                videoUrl = await uploader.uploadChunkedVideo(
                    form.videoFile,
                    (percent: number) => {
                        uploadProgress.value = percent
                    }
                )
            }

            // 🖼️ تصویر بندانگشتی
            let thumbnailPreview = form.thumbnailPreview

            if (
                form.thumbnailPreview &&
                form.thumbnailPreview.startsWith('data:image')
            ) {
                thumbnailPreview = await uploader.uploadImage(
                    form.thumbnailPreview
                )
            }

            // 🧹 حذف فیلدهای موقتی قبل از ارسال
            const {
                videoFile: _vf,
                videoUploadMethod: _vum,
                thumbnailPreview: _tp,
                category:_cat,
                ...cleanForm
            } = form

            // 📦 Payload نهایی JSON
            const payload = {
                ...cleanForm,

                tags: form.tags || [],
                categoryId:form.categoryId,
                videoUrl,
                thumbnailPreview,
            }

            const {data} = await axios.patch(
                `/v1/documentaries/${id}`,
                payload
            )

            const index =
                documentaries.value.findIndex(
                    documentary =>
                        documentary.id === id
                )

            if (index !== -1) {
                documentaries.value[index] = {
                    ...documentaries.value[index],
                    ...data
                }
            }

            if (
                documentary.value &&
                documentary.value.id === id
            ) {
                documentary.value = {
                    ...documentary.value,
                    ...data
                }
            }

            console.log(
                '✅ مستند با موفقیت به‌روزرسانی شد'
            )

            return data
        } catch (err) {
            console.error(
                '❌ خطا در بروزرسانی مستند:',
                err
            )

            throw err
        } finally {
            loading.value = false
            uploadProgress.value = 0
        }

    }


    // -------------------------
    // ❌ Remove
    // -------------------------
    const removeDocumentary = async (id: string) => {
        try {
            await axios.delete(`/v1/documentaries/${id}`)
            documentaries.value = documentaries.value.filter(d => d.id !== id)
        } catch (err) {
            console.error('❌ خطا در حذف مستند:', err)
        }
    }

    // -------------------------
    // 🧠 Helper: Base64 → Blob
    // -------------------------
    const base64ToBlob = (base64: string) => {
        const arr = base64.split(',')
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png'
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) u8arr[n] = bstr.charCodeAt(n)
        return new Blob([u8arr], {type: mime})
    }


    return {
        documentaries,
        documentary,
        uploadProgress,
        loading,
        fetchDocumentaries,
        selectDocumentary,
        addDocumentary,
        updateDocumentary,
        removeDocumentary
    }
})