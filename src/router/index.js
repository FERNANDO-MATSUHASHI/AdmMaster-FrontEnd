import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/Colaborador',
      name: 'Colaborador',
      component: () => import('../views/ColaboradorView.vue')
    },
    {
      path: '/GerarComissoes',
      name: 'GerarComissoes',
      component: () => import('../views/GerarComissoes.vue')
    },
    {
      path: '/Faturamento',
      name: 'Faturamento',
      component: () => import('../views/Faturamento.vue')
    },
    {
      path: '/GastosFrota',
      name: 'GastosFrota',
      component: () => import('../views/GastosFrota.vue')
    },
    {
      path: '/DespesasAtendimento',
      name: 'DespesasAtendimento',
      component: () => import('../views/DespesasAtendimento.vue')
    },
    {
      path: '/RecebimentoComissao',
      name: 'RecebimentoComissao',
      component: () => import('../views/RecebimentoComissao.vue')
    },
    {
      path: '/AdicionarAtendimento',
      name: 'AdicionarAtendimento',
      component: () => import('../views/AdicionarAtendimento.vue')
    },
  ]
})

export default router
