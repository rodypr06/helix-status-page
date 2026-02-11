import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Projects from '../views/Projects.vue'
import Analytics from '../views/Analytics.vue'
import History from '../views/History.vue'
import DocsViewer from '../views/DocsViewer.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/projects',
      name: 'projects',
      component: Projects
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: Analytics
    },
    {
      path: '/history',
      name: 'history',
      component: History
    },
    {
      path: '/docs',
      name: 'docs',
      component: DocsViewer,
      children: [
        {
          path: ':category/:file?',
          name: 'docs-view',
          component: DocsViewer
        }
      ]
    }
  ]
})

export default router
