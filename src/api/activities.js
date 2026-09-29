import api from './axios'

const getActivities = () => {
  return api.get('/api/activities')
}

const getActivity = (id) => {
  return api.get(`/api/activities/${id}`)
}

const createActivity = (data) => {
  return api.post('/api/activities', data)
}

const updateActivity = (id, data) => {
  return api.put(`/api/activities/${id}`, data)
}

const deleteActivity = (id) => {
  return api.delete(`/api/activities/${id}`)
}

export default {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity
}