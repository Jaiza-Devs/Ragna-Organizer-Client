<template>
  <router-view />

  <LoadingOverlay :loading="loading" />
</template>

<script setup>
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import useLoading from '@/composables/useLoading'

const { loading } = useLoading()
</script>