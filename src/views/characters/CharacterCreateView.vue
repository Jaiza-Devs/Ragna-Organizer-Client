<template>
    <div class="nw-page">
        <div class="mx-auto max-w-xl">
            <div class="nw-card">
                <!-- Header -->
                <header class="nw-card-header flex items-center gap-3 px-5 py-4">
                    <div class="nw-avatar" aria-hidden="true">⚔️</div>

                    <div class="min-w-0 flex-1">
                        <h1 class="nw-card-title text-xl font-extrabold">
                            Add Character
                        </h1>

                        <p class="nw-card-sub text-xs">
                            Add a character to this account.
                        </p>
                    </div>

                    <button type="button" class="nw-btn nw-btn-light" @click="router.back()">
                        Back
                    </button>
                </header>

                <!-- Form -->
                <form class="space-y-4 p-5" @submit.prevent="submit">
                    <div>
                        <label for="character_name" class="nw-label">Character Name</label>
                        <input id="character_name" v-model="form.character_name" type="text" placeholder="My Character"
                            class="nw-input" required>
                    </div>

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label for="server" class="nw-label">Server</label>
                            <input id="server" v-model="form.server" type="text" placeholder="Thor" class="nw-input"
                                required>
                        </div>

                        <div>
                            <label for="class" class="nw-label">Class</label>
                            <input id="class" v-model="form.class" type="text" placeholder="Lord Knight"
                                class="nw-input" required>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="level" class="nw-label">Level</label>
                            <input id="level" v-model.number="form.level" type="number" min="1" placeholder="1"
                                class="nw-input" required>
                        </div>

                        <div>
                            <label for="job_level" class="nw-label">Job Level</label>
                            <input id="job_level" v-model.number="form.job_level" type="number" min="1" placeholder="1"
                                class="nw-input" required>
                        </div>
                    </div>

                    <div>
                        <label for="status" class="nw-label">Status</label>
                        <select id="status" v-model="form.status" class="nw-input nw-select">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div>
                        <label for="notes" class="nw-label">Notes</label>
                        <textarea id="notes" v-model="form.notes" rows="4" placeholder="Main farming character"
                            class="nw-input"></textarea>
                    </div>

                    <button type="submit" class="nw-btn nw-btn-gold w-full py-3 text-base" :disabled="loading">
                        {{ loading ? 'Adding...' : 'Add Character' }}
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import characterApi from '@/api/characters'

const route = useRoute()
const router = useRouter()

const loading = ref(false)

const form = reactive({
    account_id: route.params.id,
    character_name: '',
    server: '',
    class: '',
    level: 1,
    job_level: 1,
    status: 'active',
    notes: ''
})

const submit = async () => {
    try {
        loading.value = true

        await characterApi.createCharacter(form)

        router.push(`/accounts/${route.params.id}`)
    } catch (error) {
        console.error('Failed to create character:', error)
    } finally {
        loading.value = false
    }
}
</script>