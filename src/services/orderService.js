import axios from 'axios'
import { config } from '../config'

// Configurar timeout para axios
axios.defaults.timeout = config.API_TIMEOUT

/**
 * Servicio para manejar todas las operaciones con órdenes
 * Lo hice así para separar la lógica de API del componente
 */
class OrderService {
  constructor(apiClient = axios) {
    this.apiClient = apiClient
    this.baseURL = config.API_BASE_URL
  }

  /**
   * Obtener todas las órdenes activas del backend
   * @returns {Promise<Array>} Lista de órdenes
   */
  async getOrders() {
    try {
      const response = await this.apiClient.get(`${this.baseURL}/orders`)
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        }
      } else {
        throw new Error(response.data.message || 'Error al cargar las órdenes')
      }
    } catch (error) {
      return this._handleError(error, 'Error al cargar las órdenes')
    }
  }

  /**
   * Crear una nueva orden en el sistema
   * @param {Object} orderData - Datos de la orden a crear
   * @returns {Promise<Object>} Resultado de la operación
   */
  async createOrder(orderData) {
    try {
      const response = await this.apiClient.post(`${this.baseURL}/orders`, orderData)
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        }
      } else {
        throw new Error(response.data.message || 'Error al crear la orden')
      }
    } catch (error) {
      return this._handleError(error, 'Error al crear la orden')
    }
  }

  /**
   * Avanzar el estado de una orden (initiated -> sent -> delivered)
   * @param {number} orderId - ID de la orden a avanzar
   * @returns {Promise<Object>} Resultado de la operación
   */
  async advanceOrder(orderId) {
    try {
      const response = await this.apiClient.post(`${this.baseURL}/orders/${orderId}/advance`)
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        }
      } else {
        throw new Error(response.data.message || 'Error al avanzar la orden')
      }
    } catch (error) {
      return this._handleError(error, 'Error al actualizar la orden')
    }
  }

  /**
   * Manejo centralizado de errores - me ayuda a tener consistencia
   * @private
   */
  _handleError(error, defaultMessage) {
    console.error('OrderService Error:', error)
    
    let errorMessage = defaultMessage
    let errorType = 'UNKNOWN'

    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Tiempo de espera agotado. Verifica que la API esté ejecutándose.'
      errorType = 'TIMEOUT'
    } else if (error.response) {
      // Error del servidor
      errorMessage = `Error del servidor: ${error.response.data?.message || error.response.statusText}`
      errorType = 'SERVER_ERROR'
    } else if (error.request) {
      // Error de conexión
      errorMessage = 'No se pudo conectar con la API. Verifica que esté ejecutándose en http://localhost:8000'
      errorType = 'CONNECTION_ERROR'
    } else {
      errorMessage = error.message || defaultMessage
      errorType = 'CLIENT_ERROR'
    }

    return {
      success: false,
      error: errorMessage,
      errorType,
      originalError: error
    }
  }
}

// Exporto una instancia para usar en toda la app
export const orderService = new OrderService()
export default OrderService 