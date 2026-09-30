```vue
<template>
    <div class="p-6">
        <div class="mx-auto max-w-xl">
            <div class="rounded-xl bg-white p-6 shadow-sm">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-800">
                            Add Activity
                        </h1>

                        <p class="mt-1 text-sm text-slate-500">
                            Create a reusable activity for your characters.
                        </p>
                    </div>

                    <button type="button" class="text-sm text-slate-500 hover:text-slate-800" @click="router.back()">
                        Back
                    </button>
                </div>

                <form class="mt-6 space-y-4" @submit.prevent="submit">
                    <div>
                        <label class="block text-sm font-medium text-slate-700">
                            Activity Name
                        </label>

                        <input v-model="form.name" type="text" placeholder="Daily Quest"
                            class="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500"
                            required>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700">
                            Type
                        </label>

                        <select v-model="form.type"
                            class="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500"
                            required>
                            <option value="" disabled>
                                Select activity type
                            </option>

                            <option value="daily">
                                Daily
                            </option>

                            <option value="weekly">
                                Weekly
                            </option>

                            <option value="instance">
                                Instance
                            </option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700">
                            Reset Type
                        </label>

                        <select v-model="form.reset_type"
                            class="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500"
                            required>
                            <option value="" disabled>
                                Select reset type
                            </option>

                            <option value="daily">
                                Daily
                            </option>

                            <option value="weekly">
                                Weekly
                            </option>

                            <option value="none">
                                No Reset
                            </option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700">
                            Target Count
                        </label>

                        <input v-model.number="form.target_count" type="number" min="1" placeholder="1"
                            class="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500"
                            required>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700">
                            Description
                        </label>

                        <textarea v-model="form.description" rows="4" placeholder="Complete the daily quest."
                            class="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500"></textarea>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700">
                            Status
                        </label>

                        <select v-model="form.status"
                            class="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500">
                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>
                        </select>
                    </div>

                    <button type="submit"
                        class="w-full rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        :disabled="loading">
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
```
