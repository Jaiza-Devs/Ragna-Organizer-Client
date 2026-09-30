import api from './axios'

const getCharacterCurrencies = () => {
    return api.get('/api/character-currencies')
}

const getCharacterCurrency = (id) => {
    return api.get(`/api/character-currencies/${id}`)
}

const getCharacterCurrenciesByCharacter = (characterId) => {
    return api.get(`/api/character-currencies/character/${characterId}`)
}

const getCharacterCurrencyByCharacterAndCurrency = (characterId, currencyId) => {
    return api.get(
        `/api/character-currencies/character/${characterId}/currency/${currencyId}`
    )
}

const createCharacterCurrency = (data) => {
    return api.post('/api/character-currencies', data)
}

const updateCharacterCurrency = (id, data) => {
    return api.put(`/api/character-currencies/${id}`, data)
}

const deleteCharacterCurrency = (id) => {
    return api.delete(`/api/character-currencies/${id}`)
}

export default {
    getCharacterCurrencies,
    getCharacterCurrency,
    getCharacterCurrenciesByCharacter,
    getCharacterCurrencyByCharacterAndCurrency,
    createCharacterCurrency,
    updateCharacterCurrency,
    deleteCharacterCurrency
}