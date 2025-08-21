// Configuración general de la aplicación
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  API_TIMEOUT: 10000, // 10 segundos - suficiente para la mayoría de requests
}

// Función para validar que todo esté configurado correctamente
export const validateConfig = () => {
  if (!config.API_BASE_URL) {
    throw new Error('API_BASE_URL no está configurada')
  }
  console.log('Configuración cargada:', config)
}

export default config 