<template>
    <div class="mx-auto max-w-3xl">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-slate-900">
                Create Currency
            </h1>

            <p class="mt-1 text-sm text-slate-500">
                Add a currency that can be tracked by your characters.
            </p>
        </div>

        <div class="rounded-xl bg-white p-6 shadow-sm">
            <form @submit.prevent="handleSubmit">
                <div class="space-y-5">
                    <div>
                        <label class="mb-2 block text-sm font-medium text-slate-700">
                            Currency Name
                        </label>

                        <input v-model="form.name" type="text" required
                            class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                            placeholder="e.g. Zeny" />
                    </div>

                    <div>
                        <label class="mb-2 block text-sm font-medium text-slate-700">
                            Description
                        </label>

                        <textarea v-model="form.description" rows="4"
                            class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                            placeholder="Describe this currency..."></textarea>
                    </div>

                    <div>
                        <label class="mb-2 block text-sm font-medium text-slate-700">
                            Status
                        </label>

                        <select v-model="form.status"
                            class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500">
                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>
                        </select>
                    </div>
                </div>

                <div class="mt-6 flex justify-end gap-3">
                    <button type="button"
                        class="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        @click="handleCancel">
                        Cancel
                    </button>

                    <button type="submit"
                        class="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800">
                        Create Currency
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

import currencyApi from '@/api/currencies'
import useLoading from '@/composables/useLoading'

const router = useRouter()
const { startLoading, stopLoading } = useLoading()

const form = reactive({
    name: '',
    description: '',
    status: 'active'
})

const handleSubmit = async () => {
    try {
        startLoading()

        await currencyApi.createCurrency({
            name: form.name,
            description: form.description,
            status: form.status
        })

        router.push('/currencies')
    } finally {
        stopLoading()
    }
}

const handleCancel = () => {
    router.push('/currencies')
}
</script>