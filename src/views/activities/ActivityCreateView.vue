<template>
    <div class="nw-page">
        <div class="mx-auto max-w-xl">
            <div class="nw-card">
                <!-- Header -->
                <header class="nw-card-header flex items-center gap-3 px-5 py-4">
                    <div class="nw-avatar" aria-hidden="true">⚔️</div>

                    <div class="min-w-0 flex-1">
                        <h1 class="nw-card-title text-xl font-extrabold">
                            Add Activity
                        </h1>

                        <p class="nw-card-sub text-xs">
                            Create a reusable activity for your characters.
                        </p>
                    </div>

                    <button type="button" class="nw-btn nw-btn-light" @click="router.back()">
                        Back
                    </button>
                </header>

                <!-- Form -->
                <form class="space-y-4 p-5" @submit.prevent="submit">
                    <div>
                        <label for="name" class="nw-label">Activity Name</label>
                        <input id="name" v-model="form.name" type="text" placeholder="Daily Quest" class="nw-input"
                            required>
                    </div>

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label for="type" class="nw-label">Type</label>
                            <select id="type" v-model="form.type" class="nw-input nw-select" required>
                                <option value="" disabled>Select activity type</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="instance">Instance</option>
                            </select>
                        </div>

                        <div>
                            <label for="reset_type" class="nw-label">Reset Type</label>
                            <select id="reset_type" v-model="form.reset_type" class="nw-input nw-select" required>
                                <option value="" disabled>Select reset type</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="none">No Reset</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label for="target_count" class="nw-label">Target Count</label>
                            <input id="target_count" v-model.number="form.target_count" type="number" min="1"
                                placeholder="1" class="nw-input" required>
                        </div>

                        <div>
                            <label for="status" class="nw-label">Status</label>
                            <select id="status" v-model="form.status" class="nw-input nw-select">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label for="description" class="nw-label">Description</label>
                        <textarea id="description" v-model="form.description" rows="4"
                            placeholder="Complete the daily quest." class="nw-input"></textarea>
                    </div>

                    <button type="submit" class="nw-btn nw-btn-gold w-full py-3 text-base" :disabled="loading">
                        {{ loading ? 'Adding...' : 'Add Activity' }}
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import activityApi from '@/api/activities'
import useLoading from '@/composables/useLoading'

const router = useRouter()
const { startLoading, stopLoading } = useLoading()

const loading = ref(false)

const form = reactive({
    name: '',
    type: '',
    description: '',
    reset_type: '',
    target_count: 1,
    status: 'active'
})

const submit = async () => {
    try {
        loading.value = true
        startLoading()

        await activityApi.createActivity(form)

        router.push('/activities')
    } catch (error) {
        console.error('Failed to create activity:', error)
    } finally {
        loading.value = false
        stopLoading()
    }
}
</script>