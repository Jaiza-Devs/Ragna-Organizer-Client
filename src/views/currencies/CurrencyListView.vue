<template>
    <div class="nw-page">
        <div class="mx-auto max-w-6xl">
            <!-- Page header -->
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="nw-heading text-2xl font-extrabold">
                        Currencies
                    </h1>

                    <p class="nw-muted mt-1 text-sm">
                        Manage currencies used by your characters.
                    </p>
                </div>

                <button type="button" class="nw-btn nw-btn-gold w-full sm:w-auto"
                    @click="router.push('/currencies/create')">
                    <span class="text-base leading-none" aria-hidden="true">+</span>
                    Add Currency
                </button>
            </div>

            <!-- Empty -->
            <div v-if="currencies.length === 0" class="nw-card mt-6 flex flex-col items-center px-6 py-12 text-center">
                <div class="nw-avatar nw-avatar-lg" aria-hidden="true">🪙</div>
                <h2 class="nw-heading mt-4 text-lg font-bold">No currencies yet</h2>
                <p class="nw-muted mt-1 text-sm">Add a currency like Zeny to start tracking your characters' funds.</p>
                <button type="button" class="nw-btn nw-btn-gold mt-5" @click="router.push('/currencies/create')">
                    Add Currency
                </button>
            </div>

            <!-- Currency cards -->
            <div v-else class="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                <article v-for="currency in currencies" :key="currency.id" class="nw-card nw-card-hover flex flex-col">
                    <header class="nw-card-header flex items-center gap-3 px-4 py-3">
                        <div class="nw-avatar" aria-hidden="true">🪙</div>

                        <div class="min-w-0 flex-1">
                            <h2 class="nw-card-title truncate text-base">
                                {{ currency.name }}
                            </h2>

                            <p class="nw-card-sub text-xs">
                                Currency
                            </p>
                        </div>

                        <span class="nw-status" :class="currency.status === 'active' ? 'nw-status-active' : ''">
                            {{ currency.status }}
                        </span>
                    </header>

                    <div class="flex flex-1 flex-col gap-3 p-4">
                        <p class="nw-value flex-1 text-sm">
                            {{ currency.description || 'No description.' }}
                        </p>

                        <div class="nw-row">
                            <span class="nw-muted text-xs font-semibold">Currency ID</span>
                            <span class="nw-value text-sm font-bold">#{{ currency.id }}</span>
                        </div>
                    </div>
                </article>
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