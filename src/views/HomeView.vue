<template>
    <div class="nw-page p-3 sm:p-6 lg:p-8">
        <div class="mx-auto max-w-7xl space-y-4">
            <!-- Page header -->
            <div class="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 class="nw-heading text-xl font-extrabold sm:text-2xl">Dashboard</h1>
                    <p class="nw-muted text-xs sm:text-sm">Track your daily and weekly activities.</p>
                </div>

                <!-- View controls -->
                <div v-if="!loading && !loadError" class="flex flex-wrap items-center gap-2">
                    <div class="inline-flex rounded-full border border-nw-line-strong bg-white p-0.5" role="group"
                        aria-label="Group activities by">
                        <button v-for="option in groupOptions" :key="option.value" type="button"
                            :aria-pressed="groupBy === option.value"
                            class="rounded-full px-3 py-1 text-[0.8125rem] font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nw-gold"
                            :class="groupBy === option.value
                                ? 'bg-nw-grad-gold text-white'
                                : 'text-nw-text hover:bg-nw-sky-light'" @click="groupBy = option.value">
                            {{ option.label }}
                        </button>
                    </div>

                    <button type="button" class="nw-btn nw-btn-ghost px-3 py-1 text-[0.8125rem]"
                        :class="pendingOnly ? 'bg-nw-sky-light' : ''" :aria-pressed="pendingOnly"
                        @click="pendingOnly = !pendingOnly">
                        {{ pendingOnly ? '✓ ' : '' }}Pending only
                    </button>
                </div>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="nw-card px-4 py-6 text-center text-sm nw-muted">
                Loading dashboard...
            </div>

            <!-- Error: without this the page would show a misleading wall of zeros -->
            <div v-else-if="loadError" class="nw-card flex flex-col items-center px-6 py-10 text-center">
                <p class="nw-heading font-bold">Couldn't load the dashboard</p>
                <p class="nw-muted mt-1 text-sm">Check your connection and try again.</p>
                <button type="button" class="nw-btn nw-btn-sky mt-4" @click="fetchDashboard">
                    Try again
                </button>
            </div>

            <template v-else>
                <!-- Stat tiles -->
                <section class="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <div v-for="tile in statTiles" :key="tile.label" class="nw-card min-w-0 p-4">
                        <p class="nw-muted text-xs font-semibold">{{ tile.label }}</p>

                        <p class="mt-1 truncate text-xl font-extrabold tabular-nums sm:text-2xl"
                            :class="tile.good ? 'text-nw-green' : 'nw-heading'" :title="tile.display">
                            {{ tile.display }}
                        </p>

                        <template v-if="tile.total !== undefined">
                            <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-nw-sky-light">
                                <div class="h-full rounded-full bg-nw-green transition-all duration-300"
                                    :style="{ width: `${percent(tile.done, tile.total)}%` }"></div>
                            </div>

                            <p class="nw-muted mt-1.5 text-xs">{{ tile.done }} of {{ tile.total }} done</p>
                        </template>

                        <p v-else class="nw-muted mt-2 text-xs">{{ tile.sub }}</p>
                    </div>
                </section>

                <!-- Daily + weekly, side by side on desktop -->
                <div class="grid gap-4 lg:grid-cols-2 lg:items-start">
                    <section v-for="section in sections" :key="section.key" class="nw-card">
                        <header class="flex items-center justify-between gap-3 border-b border-nw-line px-4 py-3">
                            <div class="min-w-0">
                                <h2 class="nw-heading text-base font-extrabold">{{ section.title }}</h2>
                                <p class="nw-muted text-xs">{{ section.reset }}</p>
                            </div>

                            <div class="flex shrink-0 items-center gap-2">
                                <span class="nw-progress tabular-nums"
                                    :class="progressClass(section.completed, section.total)">
                                    {{ section.completed }} / {{ section.total }}
                                </span>

                                <RouterLink :to="TRACKER_ROUTE" aria-label="Open activity tracker"
                                    class="nw-btn nw-btn-ghost px-3 py-1 text-[0.8125rem] no-underline">
                                    Track
                                </RouterLink>
                            </div>
                        </header>

                        <div v-if="section.groups.length === 0" class="px-4 py-8 text-center">
                            <p class="nw-muted text-sm">
                                {{ pendingOnly && section.hasItems ? 'All caught up 🎉' : section.emptyText }}
                            </p>
                        </div>

                        <!-- One compact row per group; each chip is one character/activity pair -->
                        <ul v-else class="divide-y divide-nw-line">
                            <li v-for="group in section.groups" :key="group.id"
                                class="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-2.5"
                                :class="group.done === group.total ? 'bg-nw-green/5' : ''">
                                <div class="min-w-0 flex-1 basis-36">
                                    <p class="truncate text-sm font-extrabold"
                                        :class="group.done === group.total ? 'text-[#217a4b]' : 'nw-heading'">
                                        {{ group.label }}
                                    </p>
                                    <p v-if="group.sub" class="nw-muted truncate text-xs">{{ group.sub }}</p>
                                </div>

                                <ul class="flex min-w-0 flex-wrap gap-1.5"
                                    :class="groupBy === 'activity' ? 'max-w-full shrink-0' : 'flex-[2] basis-56'">
                                    <li v-for="chip in group.chips" :key="chip.id" :title="chip.title"
                                        class="inline-flex max-w-full items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold"
                                        :class="chipClass[chip.state]">
                                        <span v-if="chip.state === 'done'" aria-hidden="true">✓</span>
                                        <span class="truncate">{{ chip.label }}</span>
                                        <span v-if="chip.target > 1" class="tabular-nums opacity-70">
                                            {{ chip.current }}/{{ chip.target }}
                                        </span>
                                        <span class="sr-only">, {{ stateLabel[chip.state] }}</span>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </section>
                </div>

                <!-- Zeny + accounts, side by side on desktop -->
                <div class="grid gap-4 lg:grid-cols-2 lg:items-start">
                    <!-- Zeny -->
                    <section class="nw-card">
                        <header class="flex items-center justify-between gap-3 border-b border-nw-line px-4 py-3">
                            <div class="min-w-0">
                                <h2 class="nw-heading text-base font-extrabold">Zeny</h2>
                                <p class="nw-muted text-xs">Total across all characters</p>
                            </div>

                            <span class="nw-progress nw-progress-partial shrink-0 tabular-nums">
                                {{ formatZeny(zenyTotal) }} z
                            </span>
                        </header>

                        <div v-if="zenyAccounts.length === 0" class="px-4 py-8 text-center">
                            <p class="nw-muted text-sm">No Zeny balances yet.</p>
                        </div>

                        <div v-else class="divide-y divide-nw-line">
                            <div v-for="account in zenyAccounts" :key="account.account_id">
                                <div class="flex items-center justify-between gap-3 bg-nw-sky-light/40 px-4 py-2">
                                    <div class="min-w-0">
                                        <p class="nw-heading truncate text-sm font-extrabold">
                                            {{ account.account_name }}
                                        </p>
                                        <p class="nw-muted text-xs">
                                            {{ account.characters.length }}
                                            {{ account.characters.length === 1 ? 'character' : 'characters' }}
                                        </p>
                                    </div>

                                    <span class="nw-progress shrink-0 tabular-nums">
                                        {{ formatZeny(account.total) }} z
                                    </span>
                                </div>

                                <ul class="divide-y divide-nw-line">
                                    <li v-for="character in account.characters" :key="character.character_id"
                                        class="flex items-center gap-3 px-4 py-2">
                                        <div class="nw-avatar nw-avatar-sky h-8 w-8 text-sm" aria-hidden="true">
                                            {{ initial(character.character_name) }}
                                        </div>

                                        <div class="min-w-0 flex-1">
                                            <div class="flex items-baseline justify-between gap-3">
                                                <p class="nw-heading min-w-0 truncate text-sm font-bold">
                                                    {{ character.character_name }}
                                                </p>
                                                <span class="nw-value shrink-0 text-sm font-bold tabular-nums">
                                                    {{ formatZeny(character.amount) }} z
                                                </span>
                                            </div>

                                            <!-- Share of this account's Zeny -->
                                            <div class="mt-1 h-1 overflow-hidden rounded-full bg-nw-sky-light">
                                                <div class="h-full rounded-full bg-nw-gold"
                                                    :style="{ width: `${character.amount > 0 ? Math.max(character.share, 3) : 0}%` }">
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <!-- Accounts -->
                    <section class="nw-card">
                        <header class="flex items-center justify-between gap-3 border-b border-nw-line px-4 py-3">
                            <h2 class="nw-heading text-base font-extrabold">Accounts</h2>
                            <span class="nw-count tabular-nums">{{ dashboard.accounts.length }}</span>
                        </header>

                        <p v-if="dashboard.accounts.length === 0" class="nw-muted px-4 py-8 text-center text-sm">
                            No accounts yet.
                        </p>

                        <div v-else class="space-y-2 p-3">
                            <RouterLink v-for="account in dashboard.accounts" :key="account.id"
                                :to="`/accounts/${account.id}`"
                                class="nw-row no-underline transition hover:border-nw-sky hover:bg-nw-sky-light/40">
                                <div class="flex min-w-0 items-center gap-3">
                                    <div class="nw-avatar h-8 w-8 text-sm" aria-hidden="true">
                                        {{ initial(account.account_name) }}
                                    </div>

                                    <div class="min-w-0">
                                        <p class="nw-heading truncate text-sm font-bold">
                                            {{ account.account_name }}
                                        </p>
                                        <p class="nw-muted text-xs">
                                            {{ account.character_count }}
                                            {{ account.character_count === 1 ? 'character' : 'characters' }}
                                        </p>
                                    </div>
                                </div>

                                <span class="nw-progress shrink-0 capitalize"
                                    :class="account.status === 'active' ? 'nw-progress-done' : ''">
                                    {{ account.status }}
                                </span>
                            </RouterLink>
                        </div>
                    </section>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import dashboardApi from '@/api/dashboard'
import useLoading from '@/composables/useLoading'

const { startLoading, stopLoading } = useLoading()

// NOTE: change to wherever your Activity Tracker page lives
const TRACKER_ROUTE = '/activity-tracker'

const loading = ref(true)
const loadError = ref(false)

const dashboard = ref({
    stats: {
        active_accounts: 0,
        active_characters: 0,
        daily_completed: 0,
        daily_remaining: 0,
        weekly_completed: 0,
        weekly_remaining: 0
    },
    zeny: {
        total: 0,
        accounts: []
    },
    daily_activities: [],
    weekly_activities: [],
    accounts: []
})

// ---- View state ----
const groupBy = ref('activity')
const pendingOnly = ref(false)

const groupOptions = [
    { value: 'activity', label: 'By activity' },
    { value: 'character', label: 'By character' }
]

const chipClass = {
    done: 'border-[#a8dcc1] bg-[#eaf8f0] text-[#217a4b]',
    partial: 'border-[#f2d28a] bg-[#fff0cf] text-[#a35f00]',
    pending: 'border-nw-line bg-white text-nw-text'
}

const stateLabel = {
    done: 'done',
    partial: 'in progress',
    pending: 'pending'
}

// Avatar letter. Skips a leading tag like "[DPS]" so "[DPS]Raizaboi" gives "R", not "["
const initial = (name) => {
    if (!name) {
        return '?'
    }

    const text = String(name).trim()
    const withoutTag = text.replace(/^(\[[^\]]*\]|\([^)]*\)|\{[^}]*\}|【[^】]*】)\s*/, '')
    const match = (withoutTag || text).match(/[\p{L}\p{N}]/u)

    return match ? match[0].toUpperCase() : text.charAt(0).toUpperCase()
}

const formatZeny = (amount) => {
    return Number(amount || 0).toLocaleString('en-US')
}

const percent = (done, total) => (total > 0 ? Math.round((done / total) * 100) : 0)

const progressClass = (done, total) => {
    if (total > 0 && done >= total) {
        return 'nw-progress-done'
    }

    return done > 0 ? 'nw-progress-partial' : ''
}

// ---- Grouping ----
// By activity:  one row per activity, one chip per character.
// By character: one row per character, one chip per activity.
const multiAccount = computed(() => dashboard.value.accounts.length > 1)

const buildGroups = (items) => {
    const byActivity = groupBy.value === 'activity'
    const map = new Map()

    for (const item of items) {
        const key = byActivity ? item.activity_id : item.character_id

        if (!map.has(key)) {
            map.set(key, {
                id: `${groupBy.value}:${key}`,
                label: byActivity ? item.activity_name : item.character_name,
                // Account name only helps when there's more than one account
                sub: !byActivity && multiAccount.value ? item.account_name : '',
                chips: []
            })
        }

        map.get(key).chips.push({
            id: `${item.character_id}-${item.activity_id}`,
            label: byActivity ? item.character_name : item.activity_name,
            title: `${item.character_name} · ${item.activity_name}`,
            state: item.completed ? 'done' : item.current_count > 0 ? 'partial' : 'pending',
            current: item.current_count,
            target: item.target_count
        })
    }

    return [...map.values()]
        .map((group) => ({
            ...group,
            // counted before the pending filter so the row still knows if it's finished
            done: group.chips.filter((chip) => chip.state === 'done').length,
            total: group.chips.length,
            chips: group.chips
                .filter((chip) => !pendingOnly.value || chip.state !== 'done')
                .sort((a, b) =>
                    Number(a.state === 'done') - Number(b.state === 'done') ||
                    a.label.localeCompare(b.label)
                )
        }))
        .filter((group) => group.chips.length > 0)
        // rows with work left first, then alphabetical
        .sort((a, b) =>
            Number(a.done === a.total) - Number(b.done === b.total) ||
            a.label.localeCompare(b.label)
        )
}

// ---- Zeny ----
const zenyTotal = computed(() => dashboard.value.zeny?.total ?? 0)

// Richest account first, richest character first, with each character's share of its account
const zenyAccounts = computed(() => {
    return (dashboard.value.zeny?.accounts ?? [])
        .map((account) => ({
            ...account,
            characters: [...account.characters]
                .sort((a, b) => b.amount - a.amount)
                .map((character) => ({
                    ...character,
                    share: percent(character.amount, account.total)
                }))
        }))
        .sort((a, b) => b.total - a.total)
})

const zenyCharacterCount = computed(() => {
    return zenyAccounts.value.reduce((sum, account) => sum + account.characters.length, 0)
})

// ---- Derived view data ----
// Four tiles: the accounts count already lives in the Accounts card,
// so it's folded into the characters tile instead of getting its own.
const statTiles = computed(() => {
    const s = dashboard.value.stats
    const dailyTotal = s.daily_completed + s.daily_remaining
    const weeklyTotal = s.weekly_completed + s.weekly_remaining
    const zenyCount = zenyCharacterCount.value

    return [
        {
            label: 'Daily remaining',
            display: String(s.daily_remaining),
            done: s.daily_completed,
            total: dailyTotal,
            good: dailyTotal > 0 && s.daily_remaining === 0
        },
        {
            label: 'Weekly remaining',
            display: String(s.weekly_remaining),
            done: s.weekly_completed,
            total: weeklyTotal,
            good: weeklyTotal > 0 && s.weekly_remaining === 0
        },
        {
            label: 'Total Zeny',
            display: `${formatZeny(zenyTotal.value)} z`,
            sub: `across ${zenyCount} ${zenyCount === 1 ? 'character' : 'characters'}`
        },
        {
            label: 'Active characters',
            display: String(s.active_characters),
            sub: `across ${s.active_accounts} ${s.active_accounts === 1 ? 'account' : 'accounts'}`
        }
    ]
})

const sections = computed(() => {
    const s = dashboard.value.stats

    return [
        {
            key: 'daily',
            title: 'Daily activities',
            reset: 'Resets every day at 5:00 AM.',
            emptyText: 'No daily activities.',
            completed: s.daily_completed,
            total: s.daily_completed + s.daily_remaining,
            hasItems: dashboard.value.daily_activities.length > 0,
            groups: buildGroups(dashboard.value.daily_activities)
        },
        {
            key: 'weekly',
            title: 'Weekly activities',
            reset: 'Resets every Monday at 5:00 AM.',
            emptyText: 'No weekly activities.',
            completed: s.weekly_completed,
            total: s.weekly_completed + s.weekly_remaining,
            hasItems: dashboard.value.weekly_activities.length > 0,
            groups: buildGroups(dashboard.value.weekly_activities)
        }
    ]
})

const fetchDashboard = async () => {
    try {
        loading.value = true
        loadError.value = false
        startLoading()

        const response = await dashboardApi.getDashboard()

        dashboard.value = response.data
    } catch (error) {
        loadError.value = true
        console.error('Failed to fetch dashboard:', error)
    } finally {
        loading.value = false
        stopLoading()
    }
}

onMounted(() => {
    fetchDashboard()
})
</script>