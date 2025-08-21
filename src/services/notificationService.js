/**
 * Sistema de notificaciones que hice para poder cambiar fácilmente
 * entre alert, console, toast, etc. sin tocar el código principal
 */

// Tipos de notificación que manejo
export const NotificationTypes = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

// Clase base para todos los providers de notificación
class NotificationProvider {
  show() {
    throw new Error('show() method must be implemented')
  }
}

// Por ahora uso alert, pero es fácil de cambiar
class AlertNotificationProvider extends NotificationProvider {
  show(message, type) {
    const prefix = type === NotificationTypes.ERROR ? 'Error: ' : ''
    alert(`${prefix}${message}`)
  }
}

// Para desarrollo, me gusta ver los logs en consola
class ConsoleNotificationProvider extends NotificationProvider {
  show(message, type) {
    const method = type === NotificationTypes.ERROR ? 'error' : 'log'
    console[method](`[${type.toUpperCase()}] ${message}`)
  }
}

// Preparado para cuando implemente toast notifications
class ToastNotificationProvider extends NotificationProvider {
  show(message, type) {
    // TODO: Implementar toast notifications cuando tenga tiempo
    console.log(`Toast: [${type}] ${message}`)
  }
}

/**
 * Servicio principal que maneja todas las notificaciones
 * Puedo agregar múltiples providers si quiero
 */
class NotificationService {
  constructor() {
    this.providers = []
    // Por defecto uso alert, pero puedo cambiar fácilmente
    this.addProvider(new AlertNotificationProvider())
  }

  /**
   * Agregar un nuevo provider de notificación
   * Así puedo extender sin romper nada
   */
  addProvider(provider) {
    if (!(provider instanceof NotificationProvider)) {
      throw new Error('Provider must extend NotificationProvider')
    }
    this.providers.push(provider)
  }

  /**
   * Remover un provider si ya no lo necesito
   */
  removeProvider(providerClass) {
    this.providers = this.providers.filter(
      provider => !(provider instanceof providerClass)
    )
  }

  /**
   * Mostrar notificación usando todos los providers activos
   */
  show(message, type = NotificationTypes.INFO) {
    if (!message) return
    
    this.providers.forEach(provider => {
      try {
        provider.show(message, type)
      } catch (error) {
        console.error('Error in notification provider:', error)
      }
    })
  }

  // Métodos de conveniencia para no tener que recordar los tipos
  success(message) {
    this.show(message, NotificationTypes.SUCCESS)
  }

  error(message) {
    this.show(message, NotificationTypes.ERROR)
  }

  warning(message) {
    this.show(message, NotificationTypes.WARNING)
  }

  info(message) {
    this.show(message, NotificationTypes.INFO)
  }
}

// Instancia global que uso en toda la app
export const notificationService = new NotificationService()

// Exporto las clases por si necesito crear providers personalizados
export { 
  NotificationProvider, 
  AlertNotificationProvider, 
  ConsoleNotificationProvider, 
  ToastNotificationProvider 
}

export default NotificationService 