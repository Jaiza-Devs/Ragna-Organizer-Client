import api from './axios'

const getActivityTracker = () => {
    return api.get('/api/activity-tracker')
}

export default {
    getActivityTracker
}