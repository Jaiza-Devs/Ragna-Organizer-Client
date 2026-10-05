<template>
    <div class="nw-page">
        <div class="mx-auto max-w-7xl space-y-4">
            <!-- Page header -->
            <div class="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 class="nw-heading text-xl font-extrabold sm:text-2xl">Dashboard</h1>
                    <p class="nw-muted text-xs sm:text-sm">Track your daily and weekly activities.</p>
                </div>

                <!-- View controls -->
                <div v-if="!loading" class="flex flex-wrap items-center gap-2">
                    <div class="flex items-center gap-1" role="group" aria-label="Group activities by">
                        <span class="nw-muted mr-1 text-xs font-semibold">Group by</span>

                        <button v-for="option in groupOptions" :key="option.value" type="button"
                            class="nw-btn nw-btn-ghost px-3 py-1 text-[0.8125rem]"
                            :class="groupBy === option.value ? 'border-nw-sky bg-nw-sky-light font-bold' : ''"
                            :aria-pressed="groupBy === option.value" @click="groupBy = option.value">
                            {{ option.label }}
                        </button>
                    </div>

                    <button type="button" class="nw-btn nw-btn-ghost px-3 py-1 text-[0.8125rem]"
                        :class="pendingOnly ? 'border-nw-sky bg-nw-sky-light font-bold' : ''"
                        :aria-pressed="pendingOnly" @click="pendingOnly = !pendingOnly">
                        Pending only
                    </button>
                </div>
            </div>

            <div v-if="loading" class="nw-card px-4 py-6 text-center text-sm nw-muted">
                Loading dashboard...
            </div>

            <template v-else>
                <!-- Stat tiles -->
                <section class="grid grid-cols-2 gap-3 lg:grid-cols-5">
                    <div v-for="tile in statTiles" :key="tile.label" class="nw-card min-w-0 p-4"
                        :class="tile.wide ? 'col-span-2 lg:col-span-1' : ''">
                        <p class="nw-muted text-[11px] font-semibold uppercase tracking-wide">
                            {{ tile.label }}
                        </p>

                        <p class="mt-1 truncate text-2xl font-extrabold tabular-nums"
                            :class="tile.good ? 'text-nw-green' : 'nw-heading'">
                            {{ tile.display }}
                        </p>

                        <template v-if="tile.total !== undefined">
                            <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-nw-sky-light">
                                <div class="h-full rounded-full bg-nw-green transition-all duration-300"
                                    :style="{ width: `${percent(tile.done, tile.total)}%` }"></div>
                            </div>

                            <p class="nw-muted mt-1.5 text-xs">
                                {{ tile.done }} of {{ tile.total }} done
                            </p>
                        </template>

                        <p v-else-if="tile.sub" class="nw-muted mt-2 text-xs">{{ tile.sub }}</p>
                    </div>
                </section>

                <!-- Daily + weekly, side by side on desktop -->
                <div class="grid gap-4 lg:grid-cols-2 lg:items-start">
                    <section v-for="section in sections" :key="section.key" class="nw-card">
                        <header class="nw-card-header flex items-center justify-between gap-3 px-4 py-3">
                            <div class="min-w-0">
                                <h2 class="nw-card-title text-base font-bold">{{ section.title }}</h2>
                                <p class="nw-card-sub text-xs">{{ section.reset }}</p>
                            </div>

                            <span class="nw-status shrink-0"
                                :class="section.total > 0 && section.completed === section.total ? 'nw-status-active' : ''">
                                {{ section.completed }} / {{ section.total }}
                            </span>
                        </header>

                        <div v-if="section.groups.length === 0" class="px-4 py-8 text-center">
                            <p class="nw-muted text-sm">
                                {{ pendingOnly && section.hasItems ? 'All caught up 🎉' : section.emptyText }}
                            </p>
                        </div>

                        <div v-else class="divide-y divide-nw-line">
                            <div v-for="group in section.groups" :key="group.id">
                                <!-- Group header -->
                                <button type="button"
                                    class="flex w-full items-center gap-2 bg-nw-sky-light/40 px-4 py-2 text-left transition hover:bg-nw-sky-light/70"
                                    :aria-expanded="!isCollapsed(group)" @click="toggleGroup(group)">
                                    <span class="nw-muted w-3 text-xs transition-transform"
                                        :class="isCollapsed(group) ? '' : 'rotate-90'" aria-hidden="true">
                                        ▸
                                    </span>

                                    <span class="nw-heading min-w-0 flex-1 truncate text-sm font-extrabold">
                                        {{ group.label }}
                                    </span>

                                    <span class="nw-progress" :class="group.done === group.total
                                        ? 'nw-progress-done'
                                        : group.done > 0
                                            ? 'nw-progress-partial'
                                            : ''">
                                        {{ group.done }} / {{ group.total }}
                                    </span>
                                </button>

                                <!-- Group rows -->
                                <ul v-if="!isCollapsed(group)" class="divide-y divide-nw-line">
                                    <li v-for="row in group.rows" :key="row.id"
                                        class="flex items-center gap-3 px-4 py-2"
                                        :class="row.completed ? 'bg-nw-green/5' : ''">
                                        <div class="nw-avatar nw-avatar-sky h-8 w-8 text-sm" aria-hidden="true">
                                            {{ row.initial }}
                                        </div>

                                        <div class="min-w-0 flex-1">
                                            <p class="nw-heading truncate text-sm font-bold">{{ row.primary }}</p>
                                            <p class="nw-muted truncate text-xs">{{ row.secondary }}</p>
                                        </div>

                                        <span class="nw-progress" :class="row.completed
                                            ? 'nw-progress-done'
                                            : row.current_count > 0
                                                ? 'nw-progress-partial'
                                                : ''">
                                            {{ row.current_count }} / {{ row.target_count }}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>

                <!-- Zeny + accounts, side by side on desktop -->
                <div class="grid gap-4 lg:grid-cols-2 lg:items-start">
                    <!-- Zeny -->
                    <section class="nw-card">
                        <header class="nw-card-header flex items-center justify-between gap-3 px-4 py-3">
                            <div class="min-w-0">
                                <h2 class="nw-card-title text-base font-bold">Zeny</h2>
                                <p class="nw-card-sub text-xs">Total across all characters</p>
                            </div>

                            <span class="nw-status shrink-0 tabular-nums">
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

                                    <span class="nw-progress nw-progress-partial shrink-0 tabular-nums">
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
                        <header class="nw-card-header flex items-center justify-between gap-3 px-4 py-3">
                            <h2 class="nw-card-title text-base font-bold">Accounts</h2>
                            <span class="nw-status">{{ dashboard.accounts.length }}</span>
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

                                <span class="nw-status shrink-0"
                                    :class="account.status === 'active' ? 'nw-status-active' : ''">
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

const loading = ref(true)

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

// Manual expand/collapse overrides, keyed by group id
const collapsedMap = ref({})

const groupOptions = [
    { value: 'activity', label: 'Activity' },
    { value: 'account', label: 'Account' }
]

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

// ---- Grouping ----
// Groups the flat character/activity rows by activity or by account.
// Activity mode: "Character · Account" under each activity.
// Account mode: "Activity · Character" under each account, ordered by character.
const buildGroups = (items, section) => {
    const byActivity = groupBy.value === 'activity'
    const map = new Map()

    for (const item of items) {
        const key = byActivity
            ? String(item.activity_id)
            : String(item.account_id ?? item.account_name)

        if (!map.has(key)) {
            map.set(key, {
                id: `${section}:${groupBy.value}:${key}`,
                label: byActivity ? item.activity_name : item.account_name,
                rows: []
            })
        }

        map.get(key).rows.push({
            id: `${item.character_id}-${item.activity_id}`,
            initial: initial(item.character_name),
            primary: byActivity ? item.character_name : item.activity_name,
            secondary: byActivity ? item.account_name : item.character_name,
            current_count: item.current_count,
            target_count: item.target_count,
            completed: item.completed
        })
    }

    // Activity mode orders by character; account mode keeps each character's activities together
    const rowOrder = (a, b) => byActivity
        ? a.primary.localeCompare(b.primary)
        : a.secondary.localeCompare(b.secondary) || a.primary.localeCompare(b.primary)

    return [...map.values()]
        .map((group) => {
            const done = group.rows.filter((row) => row.completed).length

            return {
                ...group,
                done,
                total: group.rows.length,
                // pending rows first, then by name
                rows: group.rows
                    .filter((row) => !pendingOnly.value || !row.completed)
                    .sort((a, b) => Number(a.completed) - Number(b.completed) || rowOrder(a, b))
            }
        })
        .filter((group) => group.rows.length > 0)
        // groups with work left first, then alphabetical
        .sort((a, b) =>
            Number(a.done === a.total) - Number(b.done === b.total) ||
            a.label.localeCompare(b.label)
        )
}

// Finished groups start collapsed, groups with work left start open
const isCollapsed = (group) => {
    return group.id in collapsedMap.value
        ? collapsedMap.value[group.id]
        : group.done === group.total
}

const toggleGroup = (group) => {
    collapsedMap.value[group.id] = !isCollapsed(group)
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
const statTiles = computed(() => {
    const s = dashboard.value.stats
    const dailyTotal = s.daily_completed + s.daily_remaining
    const weeklyTotal = s.weekly_completed + s.weekly_remaining
    const count = zenyCharacterCount.value

    return [
        { label: 'Active Accounts', display: String(s.active_accounts) },
        { label: 'Active Characters', display: String(s.active_characters) },
        {
            label: 'Daily Remaining',
            display: String(s.daily_remaining),
            done: s.daily_completed,
            total: dailyTotal,
            good: dailyTotal > 0 && s.daily_remaining === 0
        },
        {
            label: 'Weekly Remaining',
            display: String(s.weekly_remaining),
            done: s.weekly_completed,
            total: weeklyTotal,
            good: weeklyTotal > 0 && s.weekly_remaining === 0
        },
        {
            label: 'Total Zeny',
            display: `${formatZeny(zenyTotal.value)} z`,
            sub: `across ${count} ${count === 1 ? 'character' : 'characters'}`,
            wide: true
        }
    ]
})

const sections = computed(() => {
    const s = dashboard.value.stats

    return [
        {
            key: 'daily',
            title: 'Daily Activities',
            reset: 'Resets every day at 5:00 AM.',
            emptyText: 'No daily activities.',
            completed: s.daily_completed,
            total: s.daily_completed + s.daily_remaining,
            hasItems: dashboard.value.daily_activities.length > 0,
            groups: buildGroups(dashboard.value.daily_activities, 'daily')
        },
        {
            key: 'weekly',
            title: 'Weekly Activities',
            reset: 'Resets every Monday at 5:00 AM.',
            emptyText: 'No weekly activities.',
            completed: s.weekly_completed,
            total: s.weekly_completed + s.weekly_remaining,
            hasItems: dashboard.value.weekly_activities.length > 0,
            groups: buildGroups(dashboard.value.weekly_activities, 'weekly')
        }
    ]
})

const fetchDashboard = async () => {
    try {
        loading.value = true
        startLoading()

        const response = await dashboardApi.getDashboard()

        dashboard.value = response.data

        console.log(dashboard.value)

    } catch (error) {
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