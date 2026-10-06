<template>
    <div class="nw-page p-3 sm:p-6 lg:p-8">
        <div class="mx-auto max-w-7xl">
            <!-- Page header -->
            <div class="min-w-0">
                <h1 class="nw-heading text-xl font-extrabold sm:text-2xl">
                    Activity Tracker
                </h1>

                <p class="nw-muted text-xs sm:text-sm">
                    Track activity completion across all characters.
                </p>
            </div>

            <!-- Toolbar: overall progress + filters (sticky on large screens only) -->
            <section v-if="!loading && activities.length > 0" class="nw-card mt-4 px-4 py-3 lg:sticky lg:top-3 lg:z-10">
                <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
                    <div class="min-w-0 lg:flex-1">
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

                    <div class="flex flex-wrap items-center gap-2">
                        <!-- Reset type filter -->
                        <div class="inline-flex rounded-full border border-nw-line-strong bg-white p-0.5" role="group"
                            aria-label="Filter by reset type">
                            <button v-for="tab in tabs" :key="tab.key" type="button" :aria-pressed="filter === tab.key"
                                class="rounded-full px-3 py-1 text-[0.8125rem] font-bold capitalize transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nw-gold"
                                :class="filter === tab.key
                                    ? 'bg-nw-grad-gold text-white'
                                    : 'text-nw-text hover:bg-nw-sky-light'" @click="filter = tab.key">
                                {{ tab.key }}
                            </button>
                        </div>

                        <button type="button" class="nw-btn nw-btn-ghost px-3 py-1 text-[0.8125rem]"
                            :class="hideDone ? 'bg-nw-sky-light' : ''" :aria-pressed="hideDone"
                            @click="hideDone = !hideDone">
                            {{ hideDone ? '✓ ' : '' }}Hide done
                        </button>

                        <button type="button" class="nw-btn nw-btn-ghost px-3 py-1 text-[0.8125rem]"
                            @click="allExpanded ? collapseAll() : expandAll()">
                            {{ allExpanded ? 'Collapse all' : 'Expand all' }}
                        </button>
                    </div>
                </div>
            </section>

            <div class="mt-2">
                <!-- Loading -->
                <div v-if="loading" class="nw-card mt-4 px-4 py-3 text-sm nw-muted">
                    Loading activities...
                </div>

                <!-- Empty -->
                <div v-else-if="activities.length === 0"
                    class="nw-card mt-4 flex flex-col items-center px-4 py-10 text-center">
                    <div class="nw-avatar nw-avatar-lg" aria-hidden="true">⚔️</div>
                    <p class="nw-heading mt-4 font-bold">No active activities</p>
                    <p class="nw-muted mt-1 text-sm">
                        Add an activity to start tracking completions.
                    </p>
                </div>

                <!-- Groups (Daily / Weekly / ...) -->
                <template v-else>
                    <section v-for="group in groups" :key="group.key" class="mt-5">
                        <div class="mb-2 flex items-center gap-3">
                            <h2 class="nw-heading text-sm font-extrabold capitalize">{{ group.key }}</h2>
                            <span class="nw-count tabular-nums">{{ group.done }} / {{ group.total }}</span>

                            <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-nw-line">
                                <div class="h-full rounded-full transition-[width] duration-500"
                                    :class="group.done === group.total ? 'bg-nw-green' : 'bg-nw-grad-gold'"
                                    :style="{ width: percent(group.done, group.total) + '%' }"></div>
                            </div>
                        </div>

                        <p v-if="group.items.length === 0" class="nw-empty">
                            All {{ group.key }} activities are done.
                        </p>

                        <!-- items-start so expanding one card doesn't stretch its neighbours -->
                        <div v-else class="grid items-start gap-3 md:grid-cols-2 xl:grid-cols-3">
                            <article v-for="activity in group.items" :key="activity.activity_id" class="nw-card">
                                <!-- Activity header -->
                                <button type="button"
                                    class="block w-full px-4 py-3 text-left transition-colors hover:bg-nw-sky-light/40 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-nw-gold"
                                    :aria-expanded="expandedActivities.has(activity.activity_id)"
                                    @click="toggleActivity(activity.activity_id)">
                                    <div class="flex items-center justify-between gap-3">
                                        <h3 class="nw-heading min-w-0 truncate text-sm font-extrabold sm:text-base">
                                            {{ activity.activity_name }}
                                            <span v-if="activity.target_count > 1" class="nw-muted font-bold">
                                                ×{{ activity.target_count }}
                                            </span>
                                        </h3>

                                        <div class="flex shrink-0 items-center gap-2">
                                            <span class="nw-status tabular-nums"
                                                :class="isAllComplete(activity) ? 'nw-status-active' : ''">
                                                {{ activity.completed_count }}/{{ activity.total_characters }}
                                            </span>

                                            <span class="nw-muted text-[0.625rem] transition-transform duration-200"
                                                :class="{ 'rotate-180': expandedActivities.has(activity.activity_id) }"
                                                aria-hidden="true">
                                                ▼
                                            </span>
                                        </div>
                                    </div>

                                    <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-nw-sky-light">
                                        <div class="h-full rounded-full transition-[width] duration-500"
                                            :class="isAllComplete(activity) ? 'bg-nw-green' : 'bg-nw-grad-gold'"
                                            :style="{ width: percent(activity.completed_count, activity.total_characters) + '%' }">
                                        </div>
                                    </div>
                                </button>

                                <!-- Characters -->
                                <div v-if="expandedActivities.has(activity.activity_id)"
                                    class="divide-y divide-nw-line border-t border-nw-line">
                                    <div v-for="character in activity.characters" :key="character.character_id"
                                        class="flex items-center gap-3 px-4 py-2.5 transition-colors"
                                        :class="character.completed ? 'bg-[#eaf8f0]/70' : 'hover:bg-nw-sky-light/40'">
                                        <div class="nw-avatar nw-avatar-sky h-8 w-8 text-sm" aria-hidden="true">
                                            {{ initial(character.character_name) }}
                                        </div>

                                        <div class="min-w-0 flex-1">
                                            <p class="truncate text-sm font-bold"
                                                :class="character.completed ? 'text-[#217a4b]' : 'nw-heading'">
                                                {{ character.character_name }}
                                            </p>

                                            <!-- Only worth showing when there's more than one account -->
                                            <p v-if="multiAccount" class="nw-muted truncate text-xs">
                                                {{ character.account_name }}
                                            </p>
                                        </div>

                                        <!-- One run needed: a single tap target is enough -->
                                        <button v-if="character.target_count === 1" type="button" :class="checkBtn"
                                            class="shrink-0" :data-done="character.completed"
                                            :aria-pressed="character.completed"
                                            :aria-label="`${character.completed ? 'Unmark' : 'Mark'} ${character.character_name} done for ${activity.activity_name}`"
                                            :disabled="updatingCharacter === character.character_id" @click.stop="character.completed
                                                ? removeCompletion(activity, character)
                                                : addCompletion(activity, character)">
                                            ✓
                                        </button>

                                        <!-- Several runs needed: stepper -->
                                        <div v-else
                                            class="flex shrink-0 items-center gap-1 rounded-full border border-nw-line-strong bg-white p-1">
                                            <button type="button" :class="stepBtn" aria-label="Remove one completion"
                                                :disabled="updatingCharacter === character.character_id || !character.current_count"
                                                @click.stop="removeCompletion(activity, character)">
                                                −
                                            </button>

                                            <span
                                                class="nw-heading min-w-10 text-center text-base font-extrabold tabular-nums">
                                                {{ character.current_count }}/{{ character.target_count }}
                                            </span>

                                            <button type="button" :class="stepBtn" aria-label="Add one completion"
                                                :disabled="updatingCharacter === character.character_id || character.completed"
                                                @click.stop="addCompletion(activity, character)">
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </section>
                </template>
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
const filter = ref('all')
const hideDone = ref(false)

// 40px round tap targets
const stepBtn =
    'grid h-10 w-10 shrink-0 place-items-center rounded-full bg-nw-sky-light text-2xl font-extrabold leading-none text-nw-navy transition hover:bg-nw-sky hover:text-white active:scale-90 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nw-gold'

const checkBtn =
    'grid h-10 w-10 place-items-center rounded-xl border-2 text-xl font-extrabold leading-none transition active:scale-90 disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nw-gold ' +
    'border-nw-line-strong bg-white text-transparent hover:bg-nw-sky-light ' +
    'data-[done=true]:border-white data-[done=true]:bg-nw-green data-[done=true]:text-white data-[done=true]:shadow-md'

const typeOf = (activity) => activity.reset_type || activity.type

// Drops a leading guild/party tag like "[DPS]" so the avatar shows a real letter
const initial = (name) => {
    return (name ?? '').replace(/^\[.*?\]\s*/, '').charAt(0).toUpperCase() || '?'
}

const percent = (done, total) => {
    return total ? Math.round((done / total) * 100) : 0
}

const isAllComplete = (activity) => {
    return activity.total_characters > 0 &&
        activity.completed_count >= activity.total_characters
}

const sumOf = (list, key) => list.reduce((sum, item) => sum + item[key], 0)

// Sum across every activity / character pair
const overall = computed(() => {
    const done = sumOf(activities.value, 'completed_count')
    const total = sumOf(activities.value, 'total_characters')

    return { done, total, percent: percent(done, total) }
})

// Reset types found in the data: daily first, then weekly, then anything else
const typeKeys = computed(() => {
    const order = ['daily', 'weekly']
    const rank = (key) => (order.includes(key) ? order.indexOf(key) : order.length)

    return [...new Set(activities.value.map(typeOf))].sort((a, b) => rank(a) - rank(b))
})

const tabs = computed(() => [
    { key: 'all' },
    ...typeKeys.value.map((key) => ({ key }))
])

const groups = computed(() => {
    return typeKeys.value
        .filter((key) => filter.value === 'all' || filter.value === key)
        .map((key) => {
            const all = activities.value.filter((activity) => typeOf(activity) === key)

            return {
                key,
                done: sumOf(all, 'completed_count'),
                total: sumOf(all, 'total_characters'),
                items: hideDone.value ? all.filter((activity) => !isAllComplete(activity)) : all
            }
        })
})

const multiAccount = computed(() => {
    const ids = activities.value.flatMap((activity) =>
        activity.characters.map((character) => character.account_id)
    )

    return new Set(ids).size > 1
})

const allExpanded = computed(() => {
    return activities.value.length > 0 &&
        expandedActivities.value.size === activities.value.length
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

onMounted(async () => {
    await fetchActivityTracker()

    // Roomy screens start fully open; phones start collapsed so the page isn't a wall
    if (window.matchMedia('(min-width: 768px)').matches) {
        expandAll()
    }
})
</script>