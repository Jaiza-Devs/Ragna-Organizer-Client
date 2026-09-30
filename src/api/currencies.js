import api from './axios'

const getCurrencies = () => {
    return api.get('/api/currencies')
}

const getCurrency = (id) => {
    return api.get(`/api/currencies/${id}`)
}

const createCurrency = (data) => {
    return api.post('/api/currencies', data)
}

const updateCurrency = (id, data) => {
    return api.put(`/api/currencies/${id}`, data)
}

const deleteCurrency = (id) => {
    return api.delete(`/api/currencies/${id}`)
}

export default {
    getCurrencies,
    getCurrency,
    createCurrency,
    updateCurrency,
    deleteCurrency
}