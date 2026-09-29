import api from './axios'

const getAccounts = () => {
  return api.get('/api/accounts')
}

const getAccount = (id) => {
  return api.get(`/api/accounts/${id}`)
}

const createAccount = (data) => {
  return api.post('/api/accounts', data)
}

const updateAccount = (id, data) => {
  return api.put(`/api/accounts/${id}`, data)
}

const deleteAccount = (id) => {
  return api.delete(`/api/accounts/${id}`)
}

export default {
  getAccounts,
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount
}