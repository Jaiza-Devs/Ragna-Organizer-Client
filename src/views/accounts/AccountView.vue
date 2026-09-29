<template>
    <div class="p-6">
        <div class="mx-auto max-w-5xl">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-slate-800">
                        {{ account?.account_name || 'Account' }}
                    </h1>

                    <p class="mt-1 text-sm text-slate-500">
                        Account details and characters.
                    </p>
                </div>

                <button type="button" class="text-sm text-slate-500 hover:text-slate-800"
                    @click="router.push('/accounts')">
                    Back to Accounts
                </button>
            </div>

            <div v-if="loading" class="mt-6 rounded-xl bg-white p-6 shadow-sm">
                <p class="text-sm text-slate-500">
                    Loading account...
                </p>
            </div>

            <div v-else-if="account" class="mt-6 space-y-6">
                <div class="rounded-xl bg-white p-6 shadow-sm">
                    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Account Name
                            </p>

                            <p class="mt-1 font-medium text-slate-800">
                                {{ account.account_name }}
                            </p>
                        </div>

                        <div>
                            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Status
                            </p>

                            <span class="mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-medium" :class="account.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-slate-100 text-slate-500'">
                                {{ account.status }}
                            </span>
                        </div>

                        <div>
                            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Server
                            </p>

                            <p class="mt-1 font-medium text-slate-800">
                                {{ account.server }}
                            </p>
                        </div>

                        <div>
                            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Username
                            </p>

                            <p class="mt-1 font-medium text-slate-800">
                                {{ account.username }}
                            </p>
                        </div>

                        <div>
                            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Assigned User
                            </p>

                            <p class="mt-1 font-medium text-slate-800">
                                {{ account.assigned_user }}
                            </p>
                        </div>

                        <div>
                            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Notes
                            </p>

                            <p class="mt-1 text-slate-700">
                                {{ account.notes || 'No notes.' }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="rounded-xl bg-white p-6 shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-lg font-semibold text-slate-800">
                                Characters
                            </h2>

                            <p class="mt-1 text-sm text-slate-500">
                                Characters belonging to this account.
                            </p>
                        </div>

                        <button type="button"
                            class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                            @click="router.push(`/accounts/${account.id}/characters/create`)">
                            Add Character
                        </button>
                    </div>

                    <div v-if="characters.length === 0" class="mt-6">
                        <p class="text-sm text-slate-500">
                            No characters yet.
                        </p>
                    </div>

                    <div v-else class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div v-for="character in characters" :key="character.id"
                            class="rounded-lg border border-slate-200 p-4">
                            <div class="flex items-start justify-between gap-4">
                                <div>
                                    <h3 class="font-semibold text-slate-800">
                                        {{ character.character_name }}
                                    </h3>

                                    <p class="mt-1 text-sm text-slate-500">
                                        {{ character.class }}
                                    </p>
                                </div>

                                <span class="rounded-full px-2.5 py-1 text-xs font-medium" :class="character.status === 'active'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-slate-100 text-slate-500'">
                                    {{ character.status }}
                                </span>
                            </div>

                            <div class="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                                <div>
                                    <p class="text-xs text-slate-400">
                                        Level
                                    </p>

                                    <p class="mt-1 text-sm font-medium text-slate-700">
                                        {{ character.level }}
                                    </p>
                                </div>

                                <div>
                                    <p class="text-xs text-slate-400">
                                        Job Level
                                    </p>

                                    <p class="mt-1 text-sm font-medium text-slate-700">
                                        {{ character.job_level }}
                                    </p>
                                </div>

                                <div>
                                    <p class="text-xs text-slate-400">
                                        Server
                                    </p>

                                    <p class="mt-1 text-sm font-medium text-slate-700">
                                        {{ character.server }}
                                    </p>
                                </div>

                                <div>
                                    <p class="text-xs text-slate-400">
                                        Notes
                                    </p>

                                    <p class="mt-1 truncate text-sm font-medium text-slate-700">
                                        {{ character.notes || 'None' }}
                                    </p>
                                </div>
                            </div>

                            <button type="button"
                                class="mt-4 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                @click="router.push(`/accounts/${account.id}/characters/${character.id}`)">
                                View Character
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="mt-6 rounded-xl bg-white p-6 shadow-sm">
                <p class="text-sm text-slate-500">
                    Account not found.
                </p>
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
        startLoading()

        await Promise.all([
            fetchAccount(),
            fetchCharacters()
        ])
    } finally {
        stopLoading()
    }
}

onMounted(() => {
    fetchData()
})
</script>