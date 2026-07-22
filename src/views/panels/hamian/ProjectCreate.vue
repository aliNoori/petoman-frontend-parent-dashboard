<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button
          @click="$router.back()"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <i class="ti ti-arrow-right text-xl text-gray-700"></i>
        </button>
        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900">افزودن قرار مهربانی جدید</h1>
          <p class="text-sm text-gray-600 mt-1">ایجاد قرار مالی یا دورهمی</p>
        </div>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Type Selection - First Priority -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-3">
            نوع قرار مهربانی <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Financial Type -->
            <button
              type="button"
              @click="form.type = 'financial'"
              class="p-4 border-2 rounded-xl transition-all"
              :class="form.type === 'financial'
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-green-300'"
            >
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full flex items-center justify-center"
                  :class="form.type === 'financial' ? 'bg-green-500' : 'bg-gray-100'"
                >
                  <i class="ti ti-coin text-2xl" :class="form.type === 'financial' ? 'text-white' : 'text-gray-400'"></i>
                </div>
                <div class="flex-1 text-right">
                  <h3 class="font-bold text-gray-900">قرار مالی</h3>
                  <p class="text-xs text-gray-600">جمع‌آوری کمک مالی</p>
                </div>
              </div>
            </button>

            <!-- Volunteer Type -->
            <button
              type="button"
              @click="form.type = 'volunteer'"
              class="p-4 border-2 rounded-xl transition-all"
              :class="form.type === 'volunteer'
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'"
            >
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full flex items-center justify-center"
                  :class="form.type === 'volunteer' ? 'bg-blue-500' : 'bg-gray-100'"
                >
                  <i class="ti ti-heart-handshake text-2xl" :class="form.type === 'volunteer' ? 'text-white' : 'text-gray-400'"></i>
                </div>
                <div class="flex-1 text-right">
                  <h3 class="font-bold text-gray-900">قرار دورهمی</h3>
                  <p class="text-xs text-gray-600">رویداد داوطلبانه بدون پول</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Image Upload -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            تصویر قرار مهربانی
          </label>
          <div class="flex items-start gap-4">
            <!-- Preview -->
            <div v-if="imagePreview" class="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
              <img :src="imagePreview" alt="Preview" class="w-full h-full object-cover">
              <button
                @click="removeImage"
                type="button"
                class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <i class="ti ti-x text-sm"></i>
              </button>
            </div>

            <!-- Upload Button -->
            <div class="flex-1">
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="handleImageUpload"
                class="hidden"
              >
              <button
                @click="$refs.fileInput.click()"
                type="button"
                class="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors text-center"
              >
                <i class="ti ti-upload text-3xl text-gray-400 mb-2"></i>
                <p class="text-sm font-medium text-gray-700">انتخاب تصویر</p>
                <p class="text-xs text-gray-500 mt-1">PNG, JPG تا 5MB</p>
              </button>
            </div>
          </div>
        </div>

        <!-- Title -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            عنوان قرار مهربانی <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            :placeholder="form.type === 'financial' ? 'مثال: کمک به حیوانات خیابانی' : 'مثال: غذا‌رسانی به حیوانات پارک'"
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
        </div>

        <!-- Description -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            توضیحات <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.description"
            rows="4"
            required
            :placeholder="form.type === 'financial' ? 'توضیح کامل پروژه و هدف مالی...' : 'توضیح کامل رویداد و فعالیت‌های دورهمی...'"
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          ></textarea>
        </div>

        <!-- Financial Fields - Only for Financial Type -->
        <template v-if="form.type === 'financial'">
          <!-- Goal Amount -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              مبلغ هدف (تومان) <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.goal"
              type="number"
              :required="form.type === 'financial'"
              min="1000000"
              step="1000000"
              placeholder="50000000"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
          </div>

          <!-- Current Amount -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              مبلغ جمع‌آوری شده (تومان)
            </label>
            <input
              v-model.number="form.current"
              disabled
              type="number"
              min="0"
              step="100000"
              placeholder="0"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
          </div>
        </template>

        <!-- Volunteer Fields - Only for Volunteer Type -->
        <template v-if="form.type === 'volunteer'">
          <!-- Location -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              محل برگزاری <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model="form.location"
                type="text"
                :required="form.type === 'volunteer'"
                placeholder="مثال: پارک ملت - درب شمالی"
                class="w-full px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
              <i class="ti ti-map-pin absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <!-- Event Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              تاریخ برگزاری <span class="text-red-500">*</span>
            </label>
            <PersianDatePicker
                v-model="form.eventDate"
                :type="'date'"
                :required="form.type === 'volunteer'"
                :display-format="'jYYYY/jMM/jDD'"
                :format="'YYYY/MM/DD'"
                placeholder="انتخاب تاریخ برگزاری..."
                :auto-submit="true"
            />
            <p class="text-xs text-gray-500 mt-1">با کلیک روی فیلد، تقویم شمسی باز می‌شود</p>
          </div>

          <!-- Event Time -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ساعت شروع <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model="form.eventTime"
                type="text"
                :required="form.type === 'volunteer'"
                placeholder="مثال: 10:00 صبح"
                class="w-full px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
              <i class="ti ti-clock absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
            <p class="text-xs text-gray-500 mt-1">زمان پایان مشخص نیست</p>
          </div>
        </template>

        <!-- Manager -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            مدیر قرار مهربانی <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.manager"
            type="text"
            required
            placeholder="نام مدیر"
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
        </div>

        <!-- Date Fields - Only for Financial Type -->
        <template v-if="form.type === 'financial'">
          <!-- Start Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              تاریخ شروع <span class="text-red-500">*</span>
            </label>
            <PersianDatePicker
              v-model="form.startDate"
              :type="'date'"
            :display-format="'jYYYY/jMM/jDD'"
            :format="'YYYY/MM/DD'"
            placeholder="انتخاب تاریخ شروع..."
            :auto-submit="true"
          />
          <p class="text-xs text-gray-500 mt-1">با کلیک روی فیلد، تقویم شمسی باز می‌شود</p>
        </div>

        <!-- Start Time -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ساعت شروع <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              v-model="form.startTime"
              type="text"
              required
              placeholder="09:00"
              class="w-full px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              dir="ltr"
            >
            <i class="ti ti-clock absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
          <p class="text-xs text-gray-500 mt-1">فرمت: ساعت:دقیقه (مثال: 14:30)</p>
        </div>

        <!-- End Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            تاریخ پایان <span class="text-red-500">*</span>
          </label>
          <PersianDatePicker
            v-model="form.endDate"
            :type="'date'"
            :display-format="'jYYYY/jMM/jDD'"
            :format="'YYYY/MM/DD'"
            placeholder="انتخاب تاریخ پایان..."
            :auto-submit="true"
          />
          <p class="text-xs text-gray-500 mt-1">با کلیک روی فیلد، تقویم شمسی باز می‌شود</p>
        </div>

        <!-- End Time -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ساعت پایان <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              v-model="form.endTime"
              type="text"
              required
              placeholder="18:00"
              class="w-full px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              dir="ltr"
            >
            <i class="ti ti-clock-hour-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
          <p class="text-xs text-gray-500 mt-1">فرمت: ساعت:دقیقه (مثال: 23:59)</p>
        </div>

        <!-- Auto calculated duration -->
        <div v-if="calculatedDuration" class="md:col-span-2">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <i class="ti ti-clock text-blue-600 text-2xl mt-0.5"></i>
            <div class="flex-1">
              <p class="text-sm font-bold text-blue-900 mb-1">مدت زمان کامل قرار</p>
              <p class="text-lg font-bold text-blue-700">{{ calculatedDuration }}</p>
              <div v-if="form.startDate && form.startTime && form.endDate && form.endTime" class="mt-2 pt-2 border-t border-blue-200">
                <div class="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span class="text-blue-600">شروع:</span>
                    <span class="font-medium text-blue-900 mr-1">{{ form.startDate }} ساعت {{ form.startTime }}</span>
                  </div>
                  <div>
                    <span class="text-blue-600">پایان:</span>
                    <span class="font-medium text-blue-900 mr-1">{{ form.endDate }} ساعت {{ form.endTime }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </template>

        <!-- Countdown Timer Settings (برای هر دو نوع قرار) -->
        <div class="md:col-span-2">
          <div class="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <i class="ti ti-alarm text-purple-600 text-xl"></i>
                <h3 class="font-bold text-gray-900">تایمر شمارش معکوس</h3>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="form.showTimer"
                  type="checkbox"
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div v-if="form.showTimer" class="space-y-4">
              <!-- Timer Display Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  نوع نمایش تایمر
                </label>
                <div class="grid grid-cols-2 gap-3">
                  <label class="relative flex items-center p-3 bg-white border-2 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors"
                    :class="form.timerType === 'countdown' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
                    <input
                      v-model="form.timerType"
                      type="radio"
                      value="countdown"
                      class="sr-only"
                    >
                    <div class="flex items-center gap-2">
                      <i class="ti ti-hourglass-high text-xl" :class="form.timerType === 'countdown' ? 'text-purple-600' : 'text-gray-400'"></i>
                      <span class="text-sm font-medium" :class="form.timerType === 'countdown' ? 'text-purple-900' : 'text-gray-700'">شمارش معکوس</span>
                    </div>
                  </label>
                  <label class="relative flex items-center p-3 bg-white border-2 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors"
                    :class="form.timerType === 'progress' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
                    <input
                      v-model="form.timerType"
                      type="radio"
                      value="progress"
                      class="sr-only"
                    >
                    <div class="flex items-center gap-2">
                      <i class="ti ti-progress text-xl" :class="form.timerType === 'progress' ? 'text-purple-600' : 'text-gray-400'"></i>
                      <span class="text-sm font-medium" :class="form.timerType === 'progress' ? 'text-purple-900' : 'text-gray-700'">نوار پیشرفت</span>
                    </div>
                  </label>
                </div>
              </div>
              <!-- Timer Preview -->
              <div class="bg-white border border-purple-200 rounded-lg p-4">
                <p class="text-xs text-gray-500 mb-2">پیش‌نمایش تایمر</p>

                <!-- COUNTDOWN PREVIEW -->
                <div v-if="form.timerType === 'countdown'" class="flex items-center justify-center gap-2">
                  <div
                      v-for="(unit, label) in timerPreview"
                      :key="label"
                      class="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg p-3 min-w-[60px] text-center"
                  >
                    <p class="text-2xl font-bold">{{ unit }}</p>
                    <p class="text-xs mt-1">{{ label }}</p>
                  </div>
                </div>

                <!-- PROGRESS PREVIEW -->
                <div v-else-if="form.timerType === 'progress'" class="w-full mt-2">
                  <div class="w-full bg-purple-100 h-3 rounded-full overflow-hidden">
                    <div
                        class="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                        :style="{ width: progressPreview + '%' }"
                    ></div>
                  </div>

                  <p class="text-center text-xs text-gray-600 mt-2">
                    {{ progressPreview }}%
                  </p>
                </div>
              </div>


              <!-- Timer Alert Settings -->
              <div>
                <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <input
                    v-model="form.timerAlert"
                    type="checkbox"
                    class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                  >
                  <span>هشدار قبل از پایان</span>
                </label>
                <div v-if="form.timerAlert" class="mr-6">
                  <select
                    v-model="form.alertDays"
                    class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  >
                    <option value="1">1 روز قبل</option>
                    <option value="3">3 روز قبل</option>
                    <option value="7">1 هفته قبل</option>
                    <option value="14">2 هفته قبل</option>
                    <option value="30">1 ماه قبل</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Capacity (ظرفیت قرار) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ظرفیت قرار (نفر)
          </label>
          <input
            v-model.number="form.capacity"
            type="number"
            min="0"
            step="1"
            placeholder="مثال: 50"
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
          <p class="text-xs text-gray-500 mt-1">حداکثر تعداد شرکت‌کنندگان / حامیان این قرار</p>
        </div>

        <!-- Show on Homepage -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            نمایش در صفحه اصلی
          </label>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="form.showOnHomepage"
              type="checkbox"
              class="sr-only peer"
            >
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
            <span class="ms-3 text-sm font-medium text-gray-700">
              {{ form.showOnHomepage ? 'فعال' : 'غیرفعال' }}
            </span>
          </label>
          <p class="text-xs text-gray-500 mt-1">این قرار در صفحه اصلی نمایش داده شود</p>
        </div>

        <!-- Category -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            دسته‌بندی
          </label>
          <select
              v-model="form.category"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
            <option value="">انتخاب دسته‌بندی</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.title">
              {{ cat.title }}
            </option>
          </select>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 mt-6 pt-6 border-t border-gray-200">
        <button
          type="button"
          @click="$router.back()"
          class="flex-1 px-6 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
        >
          انصراف
        </button>
        <button
          type="submit"
          class="flex-1 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
        >
          <i class="ti ti-device-floppy ml-2"></i>
          ذخیره قرار مهربانی
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import {ref, computed, watch, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import PersianDatePicker from '../../../components/PersianDatePicker.vue'
import {useKindnessMeetingStore} from "@/stores/kindness-meeting.ts";
import {toGregorianDate} from "@/utils/date.ts";
import jalaali from "jalaali-js";
import {useCategoryTypeStore} from "@/stores/category-type.ts";
import {useCategoryStore} from "@/stores/category.ts";
const categoryTypeStore = useCategoryTypeStore()
const categoryStore = useCategoryStore()
const router = useRouter()
const fileInput = ref(null)
const imagePreview = ref(null)
const imageFile = ref(null)
const showCategoryDropdown = ref(false)
const kindnessStore = useKindnessMeetingStore()
const form = ref({
  type: 'financial', // financial or volunteer
  title: '',
  description: '',
  // Financial fields
  goal: '',
  current: 0,
  // Volunteer fields
  location: '',
  eventDate: '',
  eventTime: '',
  // Common fields
  manager: '',
  startDate: '',
  startTime: '09:00',
  endDate: '',
  endTime: '18:00',
  duration: '',
  capacity: '',  // ظرفیت قرار (نفر)
  category: '',
  image: null,
  showTimer: false,
  timerType: 'countdown',
  timerAlert: false,
  alertDays: '7',
  showOnHomepage: false  // New field for homepage display
})
const categories=computed(()=>categoryStore.categories)

function jalaliToDate(jalaliString) {
  if (!jalaliString) return null;

  const [jy, jm, jd] = jalaliString.split('/').map(Number);

  const g = jalaali.toGregorian(jy, jm, jd);

  return new Date(g.gy, g.gm - 1, g.gd);
}

// تاریخ امروز را به‌صورت شمسی (YYYY/MM/DD) برمی‌گرداند
function jalaaliJsToday() {
  const now = new Date()
  const j = jalaali.toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate())
  return `${j.jy}/${j.jm}/${j.jd}`
}

const progressPreview = computed(() => {
  if (!form.value.endDate) return 0;

  const now = new Date();
  const start = jalaliToDate(form.value.startDate);
  const end = jalaliToDate(form.value.endDate);

  if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
    console.warn("Invalid date:", { start: form.value.startDate, end: form.value.endDate });
    return 0;
  }

  const total = end - start;
  const passed = now - start;

  if (total <= 0) return 0;

  let percent = (passed / total) * 100;

  if (percent < 0) percent = 0;
  if (percent > 100) percent = 100;

  return Math.round(percent);
});


// Parse time string to minutes
const parseTime = (timeStr) => {
  if (!timeStr || !timeStr.match(/^\d{1,2}:\d{2}$/)) return 0
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

// Parse Persian date (YYYY/MM/DD) to object
const parsePersianDate = (dateStr) => {
  if (!dateStr || !dateStr.match(/^\d{4}\/\d{1,2}\/\d{1,2}$/)) return null
  const [year, month, day] = dateStr.split('/').map(Number)
  return { year, month, day }
}

// Calculate total minutes between two Persian dates with times
const minutesBetweenDates = (startDate, startTime, endDate, endTime) => {
  if (!startDate || !endDate) return 0

  const start = parsePersianDate(startDate)
  const end = parsePersianDate(endDate)

  if (!start || !end) return 0

  // Calculate days (simple approximation: 30 days per month)
  const startDays = start.year * 365 + start.month * 30 + start.day
  const endDays = end.year * 365 + end.month * 30 + end.day
  const daysDiff = endDays - startDays

  // Add time difference
  const startMinutes = parseTime(startTime)
  const endMinutes = parseTime(endTime)

  return (daysDiff * 24 * 60) + (endMinutes - startMinutes)
}

// Calculate duration between dates
const calculatedDuration = computed(() => {
  if (!form.value.startDate || !form.value.endDate) return null

  const totalMinutes = minutesBetweenDates(
    form.value.startDate,
    form.value.startTime || '00:00',
    form.value.endDate,
    form.value.endTime || '23:59'
  )

  if (totalMinutes <= 0) return 'تاریخ و زمان پایان باید بعد از شروع باشد'

  const days = Math.floor(totalMinutes / (24 * 60))
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60)
  const minutes = totalMinutes % 60

  let result = []

  if (days >= 365) {
    const years = Math.floor(days / 365)
    const months = Math.floor((days % 365) / 30)
    result.push(`${years} سال`)
    if (months > 0) result.push(`${months} ماه`)
  } else if (days >= 30) {
    const months = Math.floor(days / 30)
    const remainingDays = days % 30
    result.push(`${months} ماه`)
    if (remainingDays > 0) result.push(`${remainingDays} روز`)
  } else if (days > 0) {
    result.push(`${days} روز`)
  }

  if (days < 30) { // Show hours/minutes for shorter durations
    if (hours > 0) result.push(`${hours} ساعت`)
    if (minutes > 0) result.push(`${minutes} دقیقه`)
  }

  return result.join(' و ') || '0 دقیقه'
})

// Timer preview (showing remaining time)
// برای قرار مالی: endDate ؛ برای قرار دورهمی: eventDate (تا شروع)
const timerPreview = computed(() => {
  if (!form.value.showTimer) return null

  let totalMinutes = 0
  if (form.value.type === 'financial') {
    if (!form.value.endDate) return null
    totalMinutes = minutesBetweenDates(
      form.value.startDate || '1403/08/01',
      form.value.startTime || '00:00',
      form.value.endDate,
      form.value.endTime || '23:59'
    )
  } else {
    // volunteer: شمارش معکوس تا تاریخ برگزاری
    if (!form.value.eventDate) return null
    // تقریب ساده: از امروز تا eventDate
    totalMinutes = minutesBetweenDates(
      jalaaliJsToday(),
      '00:00',
      form.value.eventDate,
      form.value.eventTime || '00:00'
    )
  }

  if (totalMinutes <= 0) return null

  const days = Math.floor(totalMinutes / (24 * 60))
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60)
  const minutes = totalMinutes % 60

  const months = Math.floor(days / 30)
  const remainingDays = days % 30

  return {
    'ماه': months.toString().padStart(2, '0'),
    'روز': remainingDays.toString().padStart(2, '0'),
    'ساعت': hours.toString().padStart(2, '0'),
    'دقیقه': minutes.toString().padStart(2, '0')
  }
})

// Watch date/time changes to auto-update duration
watch([
  () => form.value.startDate,
  () => form.value.startTime,
  () => form.value.endDate,
  () => form.value.endTime
], () => {
  if (calculatedDuration.value && !calculatedDuration.value.includes('باید')) {
    form.value.duration = calculatedDuration.value
  }
})

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Check file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    alert('حجم فایل نباید بیشتر از 5 مگابایت باشد')
    return
  }

  // Check file type
  if (!file.type.startsWith('image/')) {
    alert('لطفا یک فایل تصویری انتخاب کنید')
    return
  }

  imageFile.value = file
  form.value.image = file

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  imagePreview.value = null
  imageFile.value = null
  form.value.image = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleSubmit = async () => {
  const selectedCategory = categories.value.find(
      c => c.slug === form.value.category || c.title === form.value.category
  )

  if (!selectedCategory) {
    alert('لطفاً یک دسته‌بندی معتبر انتخاب کنید!')
    return
  }
  if (form.value.type === 'financial') {
    if (!form.value.startDate || !form.value.startTime || !form.value.endDate || !form.value.endTime) {
      alert('❌ لطفاً تاریخ و ساعت شروع و پایان را وارد کنید')
      return
    }
  }
  // اعتبارسنجی تاریخ و زمان
  if (form.value.startDate && form.value.endDate) {
    const totalMinutes = minutesBetweenDates(
        form.value.startDate,
        form.value.startTime || '00:00',
        form.value.endDate,
        form.value.endTime || '23:59'
    )

    if (totalMinutes <= 0) {
      alert('❌ تاریخ و زمان پایان باید بعد از تاریخ و زمان شروع باشد')
      return
    }
  }

  // اعتبارسنجی فرمت ساعت
  const timeRegex = /^\d{1,2}:\d{2}$/
  if (form.value.startTime && !timeRegex.test(form.value.startTime)) {
    alert('❌ فرمت ساعت شروع صحیح نیست (مثال: 09:00)')
    return
  }
  if (form.value.endTime && !timeRegex.test(form.value.endTime)) {
    alert('❌ فرمت ساعت پایان صحیح نیست (مثال: 18:00)')
    return
  }

  try {
    const { duration, image,category, ...raw } = form.value
    const payload = {
      ...raw,
      categoryId: selectedCategory.id,
      startDate: raw.startDate ? toGregorianDate(raw.startDate) : undefined,
      endDate: raw.endDate ? toGregorianDate(raw.endDate) : undefined,
      eventDate: raw.eventDate ? toGregorianDate(raw.eventDate) : undefined,
    }
    const formData = new FormData()
    for (const key in payload) {
      formData.append(key, payload[key])
    }
    if (form.value.image) {
      if (typeof form.value.image === 'string' && form.value.image.startsWith('data:image')) {
        const mimeType = form.value.image.match(/data:(image\/[a-zA-Z]+);base64/)?.[1] || 'image/png'
        const file = base64ToFile(form.value.image, 'image.png', mimeType)
        formData.append('image', file)
      } else {
        formData.append('image', form.value.image)
      }
    }
    await kindnessStore.addKindnessMeeting(formData)

    let successMessage = '✅ پروژه با موفقیت ایجاد شد!\n\n'
    successMessage += `📅 شروع: ${form.value.startDate} ساعت ${form.value.startTime}\n`
    successMessage += `📅 پایان: ${form.value.endDate} ساعت ${form.value.endTime}\n`
    successMessage += `⏱️ مدت زمان: ${calculatedDuration.value}\n`

    if (form.value.showTimer) {
      successMessage += `\n⏰ تایمر ${form.value.timerType === 'countdown' ? 'شمارش معکوس' : 'پیشرفت'} فعال شد`
      if (form.value.timerAlert) {
        successMessage += `\n🔔 هشدار ${form.value.alertDays} روز قبل از پایان`
      }
    }
    alert(successMessage)
    await kindnessStore.fetchKindnessMeetings()
    await router.push('/dashboard/hamian/projects')
  } catch (error) {
    alert('❌ خطا در ثبت پروژه. لطفاً دوباره تلاش کنید.')
    console.error('❌ ثبت پروژه ناموفق:', error)
  }
}
function base64ToFile(base64, filename, mimeType) {
  const byteString = atob(base64.split(',')[1])
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new File([ab], filename, { type: mimeType })
}
onMounted(async () => {
  await categoryTypeStore.fetchType('kindness-meeting')
})

watch(
    () => categoryTypeStore.selectedType,
    async (type) => {
      if (type?.id) {
        await categoryStore.fetchCategories({typeId: type.id})
      }
    },
    {immediate: true}
)
</script>
