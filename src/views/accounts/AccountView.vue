<template>
    <div class="nw-page">
        <div class="mx-auto max-w-5xl">
            <!-- Page header -->
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 class="nw-heading text-2xl font-extrabold">
                        {{ account?.account_name || 'Account' }}
                    </h1>

                    <p class="nw-muted mt-1 text-sm">
                        Account details and characters.
                    </p>
                </div>

                <button type="button" class="nw-btn nw-btn-ghost" @click="router.push('/accounts')">
                    ← Back to Accounts
                </button>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="nw-card mt-6 px-5 py-4 text-sm nw-muted">
                Loading account...
            </div>

            <div v-else-if="account" class="mt-6 space-y-6">
                <!-- Account details -->
                <section class="nw-card">
                    <header class="nw-card-header flex items-center gap-3 px-5 py-4">
                        <div class="nw-avatar" aria-hidden="true">
                            {{ initial(account.account_name) }}
                        </div>

                        <div class="min-w-0 flex-1">
                            <h2 class="nw-card-title truncate text-lg font-bold">
                                {{ account.account_name }}
                            </h2>

                            <p class="nw-card-sub truncate text-xs">
                                {{ account.server }}
                            </p>
                        </div>

                        <span class="nw-status" :class="account.status === 'active' ? 'nw-status-active' : ''">
                            {{ account.status }}
                        </span>
                    </header>

                    <div class="grid grid-cols-1 gap-3 p-5 md:grid-cols-3">
                        <div class="nw-tile">
                            <p class="nw-muted text-xs font-semibold">Server</p>
                            <p class="nw-value mt-0.5 font-bold">{{ account.server }}</p>
                        </div>

                        <div class="nw-tile">
                            <p class="nw-muted text-xs font-semibold">Username</p>
                            <p class="nw-value mt-0.5 break-all font-bold">{{ account.username }}</p>
                        </div>

                        <div class="nw-tile">
                            <p class="nw-muted text-xs font-semibold">Assigned User</p>
                            <p class="nw-value mt-0.5 font-bold">{{ account.assigned_user }}</p>
                        </div>

                        <div class="nw-tile md:col-span-3">
                            <p class="nw-muted text-xs font-semibold">Notes</p>
                            <p class="nw-value mt-0.5 text-sm">{{ account.notes || 'No notes.' }}</p>
                        </div>
                    </div>
                </section>

                <!-- Characters -->
                <section class="nw-card">
                    <header class="nw-card-header flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                        <div>
                            <h2 class="nw-card-title text-lg font-bold">
                                Characters
                            </h2>

                            <p class="nw-card-sub text-xs">
                                Characters belonging to this account.
                            </p>
                        </div>

                        <button type="button" class="nw-btn nw-btn-gold"
                            @click="router.push(`/accounts/${account.id}/characters/create`)">
                            <span class="text-base leading-none" aria-hidden="true">+</span>
                            Add Character
                        </button>
                    </header>

                    <div class="p-5">
                        <!-- Empty -->
                        <div v-if="characters.length === 0" class="flex flex-col items-center px-4 py-8 text-center">
                            <div class="nw-avatar nw-avatar-lg" aria-hidden="true">⚔️</div>
                            <p class="nw-heading mt-4 font-bold">No characters yet</p>
                            <p class="nw-muted mt-1 text-sm">Add a character to start tracking its level and activities.
                            </p>
                        </div>

                        <!-- Character cards -->
                        <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <article v-for="character in characters" :key="character.id" class="nw-char">
                                <header class="nw-char-header">
                                    <div class="nw-avatar nw-avatar-sky" aria-hidden="true">
                                        {{ initial(character.character_name) }}
                                    </div>

                                    <div class="min-w-0 flex-1">
                                        <h3 class="nw-heading truncate font-bold">
                                            {{ character.character_name }}
                                        </h3>

                                        <p class="nw-muted truncate text-xs font-semibold">
                                            {{ character.class }}
                                        </p>
                                    </div>

                                    <span class="nw-status"
                                        :class="character.status === 'active' ? 'nw-status-active' : ''">
                                        {{ character.status }}
                                    </span>
                                </header>

                                <div class="flex flex-1 flex-col p-4">
                                    <div class="grid grid-cols-2 gap-2">
                                        <div class="nw-tile nw-tile-sm">
                                            <p class="nw-muted text-xs font-semibold">Level</p>
                                            <p class="nw-value text-sm font-bold">{{ character.level }}</p>
                                        </div>

                                        <div class="nw-tile nw-tile-sm">
                                            <p class="nw-muted text-xs font-semibold">Job Level</p>
                                            <p class="nw-value text-sm font-bold">{{ character.job_level }}</p>
                                        </div>

                                        <div class="nw-tile nw-tile-sm">
                                            <p class="nw-muted text-xs font-semibold">Server</p>
                                            <p class="nw-value truncate text-sm font-bold">{{ character.server }}</p>
                                        </div>

                                        <div class="nw-tile nw-tile-sm">
                                            <p class="nw-muted text-xs font-semibold">Notes</p>
                                            <p class="nw-value truncate text-sm font-bold">
                                                {{ character.notes || 'None' }}
                                            </p>
                                        </div>
                                    </div>

                                    <button type="button" class="nw-btn nw-btn-sky mt-4 w-full"
                                        @click="router.push(`/accounts/${account.id}/characters/${character.id}`)">
                                        View Character
                                    </button>
                                </div>
                            </article>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Not found -->
            <div v-else class="nw-card mt-6 px-5 py-4 text-sm nw-muted">
                Account not found.
            </div>
        </div>
    </div>
</template>

<script setup>

import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import accountApi from '@/api/accounts'
import characterApi from '@/api/characters'
import useLoading from '@/composables/useLoading'

const route = useRoute()
const router = useRouter()

const { startLoading, stopLoading } = useLoading()

const account = ref(null)
const characters = ref([])
// The template uses `loading`, but it was never defined before.
const loading = ref(true)

const initial = (name) => (name ? name.trim().charAt(0).toUpperCase() : '?')

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