<template>
  <div class="space-y-6">
    <!-- Header -->
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
        <div v-if="selectedUsers.length > 0" class="flex gap-2">
          <button @click="bulkActivate" class="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
            <i class="ti ti-check ml-1"></i>
            فعال‌سازی ({{ selectedUsers.length }})
          </button>
          <button @click="bulkDeactivate" class="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
            <i class="ti ti-ban ml-1"></i>
            غیرفعال‌سازی ({{ selectedUsers.length }})
          </button>
        </div>
        <button @click="showAddModal = true" class="btn-primary">
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
            <p class="text-2xl font-bold text-purple-600 mt-1">{{ adminCount }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
            <i class="ti ti-crown text-purple-600 text-xl"></i>
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
              class="input-field pr-10"
            >
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Role Filter -->
          <div class="relative">
            <button
              @click="showRoleDropdown = !showRoleDropdown"
              class="btn-secondary flex items-center gap-2 min-w-[140px]"
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
          <div class="relative">
            <button
              @click="showStatusDropdown = !showStatusDropdown"
              class="btn-secondary flex items-center gap-2 min-w-[140px]"
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
            <div class="w-6 h-3 bg-orange-600 rounded-full"></div>
            <span>فعال</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-3 bg-gray-300 rounded-full"></div>
            <span>غیرفعال</span>
          </div>
        </div>
      </div>

      <!-- Desktop Grid View -->
      <div class="hidden lg:block p-6">
        <!-- Select All Section -->
        <div class="mb-6 bg-gray-50 rounded-lg p-4">
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              :checked="selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0"
              @change="toggleSelectAll"
              class="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            >
            <span class="text-sm font-medium text-gray-700">انتخاب همه در این صفحه ({{ paginatedUsers.length }} کاربر)</span>
          </label>
        </div>

        <!-- Grid Cards -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div v-for="user in paginatedUsers" :key="user.id" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <!-- Header with Checkbox and Menu -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <input
                  type="checkbox"
                  :value="user.id"
                  v-model="selectedUsers"
                  class="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                >
                <div class="relative">
                  <img
                      v-if="user?.avatar && user.avatar !== 'null' && user.avatar.trim() !== ''"
                    :src="user.avatar"
                    :alt="user.name.charAt(0)"
                    class="w-12 h-12 rounded-full object-cover text-center content-center"
                  >
                  <div
                    v-if="user.isOnline"
                    class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"
                  ></div>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 text-lg">{{ user.name }}</h3>
                  <p class="text-sm text-gray-500">{{ user.email }}</p>
                </div>
              </div>

              <div class="relative">
                <button
                  @click="toggleUserMenu(user.id, $event)"
                  class="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <i class="ti ti-dots-vertical"></i>
                </button>

                <ul
                  v-if="openUserMenu === user.id"
                  class="dropdown-menu"
                >
                  <li>
                    <button @click="editUser(user); openUserMenu = null" class="dropdown-item">
                      <i class="ti ti-edit ml-2"></i>
                      ویرایش کاربر
                    </button>
                  </li>
                  <li>
                    <button @click="toggleStatus(user); openUserMenu = null" class="dropdown-item">
                      <i class="ti ti-ban ml-2"></i>
                      {{ user.status === 'active' ? 'مسدود کردن' : 'فعال کردن' }}
                    </button>
                  </li>
                  <li>
                    <button @click="deleteUser(user); openUserMenu = null" class="dropdown-item text-red-600">
                      <i class="ti ti-trash ml-2"></i>
                      حذف کاربر
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <!-- User Info Grid -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <!-- Phone -->
              <div>
                <p class="text-sm text-gray-500 mb-1">شماره تماس</p>
                <p class="font-medium text-gray-900">{{ user.phone }}</p>
              </div>

              <!-- Role -->
              <div>
                <p class="text-sm text-gray-500 mb-1">نقش</p>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="getRoleColor(user.role)"
                >
                  <i :class="getRoleIcon(user.role)" class="ml-2"></i>
                  {{ getRoleLabel(user.role) }}
                </span>
              </div>

              <!-- Last Login -->
              <div>
                <p class="text-sm text-gray-500 mb-1">آخرین ورود</p>
                <p class="font-medium text-gray-900">{{ user.lastLogin }}</p>
              </div>

              <!-- Join Date -->
              <div>
                <p class="text-sm text-gray-500 mb-1">تاریخ عضویت</p>
                <p class="font-medium text-gray-900">{{ user.createdAt }}</p>
              </div>
            </div>

            <!-- Status and Toggle -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-500">وضعیت:</span>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="getStatusColor(user.status)"
                >
                  {{ getStatusLabel(user.status) }}
                </span>
              </div>

              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  :checked="user.status === 'active'"
                  @change="toggleStatus(user)"
                  class="sr-only peer"
                >
                <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Card View -->
      <div class="lg:hidden space-y-4 p-4">
        <!-- Mobile Select All -->
        <div class="flex items-center justify-between bg-gray-50 rounded-lg p-3">
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              :checked="selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0"
              @change="toggleSelectAll"
              class="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            >
            <span class="text-sm font-medium text-gray-700">انتخاب همه در صفحه</span>
          </label>
          <span class="text-xs text-gray-500">{{ paginatedUsers.length }} از {{ totalItems }} کاربر</span>
        </div>

        <!-- Mobile User Cards -->
        <div v-for="user in paginatedUsers" :key="user.id" class="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <!-- Card Header -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <input
                type="checkbox"
                :value="user.id"
                v-model="selectedUsers"
                class="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              >
              <div class="relative">
                <img
                  :src="user?.avatar && user.avatar !== 'null' && user.avatar.trim() !== ''"
                  :alt="user.name"
                  class="w-12 h-12 rounded-full object-cover"
                >
                <div
                  v-if="user.isOnline"
                  class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"
                ></div>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">{{ user.name }}</h3>
                <p class="text-sm text-gray-500">{{ user.email }}</p>
                <p class="text-xs text-gray-400">{{ user.phone }}</p>
              </div>
            </div>

            <!-- Menu Button -->
            <button
              @click="toggleUserMenu(user.id, $event)"
              class="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <i class="ti ti-dots-vertical text-gray-600"></i>
            </button>
          </div>

          <!-- Card Content -->
          <div class="grid grid-cols-2 gap-4">
            <!-- Role -->
            <div>
              <p class="text-xs text-gray-500 mb-1">نقش</p>
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                :class="getRoleColor(user.role)"
              >
                <i :class="getRoleIcon(user.role)" class="ml-1"></i>
                {{ getRoleLabel(user.role) }}
              </span>
            </div>

            <!-- Status with Toggle -->
            <div>
              <p class="text-xs text-gray-500 mb-1">وضعیت</p>
              <div class="flex items-center gap-2">
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="getStatusColor(user.status)"
                >
                  {{ getStatusLabel(user.status) }}
                </span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    :checked="user.status === 'active'"
                    @change="toggleStatus(user)"
                    class="sr-only peer"
                  >
                  <div class="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="pt-3 border-t border-gray-100">
            <div class="grid grid-cols-2 gap-4 text-xs text-gray-500">
              <div>
                <span class="block">آخرین ورود</span>
                <span class="font-medium text-gray-700">{{ user.lastLogin }}</span>
              </div>
              <div>
                <span class="block">تاریخ عضویت</span>
                <span class="font-medium text-gray-700">{{ user.createdAt }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-8 p-6 bg-white rounded-xl border border-gray-200">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <!-- Items per page selector -->
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600">نمایش</span>
          <select
            v-model="itemsPerPage"
            @change="changeItemsPerPage(itemsPerPage)"
            class="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
          <span class="text-sm text-gray-600">مورد در صفحه</span>
        </div>

        <!-- Pagination info -->
        <div class="text-sm text-gray-600 text-center lg:text-left">
          نمایش {{ paginationInfo.start }} تا {{ paginationInfo.end }} از {{ paginationInfo.total }} کاربر
        </div>

        <!-- Pagination buttons -->
        <div class="flex items-center justify-center gap-2">
          <!-- First page -->
          <button
            @click="goToPage(1)"
            :disabled="currentPage === 1"
            class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i class="ti ti-chevrons-left text-sm"></i>
          </button>

          <!-- Previous page -->
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i class="ti ti-chevron-left text-sm"></i>
          </button>

          <!-- Page numbers -->
          <div class="flex items-center gap-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              class="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors"
              :class="page === currentPage
                ? 'bg-orange-600 text-white' 
                : 'border border-gray-300 text-gray-600 hover:bg-gray-50'"
            >
              {{ page }}
            </button>
          </div>

          <!-- Next page -->
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i class="ti ti-chevron-right text-sm"></i>
          </button>

          <!-- Last page -->
          <button
            @click="goToPage(totalPages)"
            :disabled="currentPage === totalPages"
            class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i class="ti ti-chevrons-right text-sm"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Add User Modal -->
    <Transition name="modal">
      <div v-if="showAddModal" class="modal-overlay" @click="closeAddModal">
        <div @click.stop class="modal-content">
        <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">افزودن کاربر جدید</h2>
            <p class="text-gray-600 mt-1">اطلاعات کاربر جدید را وارد کنید</p>
          </div>
          <button @click="closeAddModal" class="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
            <i class="ti ti-x text-xl text-gray-600"></i>
          </button>
        </div>

        <form @submit.prevent="addUser" class="space-y-6">
          <div class="flex flex-col items-center mb-6 w-full">
            <label class="block text-sm font-medium text-gray-700 mb-3">تصویر پروفایل</label>
            <ImageUploader
                label="عکس پروفایل"
                :image="userForm.avatar"
                field="avatar"
                :aspectRatio="1"
                @select="handleImageUpload"
                @remove="removeImage"
                class="w-32 h-32 rounded-full overflow-hidden"
            />
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">نام کامل</label>
              <input
                v-model="userForm.name"
                type="text"
                placeholder="نام و نام خانوادگی کاربر"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">آدرس ایمیل</label>
              <input
                v-model="userForm.email"
                type="email"
                placeholder="user@example.com"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                required
              >
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">شماره موبایل</label>
              <input
                v-model="userForm.phone"
                type="tel"
                placeholder="09123456789"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">رمز عبور</label>
              <input
                v-model="userForm.password"
                type="password"
                placeholder="رمز عبور قوی انتخاب کنید"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                required
              >
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">نقش کاربری</label>
              <div class="relative">
                <button
                  type="button"
                  @click="showFormRoleDropdown = !showFormRoleDropdown"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white hover:border-orange-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors flex items-center justify-between"
                >
                  <span class="text-gray-900">{{ getSelectedFormRole().label }}</span>
                  <i :class="showFormRoleDropdown ? 'ti ti-chevron-up' : 'ti ti-chevron-down'" class="text-gray-400"></i>
                </button>
                <ul v-if="showFormRoleDropdown" class="dropdown-menu">
                  <li v-for="role in roleOptions.slice(1)" :key="role.value">
                    <button
                      type="button"
                      @click="selectFormRole(role)"
                      class="dropdown-item"
                    >
                      {{ role.label }}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div class="flex items-end">
              <div class="w-full">
                <label class="block text-sm font-medium text-gray-700 mb-3">وضعیت</label>
                <div class="px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                  <span class="text-green-700 font-medium">فعال</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-4 pt-6 border-t border-gray-200">
            <button type="submit" class="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 transition-colors font-medium">
              ایجاد کاربر جدید
            </button>
            <button type="button" @click="closeAddModal" class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 transition-colors font-medium">
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
    </Transition>

    <!-- Edit User Modal -->
    <Transition name="modal">
      <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
        <div @click.stop class="modal-content">
        <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">ویرایش کاربر</h2>
            <p class="text-gray-600 mt-1">اطلاعات کاربر را ویرایش کنید</p>
          </div>
          <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <i class="ti ti-x text-2xl"></i>
          </button>
        </div>

        <form @submit.prevent="updateUser" class="space-y-6">
          <div class="flex flex-col items-center mb-6 w-full">
            <label class="block text-sm font-medium text-gray-700 mb-3">تصویر پروفایل</label>
            <ImageUploader
                label="عکس پروفایل"
                :image="editForm.avatar"
                field="avatar"
                :aspectRatio="1"
                @select="handleImageUpload"
                @remove="removeImage"
                class="w-32 h-32 rounded-full overflow-hidden"
            />
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">نام کامل</label>
              <input
                v-model="editForm.name"
                type="text"
                placeholder="نام و نام خانوادگی کاربر"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">آدرس ایمیل</label>
              <input
                v-model="editForm.email"
                type="email"
                placeholder="user@example.com"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                required
              >
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">شماره موبایل</label>
              <input
                v-model="editForm.phone"
                type="tel"
                placeholder="09123456789"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                required
              >
            </div>

            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 mb-3">نقش کاربری</label>
              <button
                type="button"
                @click="showEditRoleDropdown = !showEditRoleDropdown"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-right hover:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors flex items-center justify-between"
              >
                <span class="flex items-center gap-2">
                  <i :class="getSelectedEditRole().icon" class="text-gray-500"></i>
                  {{ getSelectedEditRole().label }}
                </span>
                <i class="ti ti-chevron-down text-gray-400"></i>
              </button>

              <ul v-if="showEditRoleDropdown" class="dropdown-menu">
                <li v-for="role in roleOptions.slice(1)" :key="role.value">
                  <button type="button" @click="selectEditRole(role)" class="dropdown-item">
                    <i :class="getRoleIcon(role.value)" class="ml-2"></i>
                    {{ role.label }}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div class="flex gap-4 pt-6 border-t border-gray-200">
            <button type="submit" class="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 transition-colors font-medium">
              ذخیره تغییرات
            </button>
            <button type="button" @click="closeEditModal" class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 transition-colors font-medium">
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
    </Transition>

    <!-- Confirm Dialog -->
    <Transition name="modal">
      <div v-if="showConfirmDialog" class="modal-overlay" @click="closeConfirmDialog">
        <div @click.stop class="modal-content max-w-md">
          <div class="text-center">
            <!-- Icon -->
            <div class="mx-auto flex items-center justify-center w-16 h-16 rounded-full mb-4"
                 :class="{
                   'bg-red-100': confirmDialog.type === 'danger',
                   'bg-yellow-100': confirmDialog.type === 'warning', 
                   'bg-green-100': confirmDialog.type === 'success'
                 }">
              <i class="text-2xl"
                 :class="{
                   'ti ti-trash text-red-600': confirmDialog.type === 'danger',
                   'ti ti-alert-triangle text-yellow-600': confirmDialog.type === 'warning',
                   'ti ti-check text-green-600': confirmDialog.type === 'success'
                 }"></i>
            </div>

            <!-- Title & Message -->
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ confirmDialog.title }}</h3>
            <p class="text-gray-600 mb-6">{{ confirmDialog.message }}</p>

            <!-- Buttons -->
            <div class="flex gap-3">
              <button
                @click="executeConfirmAction"
                class="flex-1 px-4 py-2 rounded-lg font-medium transition-colors"
                :class="{
                  'bg-red-600 text-white hover:bg-red-700': confirmDialog.type === 'danger',
                  'bg-yellow-600 text-white hover:bg-yellow-700': confirmDialog.type === 'warning',
                  'bg-green-600 text-white hover:bg-green-700': confirmDialog.type === 'success'
                }"
              >
                {{ confirmDialog.confirmText }}
              </button>
              <button
                @click="closeConfirmDialog"
                class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                {{ confirmDialog.cancelText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Success/Error Notification -->
    <Transition name="notification">
      <div v-if="showNotification"
           class="fixed top-4 right-4 z-[10000] max-w-sm bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div class="p-4">
          <div class="flex items-start gap-3">
            <!-- Icon -->
            <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                 :class="{
                   'bg-green-100': notification.type === 'success',
                   'bg-red-100': notification.type === 'error',
                   'bg-yellow-100': notification.type === 'warning',
                   'bg-blue-100': notification.type === 'info'
                 }">
              <i class="text-sm"
                 :class="{
                   'ti ti-check text-green-600': notification.type === 'success',
                   'ti ti-x text-red-600': notification.type === 'error',
                   'ti ti-alert-triangle text-yellow-600': notification.type === 'warning',
                   'ti ti-info-circle text-blue-600': notification.type === 'info'
                 }"></i>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-semibold text-gray-900">{{ notification.title }}</h4>
              <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
            </div>

            <!-- Close Button -->
            <button @click="closeNotification"
                    class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
              <i class="ti ti-x text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="h-1 bg-gray-100">
          <div class="h-full transition-all duration-3000 ease-linear"
               :class="{
                 'bg-green-500': notification.type === 'success',
                 'bg-red-500': notification.type === 'error',
                 'bg-yellow-500': notification.type === 'warning',
                 'bg-blue-500': notification.type === 'info'
               }"
               style="width: 0%; animation: progress 3s linear forwards;"></div>
        </div>
      </div>
    </Transition>

    <!-- Mobile Bottom Sheet -->
    <Transition name="bottom-sheet">
      <div v-if="showBottomSheet" class="fixed inset-0 z-[9999] lg:hidden">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black bg-opacity-50"
          @click="showBottomSheet = false"
        ></div>

        <!-- Bottom Sheet -->
        <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-80 overflow-y-auto">
          <!-- Handle -->
          <div class="flex justify-center pt-2 pb-1">
            <div class="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>

          <!-- User Info Header -->
          <div v-if="selectedUserForMenu" class="px-4 py-3 border-b border-gray-100">
            <div class="flex items-center gap-3">
              <img
                :src="selectedUserForMenu.avatar"
                :alt="selectedUserForMenu.name"
                class="w-10 h-10 rounded-full object-cover"
              >
              <div>
                <h3 class="font-medium text-gray-900">{{ selectedUserForMenu.name }}</h3>
                <p class="text-xs text-gray-500">{{ selectedUserForMenu.email }}</p>
              </div>
            </div>
          </div>

          <!-- Menu Options -->
          <div class="py-1">
            <button
              @click="editUser(selectedUserForMenu); showBottomSheet = false"
              class="w-full px-4 py-3 text-right hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <i class="ti ti-edit text-blue-600 text-sm"></i>
              </div>
              <div>
                <p class="font-medium text-gray-900">ویرایش کاربر</p>
                <p class="text-xs text-gray-500">ویرایش اطلاعات کاربر</p>
              </div>
            </button>

            <button
              @click="toggleStatus(selectedUserForMenu); showBottomSheet = false"
              class="w-full px-4 py-3 text-right hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <i class="ti ti-ban text-orange-600 text-sm"></i>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ selectedUserForMenu?.status === 'active' ? 'مسدود کردن' : 'فعال کردن' }}</p>
                <p class="text-xs text-gray-500">تغییر وضعیت کاربر</p>
              </div>
            </button>

            <button
              @click="deleteUser(selectedUserForMenu); showBottomSheet = false"
              class="w-full px-4 py-3 text-right hover:bg-red-50 transition-colors flex items-center gap-3"
            >
              <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <i class="ti ti-trash text-red-600 text-sm"></i>
              </div>
              <div>
                <p class="font-medium text-red-600">حذف کاربر</p>
                <p class="text-xs text-red-400">حذف دائمی کاربر</p>
              </div>
            </button>
          </div>

          <!-- Cancel Button -->
          <div class="p-4 border-t border-gray-100">
            <button
              @click="showBottomSheet = false"
              class="w-full py-2.5 text-gray-600 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
            >
              انصراف
            </button>
          </div>
        </div>
      </div>
    </Transition>
    <!-- نمایش کراپر وقتی فایل انتخاب شد -->
    <ImageCropper v-if="cropper.show" :show="cropper.show" :image-file="cropper.imageFile"
                  :aspect-ratio="cropper.aspectRatio" @close="closeCropper" @save="saveCroppedImage"/>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import {useUserStore} from "@/stores/user.ts";
import {toJalaliDate} from "@/utils/date.ts";
import ImageCropper from "@/components/ImageCropper.vue";
import ImageUploader from "@/components/ImageUploader.vue";

// Define refs first
const cropper = ref({show: false, imageFile: undefined, aspectRatio: 1, fieldName: ''})
const searchQuery = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const showConfirmDialog = ref(false)
const showNotification = ref(false)
const notification = ref({
  title: '',
  message: '',
  type: 'success', // 'success', 'error', 'warning', 'info'
})
const confirmDialog = ref({
  title: '',
  message: '',
  type: 'danger', // 'danger', 'warning', 'success'
  action: null
})
const currentPage = ref(1)
const itemsPerPage = ref(10)
const openUserMenu = ref(null)
const showBottomSheet = ref(false)
const selectedUserId = ref(null)

// Mobile detection
const isMobile = ref(false)

const checkIsMobile = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 1024
  }
}
function saveCroppedImage(base64) {

  if (!base64 || !cropper.value.fieldName) return
  if(showEditModal){
    editForm.value[cropper.value.fieldName] = base64
  }
  userForm.value[cropper.value.fieldName] = base64
  closeCropper()
}

function closeCropper() {
  cropper.value = {show: false, imageFile: undefined, aspectRatio: 1, fieldName: ''}
}
function handleImageUpload({file, field, aspectRatio}) {
  cropper.value = {show: true, imageFile: file, aspectRatio, fieldName: field}
}
function removeImage(field) {
  userForm.value[field] = null
}
// Click outside to close dropdown
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    openUserMenu.value = null
  }
}

// Watch for search changes to reset pagination
watch(searchQuery, () => {
  currentPage.value = 1
})

onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', checkIsMobile)
    document.removeEventListener('click', handleClickOutside)
  }
})

const showRoleDropdown = ref(false)
const showStatusDropdown = ref(false)
const showFormRoleDropdown = ref(false)
const showEditRoleDropdown = ref(false)
const showInviteRoleDropdown = ref(false)
const selectedUsers = ref([])
const selectedUserForMenu = ref(null)
const editingUser = ref(null)

// Pagination - itemsPerPage as ref for better layout
const itemsPerPageOptions = [8, 12, 16, 20]
const editForm = ref({
  name: '',
  avatar: null,
  email: '',
  phone: '',
  role: 'danim_subscriber'
})

const selectedRole = ref({ value: 'all', label: 'همه نقش‌ها' })
const selectedStatus = ref({ value: 'all', label: 'همه وضعیت‌ها' })

const roleOptions = ref([
  { value: 'all', label: 'همه نقش‌ها' },
  { value: 'danim_admin', label: 'مدیر' },
  { value: 'danim_editor', label: 'ویرایشگر' },
  { value: 'danim_author', label: 'نویسنده' },
  { value: 'danim_subscriber', label: 'کاربر عادی' }
])

const statusOptions = ref([
  { value: 'all', label: 'همه وضعیت‌ها' },
  { value: 'active', label: 'فعال' },
  { value: 'inactive', label: 'غیرفعال' },
  { value: 'pending', label: 'در انتظار تایید' }
])

const userForm = ref({
  name: '',
  avatar: null,
  username:null,
  email: '',
  phone: '',
  password: '',
  role: 'danim_subscriber'
})
const userStore = useUserStore()
const users = computed(() =>
    userStore.users.map(u => {
      // بررسی نقش‌ها
      const rolesArray = Array.isArray(u.roles) ? u.roles : []
      let role = 'danim_subscriber' // پیش‌فرض

      if (rolesArray.includes('danim_admin')) {
        role = 'danim_admin'
      } else if (rolesArray.includes('danim_subscriber')) {
        role = 'danim_subscriber'
      }

      return {
        id: u.id,
        name: u.fullName,
        username: u.username || '',
        avatar:u.avatar,
        email: u.email,
        phone: u.phoneNumber,
        role:Array.isArray(u.legacyRoles) ? u.legacyRoles[0] : [],
        isActive: u.isActive,
        status:u.isActive?'active':'inactive',
        createdAt: toJalaliDate(u.createdAt),
        lastLogin:toJalaliDate(u.lastSeen)|| ''
      }
    })
)

const adminCount = computed(() => {
  return users.value.filter(user => user.role === 'danim_admin').length
})

const activeCount = computed(() => {
  return users.value.filter(user => user.status === 'active').length
})

const onlineCount = computed(() => {
  return users.value.filter(user => user.isOnline).length
})

const filteredUsers = computed(() => {
  let filtered = users.value

  if (searchQuery.value) {
    filtered = filtered.filter(user =>
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedRole.value.value !== 'all') {
    filtered = filtered.filter(user => user.role === selectedRole.value.value)
  }

  if (selectedStatus.value.value !== 'all') {
    filtered = filtered.filter(user => user.status === selectedStatus.value.value)
  }

  return filtered
})

// Pagination computed properties
const totalItems = computed(() => filteredUsers.value.length)

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredUsers.value.slice(start, end)
})

const paginationInfo = computed(() => {
  const start = totalItems.value === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1
  const end = Math.min(currentPage.value * itemsPerPage.value, totalItems.value)
  return {
    start,
    end,
    total: totalItems.value
  }
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  const half = Math.floor(maxVisible / 2)

  let start = Math.max(1, currentPage.value - half)
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const selectRole = (role) => {
  selectedRole.value = role
  showRoleDropdown.value = false
}

const selectStatus = (status) => {
  selectedStatus.value = status
  showStatusDropdown.value = false
  currentPage.value = 1 // Reset to first page when filtering
}

// Pagination functions
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const changeItemsPerPage = (items) => {
  itemsPerPage.value = items
  currentPage.value = 1 // Reset to first page
}

const selectFormRole = (role) => {
  userForm.value.role = role.value
  showFormRoleDropdown.value = false
}

const selectInviteRole = (role) => {
  inviteForm.value.role = role.value
  showInviteRoleDropdown.value = false
}

const getSelectedFormRole = () => {
  return roleOptions.value.find(role => role.value === userForm.value.role) || roleOptions.value[1]
}

const editUser = (user) => {
  editingUser.value = user
  editForm.value = {
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role
  }
  showEditModal.value = true
  openUserMenu.value = null
  showBottomSheet.value = false
}

const closeEditModal = () => {
  showEditModal.value = false
  editingUser.value = null
  editForm.value = {
    name: '',
    email: '',
    phone: '',
    role: 'danim_subscriber'
  }
}

const updateUser = async () => {
  if (editingUser.value) {
    // Update user data
    const updated = {
      fullName: editForm.value.name,
      email: editForm.value.email,
      phoneNumber: editForm.value.phone,
      avatar:editForm.value.avatar,
      roles: [editForm.value.role],
    };

    await userStore.updateUser(editingUser.value.id,updated)

    // Show success message
    showSuccessMessage(`اطلاعات کاربر "${editingUser.value.name}" با موفقیت به‌روزرسانی شد`)
    closeEditModal()
  }
}

const selectEditRole = (role) => {
  editForm.value.role = role.value
  showEditRoleDropdown.value = false
}

const getSelectedEditRole = () => {
  return roleOptions.value.find(role => role.value === editForm.value.role) || roleOptions.value[1]
}

const showConfirm = (title, message, type, action) => {
  confirmDialog.value = {
    title,
    message,
    type,
    confirmText: type === 'danger' ? 'حذف' : 'تایید',
    cancelText: 'انصراف',
    action
  }
  showConfirmDialog.value = true
}

const closeConfirmDialog = () => {
  showConfirmDialog.value = false
  confirmDialog.value.action = null
}

const executeConfirmAction = () => {
  if (confirmDialog.value.action) {
    confirmDialog.value.action()
  }
  closeConfirmDialog()
}

const showNotificationMessage = (title, message, type = 'success') => {
  notification.value = {
    title,
    message,
    type
  }
  showNotification.value = true

  // Auto close after 3 seconds
  setTimeout(() => {
    closeNotification()
  }, 3000)
}

const closeNotification = () => {
  showNotification.value = false
}

const showSuccessMessage = (message) => {
  showNotificationMessage('موفقیت‌آمیز', message, 'success')
}

const showErrorMessage = (message) => {
  showNotificationMessage('خطا', message, 'error')
}

const showWarningMessage = (message) => {
  showNotificationMessage('هشدار', message, 'warning')
}

const getSelectedInviteRole = () => {
  return roleOptions.value.find(role => role.value === inviteForm.value.role) || roleOptions.value[1]
}

const toggleUserMenu = (userId, event) => {
  // Prevent event bubbling
  if (event) {
    event.stopPropagation()
  }

  const user = users.value.find(u => u.id === userId)

  // For mobile, show bottom sheet
  if (isMobile.value) {
    selectedUserForMenu.value = user
    showBottomSheet.value = true
    openUserMenu.value = null
  } else {
    // For desktop, toggle dropdown menu
    if (openUserMenu.value === userId) {
      openUserMenu.value = null
    } else {
      openUserMenu.value = userId
    }
  }
}

const getRoleColor = (role) => {
  const colors = {
    danim_admin: 'bg-purple-100 text-purple-800',
    danim_editor: 'bg-blue-100 text-blue-800',
    danim_author: 'bg-green-100 text-green-800',
    danim_subscriber: 'bg-gray-100 text-gray-800'
  }
  return colors[role] || 'bg-gray-100 text-gray-800'
}

const getRoleIcon = (role) => {
  const icons = {
    danim_admin: 'ti ti-crown',
    danim_editor: 'ti ti-edit',
    danim_author: 'ti ti-pencil',
    danim_subscriber: 'ti ti-user'
  }
  return icons[role] || 'ti ti-user'
}

const getRoleLabel = (role) => {
  const labels = {
    danim_admin: 'مدیر',
    danim_editor: 'ویرایشگر',
    danim_author: 'نویسنده',
    danim_subscriber: 'کاربر عادی'
  }
  return labels[role] || 'کاربر عادی'//role
}

const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status) => {
  const labels = {
    active: 'فعال',
    inactive: 'غیرفعال',
    pending: 'در انتظار تایید'
  }
  return labels[status] || status
}

const toggleStatus = (user) => {
  const newStatus = user.status === 'active' ? 'inactive' : 'active'
  const statusText = newStatus === 'active' ? 'فعال' : 'غیرفعال'
  const actionText = newStatus === 'active' ? 'فعال‌سازی' : 'مسدودسازی'

  showConfirm(
    `${actionText} کاربر`,
    `آیا می‌خواهید وضعیت کاربر "${user.name}" را به "${statusText}" تغییر دهید؟`,
    newStatus === 'active' ? 'success' : 'warning',
    async () => {
      await userStore.toggleUserStatus(user)
      user.status = newStatus
      showSuccessMessage(`وضعیت کاربر "${user.name}" با موفقیت به "${statusText}" تغییر یافت`)
      openUserMenu.value = null
      showBottomSheet.value = false
    }
  )
}

const toggleSelectAll = () => {
  if (selectedUsers.value.length === paginatedUsers.value.length) {
    // Deselect all users in current page
    const currentPageIds = paginatedUsers.value.map(user => user.id)
    selectedUsers.value = selectedUsers.value.filter(id => !currentPageIds.includes(id))
  } else {
    // Select all users in current page (preserve selections from other pages)
    const currentPageIds = paginatedUsers.value.map(user => user.id)
    const newSelections = currentPageIds.filter(id => !selectedUsers.value.includes(id))
    selectedUsers.value = [...selectedUsers.value, ...newSelections]
  }
}

const bulkActivate = async () => {
  if (confirm(`آیا می‌خواهید ${selectedUsers.value.length} کاربر انتخاب شده را فعال کنید؟`)) {
    await userStore.bulkActivate(selectedUsers.value)
    selectedUsers.value.forEach(userId => {
      const user = users.value.find(u => u.id === userId)
      if (user) user.isActive = true
    })
    alert(`${selectedUsers.value.length} کاربر فعال شدند`)
    selectedUsers.value = []
  }
}


const bulkDeactivate = async () => {
  if (confirm(`آیا می‌خواهید ${selectedUsers.value.length} کاربر انتخاب شده را غیرفعال کنید؟`)) {
    await userStore.bulkDeactivate(selectedUsers.value)
    selectedUsers.value.forEach(userId => {
      const user = users.value.find(u => u.id === userId)
      if (user) user.isActive = false
    })
    alert(`${selectedUsers.value.length} کاربر غیرفعال شدند`)
    selectedUsers.value = []
  }
}

const deleteUser = (user) => {
  showConfirm(
    'حذف کاربر',
    `آیا از حذف کاربر "${user.name}" اطمینان دارید؟ این عمل قابل بازگشت نیست.`,
    'danger',
    async () => {
      await userStore.deleteUser(user.id)
      users.value = users.value.filter(u => u.id !== user.id)
      showSuccessMessage(`کاربر "${user.name}" با موفقیت حذف شد`)
      openUserMenu.value = null
      showBottomSheet.value = false
    }
  )
}

const addUser = async () => {
  try {
    const payload = {
      fullName: userForm.value.name,
      avatar:userForm.value.avatar,
      username: userForm.value.username,
      email: userForm.value.email,
      password: userForm.value.password,
      phoneNumber: userForm.value.phone,
      roles: [userForm.value.role]|| 'danim_subscriber',
      isActive: true,
    };
      // CREATE
      await userStore.addUser(payload);
      showSuccessMessage("کاربر جدید با موفقیت اضافه شد");

    // Refresh user list
    await userStore.fetchAllUsers();

    closeAddModal();
  } catch (e) {
    showErrorMessage("خطا در ذخیره کاربر");
    console.error(e);
  }
}

const closeAddModal = () => {
  showAddModal.value = false
  userForm.value = {
    name: '',
    username:null,
    avatar:null,
    email: '',
    phone: '',
    password: '',
    role: 'danim_subscriber'
  }
}

const exportToExcel = () => {
  // Create users data for export
  const exportData = [
    ['نام', 'ایمیل', 'نقش', 'وضعیت', 'تاریخ عضویت', 'آخرین ورود'],
    ...filteredUsers.value.map(user => [
      user.name,
      user.email,
      getRoleLabel(user.role),
      getStatusLabel(user.status),
      user.joinDate,
      user.lastLogin
    ])
  ]

  // Convert to CSV
  const csvContent = exportData.map(row => row.join(',')).join('\n')

  // Create and download file
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  console.log('Users exported successfully!')
}

onMounted(async () => {
  await userStore.fetchAllUsers()
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showRoleDropdown.value = false
      showStatusDropdown.value = false
      showFormRoleDropdown.value = false
      showInviteRoleDropdown.value = false
      openUserMenu.value = null
    }
  })
})
</script>

<style scoped>
.btn-primary {
  background-color: #f97316;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-primary:hover {
  background-color: #ea580c;
}

.btn-secondary {
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-secondary:hover {
  background-color: #f9fafb;
}

.btn-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  color: #6b7280;
}

.btn-icon:hover {
  background-color: #f3f4f6;
}

.input-field {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;
}

.input-field:focus {
  box-shadow: 0 0 0 2px #f97316;
  border-color: transparent;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: auto;
  left: 0;
  margin-top: 0.25rem;
  width: 12rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 50;
  padding: 0.25rem 0;
}

.dropdown-item {
  width: 100%;
  text-align: right;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #374151;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
}

.modal-content {
  background-color: white;
  border-radius: 1rem;
  padding: 2rem;
  width: 100%;
  max-width: 48rem;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transform: scale(1);
  transition: transform 0.2s ease;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95) translateY(-20px);
}

/* Bottom Sheet Animations */
.bottom-sheet-enter-active,
.bottom-sheet-leave-active {
  transition: all 0.3s ease;
}

.bottom-sheet-enter-from,
.bottom-sheet-leave-to {
  opacity: 0;
}

.bottom-sheet-enter-from .bg-white,
.bottom-sheet-leave-to .bg-white {
  transform: translateY(100%);
}

.bottom-sheet-enter-active .bg-white,
.bottom-sheet-leave-active .bg-white {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Notification Animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Progress Bar Animation */
@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style>