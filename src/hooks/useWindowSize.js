import { useState, useEffect } from 'react'

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Agregar el listener para detectar cambios de tamaño
    window.addEventListener('resize', handleResize)

    // Llamar inmediatamente para obtener el tamaño actual
    handleResize()

    // Limpiar el listener cuando se desmonte
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

// Hook más específico para los breakpoints que uso en la app
export const useBreakpoint = () => {
  const { width } = useWindowSize()
  
  return {
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
    isLarge: width >= 1280,
    width
  }
} 