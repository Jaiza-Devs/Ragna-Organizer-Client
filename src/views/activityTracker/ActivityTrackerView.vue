<template>
    <div class="nw-page">
        <div class="mx-auto max-w-6xl">
            <!-- Page header -->
            <div class="flex items-center justify-between gap-3">
                <div class="min-w-0">
                    <h1 class="nw-heading text-xl font-extrabold sm:text-2xl">
                        Activity Tracker
                    </h1>

                    <p class="nw-muted text-xs sm:text-sm">
                        Track activity completion across all characters.
                    </p>
                </div>
            </div>

            <!-- Overall progress -->
            <section v-if="!loading && activities.length > 0" class="nw-card mt-5 px-4 py-3">
                <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                    <div class="min-w-0 flex-1 basis-56">
                        <div class="flex items-baseline justify-between gap-3">
                            <p class="nw-heading text-sm font-extrabold">Overall progress</p>
                            <p class="nw-value text-xs font-bold tabular-nums">
                                {{ overall.done }} / {{ overall.total }} · {{ overall.percent }}%
                            </p>
                        </div>

                        <div class="mt-1.5 h-2.5 overflow-hidden rounded-full bg-nw-sky-light">
                            <div class="h-full rounded-full transition-[width] duration-500"
                                :class="overall.percent === 100 ? 'bg-nw-green' : 'bg-nw-grad-gold'"
                                :style="{ width: overall.percent + '%' }"></div>
                        </div>
                    </div>

                    <div class="flex gap-2">
                        <button type="button" class="nw-btn nw-btn-ghost px-3 py-1 text-[0.8125rem]" @click="expandAll">
                            Expand all
                        </button>

                        <button type="button" class="nw-btn nw-btn-ghost px-3 py-1 text-[0.8125rem]"
                            @click="collapseAll">
                            Collapse all
                        </button>
                    </div>
                </div>
            </section>

            <div class="mt-5">
                <!-- Loading -->
                <div v-if="loading" class="nw-card px-4 py-3 text-sm nw-muted">
                    Loading activities...
                </div>

                <!-- Empty -->
                <div v-else-if="activities.length === 0"
                    class="nw-card flex flex-col items-center px-4 py-10 text-center">
                    <div class="nw-avatar nw-avatar-lg" aria-hidden="true">⚔️</div>
                    <p class="nw-heading mt-4 font-bold">No active activities</p>
                    <p class="nw-muted mt-1 text-sm">
                        Add an activity to start tracking completions.
                    </p>
                </div>

                <!-- Activities -->
                <div v-else class="space-y-4">
                    <section v-for="activity in activities" :key="activity.activity_id" class="nw-card">
                        <!-- Activity header -->
                        <button type="button"
                            class="nw-card-header block w-full px-4 py-3 text-left focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
                            :aria-expanded="expandedActivities.has(activity.activity_id)"
                            @click="toggleActivity(activity.activity_id)">
                            <div class="flex items-center justify-between gap-3">
                                <div class="min-w-0">
                                    <h2 class="nw-card-title truncate text-base">
                                        {{ activity.activity_name }}
                                    </h2>

                                    <p class="nw-card-sub text-xs">
                                        <span class="capitalize">{{ activity.type }}</span>
                                        ·
                                        {{ activity.target_count }}
                                        instance{{ activity.target_count === 1 ? '' : 's' }}
                                    </p>
                                </div>

                                <div class="flex shrink-0 items-center gap-3">
                                    <span class="nw-status tabular-nums"
                                        :class="isAllComplete(activity) ? 'nw-status-active' : ''">
                                        {{ activity.completed_count }}
                                        /
                                        {{ activity.total_characters }}
                                        complete
                                    </span>

                                    <span class="text-xs text-white transition-transform duration-200"
                                        :class="{ 'rotate-180': expandedActivities.has(activity.activity_id) }"
                                        aria-hidden="true">
                                        ▼
                                    </span>
                                </div>
                            </div>

                            <!-- Progress bar -->
                            <div class="mt-2.5 h-2 overflow-hidden rounded-full bg-white/30">
                                <div class="h-full rounded-full transition-[width] duration-500"
                                    :class="isAllComplete(activity) ? 'bg-nw-green' : 'bg-nw-grad-gold'"
                                    :style="{ width: percent(activity.completed_count, activity.total_characters) + '%' }">
                                </div>
                            </div>
                        </button>

                        <!-- Characters -->
                        <div v-if="expandedActivities.has(activity.activity_id)" class="divide-y divide-nw-line">
                            <div v-for="character in activity.characters" :key="character.character_id"
                                class="flex flex-wrap items-center gap-3 px-4 py-3 transition-colors hover:bg-nw-sky-light/40">
                                <div class="nw-avatar nw-avatar-sky h-9 w-9 text-sm" aria-hidden="true">
                                    {{ initial(character.character_name) }}
                                </div>

                                <div class="min-w-0 flex-1 basis-40">
                                    <p class="nw-heading truncate text-sm font-bold">
                                        {{ character.character_name }}
                                    </p>

                                    <p class="nw-muted truncate text-xs">
                                        {{ character.account_name }}
                                    </p>
                                </div>

                                <div class="ml-auto flex shrink-0 items-center gap-3">
                                    <!-- Stepper -->
                                    <div
                                        class="flex items-center gap-1 rounded-full border border-nw-line-strong bg-white p-1">
                                        <button type="button" :class="stepBtn" aria-label="Remove one completion"
                                            :disabled="updatingCharacter === character.character_id || !character.current_count"
                                            @click.stop="removeCompletion(activity, character)">
                                            −
                                        </button>

                                        <span
                                            class="nw-heading min-w-14 text-center text-base font-extrabold tabular-nums">
                                            {{ character.current_count }}
                                            /
                                            {{ character.target_count }}
                                        </span>

                                        <button type="button" :class="stepBtn" aria-label="Add one completion"
                                            :disabled="updatingCharacter === character.character_id ||
                                                character.completed
                                                " @click.stop="addCompletion(activity, character)">
                                            +
                                        </button>
                                    </div>

                                    <span class="nw-progress w-24 text-center" :class="statusOf(character).class">
                                        {{ statusOf(character).label }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

import activityTrackerApi from '@/api/activityTracker'
import activityCompletionApi from '@/api/activityCompletions'
import useLoading from '@/composables/useLoading'

const { startLoading, stopLoading } = useLoading()

const activities = ref([])
const loading = ref(true)
const updatingCharacter = ref(null)
const expandedActivities = ref(new Set())

// Big round tap target (40px) for the + / - buttons
const stepBtn =
    'grid h-10 w-10 shrink-0 place-items-center rounded-full bg-nw-sky-light text-2xl font-extrabold leading-none text-nw-navy transition hover:bg-nw-sky hover:text-white active:scale-90 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nw-gold'

const initial = (name) => {
    return name?.charAt(0)?.toUpperCase() || '?'
}

const percent = (done, total) => {
    return total ? Math.round((done / total) * 100) : 0
}

const isAllComplete = (activity) => {
    return activity.total_characters > 0 &&
        activity.completed_count >= activity.total_characters
}

const statusOf = (character) => {
    if (character.completed) {
        return { label: 'Complete', class: 'nw-progress-done' }
    }

    if (character.current_count > 0) {
        return { label: 'In progress', class: 'nw-progress-partial' }
    }

    return { label: 'Pending', class: '' }
}

// Sum across every activity / character pair
const overall = computed(() => {
    const done = activities.value.reduce((sum, activity) => sum + activity.completed_count, 0)
    const total = activities.value.reduce((sum, activity) => sum + activity.total_characters, 0)

    return { done, total, percent: percent(done, total) }
})

const toggleActivity = (activityId) => {
    const expanded = new Set(expandedActivities.value)

    if (expanded.has(activityId)) {
        expanded.delete(activityId)
    } else {
        expanded.add(activityId)
    }

    expandedActivities.value = expanded
}

const expandAll = () => {
    expandedActivities.value = new Set(
        activities.value.map((activity) => activity.activity_id)
    )
}

const collapseAll = () => {
    expandedActivities.value = new Set()
}

// silent = refresh the data without the "Loading..." state, so the list
// doesn't flash and the buttons don't move under the cursor
const fetchActivityTracker = async ({ silent = false } = {}) => {
    try {
        if (!silent) {
            loading.value = true
            startLoading()
        }

        const response = await activityTrackerApi.getActivityTracker()

        activities.value = response.data
    } catch (error) {
        console.error('Failed to fetch activity tracker:', error)
    } finally {
        if (!silent) {
            loading.value = false
            stopLoading()
        }
    }
}

const addCompletion = async (activity, character) => {
    if (character.completed || updatingCharacter.value === character.character_id) {
        return
    }

    updatingCharacter.value = character.character_id

    // Update the numbers right away so the click feels instant
    character.current_count += 1

    if (character.current_count >= character.target_count) {
        character.completed = true
        activity.completed_count += 1
    }

    try {
        await activityCompletionApi.createActivityCompletion({
            activity_id: activity.activity_id,
            character_id: character.character_id,
            completed_at: new Date().toISOString()
        })
    } catch (error) {
        console.error('Failed to add activity completion:', error)
    } finally {
        // Sync with the server (also rolls back the optimistic change on failure)
        await fetchActivityTracker({ silent: true })
        updatingCharacter.value = null
    }
}

const removeCompletion = async (activity, character) => {
    if (!character.completion_ids.length || updatingCharacter.value === character.character_id) {
        return
    }

    updatingCharacter.value = character.character_id

    const completionId = character.completion_ids[
        character.completion_ids.length - 1
    ]

    character.current_count -= 1

    if (character.completed && character.current_count < character.target_count) {
        character.completed = false
        activity.completed_count -= 1
    }

    try {
        await activityCompletionApi.deleteActivityCompletion(
            completionId
        )
    } catch (error) {
        console.error('Failed to remove activity completion:', error)
    } finally {
        await fetchActivityTracker({ silent: true })
        updatingCharacter.value = null
    }
}

onMounted(() => {
    fetchActivityTracker()
})
</script>