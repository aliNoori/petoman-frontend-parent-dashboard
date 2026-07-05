<template>
  <div class="h-screen bg-gray-50 flex flex-col overflow-hidden">
    <!-- Header - Only show when NOT in a panel -->
    <header v-if="!activePanel" class="bg-white border-b border-gray-200 shadow-sm">
      <div class="px-4 sm:px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div
                class="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <i class="ti ti-paw text-2xl text-white"></i>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">داشبورد اصلی</h1>
              <p class="text-sm text-gray-500">مدیریت اپلیکیشن‌ها</p>
            </div>
          </div>

          <!-- Header Actions -->
          <div class="flex items-center gap-3">
            <!-- Profile -->
            <div class="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
              <div
                  class="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <img v-if="user?.avatar && user.avatar !== 'null' && user.avatar.trim() !== ''"
                     :src="user?.avatar"
                     :alt="user.fullName?.charAt(0)"
                     class="w-8 h-8 rounded-full object-cover text-center content-center"
                >
                <span v-else class="text-white text-sm font-medium">{{ user.fullName?.charAt(0) }}</span>
              </div>
              <span class="text-sm font-medium text-gray-900 hidden sm:inline">{{ user.fullName }}</span>
            </div>

            <!-- Exit Button -->
            <button
                @click="handleLogout"
                class="px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all flex items-center gap-2 font-bold"
            >
              <i class="ti ti-logout text-lg"></i>
              <span>خروج</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 overflow-hidden">
      <!-- Home Page with App Cards -->
      <div v-if="!activePanel" class="h-full flex flex-col">
        <div class="px-4 py-4 sm:px-6 sm:py-6 flex-1 flex flex-col overflow-hidden">


          <!-- Apps Grid -->
          <div class="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 content-center overflow-hidden px-2">
            <div
                v-for="item in filteredMenuItems"
                :key="item.id"
                @click="goToPanel(item.id)"
                class="group relative bg-white rounded-3xl p-5 transition-all duration-300 cursor-pointer border border-gray-100"
            >
              <!-- Icon Circle - Centered -->
              <div class="flex justify-center mb-4">
                <div
                    :class="['w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110', item.iconBg]">
                  <i :class="[item.icon, 'text-3xl sm:text-4xl text-white']"></i>
                </div>
              </div>

              <!-- Title - Centered -->
              <h3 class="text-base sm:text-lg font-bold text-gray-800 mb-2 text-center">
                {{ item.label }}
              </h3>

              <!-- Description with icon -->
              <div class="flex items-center justify-center gap-2 text-xs text-gray-500 mb-2">
                <i class="ti ti-clock text-sm"></i>
                <span>{{ item.time }}</span>
              </div>

              <!-- Divider -->
              <div class="border-t border-gray-100 my-4"></div>

              <!-- Footer -->
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-1">
                  <i class="ti ti-users text-gray-400"></i>
                  <span class="text-gray-500">{{ item.users }} کاربر</span>
                </div>
                <div :class="['font-bold', item.textColor]">
                  {{ item.progress }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel View -->
      <div v-else class="h-full overflow-y-auto">
        <!-- Dynamic Panel Components -->

        <HamianPanel v-if="activePanel === 'hamian'" @back="goToHome"/>
        <DanimPanel v-else-if="activePanel === 'danim'" @back="goToHome"/>
        <FilmPanel v-else-if="activePanel === 'film'" @back="goToHome"/>
        <DampezeshkiPanel v-else-if="activePanel === 'dampezeshki'" @back="goToHome"/>
        <MarketPanel v-else-if="activePanel === 'market'" @back="goToHome"/>
      </div>
    </main>
  </div>
</template>

<script setup>
import {ref, computed, watch, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import HamianPanel from './panels/HamianPanel.vue'
import DanimPanel from './panels/DanimPanel.vue'
import FilmPanel from './panels/FilmPanel.vue'
import DampezeshkiPanel from './panels/DampezeshkiPanel.vue'
import MarketPanel from './panels/MarketPanel.vue'
import {useAuthStore} from "@/stores/auth.ts";
import {useUserStore} from "@/stores/user.ts";

const router = useRouter()
const route = useRoute()
const authStore=useAuthStore()
const userStore = useUserStore()
const user = computed(() => userStore.user)
// Get active panel from route
const activePanel = computed(() => route.meta?.activePanel || null)
// Navigation functions
const goToPanel = (panelId) => {
  router.push(`/dashboard/${panelId}`)
}

const goToHome = () => {
  router.push('/dashboard')
}

const menuItems = [
  {
    id: 'hamian',
    label: 'حامیان',
    icon: 'ti ti-heart',
    time: '2 ساعت پیش',
    users: 247,
    progress: 75,
    iconBg: 'bg-gradient-to-br from-rose-400 to-rose-600',
    textColor: 'text-rose-600',
    role: 'supporter_admin'
  },
  {
    id: 'danim',
    label: 'دانیم',
    icon: 'ti ti-book',
    time: '1 ساعت پیش',
    users: 342,
    progress: 85,
    iconBg: 'bg-gradient-to-br from-orange-400 to-orange-600',
    textColor: 'text-orange-600',
    role: 'danim_admin'
  },
  {
    id: 'film',
    label: 'فیلم',
    icon: 'ti ti-video',
    time: '3 ساعت پیش',
    users: 567,
    progress: 60,
    iconBg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    textColor: 'text-yellow-600',
    role: 'film_admin'

  },
  {
    id: 'dampezeshki',
    label: 'دامپزشکی',
    icon: 'ti ti-pill',
    time: '30 دقیقه پیش',
    users: 156,
    progress: 92,
    iconBg: 'bg-gradient-to-br from-sky-400 to-sky-600',
    textColor: 'text-sky-600',
    role: 'vet_admin'
  },
  {
    id: 'market',
    label: 'مارکت',
    icon: 'ti ti-shopping-cart',
    time: '4 ساعت پیش',
    users: 456,
    progress: 68,
    iconBg: 'bg-gradient-to-br from-purple-400 to-purple-600',
    textColor: 'text-purple-600',
    role: 'market_admin'
  }
]
const userData = JSON.parse(localStorage.getItem('user') || '{}')
const userRoles = userData.roles || []
const filteredMenuItems = computed(() =>
    menuItems.filter(item => userRoles.includes(item.role))
)
const getUserInitials = (fullName) => {
  if (!fullName) return ''
  const parts = fullName.split(' ')
  return parts.map(p => p[0]).join(' ').toUpperCase()
}

const handleLogout = async () => {
  await authStore.logout()
  await router.push('/')
}

onMounted(async () => {
  await userStore.fetchUser()
})
</script>
