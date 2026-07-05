<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Welcome Banner - Mobile Optimized -->
    <div
        class="bg-gradient-to-br from-rose-500 via-rose-600 to-pink-600 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-full opacity-10">
        <div class="absolute top-4 left-8 text-6xl">❤️</div>
        <div class="absolute bottom-8 right-12 text-5xl">🤝</div>
        <div class="absolute top-1/2 right-1/4 text-4xl">✨</div>
      </div>

      <div class="relative z-10">
        <div class="flex items-center gap-3 mb-3">
          <div
              class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <i class="ti ti-heart text-2xl sm:text-3xl"></i>
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl font-bold">خوش آمدید! 👋</h1>
            <p class="text-sm sm:text-base text-rose-100">داشبورد مدیریت حامیان</p>
          </div>
        </div>
        <p class="text-sm sm:text-base text-rose-50 leading-relaxed">
          امروز {{ stats.todayDonations }} کمک جدید دریافت شده است.
          {{ stats.activeSupporters }} حامی فعال در حال حمایت هستند.
        </p>
      </div>
    </div>

    <!-- Quick Stats Grid - Responsive -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <!-- Total Donations -->
      <div
          class="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rose-100 flex items-center justify-center">
            <i class="ti ti-coin text-lg sm:text-xl text-rose-600"></i>
          </div>
          <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
            +{{ stats.donationsGrowth }}%
          </span>
        </div>
        <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{{ formatNumber(stats.totalDonations) }}</h3>
        <p class="text-xs sm:text-sm text-gray-600">کل کمک‌ها</p>
      </div>

      <!-- Active Supporters -->
      <div
          class="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <i class="ti ti-users text-lg sm:text-xl text-blue-600"></i>
          </div>
          <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
            +{{ stats.supportersGrowth }}%
          </span>
        </div>
        <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{{ formatNumber(stats.activeSupporters) }}</h3>
        <p class="text-xs sm:text-sm text-gray-600">حامیان فعال</p>
      </div>

      <!-- Active Projects -->
      <div
          class="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <i class="ti ti-briefcase text-lg sm:text-xl text-purple-600"></i>
          </div>
          <span class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
            {{ stats.activeProjects }}
          </span>
        </div>
        <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{{ formatNumber(stats.totalProjects) }}</h3>
        <p class="text-xs sm:text-sm text-gray-600">قرارهای مهربانی</p>
      </div>

      <!-- Total Amount -->
      <div
          class="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <i class="ti ti-currency-dollar text-lg sm:text-xl text-green-600"></i>
          </div>
          <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
            ریال
          </span>
        </div>
        <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{{ formatCurrency(stats.totalAmount) }}</h3>
        <p class="text-xs sm:text-sm text-gray-600">مجموع کمک‌ها</p>
      </div>
    </div>

    <!-- Charts Section - Responsive -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <!-- Donations Chart -->
      <div class="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
        <div class="flex items-center justify-between mb-4 sm:mb-6">
          <h2 class="text-base sm:text-lg font-bold text-gray-900">نمودار کمک‌ها</h2>
          <div class="flex gap-2">
            <button
                v-for="period in chartPeriods"
                :key="period.value"
                @click="selectedPeriod = period.value"
                class="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg transition-colors"
                :class="selectedPeriod === period.value
                ? 'bg-rose-100 text-rose-600 font-medium' 
                : 'text-gray-600 hover:bg-gray-100'"
            >
              {{ period.label }}
            </button>
          </div>
        </div>

        <!-- Chart Placeholder -->
        <div class="h-48 sm:h-64 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl flex items-center justify-center">
          <div class="text-center">
            <i class="ti ti-chart-line text-3xl sm:text-4xl text-rose-600 mb-3"></i>
            <p class="text-sm sm:text-base text-gray-700 font-medium">نمودار کمک‌های {{ selectedPeriodLabel }}</p>
            <p class="text-xs sm:text-sm text-gray-500 mt-2">{{ formatNumber(getPeriodDonations()) }} کمک</p>
          </div>
        </div>
      </div>

      <!-- Projects Progress -->
      <div class="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base sm:text-lg font-bold text-gray-900">قرارهای مهربانی فعال</h2>
          <button @click="navigateToProjects" class="text-xs sm:text-sm text-rose-600 font-medium hover:text-rose-700">
            مشاهده همه
          </button>
        </div>

        <div class="space-y-4">
          <div v-for="project in topProjects" :key="project.id" class="group">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-medium text-gray-900 group-hover:text-rose-600 transition-colors">{{
                  project.title
                }}</h3>
              <span class="text-xs font-bold text-rose-600">{{ project.progress }}%</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                  class="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500"
                  :style="{ width: project.progress + '%' }"
              ></div>
            </div>
            <div class="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>{{ formatCurrency(project.current) }} از {{ formatCurrency(project.goal) }}</span>
              <span>{{ project.supporters }} حامی</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activities Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <!-- Recent Donations -->
      <div class="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
        <div class="flex items-center justify-between mb-4 sm:mb-6">
          <h2 class="text-base sm:text-lg font-bold text-gray-900">آخرین کمک‌ها</h2>
          <button @click="navigateToDonations" class="text-xs sm:text-sm text-rose-600 font-medium hover:text-rose-700">
            مشاهده همه
          </button>
        </div>

        <div class="space-y-3">
          <div
              v-for="donation in recentDonations"
              :key="donation.id"
              class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div
                class="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white flex-shrink-0">
              <i class="ti ti-coin text-lg"></i>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-semibold text-gray-900 truncate">{{ donation.supporter }}</h3>
              <p class="text-xs text-gray-600">{{ donation.project }}</p>
            </div>
            <div class="text-left">
              <p class="text-sm font-bold text-rose-600">{{ formatCurrency(donation.amount) }}</p>
              <p class="text-xs text-gray-500">{{ donation.time }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Supporters -->
      <div class="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
        <div class="flex items-center justify-between mb-4 sm:mb-6">
          <h2 class="text-base sm:text-lg font-bold text-gray-900">حامیان جدید</h2>
          <button @click="navigateToSupporters"
                  class="text-xs sm:text-sm text-rose-600 font-medium hover:text-rose-700">
            مشاهده همه
          </button>
        </div>

        <div class="space-y-3">
          <div
              v-for="supporter in newSupporters"
              :key="supporter.id"
              class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div  class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
              <img v-if="supporter?.avatar && supporter.avatar !== 'null' && supporter.avatar.trim() !== ''"
                   :src="supporter?.avatar"
                   :alt="supporter?.name.charAt(0)"
                   class="w-10 h-10 rounded-full object-cover"
              >
              <span v-else class="text-white text-sm font-medium">{{ supporter.name?.charAt(0) }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-semibold text-gray-900">{{ supporter.name }}</h3>
              <p class="text-xs text-gray-600">{{ supporter.type }}</p>
            </div>
            <div class="text-left">
              <p class="text-xs text-gray-500">{{ supporter.date }}</p>
              <span
                  class="inline-block px-2 py-0.5 text-xs rounded-full"
                  :class="supporter.status === 'active'
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'"
              >
                {{ supporter.status === 'active' ? 'فعال' : 'غیرفعال' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions - Mobile Optimized -->
    <div class="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
      <h2 class="text-base sm:text-lg font-bold text-gray-900 mb-4">دسترسی سریع</h2>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <button
            @click="navigateToDonationCreate"
            class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-rose-400 hover:bg-rose-50 transition-all group"
        >
          <div
              class="w-12 h-12 rounded-xl bg-rose-100 group-hover:bg-rose-200 flex items-center justify-center transition-colors">
            <i class="ti ti-plus text-xl text-rose-600"></i>
          </div>
          <span class="text-sm font-medium text-gray-700 group-hover:text-rose-600 transition-colors">کمک جدید</span>
        </button>

        <button
            @click="navigateToProjectCreate"
            class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
        >
          <div
              class="w-12 h-12 rounded-xl bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
            <i class="ti ti-briefcase-plus text-xl text-blue-600"></i>
          </div>
          <span class="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">قرار جدید</span>
        </button>

        <button
            @click="navigateToSupporterCreate"
            class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all group"
        >
          <div
              class="w-12 h-12 rounded-xl bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center transition-colors">
            <i class="ti ti-user-plus text-xl text-purple-600"></i>
          </div>
          <span class="text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">حامی جدید</span>
        </button>

        <button
            @click="navigateToReports"
            class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all group"
        >
          <div
              class="w-12 h-12 rounded-xl bg-green-100 group-hover:bg-green-200 flex items-center justify-center transition-colors">
            <i class="ti ti-chart-bar text-xl text-green-600"></i>
          </div>
          <span class="text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors">گزارش‌ها</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch, watchEffect} from 'vue'
import {useRouter} from 'vue-router'
import {useKindnessMeetingStore} from "@/stores/kindness-meeting.ts";
import {useDonationStore} from "@/stores/donation.ts";
import {useSupporterStore} from "@/stores/supporter.ts";
const supporterStore = useSupporterStore()
const router = useRouter()

// Stats Data
const stats = ref({
  totalDonations: 0,
  donationsGrowth: 0,
  activeSupporters: 0,
  supportersGrowth: 0,
  totalProjects: 0,
  activeProjects: 0,
  totalAmount: 0,
  todayDonations: 0
})

// Chart Data
const chartPeriods = [
  {value: 'week', label: 'هفته'},
  {value: 'month', label: 'ماه'},
  {value: 'year', label: 'سال'}
]
const selectedPeriod = ref('month')

const selectedPeriodLabel = computed(() => {
  const period = chartPeriods.find(p => p.value === selectedPeriod.value)
  return period ? period.label : 'ماه'
})
const projectStore = useKindnessMeetingStore()

// Top Projects
/*const topProjects = ref([
  {
    id: 1,
    title: 'کمک به حیوانات خیابانی',
    progress: 85,
    current: 42500000,
    goal: 50000000,
    supporters: 124
  },
  {
    id: 2,
    title: 'درمان حیوانات آسیب‌دیده',
    progress: 62,
    current: 31000000,
    goal: 50000000,
    supporters: 89
  },
  {
    id: 3,
    title: 'غذا و مراقبت از گربه‌های ولگرد',
    progress: 45,
    current: 13500000,
    goal: 30000000,
    supporters: 56
  }
])*/
const donationStore = useDonationStore()
const topProjects = computed(() => projectStore.topProjectsForDashboard)
watchEffect(() => {
  console.log('hhh',topProjects.value)
  stats.value.topProjects = topProjects.value
})
const recentDonations = computed(() => donationStore.recentDonations)
const todayDonations = computed(() => donationStore.todayDonations)
watchEffect(() => {
  stats.value.todayDonations = todayDonations.value
})
const donationsGrowth = computed(() => donationStore.donationsGrowth)
watchEffect(() => {
  stats.value.donationsGrowth = donationsGrowth.value
})
const totalCompletedDonations = computed(() => donationStore.countCompletedDonations)
watchEffect(() => {
  stats.value.totalDonations = totalCompletedDonations.value
})
const activeProjects = computed(() => projectStore.countCompletedKindnessMeetings)
watchEffect( () => {
  stats.value.activeProjects = activeProjects.value
})
const totalProjects = computed(() => projectStore.totalProjects)
watchEffect( () => {
  stats.value.totalProjects = totalProjects.value
})
const countActiveSupporter = computed(() => supporterStore.countActiveSupporter)
watchEffect(() => {
  stats.value.activeSupporters = countActiveSupporter.value
})

const totalAllSupportersAmount = computed(() => supporterStore.totalAllSupportersAmount)
watchEffect( () => {
  stats.value.totalAmount = totalAllSupportersAmount.value
})

const supportersGrowth = computed(() => supporterStore.supportersGrowth)
watchEffect( () => {
  stats.value.supportersGrowth = supportersGrowth.value
})
// Recent Donations  countActiveSupporter
/*const recentDonations = ref([
  {
    id: 1,
    supporter: 'احمد محمدی',
    project: 'کمک به حیوانات خیابانی',
    amount: 500000,
    time: '5 دقیقه پیش'
  },
  {
    id: 2,
    supporter: 'زهرا احمدی',
    project: 'درمان حیوانات آسیب‌دیده',
    amount: 1000000,
    time: '15 دقیقه پیش'
  },
  {
    id: 3,
    supporter: 'علی رضایی',
    project: 'غذا و مراقبت',
    amount: 250000,
    time: '30 دقیقه پیش'
  },
  {
    id: 4,
    supporter: 'فاطمه کریمی',
    project: 'کمک به حیوانات خیابانی',
    amount: 750000,
    time: '1 ساعت پیش'
  }
])*/

const newSupporters = computed(() => supporterStore.latestSupporters)
// New Supporters
/*const newSupporters = ref([
  {
    id: 1,
    name: 'محمد حسینی',
    initials: 'م ح',
    type: 'حامی مالی',
    date: 'امروز',
    status: 'active'
  },
  {
    id: 2,
    name: 'سارا کاظمی',
    initials: 'س ک',
    type: 'داوطلب',
    date: 'دیروز',
    status: 'active'
  },
  {
    id: 3,
    name: 'رضا نوری',
    initials: 'ر ن',
    type: 'حامی مالی',
    date: '2 روز پیش',
    status: 'active'
  },
  {
    id: 4,
    name: 'مریم اکبری',
    initials: 'م ا',
    type: 'حامی مالی و داوطلب',
    date: '3 روز پیش',
    status: 'active'
  }
])*/

onMounted(async () => {
  await projectStore.fetchKindnessMeetings()
  await donationStore.fetchDonations()
  await supporterStore.fetchSupporters()
});
// Helper Functions
const formatNumber = (num) => {
  return num?.toLocaleString('fa-IR') || '0'
}

const formatCurrency = (amount) => {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + ' میلیون'
  }
  return (amount / 1000).toLocaleString('fa-IR') + ' هزار'
}

const getPeriodDonations = () => {
  const data = {
    week: 156,
    month: 645,
    year: 1248
  }
  return data[selectedPeriod.value] || 0
}

// Navigation Functions
const navigateToDonations = () => {
  router.push('/dashboard/hamian/donations')
}

const navigateToDonationCreate = () => {
  router.push('/dashboard/hamian/donations/create')
}

const navigateToProjects = () => {
  router.push('/dashboard/hamian/projects')
}

const navigateToProjectCreate = () => {
  router.push('/dashboard/hamian/projects/create')
}

const navigateToSupporters = () => {
  router.push('/dashboard/hamian/supporters')
}

const navigateToSupporterCreate = () => {
  router.push('/dashboard/hamian/supporters/create')
}

const navigateToReports = () => {
  router.push('/dashboard/hamian/reports')
}
</script>

<style scoped>
/* Smooth transitions */
* {
  transition: all 0.2s ease;
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
