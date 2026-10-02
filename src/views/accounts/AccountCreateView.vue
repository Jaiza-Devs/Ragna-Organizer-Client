<template>
    <div class="nw-page">
        <div class="mx-auto max-w-xl">
            <div class="nw-card">
                <!-- Header -->
                <header class="nw-card-header flex items-center gap-3 px-5 py-4">
                    <div class="nw-avatar" aria-hidden="true">+</div>

                    <div class="min-w-0 flex-1">
                        <h1 class="nw-card-title text-xl font-extrabold">
                            Add Account
                        </h1>

                        <p class="nw-card-sub text-xs">
                            Add a Ragna account to your organizer.
                        </p>
                    </div>

                    <button type="button" class="nw-btn nw-btn-light" @click="$router.back()">
                        Back
                    </button>
                </header>

                <!-- Form -->
                <form class="space-y-4 p-5" @submit.prevent="submit">
                    <div>
                        <label for="account_name" class="nw-label">Account Name</label>
                        <input id="account_name" v-model="form.account_name" type="text" placeholder="Main Account"
                            class="nw-input" required>
                    </div>

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label for="assigned_user" class="nw-label">Assigned User</label>
                            <input id="assigned_user" v-model="form.assigned_user" type="text" placeholder="Jake"
                                class="nw-input" required>
                        </div>

                        <div>
                            <label for="server" class="nw-label">Server</label>
                            <input id="server" v-model="form.server" type="text" placeholder="Thor" class="nw-input"
                                required>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label for="username" class="nw-label">Username</label>
                            <input id="username" v-model="form.username" type="text" placeholder="jake123"
                                class="nw-input" required>
                        </div>

                        <div>
                            <label for="status" class="nw-label">Status</label>
                            <select id="status" v-model="form.status" class="nw-input nw-select">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label for="notes" class="nw-label">Notes</label>
                        <textarea id="notes" v-model="form.notes" rows="4" placeholder="Main farming account"
                            class="nw-input"></textarea>
                    </div>

                    <button type="submit" class="nw-btn nw-btn-gold w-full py-3 text-base" :disabled="loading">
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