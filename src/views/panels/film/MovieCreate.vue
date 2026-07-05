<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">ایجاد فیلم جدید</h1>
        <p class="text-gray-600 mt-1">فیلم جدید خود را ایجاد و منتشر کنید</p>
      </div>
      <div class="flex gap-3">
        <button @click="goBack"
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center">
          <i class="ti ti-arrow-right ml-2"></i>
          بازگشت
        </button>
        <button @click="saveDraft"
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center">
          <i class="ti ti-device-floppy ml-2"></i>
          ذخیره پیش‌نویس
        </button>
        <button @click="publishMovie"
                class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center">
          <i class="ti ti-send ml-2"></i>
          انتشار فیلم
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">اطلاعات اصلی</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">عنوان فیلم</label>
              <input v-model="form.title" type="text"
                     class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                     placeholder="عنوان فیلم فارسی...">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">عنوان انگلیسی</label>
              <input v-model="form.titleEn" type="text"
                     class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                     placeholder="English Title..." dir="ltr">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">خلاصه داستان</label>
              <textarea v-model="form.description" rows="5"
                        class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors resize-none"
                        placeholder="خلاصه داستان فیلم را بنویسید..."></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">کارگردان</label>
                <input v-model="form.director" type="text"
                       class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                       placeholder="نام کارگردان...">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">سال تولید</label>
                <input v-model="form.year" type="number"
                       class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                       placeholder="2024">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">مدت زمان (دقیقه)</label>
                <input v-model="form.duration" type="number"
                       class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                       placeholder="120">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">امتیاز IMDB</label>
                <input v-model="form.imdbRating" type="number" step="0.1" min="0" max="10"
                       class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                       placeholder="8.5">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">بازیگران</label>
              <input v-model="form.cast" type="text"
                     class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                     placeholder="نام بازیگران را با کاما جدا کنید...">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">لینک تریلر</label>
              <input v-model="form.trailerUrl" type="text"
                     class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                     placeholder="https://..." dir="ltr">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">لینک دانلود</label>
              <input v-model="form.downloadUrl" type="text"
                     class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                     placeholder="https://..." dir="ltr">
            </div>
          </div>
        </div>

        <!-- Tags Section -->
        <!--        <div class="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 class="text-lg font-bold text-gray-900 mb-4">برچسب‌ها</h3>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">افزودن برچسب</label>
                      <div class="flex gap-2">
                        <input
                          v-model="tagInput"
                          @keyup.enter="addTag"
                          type="text"
                          placeholder="نام برچسب را وارد کنید..."
                          class="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                        />
                        <button
                          @click="addTag"
                          class="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <i class="ti ti-plus"></i>
                        </button>
                      </div>
                    </div>
                    <div v-if="form.tags.length > 0" class="flex flex-wrap gap-2">
                      <span
                        v-for="(tag, index) in form.tags"
                        :key="index"
                        class="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium"
                      >
                        {{ tag }}
                        <button @click="removeTag(index)" class="hover:text-purple-900">
                          <i class="ti ti-x text-sm"></i>
                        </button>
                      </span>
                    </div>
                  </div>
                </div>-->
        <!-- Tags Block (Separate) -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">برچسب‌ها</h3>
          <!-- پیشنهادات -->
          <div class="flex flex-wrap gap-2 mb-2">
  <span
      v-for="tag in tagStore.tags"
      :key="tag.name"
      @click="addTag(tag.name)"
      class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm cursor-pointer hover:bg-rose-100 hover:text-rose-700"
  >
    {{ tag.name }} ({{ tag.count }})
  </span>
          </div>
          <!-- تگ‌های انتخاب‌شده -->
          <div class="flex flex-wrap gap-2 mb-2">
         <span v-for="(tag, index) in form.tags" :key="index"
               class="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm flex items-center gap-2">
    {{ tag }}
    <button type="button" @click="removeTag(index)" class="hover:text-rose-900">
      <i class="ti ti-x text-xs"></i>
    </button>
  </span>
          </div>
          <!-- ورودی تگ جدید -->
          <div class="flex gap-2">
            <input
                v-model="newTag"
                type="text"
                @keypress.enter.prevent="addTag()"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="برچسب جدید را وارد کنید..."
            >
            <button type="button" @click="addTag()"
                    class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              <i class="ti ti-plus"></i>
            </button>
          </div>

        </div>

        <!-- Video Upload/Link Section -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">فایل ویدیو</h3>
          <div class="space-y-4">
            <!-- Source Type Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">نوع منبع ویدیو</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                      v-model="form.videoSourceType"
                      type="radio"
                      value="upload"
                      class="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  >
                  <span class="text-sm text-gray-700">آپلود فایل</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                      v-model="form.videoSourceType"
                      type="radio"
                      value="link"
                      class="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  >
                  <span class="text-sm text-gray-700">لینک پخش</span>
                </label>
              </div>
            </div>

            <!-- Upload Section -->
            <div v-if="form.videoSourceType === 'upload'" class="space-y-3">
              <div
                  @click="$refs.videoInput.click()"
                  @drop.prevent="handleVideoDrop"
                  @dragover.prevent
                  class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all"
              >
                <div v-if="!form.videoFile">
                  <i class="ti ti-cloud-upload text-4xl text-gray-400 mb-2"></i>
                  <p class="text-sm text-gray-600">کلیک کنید یا فایل را بکشید</p>
                  <p class="text-xs text-gray-500 mt-1">حداکثر حجم: 2GB</p>
                </div>
                <div v-else class="flex items-center justify-center gap-2">
                  <i class="ti ti-file-video text-2xl text-purple-600"></i>
                  <div class="text-right">
                    <p class="text-sm font-medium text-gray-900">{{ form.videoFile.name }}</p>
                    <p class="text-xs text-gray-500">{{ formatFileSize(form.videoFile.size) }}</p>
                  </div>
                  <button
                      @click.stop="removeVideo"
                      class="mr-2 text-red-600 hover:text-red-700"
                  >
                    <i class="ti ti-x"></i>
                  </button>
                </div>
              </div>
              <input
                  ref="videoInput"
                  type="file"
                  accept="video/*"
                  class="hidden"
                  @change="handleVideoUpload"
              >
              <div v-if="movieStore.uploadProgress > 0">
                <progress class="w-full" :value="movieStore.uploadProgress" max="100"></progress>
                {{ movieStore.uploadProgress }}%
              </div>

            </div>

            <!-- Link Section -->
            <div v-if="form.videoSourceType === 'link'">
              <label class="block text-sm font-medium text-gray-700 mb-2">لینک پخش ویدیو</label>
              <input
                  v-model="form.videoLink"
                  type="text"
                  placeholder="https://example.com/video.mp4"
                  class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                  dir="ltr"
              >
              <p class="text-xs text-gray-500 mt-2">لینک مستقیم فایل ویدیو یا لینک پلیر را وارد کنید</p>
            </div>

            <!-- Quality Selection (for both) -->
            <div v-if="form.videoSourceType">
              <label class="block text-sm font-medium text-gray-700 mb-2">کیفیت ویدیو</label>
              <div class="relative">
                <button
                    @click="showQualityDropdown = !showQualityDropdown"
                    class="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <span>{{ selectedQuality.label }}</span>
                  <i class="ti ti-chevron-down text-sm"></i>
                </button>
                <ul v-if="showQualityDropdown"
                    class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  <li v-for="quality in qualities" :key="quality.value">
                    <button
                        @click="selectQuality(quality)"
                        class="w-full px-4 py-2 text-sm text-right hover:bg-gray-50"
                        :class="selectedQuality.value === quality.value ? 'bg-purple-50 text-purple-600' : 'text-gray-700'"
                    >
                      {{ quality.label }}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Poster -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">پوستر فیلم</label>
          <div class="space-y-3">
            <div v-if="form.poster" class="relative aspect-[2/3] rounded-lg overflow-hidden border-2 border-gray-200">
              <img :src="form.poster" alt="Poster" class="w-full h-full object-cover"/>
              <button
                  @click="form.poster = ''"
                  class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <i class="ti ti-x"></i>
              </button>
            </div>
            <label
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center w-full cursor-pointer">
              <i class="ti ti-upload ml-2"></i>
              آپلود پوستر
              <input type="file" @change="handlePosterUpload" accept="image/*" class="hidden"/>
            </label>
          </div>
        </div>

        <!-- Category -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">دسته‌بندی</label>
          <div class="relative">
            <button
                @click="showCategoryDropdown = !showCategoryDropdown"
                class="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-right hover:border-purple-300 transition-colors flex items-center justify-between"
            >
              <span>{{ selectedCategory || 'انتخاب دسته‌بندی' }}</span>
              <i class="ti ti-chevron-down"></i>
            </button>
            <ul
                v-show="showCategoryDropdown"
                class="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              <li
                  v-for="category in categories"
                  :key="category"
                  @click="selectCategory(category)"
                  class="px-4 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors"
                  :class="{ 'bg-purple-50 text-purple-600 font-medium': form.category === category.title }"
              >
                {{ category.title }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Status -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">وضعیت انتشار</label>
          <div class="relative">
            <button
                @click="showStatusDropdown = !showStatusDropdown"
                class="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-right hover:border-purple-300 transition-colors flex items-center justify-between"
            >
              <span>{{ getStatusLabel(form.status) }}</span>
              <i class="ti ti-chevron-down"></i>
            </button>
            <ul
                v-show="showStatusDropdown"
                class="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg"
            >
              <li
                  @click="selectStatus('draft')"
                  class="px-4 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors"
                  :class="{ 'bg-purple-50 text-purple-600 font-medium': form.status === 'draft' }"
              >
                پیش‌نویس
              </li>
              <li
                  @click="selectStatus('published')"
                  class="px-4 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors"
                  :class="{ 'bg-purple-50 text-purple-600 font-medium': form.status === 'published' }"
              >
                منتشر شده
              </li>
            </ul>
          </div>
        </div>

        <!-- Featured -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <label class="flex items-center gap-3 cursor-pointer">
            <input
                v-model="form.featured"
                type="checkbox"
                class="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span class="text-gray-700 font-medium">فیلم ویژه</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import {useRouter} from 'vue-router'
import {useToast} from "@/composables/useToast.js";
import {useMovieStore} from "@/stores/movie.ts";
import {useCategoryTypeStore} from "@/stores/category-type.ts";
import {useCategoryStore} from "@/stores/category.ts";
import {useTagStore} from "@/stores/tag.ts";
import {useTagTypeStore} from "@/stores/tag-type.ts";

const router = useRouter()
const toast = useToast()
const categoryTypeStore = useCategoryTypeStore()
const categoryStore = useCategoryStore()
const showCategoryDropdown = ref(false)
const showStatusDropdown = ref(false)

const selectedCategory = ref()
const categories = computed(() => categoryStore.categories)
console.log('c',categories.value)
const tagTypeStore = useTagTypeStore()
const tagStore = useTagStore()
const tags = computed(() => tagStore.tags)
const form = ref({
  type:'movies',
  title: '',
  titleEn: '',
  description: '',
  director: '',
  year: 2024,
  duration: 0,
  imdbRating: 0,
  cast: '',
  trailerUrl: '',
  downloadUrl: '',
  poster: '',
  categoryId: '',
  status: 'draft',
  featured: false,
  tags: [],
  videoSourceType: 'link', // 'upload' or 'link'
  videoFile: null,
  videoLink: '',
  videoQuality: '1080p'
})

//const tagInput = ref('')
const showQualityDropdown = ref(false)

const selectedQuality = ref({value: '1080p', label: '1080p - Full HD'})

const qualities = [
  {value: '480p', label: '480p - SD'},
  {value: '720p', label: '720p - HD'},
  {value: '1080p', label: '1080p - Full HD'},
  {value: '1440p', label: '1440p - 2K'},
  {value: '2160p', label: '2160p - 4K'}
]
const newTag = ref('')

function addTag(tagName) {
  const tag = tagName || newTag.value.trim()
  if (!tag) return

  if (!form.value.tags.includes(tag)) {
    form.value.tags.push(tag)

    // اگر تگ از پیشنهادات بود، شمارنده زیاد بشه
    if (tagStore.tags.some(t => t.name === tag)) {
      tagStore.incrementTagCount(tag)
    }
  }
  newTag.value = ''
}

const removeTag = async (index) => {
  const tagName = form.value.tags[index]
  const tagObj = tagStore.tags.find(t => t.name === tagName)
  if (tagObj) {
    await tagStore.decrementTagCount(tagObj.id)
  }
  form.value.tags.splice(index, 1)
}

const selectQuality = (quality) => {
  selectedQuality.value = quality
  form.value.videoQuality = quality.value
  showQualityDropdown.value = false
}

const handleVideoUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024 * 1024) { // 2GB
    toast.error('حجم فایل نباید بیشتر از 2 گیگابایت باشد')
    return
  }

  if (!file.type.startsWith('video/')) {
    toast.error('لطفاً یک فایل ویدیویی انتخاب کنید')
    return
  }

  form.value.videoFile = file
  toast.success('فایل ویدیو با موفقیت انتخاب شد')
}

const handleVideoDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024 * 1024) {
    toast.error('حجم فایل نباید بیشتر از 2 گیگابایت باشد')
    return
  }

  if (!file.type.startsWith('video/')) {
    toast.error('لطفاً یک فایل ویدیویی انتخاب کنید')
    return
  }

  form.value.videoFile = file
  toast.success('فایل ویدیو با موفقیت انتخاب شد')
}

const removeVideo = () => {
  form.value.videoFile = null
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const selectCategory = (category) => {
  form.value.categoryId = category.id
  selectedCategory.value = category.title
  showCategoryDropdown.value = false
}

const selectStatus = (status) => {
  form.value.status = status
  showStatusDropdown.value = false
}

const getStatusLabel = (status) => {
  return status === 'published' ? 'منتشر شده' : 'پیش‌نویس'
}

const handlePosterUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    toast.error('حجم فایل نباید بیشتر از 2 مگابایت باشد', 'لطفاً یک فایل کوچکتر انتخاب کنید')
    return
  }

  if (!file.type.startsWith('image/')) {
    toast.error('فقط فایل‌های تصویری مجاز هستند', 'فرمت‌های مجاز: JPG, PNG, WebP')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    form.value.poster = e.target.result
  }
  reader.readAsDataURL(file)
}

const goBack = () => {
  router.back()
}

const saveDraft = () => {
  form.value.status = 'draft'
  publishMovie()
}
const movieStore = useMovieStore()
const publishMovie = async () => {
  if (!form.value.title) {
    toast.warning('لطفاً عنوان فیلم را وارد کنید', 'عنوان الزامی است')
    return
  }

  if (!form.value.description) {
    toast.warning('لطفاً خلاصه داستان را وارد کنید', 'خلاصه داستان الزامی است')
    return
  }

  if (!form.value.categoryId) {
    toast.warning('لطفاً دسته‌بندی را انتخاب کنید', 'انتخاب دسته‌بندی الزامی است')
    return
  }

  await movieStore.addMovie(form.value, form.value.poster, form.value.videoFile)


  toast.success('فیلم با موفقیت ایجاد شد!', 'اطلاعات ذخیره گردید')
  setTimeout(() => {
    router.push('/dashboard/film/movies')
  }, 1000)
}

// Initialize
onMounted(async () => {
  await categoryTypeStore.fetchType('film')
  await tagTypeStore.fetchType('film')
})

watch(
    () => categoryTypeStore.selectedType,
    async (type) => {
      if (type?.id) {
        await categoryStore.fetchCategories({typeId: type.id,contentType:'movie'})
      }
    },
    {immediate: true}
)

watch(
    () => tagTypeStore.selectedType,
    async (type) => {
      if (type?.id) {
        await tagStore.fetchTags({typeId: type.id,contentType:'movie'})
      }
    },
    {immediate: true}
)
</script>
