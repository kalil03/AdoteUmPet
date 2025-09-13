import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { petsAPI } from '../services/api';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const PetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await petsAPI.getPetById(id);
        setPet(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao carregar pet');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPet();
    }
  }, [id]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { color: 'bg-green-100 text-green-800', text: 'Disponível' },
      adopted: { color: 'bg-gray-100 text-gray-800', text: 'Adotado' }
    };
    
    const config = statusConfig[status] || statusConfig.available;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getSpeciesIcon = (species) => {
    return species === 'dog' ? '🐕' : '🐱';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <Loader size="lg" text="Carregando pet..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => navigate('/pets')} retryText="Voltar para Lista" />;
  if (!pet) return <ErrorMessage message="Pet não encontrado" onRetry={() => navigate('/pets')} retryText="Voltar para Lista" />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link
            to="/pets"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Voltar para Lista
          </Link>
        </div>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-6xl">{getSpeciesIcon(pet.species)}</span>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{pet.name}</h1>
              <p className="text-xl text-gray-600">{pet.breed}</p>
            </div>
          </div>
          {getStatusBadge(pet.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informações Principais */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações Básicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Espécie</label>
                <p className="text-lg text-gray-900 capitalize">
                  {pet.species === 'dog' ? 'Cachorro' : 'Gato'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Idade</label>
                <p className="text-lg text-gray-900">{pet.age_years} anos</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Raça</label>
                <p className="text-lg text-gray-900">{pet.breed}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">{getStatusBadge(pet.status)}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Localização</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Cidade do Abrigo</label>
                <p className="text-lg text-gray-900">{pet.shelter_city}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Latitude</label>
                  <p className="text-sm text-gray-900 font-mono">{pet.shelter_lat}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Longitude</label>
                  <p className="text-sm text-gray-900 font-mono">{pet.shelter_lng}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações do Sistema</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">ID</label>
                <p className="text-sm text-gray-900 font-mono break-all">{pet.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Criado em</label>
                <p className="text-sm text-gray-900">{formatDate(pet.created_at)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Atualizado em</label>
                <p className="text-sm text-gray-900">{formatDate(pet.updated_at)}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações</h2>
            <div className="space-y-3">
              <button className="w-full btn-primary">
                {pet.status === 'available' ? 'Interessado em Adotar' : 'Pet Já Adotado'}
              </button>
              <Link
                to="/pets"
                className="w-full btn-secondary text-center block"
              >
                Ver Outros Pets
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetail;
