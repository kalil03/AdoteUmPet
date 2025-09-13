import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { petsAPI } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';

const PetForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    species: 'dog',
    breed: '',
    age_years: '',
    shelter_city: '',
    shelter_lat: '',
    shelter_lng: '',
    status: 'available'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Converte campos numéricos
      const submitData = {
        ...formData,
        age_years: parseInt(formData.age_years),
        shelter_lat: parseFloat(formData.shelter_lat),
        shelter_lng: parseFloat(formData.shelter_lng)
      };

      await petsAPI.createPet(submitData);
      navigate('/pets');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar pet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Adicionar Novo Pet</h1>
        <p className="text-gray-600">Preencha as informações do pet para adicioná-lo ao sistema</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <ErrorMessage message={error} />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Pet *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input"
                placeholder="Ex: Rex"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Espécie *
              </label>
              <select
                name="species"
                value={formData.species}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="dog">🐕 Cachorro</option>
                <option value="cat">🐱 Gato</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Raça *
              </label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                required
                className="input"
                placeholder="Ex: Golden Retriever"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Idade (anos) *
              </label>
              <input
                type="number"
                name="age_years"
                value={formData.age_years}
                onChange={handleChange}
                required
                min="0"
                max="20"
                className="input"
                placeholder="Ex: 3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade do Abrigo *
              </label>
              <input
                type="text"
                name="shelter_city"
                value={formData.shelter_city}
                onChange={handleChange}
                required
                className="input"
                placeholder="Ex: São Paulo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input"
              >
                <option value="available">Disponível</option>
                <option value="adopted">Adotado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude *
              </label>
              <input
                type="number"
                name="shelter_lat"
                value={formData.shelter_lat}
                onChange={handleChange}
                required
                step="any"
                min="-90"
                max="90"
                className="input"
                placeholder="Ex: -23.5505"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude *
              </label>
              <input
                type="number"
                name="shelter_lng"
                value={formData.shelter_lng}
                onChange={handleChange}
                required
                step="any"
                min="-180"
                max="180"
                className="input"
                placeholder="Ex: -46.6333"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/pets')}
              className="btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Pet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetForm;
