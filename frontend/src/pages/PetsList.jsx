import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { petsAPI } from '../services/api';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const PetsList = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    name: '',
    species: '',
    status: '',
    page: 1,
    perPage: 10,
    sortBy: 'created_at',
    order: 'desc'
  });
  const [pagination, setPagination] = useState({});

  const fetchPets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await petsAPI.getPets(filters);
      setPets(response.data.data);
      setPagination({
        total: response.data.total,
        page: response.data.page,
        perPage: response.data.perPage,
        totalPages: response.data.totalPages
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar pets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 //redefine p/pag 1
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { color: 'bg-green-100 text-green-800', text: 'Disponível' },
      adopted: { color: 'bg-gray-100 text-gray-800', text: 'Adotado' }
    };
    
    const config = statusConfig[status] || statusConfig.available;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getSpeciesIcon = (species) => {
    return species === 'dog' ? '🐕' : '🐱';
  };

  if (loading) return <Loader size="lg" text="Carregando pets..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchPets} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pets para Adoção</h1>
        <p className="text-gray-600">Encontre seu novo melhor amigo</p>
      </div>

      {/* Filtros */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              placeholder="Buscar por nome..."
              className="input"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Espécie
            </label>
            <select
              value={filters.species}
              onChange={(e) => handleFilterChange('species', e.target.value)}
              className="input"
            >
              <option value="">Todas</option>
              <option value="dog">Cachorro</option>
              <option value="cat">Gato</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input"
            >
              <option value="">Todos</option>
              <option value="available">Disponível</option>
              <option value="adopted">Adotado</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ordenar por
            </label>
            <select
              value={`${filters.sortBy}-${filters.order}`}
              onChange={(e) => {
                const [sortBy, order] = e.target.value.split('-');
                setFilters(prev => ({ ...prev, sortBy, order }));
              }}
              className="input"
            >
              <option value="created_at-desc">Mais recentes</option>
              <option value="created_at-asc">Mais antigos</option>
              <option value="name-asc">Nome A-Z</option>
              <option value="name-desc">Nome Z-A</option>
              <option value="age_years-asc">Idade (menor)</option>
              <option value="age_years-desc">Idade (maior)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Pets */}
      {pets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🐾</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pet encontrado</h3>
          <p className="text-gray-600 mb-4">Tente ajustar os filtros ou adicione um novo pet.</p>
          <Link to="/pets/new" className="btn-primary">
            Adicionar Pet
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {pets.map((pet) => (
              <div key={pet.id} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getSpeciesIcon(pet.species)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
                      <p className="text-sm text-gray-600">{pet.breed}</p>
                    </div>
                  </div>
                  {getStatusBadge(pet.status)}
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Idade:</span>
                    <span className="ml-2">{pet.age_years} anos</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Cidade:</span>
                    <span className="ml-2">{pet.shelter_city}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Link
                    to={`/pets/${pet.id}`}
                    className="flex-1 btn-primary text-center"
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Paginação */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {((pagination.page - 1) * pagination.perPage) + 1} a{' '}
                {Math.min(pagination.page * pagination.perPage, pagination.total)} de{' '}
                {pagination.total} pets
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                
                <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md">
                  {pagination.page} de {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PetsList;
