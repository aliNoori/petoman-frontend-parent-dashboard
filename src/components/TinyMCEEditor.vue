<template>
  <div class="w-full">
    <textarea :id="editorId" class="w-full"></textarea>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { usePageStore } from '@/stores/page.ts'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'محتوا را اینجا وارد کنید...'
  },
  height: {
    type: Number,
    default: 500
  }
})

const emit = defineEmits(['update:modelValue'])
const pageStore = usePageStore()
const editorId = ref(`tinymce-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`)
let editorInstance = null
let lastImages = []

// --- Load TinyMCE if not loaded ---
const loadTinyMCE = () => {
  return new Promise((resolve, reject) => {
    if (window.tinymce) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = '/dashboard/tinymce/tinymce.min.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('❌ Failed to load TinyMCE'))
    document.head.appendChild(script)
  })
}

// --- Initialize the editor ---
const initEditor = async () => {
  try {
    await loadTinyMCE()

    const config = {
      selector: `#${editorId.value}`,
      height: props.height,
      directionality: 'rtl',
      license_key: 'gpl',
      convert_urls: false,
      relative_urls: false,
      remove_script_host: false,
      document_base_url: '/',

      plugins: [
        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
        'insertdatetime', 'media', 'table', 'help', 'wordcount'
      ],

      toolbar:
          'undo redo | formatselect | fontsizeselect | ' +
          'bold italic underline strikethrough | forecolor backcolor | ' +
          'alignleft aligncenter alignright alignjustify | ' +
          'bullist numlist outdent indent | link image media table | removeformat code help',

      fontsize_formats: '10pt 12pt 14pt 16pt 18pt 20pt 24pt 28pt 32pt 36pt',
      block_formats:
          'پاراگراف=p; سرتیتر ۱=h1; سرتیتر ۲=h2; سرتیتر ۳=h3; سرتیتر ۴=h4; سرتیتر ۵=h5; سرتیتر ۶=h6',

      menubar: false,
      statusbar: true,
      resize: true,

      // ✅ هندلر آپلود تصویر
      /*images_upload_handler: async (blobInfo, success, failure) => {
        try {
          const file = blobInfo.blob()
          const url = await pageStore.uploadImage(file)

          if (!url || typeof url !== 'string') {
            throw new Error('Invalid URL returned from server')
          }

          success(url)
        } catch (err) {
          console.error('❌ Image upload failed', err)
          failure('Upload failed: ' + err.message)
        }
      },*/

      image_advtab: true,
      image_title: true,
      image_description: true,

      file_picker_types: 'image',
      file_picker_callback: (callback, value, meta) => {
        if (meta.filetype === 'image') {
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = 'image/*'
          input.onchange = async () => {
            const file = input.files[0]
            if (!file) return
            const url = await pageStore.uploadImage(file)
            console.log('iiiiiiiiiii')
            callback(url, { alt: file.name })
          }
          input.click()
        }
      },

      content_style: `
        body {
          font-family: Vazirmatn, Vazir, Tahoma, Arial, sans-serif;
          direction: rtl;
          text-align: right;
          font-size: 18px;
          line-height: 1.8;
          padding: 15px;
          color: #333;
        }
      `,

      setup: (editor) => {
        editorInstance = editor

        editor.on('init', () => {
          editor.setContent(props.modelValue || '')
        })

        editor.on('change input undo redo keyup', () => {
          const content = editor.getContent()
          emit('update:modelValue', content)
        })

        editor.on('change input undo redo keyup', async () => {
          const content = editor.getContent()
          emit('update:modelValue', content)

          // لیست تصاویر فعلی
          const currentImages = Array.from(editor.dom.select('img')).map(img => img.src)

          // پیدا کردن تصاویر حذف‌شده
          const removed = lastImages.filter(src => !currentImages.includes(src))

          if (removed.length > 0) {
            for (const src of removed) {
              try {
                await pageStore.deleteImage(src)
                console.log('✅ Image deleted from storage:', src)
              } catch (err) {
                console.error('❌ Failed to delete image from storage', err)
              }
            }
          }

          // به‌روزرسانی لیست آخرین تصاویر
          lastImages = currentImages
        })
      }
    }

    await window.tinymce.init(config)
  } catch (error) {
    console.error('❌ TinyMCE initialization failed:', error)
  }
}

// --- Watch external model changes ---
watch(
    () => props.modelValue,
    (newValue) => {
      if (editorInstance && editorInstance.getContent() !== newValue) {
        editorInstance.setContent(newValue || '')
      }
    }
)

// --- Mount / Unmount ---
onMounted(() => {
  initEditor()
})

onUnmounted(() => {
  if (editorInstance) {
    try {
      editorInstance.destroy()
      editorInstance = null
    } catch (err) {
      console.warn('Error destroying editor:', err)
    }
  }
})
</script>