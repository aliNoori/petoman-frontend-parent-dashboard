<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">تنظیمات سایت</h1>
        <p class="text-gray-600 mt-1">تنظیمات کامل سایت، سئو و اوپن گراف</p>
      </div>
      <div class="flex gap-3">
        <button @click="resetSettings" class="btn-secondary">
          <i class="ti ti-restore ml-2"></i>
          بازنشانی
        </button>
        <button @click="saveSettings" class="btn-primary">
          <i class="ti ti-device-floppy ml-2"></i>
          ذخیره تغییرات
        </button>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="flex overflow-x-auto scrollbar-hide">
        <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
            'flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap border-b-2',
            activeTab === tab.id
              ? 'bg-purple-50 text-purple-600 border-purple-600'
              : 'text-gray-600 hover:bg-gray-50 border-transparent'
          ]"
        >
          <i :class="tab.icon"></i>
          <span>{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <!-- Tab Contents -->
    <div class="space-y-6">
      <!-- General Settings -->
      <div v-if="activeTab === 'general'" class="space-y-6">
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-6">تنظیمات عمومی</h2>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">نام سایت</label>
              <input
                  v-model="settings.general.siteName"
                  type="text"
                  placeholder="نام سایت..."
                  class="input-field"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">شعار سایت</label>
              <input
                  v-model="settings.general.tagline"
                  type="text"
                  placeholder="شعار کوتاه..."
                  class="input-field"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ایمیل مدیریت</label>
              <input
                  v-model="settings.general.adminEmail"
                  type="email"
                  placeholder="admin@example.com"
                  class="input-field"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">زبان سایت</label>
              <select v-model="settings.general.language" class="input-field">
                <option value="fa">فارسی</option>
                <option value="en">انگلیسی</option>
                <option value="ar">عربی</option>
              </select>
            </div>
          </div>

          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">توضیحات سایت</label>
            <textarea
                v-model="settings.general.description"
                rows="4"
                placeholder="توضیحات کوتاه درباره سایت..."
                class="input-field resize-none"
            ></textarea>
          </div>

          <!-- Logo and Favicon Upload -->
          <div class="mt-6 space-y-6">
            <h3 class="text-md font-semibold text-gray-900 flex items-center gap-2">
              <i class="ti ti-photo text-purple-600"></i>
              لوگو و آیکون سایت
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

              <!-- Logo Upload -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">لوگوی سایت</label>
                <div class="space-y-3">

                  <!-- Preview Box -->
                  <div
                      class="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                      @click="logoInputRef.click()"
                  >
                    <div v-if="settings.general.logoPreview"
                         class="relative w-full h-full p-2 flex items-center justify-center">
                      <img :src="settings.general.logoPreview" class="max-h-full max-w-full object-contain" />

                      <button
                          @click.stop="removeLogo"
                          class="absolute top-2 right-2 p-1 bg-red-500 w-7 h-7 text-center text-white rounded-full hover:bg-red-600 transition-colors">
                        <i class="ti ti-x text-sm"></i>
                      </button>
                    </div>

                    <div v-else class="text-center p-4">
                      <i class="ti ti-photo text-4xl text-gray-400 mb-2"></i>
                      <p class="text-sm text-gray-500">لوگوی سایت</p>
                    </div>
                  </div>

                  <!-- Hidden File Input -->
                  <input
                      ref="logoInputRef"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="uploadGeneralImage($event, 'logo')"
                  />


                  <!-- URL Input -->
                  <input
                      v-model="settings.general.logoUrl"
                      type="url"
                      placeholder="https://example.com/logo.png"
                      class="input-field text-sm"
                      @input="settings.general.logoPreview = settings.general.logoUrl"
                  />

                  <p class="text-xs text-gray-500">توصیه: PNG شفاف 200x60</p>
                </div>
              </div>

              <!-- Favicon Upload -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Favicon (آیکون سایت)</label>
                <div class="space-y-3">

                  <div
                      class="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                      @click="faviconInputRef.click()"
                  >

                  <div v-if="settings.general.faviconPreview"
                         class="relative w-full h-full p-2 flex items-center justify-center">

                      <img :src="settings.general.faviconPreview" class="w-16 h-16 object-contain" />

                      <button
                          @click.stop="removeFavicon"
                          class="absolute w-7 h-7 top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                        <i class="ti ti-x text-sm"></i>
                      </button>
                    </div>

                    <div v-else class="text-center p-4">
                      <i class="ti ti-square-rounded text-4xl text-gray-400 mb-2"></i>
                      <p class="text-sm text-gray-500">Favicon</p>
                    </div>
                  </div>

                  <input
                      ref="faviconInputRef"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="uploadGeneralImage($event, 'favicon')"
                  />


                  <!-- URL Input -->
                  <input
                      v-model="settings.general.faviconUrl"
                      type="url"
                      placeholder="https://example.com/favicon.png"
                      class="input-field text-sm"
                      @input="settings.general.faviconPreview = settings.general.faviconUrl"
                  />

                  <p class="text-xs text-gray-500">32x32 PNG یا ICO</p>
                </div>
              </div>

            </div>
          </div>


          <!-- Hero Slider Settings -->
          <div class="mt-6 space-y-4">
            <button
                @click="settings.general.sliderEnabled = !settings.general.sliderEnabled"
                class="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div class="flex items-center gap-3">
                <i class="ti ti-carousel-horizontal text-purple-600 text-xl"></i>
                <div class="text-right">
                  <div class="font-bold text-gray-900">تنظیمات اسلایدر صفحه اصلی</div>
                  <div class="text-xs text-gray-500">مدیریت اسلایدر و تصاویر صفحه اصلی</div>
                </div>
              </div>
              <i :class="settings.general.sliderEnabled ? 'ti ti-chevron-up' : 'ti ti-chevron-down'"
                 class="text-gray-600 text-xl"></i>
            </button>

            <!-- Slider Configuration -->
            <div v-if="settings.general.sliderEnabled" class="pl-4 space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">سرعت انتقال (ثانیه)</label>
                  <input
                      v-model.number="settings.general.sliderSpeed"
                      type="number"
                      min="1"
                      max="10"
                      step="0.5"
                      class="input-field"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">ارتفاع اسلایدر (px)</label>
                  <input
                      v-model.number="settings.general.sliderHeight"
                      type="number"
                      min="300"
                      max="800"
                      step="50"
                      class="input-field"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">افکت انتقال</label>
                  <select v-model="settings.general.sliderEffect" class="input-field">
                    <option value="fade">Fade</option>
                    <option value="slide">Slide</option>
                    <option value="cube">Cube</option>
                    <option value="coverflow">Coverflow</option>
                  </select>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                      v-model="settings.general.sliderAutoplay"
                      type="checkbox"
                      class="rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                  />
                  <span class="text-sm text-gray-700">پخش خودکار</span>
                </label>

                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                      v-model="settings.general.sliderLoop"
                      type="checkbox"
                      class="rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                  />
                  <span class="text-sm text-gray-700">حلقه بی‌پایان</span>
                </label>

                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                      v-model="settings.general.sliderNavigation"
                      type="checkbox"
                      class="rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                  />
                  <span class="text-sm text-gray-700">نمایش فلش‌ها</span>
                </label>

                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                      v-model="settings.general.sliderPagination"
                      type="checkbox"
                      class="rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                  />
                  <span class="text-sm text-gray-700">نمایش نقاط</span>
                </label>
              </div>

              <!-- Slides Management -->
              <div class="mt-4 border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <h4 class="font-bold text-gray-900 flex items-center gap-2">
                    <i class="ti ti-stack text-purple-600"></i>
                    اسلایدها
                  </h4>
                  <button @click="addSlide"
                          class="text-sm px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-bold">
                    <i class="ti ti-plus ml-1"></i>
                    افزودن اسلاید
                  </button>
                </div>

                <div v-if="settings.general.slides.length === 0" class="text-center py-8 text-gray-500">
                  <i class="ti ti-photo-off text-4xl mb-2"></i>
                  <p>هیچ اسلایدی وجود ندارد</p>
                  <p class="text-sm">برای شروع یک اسلاید اضافه کنید</p>
                </div>

                <div class="space-y-4">
                  <div v-for="(slide, index) in settings.general.slides" :key="index"
                       class="border-2 border-gray-200 rounded-lg bg-white overflow-hidden">
                    <!-- Slide Header (Always Visible) -->
                    <div
                        @click="toggleSlide(index)"
                        class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div class="flex items-center gap-3">
                        <span
                            class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-sm">
                          {{ index + 1 }}
                        </span>
                        <div>
                          <div class="font-bold text-gray-900">{{ slide.title || 'اسلاید ' + (index + 1) }}</div>
                          <div class="text-xs text-gray-500">{{ slide.subtitle || 'بدون زیرعنوان' }}</div>
                        </div>
                        <span v-if="slide.active" class="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">فعال</span>
                        <span v-else class="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">غیرفعال</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <button
                            @click.stop="removeSlide(index)"
                            class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <i class="ti ti-trash text-lg"></i>
                        </button>
                        <i :class="expandedSlides.includes(index) ? 'ti ti-chevron-up' : 'ti ti-chevron-down'"
                           class="text-gray-600 text-xl"></i>
                      </div>
                    </div>

                    <!-- Slide Content (Collapsible) -->
                    <div v-if="expandedSlides.includes(index)" class="px-4 pb-4 border-t border-gray-200">
                      <div class="pt-4 space-y-3">
                        <!-- Image Upload -->
                        <div>
                          <label class="block text-xs font-bold text-gray-700 mb-2">تصویر اسلاید *</label>
                          <div class="flex items-start gap-3">
                            <div
                                class="w-32 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border-2 border-gray-200">
                              <img v-if="slide.image" :src="slide.image" class="w-full h-full object-cover"/>
                              <div v-else class="w-full h-full flex items-center justify-center">
                                <i class="ti ti-photo text-gray-400 text-2xl"></i>
                              </div>
                            </div>
                            <div class="flex-1 space-y-2">
                              <input
                                  v-model="slide.image"
                                  type="url"
                                  placeholder="https://example.com/image.jpg"
                                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                              />
                              <input
                                  type="file"
                                  accept="image/*"
                                  @change="handleImageUpload($event, index)"
                                  class="hidden"
                                  :id="'slide-upload-' + index"
                              />
                              <label
                                  :for="'slide-upload-' + index"
                                  class="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm"
                              >
                                <i class="ti ti-upload text-purple-600"></i>
                                <span>انتخاب فایل</span>
                              </label>
                            </div>
                          </div>
                          <p class="text-xs text-gray-500 mt-1">توصیه: 1920x600 پیکسل</p>
                        </div>

                        <!-- Title and Subtitle -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label class="block text-xs font-bold text-gray-700 mb-2">عنوان</label>
                            <input
                                v-model="slide.title"
                                type="text"
                                placeholder="عنوان اسلاید..."
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label class="block text-xs font-bold text-gray-700 mb-2">زیرعنوان</label>
                            <input
                                v-model="slide.subtitle"
                                type="text"
                                placeholder="زیرعنوان..."
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                            />
                          </div>
                        </div>

                        <!-- Description -->
                        <div>
                          <label class="block text-xs font-bold text-gray-700 mb-2">توضیحات</label>
                          <textarea
                              v-model="slide.description"
                              rows="2"
                              placeholder="توضیحات کوتاه درباره این اسلاید..."
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm resize-none"
                          ></textarea>
                        </div>

                        <!-- CTA Button -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label class="block text-xs font-bold text-gray-700 mb-2">متن دکمه CTA</label>
                            <input
                                v-model="slide.ctaText"
                                type="text"
                                placeholder="مثال: مشاهده فیلم"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label class="block text-xs font-bold text-gray-700 mb-2">لینک دکمه</label>
                            <input
                                v-model="slide.ctaLink"
                                type="url"
                                placeholder="https://example.com/page"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                            />
                          </div>
                        </div>

                        <!-- Active Toggle -->
                        <div class="flex items-center pt-2 border-t border-gray-200">
                          <label class="flex items-center gap-2 cursor-pointer">
                            <input
                                v-model="slide.active"
                                type="checkbox"
                                class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            <span class="text-sm text-gray-700 font-medium">نمایش در صفحه اصلی</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 space-y-4">
            <h3 class="text-md font-semibold text-gray-900">تنظیمات نمایش</h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                    v-model="settings.general.showComments"
                    type="checkbox"
                    class="rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                >
                <span class="text-gray-700">نمایش کامنت‌ها</span>
              </label>

              <label class="flex items-center gap-3 cursor-pointer">
                <input
                    v-model="settings.general.showSearch"
                    type="checkbox"
                    class="rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                >
                <span class="text-gray-700">نمایش جستجو</span>
              </label>

              <label class="flex items-center gap-3 cursor-pointer">
                <input
                    v-model="settings.general.showSidebar"
                    type="checkbox"
                    class="rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                >
                <span class="text-gray-700">نمایش نوار کناری</span>
              </label>

              <label class="flex items-center gap-3 cursor-pointer">
                <input
                    v-model="settings.general.showSocialMedia"
                    type="checkbox"
                    class="rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                >
                <span class="text-gray-700">نمایش شبکه‌های اجتماعی</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- API Settings -->
      <div v-if="activeTab === 'api'" class="space-y-6">
        <!-- OMDB API -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div
                  class="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                <i class="ti ti-database text-white text-2xl"></i>
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900">OMDb API</h2>
                <p class="text-sm text-gray-600">دریافت اطلاعات تکمیلی فیلم‌ها از IMDb</p>
              </div>
            </div>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                  v-model="settings.api.omdb.enabled"
                  type="checkbox"
                  class="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              >
              <span class="text-sm font-medium text-gray-700">فعال</span>
            </label>
          </div>

          <div v-if="settings.api.omdb.enabled" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">API Key *</label>
              <input
                  v-model="settings.api.omdb.apiKey"
                  type="text"
                  placeholder="YOUR_OMDB_API_KEY"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  dir="ltr"
              >
            </div>

            <div class="flex gap-3 pt-4 border-t border-gray-200">
              <button @click="testOMDBConnection"
                      class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2">
                <i class="ti ti-plug-connected"></i>
                تست اتصال
              </button>
            </div>
          </div>
        </div>

        <!-- Custom APIs -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div
                  class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <i class="ti ti-api text-white text-2xl"></i>
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900">API های سفارشی</h2>
                <p class="text-sm text-gray-600">افزودن API های دلخواه خود</p>
              </div>
            </div>
            <button @click="addCustomAPI"
                    class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
              <i class="ti ti-plus"></i>
              افزودن API
            </button>
          </div>

          <div v-if="settings.api.customApis.length === 0" class="text-center py-8 text-gray-500">
            <i class="ti ti-api-off text-4xl mb-2"></i>
            <p class="text-sm">هیچ API سفارشی اضافه نشده است</p>
          </div>

          <div v-else class="space-y-4">
            <div
                v-for="(api, index) in settings.api.customApis"
                :key="index"
                class="border border-gray-200 rounded-lg p-4 space-y-3"
            >
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-500">API #{{ index + 1 }}</span>
                <button
                    @click="removeCustomAPI(index)"
                    class="text-red-600 hover:text-red-700"
                >
                  <i class="ti ti-trash"></i>
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">نام API</label>
                  <input
                      v-model="api.name"
                      type="text"
                      placeholder="مثال: My Custom API"
                      class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                </div>

                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">URL پایه</label>
                  <input
                      v-model="api.baseUrl"
                      type="text"
                      placeholder="https://api.example.com"
                      class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      dir="ltr"
                  >
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">API Key (اختیاری)</label>
                <input
                    v-model="api.apiKey"
                    type="text"
                    placeholder="YOUR_API_KEY"
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    dir="ltr"
                >
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Header Name</label>
                  <input
                      v-model="api.headerName"
                      type="text"
                      placeholder="Authorization"
                      class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      dir="ltr"
                  >
                </div>

                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Header Value Format</label>
                  <input
                      v-model="api.headerValue"
                      type="text"
                      placeholder="Bearer {apiKey}"
                      class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      dir="ltr"
                  >
                </div>
              </div>

              <div>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                      v-model="api.enabled"
                      type="checkbox"
                      class="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  >
                  <span class="text-sm text-gray-700">فعال</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- API Usage Stats -->
        <div class="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="ti ti-chart-bar text-purple-600"></i>
            آمار استفاده از API
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white rounded-lg p-4 border border-purple-100">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">درخواست‌های امروز</p>
                  <p class="text-2xl font-bold text-gray-900 mt-1">0</p>
                </div>
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i class="ti ti-activity text-blue-600 text-xl"></i>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg p-4 border border-purple-100">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">درخواست‌های موفق</p>
                  <p class="text-2xl font-bold text-green-600 mt-1">0</p>
                </div>
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i class="ti ti-check text-green-600 text-xl"></i>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg p-4 border border-purple-100">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">درخواست‌های ناموفق</p>
                  <p class="text-2xl font-bold text-red-600 mt-1">0</p>
                </div>
                <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <i class="ti ti-x text-red-600 text-xl"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SEO Settings -->
      <div v-if="activeTab === 'seo'" class="bg-white rounded-xl border border-gray-200 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-6">تنظیمات سئو (SEO)</h2>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">عنوان متا (Meta Title)</label>
            <input
                v-model="settings.seo.metaTitle"
                type="text"
                placeholder="عنوان سایت برای موتورهای جستجو..."
                class="input-field"
                maxlength="60"
            >
            <p class="text-xs text-gray-500 mt-1">{{ settings.seo.metaTitle?.length }}/60 کاراکتر</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">توضیحات متا (Meta Description)</label>
            <textarea
                v-model="settings.seo.metaDescription"
                rows="3"
                placeholder="توضیحات کوتاه برای موتورهای جستجو..."
                class="input-field resize-none"
                maxlength="160"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">{{ (settings.seo.metaDescription||'').length }}/160 کاراکتر</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">کلمات کلیدی</label>
            <input
                v-model="settings.seo.keywords"
                type="text"
                placeholder="فیلم، سریال، آموزش، ویدیو"
                class="input-field"
            >
            <p class="text-xs text-gray-500 mt-1">کلمات کلیدی را با کاما جدا کنید</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">URL کانونیکال</label>
            <input
                v-model="settings.seo.canonicalUrl"
                type="url"
                placeholder="https://example.com"
                class="input-field"
            >
          </div>
        </div>
      </div>

      <!-- Open Graph Settings -->
      <div v-if="activeTab === 'opengraph'" class="bg-white rounded-xl border border-gray-200 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-6">تنظیمات Open Graph</h2>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">عنوان OG</label>
            <input
                v-model="settings.opengraph.title"
                type="text"
                placeholder="عنوان برای اشتراک‌گذاری در شبکه‌های اجتماعی"
                class="input-field"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">توضیحات OG</label>
            <textarea
                v-model="settings.opengraph.description"
                rows="3"
                placeholder="توضیحات برای اشتراک‌گذاری..."
                class="input-field resize-none"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">تصویر OG</label>
            <div class="flex items-center gap-4">
              <div v-if="settings.opengraph.ojPreview" class="w-32 h-20 rounded border-2 border-gray-200 overflow-hidden relative">
                <img :src="settings.opengraph.ojPreview" alt="OG" class="w-full h-full object-cover"/>
                <button
                    @click.stop="removeOgImage"
                    class="absolute top-2 right-2 p-1 bg-red-500 w-7 h-7 text-center text-white rounded-full hover:bg-red-600 transition-colors">
                  <i class="ti ti-x text-sm"></i>
                </button>
              </div>
              <div v-else
                   class="w-32 h-20 rounded border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer"
                   @click="ogInputRef.click()">
                <i class="ti ti-photo text-2xl text-gray-400"></i>
              </div>

              <div class="flex-1">
                <!-- URL Input -->
                <input
                    v-model="settings.opengraph.ojUrl"
                    type="url"
                    placeholder="https://example.com/og-image.jpg"
                    class="input-field"
                    @input="settings.opengraph.ojPreview = settings.opengraph.ojUrl"
                >
                <p class="text-xs text-gray-500 mt-1">توصیه می‌شود: 1200x630 پیکسل</p>
              </div>
            </div>

            <!-- Hidden File Input -->
            <input
                ref="ogInputRef"
                type="file"
                accept="image/*"
                class="hidden"
                @change="uploadGeneralImage($event, 'og')"
            />
          </div>


          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">نوع محتوا</label>
            <select v-model="settings.opengraph.type" class="input-field">
              <option value="website">وب‌سایت</option>
              <option value="article">مقاله</option>
              <option value="video.movie">فیلم</option>
              <option value="video.episode">قسمت سریال</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Social Media -->
      <div v-if="activeTab === 'social'" class="bg-white rounded-xl border border-gray-200 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-6">شبکه‌های اجتماعی</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">اینستاگرام</label>
            <input
                v-model="settings.social.instagram"
                type="url"
                placeholder="https://instagram.com/username"
                class="input-field"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">تلگرام</label>
            <input
                v-model="settings.social.telegram"
                type="url"
                placeholder="https://t.me/username"
                class="input-field"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">توییتر</label>
            <input
                v-model="settings.social.twitter"
                type="url"
                placeholder="https://twitter.com/username"
                class="input-field"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">یوتیوب</label>
            <input
                v-model="settings.social.youtube"
                type="url"
                placeholder="https://youtube.com/@username"
                class="input-field"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">لینکدین</label>
            <input
                v-model="settings.social.linkedin"
                type="url"
                placeholder="https://linkedin.com/company/username"
                class="input-field"
            >
          </div>
        </div>
      </div>

      <!-- Advanced Settings -->
      <div v-if="activeTab === 'advanced'" class="bg-white rounded-xl border border-gray-200 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-6">تنظیمات پیشرفته</h2>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">کد Google Analytics</label>
            <input
                v-model="settings.advanced.googleAnalytics"
                type="text"
                placeholder="G-XXXXXXXXXX"
                class="input-field"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">کد تگ منیجر گوگل</label>
            <input
                v-model="settings.advanced.googleTagManager"
                type="text"
                placeholder="GTM-XXXXXXX"
                class="input-field"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">کد Pixel فیسبوک</label>
            <input
                v-model="settings.advanced.facebookPixel"
                type="text"
                placeholder="XXXXXXXXXXXXXXX"
                class="input-field"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">کدهای سفارشی Head</label>
            <textarea
                v-model="settings.advanced.customHead"
                rows="4"
                placeholder="<!-- کدهای سفارشی برای بخش head -->"
                class="input-field font-mono text-sm resize-none"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">کدهای سفارشی Body</label>
            <textarea
                v-model="settings.advanced.customBody"
                rows="4"
                placeholder="<!-- کدهای سفارشی برای بخش body -->"
                class="input-field font-mono text-sm resize-none"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import {useToast} from "@/composables/useToast.js";
import {useFilmSettingStore} from "@/stores/film-setting.ts";
const logoInputRef = ref(null)
const faviconInputRef = ref(null)
const ogInputRef=ref(null)

const toast = useToast()
const activeTab = ref('general')
const expandedSlides = ref([])
const filmSettingStore = useFilmSettingStore()
const tabs = ref([
  {id: 'general', label: 'عمومی', icon: 'ti ti-settings'},
  {id: 'api', label: 'تنظیمات API', icon: 'ti ti-api'},
  {id: 'seo', label: 'سئو', icon: 'ti ti-seo'},
  {id: 'opengraph', label: 'Open Graph', icon: 'ti ti-share'},
  {id: 'social', label: 'شبکه‌های اجتماعی', icon: 'ti ti-brand-instagram'},
  {id: 'advanced', label: 'پیشرفته', icon: 'ti ti-code'}
])

const settings = ref({
  general: {
    siteName: 'پلتفرم فیلم و سریال',
    tagline: 'بهترین فیلم‌ها را با ما تماشا کنید',
    adminEmail: 'admin@film.com',
    language: 'fa',
    description: '',
    logo: '',
    logoUrl:'',
    favicon: '',
    faviconUrl:'',
    sliderEnabled: true,
    sliderSpeed: 5,
    sliderHeight: 500,
    sliderEffect: 'fade',
    sliderAutoplay: true,
    sliderLoop: true,
    sliderNavigation: true,
    sliderPagination: true,
    slides: [
      {
        image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=1920&h=600&fit=crop',
        title: 'فیلم‌های برتر',
        subtitle: 'بهترین‌های سینمای جهان',
        description: 'مجموعه‌ای از بهترین و محبوب‌ترین فیلم‌های تاریخ سینما',
        ctaText: 'مشاهده لیست',
        ctaLink: '/movies/top-rated',
        active: true
      },
      {
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&h=600&fit=crop',
        title: 'سریال‌های پرطرفدار',
        subtitle: 'محبوب‌ترین سریال‌ها',
        description: 'سریال‌های پرمخاطب و جذاب برای تماشای شما',
        ctaText: 'کاوش کنید',
        ctaLink: '/series/popular',
        active: true
      }
    ],
    showComments: true,
    showSearch: true,
    showSidebar: true,
    showSocialMedia: true
  },
  seo: {
    metaTitle: 'عنوان متا',
    metaDescription: 'توصیحات متا',
    keywords: '',
    canonicalUrl: ''
  },
  api: {
    omdb: {
      enabled: false,
      apiKey: ''
    },
    customApis: []
  },
  opengraph: {
    title: '',
    description: '',
    image: '',
    ojUrl: '',
    type: 'website'
  },
  social: {
    instagram: '',
    telegram: '',
    twitter: '',
    youtube: '',
    linkedin: ''
  },
  advanced: {
    googleAnalytics: '',
    googleTagManager: '',
    facebookPixel: '',
    customHead: '',
    customBody: ''
  }
})

const loadSettings = () => {
  try {

    if (filmSettingStore.settings) {

      settings.value = {
        ...settings.value, // داده‌های پیش‌فرض
        ...filmSettingStore.settings,
      };

      // تنظیم پیش‌نمایش تصاویر
      if (settings.value.opengraph?.image) {
        settings.value.opengraph.ojPreview = settings.value.opengraph.image;
      }
      if (settings.value.general?.logoUrl) {
        settings.value.general.logoPreview = settings.value.general.logoUrl;
      }
      if (settings.value.general?.faviconUrl) {
        settings.value.general.faviconPreview = settings.value.general.faviconUrl;
      }
    }
  } catch (e) {
    console.error('Error loading settings:', e);
  }
};

const addSlide = () => {
  settings.value.general.slides.push({
    image: '',
    title: '',
    subtitle: '',
    description: '',
    ctaText: '',
    ctaLink: '',
    active: true
  })
  // Auto-expand the new slide
  expandedSlides.value.push(settings.value.general.slides.length - 1)
}

const removeSlide = (index) => {
  if (confirm('آیا از حذف این اسلاید اطمینان دارید؟')) {
    settings.value.general.slides.splice(index, 1)
    // Update expanded slides indices
    expandedSlides.value = expandedSlides.value
        .filter(i => i !== index)
        .map(i => i > index ? i - 1 : i)
  }
}

const toggleSlide = (index) => {
  const idx = expandedSlides.value.indexOf(index)
  if (idx > -1) {
    expandedSlides.value.splice(idx, 1)
  } else {
    expandedSlides.value.push(index)
  }
}

const uploadGeneralImage = (event, type) => {
  const file = event.target.files[0];
  if (!file) return;

  const preview = URL.createObjectURL(file);

  if (type === 'logo') {

    settings.value.general.logo = file;
    settings.value.general.logoPreview = preview;
  }

  if (type === 'favicon') {
    settings.value.general.favicon = file;
    settings.value.general.faviconPreview = preview;
  }

  if (type === 'og') {
    settings.value.opengraph.image = file
    settings.value.opengraph.ojPreview = preview

  }
};

const removeLogo = () => {
  settings.value.general.logo = null;
  settings.value.general.logoUrl = "";
  settings.value.general.logoPreview = "";
};

const removeFavicon = () => {
  settings.value.general.favicon = null;
  settings.value.general.faviconUrl = "";
  settings.value.general.faviconPreview = "";
};

const removeOgImage = () => {
  settings.value.opengraph.image = null;
  settings.value.opengraph.ojUrl = "";
  settings.value.opengraph.ojPreview = "";
};



const handleImageUpload = (event, slideIndex) => {
  const file = event.target.files[0]
  if (!file) return

  // Check file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    toast.error('حجم فایل نباید بیشتر از 2 مگابایت باشد', 'لطفاً یک فایل کوچکتر انتخاب کنید')
    return
  }

  // Check file type
  if (!file.type.startsWith('image/')) {
    toast.error('فقط فایل‌های تصویری مجاز هستند', 'فرمت‌های مجاز: JPG, PNG, WebP')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    settings.value.general.slides[slideIndex].image = e.target.result
  }
  reader.readAsDataURL(file)
}

// API Functions
const addCustomAPI = () => {
  settings.value.api.customApis.push({
    name: '',
    baseUrl: '',
    apiKey: '',
    headerName: 'Authorization',
    headerValue: 'Bearer {apiKey}',
    enabled: true
  })
}

const removeCustomAPI = (index) => {
  if (confirm('آیا از حذف این API اطمینان دارید؟')) {
    settings.value.api.customApis.splice(index, 1)
  }
}

const testOMDBConnection = async () => {
  if (!settings.value.api.omdb.apiKey) {
    toast.warning('لطفاً ابتدا API Key را وارد کنید')
    return
  }

  try {
    const response = await fetch(
        `https://www.omdbapi.com/?apikey=${settings.value.api.omdb.apiKey}&i=tt3896198`
    )

    if (response.ok) {
      const data = await response.json()
      if (data.Response === 'True') {
        toast.success('اتصال با موفقیت برقرار شد!', 'API کار می‌کند')
      } else {
        toast.error('خطا در اتصال', data.Error)
      }
    } else {
      toast.error('خطا در اتصال', 'لطفاً API Key را بررسی کنید')
    }
  } catch (error) {
    toast.error('خطا در اتصال', error.message)
  }
}

const saveSettings = async () => {
  /*console.log('setting',settings.value)
  return*/
  await filmSettingStore.saveAll(settings.value)
  toast.success('تنظیمات با موفقیت ذخیره شد!', 'تغییرات اعمال گردید')
}

const resetSettings = () => {
  if (confirm('آیا از بازنشانی تنظیمات اطمینان دارید؟')) {
    localStorage.removeItem('film-settings')
    location.reload()
  }
}

onMounted(async () => {
  await filmSettingStore.fetchAll()
  loadSettings()
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
  transition: all 0.2s;
}

.btn-primary:hover {
  background-color: #7e22ce;
}

.btn-secondary {
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: #f3f4f6;
}

.input-field {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #9333ea;
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
