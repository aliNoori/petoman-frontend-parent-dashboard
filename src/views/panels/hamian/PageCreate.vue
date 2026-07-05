<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ isEditMode ? 'ویرایش صفحه' : 'ایجاد صفحه جدید' }}
        </h1>
        <p class="text-gray-600 mt-1">
          {{ isEditMode ? 'صفحه خود را ویرایش و به‌روزرسانی کنید' : 'صفحه جدید خود را ایجاد و منتشر کنید' }}
        </p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3">
        <button @click="goBack" class="btn-secondary">
          <i class="ti ti-arrow-right ml-2"></i>
          بازگشت
        </button>
        <button @click="saveDraft" class="btn-secondary" :disabled="isLoading">
          <i class="ti ti-device-floppy ml-2"></i>
          ذخیره پیش‌نویس
        </button>
        <button @click="publishPage" class="btn-primary" :disabled="isLoading">
          <i class="ti ti-send ml-2" v-if="!isLoading"></i>
          <i class="ti ti-loader animate-spin ml-2" v-else></i>
          {{ isLoading ? 'در حال ذخیره...' : (isEditMode ? 'به‌روزرسانی' : 'انتشار صفحه') }}
        </button>
      </div>
    </div>

    <!-- Form Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Title -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            عنوان صفحه <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            placeholder="عنوان صفحه خود را وارد کنید..."
            class="input-field"
            :class="errors.title ? 'border-red-500' : ''"
          >
          <p v-if="errors.title" class="text-red-600 text-sm mt-1">{{ errors.title }}</p>
        </div>

        <!-- Slug -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            آدرس صفحه (Slug)
          </label>
          <div class="flex gap-2">
            <input
              v-model="form.slug"
              type="text"
              placeholder="about-us"
              class="input-field flex-1 font-mono text-sm"
            >
            <button @click="generateSlug" type="button" class="btn-secondary whitespace-nowrap">
              <i class="ti ti-refresh ml-1"></i>
              تولید خودکار
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            پیش‌نمایش: /{{ form.slug || 'page-slug' }}
          </p>
        </div>

        <!-- Content Editor -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <label class="block text-sm font-medium text-gray-700 mb-4">
            محتوای صفحه <span class="text-red-500">*</span>
          </label>
          
          <TinyMCEEditor
            v-model="form.content"
            placeholder="محتوای صفحه خود را اینجا بنویسید..."
            :height="500"
          />
          
          <p v-if="errors.content" class="text-red-600 text-sm mt-2">{{ errors.content }}</p>
          <p class="text-xs text-gray-500 mt-2">{{ getContentLength() }} کاراکتر</p>
        </div>

        <!-- SEO Settings -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <i class="ti ti-seo ml-2 text-rose-600"></i>
            تنظیمات SEO
          </h3>
          
          <div class="space-y-4">
            <!-- Meta Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">عنوان متا</label>
              <input
                v-model="form.metaTitle"
                type="text"
                placeholder="عنوان برای موتورهای جستجو..."
                class="input-field"
                maxlength="70"
              >
              <p class="text-xs text-gray-500 mt-1">{{ form.metaTitle.length }}/70 کاراکتر</p>
            </div>

            <!-- Meta Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">توضیحات متا</label>
              <textarea
                v-model="form.metaDescription"
                rows="3"
                placeholder="توضیحات مختصر برای موتورهای جستجو..."
                class="input-field resize-none"
                maxlength="170"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">{{ form.metaDescription.length }}/170 کاراکتر</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Publish Settings -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">تنظیمات انتشار</h3>
          
          <!-- Status -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
            <select v-model="form.status" class="input-field">
              <option value="draft">پیش‌نویس</option>
              <option value="published">منتشر شده</option>
            </select>
          </div>

          <!-- Show in Menu -->
          <div class="flex items-center gap-2">
            <input
              v-model="form.showInMenu"
              type="checkbox"
              id="showInMenu"
              class="w-4 h-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
            >
            <label for="showInMenu" class="text-sm text-gray-700">نمایش در منو</label>
          </div>
        </div>

        <!-- Featured Image -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">تصویر شاخص</h3>
          
          <!-- Current Image -->
          <div v-if="form.featuredImage" class="mb-4">
            <img :src="form.featuredImage" alt="Featured Image" class="w-full h-32 object-cover rounded-lg border border-gray-200">
            <button @click="removeImage" class="mt-2 text-sm text-red-600 hover:text-red-800 flex items-center">
              <i class="ti ti-trash ml-1"></i>
              حذف تصویر
            </button>
          </div>

          <!-- Upload New -->
          <div v-else>
            <label class="block w-full">
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-rose-400 cursor-pointer transition-colors">
                <i class="ti ti-upload text-3xl text-gray-400 mb-2 block"></i>
                <p class="text-sm text-gray-600">کلیک کنید یا فایل را بکشید</p>
                <p class="text-xs text-gray-500 mt-1">PNG, JPG, GIF (حداکثر 2MB)</p>
              </div>
              <input 
                type="file" 
                class="hidden" 
                accept="image/*"
                @change="handleImageUpload"
              >
            </label>
          </div>
        </div>

        <!-- Quick Tips -->
        <div class="bg-rose-50 rounded-xl border border-rose-200 p-4">
          <h4 class="text-sm font-semibold text-rose-800 mb-2 flex items-center">
            <i class="ti ti-bulb ml-1"></i>
            نکات مهم
          </h4>
          <ul class="text-xs text-rose-700 space-y-1 mr-4 list-disc">
            <li>عنوان صفحه باید واضح و مختصر باشد</li>
            <li>از Slug انگلیسی استفاده کنید</li>
            <li>محتوای کامل و مفید بنویسید</li>
            <li>تنظیمات SEO را تکمیل کنید</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Success Notification -->
  <div v-if="showNotification" class="fixed bottom-4 left-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[300px] animate-slide-in">
    <div class="flex items-center gap-3">
      <i class="ti ti-check text-green-600 text-xl"></i>
      <p class="text-sm text-gray-700">{{ notificationMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TinyMCEEditor from '@/components/TinyMCEEditor.vue'
import {usePageStore} from "@/stores/page.ts";

const router = useRouter()
const route = useRoute()

const isLoading = ref(false)
const showNotification = ref(false)
const notificationMessage = ref('')
const pageStore=usePageStore()
const isEditMode = computed(() => !!history.state.page)

const form = ref({
  title: '',
  slug: '',
  content: '',
  metaTitle: '',
  metaDescription: '',
  status: 'draft',
  showInMenu: false,
  featuredImage: '',
  createdAt: new Date().toISOString(),
  views: 0
})

const errors = ref({
  title: '',
  content: ''
})

// Load page data if editing
onMounted(async () => {
  const page = history.state.page
  if(page){
    await pageStore.fetchPage(page)
    if (pageStore.page) {
      form.value = {...pageStore.page}
    }
  }

})

const loadPageData = async () => {
  if (!isEditMode.value) return

  if (!pageStore.fetched) {
    await pageStore.fetchPages()
  }

  const page = pageStore.getPageById(route.params.id)
  if (page) {
    form.value = { ...page }
  } else {
    notificationMessage.value = 'صفحه مورد نظر یافت نشد'
    showNotification.value = true
    setTimeout(() => router.push('/dashboard/hamian/pages'), 1500)
  }
}

// Auto-generate slug from title
watch(() => form.value.title, (newTitle) => {
  if (!isEditMode.value || !form.value.slug) {
    generateSlug()
  }
})

const generateSlug = () => {
  if (!form.value.title) return
  
  const persianToEnglish = {
    'آ': 'a', 'ا': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's', 'ج': 'j', 'چ': 'ch',
    'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z', 'ژ': 'zh', 'س': 's',
    'ش': 'sh', 'ص': 's', 'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f',
    'ق': 'gh', 'ک': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm', 'ن': 'n', 'و': 'v', 'ه': 'h',
    'ی': 'y', ' ': '-'
  }
  
  let slug = form.value.title.toLowerCase()
  for (const [persian, english] of Object.entries(persianToEnglish)) {
    slug = slug.replaceAll(persian, english)
  }
  slug = slug.replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')
  form.value.slug = slug
}

const getContentLength = () => {
  if (!form.value.content) return 0
  // Strip HTML tags for character count
  return form.value.content.replace(/<[^>]*>/g, '').length
}

const validate = () => {
  errors.value = {}
  let isValid = true

  if (!form.value.title.trim()) {
    errors.value.title = 'عنوان صفحه الزامی است'
    isValid = false
  }

  if (!form.value.content.trim()) {
    errors.value.content = 'محتوای صفحه الزامی است'
    isValid = false
  }

  return isValid
}

const saveDraft = () => {
  form.value.status = 'draft'
  savePage()
}

const publishPage = () => {
  //form.value.status = 'published'
  savePage()
}

const savePage = async () => {
  if (!validate()) return

  isLoading.value = true
  try {
    if (isEditMode.value) {
      await pageStore.updatePage(history.state.page, form.value)
      notificationMessage.value = 'صفحه با موفقیت به‌روزرسانی شد'
    } else {
      await pageStore.addPage(form.value)
      notificationMessage.value = form.value.status === 'published'
          ? 'صفحه با موفقیت منتشر شد'
          : 'پیش‌نویس ذخیره شد'
    }

    showNotification.value = true
    setTimeout(() => {
      showNotification.value = false
      router.push('/dashboard/hamian/pages')
    }, 1500)
  } catch (error) {
    notificationMessage.value = 'خطا در ذخیره صفحه'
    showNotification.value = true
  } finally {
    isLoading.value = false
  }
}


const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // Check file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    notificationMessage.value = 'حجم فایل نباید بیشتر از 2 مگابایت باشد'
    showNotification.value = true
    setTimeout(() => showNotification.value = false, 2000)
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    form.value.featuredImage = e.target.result
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  form.value.featuredImage = ''
}

const goBack = () => {
  router.push('/dashboard/hamian/pages')
}
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #e11d48;
  box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.1);
}

.btn-primary {
  background-color: #e11d48;
  color: white;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  font-weight: 500;
}

.btn-primary:hover:not(:disabled) {
  background-color: #be123c;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: white;
  color: #374151;
  padding: 0.625rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-weight: 500;
}

.btn-secondary:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

@keyframes slide-in {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
