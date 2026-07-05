<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile Header -->
    <header class="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 lg:hidden">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center gap-3">
          <button @click="toggleMobileSidebar" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <i class="ti ti-menu-2 text-xl text-gray-700"></i>
          </button>
          <div>
            <h1 class="text-lg font-bold text-gray-900">داشبورد حامیان</h1>
            <p class="text-xs text-gray-500">مدیریت حمایت‌ها و کمک‌ها</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <!-- Profile Button -->
          <button @click="showProfileBottomSheet = true"
                  class="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <div
                class="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center">
              <img v-if="user?.avatar && user.avatar !== 'null' && user.avatar.trim() !== ''"
                   :src="user?.avatar"
                   :alt="user?.fullName.charAt(0)"
                   class="w-8 h-8 rounded-full object-cover"
              >
              <span v-else class="text-white text-sm font-medium">{{ user.fullName?.charAt(0) }}</span>
            </div>
          </button>
          <button @click="$emit('back')" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <i class="ti ti-x text-xl text-gray-700"></i>
          </button>
        </div>
      </div>
    </header>

    <!-- Desktop Sidebar -->
    <aside class="hidden lg:block fixed top-0 right-0 w-64 h-screen bg-white border-l border-gray-200 z-40">
      <div class="flex flex-col h-full">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center gap-3 mb-2">
            <div
                class="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center">
              <i class="ti ti-heart text-white text-xl"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-900">حامیان</h2>
              <p class="text-xs text-gray-500">مدیریت کمک‌ها</p>
            </div>
          </div>
        </div>

        <nav class="flex-1 p-4 overflow-y-auto">
          <ul class="space-y-2">
            <li v-for="item in menuItems" :key="item.id">
              <!-- Main Menu Item -->
              <button
                  v-if="!item.isSubmenu"
                  @click="toggleMenuItem(item.id)"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-50"
                  :class="currentView === item.id || (item.children && item.children.some(child => child.id === currentView)) ? 'bg-rose-50 text-rose-600 font-medium' : 'text-gray-700 hover:text-gray-900'"
              >
                <i :class="item.icon" class="text-xl"></i>
                <span>{{ item.label }}</span>
                <span v-if="item.badge" class="mr-auto bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {{ item.badge }}
                </span>
                <i v-if="item.children" :class="item.isOpen ? 'ti ti-chevron-up' : 'ti ti-chevron-down'"
                   class="mr-auto text-sm"></i>
              </button>

              <!-- Submenu Items -->
              <Transition name="submenu">
                <ul v-if="item.children && item.isOpen" class="mt-2 mr-6 space-y-1">
                  <li v-for="child in item.children" :key="child.id">
                    <button
                        @click="navigateTo(child.id)"
                        class="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50 text-sm"
                        :class="currentView === child.id ? 'bg-rose-50 text-rose-600 font-medium' : 'text-gray-600 hover:text-gray-900'"
                    >
                      <i :class="child.icon" class="text-lg"></i>
                      <span>{{ child.label }}</span>
                    </button>
                  </li>
                </ul>
              </Transition>
            </li>
          </ul>
        </nav>

        <!--        <div class="p-4 border-t border-gray-200">
                  <button @click="$emit('back')"
                          class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
                    <i class="ti ti-arrow-right text-xl"></i>
                    <span>بازگشت به داشبورد اصلی</span>
                  </button>
                </div>-->
      </div>
    </aside>

    <!-- Mobile Sidebar -->
    <Transition name="fade">
      <div v-if="mobileSidebarOpen" @click="toggleMobileSidebar"
           class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] lg:hidden"></div>
    </Transition>

    <Transition name="slide-right">
      <aside v-if="mobileSidebarOpen"
             class="fixed top-0 right-0 w-64 h-screen bg-white z-[60] lg:hidden overflow-y-auto">
        <div class="flex flex-col h-full">
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <div class="flex items-center gap-3">
              <div
                  class="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center">
                <i class="ti ti-heart text-white text-xl"></i>
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900">حامیان</h2>
                <p class="text-xs text-gray-500">مدیریت کمک‌ها</p>
              </div>
            </div>
            <button @click="toggleMobileSidebar" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <i class="ti ti-x text-xl text-gray-700"></i>
            </button>
          </div>

          <nav class="flex-1 p-4">
            <ul class="space-y-2">
              <li v-for="item in menuItems" :key="item.id">
                <!-- Main Menu Item -->
                <button
                    v-if="!item.isSubmenu"
                    @click="toggleMenuItem(item.id)"
                    class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
                    :class="currentView === item.id || (item.children && item.children.some(child => child.id === currentView)) ? 'bg-rose-50 text-rose-600 font-medium' : 'text-gray-700 hover:bg-gray-50'"
                >
                  <i :class="item.icon" class="text-xl"></i>
                  <span>{{ item.label }}</span>
                  <span v-if="item.badge" class="mr-auto bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {{ item.badge }}
                  </span>
                  <i v-if="item.children" :class="item.isOpen ? 'ti ti-chevron-up' : 'ti ti-chevron-down'"
                     class="mr-auto text-sm"></i>
                </button>

                <!-- Submenu Items -->
                <Transition name="submenu">
                  <ul v-if="item.children && item.isOpen" class="mt-2 mr-6 space-y-1">
                    <li v-for="child in item.children" :key="child.id">
                      <button
                          @click="navigateTo(child.id)"
                          class="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
                          :class="currentView === child.id ? 'bg-rose-50 text-rose-600 font-medium' : 'text-gray-600 hover:bg-gray-50'"
                      >
                        <i :class="child.icon" class="text-lg"></i>
                        <span>{{ child.label }}</span>
                      </button>
                    </li>
                  </ul>
                </Transition>
              </li>
            </ul>
          </nav>

          <div class="p-4 border-t border-gray-200">
            <button @click="$emit('back')"
                    class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
              <i class="ti ti-arrow-right text-xl"></i>
              <span>بازگشت به داشبورد اصلی</span>
            </button>
          </div>
        </div>
      </aside>
    </Transition>

    <!-- Main Content -->
    <main class="lg:mr-64 min-h-screen pt-16 lg:pt-0 pb-20 lg:pb-0">
      <!-- Desktop Header -->
      <header class="hidden lg:block bg-white border-b border-gray-200 sticky top-0 z-40">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <!-- Welcome Banner -->
            <div>
              <h1 class="text-2xl font-bold text-gray-900">خوش آمدید، {{ user.fullName }} عزیز! 👋</h1>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-3">

              <!-- Notifications -->
              <div class="relative" data-dropdown="notifications">
                <button
                    @click.stop="showNotifications = !showNotifications"
                    class="relative p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <i class="ti ti-bell text-xl text-gray-700"></i>
                  <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <!-- Notifications Dropdown -->
                <Transition name="dropdown">
                  <div v-if="showNotifications" @click.stop
                       class="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                    <div class="px-4 py-3 border-b border-gray-100">
                      <h3 class="font-bold text-gray-900">اعلان‌ها</h3>
                    </div>
                    <div class="max-h-96 overflow-y-auto">
                      <div v-for="notif in notifications" :key="notif.id"
                           class="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer">
                        <div class="flex items-start gap-3">
                          <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                               :class="notif.color">
                            <i :class="notif.icon" class="text-lg"></i>
                          </div>
                          <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900">{{ notif.title }}</p>
                            <p class="text-xs text-gray-600 mt-1">{{ notif.message }}</p>
                            <p class="text-xs text-gray-400 mt-1">{{ notif.time }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="px-4 py-3 border-t border-gray-100 text-center">
                      <button class="text-sm text-rose-600 font-medium">مشاهده همه اعلان‌ها</button>
                    </div>
                  </div>
                </Transition>
                <!-- Toast Bubble -->
                <Transition name="fade">
                  <div v-if="toastNotification"
                       class="absolute left-5 mt-2 top-4 w-80 bg-white shadow-lg rounded-lg border border-gray-200 p-4 z-50">
                    <div class="flex items-start gap-3">
                      <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                           :class="toastNotification.color">
                        <i :class="toastNotification.icon" class="text-lg"></i>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900">{{ toastNotification.title }}</p>
                        <p class="text-xs text-gray-600 mt-1">{{ toastNotification.message }}</p>
                        <p class="text-xs text-gray-400 mt-1">{{ toastNotification.time }}</p>
                      </div>
                      <button @click="toastNotification = null" class="text-gray-400 hover:text-gray-600">
                        <i class="ti ti-x"></i>
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>

              <!-- Profile Dropdown -->
              <div class="relative" data-dropdown="profile">
                <button
                    @click.stop="showProfileDropdown = !showProfileDropdown"
                    class="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div
                      class="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center">
                    <img v-if="user?.avatar && user.avatar !== 'null' && user.avatar.trim() !== ''"
                         :src="user?.avatar"
                         :alt="user.fullName?.charAt(0)"
                         class="w-10 h-10 rounded-full text-center content-center object-cover"
                    >
                    <span v-else class="text-white text-sm font-medium">{{ user.fullName?.charAt(0) }}</span>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium text-gray-900">{{ user.fullName }}</p>
                  </div>
                  <i class="ti ti-chevron-down text-gray-600"></i>
                </button>

                <!-- Profile Dropdown Menu -->
                <Transition name="dropdown">
                  <div v-if="showProfileDropdown" @click.stop
                       class="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                    <div class="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-red-50">
                      <div class="flex items-center gap-3">
                        <div
                            class="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center">
                          <img v-if="user?.avatar && user.avatar !== 'null' && user.avatar.trim() !== ''"
                               :src="user?.avatar"
                               :alt="user.fullName?.charAt(0)"
                               class="w-12 h-12 rounded-full object-cover text-center content-center"
                          >
                          <span v-else class="text-white text-sm font-medium">{{ user.fullName?.charAt(0) }}</span>
                        </div>
                        <div>
                          <p class="font-bold text-gray-900">{{ user.fullName }}</p>
                          <p class="text-xs text-gray-600">{{ user.email }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="py-2">
                      <button @click="navigateTo('settings')"
                              class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                        <i class="ti ti-settings text-gray-600"></i>
                        <span class="text-sm text-gray-700">تنظیمات</span>
                      </button>
                      <button @click="navigateTo('profile')"
                              class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                        <i class="ti ti-user text-gray-600"></i>
                        <span class="text-sm text-gray-700">پروفایل من</span>
                      </button>
                      <button class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                        <i class="ti ti-help text-gray-600"></i>
                        <span class="text-sm text-gray-700">راهنما و پشتیبانی</span>
                      </button>
                    </div>
                    <div class="border-t border-gray-100 py-2">
                      <button @click="logout"
                              class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-red-600">
                        <i class="ti ti-logout"></i>
                        <span class="text-sm font-medium">خروج از حساب</span>
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="p-4">
        <slot :currentView="currentView" :navigateTo="navigateTo"/>
      </div>
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 lg:hidden">
      <div class="flex items-center justify-around px-2 py-2">
        <button
            v-for="item in bottomNavItems"
            :key="item.id"
            @click="navigateTo(item.id)"
            class="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[60px]"
            :class="currentView === item.id ? 'text-rose-600' : 'text-gray-600'"
        >
          <i :class="item.icon" class="text-2xl"></i>
          <span class="text-xs font-medium">{{ item.label }}</span>
        </button>
      </div>
    </nav>

    <!-- Mobile Profile Bottom Sheet -->
    <Transition name="bottom-sheet">
      <div v-if="showProfileBottomSheet" @click="showProfileBottomSheet = false"
           class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] lg:hidden flex items-end">
        <div @click.stop class="w-full bg-white rounded-t-3xl overflow-hidden">
          <!-- Handle -->
          <div class="flex justify-center pt-3 pb-2">
            <div class="w-10 h-1 bg-gray-300 rounded-full"></div>
          </div>

          <!-- Profile Header -->
          <div class="px-6 py-4 border-b border-gray-100">
            <div class="flex items-center gap-4">
              <div
                  class="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center">
                <img v-if="user?.avatar && user.avatar !== 'null' && user.avatar.trim() !== ''"
                     :src="user?.avatar"
                     :alt="user?.fullName.charAt(0)"
                     class="w-16 h-16 rounded-full object-cover"
                >
                <span v-else class="text-white text-sm font-medium">{{ user.fullName?.charAt(0) }}</span>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900">{{ user.fullName }}</h3>
                <p class="text-sm text-gray-500">{{ user.email }}</p>
                <p class="text-xs text-rose-600 bg-rose-50 px-2 py-1 rounded-full inline-block mt-1">مدیر ارشد</p>
              </div>
            </div>
          </div>

          <!-- Profile Menu Items -->
          <div class="px-4 py-4 space-y-2">
            <button class="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-right">
              <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <i class="ti ti-user text-lg text-blue-600"></i>
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900">پروفایل</p>
                <p class="text-sm text-gray-500">مشاهده و ویرایش اطلاعات</p>
              </div>
              <i class="ti ti-chevron-left text-gray-400"></i>
            </button>

            <button class="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-right">
              <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <i class="ti ti-settings text-lg text-green-600"></i>
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900">تنظیمات حساب</p>
                <p class="text-sm text-gray-500">امنیت و رمز عبور</p>
              </div>
              <i class="ti ti-chevron-left text-gray-400"></i>
            </button>

            <button class="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-right">
              <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <i class="ti ti-bell text-lg text-purple-600"></i>
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900">اعلان‌ها</p>
                <p class="text-sm text-gray-500">مدیریت اطلاع‌رسانی</p>
              </div>
              <span class="bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
              <i class="ti ti-chevron-left text-gray-400"></i>
            </button>

            <button class="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-right">
              <div class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <i class="ti ti-help text-lg text-yellow-600"></i>
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900">راهنما</p>
                <p class="text-sm text-gray-500">آموزش و پشتیبانی</p>
              </div>
              <i class="ti ti-chevron-left text-gray-400"></i>
            </button>

            <button class="w-full flex items-center gap-4 p-4 hover:bg-red-50 rounded-xl transition-colors text-right">
              <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <i class="ti ti-logout text-lg text-red-600"></i>
              </div>
              <div class="flex-1">
                <p class="font-medium text-red-600">خروج از حساب</p>
                <p class="text-sm text-red-400">پایان جلسه کاری</p>
              </div>
              <i class="ti ti-chevron-left text-red-400"></i>
            </button>
          </div>

          <!-- Safe Area -->
          <div class="h-8"></div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, watchEffect, watch} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {useDonationStore} from "@/stores/donation.ts";
import {useUserStore} from "@/stores/user.ts";
import {useAuthStore} from "@/stores/auth.ts";
import {useSocketStore} from "@/stores/socket.js";
import {useNotificationStore} from "@/stores/notification.ts";

const router = useRouter()
const route = useRoute()
const emit = defineEmits(['back'])

const mobileSidebarOpen = ref(false)
const showProfileMenu = ref(false)
const showProfileBottomSheet = ref(false)
const showNotifications = ref(false)
const showProfileDropdown = ref(false)
const authStore = useAuthStore()
const userStore = useUserStore()
const user = computed(() => userStore.user)
const notificationStore = useNotificationStore()
const notifications = computed(() => notificationStore.notifications)

// Logout function
const logout = async () => {
  // Add logout logic here
  await authStore.logout()
  await router.push('/')
  showProfileDropdown.value = false
}
const getUserInitials = (fullName) => {
  if (!fullName) return ''
  const parts = fullName.split(' ')
  return parts.map(p => p[0]).join(' ').toUpperCase()
}


// Get current view from route
const currentView = computed(() => {
  const activeSection = route.meta?.activeSection
  const activeView = route.meta?.activeView

  console.log('HamianLayout currentView:', {activeSection, activeView, path: route.path})

  if (activeView) {
    if (activeSection === 'donations' && activeView === 'create') {
      return 'donation-create'
    }
    if (activeSection === 'donations' && activeView === 'edit') {
      return 'donation-edit'
    }
    if (activeSection === 'projects' && activeView === 'create') {
      return 'project-create'
    }
    if (activeSection === 'projects' && activeView === 'edit') {
      return 'project-edit'
    }
    if (activeSection === 'supporters' && activeView === 'create') {
      return 'supporter-create'
    }
    if (activeSection === 'supporters' && activeView === 'edit') {
      return 'supporter-edit'
    }
    if (activeSection === 'documentaries' && activeView === 'create') {
      return 'documentary-create'
    }
    if (activeSection === 'pages' && activeView === 'create') {
      return 'page-create'
    }
    if (activeSection === 'pages' && activeView === 'edit') {
      return 'page-edit'
    }
  }

  // اگر activeSection موجود باشه از اون استفاده کن، وگرنه dashboard نشون بده
  const result = activeSection || 'dashboard'
  console.log('HamianLayout currentView result:', result)
  return result
})

// Navigation function
const navigateTo = (viewId) => {
  switch (viewId) {
    case 'dashboard':
      router.push('/dashboard/hamian')
      break
    case 'donations':
      router.push('/dashboard/hamian/donations')
      break
    case 'add-donation':
    case 'donation-create':
      router.push('/dashboard/hamian/donations/create')
      break
    case 'projects':
      router.push('/dashboard/hamian/projects')
      break
    case 'add-project':
    case 'project-create':
      router.push('/dashboard/hamian/projects/create')
      break
    case 'supporters':
      router.push('/dashboard/hamian/supporters')
      break
    case 'add-supporter':
    case 'supporter-create':
      router.push('/dashboard/hamian/supporters/create')
      break
    case 'faqs':
      router.push('/dashboard/hamian/faqs')
      break
    case 'faq-categories':
      router.push('/dashboard/hamian/faqs/categories')
      break
    case 'documentaries':
      router.push('/dashboard/hamian/documentaries')
      break
    case 'documentary-categories':
      router.push('/dashboard/hamian/documentaries/categories')
      break
    case 'documentary-create':
      router.push('/dashboard/hamian/documentaries/create')
      break
    case 'pages':
      router.push('/dashboard/hamian/pages')
      break
    case 'users':
      router.push('/dashboard/hamian/users')
      break
    case 'reports':
      router.push('/dashboard/hamian/reports')
      break
    case 'settings':
      router.push('/dashboard/hamian/settings')
      break
    case 'requests':
      router.push('/dashboard/hamian/requests')
      break
    default:
      router.push('/dashboard/hamian')
  }
  mobileSidebarOpen.value = false
}

// Update menu item clicks
const menuItemClick = (itemId) => {
  if (itemId === 'donations') {
    // Toggle submenu
    const donationsItem = menuItems.value.find(item => item.id === 'donations')
    if (donationsItem) {
      donationsItem.isOpen = !donationsItem.isOpen
    }
  } else {
    navigateTo(itemId)
  }
}

const toggleMenuItem = (itemId) => {
  const item = menuItems.value.find(i => i.id === itemId)
  if (item && item.children) {
    item.isOpen = !item.isOpen
  } else {
    navigateTo(itemId)
  }
}
const menuItems = ref([
  {id: 'dashboard', label: 'داشبورد', icon: 'ti ti-dashboard'},
  {
    id: 'donations',
    label: 'کمک‌ها',
    icon: 'ti ti-coin',
    badge: '12',
    isOpen: false,
    children: [
      {id: 'donations', label: 'مدیریت کمک‌ها', icon: 'ti ti-list'},
      {id: 'add-donation', label: 'افزودن کمک جدید', icon: 'ti ti-plus'}
    ]
  },
  {
    id: 'projects',
    label: 'قرارهای مهربانی',
    icon: 'ti ti-briefcase',
    isOpen: false,
    children: [
      {id: 'projects', label: 'مدیریت قرارها', icon: 'ti ti-list'},
      {id: 'add-project', label: 'افزودن قرار جدید', icon: 'ti ti-plus'}
    ]
  },
  {
    id: 'supporters',
    label: 'حامیان',
    icon: 'ti ti-users',
    isOpen: false,
    children: [
      {id: 'supporters', label: 'مدیریت حامیان', icon: 'ti ti-list'},
      {id: 'add-supporter', label: 'افزودن حامی جدید', icon: 'ti ti-plus'}
    ]
  },
  {id: 'faqs', label: 'سوالات متداول', icon: 'ti ti-message-question'},
  {
    id: 'documentaries',
    label: 'مستندات',
    icon: 'ti ti-video',
    isOpen: false,
    children: [
      {id: 'documentaries', label: 'مدیریت مستندات', icon: 'ti ti-list'},
      {id: 'documentary-create', label: 'افزودن مستند جدید', icon: 'ti ti-plus'},
    ]
  },
  {id: 'pages', label: 'صفحات', icon: 'ti ti-file-text'},
  {id: 'users', label: 'مدیریت کاربران', icon: 'ti ti-users'},
  {id: 'reports', label: 'تراکنش‌ها', icon: 'ti ti-receipt'},
  {id: 'settings', label: 'تنظیمات', icon: 'ti ti-settings'},
  { id: 'requests', label: 'مشارکت ها', icon: 'ti ti-message' }
])

const bottomNavItems = ref([
  {id: 'dashboard', label: 'خانه', icon: 'ti ti-home'},
  {id: 'donations', label: 'کمک‌ها', icon: 'ti ti-coin'},
  {id: 'add-donation', label: 'افزودن', icon: 'ti ti-plus'},
  {id: 'settings', label: 'تنظیمات', icon: 'ti ti-settings'}
])

const donationStore = useDonationStore()
const badge = computed(() => donationStore.countCompletedDonations)
watchEffect(() => {
  // آیتم donations رو پیدا کن
  const donationsItem = menuItems.value.find(item => item.id === 'donations')
  if (donationsItem) {
    donationsItem.badge = badge.value
  }
})

const toggleMobileSidebar = () => {
  mobileSidebarOpen.value = !mobileSidebarOpen.value
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  // Close notifications dropdown
  const notifButton = event.target.closest('[data-dropdown="notifications"]')
  if (!notifButton && showNotifications.value) {
    showNotifications.value = false
  }

  // Close profile dropdown
  const profileButton = event.target.closest('[data-dropdown="profile"]')
  if (!profileButton && showProfileDropdown.value) {
    showProfileDropdown.value = false
  }
}

// Listen for navigation events from child components
const handleNavigateToSupporters = () => {
  navigateTo('supporters')
}

const handleNavigateToDonationCreate = () => {
  navigateTo('donation-create')
}

const handleNavigateToDonationEdit = (event) => {
  navigateTo('donation-edit')
  if (event.detail && event.detail.donation) {
    console.log('Editing donation:', event.detail.donation)
  }
}

const handleNavigateToDonations = () => {
  navigateTo('donations')
}
const toastNotification = ref(null)
const socketStore = useSocketStore();
const isConnected = ref(false);
onMounted(async () => {
  await userStore.fetchUser()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const userId = user.id
  await notificationStore.fetchNotifications(userId,'hamian')
  window.addEventListener('navigate-to-supporters', handleNavigateToSupporters)
  window.addEventListener('navigate-to-donation-create', handleNavigateToDonationCreate)
  window.addEventListener('navigate-to-donation-edit', handleNavigateToDonationEdit)
  window.addEventListener('navigate-to-donations', handleNavigateToDonations)
  document.addEventListener('click', handleClickOutside)

  ///

  socketStore.connect(authStore.token);
  socketStore.socket.on("connect", () => {
    console.log("✅ Connected to server");
    isConnected.value = true;
  });

  socketStore.socket.on("notification", (payload) => {
    console.log("📩 Notification received:", payload);
    const enrichedPayload = {
      ...payload,
      time: notificationStore.formatTime(new Date(payload.createdAt))
    }

    notifications.value.push(enrichedPayload)

    // نمایش به صورت Toast
    toastNotification.value = enrichedPayload

    // بستن خودکار بعد از چند ثانیه (اختیاری)
    setTimeout(() => {
      toastNotification.value = null
    }, 5000)

  });
  socketStore.socket.on("connect_error", (err) => {
    console.error("❌ Connection error:", err.message);
  });
})

onUnmounted(() => {
  socketStore.socket.off("notification");
  window.removeEventListener('navigate-to-supporters', handleNavigateToSupporters)
  window.removeEventListener('navigate-to-donation-create', handleNavigateToDonationCreate)
  window.removeEventListener('navigate-to-donation-edit', handleNavigateToDonationEdit)
  window.removeEventListener('navigate-to-donations', handleNavigateToDonations)
  document.removeEventListener('click', handleClickOutside)
})

const getPageTitle = () => {
  const item = menuItems.value.find(m => m.id === currentView.value)
  return item ? item.label : 'داشبورد'
}

const getPageDescription = () => {
  const descriptions = {
    dashboard: 'مدیریت و نظارت بر حمایت‌ها',
    donations: 'لیست کمک‌ها و حمایت‌های مالی',
    'add-donation': 'ثبت کمک مالی جدید',
    'donation-create': 'ثبت کمک مالی جدید',
    projects: 'قرارهای مهربانی نیازمند حمایت',
    'add-project': 'ایجاد قرار مهربانی جدید',
    'project-create': 'ایجاد قرار مهربانی جدید',
    supporters: 'لیست حامیان و کمک‌کنندگان',
    'add-supporter': 'ثبت حامی جدید',
    'supporter-create': 'ثبت حامی جدید',
    reports: 'تراکنش‌ها و گزارش‌های مالی',
    settings: 'تنظیمات سیستم حمایت',
    requests: 'مدیریت درخواست ها'
  }
  return descriptions[currentView.value] || ''
}

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

// Expose navigateTo for parent components
defineExpose({
  navigateTo
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from, .slide-right-leave-to {
  transform: translateX(100%);
}

.submenu-enter-active, .submenu-leave-active {
  transition: all 0.2s ease;
}

.submenu-enter-from, .submenu-leave-to {
  opacity: 0;
  max-height: 0;
}

.submenu-enter-to, .submenu-leave-from {
  opacity: 1;
  max-height: 200px;
}

.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.bottom-sheet-enter-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.bottom-sheet-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.bottom-sheet-enter-from {
  opacity: 0;
}

.bottom-sheet-enter-from > div {
  transform: translateY(100%);
}

.bottom-sheet-leave-to {
  opacity: 0;
}

.bottom-sheet-leave-to > div {
  transform: translateY(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px); /* حرکت حبابی از بالا */
}
</style>
