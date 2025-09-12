/**
 * @param {Object} res 
 * @param {number} statusCode 
 * @param {string} message - 
 * @param {Object} data 
 * @param {Object} meta 
 */
const sendResponse = (res, statusCode, message, data = null, meta = null) => {
  const response = {
    success: statusCode >= 200 && statusCode < 300,
    message,
    ...(data && { data }),
    ...(meta && { meta })
  };
  
  return res.status(statusCode).json(response);
};

/**
 * @param {Function} fn - func assincrona para tratar erros e evitar try/catch
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Valida campos obrigatorios
 * @param {Array} requiredFields - array com nomes obrigatorios
 * @param {Object} body - corpo requisicao
 */
const validateRequiredFields = (requiredFields, body) => {
  const missingFields = requiredFields.filter(field => !body[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  } //lança um erro se algum campo estiver falatando
  
  return true;
};

/**
 * metadados p/respostas paginadas
 * @param {number} page - atual
 * @param {number} limit - itens p/pagina
 * @param {number} total 
 */
const getPaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

module.exports = { //exporta func p/serem usadas em outras partes
  sendResponse,
  asyncHandler,
  validateRequiredFields,
  getPaginationMeta
};
