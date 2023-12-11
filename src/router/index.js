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
      path: '/Atendimento',
      name: 'Atendimento',
      component: () => import('../views/AtendimentoView.vue')
    },
    {
      path: '/Comissoes',
      name: 'Comissoes',
      component: () => import('../views/ComissoesView.vue')
    },
    {
      path: '/Faturamento',
      name: 'Faturamento',
      component: () => import('../views/FaturamentoView.vue')
    },
    {
      path: '/DespesasAtendimento',
      name: 'DespesasAtendimento',
      component: () => import('../views/DespesasAtendimentoView.vue')
    },
    {
      path: '/Abastecimentos',
      name: 'Abastecimentos',
      component: () => import('../views/Abastecimentos.vue')
    },
    {
      path: '/Manutencao',
      name: 'Manutencao',
      component: () => import('../views/Manutencao.vue')
    },
    {
      path: '/Fornecedor',
      name: 'Fornecedor',
      component: () => import('../views/Fornecedor.vue')
    },
    {
      path: '/TipoViatura',
      name: 'TipoViatura',
      component: () => import('../views/TipoViatura.vue')
    },
    {
      path: '/Viatura',
      name: 'Viatura',
      component: () => import('../views/Viatura.vue')
    },
    {
      path: '/TipoVeiculo',
      name: 'TipoVeiculo',
      component: () => import('../views/TipoVeiculo.vue')
    },
    {
      path: '/TipoServico',
      name: 'TipoServico',
      component: () => import('../views/TipoServico.vue')
    },
    {
      path: '/Veiculo',
      name: 'Veiculo',
      component: () => import('../views/Veiculo.vue')
    },
  ]
});

router.beforeEach((to, from, next) => {
  if (to.fullPath === window.location.pathname) {
    next('/');
  } else {
    next();
  }
});

export default router
