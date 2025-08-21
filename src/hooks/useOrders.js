import { useState, useCallback } from 'react'
import { orderService } from '../services/orderService'
import { notificationService } from '../services/notificationService'

/**
 * Hook personalizado para manejar todo el estado de las órdenes
 * Lo separé del componente para que sea más fácil de testear y reutilizar
 */
export const useOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Cargar órdenes desde el backend
   */
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await orderService.getOrders()
      
      if (result.success) {
        setOrders(result.data)
      } else {
        setError(result.error)
        notificationService.error(result.error)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Crear una nueva orden
   */
  const createOrder = useCallback(async (orderData) => {
    const result = await orderService.createOrder(orderData)
    
    if (result.success) {
      notificationService.success(result.message || 'Orden creada exitosamente')
      await fetchOrders() // Recargar la lista para mostrar la nueva orden
      return { success: true, data: result.data }
    } else {
      notificationService.error(result.error)
      return { success: false, error: result.error }
    }
  }, [fetchOrders])

  /**
   * Avanzar el estado de una orden
   */
  const advanceOrder = useCallback(async (orderId) => {
    const result = await orderService.advanceOrder(orderId)
    
    if (result.success) {
      notificationService.success(result.message || 'Estado actualizado correctamente')
      await fetchOrders() // Recargar para mostrar el nuevo estado
      return { success: true }
    } else {
      notificationService.error(result.error)
      return { success: false, error: result.error }
    }
  }, [fetchOrders])

  return {
    // Estado que expongo
    orders,
    loading,
    error,
    
    // Acciones que pueden usar los componentes
    fetchOrders,
    createOrder,
    advanceOrder,
    
    // Alias por conveniencia
    refreshOrders: fetchOrders
  }
}

export default useOrders 