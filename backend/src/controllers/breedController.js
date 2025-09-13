const axios = require('axios');
// cache em 1h
const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hora em millisegundos
//verificar se o cache ainda é válido
const isCacheValid = (timestamp) => {
  return Date.now() - timestamp < CACHE_TTL;
};
//normalizar dados da API de cães
const normalizeDogBreed = (breed) => {
  return {
    name: breed.name || 'Nome não disponível',
    origin: breed.origin || 'Origem não disponível',
    energy_level: breed.energy_level || 3,
    image_url: breed.image?.url || null
  };
};
//normalizar dados da API de gatos
const normalizeCatBreed = (breed) => {
  return {
    name: breed.name || 'Nome não disponível',
    origin: breed.origin || 'Origem não disponível',
    energy_level: breed.energy_level || 3,
    image_url: breed.image?.url || null
  };
};
//filtrar raças por nome
const filterBreedsByName = (breeds, query) => {
  if (!query) return breeds;
  
  const searchTerm = query.toLowerCase();
  return breeds.filter(breed => 
    breed.name.toLowerCase().includes(searchTerm)
  );
};

const getBreeds = async (req, res) => {
  try {
    const { species } = req.params;
    const { q } = req.query;

    //validação da espécie
    if (!species || !['dog', 'cat'].includes(species.toLowerCase())) {
      return res.status(400).json({
        error: 'Espécie inválida',
        message: 'A espécie deve ser "dog" ou "cat"'
      });
    }

    const speciesKey = species.toLowerCase();
    const cacheKey = `${speciesKey}_${q || 'all'}`;
    //verifica se existe no cache e se ainda é válido
    if (cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey);
      if (isCacheValid(cachedData.timestamp)) {
        console.log(`Retornando dados do cache para ${speciesKey}`);
        return res.status(200).json({
          species: speciesKey,
          count: cachedData.data.length,
          data: cachedData.data
        });
      } else {
        // remove cache expirado
        cache.delete(cacheKey);
      }
    }
    //api baseada na espécie
    let apiUrl, apiKey, normalizeFunction;
    
    if (speciesKey === 'dog') {
      apiUrl = 'https://api.thedogapi.com/v1/breeds';
      apiKey = process.env.DOG_API_KEY;
      normalizeFunction = normalizeDogBreed;
    } else {
      apiUrl = 'https://api.thecatapi.com/v1/breeds';
      apiKey = process.env.CAT_API_KEY;
      normalizeFunction = normalizeCatBreed;
    }
    //verifica se a chave da API está configurada
    if (!apiKey) {
      return res.status(500).json({
        error: 'Configuração de API não encontrada',
        message: `Chave da API para ${speciesKey} não configurada`
      });
    }
    //faz a requisição para a API externa
    console.log(`Fazendo requisição para ${apiUrl}`);
    const response = await axios.get(apiUrl, {
      headers: {
        'x-api-key': apiKey
      },
      timeout: 10000 //10s
    });
    //normaliza os dados
    const normalizedBreeds = response.data.map(normalizeFunction);
    //filtra por nome se query fornecida
    const filteredBreeds = filterBreedsByName(normalizedBreeds, q);
    //salva no cache
    cache.set(cacheKey, {
      data: filteredBreeds,
      timestamp: Date.now()
    });
    //limpa cache expirado periodicamente
    if (cache.size > 100) {
      for (const [key, value] of cache.entries()) {
        if (!isCacheValid(value.timestamp)) {
          cache.delete(key);
        }
      }
    }

    res.status(200).json({
      species: speciesKey,
      count: filteredBreeds.length,
      data: filteredBreeds
    });

  } catch (error) {
    console.error('Erro ao buscar raças:', error);
    //tratamento de erros específicos
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        error: 'Timeout da API externa',
        message: 'A API externa demorou muito para responder'
      });
    }

    if (error.response) {
      //erro da API externa
      return res.status(502).json({
        error: 'Erro da API externa',
        message: `API externa retornou erro: ${error.response.status}`,
        details: error.response.data
      });
    }
    //erro interno
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível buscar as raças'
    });
  }
};
module.exports = {
  getBreeds
};


