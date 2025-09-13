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
    species: '',
    breed: '',
    age_years: '',
    description: '',
    shelter_city: '',
    shelter_cep: '',
    shelter_street: '',
    shelter_number: '',
    shelter_neighborhood: '',
    shelter_state: '',
    status: 'available'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const fetchCepData = async (cep) => {
    try {
      const cleanCep = cep.replace(/\D/g, '');
      if (cleanCep.length !== 8) return;

      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          shelter_cep: cep,
          shelter_street: data.logradouro || '',
          shelter_neighborhood: data.bairro || '',
          shelter_city: data.localidade || '',
          shelter_state: data.uf || ''
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // converte campos numéricos
      const submitData = {
        ...formData,
        age_years: parseInt(formData.age_years)
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
                <option value="">Selecione uma espécie</option>
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
          </div>

          {/* Campos de endereço brasileiro */}
          <div className="space-y-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-medium text-blue-900 mb-4">📍 Endereço do Abrigo</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CEP *
                </label>
                <input
                  type="text"
                  name="shelter_cep"
                  value={formData.shelter_cep}
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.value.replace(/\D/g, '').length === 8) {
                      fetchCepData(e.target.value);
                    }
                  }}
                  required
                  className="input"
                  placeholder="00000-000"
                  maxLength="9"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rua/Logradouro *
                </label>
                <input
                  type="text"
                  name="shelter_street"
                  value={formData.shelter_street}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="Ex: Rua das Flores"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número *
                </label>
                <input
                  type="text"
                  name="shelter_number"
                  value={formData.shelter_number}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="Ex: 123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bairro *
                </label>
                <input
                  type="text"
                  name="shelter_neighborhood"
                  value={formData.shelter_neighborhood}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="Ex: Centro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade *
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
                  Estado *
                </label>
                <input
                  type="text"
                  name="shelter_state"
                  value={formData.shelter_state}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="Ex: SP"
                  maxLength="2"
                />
              </div>
            </div>

            <div className="text-sm text-blue-600 bg-blue-100 p-3 rounded">
              💡 <strong>Dica:</strong> Digite o CEP e os outros campos serão preenchidos automaticamente!
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
