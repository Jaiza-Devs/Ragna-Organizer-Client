<template>
    <div class="p-6">
        <div class="mx-auto max-w-6xl">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-slate-800">
                        Currencies
                    </h1>

                    <p class="mt-1 text-sm text-slate-500">
                        Manage currencies used by your characters.
                    </p>
                </div>

                <button type="button"
                    class="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 sm:w-auto"
                    @click="router.push('/currencies/create')">
                    Add Currency
                </button>
            </div>

            <div v-if="currencies.length === 0" class="mt-6 rounded-xl bg-white p-6 shadow-sm">
                <p class="text-sm text-slate-500">
                    No currencies yet.
                </p>
            </div>

            <div v-else class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div v-for="currency in currencies" :key="currency.id"
                    class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div class="flex items-start justify-between gap-4">
                        <div class="min-w-0">
                            <h2 class="truncate text-lg font-semibold text-slate-800">
                                {{ currency.name }}
                            </h2>

                            <p class="mt-1 text-sm text-slate-500">
                                Currency
                            </p>
                        </div>

                        <span class="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium" :class="currency.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-500'">
                            {{ currency.status }}
                        </span>
                    </div>

                    <p class="mt-4 text-sm text-slate-600">
                        {{ currency.description || 'No description.' }}
                    </p>

                    <div class="mt-4 border-t border-slate-100 pt-4">
                        <p class="text-xs text-slate-400">
                            Currency ID
                        </p>

                        <p class="mt-1 text-sm font-medium text-slate-700">
                            #{{ currency.id }}
                        </p>
                    </div>

                    <button type="button"
                        class="mt-4 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        @click="router.push(`/currencies/${currency.id}`)">
                        View Currency
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import currencyApi from '@/api/currencies'
import useLoading from '@/composables/useLoading'

const router = useRouter()
const { startLoading, stopLoading } = useLoading()

const currencies = ref([])

const fetchCurrencies = async () => {
    try {
        startLoading()

        const response = await currencyApi.getCurrencies()

        currencies.value = Array.isArray(response.data)
            ? response.data
            : []
    } catch (error) {
        console.error('Failed to fetch currencies:', error)
    } finally {
        stopLoading()
    }
}

onMounted(() => {
    fetchCurrencies()
})
</script>