import { useState, useEffect } from 'react';
import { breedsAPI } from '../services/api';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const Breeds = () => {
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSpecies, setSelectedSpecies] = useState('dog');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBreeds = async (species, query = '') => {
    try {
      setLoading(true);
      setError(null);
      const response = await breedsAPI.getBreeds(species, query);
      setBreeds(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar raças');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreeds(selectedSpecies, searchQuery);
  }, [selectedSpecies, searchQuery]);

  const handleSpeciesChange = (species) => {
    setSelectedSpecies(species);
    setSearchQuery(''); //redefine especie
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const getSpeciesIcon = (species) => {
    return species === 'dog' ? '🐕' : '🐱';
  };

  const getEnergyLevel = (level) => {
    const levels = {
      1: { text: 'Muito Baixa', color: 'bg-blue-100 text-blue-800' },
      2: { text: 'Baixa', color: 'bg-green-100 text-green-800' },
      3: { text: 'Média', color: 'bg-yellow-100 text-yellow-800' },
      4: { text: 'Alta', color: 'bg-orange-100 text-orange-800' },
      5: { text: 'Muito Alta', color: 'bg-red-100 text-red-800' }
    };
    
    const config = levels[level] || levels[3];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Raças de Animais</h1>
        <p className="text-gray-600">Explore as diferentes raças de cães e gatos</p>
      </div>

      {/* Filtros */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Espécie
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => handleSpeciesChange('dog')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  selectedSpecies === 'dog'
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>🐕</span>
                <span>Cães</span>
              </button>
              <button
                onClick={() => handleSpeciesChange('cat')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  selectedSpecies === 'cat'
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>🐱</span>
                <span>Gatos</span>
              </button>
            </div>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar por nome
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Digite o nome da raça..."
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      {loading ? (
        <Loader size="lg" text="Carregando raças..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => fetchBreeds(selectedSpecies, searchQuery)} />
      ) : (
        <>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {getSpeciesIcon(selectedSpecies)} Raças de {selectedSpecies === 'dog' ? 'Cães' : 'Gatos'}
            </h2>
            <p className="text-gray-600">
              {breeds.length} raça{breeds.length !== 1 ? 's' : ''} encontrada{breeds.length !== 1 ? 's' : ''}
            </p>
          </div>

          {breeds.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">{getSpeciesIcon(selectedSpecies)}</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma raça encontrada</h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? `Nenhuma raça encontrada para "${searchQuery}"`
                  : 'Não há raças disponíveis para esta espécie'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {breeds.map((breed, index) => (
                <div key={index} className="card hover:shadow-lg transition-shadow duration-200">
                  {breed.image_url && (
                    <div className="mb-4">
                      <img
                        src={breed.image_url}
                        alt={breed.name}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{breed.name}</h3>
                      {breed.origin && (
                        <p className="text-sm text-gray-600">Origem: {breed.origin}</p>
                      )}
                    </div>
                    
                    {breed.energy_level && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Nível de Energia
                        </label>
                        {getEnergyLevel(breed.energy_level)}
                      </div>
                    )}
                    
                    {breed.temperament && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Temperamento
                        </label>
                        <p className="text-sm text-gray-700">{breed.temperament}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Breeds;
