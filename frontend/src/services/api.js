import axios from 'axios';

//base da API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
//interceptor 
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    return Promise.reject(error);
  }
);
// api de Pets
export const petsAPI = {
  //listar pets 
  getPets: (params = {}) => {
    return api.get('/pets', { params });
  },
  //buscar pet por ID
  getPetById: (id) => {
    return api.get(`/pets/${id}`);
  },
  //criar
  createPet: (petData) => {
    return api.post('/pets', petData);
  },

  //atualizar
  updatePet: (id, petData) => {
    return api.put(`/pets/${id}`, petData);
  },

  //deleter
  deletePet: (id) => {
    return api.delete(`/pets/${id}`);
  },
};

//API de Raças
export const breedsAPI = {
  //raças por espécie
  getBreeds: (species, query = '') => {
    const params = query ? { q: query } : {};
    return api.get(`/breeds/${species}`, { params });
  },
};
// API de Health Check
export const healthAPI = {
  // Verificar status da API
  checkHealth: () => {
    return api.get('/health');
  },
};

export default api;
