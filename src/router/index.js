import { createRouter, createWebHistory } from 'vue-router'

import AppLayout from '@/layouts/AppLayout.vue'
import Home from '@/views/HomeView.vue'
import AccountListView from '@/views/accounts/AccountListView.vue'
import AccountCreateView from '@/views/accounts/AccountCreateView.vue'
import AccountView from '@/views/accounts/AccountView.vue'

// Characters 
import CharacterCreateView from '@/views/characters/CharacterCreateView.vue'
import CharacterView from '@/views/characters/CharacterView.vue'

// Activities
import ActivityListView from '@/views/activities/ActivityListView.vue'
import ActivityCreateView from '@/views/activities/ActivityCreateView.vue'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: Home
      },
      {
        path: 'accounts',
        name: 'accounts',
        component: AccountListView
      },
      {
        path: 'accounts/create',
        name: 'account-create',
        component: AccountCreateView
      },
      {
        path: 'accounts/:id',
        name: 'account-view',
        component: AccountView
      },

      // Character Routes
      {
        path: 'accounts/:id/characters/create',
        name: 'character-create',
        component: CharacterCreateView
      },
      {
        path: 'accounts/:accountId/characters/:characterId',
        name: 'character-view',
        component: CharacterView
      },

      //Activities
      {
        path: 'activities',
        name: 'activities',
        component: ActivityListView
      },
      {
        path: 'activities/create',
        name: 'activity-create',
        component: ActivityCreateView
      },

    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router