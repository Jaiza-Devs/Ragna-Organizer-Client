<template>
    <div class="nw-page">
        <div class="mx-auto max-w-6xl">
            <!-- Page header -->
            <div class="flex flex-col gap-3">
                <button type="button" class="nw-muted w-fit text-xs font-semibold transition-colors hover:underline"
                    @click="router.push('/accounts')">
                    ← Back to Accounts
                </button>

                <div class="flex items-center gap-3">
                    <div class="nw-avatar shrink-0" aria-hidden="true">
                        {{ initial(account?.account_name) }}
                    </div>

                    <div class="min-w-0 flex-1">
                        <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <h1 class="nw-heading truncate text-xl font-extrabold sm:text-2xl">
                                {{ account?.account_name || 'Account' }}
                            </h1>

                            <span v-if="account" class="nw-status"
                                :class="account.status === 'active' ? 'nw-status-active' : ''">
                                {{ account.status }}
                            </span>
                        </div>

                        <p class="nw-muted truncate text-xs sm:text-sm">
                            {{ account?.server || 'Account details and characters.' }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="nw-card mt-5 px-4 py-3 text-sm nw-muted">
                Loading account...
            </div>

            <!-- Two-column layout: details sidebar + characters -->
            <div v-else-if="account" class="mt-5 grid gap-4 lg:grid-cols-3 lg:items-start">
                <!-- Account details (sidebar) -->
                <aside class="lg:sticky lg:top-4">
                    <section class="nw-card transition-shadow duration-150"
                        :class="editing ? 'ring-2 ring-sky-500/40' : ''">
                        <header class="nw-card-header flex items-center justify-between gap-3 px-4 py-3">
                            <div class="min-w-0">
                                <h2 class="nw-card-title truncate text-base font-bold">
                                    {{ editing ? 'Edit account' : 'Account details' }}
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
                            <dl class="divide-y divide-current/10 px-4">
                                <div class="flex items-baseline justify-between gap-4 py-2.5">
                                    <dt class="nw-muted shrink-0 text-xs font-semibold">Server</dt>
                                    <dd class="nw-value min-w-0 truncate text-sm font-bold">{{ account.server }}</dd>
                                </div>

                                <div class="flex items-baseline justify-between gap-4 py-2.5">
                                    <dt class="nw-muted shrink-0 text-xs font-semibold">Username</dt>
                                    <dd class="nw-value min-w-0 truncate text-sm font-bold" :title="account.username">
                                        {{ account.username }}
                                    </dd>
                                </div>

                                <div class="flex items-baseline justify-between gap-4 py-2.5">
                                    <dt class="nw-muted shrink-0 text-xs font-semibold">Assigned user</dt>
                                    <dd class="nw-value min-w-0 truncate text-sm font-bold">
                                        {{ account.assigned_user }}
                                    </dd>
                                </div>

                                <div class="py-2.5">
                                    <dt class="nw-muted text-xs font-semibold">Notes</dt>
                                    <dd class="nw-value mt-1 whitespace-pre-line break-words text-sm">
                                        {{ account.notes || 'No notes.' }}
                                    </dd>
                                </div>
                            </dl>

                            <!-- Status action -->
                            <footer
                                class="nw-card-header flex flex-wrap items-center justify-between gap-3 border-t px-4 py-2.5">
                                <p class="nw-muted text-xs">
                                    {{ account.status === 'active' ? 'Account is active.' : 'Account is inactive.' }}
                                </p>

                                <button type="button" class="nw-btn text-sm" :class="account.status === 'active'
                                    ? 'nw-btn-ghost text-red-500 hover:bg-red-500/10'
                                    : 'nw-btn-gold'" :disabled="updatingStatus" @click="toggleStatus">
                                    {{ updatingStatus
                                        ? 'Updating...'
                                        : account.status === 'active'
                                            ? 'Deactivate'
                                            : 'Activate'
                                    }}
                                </button>
                            </footer>
                        </template>

                        <!-- Edit mode -->
                        <form v-else novalidate @submit.prevent="saveAccount" @keydown.esc="cancelEditing">
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

                                <div>
                                    <label for="field-notes"
                                        class="nw-muted block text-[11px] font-semibold uppercase tracking-wide">
                                        Notes
                                        <span class="font-normal normal-case tracking-normal">(optional)</span>
                                    </label>

                                    <textarea id="field-notes" v-model="editForm.notes" rows="3"
                                        class="nw-input mt-1 w-full resize-none"
                                        placeholder="Anything worth remembering about this account"></textarea>
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
                </aside>

                <!-- Characters -->
                <section class="nw-card lg:col-span-2">
                    <header class="nw-card-header flex items-center justify-between gap-3 px-4 py-3">
                        <div class="flex items-center gap-2">
                            <h2 class="nw-card-title text-base font-bold">Characters</h2>
                            <span class="nw-status">{{ characters.length }}</span>
                        </div>

                        <button type="button" class="nw-btn nw-btn-gold text-sm"
                            @click="router.push(`/accounts/${account.id}/characters/create`)">
                            <span class="text-base leading-none" aria-hidden="true">+</span>
                            Add Character
                        </button>
                    </header>

                    <div class="p-4">
                        <!-- Empty -->
                        <div v-if="characters.length === 0" class="flex flex-col items-center px-4 py-10 text-center">
                            <div class="nw-avatar nw-avatar-lg" aria-hidden="true">⚔️</div>
                            <p class="nw-heading mt-3 font-bold">No characters yet</p>
                            <p class="nw-muted mt-1 text-sm">
                                Add a character to start tracking its level and activities.
                            </p>
                        </div>

                        <!-- Character cards -->
                        <div v-else class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <RouterLink v-for="character in characters" :key="character.id"
                                :to="`/accounts/${account.id}/characters/${character.id}`"
                                class="nw-char group relative flex flex-col gap-3 p-3 no-underline transition duration-150 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                                <!-- Identity + status -->
                                <div class="flex items-center gap-3">
                                    <div class="nw-avatar nw-avatar-sky shrink-0" aria-hidden="true">
                                        {{ initial(character.character_name) }}
                                    </div>

                                    <div class="min-w-0 flex-1">
                                        <h3 class="nw-heading truncate text-sm font-bold leading-tight">
                                            {{ character.character_name }}
                                        </h3>
                                        <p class="nw-muted truncate text-xs font-semibold">
                                            {{ character.class }}
                                        </p>
                                    </div>

                                    <span class="nw-status shrink-0"
                                        :class="character.status === 'active' ? 'nw-status-active' : ''">
                                        {{ character.status }}
                                    </span>
                                </div>

                                <!-- Stats strip -->
                                <div
                                    class="grid grid-cols-3 divide-x divide-current/10 rounded-lg bg-current/5 py-1.5 text-center">
                                    <div class="px-2">
                                        <p class="nw-muted text-[10px] font-semibold uppercase tracking-wide">Lv</p>
                                        <p class="nw-value text-sm font-extrabold tabular-nums">
                                            {{ character.level }}
                                        </p>
                                    </div>

                                    <div class="px-2">
                                        <p class="nw-muted text-[10px] font-semibold uppercase tracking-wide">Job</p>
                                        <p class="nw-value text-sm font-extrabold tabular-nums">
                                            {{ character.job_level }}
                                        </p>
                                    </div>

                                    <div class="min-w-0 px-2">
                                        <p class="nw-muted text-[10px] font-semibold uppercase tracking-wide">
                                            Server
                                        </p>
                                        <p class="nw-value truncate text-sm font-bold">
                                            {{ character.server }}
                                        </p>
                                    </div>
                                </div>

                                <!-- Notes + arrow -->
                                <div class="flex items-center justify-between gap-2 text-xs">
                                    <p class="nw-muted min-w-0 flex-1 truncate" :title="character.notes">
                                        {{ character.notes || 'No notes' }}
                                    </p>

                                    <span
                                        class="nw-value shrink-0 font-semibold transition-transform group-hover:translate-x-0.5"
                                        aria-hidden="true">
                                        View →
                                    </span>
                                </div>
                            </RouterLink>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Not found -->
            <div v-else class="nw-card mt-5 px-4 py-3 text-sm nw-muted">
                Account not found.
            </div>
        </div>
    </div>
</template>

<script setup>

import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import accountApi from '@/api/accounts'
import characterApi from '@/api/characters'
import useLoading from '@/composables/useLoading'

const route = useRoute()
const router = useRouter()

const { startLoading, stopLoading } = useLoading()

const account = ref(null)
const characters = ref([])
const loading = ref(true)
const updatingStatus = ref(false)
const editing = ref(false)
const saving = ref(false)

const editForm = ref({
    account_name: '',
    server: '',
    username: '',
    assigned_user: '',
    notes: ''
})

const fields = [
    { key: 'account_name', label: 'Account Name', placeholder: 'Account name', required: true },
    { key: 'server', label: 'Server', placeholder: 'Server', required: false },
    { key: 'username', label: 'Username', placeholder: 'Username', required: true },
    { key: 'assigned_user', label: 'Assigned User', placeholder: 'Assigned user', required: false }
]

const initial = (name) => (name ? name.trim().charAt(0).toUpperCase() : '?')

// True when the form differs from the saved account
const isDirty = computed(() => {
    if (!account.value) return false

    return Object.keys(editForm.value).some(
        (key) => (editForm.value[key] ?? '') !== (account.value[key] ?? '')
    )
})

// Required fields must not be blank
const isValid = computed(() =>
    fields
        .filter((field) => field.required)
        .every((field) => String(editForm.value[field.key] ?? '').trim() !== '')
)

const startEditing = async () => {
    editForm.value = {
        account_name: account.value.account_name || '',
        server: account.value.server || '',
        username: account.value.username || '',
        assigned_user: account.value.assigned_user || '',
        notes: account.value.notes || ''
    }

    editing.value = true

    await nextTick()
    document.getElementById('field-account_name')?.focus()
}

const cancelEditing = () => {
    editing.value = false
}

const saveAccount = async () => {
    if (!isDirty.value || !isValid.value) return

    try {
        saving.value = true
        startLoading()

        const response = await accountApi.updateAccount(
            account.value.id,
            editForm.value
        )

        account.value = response.data
        editing.value = false
    } catch (error) {
        console.error('Failed to update account:', error)
    } finally {
        saving.value = false
        stopLoading()
    }
}

const fetchAccount = async () => {
    try {
        const response = await accountApi.getAccount(route.params.id)

        account.value = response.data
    } catch (error) {
        console.error('Failed to fetch account:', error)
    }
}

const fetchCharacters = async () => {
    try {
        const response = await characterApi.getCharacters()

        characters.value = response.data.filter(
            (character) => String(character.account_id) === String(route.params.id)
        )
    } catch (error) {
        console.error('Failed to fetch characters:', error)
    }
}

const toggleStatus = async () => {
    try {
        updatingStatus.value = true
        startLoading()

        const status = account.value.status === 'active'
            ? 'inactive'
            : 'active'

        const response = await accountApi.updateAccountStatus(
            account.value.id,
            status
        )

        account.value = response.data
    } catch (error) {
        console.error('Failed to update account status:', error)
    } finally {
        updatingStatus.value = false
        stopLoading()
    }
}

const fetchData = async () => {
    try {
        loading.value = true
        startLoading()

        await Promise.all([
            fetchAccount(),
            fetchCharacters()
        ])
    } finally {
        loading.value = false
        stopLoading()
    }
}

onMounted(() => {
    fetchData()
})
</script>