import api from './axios'

const getDashboard = () => {
    return api.get('/api/dashboard')
}

export default {
    getDashboard
}