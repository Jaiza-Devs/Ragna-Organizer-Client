import api from './axios'

const getCharacters = () => {
  return api.get('/api/characters')
}

const getCharacter = (id) => {
  return api.get(`/api/characters/${id}`)
}

const createCharacter = (data) => {
  return api.post('/api/characters', data)
}

const updateCharacter = (id, data) => {
  return api.put(`/api/characters/${id}`, data)
}

const deleteCharacter = (id) => {
  return api.delete(`/api/characters/${id}`)
}

export default {
  getCharacters,
  getCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter
}