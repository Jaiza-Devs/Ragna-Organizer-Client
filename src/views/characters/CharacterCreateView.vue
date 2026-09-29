<template>
    <div class="p-6">
        <div class="mx-auto max-w-xl">
            <div class="rounded-xl bg-white p-6 shadow-sm">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-800">
                            Add Character
                        </h1>

                        <p class="mt-1 text-sm text-slate-500">
                            Add a character to this account.
                        </p>
                    </div>

                    <button type="button" class="text-sm text-slate-500 hover:text-slate-800" @click="router.back()">
                        Back
                    </button>
                </div>

                <form class="mt-6 space-y-4" @submit.prevent="submit">
                    <div>
                        <label class="block text-sm font-medium text-slate-700">
                            Character Name
                        </label>

                        <input v-model="form.character_name" type="text" placeholder="My Character"
                            class="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500"
                            required>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700">
                            Server
                        </label>

                        <input v-model="form.server" type="text" placeholder="Thor"
                            class="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500"
                            required>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700">
                            Class
                        </label>

                        <input v-model="form.class" type="text" placeholder="Lord Knight"
                            class="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500"
                            required>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700">
                                Level
                            </label>

                            <input v-model.number="form.level" type="number" min="1" placeholder="1"
                                class="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500"
                                required>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-700">
                                Job Level
                            </label>

                            <input v-model.number="form.job_level" type="number" min="1" placeholder="1"
                                class="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500"
                                required>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700">
                            Status
                        </label>

                        <select v-model="form.status"
                            class="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500">
                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700">
                            Notes
                        </label>

                        <textarea v-model="form.notes" rows="4" placeholder="Main farming character"
                            class="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500"></textarea>
                    </div>

                    <button type="submit"
                        class="w-full rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        :disabled="loading">
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