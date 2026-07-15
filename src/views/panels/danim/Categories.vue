<template>
  <div class="p-6">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">مدیریت دسته‌بندی‌ها</h1>
        <p class="text-gray-600">دسته‌بندی‌های محتوا را مدیریت کنید</p>
      </div>
      <div class="flex gap-3">
        <button
            @click="exportToExcel"
            class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <i class="ti ti-file-export"></i>
          خروجی Excel
        </button>
        <button
            @click="showAddModal = true"
            class="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <i class="ti ti-plus"></i>
          دسته‌بندی جدید
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">کل دسته‌بندی‌ها</p>
            <p class="text-2xl font-bold text-gray-900">{{ categories.length }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-category text-blue-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">دسته‌های فعال</p>
            <p class="text-2xl font-bold text-green-600">{{ activeCategories }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-check text-green-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">پست‌های موجود</p>
            <p class="text-2xl font-bold text-purple-600">{{ totalPosts }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-article text-purple-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">میانگین پست</p>
            <p class="text-2xl font-bold text-orange-600">{{
                Math.round(totalPosts / Math.max(categories.length, 1))
              }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-chart-bar text-orange-600 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <i class="ti ti-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
                v-model="searchQuery"
                type="text"
                placeholder="جستجو در دسته‌بندی‌ها..."
                class="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
          </div>
        </div>

        <!-- Status Filter Dropdown -->
        <div class="relative" v-click-outside="() => showStatusFilterDropdown = false">
          <button
              @click="showStatusFilterDropdown = !showStatusFilterDropdown"
              type="button"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent flex items-center justify-between min-w-[160px]"
          >
            <span>{{ statusFilter === 'all' ? 'همه وضعیت‌ها' : statusFilter === 'active' ? 'فعال' : 'غیرفعال' }}</span>
            <i class="ti ti-chevron-down text-gray-400 mr-2"></i>
          </button>

          <ul
              v-if="showStatusFilterDropdown"
              class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-0 m-0 list-none"
          >
            <li
                @click="statusFilter = 'all'; showStatusFilterDropdown = false"
                class="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm transition-colors"
                :class="statusFilter === 'all' ? 'bg-orange-50 text-orange-700' : ''"
            >
              همه وضعیت‌ها
            </li>
            <li
                @click="statusFilter = 'active'; showStatusFilterDropdown = false"
                class="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm transition-colors"
                :class="statusFilter === 'active' ? 'bg-orange-50 text-orange-700' : ''"
            >
              فعال
            </li>
            <li
                @click="statusFilter = 'inactive'; showStatusFilterDropdown = false"
                class="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm transition-colors"
                :class="statusFilter === 'inactive' ? 'bg-orange-50 text-orange-700' : ''"
            >
              غیرفعال
            </li>
          </ul>
        </div>

        <!-- Sort Dropdown -->
        <div class="relative" v-click-outside="() => showSortDropdown = false">
          <button
              @click="showSortDropdown = !showSortDropdown"
              type="button"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent flex items-center justify-between min-w-[200px]"
          >
            <span>{{
                sortBy === 'title' ? 'مرتب‌سازی بر اساس نام' : sortBy === 'posts' ? 'تعداد پست' : 'تاریخ ایجاد'
              }}</span>
            <i class="ti ti-chevron-down text-gray-400 mr-2"></i>
          </button>

          <ul
              v-if="showSortDropdown"
              class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-0 m-0 list-none"
          >
            <li
                @click="sortBy = 'title'; showSortDropdown = false"
                class="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm transition-colors"
                :class="sortBy === 'title' ? 'bg-orange-50 text-orange-700' : ''"
            >
              مرتب‌سازی بر اساس نام
            </li>
            <li
                @click="sortBy = 'posts'; showSortDropdown = false"
                class="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm transition-colors"
                :class="sortBy === 'posts' ? 'bg-orange-50 text-orange-700' : ''"
            >
              تعداد پست
            </li>
            <li
                @click="sortBy = 'date'; showSortDropdown = false"
                class="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm transition-colors"
                :class="sortBy === 'date' ? 'bg-orange-50 text-orange-700' : ''"
            >
              تاریخ ایجاد
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Categories List -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="p-3 md:p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">لیست دسته‌بندی‌ها</h3>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نام دسته‌بندی</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">توضیحات</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نوع</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تعداد پست</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاریخ ایجاد</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عملیات</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
          <tr v-for="category in filteredCategories" :key="category.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <img
                      v-if="category.image"
                      :src="category.image"
                      :alt="category.title.charAt(0)"
                      class="w-full h-full object-cover content-center text-center"
                  >
                  <i v-else
                     class="ti ti-folder text-gray-400 text-xl flex items-center justify-center w-full h-full"></i>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ category.title }}</div>
                  <div class="text-xs text-gray-500">{{ category.slug }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">{{ category.description }}</div>
            </td>
            <td class="px-6 py-4">
                <span
                    v-if="category.parentId"
                    class="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                >
                  <i class="ti ti-corner-down-left ml-1"></i>
                  زیردسته
                </span>
              <span
                  v-else
                  class="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800"
              >
                  <i class="ti ti-folder ml-1"></i>
                  دسته اصلی
                </span>
              <div v-if="category.parentId" class="text-xs text-gray-500 mt-1">
                والد: {{ getCategoryName(category.parentId) }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-900">{{ category.postCount }}</span>
                <span class="text-xs text-gray-500 mr-1">پست</span>
              </div>
            </td>
            <td class="px-6 py-4">
                <span
                    :class="category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                >
                  {{ category.status === 'active' ? 'فعال' : 'غیرفعال' }}
                </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
              {{ category.createdAt }}
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <button
                    @click="editCategory(category)"
                    class="text-blue-600 hover:text-blue-800 p-1"
                    title="ویرایش"
                >
                  <i class="ti ti-edit text-sm"></i>
                </button>
                <button
                    @click="toggleStatus(category)"
                    :class="category.status === 'active' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'"
                    class="p-1"
                    :title="category.status === 'active' ? 'غیرفعال کردن' : 'فعال کردن'"
                >
                  <i :class="category.status === 'active' ? 'ti ti-eye-off' : 'ti ti-eye'" class="text-sm"></i>
                </button>
                <button
                    @click="deleteCategory(category)"
                    class="text-red-600 hover:text-red-800 p-1"
                    title="حذف"
                >
                  <i class="ti ti-trash text-sm"></i>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card View -->
      <div class="lg:hidden divide-y divide-gray-200">
        <div
            v-for="category in filteredCategories"
            :key="category.id"
            class="p-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          <!-- Card Header with Image & Title -->
          <div class="flex items-start gap-3 mb-3">
            <div
                class="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm">
              <img
                  v-if="category.image"
                  :src="category.image"
                  :alt="category.title"
                  class="w-full h-full object-cover"
              >
              <i v-else class="ti ti-folder text-gray-400 text-2xl flex items-center justify-center w-full h-full"></i>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-base font-semibold text-gray-900 mb-1 truncate">{{ category.title }}</h4>
              <p class="text-xs text-gray-500 mb-2">{{ category.slug }}</p>
              <div class="flex items-center gap-2">
                <!-- Type Badge -->
                <span
                    v-if="category.parentId"
                    class="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700"
                >
                  <i class="ti ti-corner-down-left ml-1 text-xs"></i>
                  زیردسته
                </span>
                <span
                    v-else
                    class="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700"
                >
                  <i class="ti ti-folder ml-1 text-xs"></i>
                  دسته اصلی
                </span>
                <!-- Status Badge -->
                <span
                    :class="category.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                    class="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full"
                >
                  <i :class="category.status === 'active' ? 'ti ti-circle-check' : 'ti ti-circle-x'"
                     class="ml-1 text-xs"></i>
                  {{ category.status === 'active' ? 'فعال' : 'غیرفعال' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Description -->
          <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ category.description }}</p>

          <!-- Info Grid -->
          <div class="grid grid-cols-2 gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                <i class="ti ti-article text-orange-600 text-sm"></i>
              </div>
              <div>
                <p class="text-xs text-gray-500">تعداد پست</p>
                <p class="text-sm font-semibold text-gray-900">{{ category.postCount }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <i class="ti ti-calendar text-blue-600 text-sm"></i>
              </div>
              <div>
                <p class="text-xs text-gray-500">تاریخ ایجاد</p>
                <p class="text-sm font-semibold text-gray-900">{{ category.createdAt }}</p>
              </div>
            </div>
          </div>

          <!-- Parent Info -->
          <div v-if="category.parentId"
               class="flex items-center gap-2 mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <i class="ti ti-folder text-blue-600 text-sm"></i>
            <span class="text-xs text-blue-700">دسته والد:</span>
            <span class="text-xs font-medium text-blue-900">{{ getCategoryName(category.parentId) }}</span>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2">
            <button
                @click="editCategory(category)"
                class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 active:bg-blue-200 transition-colors font-medium text-sm"
            >
              <i class="ti ti-edit text-base"></i>
              ویرایش
            </button>
            <button
                @click="toggleStatus(category)"
                :class="category.isActive? 'bg-red-50 text-red-700 hover:bg-red-100 active:bg-red-200' : 'bg-green-50 text-green-700 hover:bg-green-100 active:bg-green-200'"
                class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors font-medium text-sm"
            >
              <i :class="category.isActive? 'ti ti-eye-off' : 'ti ti-eye'" class="text-base"></i>
              {{ category.isActive? 'غیرفعال' : 'فعال' }}
            </button>
            <button
                @click="deleteCategory(category)"
                class="px-4 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 active:bg-red-200 transition-colors"
            >
              <i class="ti ti-trash text-base"></i>
            </button>
          </div>
        </div>
      </div>
      <!-- Empty State -->
      <div v-if="filteredCategories.length === 0" class="text-center py-12 px-4">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="ti ti-category text-3xl text-gray-400"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">دسته‌بندی‌ای یافت نشد</h3>
        <p class="text-gray-600 mb-4">دسته‌بندی جدیدی اضافه کنید یا فیلترها را تغییر دهید</p>
        <button
            @click="showAddModal = true"
            class="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <i class="ti ti-plus"></i>
          دسته‌بندی جدید
        </button>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Transition name="modal">
      <div v-if="showAddModal || showEditModal" @click="closeModal"
           class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-0 md:p-4">
        <div @click.stop
             class="bg-white md:rounded-2xl shadow-2xl w-full h-full md:h-auto md:max-w-2xl md:max-h-[90vh] overflow-hidden flex flex-col">
          <!-- Modal Header -->
          <div
              class="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <i class="ti ti-category text-orange-600 text-xl"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ showEditModal ? 'ویرایش دسته‌بندی' : 'دسته‌بندی جدید' }}
                </h3>
                <p class="text-sm text-gray-600">
                  {{ showEditModal ? 'اطلاعات دسته‌بندی را ویرایش کنید' : 'دسته‌بندی جدید ایجاد کنید' }}
                </p>
              </div>
            </div>
            <button @click="closeModal"
                    class="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors">
              <i class="ti ti-x text-xl text-gray-600"></i>
            </button>
          </div>

          <!-- Modal Content -->
          <form @submit.prevent="saveCategory" class="flex-1 overflow-y-auto p-4 md:p-6">
            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">نام دسته‌بندی</label>
                  <input
                      v-model="categoryForm.title"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="نام دسته‌بندی را وارد کنید"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">نامک (Slug)</label>
                  <input
                      v-model="categoryForm.slug"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="category-slug"
                  >
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
                <textarea
                    v-model="categoryForm.description"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="توضیحات دسته‌بندی..."
                ></textarea>
              </div>

              <!-- Parent Category Selection -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">دسته والد (اختیاری)</label>
                <div class="relative" v-click-outside="() => showParentDropdown = false">
                  <button
                      @click="showParentDropdown = !showParentDropdown"
                      type="button"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-right flex items-center justify-between"
                  >
                    <span class="flex items-center text-gray-700">
                      <i class="ti ml-2"
                         :class="categoryForm.parentId ? 'ti-folder text-blue-600' : 'ti-folder-off text-gray-400'"></i>
                      {{ categoryForm.parentId ? getCategoryName(categoryForm.parentId) : 'دسته اصلی (بدون والد)' }}
                    </span>
                    <i class="ti ti-chevron-down text-gray-400"></i>
                  </button>

                  <ul
                      v-if="showParentDropdown"
                      class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto p-0 m-0 list-none"
                  >
                    <!-- No Parent Option -->
                    <li
                        @click="categoryForm.parentId = null; showParentDropdown = false"
                        class="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm flex items-center transition-colors"
                        :class="!categoryForm.parentId ? 'bg-blue-50 text-blue-700' : ''"
                    >
                      <i class="ti ti-folder-off ml-2 text-gray-400"></i>
                      دسته اصلی (بدون والد)
                    </li>

                    <!-- Parent Categories Tree -->
                    <ParentCategoryItem
                        v-for="category in categoryTree"
                        :key="category.id"
                        :category="category"
                        :selected-id="categoryForm.parentId"
                        :level="0"
                        @select="selectParentCategory"
                    />
                  </ul>
                </div>
                <p class="text-xs text-gray-500 mt-1">اگر دسته والد انتخاب کنید، این دسته زیرمجموعه آن خواهد بود</p>
              </div>

              <!-- تصویر دسته‌بندی -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  <i class="ti ti-photo ml-1"></i>
                  تصویر دسته‌بندی
                </label>

                <!-- 🔥 input مخفی که باید اضافه شود -->
                <input
                    ref="imageInput"
                    type="file"
                    class="hidden"
                    accept="image/*"
                    @change="uploadCategoryImage"
                />

                <div class="space-y-3">

                  <!-- وقتی تصویری انتخاب نشده -->
                  <div
                      v-if="!categoryForm.image"
                      class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors cursor-pointer"
                      @click="$refs.imageInput.click()"
                  >
                    <i class="ti ti-photo text-4xl text-gray-400 mb-2"></i>
                    <p class="text-sm text-gray-600 mb-1">انتخاب تصویر دسته‌بندی</p>
                    <p class="text-xs text-gray-500">کلیک کنید یا تصویر را بکشید</p>
                  </div>

                  <!-- وقتی تصویر آپلود شده -->
                  <div v-else class="space-y-3">
                    <img
                        :src="categoryForm.image"
                        alt="Category Image"
                        class="w-full h-48 object-cover rounded-lg shadow-md"
                    />

                    <div class="flex gap-2">

                      <!-- دکمه تغییر تصویر -->
                      <button
                          @click="$refs.imageInput.click()"
                          type="button"
                          class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        <i class="ti ti-refresh ml-1"></i>
                        تغییر تصویر
                      </button>

                      <!-- دکمه حذف -->
                      <button
                          @click="categoryForm.image = null"
                          type="button"
                          class="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm"
                      >
                        <i class="ti ti-trash ml-1"></i>
                        حذف
                      </button>

                    </div>
                  </div>

                </div>
              </div>


              <!-- کاور دسته‌بندی -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  <i class="ti ti-panorama ml-1"></i>
                  کاور دسته‌بندی
                </label>

                <!-- input مخفی که باید اینجا باشد -->
                <input
                    ref="coverInput"
                    type="file"
                    class="hidden"
                    accept="image/*"
                    @change="uploadCategoryCover"
                />

                <div class="space-y-3">

                  <!-- وقتی تصویری انتخاب نشده -->
                  <div
                      v-if="!categoryForm.cover"
                      class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors cursor-pointer"
                      @click="$refs.coverInput.click()"
                  >
                    <i class="ti ti-panorama text-4xl text-gray-400 mb-2"></i>
                    <p class="text-sm text-gray-600 mb-1">انتخاب کاور دسته‌بندی</p>
                    <p class="text-xs text-gray-500">کلیک کنید یا تصویر را بکشید (ابعاد توصیه شده: 800x200)</p>
                  </div>

                  <!-- وقتی تصویر انتخاب شده -->
                  <div v-else class="space-y-3">
                    <img
                        :src="categoryForm.cover"
                        alt="Category Cover"
                        class="w-full h-32 object-cover rounded-lg shadow-md"
                    />

                    <div class="flex gap-2">
                      <!-- تغییر کاور -->
                      <button
                          @click="$refs.coverInput.click()"
                          type="button"
                          class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        <i class="ti ti-refresh ml-1"></i>
                        تغییر کاور
                      </button>

                      <!-- حذف -->
                      <button
                          @click="categoryForm.cover = null"
                          type="button"
                          class="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm"
                      >
                        <i class="ti ti-trash ml-1"></i>
                        حذف
                      </button>
                    </div>

                  </div>

                </div>
              </div>


              <div>
                <label class="flex items-center gap-2">
                  <input
                      v-model="categoryForm.status"
                      type="checkbox"
                      true-value="active"
                      false-value="inactive"
                      class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  >
                  <span class="text-sm font-medium text-gray-700">دسته‌بندی فعال باشد</span>
                </label>
              </div>

            </div>

            <!-- Form Actions - Fixed at bottom on mobile -->
            <div class="flex-shrink-0 border-t border-gray-200 bg-white p-4 md:px-6 md:py-4">
              <div class="flex justify-end gap-3">
                <button
                    type="button"
                    @click="closeModal"
                    class="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  انصراف
                </button>
                <button
                    type="submit"
                    class="px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  {{ showEditModal ? 'ذخیره تغییرات' : 'ایجاد دسته‌بندی' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch} from 'vue'
import ParentCategoryItem from '../../../components/ParentCategoryItem.vue'
import {useCategoryTypeStore} from "@/stores/category-type.ts";
import {useCategoryStore} from "@/stores/category.ts";

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

// Reactive data
//const categories = ref([])
const searchQuery = ref('')
const statusFilter = ref('all')
const sortBy = ref('title')
const showAddModal = ref(false)
const showEditModal = ref(false)
const showParentDropdown = ref(false)
const showStatusFilterDropdown = ref(false)
const showSortDropdown = ref(false)
const categoryForm = ref({
  id: null,
  title: '',
  slug: '',
  description: '',
  status: 'active',
  postCount: 0,
  createdAt: '',
  image: null,
  cover: null,
  parentId: null
})
const categoryTypeStore = useCategoryTypeStore()
const categoryStore = useCategoryStore()
const flattenCategories = (tree) => {
  const result = []

  tree.forEach(c => {
    result.push({
      id: c.id,
      title: c.title,
      slug: c.slug,
      description: c.description,
      isActive:c.isActive,
      status: c.isActive ? 'active' : 'inactive',
      postCount: c.posts.length ?? 0,
      createdAt: new Date(c.createdAt).toLocaleDateString('fa-IR'),
      image: c.logo || 'https://via.placeholder.com/400x300/10B981/ffffff?text=Category',
      cover: c.cover || 'https://via.placeholder.com/800x200/10B981/ffffff?text=Category+Cover',
      parentId: c.parentId ?? null
    })

    // اگر children داشت، بازگشتی اضافه کن
    if (c.children && c.children.length > 0) {
      result.push(...flattenCategories(c.children))
    }
  })

  return result
}
const categories = computed(() => flattenCategories(categoryStore.categoryTree))

// Computed properties
const activeCategories = computed(() => {
  return categories.value.filter(cat => cat.status === 'active').length
})

const totalPosts = computed(() => {
  // همه پست‌ها از همه دسته‌ها
  const allPosts = categories.value.flatMap(cat => cat.postCount ?? [])

  // یکتا کردن با توجه به id
  const uniquePosts = new Map(allPosts.map(p => [p.id, p]))

  return uniquePosts.size
})


const filteredCategories = computed(() => {
  let filtered = categories.value

  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(category =>
        category.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Filter by status
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(category => category.status === statusFilter.value)
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'posts':
        return b.postCount - a.postCount
      case 'date':
        return new Date(b.createdAt) - new Date(a.createdAt)
      default:
        return 0
    }
  })

  return filtered
})

// Methods
const exportToExcel = () => {
  const csvContent = [
    ['نام دسته‌بندی', 'نامک', 'توضیحات', 'تعداد پست', 'وضعیت', 'تاریخ ایجاد'].join(','),
    ...filteredCategories.value.map(category => [
      category.title,
      category.slug,
      category.description,
      category.postCount,
      category.status === 'active' ? 'فعال' : 'غیرفعال',
      category.createdAt
    ].join(','))
  ].join('\n')

  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], {type: 'text/csv;charset=utf-8;'})
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `categories_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const resetForm = () => {
  categoryForm.value = {
    id: null,
    title: '',
    slug: '',
    description: '',
    status: 'active',
    postCount: 0,
    createdAt: '',
    image: null,
    cover: null,
    parentId: null
  }
}

// Build category tree
const categoryTree = computed(() => {
  const buildTree = (parentId = null) => {
    return categories.value
        .filter(cat => cat.parentId === parentId && cat.id !== categoryForm.value.id)
        .map(cat => ({
          ...cat,
          children: buildTree(cat.id)
        }))
  }
  return buildTree()
})

// Get category name by ID
const getCategoryName = (id) => {
  const category = categories.value.find(cat => cat.id === id)
  return category ? category.title : 'نامشخص'
}

// Select parent category
const selectParentCategory = (id) => {
  categoryForm.value.parentId = id
  showParentDropdown.value = false
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  resetForm()
}

const editCategory = (category) => {
  categoryForm.value = {...category}
  showEditModal.value = true
}

const saveCategory = async () => {
  if (showEditModal.value) {
    const updatedCategory = {
      ...categoryForm.value,
      typeId: categoryForm.typeId?.trim(),
      isActive:categoryForm.value.status === 'active',
      contentType:'danim'
    }

    // فراخوانی متد update
    const data = await categoryStore.updateCategoryWithImages({
      ...updatedCategory,
      image: updatedCategory.image,
      cover: updatedCategory.cover,
      id: updatedCategory.id,
      isActive:categoryForm.value.status === 'active',
    })

    await categoryStore.fetchCategoryTree( categoryTypeStore.selectedType.id,'danim')

    // جایگزینی در لیست محلی
    const index = categories.value.findIndex(cat => cat.id === updatedCategory.id)
    if (index !== -1) {
      categories.value[index] = {...categoryForm.value}
    }
  } else {
    // Add new category
    const newCategory = {
      ...categoryForm.value,
      typeId: categoryForm.typeId?.trim(),
      contentType:'danim'
    }
    await categoryStore.addCategoryWithImages({
      ...newCategory,
      image: newCategory.image,
      cover: newCategory.cover
    })
    await categoryStore.fetchCategoryTree( categoryTypeStore.selectedType.id,'danim')

  }
  closeModal()
}

const toggleStatus = async (category) => {
  const newStatus = !category.isActive
  await categoryStore.toggleStatus(category.id, newStatus)

  // تابع بازگشتی برای پیدا کردن و تغییر وضعیت
  const updateStatusRecursive = (nodes) => {
    for (const node of nodes) {
      if (node.id === category.id) {
        node.isActive = newStatus
        return true // پیدا شد
      }
      if (node.children && node.children.length > 0) {
        const found = updateStatusRecursive(node.children)
        if (found) return true
      }
    }
    return false
  }

  updateStatusRecursive(categoryStore.categoryTree)
}


const deleteCategory = async (category) => {
  if (confirm(`آیا از حذف دسته‌بندی "${category.title}" اطمینان دارید؟`)) {
    await categoryStore.removeCategory(category.id)
    await categoryStore.fetchCategoryTree( categoryTypeStore.selectedType.id,'danim')
    const index = categories.value.findIndex(cat => cat.id === category.id)
    if (index !== -1) {
      categories.value.splice(index, 1)
    }
  }
}

const uploadCategoryImage = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    categoryForm.value.image = e.target.result; // مهم!
  };

  reader.readAsDataURL(file);
};

const uploadCategoryCover = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    categoryForm.value.cover = e.target.result;
  };

  reader.readAsDataURL(file);
};

// Watch for name changes to auto-generate slug
watch(() => categoryForm.value.name, (newName) => {
  if (!showEditModal.value && newName) {
    categoryForm.value.slug = newName
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF\s]/g, '')
        .replace(/\s+/g, '-')
        .trim()
  }
})

// Initialize data
onMounted(async () => {
  await categoryTypeStore.fetchType('post')
})
watch(
    () => categoryTypeStore.selectedType,
    async (type) => {
      if (type?.id) {
        categoryForm.typeId = type.id
        await categoryStore.fetchCategoryTree( type.id,'danim')
      }
    },
    {immediate: true}
)
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
