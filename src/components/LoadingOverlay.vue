<template>
    <transition enter-active-class="transition-opacity duration-300"
        leave-active-class="transition-opacity duration-300" enter-from-class="opacity-0" leave-to-class="opacity-0">
        <div v-if="loading"
            class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0f173c]/85 to-[#1e2964]/75 backdrop-blur-sm"
            role="status" aria-live="polite">
            <!-- sky glow -->
            <div
                class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(96,165,250,0.35),transparent_60%)]">
            </div>

            <!-- floating sparkles -->
            <span v-for="s in sparkles" :key="s.id"
                class="pointer-events-none absolute text-amber-200 opacity-0 [text-shadow:0_0_8px_rgba(253,230,138,0.9)] animate-[ro-twinkle_3s_ease-in-out_infinite] motion-reduce:animate-none"
                :style="{ left: s.left, top: s.top, animationDelay: s.delay, animationDuration: s.dur, fontSize: s.size }"
                aria-hidden="true">✦</span>

            <div class="relative flex flex-col items-center">
                <!-- spinner ring + poring -->
                <div class="relative flex h-44 w-44 items-center justify-center">
                    <!-- track -->
                    <div class="absolute inset-0 rounded-full border-4 border-white/15"></div>
                    <!-- spinning arc -->
                    <div
                        class="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-r-amber-200 border-t-amber-400 [animation-duration:1.1s] [filter:drop-shadow(0_0_6px_rgba(251,191,36,0.8))] motion-reduce:animate-none">
                    </div>

                    <img src="@/assets/gifs/poring_loading.png" alt="Loading"
                        class="relative h-32 w-32 select-none object-contain" draggable="false">
                </div>

                <!-- wave text -->
                <p
                    class="mt-4 flex text-lg font-extrabold tracking-widest text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
                    <span v-for="(ch, i) in chars" :key="i"
                        class="inline-block animate-[ro-wave_1.4s_ease-in-out_infinite] motion-reduce:animate-none"
                        :style="{ animationDelay: i * 0.1 + 's' }">{{ ch }}</span>
                    <span v-for="n in 3" :key="'d' + n"
                        class="inline-block animate-[ro-wave_1.4s_ease-in-out_infinite] text-amber-300 motion-reduce:animate-none"
                        :style="{ animationDelay: (chars.length + n - 1) * 0.1 + 's' }">.</span>
                </p>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'LoadingOverlay',

    props: {
        loading: { type: Boolean, default: false },
        message: { type: String, default: 'Loading' }
    },

    data() {
        return {
            sparkles: Array.from({ length: 12 }, (_, i) => ({
                id: i,
                left: `${(i * 37 + 8) % 96}%`,
                top: `${(i * 53 + 12) % 92}%`,
                delay: `${(i % 7) * 0.45}s`,
                dur: `${3 + (i % 4)}s`,
                size: `${10 + (i % 4) * 5}px`
            }))
        }
    },

    computed: {
        // non-breaking space so spaces keep their width inside inline-block spans
        chars() {
            return this.message.split('').map(c => (c === ' ' ? '\u00A0' : c))
        }
    }
}
</script>

<!-- unscoped on purpose: Tailwind's animate-[...] classes reference these keyframe names -->
<style>
@keyframes ro-twinkle {

    0%,
    100% {
        opacity: 0;
        transform: translateY(6px) scale(0.6);
    }

    50% {
        opacity: 1;
        transform: translateY(-8px) scale(1.1);
    }
}

@keyframes ro-wave {

    0%,
    60%,
    100% {
        transform: translateY(0);
    }

    30% {
        transform: translateY(-8px);
    }
}
</style>