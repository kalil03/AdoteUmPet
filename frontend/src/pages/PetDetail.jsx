import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { petsAPI } from '../services/api';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import 'leaflet/dist/leaflet.css';

// marcadores do leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [interestForm, setInterestForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submittingInterest, setSubmittingInterest] = useState(false);
  const [interestSuccess, setInterestSuccess] = useState(false);
  const [mapCoordinates, setMapCoordinates] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);

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

  //geocodificar endereço quando pet for carregado
  useEffect(() => {
    const geocodeAddress = async () => {
      if (!pet || !pet.shelter_cep) return;
      
      setMapLoading(true);
      try {
        const address = `${pet.shelter_street}, ${pet.shelter_number}, ${pet.shelter_neighborhood}, ${pet.shelter_city}, ${pet.shelter_state}, ${pet.shelter_cep}`;
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=br&limit=1`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          setMapCoordinates({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          });
        } else {
          // Fallback: tentar apenas com CEP
          const cepResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${pet.shelter_cep}&countrycodes=br&limit=1`);
          const cepData = await cepResponse.json();
          
          if (cepData && cepData.length > 0) {
            setMapCoordinates({
              lat: parseFloat(cepData[0].lat),
              lng: parseFloat(cepData[0].lon)
            });
          }
        }
      } catch (error) {
        console.error('Erro ao geocodificar endereço:', error);
      } finally {
        setMapLoading(false);
      }
    };

    geocodeAddress();
  }, [pet]);

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

  const handleInterestClick = () => {
    setShowInterestModal(true);
    setInterestSuccess(false);
  };

  const handleInterestFormChange = (field, value) => {
    setInterestForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInterestSubmit = async (e) => {
    e.preventDefault();
    
    //validação básica
    if (!interestForm.name || !interestForm.email || !interestForm.phone) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setSubmittingInterest(true);
      
      //simular envio (você pode implementar a API real depois)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setInterestSuccess(true);
      setTimeout(() => {
        setShowInterestModal(false);
        setInterestForm({ name: '', email: '', phone: '', message: '' });
      }, 2000);
      
    } catch (err) {
      alert('Erro ao enviar manifestação de interesse. Tente novamente.');
    } finally {
      setSubmittingInterest(false);
    }
  };

  const closeInterestModal = () => {
    setShowInterestModal(false);
    setInterestForm({ name: '', email: '', phone: '', message: '' });
    setInterestSuccess(false);
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
          {/* Informações Básicas */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações Básicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Nome</label>
                <p className="text-lg text-gray-900 font-medium">{pet.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Espécie</label>
                <p className="text-lg text-gray-900 capitalize">
                  {pet.species === 'dog' ? 'Cachorro' : 'Gato'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Raça</label>
                <p className="text-lg text-gray-900">{pet.breed}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Idade</label>
                <p className="text-lg text-gray-900">{pet.age_years} anos</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                <div className="mt-1">{getStatusBadge(pet.status)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">ID do Pet</label>
                <p className="text-sm text-gray-600 font-mono break-all">{pet.id}</p>
              </div>
            </div>
          </div>

          {/* Localização */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📍 Endereço do Abrigo</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">CEP</label>
                  <p className="text-lg text-gray-900">{pet.shelter_cep}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Cidade/Estado</label>
                  <p className="text-lg text-gray-900">{pet.shelter_city}, {pet.shelter_state}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Rua</label>
                  <p className="text-lg text-gray-900">{pet.shelter_street}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Número</label>
                  <p className="text-lg text-gray-900">{pet.shelter_number}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Bairro</label>
                <p className="text-lg text-gray-900">{pet.shelter_neighborhood}</p>
              </div>

              {/* Endereço Completo */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-500 mb-2">Endereço Completo</label>
                <p className="text-gray-900">
                  {pet.shelter_street}, {pet.shelter_number} - {pet.shelter_neighborhood}
                  <br />
                  {pet.shelter_city}, {pet.shelter_state} - CEP: {pet.shelter_cep}
                </p>
              </div>

              {/* Mapa */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-500 mb-3">📍 Localização no Mapa</label>
                {mapLoading ? (
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-500">Carregando mapa...</p>
                    </div>
                  </div>
                ) : mapCoordinates ? (
                  <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
                    <MapContainer
                      center={[mapCoordinates.lat, mapCoordinates.lng]}
                      zoom={16}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[mapCoordinates.lat, mapCoordinates.lng]}>
                        <Popup>
                          <div className="text-center">
                            <p className="font-medium">{pet.name}</p>
                            <p className="text-sm text-gray-600">{pet.breed}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {pet.shelter_street}, {pet.shelter_number}
                              <br />
                              {pet.shelter_neighborhood} - {pet.shelter_city}/{pet.shelter_state}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                ) : (
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-sm text-gray-500">Não foi possível localizar o endereço no mapa</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Informações do Sistema */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações do Sistema</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Data de Criação</label>
                <p className="text-sm text-gray-900">{formatDate(pet.created_at)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Última Atualização</label>
                <p className="text-sm text-gray-900">{formatDate(pet.updated_at)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ações */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações</h2>
            <div className="space-y-3">
              <button 
                onClick={handleInterestClick}
                className={`w-full inline-flex items-center justify-center px-4 py-2 rounded-md font-medium text-center transition-colors duration-200 ${
                  pet.status === 'available' 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' 
                    : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                }`}
                disabled={pet.status !== 'available'}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {pet.status === 'available' ? 'Interessado em Adotar' : 'Pet Já Adotado'}
              </button>
              <Link
                to="/pets"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-center block text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Ver Outros Pets
              </Link>
            </div>
          </div>

          {/* Resumo Rápido */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getSpeciesIcon(pet.species)}</span>
                <div>
                  <p className="font-medium text-gray-900">{pet.name}</p>
                  <p className="text-sm text-gray-600">{pet.breed}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Idade:</span>
                  <span className="text-gray-900">{pet.age_years} anos</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Status:</span>
                  <span className="text-gray-900">{pet.status === 'available' ? 'Disponível' : 'Adotado'}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Local:</span>
                  <span className="text-gray-900">{pet.shelter_city}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Manifestação de Interesse */}
      {showInterestModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Manifestar Interesse em Adoção
                </h3>
                <button
                  onClick={closeInterestModal}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {interestSuccess ? (
                <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Interesse Enviado!</h3>
                  <p className="text-sm text-gray-500">
                    Sua manifestação de interesse foi enviada com sucesso. O abrigo entrará em contato em breve.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInterestSubmit} className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getSpeciesIcon(pet.species)}</span>
                      <div>
                        <p className="font-medium text-blue-900">{pet.name}</p>
                        <p className="text-sm text-blue-700">{pet.breed} • {pet.shelter_city}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={interestForm.name}
                      onChange={(e) => handleInterestFormChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={interestForm.email}
                      onChange={(e) => handleInterestFormChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      value={interestForm.phone}
                      onChange={(e) => handleInterestFormChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mensagem (Opcional)
                    </label>
                    <textarea
                      value={interestForm.message}
                      onChange={(e) => handleInterestFormChange('message', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Conte um pouco sobre você e por que gostaria de adotar este pet..."
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeInterestModal}
                      disabled={submittingInterest}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={submittingInterest}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {submittingInterest ? (
                        <>
                          <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Enviar Interesse
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetDetail;
