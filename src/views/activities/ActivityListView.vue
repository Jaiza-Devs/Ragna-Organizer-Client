<template>
    <div class="p-6">
        <div class="mx-auto max-w-6xl">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-slate-800">
                        Activities
                    </h1>

                    <p class="mt-1 text-sm text-slate-500">
                        Manage reusable daily, weekly, and instance activities.
                    </p>
                </div>

                <button type="button"
                    class="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                    @click="router.push('/activities/create')">
                    Add Activity
                </button>
            </div>

            <div v-if="activities.length === 0" class="mt-6 rounded-xl bg-white p-6 shadow-sm">
                <p class="text-sm text-slate-500">
                    No activities yet.
                </p>
            </div>

            <div v-else class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div v-for="activity in activities" :key="activity.id"
                    class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div class="flex items-start justify-between gap-4">
                        <div class="min-w-0">
                            <h2 class="truncate text-lg font-semibold text-slate-800">
                                {{ activity.name }}
                            </h2>

                            <p class="mt-1 text-sm capitalize text-slate-500">
                                {{ activity.type }}
                            </p>
                        </div>

                        <span class="rounded-full px-2.5 py-1 text-xs font-medium" :class="activity.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-500'">
                            {{ activity.status }}
                        </span>
                    </div>

                    <p class="mt-4 text-sm text-slate-600">
                        {{ activity.description || 'No description.' }}
                    </p>

                    <div class="mt-4 border-t border-slate-100 pt-4">
                        <p class="text-xs text-slate-400">
                            Reset
                        </p>

                        <p class="mt-1 text-sm font-medium capitalize text-slate-700">
                            {{ activity.reset_type }}
                        </p>
                    </div>

                    <button type="button"
                        class="mt-4 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        @click="router.push(`/activities/${activity.id}`)">
                        View Activity
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import activityApi from '@/api/activities'
import useLoading from '@/composables/useLoading'

const router = useRouter()
const { startLoading, stopLoading } = useLoading()

const activities = ref([])

const fetchActivities = async () => {
    try {
        startLoading()

        const response = await activityApi.getActivities()

        activities.value = response.data
    } catch (error) {
        console.error('Failed to fetch activities:', error)
    } finally {
        stopLoading()
    }
}

onMounted(() => {
    fetchActivities()
})
</script>