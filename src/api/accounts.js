import api from './axios'

const getAccounts = (params = {}) => {
  return api.get('/api/accounts', {
    params
  })
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

const updateAccountStatus = (id, status) => {
  return api.patch(`/api/accounts/${id}/status`, {
    status
  })
}

const deleteAccount = (id) => {
  return api.delete(`/api/accounts/${id}`)
}

export default {
  getAccounts,
  getAccount,
  createAccount,
  updateAccount,
  updateAccountStatus,
  deleteAccount
}