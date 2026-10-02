<template>
    <div>
        <div class="mb-6 flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-slate-900">
                    Currencies
                </h1>

                <p class="mt-1 text-sm text-slate-500">
                    Manage the currencies used by your characters.
                </p>
            </div>

            <button type="button"
                class="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                @click="router.push('/currencies/create')">
                Create Currency
            </button>
        </div>

        <div class="overflow-hidden rounded-xl bg-white shadow-sm">
            <div v-if="currencies.length === 0" class="px-6 py-12 text-center">
                <p class="text-sm text-slate-500">
                    No currencies found.
                </p>
            </div>

            <table v-else class="w-full text-left text-sm">
                <thead class="border-b border-slate-200 bg-slate-50">
                    <tr>
                        <th class="px-6 py-4 font-semibold text-slate-700">
                            Name
                        </th>

                        <th class="px-6 py-4 font-semibold text-slate-700">
                            Description
                        </th>

                        <th class="px-6 py-4 font-semibold text-slate-700">
                            Status
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="currency in currencies" :key="currency.id"
                        class="border-b border-slate-100 last:border-0">
                        <td class="px-6 py-4 font-medium text-slate-900">
                            {{ currency.name }}
                        </td>

                        <td class="px-6 py-4 text-slate-600">
                            {{ currency.description || '-' }}
                        </td>

                        <td class="px-6 py-4">
                            <span class="rounded-full px-3 py-1 text-xs font-medium" :class="currency.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-slate-100 text-slate-600'">
                                {{ currency.status }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
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

        currencies.value = response.data
    } finally {
        stopLoading()
    }
}

onMounted(() => {
    fetchCurrencies()
})
</script>