import Vue from 'vue'
import Router from 'vue-router'
import Cash from '@/components/pages/Cash'
import leftNav from '@/components/common/leftNav'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Cash',
      component: Cash
    }
  ]
})
