<template>
    <div class="nw-page">
        <div class="mx-auto max-w-6xl">
            <!-- Page header -->
            <div class="flex items-center justify-between gap-3">
                <div class="min-w-0">
                    <div class="flex items-center gap-2">
                        <h1 class="nw-heading text-xl font-extrabold sm:text-2xl">Accounts</h1>
                        <span v-if="!loading && accounts.length" class="nw-status">{{ accounts.length }}</span>
                    </div>

                    <p class="nw-muted text-xs sm:text-sm">Manage your Ragna accounts.</p>
                </div>

                <button type="button" class="nw-btn nw-btn-gold shrink-0 text-sm"
                    @click="$router.push('/accounts/create')">
                    <span class="text-base leading-none" aria-hidden="true">+</span>
                    Add Account
                </button>
            </div>

            <div class="mt-5">
                <!-- Loading -->
                <div v-if="loading" class="nw-card px-4 py-3 text-sm nw-muted">
                    Loading accounts...
                </div>

                <!-- Empty -->
                <div v-else-if="accounts.length === 0"
                    class="nw-card flex flex-col items-center px-6 py-12 text-center">
                    <div class="nw-avatar nw-avatar-lg" aria-hidden="true">👤</div>
                    <h2 class="nw-heading mt-3 text-lg font-bold">No accounts yet</h2>
                    <p class="nw-muted mt-1 text-sm">Add your first Ragna account to start tracking it.</p>
                    <button type="button" class="nw-btn nw-btn-gold mt-5" @click="$router.push('/accounts/create')">
                        Add Account
                    </button>
                </div>

                <template v-else>
                    <!-- Toolbar: search + status filter -->
                    <div class="mb-3 flex flex-wrap items-center gap-2">
                        <input v-model="search" type="search" class="nw-input min-w-0 flex-1 sm:max-w-xs"
                            placeholder="Search accounts..." aria-label="Search accounts">

                        <div class="flex items-center gap-1" role="group" aria-label="Filter by status">
                            <button v-for="option in statusOptions" :key="option.value" type="button"
                                class="nw-btn nw-btn-ghost text-sm"
                                :class="statusFilter === option.value ? 'border-nw-sky bg-nw-sky-light font-bold' : ''"
                                :aria-pressed="statusFilter === option.value" @click="statusFilter = option.value">
                                {{ option.label }}
                            </button>
                        </div>
                    </div>

                    <!-- No matches -->
                    <div v-if="filteredAccounts.length === 0" class="nw-card px-4 py-8 text-center">
                        <p class="nw-heading font-bold">No matching accounts</p>
                        <p class="nw-muted mt-1 text-sm">Try a different search or status filter.</p>
                    </div>

                    <!-- Account cards -->
                    <div v-else class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        <RouterLink v-for="account in filteredAccounts" :key="account.id"
                            :to="`/accounts/${account.id}`"
                            class="nw-card nw-card-hover group flex flex-col gap-3 p-3 no-underline transition duration-150 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                            <!-- Identity + status -->
                            <div class="flex items-center gap-3">
                                <div class="nw-avatar shrink-0" aria-hidden="true">
                                    {{ initial(account.account_name) }}
                                </div>

                                <div class="min-w-0 flex-1">
                                    <h2 class="nw-heading truncate text-sm font-bold leading-tight">
                                        {{ account.account_name }}
                                    </h2>
                                    <p class="nw-muted truncate text-xs">
                                        {{ account.server }}
                                    </p>
                                </div>

                                <span class="nw-status shrink-0"
                                    :class="account.status === 'active' ? 'nw-status-active' : ''">
                                    {{ account.status }}
                                </span>
                            </div>

                            <!-- Details strip -->
                            <div
                                class="grid grid-cols-2 divide-x divide-nw-line-strong rounded-lg bg-nw-sky-light/50 py-1.5">
                                <div class="min-w-0 px-3">
                                    <p class="nw-muted text-[10px] font-semibold uppercase tracking-wide">Username</p>
                                    <p class="nw-value truncate text-sm font-bold" :title="account.username">
                                        {{ account.username }}
                                    </p>
                                </div>

                                <div class="min-w-0 px-3">
                                    <p class="nw-muted text-[10px] font-semibold uppercase tracking-wide">Assigned to
                                    </p>
                                    <p class="nw-value truncate text-sm font-bold">
                                        {{ account.assigned_user || '—' }}
                                    </p>
                                </div>
                            </div>

                            <!-- Footer -->
                            <div class="flex justify-end text-xs">
                                <span class="nw-value font-semibold transition-transform group-hover:translate-x-0.5"
                                    aria-hidden="true">
                                    View account →
                                </span>
                            </div>
                        </RouterLink>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import accountApi from '@/api/accounts'
import useLoading from '@/composables/useLoading'

const { startLoading, stopLoading } = useLoading()

const accounts = ref([])
const loading = ref(true)

const search = ref('')
const statusFilter = ref('all')

const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
]

const initial = (name) => (name ? name.trim().charAt(0).toUpperCase() : '?')

// Client-side search (name, server, username, assigned user) + status filter
const filteredAccounts = computed(() => {
    const query = search.value.trim().toLowerCase()

    return accounts.value.filter((account) => {
        if (statusFilter.value !== 'all' && account.status !== statusFilter.value) {
            return false
        }

        if (!query) {
            return true
        }

        return [
            account.account_name,
            account.server,
            account.username,
            account.assigned_user
        ].some((value) => String(value ?? '').toLowerCase().includes(query))
    })
})

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