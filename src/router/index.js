import Vue from 'vue'
import Router from 'vue-router'

import Home from '../pages/Home/Home.vue'
import About from '../pages/About/About.vue'
import Products from '../pages/Products/Products.vue'
import OCR from '../pages/OCR/ocr.vue'

Vue.use(Router)

export default new Router({
  routes: [
  	{
        path: '/home',
        component: Home,
        meta: {
            showNavDetail: true,
        }
    },
    {
        path: '/about',
        component: About,
        meta: {
            showNavDetail: true,
        }
    },
    {
        path: '/ocr',
        component: OCR,
        meta: {
            showNavDetail: true,
        }
    },
    {
        path: '/products',
        component: Products,
        meta: {
            showNavDetail: true,
        }
    },
    {
      path: '/',
      redirect: '/home'
    }
  ]
})
