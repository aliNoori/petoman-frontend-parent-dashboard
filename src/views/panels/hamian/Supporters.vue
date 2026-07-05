<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">مدیریت حامیان</h1>
        <p class="text-sm text-gray-600 mt-1">{{ filteredSupporters.length }} حامی در سیستم</p>
      </div>
      <div class="flex gap-2">
        <button 
          @click="exportToExcel"
          class="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <i class="ti ti-file-spreadsheet"></i>
          <span>خروجی Excel</span>
        </button>
        <button 
          @click="createNewSupporter"
          class="btn-primary w-full sm:w-auto"
        >
          <i class="ti ti-plus ml-2"></i>
          افزودن حامی جدید
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Search -->
        <div class="flex-1">
          <div class="relative">
            <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="جستجوی حامی..."
              class="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
          </div>
        </div>

        <!-- Type Filter -->
        <div class="relative">
          <button
              @click.stop="showTypeDropdown = !showTypeDropdown"
            class="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm"
          >
            <span>{{ getTypeFilterLabel() }}</span>
            <i class="ti ti-chevron-down text-sm"></i>
          </button>
          
          <Transition name="dropdown">
            <ul v-if="showTypeDropdown" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-20 min-w-[180px]">
              <li
                v-for="type in typeFilters"
                :key="type.value"
                @click="selectTypeFilter(type.value)"
                class="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm transition-colors"
                :class="selectedType === type.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'"
              >
                <i :class="type.icon" class="ml-2"></i>
                {{ type.label }}
              </li>
            </ul>
          </Transition>
        </div>

        <!-- Status Filter -->
        <div class="relative">
          <button
            @click.stop="showStatusDropdown = !showStatusDropdown"
            class="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm"
          >
            <span>{{ getStatusFilterLabel() }}</span>
            <i class="ti ti-chevron-down text-sm"></i>
          </button>
          
          <Transition name="dropdown">
            <ul v-if="showStatusDropdown" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-20 min-w-[150px]">
              <li
                v-for="status in statusFilters"
                :key="status.value"
                @click="selectStatusFilter(status.value)"
                class="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm transition-colors"
                :class="selectedStatus === status.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'"
              >
                {{ status.label }}
              </li>
            </ul>
          </Transition>
        </div>
      </div>
    </div>

    <!-- Supporters Grid -->
    <div v-if="filteredSupporters.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <div
        v-for="supporter in paginatedSupporters"
        :key="supporter.id"
        class="bg-white rounded-xl sm:rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
      >
        <!-- Card Header -->
        <div class="relative h-24 bg-gradient-to-br from-blue-400 to-cyan-500">
          <div class="absolute -bottom-12 right-6">
            <div class="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              <img v-if="supporter?.avatar && supporter.avatar !== 'null' && supporter.avatar.trim() !== ''"
                   :src="supporter.avatar"
                   :alt="supporter.name"
                   class="w-24 h-24 rounded-full object-cover"
              >
              <span v-else class="text-white text-xl font-medium">{{ supporter.initials.charAt(0) }}</span>
            </div>
          </div>
          <div class="absolute top-3 left-3">
            <span
              class="px-3 py-1 text-xs font-medium rounded-full backdrop-blur-sm"
              :class="supporter.status === 'active' 
                ? 'bg-green-500/90 text-white' 
                : 'bg-gray-500/90 text-white'"
            >
              {{ supporter.status === 'active' ? 'فعال' : 'غیرفعال' }}
            </span>
          </div>
        </div>

        <!-- Card Content -->
        <div class="pt-14 px-4 sm:px-6 pb-4 sm:pb-6">
          <h3 class="text-lg font-bold text-gray-900 mb-1">{{ supporter.name }}</h3>
          <p class="text-sm text-blue-600 font-medium mb-3">{{ supporter.typeLabel }}</p>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-100">
            <div class="text-center">
              <p class="text-xl font-bold text-gray-900">{{ supporter.totalDonations }}</p>
              <p class="text-xs text-gray-500">کمک‌ها</p>
            </div>
            <div class="text-center">
              <p class="text-xl font-bold text-blue-600">{{ formatCurrency(supporter.totalAmount) }}</p>
              <p class="text-xs text-gray-500">مبلغ کل</p>
            </div>
            <div class="text-center">
              <p class="text-xl font-bold text-gray-900">{{ supporter.projects }}</p>
              <p class="text-xs text-gray-500">پروژه</p>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="space-y-2 mb-4 text-sm">
            <div v-if="supporter.phone" class="flex items-center gap-2 text-gray-600">
              <i class="ti ti-phone text-blue-600"></i>
              <span dir="ltr" class="text-left">{{ supporter.phone }}</span>
            </div>
            <div v-if="supporter.email" class="flex items-center gap-2 text-gray-600">
              <i class="ti ti-mail text-blue-600"></i>
              <span class="truncate">{{ supporter.email }}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-600">
              <i class="ti ti-calendar text-blue-600"></i>
              <span>عضو از {{ supporter.joinDate }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <button
              @click="viewSupporter(supporter)"
              class="flex-1 px-3 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors text-sm"
            >
              <i class="ti ti-eye ml-1"></i>
              مشاهده
            </button>
            <button
              @click="editSupporter(supporter)"
              class="flex-1 px-3 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              <i class="ti ti-edit ml-1"></i>
              ویرایش
            </button>
            <button
              @click="deleteSupporter(supporter)"
              class="px-3 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors text-sm"
            >
              <i class="ti ti-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-8 sm:p-12 text-center">
      <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
        <i class="ti ti-users text-4xl text-blue-600"></i>
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-2">حامی‌ای یافت نشد</h3>
      <p class="text-gray-600 mb-6">هنوز حامی‌ای در سیستم ثبت نشده است</p>
      <button @click="createNewSupporter" class="btn-primary">
        <i class="ti ti-user-plus ml-2"></i>
        افزودن اولین حامی
      </button>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
        :class="currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'"
      >
        <i class="ti ti-chevron-right"></i>
      </button>

      <div class="flex gap-2">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          class="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors"
          :class="currentPage === page ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'"
        >
          {{ page }}
        </button>
      </div>

      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
        :class="currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'"
      >
        <i class="ti ti-chevron-left"></i>
      </button>
    </div>

    <!-- View Supporter Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showViewModal" @click="showViewModal = false" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div @click.stop class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <!-- Modal Header -->
            <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 class="text-xl font-bold text-gray-900">جزئیات حامی</h2>
              <button @click="showViewModal = false" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <i class="ti ti-x text-xl text-gray-600"></i>
              </button>
            </div>

            <!-- Modal Content -->
            <div v-if="selectedSupporter" class="p-6">
              <!-- Profile Section -->
              <div class="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold">
                  {{ selectedSupporter.initials }}
                </div>
                <div class="flex-1">
                  <h3 class="text-2xl font-bold text-gray-900 mb-1">{{ selectedSupporter.name }}</h3>
                  <div class="flex items-center gap-3">
                    <span class="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700">
                      {{ selectedSupporter.typeLabel }}
                    </span>
                    <span 
                      class="px-3 py-1 text-sm font-medium rounded-full"
                      :class="selectedSupporter.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'"
                    >
                      {{ selectedSupporter.status === 'active' ? 'فعال' : 'غیرفعال' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Stats Grid -->
              <div class="grid grid-cols-3 gap-4 mb-6">
                <div class="bg-blue-50 rounded-xl p-4 text-center">
                  <p class="text-3xl font-bold text-blue-600 mb-1">{{ selectedSupporter.totalDonations }}</p>
                  <p class="text-sm text-gray-600">تعداد کمک‌ها</p>
                </div>
                <div class="bg-green-50 rounded-xl p-4 text-center">
                  <p class="text-3xl font-bold text-green-600 mb-1">{{ formatCurrency(selectedSupporter.totalAmount) }}</p>
                  <p class="text-sm text-gray-600">مجموع کمک‌ها</p>
                </div>
                <div class="bg-purple-50 rounded-xl p-4 text-center">
                  <p class="text-3xl font-bold text-purple-600 mb-1">{{ selectedSupporter.projects }}</p>
                  <p class="text-sm text-gray-600">تعداد پروژه‌ها</p>
                </div>
              </div>

              <!-- Contact Info -->
              <div class="space-y-4">
                <h4 class="font-bold text-gray-900 mb-3">اطلاعات تماس</h4>
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <i class="ti ti-phone text-blue-600"></i>
                  </div>
                  <div class="flex-1">
                    <p class="text-xs text-gray-500">شماره تلفن</p>
                    <p class="font-medium text-gray-900" dir="ltr">{{ selectedSupporter.phone }}</p>
                  </div>
                </div>

                <div v-if="selectedSupporter.email" class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <i class="ti ti-mail text-green-600"></i>
                  </div>
                  <div class="flex-1">
                    <p class="text-xs text-gray-500">ایمیل</p>
                    <p class="font-medium text-gray-900">{{ selectedSupporter.email }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <i class="ti ti-calendar text-purple-600"></i>
                  </div>
                  <div class="flex-1">
                    <p class="text-xs text-gray-500">تاریخ عضویت</p>
                    <p class="font-medium text-gray-900">{{ selectedSupporter.joinDate }}</p>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button 
                  @click="showViewModal = false; editSupporter(selectedSupporter)"
                  class="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <i class="ti ti-edit ml-2"></i>
                  ویرایش اطلاعات
                </button>
                <button 
                  @click="showViewModal = false"
                  class="px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Edit Supporter Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showEditModal" @click="showEditModal = false" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div @click.stop class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <!-- Modal Header -->
            <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 class="text-xl font-bold text-gray-900">ویرایش حامی</h2>
              <button @click="showEditModal = false" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <i class="ti ti-x text-xl text-gray-600"></i>
              </button>
            </div>

            <!-- Modal Content -->
            <form @submit.prevent="saveEditSupporter" class="p-6 space-y-4">
              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  نام و نام خانوادگی <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="editForm.name"
                  type="text"
                  required
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="نام کامل حامی را وارد کنید"
                >
              </div>

              <!-- Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  نوع حامی <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="editForm.type"
                  required
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="financial">حامی مالی</option>
                  <option value="volunteer">داوطلب</option>
                  <option value="both">مالی و داوطلب</option>
                </select>
              </div>

              <!-- Phone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  شماره تلفن <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="editForm.phone"
                  type="tel"
                  required
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="09123456789"
                  dir="ltr"
                >
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  ایمیل
                </label>
                <input
                  v-model="editForm.email"
                  type="email"
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="example@email.com"
                  dir="ltr"
                >
              </div>

              <!-- Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  وضعیت <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="editForm.status"
                  required
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">فعال</option>
                  <option value="inactive">غیرفعال</option>
                </select>
              </div>

              <!-- Actions -->
              <div class="flex gap-3 pt-4">
                <button 
                  type="submit"
                  class="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <i class="ti ti-device-floppy ml-2"></i>
                  ذخیره تغییرات
                </button>
                <button 
                  type="button"
                  @click="showEditModal = false"
                  class="px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {useSupporterStore} from "@/stores/supporter.ts";

const router = useRouter()
const supporterStore = useSupporterStore()
// State
const showTypeDropdown = ref(false)
const showStatusDropdown = ref(false)
const searchQuery = ref('')
const selectedType = ref('all')
const selectedStatus = ref('all')
const currentPage = ref(1)
const itemsPerPage = 9

const typeFilters = [
  { value: 'all', label: 'همه حامیان', icon: 'ti ti-list' },
  { value: 'financial', label: 'حامی مالی', icon: 'ti ti-coin' },
  { value: 'volunteer', label: 'داوطلب', icon: 'ti ti-heart' },
  { value: 'both', label: 'مالی و داوطلب', icon: 'ti ti-star' }
]

const statusFilters = [
  { value: 'all', label: 'همه' },
  { value: 'active', label: 'فعال' },
  { value: 'inactive', label: 'غیرفعال' }
]

// Sample Data
const supporters = computed(()=>supporterStore.supporterCases);

// Computed
const filteredSupporters = computed(() => {
  let result = [...supporters.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(s => 
      s.name.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query) ||
      s.phone.includes(query)
    )
  }

  if (selectedType.value !== 'all') {
    result = result.filter(s => s.type === selectedType.value)
  }

  if (selectedStatus.value !== 'all') {
    result = result.filter(s => s.status === selectedStatus.value)
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredSupporters.value.length / itemsPerPage))

const paginatedSupporters = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredSupporters.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Methods
const formatCurrency = (amount) => {
  if (amount === 0) return '0'
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + 'م'
  }
  return (amount / 1000).toLocaleString('fa-IR') + 'ه'
}

const getTypeFilterLabel = () => {
  const filter = typeFilters.find(f => f.value === selectedType.value)
  return filter ? filter.label : 'همه حامیان'
}

const getStatusFilterLabel = () => {
  const filter = statusFilters.find(f => f.value === selectedStatus.value)
  return filter ? filter.label : 'همه'
}

const selectTypeFilter = (value) => {
  selectedType.value = value
  showTypeDropdown.value = false
  currentPage.value = 1
}

const selectStatusFilter = (value) => {
  selectedStatus.value = value
  showStatusDropdown.value = false
  currentPage.value = 1
}

const createNewSupporter = () => {
  console.log('Navigate to supporters create page')
  router.push('/dashboard/hamian/supporters/create')
}

// View/Edit/Delete Modal States
const showViewModal = ref(false)
const showEditModal = ref(false)
const selectedSupporter = ref(null)
const editForm = ref({
  name: '',
  type: '',
  phone: '',
  email: '',
  status: ''
})

const viewSupporter = (supporter) => {
  selectedSupporter.value = supporter
  showViewModal.value = true
}

const editSupporter = (supporter) => {
  selectedSupporter.value = supporter
  editForm.value = {
    name: supporter.name,
    type: supporter.type,
    phone: supporter.phone,
    email: supporter.email,
    status: supporter.status
  }
  showEditModal.value = true
}

const saveEditSupporter = async () => {
  if (!editForm.value.name || !editForm.value.type) {
    alert('لطفا نام و نوع حامی را وارد کنید')
    return
  }

  const index = supporters.value.findIndex(s => s.id === selectedSupporter.value.id)
  if (index !== -1) {
    await supporterStore.updateSupporter({
      ...editForm.value,
      id: selectedSupporter.value.id
    })
    supporters.value[index] = {
      ...supporters.value[index],
      name: editForm.value.name,
      type: editForm.value.type,
      typeLabel: getTypeLabel(editForm.value.type),
      phone: editForm.value.phone,
      email: editForm.value.email,
      status: editForm.value.status,
      initials: editForm.value.name.split(' ').map(n => n[0]).join(' ')
    }
  }

  showEditModal.value = false
  selectedSupporter.value = null
}

const deleteSupporter = async (supporter) => {
  if (confirm(`آیا از حذف حامی "${supporter.name}" اطمینان دارید؟\n\nتوجه: تمام سوابق کمک‌های این حامی حفظ خواهد شد.`)) {
    await supporterStore.removeSupporter(supporter.id)
    supporterStore.supporterCases = supporterStore.supporterCases.filter(s => s.id !== supporter.id)
  }
}

const getTypeLabel = (type) => {
  const labels = {
    financial: 'حامی مالی',
    volunteer: 'داوطلب',
    both: 'مالی و داوطلب'
  }
  return labels[type] || type
}

const getStatusLabel = (status) => {
  return status === 'active' ? 'فعال' : 'غیرفعال'
}

const exportToExcel = () => {
  // Create CSV content
  const headers = ['ردیف', 'نام حامی', 'نوع', 'تعداد کمک‌ها', 'مجموع کمک‌ها (تومان)', 'تعداد پروژه‌ها', 'تلفن', 'ایمیل', 'تاریخ عضویت', 'وضعیت']
  const rows = filteredSupporters.value.map((s, index) => [
    index + 1,
    s.name,
    getTypeLabel(s.type),
    s.totalDonations,
    s.totalAmount,
    s.projects,
    s.phone,
    s.email || '-',
    s.joinDate,
    getStatusLabel(s.status)
  ])
  
  // Convert to CSV
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
  
  // Add BOM for UTF-8
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  
  // Create download link
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `supporters_${new Date().toLocaleDateString('fa-IR').replace(/\//g, '-')}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const goToPage = (page) => {
  currentPage.value = page
}

// Close dropdowns
const handleClickOutside = () => {
  showTypeDropdown.value = false
  showStatusDropdown.value = false
}

onMounted(async () => {
  await supporterStore.fetchSupporters()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.2s ease;
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div, .modal-leave-to > div {
  transform: scale(0.95);
  opacity: 0;
}

.btn-primary {
  padding: 0.625rem 1.5rem;
  background: linear-gradient(to right, rgb(37, 99, 235), rgb(59, 130, 246));
  color: white;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.3s;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary:hover {
  background: linear-gradient(to right, rgb(29, 78, 216), rgb(37, 99, 235));
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.btn-secondary {
  padding: 0.625rem 1.5rem;
  background: white;
  color: rgb(107, 114, 128);
  font-weight: 500;
  border: 1px solid rgb(229, 231, 235);
  border-radius: 0.5rem;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-secondary:hover {
  background: rgb(249, 250, 251);
  border-color: rgb(209, 213, 219);
  color: rgb(75, 85, 99);
}
</style>
