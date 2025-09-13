// funções auxiliares 
import { SPECIES_OPTIONS, STATUS_OPTIONS, ENERGY_LEVELS, AGE_BUCKETS } from './constants';

/**
 * obtem o ícone da espécie
 * @param {string} species 
 * @returns {string} emoji da espécie
 */
export const getSpeciesIcon = (species) => {
  const speciesOption = SPECIES_OPTIONS.find(option => option.value === species);
  return speciesOption ? speciesOption.icon : '🐾';
};

/**
 * obtem o nome da espécie em português
 * @param {string} species 
 * @returns {string} 
 */
export const getSpeciesLabel = (species) => {
  const speciesOption = SPECIES_OPTIONS.find(option => option.value === species);
  return speciesOption ? speciesOption.label : 'Desconhecida';
};

/**
 * obtem a configuração do status
 * @param {string} status 
 * @returns {object} 
 */
export const getStatusConfig = (status) => {
  return STATUS_OPTIONS.find(option => option.value === status) || STATUS_OPTIONS[0];
};

/**
 * obtem a configuração do nível de energia
 * @param {number} level - nivel de energia
 * @returns {object} conf nível de energia
 */
export const getEnergyLevelConfig = (level) => {
  return ENERGY_LEVELS[level] || ENERGY_LEVELS[3];
};

/**
 * formata data para exibição em português
 * @param {string} dateString - data em formato string
 * @returns {string} 
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * calcula distribuição de idades dos pets
 * @param {Array} pets
 * @returns {object} distribuição por faixa etária
 */
export const calculateAgeDistribution = (pets) => {
  const buckets = Object.keys(AGE_BUCKETS).reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {});

  pets.forEach(pet => {
    const age = pet.age_years;
    Object.entries(AGE_BUCKETS).forEach(([key, config]) => {
      if (age >= config.min && age <= config.max) {
        buckets[key]++;
      }
    });
  });

  return buckets;
};

/**
 * valida se um valor é um número válido
 * @param {any} value 
 * @returns {boolean} 
 */
export const isValidNumber = (value) => {
  return !isNaN(value) && isFinite(value) && value !== '';
};

/**
 * valida coordenadas de latitude
 * @param {number} lat 
 * @returns {boolean} 
 */
export const isValidLatitude = (lat) => {
  return isValidNumber(lat) && lat >= -90 && lat <= 90;
};

/**
 * valida coordenadas de longitude
 * @param {number} lng 
 * @returns {boolean} 
 */
export const isValidLongitude = (lng) => {
  return isValidNumber(lng) && lng >= -180 && lng <= 180;
};

/**
 * debounce function para otimizar chamadas de API
 * @param {Function} func 
 * @param {number} delay 
 * @returns {Function} 
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * gera mensagem de erro padronizada
 * @param {Error} error 
 * @param {string} defaultMessage 
 * @returns {string} msg de erro formatada
 */
export const getErrorMessage = (error, defaultMessage = 'Ocorreu um erro inesperado') => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return defaultMessage;
};
