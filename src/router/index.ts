import DefaultLayout from '@/layout/DefaultLayout.vue'
import AtmVue from '@/modules/atm/AtmView.vue'
import BankView from '@/modules/bank/BankView.vue'
import VerifyAccount from '@/modules/bank/chunks/VerifyAccount.vue'
import HomeView from '@/modules/home/HomeView.vue'
import LoginView from '@/modules/login/LoginView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: '',
      path: '/',
      component: DefaultLayout,
      children: [
        {
          name: 'atm',
          path: '/atm',
          component: AtmVue
        },

        {
          name: 'home',
          path: '',
          component: HomeView
        },

        {
          name: 'login',
          path: '/login',
          component: LoginView
        },
        {
          name: 'bank',
          path: '/bank',
          component: BankView
        },
        {
          name: 'verify',
          path: 'bank/verify',
          component: VerifyAccount
        }
      ]
    }
  ],
})

export default router
