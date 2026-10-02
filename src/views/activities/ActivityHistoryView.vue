<template>
    <div class="nw-page">
        <div class="mx-auto max-w-6xl">
            <!-- Page header -->
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 class="nw-heading text-2xl font-extrabold">
                        Activity History
                    </h1>

                    <p class="nw-muted mt-1 text-sm">
                        View this character's completed activities.
                    </p>
                </div>

                <button type="button" class="nw-btn nw-btn-ghost" @click="router.back()">
                    ← Back
                </button>
            </div>

            <section class="nw-card mt-6">
                <header class="nw-card-header flex items-center justify-between gap-3 px-5 py-4">
                    <h2 class="nw-card-title text-lg">
                        Completed activities
                    </h2>

                    <span class="nw-status before:hidden">
                        {{ completions.length }} {{ completions.length === 1 ? 'entry' : 'entries' }}
                    </span>
                </header>

                <!-- Empty -->
                <div v-if="completions.length === 0" class="p-5">
                    <div class="nw-empty">
                        No activity history found.
                    </div>
                </div>

                <!-- Table -->
                <div v-else class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-nw-sky-light">
                            <tr class="text-xs font-extrabold text-nw-navy">
                                <th class="px-5 py-3">Activity</th>
                                <th class="px-5 py-3">Type</th>
                                <th class="px-5 py-3">Completed at</th>
                                <th class="px-5 py-3">Notes</th>
                            </tr>
                        </thead>

                        <tbody class="divide-y divide-nw-line">
                            <tr v-for="completion in completions" :key="completion.id"
                                class="bg-white transition-colors even:bg-nw-cream hover:bg-nw-sky-light/60">
                                <td class="nw-value px-5 py-3.5 text-sm font-bold">
                                    {{ getActivityName(completion.activity_id) }}
                                </td>

                                <td class="px-5 py-3.5">
                                    <span
                                        class="rounded-full bg-nw-sky-light px-2.5 py-0.5 text-xs font-bold capitalize text-nw-navy">
                                        {{ getActivityType(completion.activity_id) }}
                                    </span>
                                </td>

                                <td class="nw-value whitespace-nowrap px-5 py-3.5 text-sm">
                                    {{ formatDate(completion.completed_at) }}
                                </td>

                                <td class="nw-muted px-5 py-3.5 text-sm">
                                    {{ completion.notes || 'No notes.' }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
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
    return new Date(date).toLocaleString([], {
        dateStyle: 'medium',
        timeStyle: 'short'
    })
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