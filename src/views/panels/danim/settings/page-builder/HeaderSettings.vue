<template>
  <div class="space-y-6">
    <!-- Logo Settings -->
    <div class="space-y-4">
      <h4 class="font-bold text-gray-900">لوگو</h4>
      <div class="grid grid-cols-2 gap-4">
        <div class="col-span-2">
          <label class="block text-sm font-medium mb-2">آپلود لوگو</label>
          <div class="flex items-center gap-4">
            <!-- Preview -->
            <div v-if="section.data.logo" class="w-24 h-24 rounded-lg border-2 border-gray-200 overflow-hidden flex-shrink-0">
              <img :src="section.data.logo" alt="لوگو" class="w-full h-full object-contain" />
            </div>
            <div v-else class="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0">
              <i class="ti ti-photo text-3xl text-gray-400"></i>
            </div>
            <!-- Upload Button -->
            <div class="flex-1">
              <input
                type="file"
                accept="image/*"
                @change="(e) => $emit('upload', e, section.data, 'logo')"
                class="hidden"
                :id="'logo-upload-' + section.id"
              />
              <label
                :for="'logo-upload-' + section.id"
                class="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg cursor-pointer hover:bg-orange-600 transition-colors"
              >
                <i class="ti ti-upload"></i>
                انتخاب فایل
              </label>
              <button
                v-if="section.data.logo"
                @click="section.data.logo = ''"
                class="mr-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <i class="ti ti-trash ml-1"></i>
                حذف
              </button>
            </div>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">اندازه لوگو (px)</label>
          <input v-model.number="section.data.logoSize" type="number" class="input-field" placeholder="120">
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">متن جایگزین</label>
          <input v-model="section.data.logoAlt" type="text" class="input-field" placeholder="دانیم">
        </div>
        <div class="col-span-2">
          <label class="block text-sm font-medium mb-2">لینک لوگو</label>
          <input v-model="section.data.logoLink" type="text" class="input-field" placeholder="/">
        </div>
      </div>
    </div>

    <!-- Menu Items -->
    <div class="space-y-4 pt-4 border-t">
      <div class="flex items-center justify-between">
        <h4 class="font-bold text-gray-900">منوی ناوبری</h4>
        <button @click="addMenuItem" class="px-3 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600">
          <i class="ti ti-plus mr-1"></i>
          افزودن آیتم
        </button>
      </div>

      <div v-if="section.data.menuItems && section.data.menuItems.length > 0" class="space-y-2">
        <div v-for="(item, itemIndex) in section.data.menuItems" :key="itemIndex" class="flex items-center gap-2 p-3 border rounded-lg bg-white">
          <i class="ti ti-grip-vertical text-gray-400"></i>
          <input v-model="item.label" type="text" class="input-field flex-2 text-sm" placeholder="عنوان">
          <input v-model="item.link" type="text" class="input-field w-32 text-sm" placeholder="/link">
          <button @click="removeMenuItem(itemIndex)" class="text-red-600 hover:text-red-700">
            <i class="ti ti-trash"></i>
          </button>
        </div>
      </div>

      <div v-else class="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
        <p class="text-sm text-gray-600">هیچ آیتم منویی اضافه نشده</p>
      </div>
    </div>

    <!-- Header Style -->
    <div class="space-y-4 pt-4 border-t">
      <h4 class="font-bold text-gray-900">استایل هدر</h4>
      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">حالت</label>
          <select v-model="section.data.position" class="input-field">
            <option value="fixed">ثابت</option>
            <option value="sticky">چسبان</option>
            <option value="static">استاتیک</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">رنگ پس‌زمینه</label>
          <input v-model="section.data.bgColor" type="color" class="w-full h-10 rounded border">
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">شفافیت (%)</label>
          <input v-model.number="section.data.opacity" type="number" min="0" max="100" class="input-field">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  section: {
    type: Object,
    required: true
  }
})

defineEmits(['upload'])

const addMenuItem = () => {
  if (!props.section.data.menuItems) {
    props.section.data.menuItems = []
  }
  props.section.data.menuItems.push({
    label: '',
    link: ''
  })
}

const removeMenuItem = (index) => {
  if (confirm('آیا از حذف این آیتم اطمینان دارید؟')) {
    props.section.data.menuItems.splice(index, 1)
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500;
}
</style>
