<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">مدیریت کاربران</h1>
        <p class="text-gray-600 mt-1">مدیریت کاربران عادی و مدیران سیستم حامیان</p>
      </div>
      <div class="flex gap-3">
        <button @click="exportToExcel"
                class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center">
          <i class="ti ti-download ml-2"></i>
          خروجی Excel
        </button>
        <div v-if="selectedUsers.length > 0" class="flex gap-2">
          <button @click="bulkActivate"
                  class="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center">
            <i class="ti ti-check ml-1"></i>
            فعال‌سازی ({{ selectedUsers.length }})
          </button>
          <button @click="bulkDeactivate"
                  class="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center">
            <i class="ti ti-ban ml-1"></i>
            غیرفعال‌سازی ({{ selectedUsers.length }})
          </button>
        </div>
        <button @click="showAddModal = true"
                class="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all font-medium flex items-center">
          <i class="ti ti-user-plus ml-2"></i>
          کاربر جدید
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">کل کاربران</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ users.length }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
            <i class="ti ti-users text-blue-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">مدیران</p>
            <p class="text-2xl font-bold text-rose-600 mt-1">{{ adminCount }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-rose-50 flex items-center justify-center">
            <i class="ti ti-crown text-rose-600 text-xl"></i>
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

    <!-- Filters -->
    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <div class="flex flex-col lg:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <i class="ti ti-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
                v-model="searchQuery"
                type="text"
                placeholder="جستجو در کاربران..."
                class="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
            >
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Role Filter -->
          <div class="relative role-dropdown">
            <button
                @click="showRoleDropdown = !showRoleDropdown"
                class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2 min-w-[140px] justify-between w-full sm:w-auto"
            >
              <span>{{ selectedRole.label }}</span>
              <i class="ti ti-chevron-down text-sm"></i>
            </button>
            <ul v-if="showRoleDropdown" class="dropdown-menu">
              <li v-for="role in roleOptions" :key="role.value">
                <button @click="selectRole(role)" class="dropdown-item">
                  {{ role.label }}
                </button>
              </li>
            </ul>
          </div>

          <!-- Status Filter -->
          <div class="relative status-dropdown">
            <button
                @click="showStatusDropdown = !showStatusDropdown"
                class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2 min-w-[140px] justify-between w-full sm:w-auto"
            >
              <span>{{ selectedStatus.label }}</span>
              <i class="ti ti-chevron-down text-sm"></i>
            </button>
            <ul v-if="showStatusDropdown" class="dropdown-menu">
              <li v-for="status in statusOptions" :key="status.value">
                <button @click="selectStatus(status)" class="dropdown-item">
                  {{ status.label }}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <!-- Table Header with Instructions -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">لیست کاربران</h3>
        <div class="flex items-center gap-4 text-sm text-gray-600">
          <div class="flex items-center gap-2">
            <i class="ti ti-info-circle text-blue-500"></i>
            <span>برای تغییر وضعیت کاربر از کلید تغییر در ستون وضعیت استفاده کنید</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-3 bg-rose-600 rounded-full"></div>
            <span>فعال</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-3 bg-gray-300 rounded-full"></div>
            <span>غیرفعال</span>
          </div>
        </div>
      </div>

      <!-- Desktop Table -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input type="checkbox" @change="toggleSelectAll" :checked="allSelected" class="rounded border-gray-300">
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">کاربر</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نقش</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ایمیل</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">موبایل</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ ثبت‌نام
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <input
                  type="checkbox"
                  v-model="selectedUsers"
                  :value="user.id"
                  class="rounded border-gray-300"
              >
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center">

                  <img v-if="user?.avatar && user.avatar !== 'null' && user.avatar.trim() !== ''"
                      :src="user.avatar"
                      :alt="user.name?.charAt(0)"
                      class="w-10 h-10 rounded-full object-cover text-center content-center"
                  >
                  <span v-else class="text-white text-sm font-medium">{{ user.name?.charAt(0) }}</span>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                  <div class="text-xs text-gray-500">{{ user.username }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                    :class="user.role === 'supporter_admin' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'"
                >
                  <i :class="user.role === 'supporter_admin' ? 'ti ti-crown' : 'ti ti-user'"></i>
                  {{ user.role === 'supporter_admin' ? 'مدیر' : 'کاربر عادی' }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.phone }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.createdAt }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    v-model="user.isActive"
                    @change="toggleUserStatus(user)"
                    class="sr-only peer"
                >
                <div
                    class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <div class="flex items-center gap-2">
                <button
                    @click="editUser(user)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="ویرایش"
                >
                  <i class="ti ti-edit text-lg"></i>
                </button>
                <button
                    @click="deleteUser(user.id)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="حذف"
                >
                  <i class="ti ti-trash text-lg"></i>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="lg:hidden divide-y divide-gray-200">
        <div v-for="user in filteredUsers" :key="user.id" class="p-4">
          <div class="flex items-start gap-3">
            <input
                type="checkbox"
                v-model="selectedUsers"
                :value="user.id"
                class="mt-1 rounded border-gray-300"
            >
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center">
                  <img v-if="user.avatar"
                       :src="user.avatar"
                       :alt="user.name"
                       class="12 h-12 rounded-full object-cover"
                  >
                  <span v-else class="text-white text-sm font-medium">{{ user.name.charAt(0) }}</span>
                </div>
                <div class="flex-1">
                  <div class="font-medium text-gray-900">{{ user.name }}</div>
                  <div class="text-sm text-gray-500">{{ user.username }}</div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                      type="checkbox"
                      v-model="user.isActive"
                      @change="toggleUserStatus(user)"
                      class="sr-only peer"
                  >
                  <div
                      class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>

              <div class="space-y-2 text-sm">
                <div class="flex items-center gap-2">
                  <span
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                      :class="user.role === 'supporter_admin' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'"
                  >
                    <i :class="user.role === 'supporter_admin' ? 'ti ti-crown' : 'ti ti-user'"></i>
                    {{ user.role === 'supporter_admin' ? 'مدیر' : 'کاربر عادی' }}
                  </span>
                </div>
                <div class="text-gray-600">
                  <i class="ti ti-mail text-gray-400 ml-1"></i>
                  {{ user.email }}
                </div>
                <div class="text-gray-600">
                  <i class="ti ti-phone text-gray-400 ml-1"></i>
                  {{ user.phone }}
                </div>
                <div class="text-gray-500 text-xs">
                  <i class="ti ti-calendar text-gray-400 ml-1"></i>
                  {{ user.createdAt }}
                </div>
              </div>

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
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredUsers.length === 0" class="text-center py-12">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <i class="ti ti-user-x text-3xl text-gray-400"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">کاربری یافت نشد</h3>
        <p class="text-gray-600">با فیلترهای دیگری جستجو کنید</p>
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <Transition name="modal">
      <div v-if="showAddModal || showEditModal"
           class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
           @click="closeModal">
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden" @click.stop>
          <!-- Modal Header -->
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 class="text-xl font-bold text-gray-900">
              {{ showEditModal ? 'ویرایش کاربر' : 'افزودن کاربر جدید' }}
            </h2>
            <button @click="closeModal" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <i class="ti ti-x text-xl text-gray-600"></i>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="overflow-y-auto" style="max-height: calc(90vh - 80px);">
            <div class="p-6">
              <form @submit.prevent="saveUser" class="space-y-4">
                <div class="flex flex-col items-center mb-6 w-full">
                  <label class="block text-sm font-medium text-gray-700 mb-3">تصویر پروفایل</label>
                  <ImageUploader
                      label="عکس پروفایل"
                      :image="formData.avatar"
                      field="avatar"
                      :aspectRatio="1"
                      @select="handleImageUpload"
                      @remove="removeImage"
                      class="w-32 h-32 rounded-full overflow-hidden"
                  />
                </div>
                <!-- Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">نام و نام خانوادگی *</label>
                  <input
                      v-model="formData.name"
                      type="text"
                      required
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                      placeholder="نام کامل کاربر"
                  >
                </div>

                <!-- Username -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">نام کاربری *</label>
                  <input
                      v-model="formData.username"
                      type="text"
                      required
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                      placeholder="نام کاربری (انگلیسی)"
                  >
                </div>

                <!-- Email -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">ایمیل *</label>
                  <input
                      v-model="formData.email"
                      type="email"
                      required
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                      placeholder="example@email.com"
                  >
                </div>

                <!-- Phone -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">شماره موبایل *</label>
                  <input
                      v-model="formData.phone"
                      type="tel"
                      required
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                      placeholder="09123456789"
                  >
                </div>

                <!-- Password (only for add) -->
                <div v-if="!showEditModal">
                  <label class="block text-sm font-medium text-gray-700 mb-2">رمز عبور *</label>
                  <input
                      v-model="formData.password"
                      type="password"
                      :required="!showEditModal"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                      placeholder="حداقل 6 کاراکتر"
                  >
                </div>

                <!-- Role -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">نقش کاربر *</label>
                  <div class="grid grid-cols-2 gap-3">
                    <label
                        class="relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all"
                        :class="formData.role === 'hamian_subscriber' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'"
                    >
                      <input
                          type="radio"
                          v-model="formData.role"
                          value="hamian_subscriber"
                          class="sr-only"
                      >
                      <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <i class="ti ti-user text-blue-600 text-xl"></i>
                      </div>
                      <div>
                        <div class="font-medium text-gray-900">کاربر عادی</div>
                        <div class="text-xs text-gray-500">دسترسی محدود</div>
                      </div>
                    </label>

                    <label
                        class="relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all"
                        :class="formData.role === 'supporter_admin' ? 'border-rose-500 bg-rose-50' : 'border-gray-200 hover:border-gray-300'"
                    >
                      <input
                          type="radio"
                          v-model="formData.role"
                          value="supporter_admin"
                          class="sr-only"
                      >
                      <div class="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
                        <i class="ti ti-crown text-rose-600 text-xl"></i>
                      </div>
                      <div>
                        <div class="font-medium text-gray-900">مدیر</div>
                        <div class="text-xs text-gray-500">دسترسی کامل</div>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Status -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        v-model="formData.isActive"
                        class="sr-only peer"
                    >
                    <div
                        class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                    <span class="mr-3 text-sm text-gray-700">{{ formData.isActive ? 'فعال' : 'غیرفعال' }}</span>
                  </label>
                </div>

                <!-- Actions -->
                <!-- Actions -->
                <div class="flex gap-3 pt-4">
                  <button type="button" @click="closeModal"
                          class="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    انصراف
                  </button>
                  <button type="submit"
                          class="flex-1 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all font-medium flex items-center justify-center">
                    <i class="ti ti-check ml-2"></i>
                    {{ showEditModal ? 'ذخیره تغییرات' : 'افزودن کاربر' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <!-- نمایش کراپر وقتی فایل انتخاب شد -->
    <ImageCropper v-if="cropper.show" :show="cropper.show" :image-file="cropper.imageFile"
                  :aspect-ratio="cropper.aspectRatio" @close="closeCropper" @save="saveCroppedImage"/>
    <!-- Toast Notification -->
    <Toast v-if="toast.show" :message="toast.message" :type="toast.type" @close="toast.show = false"/>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted} from 'vue'
import Toast from '../../../components/Toast.vue'
import {useUserStore} from "@/stores/user.ts";
import {toJalaliDate} from "@/utils/date.ts";
import ImageUploader from "@/components/ImageUploader.vue";
import ImageCropper from "@/components/ImageCropper.vue";
import * as XLSX from "xlsx";
// State
const showAddModal = ref(false)
const showEditModal = ref(false)
const showRoleDropdown = ref(false)
const showStatusDropdown = ref(false)
const searchQuery = ref('')
const selectedUsers = ref([])
const cropper = ref({show: false, imageFile: undefined, aspectRatio: 1, fieldName: ''})
function saveCroppedImage(base64) {

  if (!base64 || !cropper.value.fieldName) return
  formData.value[cropper.value.fieldName] = base64
  closeCropper()
}

function closeCropper() {
  cropper.value = {show: false, imageFile: undefined, aspectRatio: 1, fieldName: ''}
}
function handleImageUpload({file, field, aspectRatio}) {
  cropper.value = {show: true, imageFile: file, aspectRatio, fieldName: field}
}
function removeImage(field) {
  formData.value[field] = null
}
// Form Data
const formData = ref({
  id: null,
  name: '',
  username: '',
  avatar:null,
  email: '',
  phone: '',
  password: '',
  role: 'hamian_subscriber',
  isActive: true
})
const userStore = useUserStore()
const users = computed(() =>
    userStore.users.map(u => {
      // بررسی نقش‌ها
      const rolesArray = Array.isArray(u.legacyRoles) ? u.legacyRoles : []
      let role = 'hamian_subscriber' // پیش‌فرض

      if (rolesArray.includes('supporter_admin')) {
        role = 'supporter_admin'
      } else if (rolesArray.includes('hamian_subscriber')) {
        role = 'hamian_subscriber'
      }

      return {
        id: u.id,
        name: u.fullName,
        username: u.username || '',
        avatar:u.avatar,
        email: u.email,
        phone: u.phoneNumber,
        role,
        isActive: u.isActive,
        createdAt: toJalaliDate(u.createdAt),
        lastLogin: u.lastSeen || ''
      }
    })
)

// Filter Options
const roleOptions = ref([
  {value: 'all', label: 'همه نقش‌ها'},
  {value: 'supporter_admin', label: 'مدیران'},
  {value: 'hamian_subscriber', label: 'کاربران عادی'}
])

const statusOptions = ref([
  {value: 'all', label: 'همه وضعیت‌ها'},
  {value: 'active', label: 'فعال'},
  {value: 'inactive', label: 'غیرفعال'}
])

const selectedRole = ref(roleOptions.value[0])
const selectedStatus = ref(statusOptions.value[0])

// Toast
const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

// Computed
const adminCount = computed(() => users.value.filter(u => u.role === 'supporter_admin').length)
const activeCount = computed(() => users.value.filter(u => u.isActive).length)
const onlineCount = computed(() => users.value.filter(u => u.lastLogin.includes('دقیقه') || u.lastLogin.includes('ساعت')).length)

const filteredUsers = computed(() => {
  let filtered = users.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.includes(query)
    )
  }

  // Role filter
  if (selectedRole.value.value !== 'all') {
    filtered = filtered.filter(user => user.role === selectedRole.value.value)
  }

  // Status filter
  if (selectedStatus.value.value !== 'all') {
    filtered = filtered.filter(user =>
        selectedStatus.value.value === 'active' ? user.isActive : !user.isActive
    )
  }

  return filtered
})

const allSelected = computed({
  get: () => selectedUsers.value.length === filteredUsers.value.length && filteredUsers.value.length > 0,
  set: (value) => {
    if (value) {
      selectedUsers.value = filteredUsers.value.map(u => u.id)
    } else {
      selectedUsers.value = []
    }
  }
})

// Methods
const selectRole = (role) => {
  selectedRole.value = role
  showRoleDropdown.value = false
}

const selectStatus = (status) => {
  selectedStatus.value = status
  showStatusDropdown.value = false
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedUsers.value = []
  } else {
    selectedUsers.value = filteredUsers.value.map(u => u.id)
  }
}

const editUser = (user) => {
  formData.value = {...user}
  showEditModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  formData.value = {
    id: null,
    name: '',
    username: '',
    avatar:null,
    email: '',
    phone: '',
    password: '',
    role: 'hamian_subscriber',
    isActive: true
  }
}

const saveUser = async () => {
  if (showEditModal.value) {
    // Update existing user
    const payload = {
      fullName: formData.value.name,
      username: formData.value.username,
      avatar:formData.value.avatar,
      email: formData.value.email,
      password: formData.value.password,
      phoneNumber: formData.value.phone,
      roles: [formData.value.role],
      isActive: formData.value.isActive,
      lastLogin: formData.value.lastLogin ? new Date(formData.value.lastLogin) : undefined,
    }

    await userStore.updateUser(formData.value.id, payload)
    const index = users.value.findIndex(u => u.id === formData.value.id)
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...payload }
      showToast('کاربر با موفقیت ویرایش شد', 'success')
    }
  } else {
    // Add new user
    const payload = {
      fullName: formData.value.name,
      username: formData.value.username,
      avatar:formData.value.avatar,
      email: formData.value.email,
      password: formData.value.password,
      phoneNumber: formData.value.phone,
      roles: [formData.value.role],
      isActive: formData.value.isActive,
      lastLogin: new Date() // پیش‌فرض تاریخ امروز
    }

    const createdUser = await userStore.addUser(payload)
    users.value.push({
      ...createdUser,
      name: createdUser.fullName,
      phone: createdUser.phoneNumber,
      avatar:createdUser.avatar,
      role: createdUser.roles?.[0] || 'hamian_subscriber',
      createdAt: toJalaliDate(createdUser.createdAt)
    })
    showToast('کاربر جدید با موفقیت اضافه شد', 'success')
  }
  closeModal()
}

const deleteUser = async (userId) => {
  if (confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
    await userStore.deleteUser(userId)
    const index = users.value.findIndex(u => u.id === userId)
    if (index !== -1) {
      users.value.splice(index, 1)
      showToast('کاربر با موفقیت حذف شد', 'success')
    }
  }
}

const toggleUserStatus = async (user) => {
  const statusText = user.isActive ? 'غیرفعال' : 'فعال'
  const newStatus = await userStore.toggleUserStatus(user)
  if (newStatus !== undefined) {
    showToast(`وضعیت کاربر به ${statusText} تغییر کرد`, 'success')
  }
}

const bulkActivate = async () => {

  await userStore.bulkActivate(selectedUsers.value)
  selectedUsers.value.forEach(userId => {
    const user = users.value.find(u => u.id === userId)
    if (user) user.isActive = true
  })
  showToast(`${selectedUsers.value.length} کاربر فعال شدند`, 'success')
  selectedUsers.value = []
}

const bulkDeactivate = async () => {
  await userStore.bulkDeactivate(selectedUsers.value)
  selectedUsers.value.forEach(userId => {
    const user = users.value.find(u => u.id === userId)
    if (user) user.isActive = false
  })
  showToast(`${selectedUsers.value.length} کاربر غیرفعال شدند`, 'success')
  selectedUsers.value = []
}

const exportToExcel = () => {
  if (!filteredUsers.value.length) {
    showToast('هیچ کاربری برای خروجی گرفتن وجود ندارد', 'error')
    return
  }

  const rows = filteredUsers.value.map(u => ({
    "شناسه": u.id,
    "نام و نام خانوادگی": u.name,
    "نام کاربری": u.username,
    "ایمیل": u.email,
    "تلفن": u.phone,
    "نقش": u.role,
    "وضعیت": u.isActive ? "فعال" : "غیرفعال",
    "تاریخ ثبت نام": u.createdAt,
    "آخرین ورود": u.lastLogin || "-"
  }))

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users")

  const date = new Date().toISOString().slice(0, 10)
  const fileName = `users_${date}.xlsx`

  XLSX.writeFile(workbook, fileName)

  showToast('فایل Excel با موفقیت دانلود شد', 'success')
}

const showToast = (message, type = 'success') => {
  toast.value = {show: true, message, type}
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  const roleButton = event.target.closest('.role-dropdown')
  const statusButton = event.target.closest('.status-dropdown')

  if (!roleButton && showRoleDropdown.value) {
    showRoleDropdown.value = false
  }

  if (!statusButton && showStatusDropdown.value) {
    showStatusDropdown.value = false
  }
}

onMounted(async () => {
  await userStore.fetchAllUsers()
  console.log('users3',userStore.users)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Dropdown */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.5rem;
  width: 100%;
  min-width: 140px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 50;
  overflow: hidden;
}

.dropdown-item {
  width: 100%;
  text-align: right;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #374151;
  transition: all 0.2s;
  background: transparent;
  border: none;
  cursor: pointer;
  display: block;
}

.dropdown-item:hover {
  background: #fef2f2;
  color: #f43f5e;
}

/* Custom scrollbar for modal */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #fb7185;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #f43f5e;
}
</style>
