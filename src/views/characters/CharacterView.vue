<template>
    <div class="nw-page">
        <div class="mx-auto max-w-6xl">
            <!-- Page header -->
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 class="nw-heading text-2xl font-extrabold">
                        {{ character?.character_name || 'Character' }}
                    </h1>

                    <p class="nw-muted mt-1 text-sm">
                        Character details, activities, and funds.
                    </p>
                </div>

                <button type="button" class="nw-btn nw-btn-ghost"
                    @click="router.push(`/accounts/${route.params.accountId}`)">
                    ← Back to Account
                </button>
            </div>

            <div v-if="character" class="mt-6 space-y-6">
                <!-- Character information -->
                <section class="nw-card">
                    <header class="nw-card-header flex items-center gap-3 px-5 py-4">
                        <div class="nw-avatar" aria-hidden="true">
                            {{ initial(character.character_name) }}
                        </div>

                        <div class="min-w-0 flex-1">
                            <h2 class="nw-card-title truncate text-lg font-bold">
                                {{ character.character_name }}
                            </h2>

                            <p class="nw-card-sub truncate text-xs">
                                {{ character.class }} · {{ character.server }}
                            </p>
                        </div>

                        <span class="nw-status" :class="character.status === 'active' ? 'nw-status-active' : ''">
                            {{ character.status }}
                        </span>
                    </header>

                    <div class="grid grid-cols-2 gap-3 p-5 md:grid-cols-4">
                        <div class="nw-tile">
                            <p class="nw-muted text-xs font-semibold">Class</p>
                            <p class="nw-value mt-0.5 font-bold">{{ character.class }}</p>
                        </div>

                        <div class="nw-tile">
                            <p class="nw-muted text-xs font-semibold">Server</p>
                            <p class="nw-value mt-0.5 font-bold">{{ character.server }}</p>
                        </div>

                        <div class="nw-tile">
                            <p class="nw-muted text-xs font-semibold">Level</p>
                            <p class="nw-value mt-0.5 text-xl font-extrabold">{{ character.level }}</p>
                        </div>

                        <div class="nw-tile">
                            <p class="nw-muted text-xs font-semibold">Job Level</p>
                            <p class="nw-value mt-0.5 text-xl font-extrabold">{{ character.job_level }}</p>
                        </div>

                        <div class="nw-tile col-span-2 md:col-span-4">
                            <p class="nw-muted text-xs font-semibold">Notes</p>
                            <p class="nw-value mt-0.5 text-sm">{{ character.notes || 'No notes.' }}</p>
                        </div>
                    </div>
                </section>

                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <!-- Activities -->
                    <section class="nw-card">
                        <header class="nw-card-header flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                            <div>
                                <h2 class="nw-card-title text-lg font-bold">
                                    Activities
                                </h2>

                                <p class="nw-card-sub text-xs">
                                    Track daily, weekly, and instance activities.
                                </p>
                            </div>

                            <button type="button" class="nw-btn nw-btn-light"
                                @click="router.push(`/accounts/${route.params.accountId}/characters/${route.params.characterId}/activity-history`)">
                                View History
                            </button>
                        </header>

                        <div class="p-5">
                            <div v-if="activities.length === 0" class="nw-empty">
                                No activities available.
                            </div>

                            <div v-else class="space-y-5">
                                <div v-for="group in activityGroups" :key="group.type">
                                    <div class="mb-2 flex items-center gap-2">
                                        <h3 class="nw-heading text-sm font-extrabold">
                                            {{ group.label }}
                                        </h3>

                                        <span class="nw-count">
                                            {{ group.activities.length }}
                                        </span>
                                    </div>

                                    <div class="space-y-2">
                                        <button v-for="activity in group.activities" :key="activity.id" type="button"
                                            class="nw-activity"
                                            :class="{ 'nw-activity-done': isActivityCompleted(activity) }"
                                            :aria-pressed="isActivityCompleted(activity)"
                                            @click="toggleActivity(activity)">
                                            <span class="nw-check" aria-hidden="true">
                                                {{ isActivityCompleted(activity) ? '✓' : '' }}
                                            </span>

                                            <span class="min-w-0 flex-1">
                                                <span class="nw-activity-name block truncate text-sm font-bold">
                                                    {{ activity.name }}
                                                </span>

                                                <span class="nw-muted block truncate text-xs">
                                                    {{ activity.description || 'No description.' }}
                                                </span>
                                            </span>

                                            <span class="nw-progress" :class="isActivityCompleted(activity)
                                                ? 'nw-progress-done'
                                                : getActivityCount(activity.id) > 0
                                                    ? 'nw-progress-partial'
                                                    : ''">
                                                {{ getActivityCount(activity.id) }} / {{ activity.target_count }}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Funds & currencies -->
                    <section class="nw-card self-start">
                        <header class="nw-card-header flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                            <div>
                                <h2 class="nw-card-title text-lg font-bold">
                                    Funds & Currencies
                                </h2>

                                <p class="nw-card-sub text-xs">
                                    Track the character's funds and currencies.
                                </p>
                            </div>

                            <button type="button" class="nw-btn nw-btn-light" @click="openCurrencyForm()">
                                + Add Currency
                            </button>
                        </header>

                        <div class="p-5">
                            <!-- Currency form -->
                            <div v-if="showCurrencyForm"
                                class="mb-5 rounded-[14px] border border-nw-line-strong bg-white p-4 shadow-nw-chip">
                                <div class="mb-4">
                                    <h3 class="nw-heading text-sm font-extrabold">
                                        {{ editingCharacterCurrency ? 'Edit Currency' : 'Add Currency' }}
                                    </h3>

                                    <p class="nw-muted mt-0.5 text-xs">
                                        {{ editingCharacterCurrency
                                            ? 'Update this character currency balance.'
                                            : 'Add a currency and starting balance for this character.' }}
                                    </p>
                                </div>

                                <div class="space-y-4">
                                    <div>
                                        <label for="currency_id" class="nw-label">Currency</label>

                                        <select id="currency_id" v-model="currencyForm.currency_id"
                                            :disabled="!!editingCharacterCurrency"
                                            class="nw-input nw-select disabled:bg-nw-sky-light disabled:text-nw-muted">
                                            <option value="" disabled>
                                                Select currency
                                            </option>

                                            <option v-for="currency in availableCurrencies" :key="currency.id"
                                                :value="currency.id">
                                                {{ currency.name }}
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label for="currency_amount" class="nw-label">Amount</label>

                                        <input id="currency_amount" v-model="currencyForm.amount" type="number" min="0"
                                            step="1" class="nw-input" placeholder="Enter amount" />
                                    </div>
                                </div>

                                <div class="mt-4 flex justify-end gap-2">
                                    <button type="button" class="nw-btn nw-btn-ghost" @click="closeCurrencyForm">
                                        Cancel
                                    </button>

                                    <button type="button" class="nw-btn nw-btn-gold" @click="saveCurrency">
                                        {{ editingCharacterCurrency ? 'Save Changes' : 'Add Currency' }}
                                    </button>
                                </div>
                            </div>

                            <div v-if="characterCurrencies.length === 0" class="nw-empty">
                                No funds recorded yet.
                            </div>

                            <div v-else class="space-y-2">
                                <div v-for="characterCurrency in characterCurrencies" :key="characterCurrency.id"
                                    class="nw-fund">
                                    <div class="nw-coin" aria-hidden="true">🪙</div>

                                    <div class="min-w-0 flex-1">
                                        <p class="nw-value truncate text-sm font-bold">
                                            {{ getCurrencyName(characterCurrency.currency_id) }}
                                        </p>

                                        <p class="nw-muted truncate text-xs">
                                            {{ getFundTimestamp(characterCurrency) }}
                                        </p>
                                    </div>

                                    <p class="nw-heading text-lg font-extrabold tabular-nums">
                                        {{ formatAmount(characterCurrency.amount) }}
                                    </p>

                                    <button type="button" class="nw-btn nw-btn-ghost px-3 py-1 text-[0.8125rem]"
                                        @click="openCurrencyForm(characterCurrency)">
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <!-- Not found -->
            <div v-else class="nw-card mt-6 px-5 py-4 text-sm nw-muted">
                Character not found.
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

const showCurrencyForm = ref(false)
const editingCharacterCurrency = ref(null)

const currencyForm = ref({
    currency_id: '',
    amount: 0
})

const initial = (name) => (name ? name.trim().charAt(0).toUpperCase() : '?')

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

const availableCurrencies = computed(() => {
    return currencies.value.filter((currency) => {
        if (editingCharacterCurrency.value) {
            return true
        }

        return !characterCurrencies.value.some(
            (item) => String(item.currency_id) === String(currency.id)
        )
    })
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

// created_at / updated_at come back as UTC ISO strings, shown in the viewer's local time
const formatDateTime = (value) => {
    if (!value) {
        return '—'
    }

    return new Date(value).toLocaleString([], {
        dateStyle: 'medium',
        timeStyle: 'short'
    })
}

// "Updated …" only when the record was changed after creation, otherwise "Added …"
const getFundTimestamp = (item) => {
    const wasUpdated =
        item.updated_at &&
        new Date(item.updated_at) - new Date(item.created_at) > 1000

    return wasUpdated
        ? `Updated ${formatDateTime(item.updated_at)}`
        : `Added ${formatDateTime(item.created_at)}`
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

const openCurrencyForm = (characterCurrency = null) => {
    editingCharacterCurrency.value = characterCurrency

    if (characterCurrency) {
        currencyForm.value = {
            currency_id: characterCurrency.currency_id,
            amount: characterCurrency.amount
        }
    } else {
        currencyForm.value = {
            currency_id: '',
            amount: 0
        }
    }

    showCurrencyForm.value = true
}

const closeCurrencyForm = () => {
    showCurrencyForm.value = false
    editingCharacterCurrency.value = null

    currencyForm.value = {
        currency_id: '',
        amount: 0
    }
}

const saveCurrency = async () => {
    try {
        if (!currencyForm.value.currency_id) {
            return
        }

        startLoading()

        if (editingCharacterCurrency.value) {
            const response = await characterCurrencyApi.updateCharacterCurrency(
                editingCharacterCurrency.value.id,
                {
                    amount: Number(currencyForm.value.amount)
                }
            )

            const index = characterCurrencies.value.findIndex(
                (item) => item.id === editingCharacterCurrency.value.id
            )

            if (index !== -1) {
                characterCurrencies.value[index] = response.data
            }
        } else {
            const response = await characterCurrencyApi.createCharacterCurrency({
                character_id: character.value.id,
                currency_id: Number(currencyForm.value.currency_id),
                amount: Number(currencyForm.value.amount)
            })

            characterCurrencies.value.push(response.data)
        }

        closeCurrencyForm()
    } catch (error) {
        console.error('Failed to save character currency:', error)
    } finally {
        stopLoading()
    }
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