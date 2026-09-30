import api from './axios'

const getActivityCompletions = () => {
  return api.get('/api/activity-completions')
}

const getActivityCompletion = (id) => {
  return api.get(`/api/activity-completions/${id}`)
}

const getCurrentCount = (activityId, characterId) => {
  return api.get('/api/activity-completions/current-count', {
    params: {
      activityId,
      characterId
    }
  })
}

const createActivityCompletion = (data) => {
  return api.post('/api/activity-completions', data)
}

const updateActivityCompletion = (id, data) => {
  return api.put(`/api/activity-completions/${id}`, data)
}

const deleteActivityCompletion = (id) => {
  return api.delete(`/api/activity-completions/${id}`)
}

export default {
  getActivityCompletions,
  getActivityCompletion,
  getCurrentCount,
  createActivityCompletion,
  updateActivityCompletion,
  deleteActivityCompletion
}