<template>
    <div class="nw-page">
        <div class="mx-auto max-w-xl">
            <div class="nw-card">
                <!-- Header -->
                <header class="nw-card-header flex items-center gap-3 px-5 py-4">
                    <div class="nw-avatar" aria-hidden="true">🪙</div>

                    <div class="min-w-0 flex-1">
                        <h1 class="nw-card-title text-xl font-extrabold">
                            Create Currency
                        </h1>

                        <p class="nw-card-sub text-xs">
                            Add a currency that can be tracked by your characters.
                        </p>
                    </div>
                </header>

                <!-- Form -->
                <form class="space-y-4 p-5" @submit.prevent="handleSubmit">
                    <div>
                        <label for="name" class="nw-label">Currency Name</label>
                        <input id="name" v-model="form.name" type="text" required class="nw-input"
                            placeholder="e.g. Zeny" />
                    </div>

                    <div>
                        <label for="description" class="nw-label">Description</label>
                        <textarea id="description" v-model="form.description" rows="4" class="nw-input"
                            placeholder="Describe this currency..."></textarea>
                    </div>

                    <div>
                        <label for="status" class="nw-label">Status</label>
                        <select id="status" v-model="form.status" class="nw-input nw-select">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div class="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                        <button type="button" class="nw-btn nw-btn-ghost w-full py-2.5 sm:w-auto" @click="handleCancel">
                            Cancel
                        </button>

                        <button type="submit" class="nw-btn nw-btn-gold w-full py-2.5 sm:w-auto">
                            Create Currency
                        </button>
                    </div>
                </form>
            </div>
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