<template>
    <div class="p-6">
        <div class="mx-auto max-w-6xl">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-slate-800">
                        Activity History
                    </h1>

                    <p class="mt-1 text-sm text-slate-500">
                        View this character's completed activities.
                    </p>
                </div>

                <button type="button" class="text-sm text-slate-500 hover:text-slate-800" @click="router.back()">
                    Back
                </button>
            </div>

            <div class="mt-6 rounded-xl bg-white shadow-sm">
                <div v-if="completions.length === 0" class="p-6 text-center">
                    <p class="text-sm text-slate-500">
                        No activity history found.
                    </p>
                </div>

                <div v-else class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="border-b border-slate-200">
                            <tr>
                                <th class="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Activity
                                </th>

                                <th class="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Type
                                </th>

                                <th class="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Completed At
                                </th>

                                <th class="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Notes
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="completion in completions" :key="completion.id"
                                class="border-b border-slate-100 last:border-0">
                                <td class="px-6 py-4 font-medium text-slate-800">
                                    {{ getActivityName(completion.activity_id) }}
                                </td>

                                <td class="px-6 py-4 text-sm text-slate-500">
                                    {{ getActivityType(completion.activity_id) }}
                                </td>

                                <td class="px-6 py-4 text-sm text-slate-500">
                                    {{ formatDate(completion.completed_at) }}
                                </td>

                                <td class="px-6 py-4 text-sm text-slate-500">
                                    {{ completion.notes || 'No notes.' }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import activityApi from '@/api/activities'
import activityCompletionApi from '@/api/activityCompletions'
import useLoading from '@/composables/useLoading'

const route = useRoute()
const router = useRouter()

const { startLoading, stopLoading } = useLoading()

const activities = ref([])
const completions = ref([])

const fetchActivities = async () => {
    const response = await activityApi.getActivities()

    activities.value = response.data
}

const fetchCompletions = async () => {
    const response = await activityCompletionApi.getActivityCompletions()

    completions.value = response.data
        .filter(
            (completion) =>
                String(completion.character_id) ===
                String(route.params.characterId)
        )
        .sort(
            (a, b) =>
                new Date(b.completed_at) - new Date(a.completed_at)
        )
}

const getActivityName = (activityId) => {
    const activity = activities.value.find(
        (item) => String(item.id) === String(activityId)
    )

    return activity?.name || 'Unknown Activity'
}

const getActivityType = (activityId) => {
    const activity = activities.value.find(
        (item) => String(item.id) === String(activityId)
    )

    return activity?.type || '-'
}

const formatDate = (date) => {
    return new Date(date).toLocaleString()
}

const fetchData = async () => {
    try {
        startLoading()

        await Promise.all([
            fetchActivities(),
            fetchCompletions()
        ])
    } catch (error) {
        console.error('Failed to fetch activity history:', error)
    } finally {
        stopLoading()
    }
}

onMounted(() => {
    fetchData()
})
</script>