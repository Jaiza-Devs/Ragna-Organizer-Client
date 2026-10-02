import { createRouter, createWebHashHistory } from 'vue-router'

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

// Activity Completions
import ActivityHistoryView from '@/views/activities/ActivityHistoryView.vue'

// Currencies
import CurrencyListView from '@/views/currencies/CurrencyListView.vue'
import CurrencyCreateView from '@/views/currencies/CurrencyCreateView.vue'

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

      // Activities
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

      // Activity Completions
      {
        path: 'accounts/:accountId/characters/:characterId/activity-history',
        name: 'activity-history',
        component: ActivityHistoryView
      },

      // Currencies
      {
        path: 'currencies',
        name: 'currencies',
        component: CurrencyListView
      },

      {
        path: 'currencies/create',
        name: 'currency-create',
        component: CurrencyCreateView
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router