<template>
    <div class="nw-page">
        <div class="mx-auto max-w-6xl">
            <!-- Page header -->
            <div class="flex flex-col gap-3">
                <button type="button" class="nw-muted w-fit text-xs font-semibold transition-colors hover:underline"
                    @click="router.push(`/accounts/${route.params.accountId}`)">
                    ← Back to Account
                </button>

                <div class="flex items-center gap-3">
                    <div class="nw-avatar nw-avatar-sky shrink-0" aria-hidden="true">
                        {{ initial(character?.character_name) }}
                    </div>

                    <div class="min-w-0 flex-1">
                        <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <h1 class="nw-heading truncate text-xl font-extrabold sm:text-2xl">
                                {{ character?.character_name || 'Character' }}
                            </h1>

                            <span v-if="character" class="nw-status"
                                :class="character.status === 'active' ? 'nw-status-active' : ''">
                                {{ character.status }}
                            </span>
                        </div>

                        <p class="nw-muted truncate text-xs sm:text-sm">
                            <template v-if="character">{{ character.class }} · {{ character.server }}</template>
                            <template v-else>Character details, activities, and funds.</template>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="nw-card mt-5 px-4 py-3 text-sm nw-muted">
                Loading character...
            </div>

            <!-- Two-column layout: activities (main) + details & funds (sidebar) -->
            <div v-else-if="character" class="mt-5 grid gap-4 lg:grid-cols-3 lg:items-start">
                <!-- Activities (first on mobile, right column on desktop) -->
                <section class="nw-card lg:col-span-2 lg:col-start-2 lg:row-start-1">
                    <header class="nw-card-header flex items-center justify-between gap-3 px-4 py-3">
                        <div class="min-w-0">
                            <div class="flex items-center gap-2">
                                <h2 class="nw-card-title text-base font-bold">Activities</h2>
                                <span v-if="activities.length" class="nw-status"
                                    :class="totalDone === activities.length ? 'nw-status-active' : ''">
                                    {{ totalDone }} / {{ activities.length }} done
                                </span>
                            </div>
                            <p class="nw-card-sub text-xs">Track daily, weekly, and instance activities.</p>
                        </div>

                        <button type="button" class="nw-btn nw-btn-light shrink-0 text-sm"
                            @click="router.push(`/accounts/${route.params.accountId}/characters/${route.params.characterId}/activity-history`)">
                            View History
                        </button>
                    </header>

                    <div class="p-4">
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
                                        {{ groupDone(group) }} / {{ group.activities.length }}
                                    </span>
                                </div>

                                <div class="grid gap-2 sm:grid-cols-2">
                                    <button v-for="activity in group.activities" :key="activity.id" type="button"
                                        class="nw-activity"
                                        :class="{ 'nw-activity-done': isActivityCompleted(activity) }"
                                        :aria-pressed="isActivityCompleted(activity)" @click="toggleActivity(activity)">
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

                <!-- Sidebar: details + funds -->
                <aside class="space-y-4 lg:col-start-1 lg:row-start-1">
                    <!-- Character details -->
                    <section class="nw-card transition-shadow duration-150"
                        :class="editing ? 'ring-2 ring-sky-500/40' : ''">
                        <header class="nw-card-header flex items-center justify-between gap-3 px-4 py-3">
                            <div class="min-w-0">
                                <h2 class="nw-card-title truncate text-base font-bold">
                                    {{ editing ? 'Edit character' : 'Character details' }}
                                </h2>
                                <p v-if="editing" class="nw-card-sub text-xs">Update the details, then save.</p>
                            </div>

                            <button v-if="!editing" type="button" class="nw-btn nw-btn-sky shrink-0 text-sm"
                                @click="startEditing">
                                Edit
                            </button>
                        </header>

                        <!-- View mode -->
                        <template v-if="!editing">
                            <div class="px-4 pt-3">
                                <div
                                    class="grid grid-cols-2 divide-x divide-current/10 rounded-lg bg-current/5 py-2 text-center">
                                    <div class="px-2">
                                        <p class="nw-muted text-[10px] font-semibold uppercase tracking-wide">Level</p>
                                        <p class="nw-value text-xl font-extrabold tabular-nums">{{ character.level }}
                                        </p>
                                    </div>

                                    <div class="px-2">
                                        <p class="nw-muted text-[10px] font-semibold uppercase tracking-wide">Job Level
                                        </p>
                                        <p class="nw-value text-xl font-extrabold tabular-nums">
                                            {{ character.job_level }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <dl class="divide-y divide-current/10 px-4">
                                <div class="flex items-baseline justify-between gap-4 py-2.5">
                                    <dt class="nw-muted shrink-0 text-xs font-semibold">Class</dt>
                                    <dd class="nw-value min-w-0 truncate text-sm font-bold">{{ character.class }}</dd>
                                </div>

                                <div class="flex items-baseline justify-between gap-4 py-2.5">
                                    <dt class="nw-muted shrink-0 text-xs font-semibold">Server</dt>
                                    <dd class="nw-value min-w-0 truncate text-sm font-bold">{{ character.server }}</dd>
                                </div>

                                <div class="py-2.5">
                                    <dt class="nw-muted text-xs font-semibold">Notes</dt>
                                    <dd class="nw-value mt-1 whitespace-pre-line break-words text-sm">
                                        {{ character.notes || 'No notes.' }}
                                    </dd>
                                </div>
                            </dl>
                        </template>

                        <!-- Edit mode -->
                        <form v-else novalidate @submit.prevent="saveCharacter" @keydown.esc="cancelEditing">
                            <div class="space-y-3 px-4 py-4">
                                <div v-for="field in fields" :key="field.key" class="min-w-0">
                                    <label :for="`field-${field.key}`"
                                        class="nw-muted block text-[11px] font-semibold uppercase tracking-wide">
                                        {{ field.label }}
                                        <span v-if="field.required" class="text-red-500" aria-hidden="true">*</span>
                                    </label>

                                    <input :id="`field-${field.key}`" v-model="editForm[field.key]" type="text"
                                        class="nw-input mt-1 w-full" :placeholder="field.placeholder"
                                        :required="field.required" autocomplete="off">
                                </div>

                                <div class="grid grid-cols-2 gap-3">
                                    <div>
                                        <label for="field-level"
                                            class="nw-muted block text-[11px] font-semibold uppercase tracking-wide">
                                            Level
                                        </label>
                                        <input id="field-level" v-model="editForm.level" type="number" min="0" step="1"
                                            class="nw-input mt-1 w-full">
                                    </div>

                                    <div>
                                        <label for="field-job_level"
                                            class="nw-muted block text-[11px] font-semibold uppercase tracking-wide">
                                            Job Level
                                        </label>
                                        <input id="field-job_level" v-model="editForm.job_level" type="number" min="0"
                                            step="1" class="nw-input mt-1 w-full">
                                    </div>
                                </div>

                                <div>
                                    <label for="field-status"
                                        class="nw-muted block text-[11px] font-semibold uppercase tracking-wide">
                                        Status
                                    </label>
                                    <select id="field-status" v-model="editForm.status"
                                        class="nw-input nw-select mt-1 w-full">
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                <div>
                                    <label for="field-notes"
                                        class="nw-muted block text-[11px] font-semibold uppercase tracking-wide">
                                        Notes
                                        <span class="font-normal normal-case tracking-normal">(optional)</span>
                                    </label>
                                    <textarea id="field-notes" v-model="editForm.notes" rows="3"
                                        class="nw-input mt-1 w-full resize-none"
                                        placeholder="Anything worth remembering about this character"></textarea>
                                </div>
                            </div>

                            <footer
                                class="nw-card-header flex flex-wrap items-center justify-between gap-3 border-t px-4 py-2.5">
                                <p class="nw-muted flex items-center gap-1.5 text-xs">
                                    <template v-if="isDirty">
                                        <span class="inline-block h-1.5 w-1.5 rounded-full bg-amber-500"
                                            aria-hidden="true"></span>
                                        Unsaved changes
                                    </template>
                                    <template v-else>No changes yet</template>
                                </p>

                                <div class="flex items-center gap-2">
                                    <button type="button" class="nw-btn nw-btn-ghost text-sm" :disabled="saving"
                                        @click="cancelEditing">
                                        Cancel
                                    </button>

                                    <button type="submit" class="nw-btn nw-btn-gold text-sm"
                                        :disabled="saving || !isDirty || !isValid">
                                        {{ saving ? 'Saving...' : 'Save' }}
                                    </button>
                                </div>
                            </footer>
                        </form>
                    </section>

                    <!-- Funds & currencies -->
                    <section class="nw-card">
                        <header class="nw-card-header flex items-center justify-between gap-3 px-4 py-3">
                            <div class="min-w-0">
                                <h2 class="nw-card-title truncate text-base font-bold">Funds & Currencies</h2>
                                <p class="nw-card-sub text-xs">Track funds and currencies.</p>
                            </div>

                            <button type="button" class="nw-btn nw-btn-light shrink-0 text-sm"
                                @click="openCurrencyForm()">
                                + Add
                            </button>
                        </header>

                        <div class="p-4">
                            <!-- Currency form -->
                            <div v-if="showCurrencyForm"
                                class="mb-4 rounded-[14px] border border-nw-line-strong bg-white p-4 shadow-nw-chip">
                                <div class="mb-3">
                                    <h3 class="nw-heading text-sm font-extrabold">
                                        {{ editingCharacterCurrency ? 'Edit Currency' : 'Add Currency' }}
                                    </h3>

                                    <p class="nw-muted mt-0.5 text-xs">
                                        {{ editingCharacterCurrency
                                            ? 'Update this character currency balance.'
                                            : 'Add a currency and starting balance for this character.' }}
                                    </p>
                                </div>

                                <div class="space-y-3">
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
                                    <button type="button" class="nw-btn nw-btn-ghost text-sm"
                                        @click="closeCurrencyForm">
                                        Cancel
                                    </button>

                                    <button type="button" class="nw-btn nw-btn-gold text-sm" @click="saveCurrency">
                                        {{ editingCharacterCurrency ? 'Save' : 'Add' }}
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

                                    <p class="nw-heading text-base font-extrabold tabular-nums">
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
                </aside>
            </div>

            <!-- Not found -->
            <div v-else class="nw-card mt-5 px-4 py-3 text-sm nw-muted">
                Character not found.
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
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

const loading = ref(true)
const editing = ref(false)
const saving = ref(false)

const showCurrencyForm = ref(false)
const editingCharacterCurrency = ref(null)

const currencyForm = ref({
    currency_id: '',
    amount: 0
})

const editForm = ref({
    character_name: '',
    class: '',
    server: '',
    level: 0,
    job_level: 0,
    status: 'active',
    notes: ''
})

const fields = [
    { key: 'character_name', label: 'Character Name', placeholder: 'Character name', required: true },
    { key: 'class', label: 'Class', placeholder: 'Class', required: true },
    { key: 'server', label: 'Server', placeholder: 'Server', required: false }
]

const initial = (name) => (name ? name.trim().charAt(0).toUpperCase() : '?')

// ---- Character edit ----

// True when the form differs from the saved character
const isDirty = computed(() => {
    if (!character.value) return false

    return Object.keys(editForm.value).some(
        (key) => String(editForm.value[key] ?? '') !== String(character.value[key] ?? '')
    )
})

// Required text fields must be filled, levels must be non-negative numbers
const isValid = computed(() => {
    const requiredFilled = fields
        .filter((field) => field.required)
        .every((field) => String(editForm.value[field.key] ?? '').trim() !== '')

    const levelsValid = ['level', 'job_level'].every((key) => {
        const value = editForm.value[key]

        return value !== '' && value !== null && Number(value) >= 0
    })

    return requiredFilled && levelsValid
})

const startEditing = async () => {
    editForm.value = {
        character_name: character.value.character_name || '',
        class: character.value.class || '',
        server: character.value.server || '',
        level: character.value.level ?? 0,
        job_level: character.value.job_level ?? 0,
        status: character.value.status || 'active',
        notes: character.value.notes || ''
    }

    editing.value = true

    await nextTick()
    document.getElementById('field-character_name')?.focus()
}

const cancelEditing = () => {
    editing.value = false
}

const saveCharacter = async () => {
    if (!isDirty.value || !isValid.value) return

    try {
        saving.value = true
        startLoading()

        const response = await characterApi.updateCharacter(
            character.value.id,
            {
                account_id: character.value.account_id,
                ...editForm.value,
                level: Number(editForm.value.level),
                job_level: Number(editForm.value.job_level)
            }
        )

        character.value = response.data
        editing.value = false
    } catch (error) {
        console.error('Failed to update character:', error)
    } finally {
        saving.value = false
        stopLoading()
    }
}

// ---- Activities ----

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

// Completed activities within one group, and across all groups
const groupDone = (group) => {
    return group.activities.filter((activity) => isActivityCompleted(activity)).length
}

const totalDone = computed(() => {
    return activities.value.filter((activity) => isActivityCompleted(activity)).length
})

const getActivityCompletion = (activityId) => {
    return completions.value.find(
        (completion) => String(completion.activity_id) === String(activityId)
    )
}

// ---- Currencies ----

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
        loading.value = true
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
        loading.value = false
        stopLoading()
    }
}

onMounted(() => {
    fetchData()
})
</script>