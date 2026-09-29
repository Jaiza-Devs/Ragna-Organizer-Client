import { ref } from 'vue'

const loading = ref(false)

const useLoading = () => {
    const startLoading = () => {
        loading.value = true
    }

    const stopLoading = () => {
        loading.value = false
    }

    return {
        loading,
        startLoading,
        stopLoading
    }
}

export default useLoading