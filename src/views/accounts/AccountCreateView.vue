<template>
    <div class="p-6">
        <div class="mx-auto max-w-xl">
            <div class="rounded-xl bg-white p-6 shadow-sm">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-800">
                            Add Account
                        </h1>

                        <p class="mt-1 text-sm text-slate-500">
                            Add a Ragna account to your organizer.
                        </p>
                    </div>

                    <button type="button" class="text-sm text-slate-500 hover:text-slate-800" @click="$router.back()">
                        Back
                    </button>
                </div>

                <form class="mt-6 space-y-4" @submit.prevent="submit">
                    <div>
                        <label class="block text-sm font-medium text-slate-700">
                            Account Name
                        </label>

                        <input v-model="form.account_name" type="text" placeholder="Main Account"
                            class="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500"
                            required>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700">
                            Assigned User
                        </label>

                        <input v-model="form.assigned_user" type="text" placeholder="Jake"
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
                            Username
                        </label>

                        <input v-model="form.username" type="text" placeholder="jake123"
                            class="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500"
                            required>
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

                        <textarea v-model="form.notes" rows="4" placeholder="Main farming account"
                            class="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500"></textarea>
                    </div>

                    <button type="submit"
                        class="w-full rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        :disabled="loading">
                        {{ loading ? 'Adding...' : 'Add Account' }}
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import accountApi from '@/api/accounts'

const router = useRouter()

const loading = ref(false)

const form = reactive({
    account_name: '',
    assigned_user: '',
    server: '',
    username: '',
    status: 'active',
    notes: ''
})

const submit = async () => {
    try {
        loading.value = true

        await accountApi.createAccount(form)

        router.push('/accounts')
    } catch (error) {
        console.error('Failed to create account:', error)
    } finally {
        loading.value = false
    }
}
</script>