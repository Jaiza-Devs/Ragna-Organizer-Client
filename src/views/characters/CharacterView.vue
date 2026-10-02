<template>
    <div class="p-6">
        <div class="mx-auto max-w-6xl">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-slate-800">
                        {{ character?.character_name || 'Character' }}
                    </h1>

                    <p class="mt-1 text-sm text-slate-500">
                        Character details, activities, and funds.
                    </p>
                </div>

                <button type="button" class="text-sm text-slate-500 hover:text-slate-800"
                    @click="router.push(`/accounts/${route.params.accountId}`)">
                    Back to Account
                </button>
            </div>

            <div v-if="character" class="mt-6 space-y-6">
                <div class="rounded-xl bg-white p-6 shadow-sm">
                    <div class="flex items-start justify-between">
                        <div>
                            <h2 class="text-lg font-semibold text-slate-800">
                                Character Information
                            </h2>

                            <p class="mt-1 text-sm text-slate-500">
                                Basic information about this character.
                            </p>
                        </div>

                        <span class="rounded-full px-2.5 py-1 text-xs font-medium" :class="character.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-500'">
                            {{ character.status }}
                        </span>
                    </div>

                    <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div>
                            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Character Name
                            </p>

                            <p class="mt-1 font-medium text-slate-800">
                                {{ character.character_name }}
                            </p>
                        </div>

                        <div>
                            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Class
                            </p>

                            <p class="mt-1 font-medium text-slate-800">
                                {{ character.class }}
                            </p>
                        </div>

                        <div>
                            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Server
                            </p>

                            <p class="mt-1 font-medium text-slate-800">
                                {{ character.server }}
                            </p>
                        </div>

                        <div>
                            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Level
                            </p>

                            <p class="mt-1 font-medium text-slate-800">
                                {{ character.level }}
                            </p>
                        </div>

                        <div>
                            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Job Level
                            </p>

                            <p class="mt-1 font-medium text-slate-800">
                                {{ character.job_level }}
                            </p>
                        </div>

                        <div>
                            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Notes
                            </p>

                            <p class="mt-1 text-slate-700">
                                {{ character.notes || 'No notes.' }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div class="rounded-xl bg-white p-6 shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <h2 class="text-lg font-semibold text-slate-800">
                                    Activities
                                </h2>

                                <p class="mt-1 text-sm text-slate-500">
                                    Track daily, weekly, and instance activities for this character.
                                </p>
                            </div>

                            <button type="button"
                                class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                @click="router.push(`/accounts/${route.params.accountId}/characters/${route.params.characterId}/activity-history`)">
                                View History
                            </button>
                        </div>

                        <div v-if="activities.length === 0"
                            class="mt-6 rounded-lg border border-dashed border-slate-300 p-6 text-center">
                            <p class="text-sm text-slate-500">
                                No activities available.
                            </p>
                        </div>

                        <div v-else class="mt-6 space-y-6">
                            <div v-for="group in activityGroups" :key="group.type">
                                <div class="mb-3 flex items-center justify-between">
                                    <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-700">
                                        {{ group.label }}
                                    </h3>

                                    <span class="text-xs text-slate-400">
                                        {{ group.activities.length }}
                                    </span>
                                </div>

                                <div class="space-y-2">
                                    <button v-for="activity in group.activities" :key="activity.id" type="button"
                                        class="flex w-full items-center justify-between rounded-lg border p-4 text-left transition"
                                        :class="isActivityCompleted(activity)
                                            ? 'border-green-200 bg-green-50'
                                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'"
                                        @click="toggleActivity(activity)">
                                        <div class="min-w-0">
                                            <p class="font-medium" :class="isActivityCompleted(activity)
                                                ? 'text-green-700'
                                                : 'text-slate-800'">
                                                {{ activity.name }}
                                            </p>

                                            <p class="mt-1 text-xs text-slate-500">
                                                {{ activity.description || 'No description.' }}
                                            </p>
                                        </div>

                                        <span class="ml-4 shrink-0 rounded-full px-2.5 py-1 text-xs font-medium" :class="isActivityCompleted(activity)
                                            ? 'bg-green-100 text-green-700'
                                            : getActivityCount(activity.id) > 0
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-slate-100 text-slate-500'">
                                            {{ getActivityCount(activity.id) }} / {{ activity.target_count }}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="rounded-xl bg-white p-6 shadow-sm">
                        <h2 class="text-lg font-semibold text-slate-800">
                            Funds & Currencies
                        </h2>

                        <p class="mt-1 text-sm text-slate-500">
                            Track the character's funds and currencies.
                        </p>

                        <div v-if="characterCurrencies.length === 0"
                            class="mt-6 rounded-lg border border-dashed border-slate-300 p-6 text-center">
                            <p class="text-sm text-slate-500">
                                No funds recorded yet.
                            </p>
                        </div>

                        <div v-else class="mt-6 space-y-3">
                            <div v-for="characterCurrency in characterCurrencies" :key="characterCurrency.id"
                                class="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                                <div>
                                    <p class="font-medium text-slate-800">
                                        {{ getCurrencyName(characterCurrency.currency_id) }}
                                    </p>

                                    <p class="mt-1 text-xs text-slate-500">
                                        Current balance
                                    </p>
                                </div>

                                <p class="text-lg font-semibold text-slate-800">
                                    {{ formatAmount(characterCurrency.amount) }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="mt-6 rounded-xl bg-white p-6 shadow-sm">
                <p class="text-sm text-slate-500">
                    Character not found.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import characterApi from '@/api/characters'
import activityApi from '@/api/activities'
import activityCompletionApi from '@/api/activityCompletions'
import characterCurrencyApi from '@/api/characterCurrencies'
import currencyApi from '@/api/currencies'
import useLoading from '@/composables/useLoading'

const route = useRoute()
const router = useRouter()

const { startLoading, stopLoading } = useLoading()

const character = ref(null)
const activities = ref([])
const completions = ref([])
const activityCounts = ref({})
const characterCurrencies = ref([])
const currencies = ref([])

const activityGroups = computed(() => {
    return [
        {
            type: 'daily',
            label: 'Daily',
            activities: activities.value.filter(
                (activity) => activity.type === 'daily'
            )
        },
        {
            type: 'weekly',
            label: 'Weekly',
            activities: activities.value.filter(
                (activity) => activity.type === 'weekly'
            )
        },
        {
            type: 'instance',
            label: 'Instance',
            activities: activities.value.filter(
                (activity) => activity.type === 'instance'
            )
        }
    ].filter((group) => group.activities.length > 0)
})

const fetchCharacter = async () => {
    const response = await characterApi.getCharacter(route.params.characterId)

    character.value = response.data
}

const fetchActivities = async () => {
    const response = await activityApi.getActivities()

    activities.value = response.data.filter(
        (activity) => activity.status === 'active'
    )
}

const fetchCompletions = async () => {
    const response = await activityCompletionApi.getActivityCompletions()

    completions.value = response.data.filter(
        (completion) => String(completion.character_id) === String(route.params.characterId)
    )
}

const fetchActivityCount = async (activityId) => {
    const response = await activityCompletionApi.getCurrentCount(
        activityId,
        route.params.characterId
    )

    console.log('ACTIVITY COUNT:', {
        activityId,
        characterId: route.params.characterId,
        response: response.data
    })

    activityCounts.value[activityId] = response.data.current_count
}

const fetchActivityCounts = async () => {
    await Promise.all(
        activities.value.map((activity) => fetchActivityCount(activity.id))
    )
}

const fetchCharacterCurrencies = async () => {
    const response = await characterCurrencyApi.getCharacterCurrenciesByCharacter(
        route.params.characterId
    )

    characterCurrencies.value = response.data
}

const fetchCurrencies = async () => {
    const response = await currencyApi.getCurrencies()

    currencies.value = response.data
}

const getCurrencyName = (currencyId) => {
    const currency = currencies.value.find(
        (item) => String(item.id) === String(currencyId)
    )

    return currency?.name || 'Unknown Currency'
}

const formatAmount = (amount) => {
    return Number(amount).toLocaleString()
}

const getActivityCount = (activityId) => {
    return activityCounts.value[activityId] || 0
}

const isActivityCompleted = (activity) => {
    return getActivityCount(activity.id) >= activity.target_count
}

const getActivityCompletion = (activityId) => {
    return completions.value.find(
        (completion) => String(completion.activity_id) === String(activityId)
    )
}

const toggleActivity = async (activity) => {
    try {
        startLoading()

        const completion = getActivityCompletion(activity.id)

        if (isActivityCompleted(activity)) {
            if (!completion) {
                await fetchCompletions()
            }

            const currentCompletion = getActivityCompletion(activity.id)

            if (currentCompletion) {
                await activityCompletionApi.deleteActivityCompletion(
                    currentCompletion.id
                )

                completions.value = completions.value.filter(
                    (item) => item.id !== currentCompletion.id
                )
            }
        } else {
            const response = await activityCompletionApi.createActivityCompletion({
                activity_id: activity.id,
                character_id: character.value.id,
                completed_at: new Date().toISOString(),
                notes: ''
            })

            completions.value.push(response.data)
        }

        await fetchActivityCount(activity.id)
    } catch (error) {
        console.error('Failed to update activity completion:', error)
    } finally {
        stopLoading()
    }
}

const fetchData = async () => {
    try {
        startLoading()

        await Promise.all([
            fetchCharacter(),
            fetchActivities(),
            fetchCompletions(),
            fetchCharacterCurrencies(),
            fetchCurrencies()
        ])

        await fetchActivityCounts()
    } catch (error) {
        console.error('Failed to fetch character data:', error)
    } finally {
        stopLoading()
    }
}

onMounted(() => {
    fetchData()
})
</script>