import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Login from './views/Login.vue'
import Dashboard from './views/Dashboard.vue'
import axiosPlugin from './plugins/axiosPlugins.ts'
import {createPinia} from "pinia";

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'DashboardHome',
        component: { template: '<div></div>' },
        meta: { activePanel: null }
      },
      {
        path: 'test',
        name: 'TestPanel',
        component: { template: '<div></div>' },
        meta: { activePanel: 'test' }
      },
      {
        path: 'danim',
        name: 'DanimDashboard',
        component: { template: '<div></div>' },
        meta: { activePanel: 'danim', role: 'danim_admin' }
      },
      {
        path: 'danim/posts',
        name: 'DanimPosts',
        component: { template: '<div></div>' },
        meta: { activePanel: 'danim', activeSection: 'posts', role: 'danim_admin' }
      },
      {
        path: 'danim/posts/create',
        name: 'DanimPostCreate',
        component: { template: '<div></div>' },
        meta: { activePanel: 'danim', activeSection: 'posts', activeView: 'create', role: 'danim_admin' }
      },
      {
        path: 'danim/posts/edit/:id',
        name: 'DanimPostEdit',
        component: { template: '<div></div>' },
        meta: { activePanel: 'danim', activeSection: 'posts', activeView: 'edit', role: 'danim_admin' }
      },
      {
        path: 'danim/pages',
        name: 'DanimPages',
        component: { template: '<div></div>' },
        meta: { activePanel: 'danim', activeSection: 'pages', role: 'danim_admin' }
      },
      {
        path: 'danim/pages/create',
        name: 'DanimPageCreate',
        component: { template: '<div></div>' },
        meta: { activePanel: 'danim', activeSection: 'pages', activeView: 'create', role: 'danim_admin' }
      },
      {
        path: 'danim/pages/edit/:id',
        name: 'DanimPageEdit',
        component: { template: '<div></div>' },
        meta: { activePanel: 'danim', activeSection: 'pages', activeView: 'edit', role: 'danim_admin' }
      },
      {
        path: 'danim/categories',
        name: 'DanimCategories',
        component: { template: '<div></div>' },
        meta: { activePanel: 'danim', activeSection: 'categories', role: 'danim_admin' }
      },
      {
        path: 'danim/tags',
        name: 'DanimTags',
        component: { template: '<div></div>' },
        meta: { activePanel: 'danim', activeSection: 'tags', role: 'danim_admin' }
      },
      {
        path: 'danim/users',
        name: 'DanimUsers',
        component: { template: '<div></div>' },
        meta: { activePanel: 'danim', activeSection: 'users', role: 'danim_admin' }
      },
      {
        path: 'danim/settings',
        name: 'DanimSettings',
        component: { template: '<div></div>' },
        meta: { activePanel: 'danim', activeSection: 'settings', role: 'danim_admin' }
      },
      // Hamian Routes
      {
        path: 'hamian',
        name: 'HamianDashboard',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', role: 'supporter_admin' }
      },
      {
        path: 'hamian/donations',
        name: 'HamianDonations',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'donations', role: 'supporter_admin' }
      },
      {
        path: 'hamian/donations/create',
        name: 'HamianDonationCreate',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'donations', activeView: 'create', role: 'supporter_admin' }
      },
      {
        path: 'hamian/projects',
        name: 'HamianProjects',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'projects', role: 'supporter_admin' }
      },
      {
        path: 'hamian/projects/create',
        name: 'HamianProjectCreate',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'projects', activeView: 'create', role: 'supporter_admin' }
      },
      {
        path: 'hamian/supporters',
        name: 'HamianSupporters',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'supporters', role: 'supporter_admin' }
      },
      {
        path: 'hamian/supporters/create',
        name: 'HamianSupporterCreate',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'supporters', activeView: 'create', role: 'supporter_admin' }
      },
      {
        path: 'hamian/faqs',
        name: 'HamianFaqs',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'faqs', role: 'supporter_admin' }
      },
      {
        path: 'hamian/faqs/categories',
        name: 'HamianFaqCategories',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'faq-categories', role: 'supporter_admin' }
      },
      {
        path: 'hamian/documentaries',
        name: 'HamianDocumentaries',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'documentaries', role: 'supporter_admin' }
      },
      {
        path: 'hamian/documentaries/categories',
        name: 'HamianDocumentaryCategories',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'documentary-categories', role: 'supporter_admin' }
      },
      {
        path: 'hamian/documentaries/create',
        name: 'HamianDocumentaryCreate',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'documentaries', activeView: 'create', role: 'supporter_admin' }
      },
      {
        path: 'hamian/documentaries/edit',
        name: 'HamianDocumentaryEdit',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'documentaries', activeView: 'edit', role: 'supporter_admin' }
      },
      {
        path: 'hamian/pages',
        name: 'HamianPages',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'pages', role: 'supporter_admin' }
      },
      {
        path: 'hamian/pages/create',
        name: 'HamianPageCreate',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'pages', activeView: 'create', role: 'supporter_admin' }
      },
      {
        path: 'hamian/pages/edit/:id',
        name: 'HamianPageEdit',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'pages', activeView: 'edit', role: 'supporter_admin' }
      },
      {
        path: 'hamian/users',
        name: 'HamianUsers',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'users', role: 'supporter_admin' }
      },
      {
        path: 'hamian/reports',
        name: 'HamianReports',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'reports', role: 'supporter_admin' }
      },
      {
        path: 'hamian/settings',
        name: 'HamianSettings',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'settings', role: 'supporter_admin' }
      },
      {
        path: 'hamian/requests',
        name: 'HamianRequests',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'requests', role: 'supporter_admin' }
      },
      // Film Routes
      {
        path: 'film',
        name: 'FilmDashboard',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film' , role: 'film_admin' }
      },
      {
        path: 'film/videos',
        name: 'FilmVideos',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'videos', role: 'film_admin' }
      },
      {
        path: 'film/video-add',
        name: 'FilmVideoAdd',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'video-add', role: 'film_admin' }
      },
      {
        path: 'film/categories',
        name: 'FilmCategories',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'categories', role: 'film_admin' }
      },
      {
        path: 'film/series',
        name: 'FilmSeries',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'series', role: 'film_admin' }
      },
      {
        path: 'film/series/create',
        name: 'FilmSeriesCreate',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'series', activeView: 'create', role: 'film_admin' }
      },
      {
        path: 'film/series/edit/:id',
        name: 'FilmSeriesEdit',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'series', activeView: 'edit', role: 'film_admin' }
      },
      {
        path: 'film/movies',
        name: 'FilmMovies',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'movies', role: 'film_admin' }
      },
      {
        path: 'film/movies/create',
        name: 'FilmMovieCreate',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'movies', activeView: 'create', role: 'film_admin' }
      },
      {
        path: 'film/movies/edit/:id',
        name: 'FilmMovieEdit',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'movies', activeView: 'edit', role: 'film_admin' }
      },
      {
        path: 'film/movies/categories',
        name: 'FilmMovieCategories',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'movie-categories', role: 'film_admin' }
      },
      {
        path: 'film/movies/tags',
        name: 'FilmMovieTags',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'movie-tags', role: 'film_admin' }
      },
      {
        path: 'film/movies/faq',
        name: 'FilmMovieFAQ',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'movie-faq', role: 'film_admin' }
      },
      {
        path: 'film/comments',
        name: 'FilmComments',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'comments', role: 'film_admin' }
      },
      {
        path: 'film/reports',
        name: 'FilmReports',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'reports', role: 'film_admin' }
      },
      {
        path: 'film/posts',
        name: 'FilmPosts',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'posts', role: 'film_admin' }
      },
      {
        path: 'film/posts/create',
        name: 'FilmPostCreate',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'posts', activeView: 'create', role: 'film_admin' }
      },
      {
        path: 'film/posts/edit/:id',
        name: 'FilmPostEdit',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'posts', activeView: 'edit', role: 'film_admin' }
      },
      {
        path: 'film/posts/categories',
        name: 'FilmPostCategories',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'post-categories', role: 'film_admin' }
      },
      {
        path: 'film/posts/tags',
        name: 'FilmPostTags',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'post-tags' , role: 'film_admin'}
      },
      {
        path: 'film/pages',
        name: 'FilmPages',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'pages', role: 'film_admin' }
      },
      {
        path: 'film/pages/create',
        name: 'FilmPageCreate',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'pages', activeView: 'create', role: 'film_admin' }
      },
      {
        path: 'film/pages/edit/:id',
        name: 'FilmPageEdit',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'pages', activeView: 'edit', role: 'film_admin' }
      },
      {
        path: 'film/users',
        name: 'FilmUsers',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'users', role: 'film_admin' }
      },
      {
        path: 'film/settings',
        name: 'FilmSettings',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'settings', role: 'film_admin' }
      },
      // Dampezeshki Routes
      {
        path: 'dampezeshki',
        name: 'DampezeshkiDashboard',
        component: { template: '<div></div>' },
        meta: { activePanel: 'dampezeshki', role: 'vet_admin' }
      },
      // Market Routes
      {
        path: 'market',
        name: 'MarketDashboard',
        component: { template: '<div></div>' },
        meta: { activePanel: 'market', role: 'market_admin' }
      }
    ]
  }
]

const router = createRouter({
  //history: createWebHistory('/dashboard/'),
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const rawUser = localStorage.getItem('user')

  let userData = {}

  try {
    userData = rawUser ? JSON.parse(rawUser) : {}
  } catch {
    localStorage.removeItem('user')
    userData = {}
  }
  const userRoles = userData.roles || []

  // اگر احراز هویت لازم دارد و توکن نیست
  if (to.meta.requiresAuth && !token) {
    return next('/')
  }

  // اگر وارد صفحه لاگین شده ولی قبلاً لاگین بوده
  if (to.path === '/' && token) {
    // هدایت بر اساس نقش
    if (userRoles.includes('supporter_admin')) {
      return next('/dashboard')
    }

    if (userRoles.includes('danim_admin')) {
      return next('/dashboard')
    }

    if (userRoles.includes('film_admin')) {
      return next('/dashboard')
    }
    if (userRoles.includes('vet_admin')) {
      return next('/dashboard')
    }
    if (userRoles.includes('market_admin')) {
      return next('/dashboard')
    }

  }

  // بررسی نقش مسیر (اختیاری)
  if (to.meta.role && !userRoles.includes(to.meta.role)) {
    return next('/dashboard')
  }

  next()
})

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(axiosPlugin)
app.mount('#app')
