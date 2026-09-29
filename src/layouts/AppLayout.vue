<template>
    <div class="min-h-screen bg-slate-100">
        <div v-if="sidebarOpen" class="fixed inset-0 z-40 bg-slate-900/50 lg:hidden" @click="sidebarOpen = false"></div>

        <div class="flex min-h-screen">
            <aside
                class="fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-900 text-white transition-transform duration-200 lg:static lg:translate-x-0"
                :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'">
                <AppSidebar @close="sidebarOpen = false" />
            </aside>

            <main class="min-w-0 flex-1">
                <div class="flex h-16 items-center border-b border-slate-200 bg-white px-4 lg:hidden">
                    <button type="button" class="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                        @click="sidebarOpen = true">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="h-6 w-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>

                <router-view />
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import AppSidebar from '@/components/SideBar.vue'

const sidebarOpen = ref(false)
</script>