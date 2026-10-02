<template>
    <aside class="w-64 shrink-0 bg-slate-900 text-white">
        <div class="flex h-16 items-center px-6">
            <h1 class="text-xl font-bold">
                Ragna Organizer
            </h1>
        </div>

        <nav class="px-3 py-4">
            <router-link to="/" class="block rounded-lg px-4 py-3 text-sm font-medium hover:bg-slate-800">
                Dashboard
            </router-link>

            <router-link to="/accounts" class="mt-1 block rounded-lg px-4 py-3 text-sm font-medium hover:bg-slate-800">
                Accounts
            </router-link>

            <router-link to="/activities"
                class="mt-1 block rounded-lg px-4 py-3 text-sm font-medium hover:bg-slate-800">
                Activities
            </router-link>

            <router-link to="/currencies"
                class="mt-1 block rounded-lg px-4 py-3 text-sm font-medium hover:bg-slate-800">
                Currencies
            </router-link>
        </nav>
    </aside>
</template>

<script setup>
</script>