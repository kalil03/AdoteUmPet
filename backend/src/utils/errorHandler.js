//utilitarios para tratamento de erros padronizado

//erros customizados da aplicação
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * cria uma resposta de erro padronizada
 * @param {Object} res - response 
 * @param {number} statusCode - status HTTP
 * @param {string} message - erro
 * @param {Object} details - detalhes do erro
 */
const sendErrorResponse = (res, statusCode, message, details = null) => {
  const response = {
    error: 'Erro',
    message,
    ...(details && { details })
  };
  
  return res.status(statusCode).json(response);
};

/**
 * Valida campos obrigatórios
 * @param {Array} requiredFields - nomes dos campos obrigatórios
 * @param {Object} body - corpo da requisição
 * @throws {AppError} se algum campo obrigatório estiver faltando
 */
const validateRequiredFields = (requiredFields, body) => {
  const missingFields = requiredFields.filter(field => {
    const value = body[field];
    return value === undefined || value === null || value === '';
  });
  
  if (missingFields.length > 0) {
    throw new AppError(
      `Campos obrigatórios não fornecidos: ${missingFields.join(', ')}`,
      400
    );
  }
};

/**
 * se um valor está dentro de um range
 * @param {any} value -  validado
 * @param {number} min 
 * @param {number} max 
 * @param {string} fieldName - Nome do campo p/msg de erro
 * @throws {AppError} valor estiver fora do range
 */
const validateRange = (value, min, max, fieldName) => {
  if (value < min || value > max) {
    throw new AppError(
      `${fieldName} deve estar entre ${min} e ${max}`,
      400
    );
  }
};

/**
 * se um valor está em uma lista de opções válidas
 * @param {any} value -  validado
 * @param {Array} validOptions - opções validas
 * @param {string} fieldName - nome do campo
 * @throws {AppError} - valor não estiver na lista
 */
const validateEnum = (value, validOptions, fieldName) => {
  if (!validOptions.includes(value)) {
    throw new AppError(
      `${fieldName} deve ser um dos seguintes valores: ${validOptions.join(', ')}`,
      400
    );
  }
};

/**
 * valida string não vazia
 * @param {string} value - validado
 * @param {string} fieldName - nome do campo
 * @param {number} minLength - min
 * @param {number} maxLength -  max
 * @throws {AppError} Se a string for inválida
 */
const validateString = (value, fieldName, minLength = 1, maxLength = 255) => {
  if (typeof value !== 'string' || value.trim().length < minLength) {
    throw new AppError(
      `${fieldName} deve ser uma string com pelo menos ${minLength} caracteres`,
      400
    );
  }
  
  if (value.length > maxLength) {
    throw new AppError(
      `${fieldName} deve ter no máximo ${maxLength} caracteres`,
      400
    );
  }
};

/**
 * Middleware para capturar erros não tratados
 * @param {Error} err - Erro capturado
 * @param {Object} req - objeto request do express
 * @param {Object} res - ebjeto response do express
 * @param {Function} next - função next do express
 */
const errorHandler = (err, req, res, next) => {
  console.error('Erro capturado:', err);

  // erro da aplicação
  if (err instanceof AppError) {
    return sendErrorResponse(res, err.statusCode, err.message);
  }

  // erro de validação do sequelize
  if (err.name === 'SequelizeValidationError') {
    const validationErrors = err.errors.map(error => error.message);
    return sendErrorResponse(res, 400, 'Erro de validação dos dados', validationErrors);
  }

  // erro de chave duplicada do sequelize
  if (err.name === 'SequelizeUniqueConstraintError') {
    return sendErrorResponse(res, 409, 'Dados duplicados - registro já existe');
  }

  // erro de conexão com banco de dados
  if (err.name === 'SequelizeConnectionError') {
    return sendErrorResponse(res, 503, 'Erro de conexão com o banco de dados');
  }

  // erro de timeout
  if (err.code === 'ECONNABORTED') {
    return sendErrorResponse(res, 504, 'Timeout da requisição');
  }

  // erro de API externa
  if (err.response) {
    return sendErrorResponse(res, 502, 'Erro da API externa', {
      status: err.response.status,
      data: err.response.data
    });
  }

  // erro interno do servidor
  const message = process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'Erro interno do servidor';
    
  return sendErrorResponse(res, 500, message);
};

/**
 * middleware para capturar rotas não encontradas
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
const notFoundHandler = (req, res, next) => {
  return sendErrorResponse(res, 404, 'Rota não encontrada', {
    method: req.method,
    url: req.originalUrl
  });
};

module.exports = {
  AppError,
  sendErrorResponse,
  validateRequiredFields,
  validateRange,
  validateEnum,
  validateString,
  errorHandler,
  notFoundHandler
};
