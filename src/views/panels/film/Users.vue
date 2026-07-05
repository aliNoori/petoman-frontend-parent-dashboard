<template>
  <div class="space-y-6">
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">مدیریت کاربران</h1>
        <p class="text-gray-600 mt-1">مدیریت کاربران عادی و مدیران سیستم</p>
      </div>
      <div class="flex gap-3">
        <button @click="exportToExcel" class="btn-secondary">
          <i class="ti ti-download ml-2"></i>
          خروجی Excel
        </button>
        <button @click="showAddModal = true" class="btn-primary">
          <i class="ti ti-user-plus ml-2"></i>
          کاربر جدید
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">کل کاربران</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ users.length }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
            <i class="ti ti-users text-purple-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">مدیران</p>
            <p class="text-2xl font-bold text-blue-600 mt-1">{{ adminCount }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
            <i class="ti ti-crown text-blue-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">کاربران فعال</p>
            <p class="text-2xl font-bold text-green-600 mt-1">{{ activeCount }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
            <i class="ti ti-check text-green-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">آنلاین</p>
            <p class="text-2xl font-bold text-orange-600 mt-1">{{ onlineCount }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
            <i class="ti ti-circle-dot text-orange-600 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-200">
      <div class="p-6">
        <h3 class="text-lg font-semibold text-gray-900">لیست کاربران</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نام کاربر</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">یوزرنیم / موبایل</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">ایمیل</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نقش</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاریخ عضویت</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عملیات</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
          <tr v-if="users.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-gray-500">
              <i class="ti ti-users-off text-4xl mb-2 block"></i>
              <p>هنوز کاربری ثبت نشده است</p>
            </td>
          </tr>
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div
                    class="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center">
                  <img v-if="user?.avatar && user.avatar !== 'null' && user.avatar.trim() !== ''"
                       :src="user.avatar"
                       :alt="user.name.charAt(0)"
                       class="w-12 h-12 rounded-full object-cover content-center align-center text-center"
                  >
                  <span v-else class="text-white text-sm font-medium">{{ user.name.charAt(0) }}</span>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div v-if="user.role === 'film_admin'" class="text-sm">
                <div v-if="user.username" class="font-mono text-purple-600">@{{ user.username }}</div>
                <div class="text-gray-500 text-xs mt-0.5">{{ user.phone }}</div>
              </div>
              <div v-else class="text-sm text-gray-700">
                {{ user.phone }}
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ user.email }}</td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 rounded text-xs"
                      :class="user.role === 'film_admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'">
                  {{ user.role === 'film_admin' ? 'مدیر' : 'کاربر' }}
                </span>
            </td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 rounded text-xs flex items-center gap-1 w-fit"
                      :class="user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  <i class="ti ti-circle-filled text-[6px]" :class="user.online ? 'text-green-500' : ''"></i>
                  {{ user.active ? 'فعال' : 'غیرفعال' }}
                </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ user.joinDate }}</td>
            <td class="px-6 py-4">
              <div class="flex gap-2 mt-3">
                <button
                    @click="editUser(user)"
                    class="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  <i class="ti ti-edit ml-1"></i>
                  ویرایش
                </button>
                <button
                    @click="deleteUser(user.id)"
                    class="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  <i class="ti ti-trash ml-1"></i>
                  حذف
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <div v-if="showAddModal || showEditModal"
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
         @click.self="closeModal">
      <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-gray-900">{{ showEditModal ? 'ویرایش کاربر' : 'افزودن کاربر جدید' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <i class="ti ti-x text-xl"></i>
          </button>
        </div>

        <div class="space-y-4">
          <div class="flex flex-col items-center mb-6 w-full">
            <label class="block text-sm font-medium text-gray-700 mb-3">تصویر پروفایل</label>
            <ImageUploader
                label="عکس پروفایل"
                :image="newUser.avatar"
                field="avatar"
                :aspectRatio="1"
                @select="handleImageUpload"
                @remove="removeImage"
                class="w-32 h-32 rounded-full overflow-hidden"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">نام کامل *</label>
            <input
                v-model="newUser.name"
                type="text"
                placeholder="نام و نام خانوادگی"
                class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">شماره موبایل *</label>
            <input
                v-model="newUser.phone"
                type="tel"
                placeholder="09123456789"
                class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                maxlength="11"
            >
          </div>

          <div v-if="newUser.role === 'film_admin'">
            <label class="block text-sm font-medium text-gray-700 mb-2">یوزرنیم *</label>
            <div class="relative">
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
              <input
                  v-model="newUser.username"
                  type="text"
                  placeholder="username"
                  class="w-full pr-8 pl-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-mono"
              >
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ایمیل *</label>
            <input
                v-model="newUser.email"
                type="email"
                placeholder="example@email.com"
                class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">رمز عبور *</label>
            <input
                v-model="newUser.password"
                type="password"
                placeholder="حداقل 8 کاراکتر"
                class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">نقش *</label>
            <div class="relative">
              <button
                  @click="showRoleDropdown = !showRoleDropdown"
                  type="button"
                  class="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-right hover:border-purple-300 transition-colors flex items-center justify-between"
              >
                <span>{{ newUser.role === 'film_admin' ? 'مدیر' : 'کاربر عادی' }}</span>
                <i class="ti ti-chevron-down"></i>
              </button>
              <ul
                  v-show="showRoleDropdown"
                  class="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg"
              >
                <li
                    @click="selectRole('subscriber')"
                    class="px-4 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors"
                    :class="{ 'bg-purple-50 text-purple-600 font-medium': newUser.role === 'subscriber' }"
                >
                  کاربر عادی
                </li>
                <li
                    @click="selectRole('film_admin')"
                    class="px-4 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors"
                    :class="{ 'bg-purple-50 text-purple-600 font-medium': newUser.role === 'film_admin' }"
                >
                  مدیر
                </li>
              </ul>
            </div>
          </div>

          <div class="flex items-center">
            <input
                v-model="newUser.active"
                type="checkbox"
                id="active"
                class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            >
            <label for="active" class="mr-2 text-sm text-gray-700">کاربر فعال باشد</label>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button @click="closeModal"
                  class="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
            انصراف
          </button>
          <button @click="addUser"
                  class="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
            {{ showEditModal ? 'ذخیره تغییرات' : 'افزودن کاربر' }}
          </button>
        </div>
      </div>
    </div>
    <ImageCropper v-if="cropper.show" :show="cropper.show" :image-file="cropper.imageFile"
                  :aspect-ratio="cropper.aspectRatio" @close="closeCropper" @save="saveCroppedImage"/>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useToast} from "@/composables/useToast.js";
import {useUserStore} from "@/stores/user.ts";
import {toJalaliDate} from "@/utils/date.ts";
import ImageUploader from "@/components/ImageUploader.vue";
import ImageCropper from "@/components/ImageCropper.vue";

const userStore = useUserStore()
const toast = useToast()
const users = computed(() =>
    userStore.users.map(u => {
      // بررسی نقش‌ها
      const rolesArray = Array.isArray(u.legacyRoles) ? u.legacyRoles : []
      let role = 'film_subscriber' // پیش‌فرض

      if (rolesArray.includes('film_admin')) {
        role = 'film_admin'
      } else if (rolesArray.includes('film_subscriber')) {
        role = 'film_subscriber'
      }

      return {
        id: u.id,
        name: u.fullName,
        username: u.username || '',
        avatar: u.avatar,
        email: u.email,
        phone: u.phoneNumber,
        role: role,
        active: u.isActive,
        joinDate: toJalaliDate(u.createdAt),
        lastLogin: u.lastSeen || ''
      }
    })
)

const showAddModal = ref(false)
const showEditModal = ref(false)
const showRoleDropdown = ref(false)

const newUser = ref({
  avatar: '',
  name: '',
  phone: '',
  username: '',
  email: '',
  password: '',
  role: 'film_subscriber',
  active: true
})
const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
}

const adminCount = computed(() => users.value.filter(u => u.role === 'film_admin').length)
const activeCount = computed(() => users.value.filter(u => u.active).length)
const onlineCount = computed(() => users.value.filter(u => u.online).length)

const selectRole = (role) => {
  newUser.value.role = role
  showRoleDropdown.value = false
}

const addUser = async () => {
  // Validation
  if (!newUser.value.name || !newUser.value.phone || !newUser.value.email || !newUser.value.password) {
    toast.warning('لطفاً همه فیلدها را پر کنید', 'نام، موبایل، ایمیل و رمز عبور الزامی هستند')
    return
  }

  // Validate phone number
  if (!/^09\d{9}$/.test(newUser.value.phone)) {
    toast.error('شماره موبایل نامعتبر است', 'فرمت صحیح: 09123456789')
    return
  }

  // Check admin username
  if (newUser.value.role === 'film_admin' && !newUser.value.username) {
    toast.warning('یوزرنیم برای مدیر الزامی است', 'لطفاً یوزرنیم را وارد کنید')
    return
  }

  if (newUser.value.password.length < 8) {
    toast.error('رمز عبور باید حداقل 8 کاراکتر باشد', 'رمز عبور ضعیف است')
    return
  }

  if (showEditModal.value) {
    // Update existing user
    const payload = {
      fullName: newUser.value.name,
      phoneNumber: newUser.value.phone,
      password: newUser.value.password,
      email: newUser.value.email,
      roles: [newUser.value.role],
      isActive: newUser.value.active,
      online: false,
      joinDate: new Date().toLocaleDateString('fa-IR'),
      lastLogin: newUser.value.lastLogin ? new Date(newUser.value.lastLogin) : undefined,
      avatar: newUser.value.avatar,
    }
    if (newUser.value.role === 'film_admin') {
      payload.username = newUser.value.username
    } else {
      payload.username = null
    }

    await userStore.updateUser(newUser.value.id, payload)
    const index = users.value.findIndex(u => u.id === newUser.value.id)
    if (index !== -1) {
      users.value[index] = {...users.value[index], ...payload}
    }
  } else {

    // Check duplicate email
    if (users.value.some(u => u.email === newUser.value.email)) {
      toast.error('این ایمیل قبلاً ثبت شده است', 'لطفاً ایمیل دیگری وارد کنید')
      return
    }

    // Check duplicate phone
    if (users.value.some(u => u.phone === newUser.value.phone)) {
      toast.error('این شماره موبایل قبلاً ثبت شده است', 'لطفاً شماره دیگری وارد کنید')
      return
    }

    // Check duplicate username for admins
    if (newUser.value.role === 'film_admin' && users.value.some(u => u.username === newUser.value.username)) {
      toast.error('این یوزرنیم قبلاً استفاده شده است', 'لطفاً یوزرنیم دیگری انتخاب کنید')
      return
    }

    const user = {
      fullName: newUser.value.name,
      phoneNumber: newUser.value.phone,
      password: newUser.value.password,
      email: newUser.value.email,
      roles: [newUser.value.role],
      isActive: newUser.value.active,
      online: false,
      joinDate: new Date().toLocaleDateString('fa-IR'),
      lastLogin: newUser.value.lastLogin ? new Date(newUser.value.lastLogin) : undefined,
      avatar: newUser.value.avatar,
    }

    // Add username only for admins
    if (newUser.value.role === 'film_admin') {
      user.username = newUser.value.username
    } else {
      user.username = null
    }
    const createdUser = await userStore.addUser(user)
    users.value.push(createdUser)
    toast.success('کاربر جدید اضافه شد!', `${user.name} با موفقیت ثبت شد`)
  }

  // Reset form
  newUser.value = {
    name: '',
    phone: '',
    username: '',
    email: '',
    password: '',
    role: 'film_subscriber',
    active: true
  }

  showAddModal.value = false
  showEditModal.value = false
}

const exportToExcel = () => {
  toast.info('در حال خروجی گرفتن...', 'فایل Excel در حال آماده‌سازی است')
  console.log('Export to Excel')
}

const cropper = ref({show: false, imageFile: undefined, aspectRatio: 1, fieldName: ''})

function saveCroppedImage(base64) {

  if (!base64 || !cropper.value.fieldName) return
  newUser.value[cropper.value.fieldName] = base64
  closeCropper()
}

const editUser = (user) => {
  newUser.value = {...user}
  showEditModal.value = true
}
const deleteUser = async (userId) => {
  if (confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
    await userStore.deleteUser(userId)
    const index = users.value.findIndex(u => u.id === userId)
    if (index !== -1) {
      users.value.splice(index, 1)
    }
  }
}

function closeCropper() {
  cropper.value = {show: false, imageFile: undefined, aspectRatio: 1, fieldName: ''}
}

function handleImageUpload({file, field, aspectRatio}) {
  cropper.value = {show: true, imageFile: file, aspectRatio, fieldName: field}
}

function removeImage(field) {
  newUser.value[field] = null
}

onMounted(async () => {
  await userStore.fetchAllUsers()
})
</script>

<style scoped>
.btn-primary {
  background-color: #9333ea;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
}

.btn-secondary {
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
}
</style>
