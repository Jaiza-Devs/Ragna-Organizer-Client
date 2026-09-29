<template>
    <div class="p-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-slate-800">
                    Accounts
                </h1>

                <p class="mt-1 text-sm text-slate-500">
                    Manage your Ragna accounts.
                </p>
            </div>

            <button type="button"
                class="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                @click="$router.push('/accounts/create')">
                Add Account
            </button>
        </div>

        <div class="mt-6">
            <div v-if="loading" class="text-sm text-slate-500">
                Loading accounts...
            </div>

            <div v-else-if="accounts.length === 0" class="rounded-xl bg-white p-6 shadow-sm">
                <p class="text-sm text-slate-500">
                    No accounts yet.
                </p>
            </div>

            <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div v-for="account in accounts" :key="account.id"
                    class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
                    <div class="flex items-start justify-between gap-4">
                        <div class="min-w-0">
                            <h2 class="truncate text-lg font-semibold text-slate-800">
                                {{ account.account_name }}
                            </h2>

                            <p class="mt-1 text-sm text-slate-500">
                                {{ account.server }}
                            </p>
                        </div>

                        <span class="rounded-full px-2.5 py-1 text-xs font-medium" :class="account.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-500'">
                            {{ account.status }}
                        </span>
                    </div>

                    <div class="mt-5 space-y-2 border-t border-slate-100 pt-4">
                        <div class="flex justify-between gap-4 text-sm">
                            <span class="text-slate-400">
                                Username
                            </span>

                            <span class="truncate font-medium text-slate-700">
                                {{ account.username }}
                            </span>
                        </div>

                        <div class="flex justify-between gap-4 text-sm">
                            <span class="text-slate-400">
                                Assigned to
                            </span>

                            <span class="truncate font-medium text-slate-700">
                                {{ account.assigned_user }}
                            </span>
                        </div>
                    </div>

                    <button type="button"
                        class="mt-5 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        @click="$router.push(`/accounts/${account.id}`)">
                        View Account
                    </button>
                </div>
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

const fetchAccounts = async () => {
    try {
        startLoading()

        const response = await accountApi.getAccounts()

        accounts.value = response.data
    } catch (error) {
        console.error('Failed to fetch accounts:', error)
    } finally {
        stopLoading()
    }
}

onMounted(() => {
    fetchAccounts()
})
</script>