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
      component: () => import('../views/GerarComissoesView.vue')
    },
    {
      path: '/Faturamento',
      name: 'Faturamento',
      component: () => import('../views/FaturamentoView.vue')
    },
    {
      path: '/GastosFrota',
      name: 'GastosFrota',
      component: () => import('../views/GastosFrotaView.vue')
    },
    {
      path: '/DespesasAtendimento',
      name: 'DespesasAtendimento',
      component: () => import('../views/DespesasAtendimentoView.vue')
    },
    {
      path: '/RecebimentoComissao',
      name: 'RecebimentoComissao',
      component: () => import('../views/RecebimentoComissaoView.vue')
    },
    {
      path: '/AdicionarAtendimento',
      name: 'AdicionarAtendimento',
      component: () => import('../views/AdicionarAtendimentoView.vue')
    },
    {
      path: '/postColaborador',
      name: 'postColaborador',
      component: () => import('../components/colaborador/postColaborador.vue')
    },
  ]
})

export default router
