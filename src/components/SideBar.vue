<template>
    <aside class="nw-sidebar">
        <div class="nw-card flex flex-1 flex-col">
            <!-- Header -->
            <header class="nw-card-header flex items-center gap-3 px-4 py-4">
                <div class="nw-avatar text-xl" aria-hidden="true">R</div>
                <div class="leading-tight">
                    <h1 class="nw-card-title text-base">Ragna Organizer</h1>
                    <p class="nw-card-sub text-xs">Adventurer's board</p>
                </div>
            </header>

            <!-- Menu -->
            <nav class="flex flex-1 flex-col gap-2 p-3" aria-label="Main">
                <router-link v-for="item in items" :key="item.to" :to="item.to" class="nw-item" active-class=""
                    exact-active-class="nw-item-active">
                    <span class="nw-icon" aria-hidden="true">{{ item.icon }}</span>
                    {{ item.label }}
                </router-link>
            </nav>

            <!-- Clock card fills the leftover height -->
            <div
                class="mx-3 mb-3 rounded-[14px] border border-[#bcd7f3] bg-linear-to-b from-[#eaf4ff] to-nw-sky-light px-4 py-3 shadow-[inset_0_1px_0_#fff]">
                <p class="nw-muted text-xs font-semibold">Today</p>
                <p class="text-2xl font-extrabold tabular-nums text-nw-navy">{{ time }}</p>
                <p class="nw-value text-xs">{{ date }}</p>
            </div>

            <!-- Settings, pinned to the bottom -->
            <div class="mx-3 mb-3 border-t border-nw-line-strong pt-3">
                <router-link to="/" class="nw-item" active-class="" exact-active-class="nw-item-active">
                    <span class="nw-icon" aria-hidden="true">⚙️</span>
                    Settings
                </router-link>
            </div>

        </div>
    </aside>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const time = ref('')
const date = ref('')
let timer

function tick() {
    const now = new Date()
    time.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    date.value = now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })
}

onMounted(() => {
    tick()
    timer = setInterval(tick, 1000 * 15)
})
onBeforeUnmount(() => clearInterval(timer))

const items = [
    { to: '/', label: 'Dashboard', icon: '🏰' },
    { to: '/accounts', label: 'Accounts', icon: '👤' },
    { to: '/activities', label: 'Activities', icon: '⚔️' },
    { to: '/currencies', label: 'Currencies', icon: '🪙' },
]
</script>