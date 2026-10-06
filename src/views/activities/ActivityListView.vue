<template>
    <div class="nw-page p-3 sm:p-6 lg:p-8">
        <div class="mx-auto max-w-6xl">
            <!-- Page header -->
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="nw-heading text-xl font-extrabold sm:text-2xl">
                        Activities
                    </h1>

                    <p class="nw-muted mt-1 text-xs sm:text-sm">
                        Manage reusable daily, weekly, and instance activities.
                    </p>
                </div>

                <button type="button" class="nw-btn nw-btn-gold w-full sm:w-auto"
                    @click="router.push('/activities/create')">
                    <span class="text-base leading-none" aria-hidden="true">+</span>
                    Add Activity
                </button>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="nw-card mt-5 px-4 py-3 text-sm nw-muted">
                Loading activities...
            </div>

            <!-- Error -->
            <div v-else-if="loadError" class="nw-card mt-5 flex flex-col items-center px-6 py-10 text-center">
                <p class="nw-heading font-bold">Couldn't load activities</p>
                <p class="nw-muted mt-1 text-sm">Check your connection and try again.</p>
                <button type="button" class="nw-btn nw-btn-sky mt-4" @click="fetchActivities()">
                    Try again
                </button>
            </div>

            <!-- Empty -->
            <div v-else-if="activities.length === 0"
                class="nw-card mt-5 flex flex-col items-center px-6 py-12 text-center">
                <div class="nw-avatar nw-avatar-lg" aria-hidden="true">⚔️</div>
                <h2 class="nw-heading mt-4 text-lg font-bold">No activities yet</h2>
                <p class="nw-muted mt-1 text-sm">
                    Add a daily, weekly or instance activity to track on your characters.
                </p>
                <button type="button" class="nw-btn nw-btn-gold mt-5" @click="router.push('/activities/create')">
                    Add Activity
                </button>
            </div>

            <template v-else>
                <!-- Toolbar -->
                <section class="nw-card mt-5 px-4 py-3">
                    <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
                        <div class="lg:flex-1">
                            <label for="activity-search" class="sr-only">Search activities</label>
                            <input id="activity-search" v-model="search" type="search" class="nw-input py-2"
                                placeholder="Search activities" />
                        </div>

                        <div class="flex flex-wrap items-center gap-2">
                            <div class="inline-flex rounded-full border border-nw-line-strong bg-white p-0.5"
                                role="group" aria-label="Filter by type">
                                <button v-for="tab in tabs" :key="tab.key" type="button"
                                    :aria-pressed="filter === tab.key"
                                    class="rounded-full px-3 py-1 text-[0.8125rem] font-bold capitalize transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nw-gold"
                                    :class="filter === tab.key
                                        ? 'bg-nw-grad-gold text-white'
                                        : 'text-nw-text hover:bg-nw-sky-light'" @click="filter = tab.key">
                                    {{ tab.key }}
                                    <span class="ml-0.5 tabular-nums opacity-70">{{ tab.count }}</span>
                                </button>
                            </div>

                            <button v-if="hasInactive" type="button"
                                class="nw-btn nw-btn-ghost px-3 py-1 text-[0.8125rem]"
                                :class="hideInactive ? 'bg-nw-sky-light' : ''" :aria-pressed="hideInactive"
                                @click="hideInactive = !hideInactive">
                                {{ hideInactive ? '✓ ' : '' }}Hide inactive
                            </button>
                        </div>
                    </div>
                </section>

                <!-- No matches -->
                <div v-if="groups.length === 0" class="nw-empty mt-5">
                    No activities match your filters.
                    <button type="button" class="nw-heading ml-1 font-bold underline" @click="clearFilters">
                        Clear filters
                    </button>
                </div>

                <!-- Groups (Daily / Weekly / Instance ...) -->
                <section v-for="group in groups" :key="group.key" class="mt-5">
                    <div class="mb-2 flex items-center gap-2">
                        <h2 class="nw-heading text-sm font-extrabold capitalize">{{ group.key }}</h2>
                        <span class="nw-count tabular-nums">{{ group.items.length }}</span>
                    </div>

                    <ul class="nw-card divide-y divide-nw-line">
                        <li v-for="activity in group.items" :key="activity.id"
                            class="flex flex-col gap-2 px-4 py-3 transition-colors hover:bg-nw-sky-light/40 sm:flex-row sm:items-center sm:gap-4">
                            <div class="min-w-0 flex-1" :class="isActive(activity) ? '' : 'opacity-60'">
                                <div class="flex items-baseline gap-2">
                                    <h3 class="nw-heading truncate text-sm font-extrabold sm:text-base">
                                        {{ activity.name }}
                                    </h3>

                                    <span v-if="activity.target_count > 1" class="nw-muted shrink-0 text-xs font-bold">
                                        ×{{ activity.target_count }}
                                    </span>
                                </div>

                                <p v-if="activity.description"
                                    class="nw-muted mt-0.5 line-clamp-2 text-xs sm:text-sm lg:line-clamp-1">
                                    {{ activity.description }}
                                </p>
                            </div>

                            <div class="flex shrink-0 items-center gap-2">
                                <!-- Only when it differs from the group, e.g. an instance that resets weekly -->
                                <span v-if="activity.reset_type && activity.reset_type !== activity.type"
                                    class="nw-count py-0.5 capitalize">
                                    Resets {{ activity.reset_type }}
                                </span>

                                <!-- Active is the norm, so only flag the exceptions -->
                                <span v-if="!isActive(activity)" class="nw-status">
                                    {{ activity.status }}
                                </span>

                                <button type="button" class="nw-btn nw-btn-ghost ml-auto px-3 py-1 text-[0.8125rem]"
                                    :aria-label="`Edit ${activity.name}`" @click="openEditor(activity)">
                                    Edit
                                </button>
                            </div>
                        </li>
                    </ul>
                </section>
            </template>
        </div>

        <!-- Edit dialog (native <dialog>: focus trap, Esc to close and backdrop come built in) -->
        <dialog ref="dialogRef"
            class="m-auto w-[calc(100%-1.5rem)] max-w-lg overflow-visible bg-transparent p-0 backdrop:bg-nw-navy/50 backdrop:backdrop-blur-sm"
            aria-labelledby="edit-activity-title" @close="resetEditor" @click="onBackdropClick">
            <form class="nw-card flex max-h-[calc(100dvh-1.5rem)] flex-col" @submit.prevent="saveActivity">
                <header class="nw-card-header px-4 py-3">
                    <h2 id="edit-activity-title" class="nw-card-title text-base">Edit activity</h2>
                </header>

                <div class="flex-1 space-y-4 overflow-y-auto p-4">
                    <p v-if="editorLoading" class="nw-muted text-sm">Loading...</p>

                    <template v-else>
                        <p v-if="formError" role="alert"
                            class="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                            {{ formError }}
                        </p>

                        <div>
                            <label for="edit-name" class="nw-label">Name</label>
                            <input id="edit-name" v-model="form.name" type="text" required class="nw-input" />
                            <p v-if="errorOf('name')" class="mt-1 text-xs font-semibold text-red-600">
                                {{ errorOf('name') }}
                            </p>
                        </div>

                        <div>
                            <label for="edit-description" class="nw-label">Description</label>
                            <textarea id="edit-description" v-model="form.description" rows="3"
                                class="nw-input"></textarea>
                            <p v-if="errorOf('description')" class="mt-1 text-xs font-semibold text-red-600">
                                {{ errorOf('description') }}
                            </p>
                        </div>

                        <div class="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label for="edit-type" class="nw-label">Type</label>
                                <select id="edit-type" v-model="form.type" class="nw-input nw-select">
                                    <option v-for="option in typeOptions" :key="option" :value="option">
                                        {{ titleCase(option) }}
                                    </option>
                                </select>
                                <p v-if="errorOf('type')" class="mt-1 text-xs font-semibold text-red-600">
                                    {{ errorOf('type') }}
                                </p>
                            </div>

                            <div>
                                <label for="edit-reset" class="nw-label">Resets</label>
                                <select id="edit-reset" v-model="form.reset_type" class="nw-input nw-select">
                                    <option v-for="option in resetOptions" :key="option" :value="option">
                                        {{ titleCase(option) }}
                                    </option>
                                </select>
                                <p v-if="errorOf('reset_type')" class="mt-1 text-xs font-semibold text-red-600">
                                    {{ errorOf('reset_type') }}
                                </p>
                            </div>

                            <div>
                                <label for="edit-status" class="nw-label">Status</label>
                                <select id="edit-status" v-model="form.status" class="nw-input nw-select">
                                    <option v-for="option in statusOptions" :key="option" :value="option">
                                        {{ titleCase(option) }}
                                    </option>
                                </select>
                                <p v-if="errorOf('status')" class="mt-1 text-xs font-semibold text-red-600">
                                    {{ errorOf('status') }}
                                </p>
                            </div>

                            <div v-if="hasTarget">
                                <label for="edit-target" class="nw-label">Target count</label>
                                <input id="edit-target" v-model.number="form.target_count" type="number" min="1"
                                    required class="nw-input" />
                                <p v-if="errorOf('target_count')" class="mt-1 text-xs font-semibold text-red-600">
                                    {{ errorOf('target_count') }}
                                </p>
                            </div>
                        </div>
                    </template>
                </div>

                <footer
                    class="flex flex-col-reverse gap-2 border-t border-nw-line px-4 py-3 sm:flex-row sm:justify-end">
                    <button type="button" class="nw-btn nw-btn-ghost w-full sm:w-auto" :disabled="saving"
                        @click="dialogRef.close()">
                        Cancel
                    </button>

                    <button type="submit" class="nw-btn nw-btn-gold w-full sm:w-auto"
                        :disabled="saving || editorLoading || !isDirty">
                        {{ saving ? 'Saving...' : 'Save changes' }}
                    </button>
                </footer>
            </form>
        </dialog>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import activityApi from '@/api/activities'
import useLoading from '@/composables/useLoading'

const router = useRouter()
const { startLoading, stopLoading } = useLoading()

const activities = ref([])
const loading = ref(true)
const loadError = ref(false)

const search = ref('')
const filter = ref('all')
const hideInactive = ref(false)

const isActive = (activity) => activity.status === 'active'

// Types found in the data: daily first, then weekly, then anything else (e.g. instance)
const typeKeys = computed(() => {
    const order = ['daily', 'weekly']
    const rank = (key) => (order.includes(key) ? order.indexOf(key) : order.length)

    return [...new Set(activities.value.map((activity) => activity.type))].sort(
        (a, b) => rank(a) - rank(b)
    )
})

const tabs = computed(() => [
    { key: 'all', count: activities.value.length },
    ...typeKeys.value.map((key) => ({
        key,
        count: activities.value.filter((activity) => activity.type === key).length
    }))
])

const hasInactive = computed(() => activities.value.some((activity) => !isActive(activity)))

const matches = (activity) => {
    const query = search.value.trim().toLowerCase()

    if (hideInactive.value && !isActive(activity)) {
        return false
    }

    return !query ||
        activity.name?.toLowerCase().includes(query) ||
        activity.description?.toLowerCase().includes(query)
}

const groups = computed(() => {
    return typeKeys.value
        .filter((key) => filter.value === 'all' || filter.value === key)
        .map((key) => ({
            key,
            items: activities.value.filter((activity) => activity.type === key && matches(activity))
        }))
        .filter((group) => group.items.length > 0)
})

const clearFilters = () => {
    search.value = ''
    filter.value = 'all'
    hideInactive.value = false
}

// ---- Edit dialog ----
const dialogRef = ref(null)
const editingId = ref(null)
const editorLoading = ref(false)
const saving = ref(false)
const formError = ref('')
const fieldErrors = ref({})
const hasTarget = ref(false)
const initialSnapshot = ref('')

const form = reactive({
    name: '',
    description: '',
    type: '',
    reset_type: '',
    status: 'active',
    target_count: 1
})

const titleCase = (value) => value.charAt(0).toUpperCase() + value.slice(1)

// Known values first, plus anything already used in your data
const optionsFor = (base, key) => [
    ...new Set([...base, ...activities.value.map((activity) => activity[key]).filter(Boolean)])
]

const typeOptions = computed(() => optionsFor(['daily', 'weekly', 'instance'], 'type'))
const resetOptions = computed(() => optionsFor(['daily', 'weekly'], 'reset_type'))
const statusOptions = computed(() => optionsFor(['active', 'inactive'], 'status'))

const errorOf = (field) => fieldErrors.value[field]?.[0]

const buildPayload = () => {
    const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        type: form.type,
        reset_type: form.reset_type,
        status: form.status
    }

    if (hasTarget.value) {
        payload.target_count = Number(form.target_count)
    }

    return payload
}

const isDirty = computed(() => JSON.stringify(buildPayload()) !== initialSnapshot.value)

const fillForm = (record) => {
    form.name = record.name ?? ''
    form.description = record.description ?? ''
    form.type = record.type ?? ''
    form.reset_type = record.reset_type ?? ''
    form.status = record.status ?? 'active'
    hasTarget.value = record.target_count !== undefined && record.target_count !== null
    form.target_count = record.target_count ?? 1

    initialSnapshot.value = JSON.stringify(buildPayload())
}

const openEditor = async (activity) => {
    editingId.value = activity.id
    formError.value = ''
    fieldErrors.value = {}
    editorLoading.value = true
    dialogRef.value.showModal()

    try {
        // Fetch the full record so nothing editable is missing from the list row
        const response = await activityApi.getActivity(activity.id)

        fillForm(response.data)
    } catch (error) {
        console.error('Failed to fetch activity:', error)
        fillForm(activity)
    } finally {
        editorLoading.value = false
    }
}

const resetEditor = () => {
    editingId.value = null
    saving.value = false
}

// Clicking the dim backdrop closes the dialog, unless that would throw away edits
const onBackdropClick = (event) => {
    if (event.target === dialogRef.value && !isDirty.value && !saving.value) {
        dialogRef.value.close()
    }
}

const saveActivity = async () => {
    if (saving.value || editorLoading.value || !isDirty.value) {
        return
    }

    saving.value = true
    formError.value = ''
    fieldErrors.value = {}

    let saved = false

    try {
        await activityApi.updateActivity(editingId.value, buildPayload())
        saved = true
    } catch (error) {
        console.error('Failed to update activity:', error)

        if (error.response?.status === 422) {
            fieldErrors.value = error.response.data?.errors ?? {}
            formError.value = 'Check the highlighted fields and try again.'
        } else {
            formError.value = "Couldn't save changes. Try again."
        }
    } finally {
        saving.value = false
    }

    if (saved) {
        dialogRef.value.close()
        await fetchActivities({ silent: true })
    }
}

// silent = refresh in place without the "Loading..." state
const fetchActivities = async ({ silent = false } = {}) => {
    try {
        if (!silent) {
            loading.value = true
            loadError.value = false
            startLoading()
        }

        const response = await activityApi.getActivities()

        activities.value = response.data
    } catch (error) {
        if (!silent) {
            loadError.value = true
        }

        console.error('Failed to fetch activities:', error)
    } finally {
        if (!silent) {
            loading.value = false
            stopLoading()
        }
    }
}

onMounted(() => {
    fetchActivities()
})
</script>