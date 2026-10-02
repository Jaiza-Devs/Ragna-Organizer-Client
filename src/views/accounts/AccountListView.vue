<template>
    <div class="nw-page">
        <!-- Page header -->
        <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
                <h1 class="nw-heading text-2xl font-extrabold">
                    Accounts
                </h1>

                <p class="nw-muted mt-1 text-sm">
                    Manage your Ragna accounts.
                </p>
            </div>

            <button type="button" class="nw-btn nw-btn-gold" @click="$router.push('/accounts/create')">
                <span class="text-base leading-none" aria-hidden="true">+</span>
                Add Account
            </button>
        </div>

        <div class="mt-6">
            <!-- Loading -->
            <div v-if="loading" class="nw-card px-5 py-4 text-sm nw-muted">
                Loading accounts...
            </div>

            <!-- Empty -->
            <div v-else-if="accounts.length === 0" class="nw-card flex flex-col items-center px-6 py-12 text-center">
                <div class="nw-avatar nw-avatar-lg" aria-hidden="true">👤</div>
                <h2 class="nw-heading mt-4 text-lg font-bold">No accounts yet</h2>
                <p class="nw-muted mt-1 text-sm">Add your first Ragna account to start tracking it.</p>
                <button type="button" class="nw-btn nw-btn-gold mt-5" @click="$router.push('/accounts/create')">
                    Add Account
                </button>
            </div>

            <!-- Account cards -->
            <div v-else class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                <article v-for="account in accounts" :key="account.id" class="nw-card nw-card-hover flex flex-col">
                    <header class="nw-card-header flex items-center gap-3 px-4 py-3">
                        <div class="nw-avatar" aria-hidden="true">
                            {{ initial(account.account_name) }}
                        </div>

                        <div class="min-w-0 flex-1">
                            <h2 class="nw-card-title truncate text-base font-bold">
                                {{ account.account_name }}
                            </h2>

                            <p class="nw-card-sub truncate text-xs">
                                {{ account.server }}
                            </p>
                        </div>

                        <span class="nw-status" :class="account.status === 'active' ? 'nw-status-active' : ''">
                            {{ account.status }}
                        </span>
                    </header>

                    <div class="flex flex-1 flex-col gap-2 p-4">
                        <div class="nw-row">
                            <span class="nw-muted text-xs font-semibold">Username</span>
                            <span class="nw-value truncate text-sm font-bold">
                                {{ account.username }}
                            </span>
                        </div>

                        <div class="nw-row">
                            <span class="nw-muted text-xs font-semibold">Assigned to</span>
                            <span class="nw-value truncate text-sm font-bold">
                                {{ account.assigned_user }}
                            </span>
                        </div>

                        <button type="button" class="nw-btn nw-btn-sky mt-3 w-full"
                            @click="$router.push(`/accounts/${account.id}`)">
                            View Account
                        </button>
                    </div>
                </article>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import accountApi from '@/api/accounts'
import useLoading from '@/composables/useLoading'

const { startLoading, stopLoading } = useLoading()

const accounts = ref([])
// The template uses `loading`, but it was never defined before.
const loading = ref(true)

const initial = (name) => (name ? name.trim().charAt(0).toUpperCase() : '?')

const fetchAccounts = async () => {
    try {
        loading.value = true
        startLoading()

        const response = await accountApi.getAccounts()

        accounts.value = response.data
    } catch (error) {
        console.error('Failed to fetch accounts:', error)
    } finally {
        loading.value = false
        stopLoading()
    }
}

onMounted(() => {
    fetchAccounts()
})
</script>