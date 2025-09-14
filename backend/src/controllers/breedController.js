const axios = require('axios');
// cache em 1h
const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hora em millisegundos

// dicionário de tradução de temperamentos
const temperamentTranslations = {
  // Características gerais
  'active': 'ativo',
  'energetic': 'energético',
  'playful': 'brincalhão',
  'calm': 'calmo',
  'docile': 'dócil',
  'gentle': 'gentil',
  'alert': 'alerta',
  'intelligent': 'inteligente',
  'friendly': 'amigável',
  'independent': 'independente',
  'aloof': 'distante',
  'loyal': 'leal',
  'affectionate': 'carinhoso',
  'protective': 'protetor',
  'confident': 'confiante',
  'outgoing': 'sociável',
  'reserved': 'reservado',
  'patient': 'paciente',
  'curious': 'curioso',
  'adaptable': 'adaptável',
  'social': 'social',
  'quiet': 'quieto',
  'vocal': 'vocal',
  'sweet': 'doce',
  'loving': 'amoroso',
  'devoted': 'devotado',
  'brave': 'corajoso',
  'bold': 'audacioso',
  'fearless': 'destemido',
  'timid': 'tímido',
  'shy': 'tímido',
  'aggressive': 'agressivo',
  'territorial': 'territorial',
  'dominant': 'dominante',
  'submissive': 'submisso',
  'stubborn': 'teimoso',
  'obedient': 'obediente',
  'trainable': 'treinável',
  'eager to please': 'ansioso para agradar',
  'responsive': 'responsivo',
  'sensitive': 'sensível',
  'hardy': 'resistente',
  'robust': 'robusto',
  'delicate': 'delicado',
  'graceful': 'gracioso',
  'elegant': 'elegante',
  'athletic': 'atlético',
  'agile': 'ágil',
  'strong': 'forte',
  'powerful': 'poderoso',
  'muscular': 'musculoso',
  'compact': 'compacto',
  'sturdy': 'robusto',
  'balanced': 'equilibrado',
  'even-tempered': 'temperamento equilibrado',
  'good-natured': 'bem-humorado',
  'cheerful': 'alegre',
  'happy': 'feliz',
  'joyful': 'alegre',
  'lively': 'vivaz',
  'spirited': 'espirituoso',
  'enthusiastic': 'entusiasmado',
  'eager': 'ansioso',
  'keen': 'perspicaz',
  'alert': 'alerta',
  'watchful': 'vigilante',
  'attentive': 'atento',
  'focused': 'focado',
  'determined': 'determinado',
  'persistent': 'persistente',
  'tenacious': 'tenaz',
  'willful': 'voluntarioso',
  'headstrong': 'teimoso',
  'mischievous': 'travesso',
  'fun-loving': 'divertido',
  'entertaining': 'divertido',
  'amusing': 'divertido',
  'clownish': 'palhaço',
  'comical': 'cômico',
  'dignified': 'digno',
  'noble': 'nobre',
  'regal': 'real',
  'majestic': 'majestoso',
  'proud': 'orgulhoso',
  'self-assured': 'autoconfiante',
  'composed': 'composto',
  'serene': 'sereno',
  'tranquil': 'tranquilo',
  'peaceful': 'pacífico',
  'relaxed': 'relaxado',
  'laid-back': 'descontraído',
  'easy-going': 'tranquilo',
  'flexible': 'flexível',
  'versatile': 'versátil',
  'adaptable': 'adaptável',
  'resilient': 'resiliente',
  'stable': 'estável',
  'reliable': 'confiável',
  'consistent': 'consistente',
  'predictable': 'previsível',
  'steady': 'estável',
  'dependable': 'confiável',
  'trustworthy': 'confiável',
  'honest': 'honesto',
  'sincere': 'sincero',
  'genuine': 'genuíno',
  'authentic': 'autêntico',
  'natural': 'natural',
  'spontaneous': 'espontâneo',
  'impulsive': 'impulsivo',
  'excitable': 'excitável',
  'hyperactive': 'hiperativo',
  'restless': 'inquieto',
  'fidgety': 'agitado',
  'nervous': 'nervoso',
  'anxious': 'ansioso',
  'worried': 'preocupado',
  'fearful': 'medroso',
  'cautious': 'cauteloso',
  'careful': 'cuidadoso',
  'prudent': 'prudente',
  'wise': 'sábio',
  'clever': 'esperto',
  'smart': 'inteligente',
  'bright': 'brilhante',
  'quick': 'rápido',
  'sharp': 'perspicaz',
  'witty': 'espirituoso',
  'charming': 'charmoso',
  'appealing': 'atraente',
  'endearing': 'cativante',
  'adorable': 'adorável',
  'cute': 'fofo',
  'beautiful': 'bonito',
  'handsome': 'bonito',
  'attractive': 'atraente',
  'striking': 'impressionante',
  'distinctive': 'distintivo',
  'unique': 'único',
  'special': 'especial',
  'extraordinary': 'extraordinário',
  'remarkable': 'notável',
  'outstanding': 'excepcional',
  'excellent': 'excelente',
  'superior': 'superior',
  'exceptional': 'excepcional',
  'rare': 'raro',
  'uncommon': 'incomum',
  'unusual': 'incomum',
  'exotic': 'exótico',
  'foreign': 'estrangeiro',
  'domestic': 'doméstico',
  'wild': 'selvagem',
  'feral': 'selvagem',
  'primitive': 'primitivo',
  'ancient': 'antigo',
  'old': 'velho',
  'mature': 'maduro',
  'adult': 'adulto',
  'young': 'jovem',
  'youthful': 'jovem',
  'puppy-like': 'como filhote',
  'kitten-like': 'como filhote',
  'childish': 'infantil',
  'immature': 'imaturo',
  'naive': 'ingênuo',
  'innocent': 'inocente',
  'pure': 'puro',
  'clean': 'limpo',
  'healthy': 'saudável',
  'fit': 'em forma',
  'strong-willed': 'determinado',
  'mild-mannered': 'de temperamento suave',
  'well-behaved': 'bem comportado',
  'polite': 'educado',
  'courteous': 'cortês',
  'respectful': 'respeitoso',
  'considerate': 'atencioso',
  'thoughtful': 'pensativo',
  'caring': 'cuidadoso',
  'nurturing': 'protetor',
  'maternal': 'maternal',
  'paternal': 'paternal',
  'family-oriented': 'orientado para família',
  'child-friendly': 'amigo das crianças',
  'good with children': 'bom com crianças',
  'good with kids': 'bom com crianças',
  'tolerant': 'tolerante',
  'forgiving': 'perdoador',
  'understanding': 'compreensivo',
  'empathetic': 'empático',
  'compassionate': 'compassivo',
  'kind': 'gentil',
  'benevolent': 'benevolente',
  'generous': 'generoso',
  'giving': 'generoso',
  'selfless': 'altruísta',
  'unselfish': 'altruísta',
  'helpful': 'prestativo',
  'cooperative': 'cooperativo',
  'collaborative': 'colaborativo',
  'team-oriented': 'orientado para equipe',
  'sociable': 'sociável',
  'gregarious': 'gregário',
  'extroverted': 'extrovertido',
  'introverted': 'introvertido',
  'solitary': 'solitário',
  'loner': 'solitário',
  'reclusive': 'recluso',
  'withdrawn': 'retraído',
  'secretive': 'reservado',
  'mysterious': 'misterioso',
  'enigmatic': 'enigmático',
  'complex': 'complexo',
  'complicated': 'complicado',
  'simple': 'simples',
  'straightforward': 'direto',
  'honest': 'honesto',
  'direct': 'direto',
  'blunt': 'direto',
  'frank': 'franco',
  'open': 'aberto',
  'transparent': 'transparente',
  'clear': 'claro',
  'obvious': 'óbvio',
  'evident': 'evidente',
  'apparent': 'aparente',
  'visible': 'visível',
  'noticeable': 'perceptível',
  'prominent': 'proeminente',
  'conspicuous': 'conspícuo',
  'bold': 'audacioso',
  'daring': 'ousado',
  'adventurous': 'aventureiro',
  'exploratory': 'explorador',
  'inquisitive': 'curioso',
  'investigative': 'investigativo',
  'analytical': 'analítico',
  'logical': 'lógico',
  'rational': 'racional',
  'reasonable': 'razoável',
  'sensible': 'sensato',
  'practical': 'prático',
  'realistic': 'realista',
  'pragmatic': 'pragmático',
  'down-to-earth': 'pé no chão',
  'grounded': 'centrado',
  'stable': 'estável',
  'solid': 'sólido',
  'firm': 'firme',
  'strong': 'forte',
  'tough': 'resistente',
  'resilient': 'resiliente',
  'enduring': 'duradouro',
  'lasting': 'duradouro',
  'permanent': 'permanente',
  'constant': 'constante',
  'continuous': 'contínuo',
  'persistent': 'persistente',
  'ongoing': 'contínuo',
  'sustained': 'sustentado',
  'maintained': 'mantido',
  'preserved': 'preservado',
  'protected': 'protegido',
  'safe': 'seguro',
  'secure': 'seguro',
  'comfortable': 'confortável',
  'relaxed': 'relaxado',
  'at ease': 'à vontade',
  'content': 'contente',
  'satisfied': 'satisfeito',
  'pleased': 'satisfeito',
  'delighted': 'encantado',
  'thrilled': 'emocionado',
  'excited': 'animado',
  'enthusiastic': 'entusiasmado',
  'passionate': 'apaixonado',
  'intense': 'intenso',
  'fervent': 'fervoroso',
  'zealous': 'zeloso',
  'devoted': 'devotado',
  'dedicated': 'dedicado',
  'committed': 'comprometido',
  'loyal': 'leal',
  'faithful': 'fiel',
  'true': 'verdadeiro',
  'genuine': 'genuíno',
  'real': 'real',
  'authentic': 'autêntico',
  'original': 'original',
  'unique': 'único',
  'one-of-a-kind': 'único',
  'special': 'especial',
  'distinctive': 'distintivo',
  'characteristic': 'característico',
  'typical': 'típico',
  'representative': 'representativo',
  'classic': 'clássico',
  'traditional': 'tradicional',
  'conventional': 'convencional',
  'standard': 'padrão',
  'normal': 'normal',
  'regular': 'regular',
  'ordinary': 'comum',
  'common': 'comum',
  'usual': 'usual',
  'familiar': 'familiar',
  'known': 'conhecido',
  'recognized': 'reconhecido',
  'established': 'estabelecido',
  'accepted': 'aceito',
  'approved': 'aprovado',
  'endorsed': 'endossado',
  'recommended': 'recomendado',
  'suggested': 'sugerido',
  'proposed': 'proposto',
  'offered': 'oferecido',
  'presented': 'apresentado',
  'shown': 'mostrado',
  'displayed': 'exibido',
  'exhibited': 'exibido',
  'demonstrated': 'demonstrado',
  'proven': 'provado',
  'tested': 'testado',
  'tried': 'testado',
  'experienced': 'experiente',
  'seasoned': 'experiente',
  'veteran': 'veterano',
  'skilled': 'habilidoso',
  'talented': 'talentoso',
  'gifted': 'talentoso',
  'capable': 'capaz',
  'able': 'capaz',
  'competent': 'competente',
  'qualified': 'qualificado',
  'certified': 'certificado',
  'licensed': 'licenciado',
  'authorized': 'autorizado',
  'permitted': 'permitido',
  'allowed': 'permitido',
  'approved': 'aprovado',
  'sanctioned': 'sancionado',
  'endorsed': 'endossado',
  'supported': 'apoiado',
  'backed': 'apoiado',
  'sponsored': 'patrocinado',
  'funded': 'financiado',
  'financed': 'financiado',
  'paid': 'pago',
  'compensated': 'compensado',
  'rewarded': 'recompensado',
  'recognized': 'reconhecido',
  'acknowledged': 'reconhecido',
  'appreciated': 'apreciado',
  'valued': 'valorizado',
  'treasured': 'valorizado',
  'cherished': 'querido',
  'beloved': 'amado',
  'adored': 'adorado',
  'worshipped': 'adorado',
  'revered': 'reverenciado',
  'respected': 'respeitado',
  'honored': 'honrado',
  'esteemed': 'estimado',
  'regarded': 'considerado',
  'viewed': 'visto',
  'seen': 'visto',
  'observed': 'observado',
  'noticed': 'notado',
  'spotted': 'avistado',
  'detected': 'detectado',
  'discovered': 'descoberto',
  'found': 'encontrado',
  'located': 'localizado',
  'identified': 'identificado',
  'recognized': 'reconhecido',
  'distinguished': 'distinguido',
  'differentiated': 'diferenciado',
  'separated': 'separado',
  'divided': 'dividido',
  'split': 'dividido',
  'broken': 'quebrado',
  'damaged': 'danificado',
  'harmed': 'prejudicado',
  'hurt': 'machucado',
  'injured': 'ferido',
  'wounded': 'ferido',
  'bleeding': 'sangrando',
  'bruised': 'machucado',
  'scarred': 'cicatrizado',
  'marked': 'marcado',
  'stained': 'manchado',
  'dirty': 'sujo',
  'clean': 'limpo',
  'pure': 'puro',
  'fresh': 'fresco',
  'new': 'novo',
  'recent': 'recente',
  'current': 'atual',
  'present': 'presente',
  'existing': 'existente',
  'available': 'disponível',
  'accessible': 'acessível',
  'reachable': 'alcançável',
  'attainable': 'atingível',
  'achievable': 'realizável',
  'possible': 'possível',
  'feasible': 'viável',
  'practical': 'prático',
  'realistic': 'realista',
  'reasonable': 'razoável',
  'logical': 'lógico',
  'sensible': 'sensato',
  'wise': 'sábio',
  'smart': 'inteligente',
  'clever': 'esperto',
  'bright': 'brilhante',
  'brilliant': 'brilhante',
  'genius': 'genial',
  'gifted': 'talentoso',
  'talented': 'talentoso',
  'skilled': 'habilidoso',
  'expert': 'especialista',
  'professional': 'profissional',
  'trained': 'treinado',
  'educated': 'educado',
  'learned': 'erudito',
  'knowledgeable': 'conhecedor',
  'informed': 'informado',
  'aware': 'consciente',
  'conscious': 'consciente',
  'alert': 'alerta',
  'awake': 'desperto',
  'vigilant': 'vigilante',
  'watchful': 'atento',
  'observant': 'observador',
  'perceptive': 'perceptivo',
  'insightful': 'perspicaz',
  'intuitive': 'intuitivo',
  'instinctive': 'instintivo',
  'natural': 'natural',
  'innate': 'inato',
  'inherent': 'inerente',
  'built-in': 'incorporado',
  'embedded': 'incorporado',
  'integrated': 'integrado',
  'combined': 'combinado',
  'mixed': 'misturado',
  'blended': 'misturado',
  'merged': 'fundido',
  'united': 'unido',
  'joined': 'unido',
  'connected': 'conectado',
  'linked': 'ligado',
  'attached': 'anexado',
  'bonded': 'ligado',
  'tied': 'amarrado',
  'bound': 'ligado',
  'secured': 'seguro',
  'fastened': 'preso',
  'fixed': 'fixo',
  'stable': 'estável',
  'steady': 'estável',
  'firm': 'firme',
  'solid': 'sólido',
  'strong': 'forte',
  'powerful': 'poderoso',
  'mighty': 'poderoso',
  'forceful': 'forte',
  'vigorous': 'vigoroso',
  'energetic': 'energético',
  'dynamic': 'dinâmico',
  'lively': 'vivaz',
  'animated': 'animado',
  'spirited': 'espirituoso',
  'vivacious': 'vivaz',
  'bubbly': 'efervescente',
  'effervescent': 'efervescente',
  'sparkling': 'brilhante',
  'glittering': 'brilhante',
  'shining': 'brilhante',
  'radiant': 'radiante',
  'glowing': 'brilhante',
  'luminous': 'luminoso',
  'bright': 'brilhante',
  'brilliant': 'brilhante',
  'dazzling': 'deslumbrante',
  'stunning': 'impressionante',
  'amazing': 'incrível',
  'incredible': 'incrível',
  'unbelievable': 'inacreditável',
  'fantastic': 'fantástico',
  'wonderful': 'maravilhoso',
  'marvelous': 'maravilhoso',
  'excellent': 'excelente',
  'outstanding': 'excepcional',
  'exceptional': 'excepcional',
  'remarkable': 'notável',
  'extraordinary': 'extraordinário',
  'phenomenal': 'fenomenal',
  'spectacular': 'espetacular',
  'magnificent': 'magnífico',
  'splendid': 'esplêndido',
  'superb': 'soberbo',
  'supreme': 'supremo',
  'ultimate': 'último',
  'perfect': 'perfeito',
  'flawless': 'impecável',
  'ideal': 'ideal',
  'model': 'modelo',
  'exemplary': 'exemplar',
  'standard': 'padrão'
};

// Função para traduzir temperamento
const translateTemperament = (temperament) => {
  if (!temperament || temperament === 'Temperamento não disponível') {
    return 'Temperamento não disponível';
  }

  // Divide o temperamento em palavras/frases e traduz cada uma
  const parts = temperament.split(/[,;]/).map(part => part.trim());
  const translatedParts = parts.map(part => {
    const lowerPart = part.toLowerCase();
    
    // Procura por traduções exatas primeiro
    if (temperamentTranslations[lowerPart]) {
      return temperamentTranslations[lowerPart];
    }
    
    // Procura por palavras-chave dentro da frase
    let translated = part;
    for (const [english, portuguese] of Object.entries(temperamentTranslations)) {
      if (lowerPart.includes(english)) {
        translated = translated.replace(new RegExp(english, 'gi'), portuguese);
      }
    }
    
    return translated;
  });

  return translatedParts.join(', ');
};
//verificar se o cache ainda é válido
const isCacheValid = (timestamp) => {
  return Date.now() - timestamp < CACHE_TTL;
};
//normalizar dados da API de cães
const normalizeDogBreed = (breed) => {
  // mapear temperamento para nível de energia
  const getEnergyFromTemperament = (temperament) => {
    if (!temperament) return 3;
    const temp = temperament.toLowerCase();
    if (temp.includes('active') || temp.includes('energetic') || temp.includes('playful')) return 5;
    if (temp.includes('calm') || temp.includes('docile') || temp.includes('gentle')) return 2;
    if (temp.includes('alert') || temp.includes('intelligent') || temp.includes('friendly')) return 4;
    if (temp.includes('independent') || temp.includes('aloof')) return 2;
    return 3;
  };

  // melhorar lógica de origem com múltiplos fallbacks
  const getOrigin = (breed) => {
    // tenta origin primeiro
    if (breed.origin && breed.origin.trim() !== '') {
      return breed.origin;
    }
    
    // tenta country_code
    if (breed.country_code && breed.country_code.trim() !== '') {
      return breed.country_code;
    }
    
    // tenta extrair do nome da raça (alguns têm origem no nome)
    const name = breed.name?.toLowerCase() || '';
    if (name.includes('afghan')) return 'Afeganistão';
    if (name.includes('akita')) return 'Japão';
    if (name.includes('german')) return 'Alemanha';
    if (name.includes('english')) return 'Inglaterra';
    if (name.includes('american')) return 'Estados Unidos';
    if (name.includes('australian')) return 'Austrália';
    if (name.includes('irish')) return 'Irlanda';
    if (name.includes('scottish')) return 'Escócia';
    if (name.includes('french')) return 'França';
    if (name.includes('italian')) return 'Itália';
    if (name.includes('spanish')) return 'Espanha';
    if (name.includes('chinese')) return 'China';
    if (name.includes('japanese')) return 'Japão';
    if (name.includes('siberian')) return 'Sibéria';
    if (name.includes('alaskan')) return 'Alasca';
    if (name.includes('african')) return 'África';
    
    return 'Origem não disponível';
  };

  return {
    name: breed.name || 'Nome não disponível',
    origin: getOrigin(breed),
    energy_level: getEnergyFromTemperament(breed.temperament),
    temperament: translateTemperament(breed.temperament),
    image_url: breed.reference_image_id 
      ? `https://cdn2.thedogapi.com/images/${breed.reference_image_id}.jpg`
      : null
  };
};
//normalizar dados da API de gatos
const normalizeCatBreed = (breed) => {
  return {
    name: breed.name || 'Nome não disponível',
    origin: breed.origin || 'Origem não disponível',
    energy_level: breed.energy_level || 3,
    temperament: translateTemperament(breed.temperament),
    image_url: breed.reference_image_id 
      ? `https://cdn2.thecatapi.com/images/${breed.reference_image_id}.jpg`
      : null
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


