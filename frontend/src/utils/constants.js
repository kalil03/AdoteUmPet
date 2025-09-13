// Constantes reutilizáveis da aplicação
export const SPECIES_OPTIONS = [
  { value: 'dog', label: 'Cachorro', icon: '🐕' },
  { value: 'cat', label: 'Gato', icon: '🐱' }
];

export const STATUS_OPTIONS = [
  { value: 'available', label: 'Disponível', color: 'bg-green-100 text-green-800' },
  { value: 'adopted', label: 'Adotado', color: 'bg-gray-100 text-gray-800' }
];

export const SORT_OPTIONS = [
  { value: 'created_at-desc', label: 'Mais recentes' },
  { value: 'created_at-asc', label: 'Mais antigos' },
  { value: 'name-asc', label: 'Nome A-Z' },
  { value: 'name-desc', label: 'Nome Z-A' },
  { value: 'age_years-asc', label: 'Idade (menor)' },
  { value: 'age_years-desc', label: 'Idade (maior)' }
];

export const ENERGY_LEVELS = {
  1: { text: 'Muito Baixa', color: 'bg-blue-100 text-blue-800' },
  2: { text: 'Baixa', color: 'bg-green-100 text-green-800' },
  3: { text: 'Média', color: 'bg-yellow-100 text-yellow-800' },
  4: { text: 'Alta', color: 'bg-orange-100 text-orange-800' },
  5: { text: 'Muito Alta', color: 'bg-red-100 text-red-800' }
};

export const AGE_BUCKETS = {
  '0-1': { min: 0, max: 1, label: '0-1 anos', color: 'rgba(59, 130, 246, 0.8)' },
  '2-3': { min: 2, max: 3, label: '2-3 anos', color: 'rgba(16, 185, 129, 0.8)' },
  '4-6': { min: 4, max: 6, label: '4-6 anos', color: 'rgba(245, 158, 11, 0.8)' },
  '7+': { min: 7, max: Infinity, label: '7+ anos', color: 'rgba(239, 68, 68, 0.8)' }
};

export const API_TIMEOUT = 10000;
export const DEBOUNCE_DELAY = 1000;
export const MAX_PETS_PER_PAGE = 100;
