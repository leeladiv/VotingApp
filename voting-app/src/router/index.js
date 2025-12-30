import { createRouter, createWebHistory } from 'vue-router'
import CandidateCard from '../components/CandidateCard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Card',
      component: CandidateCard,
    },
    {
      path: '/',
      name: 'PollManager',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../components/PollManager.vue'),
    },
  ],
})

export default router
