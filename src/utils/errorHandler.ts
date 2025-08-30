/**
 * Утилита для обработки ошибок API с правильной типизацией
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ErrorResponse {
  message?: string;
  errorsMessages?: ValidationError[];
  errorMessages?: string[];
  error?: string;
}

/**
 * Безопасная обработка ошибок с правильной типизацией
 */
export const handleApiErrorSafe = (
  error: unknown,
  defaultMessage: string = "Произошла ошибка"
): string => {
  // Проверяем, что это объект с response
  if (error && typeof error === 'object' && 'response' in error) {
    const errorWithResponse = error as { response?: { status?: number; data?: ErrorResponse } };
    const status = errorWithResponse.response?.status;
    const errorData: ErrorResponse = errorWithResponse.response?.data || {};

    if (status === 400) {
      if (errorData.errorsMessages && Array.isArray(errorData.errorsMessages)) {
        return errorData.errorsMessages
          .map((err) => `${err.field}: ${err.message}`)
          .join(', ');
      }
    }

    return errorData.message || defaultMessage;
  }

  // Если это обычная ошибка с message
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as Error).message;
  }

  return defaultMessage;
};

/**
 * Получает массив ошибок для отображения в UI
 */
export const getErrorMessages = (error: unknown): string[] => {
  if (error && typeof error === 'object' && 'response' in error) {
    const errorWithResponse = error as { response?: { data?: ErrorResponse } };
    const errorData = errorWithResponse.response?.data;
    
    if (errorData) {
      const errorMessages: string[] = [];
      
      if (errorData.errorMessages) {
        errorMessages.push(...errorData.errorMessages);
      }
      if (errorData.errorsMessages) {
        errorData.errorsMessages.forEach(validationError => {
          if (validationError.message) {
            errorMessages.push(validationError.message);
          }
        });
      }
      if (errorData.message) {
        errorMessages.push(errorData.message);
      }
      if (errorData.error) {
        errorMessages.push(errorData.error);
      }
      
      if (errorMessages.length > 0) {
        return Array.from(new Set(errorMessages)); // удаляем дубликаты
      }
    }
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return [(error as Error).message];
  }
  
  return ['Произошла неизвестная ошибка'];
};
