import { useState, useEffect } from 'react'
import { useBreakpoint } from './hooks/useWindowSize'
import { useOrders } from './hooks/useOrders'
import OrderForm from './components/OrderForm'

/**
 * Componente principal que maneja toda la gestión de órdenes
 * Refactoricé esto para que sea más limpio y fácil de mantener
 */
export default function OrdersManager() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  // Hooks que me ayudan a manejar el estado y la responsividad
  const { isDesktop, width } = useBreakpoint()
  const { 
    orders, 
    loading, 
    error, 
    fetchOrders, 
    createOrder, 
    advanceOrder 
  } = useOrders()

  // Cargar órdenes cuando se monta el componente
  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Manejadores de eventos del formulario
  const handleCreateOrder = async (orderData) => {
    setSubmitting(true)
    const result = await createOrder(orderData)
    
    if (result.success) {
      setShowCreateForm(false)
    }
    
    setSubmitting(false)
  }

  const handleCancelForm = () => {
    setShowCreateForm(false)
  }

  const handleAdvanceOrder = async (orderId) => {
    await advanceOrder(orderId)
  }

  // Funciones para mostrar los estados de las órdenes
  const getStatusText = (status) => {
    switch (status) {
      case 'initiated': return 'Iniciada'
      case 'sent': return 'Enviada'
      case 'delivered': return 'Entregada'
      default: return status
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'initiated': return '#f59e0b'
      case 'sent': return '#3b82f6'
      case 'delivered': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getNextStatusText = (status) => {
    switch (status) {
      case 'initiated': return 'Marcar como Enviada'
      case 'sent': return 'Marcar como Entregada'
      default: return 'Completada'
    }
  }

  // Estilos que se adaptan según el tamaño de pantalla
  const containerStyles = {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1400px',
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch'
  }

  const headerStyles = {
    display: 'flex',
    flexDirection: isDesktop ? 'row' : 'column',
    justifyContent: isDesktop ? 'space-between' : 'center',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '32px',
    width: '100%',
    textAlign: isDesktop ? 'left' : 'center',
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'transparent'
  }

  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: (() => {
      if (width >= 1280) return 'repeat(4, 1fr)'
      if (width >= 1024) return 'repeat(3, 1fr)'
      if (width >= 640) return 'repeat(2, 1fr)'
      return '1fr'
    })(),
    gap: '20px',
    width: '100%',
    justifyItems: width < 640 ? 'center' : 'stretch'
  }

  // Pantalla de carga mientras obtengo las órdenes
  if (loading) {
    return (
      <div style={containerStyles}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>
            Cargando órdenes...
          </p>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    )
  }

  // Pantalla de error si no puedo conectar con la API
  if (error) {
    return (
      <div style={containerStyles}>
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '20px',
          margin: '20px 0',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#dc2626', margin: '0 0 10px 0' }}>
            Error de Conexión
          </h3>
          <p style={{ color: '#7f1d1d', marginBottom: '20px' }}>
            {error}
          </p>
          <button
            onClick={fetchOrders}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyles}>
      {/* Header con título y botones */}
      <div style={headerStyles}>
        <div>
          <h1 style={{ 
            margin: 0, 
            color: '#1f2937', 
            fontSize: isDesktop ? '2.5rem' : '2rem',
            fontWeight: 'bold'
          }}>
            Gestión de Órdenes
          </h1>
          <p style={{ 
            margin: '8px 0 0 0', 
            color: '#6b7280',
            fontSize: isDesktop ? '1.125rem' : '1rem'
          }}>
            Sistema de gestión para restaurante
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={fetchOrders}
            disabled={loading}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              padding: isDesktop ? '12px 20px' : '10px 16px',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: isDesktop ? '14px' : '12px',
              fontWeight: '600',
              opacity: loading ? 0.5 : 1
            }}
          >
            🔄 Actualizar
          </button>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: isDesktop ? '12px 24px' : '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: isDesktop ? '16px' : '14px',
              fontWeight: '600',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              minWidth: isDesktop ? '200px' : 'auto'
            }}
          >
            {showCreateForm ? 'Cancelar' : '+ Nueva Orden'}
          </button>
        </div>
      </div>

      {/* Formulario para crear órdenes */}
      {showCreateForm && (
        <OrderForm
          onSubmit={handleCreateOrder}
          onCancel={handleCancelForm}
          isSubmitting={submitting}
        />
      )}

      {/* Grid con todas las órdenes */}
      <div style={gridStyles}>
        {orders.map((order) => (
          <div key={order.id} style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'start', 
              marginBottom: '20px' 
            }}>
              <div>
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  color: '#1f2937',
                  fontSize: '1.25rem',
                  fontWeight: 'bold'
                }}>
                  Orden #{order.id}
                </h3>
                <p style={{ 
                  margin: 0, 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '1rem'
                }}>
                  {order.client_name}
                </p>
              </div>
              <span style={{
                backgroundColor: getStatusColor(order.status),
                color: 'white',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {getStatusText(order.status)}
              </span>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '12px',
                alignItems: 'center'
              }}>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>Total:</span>
                <span style={{ 
                  fontWeight: 'bold', 
                  color: '#059669', 
                  fontSize: '1.5rem'
                }}>
                  S/ {order.total_amount}
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '8px' 
              }}>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>Items:</span>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                  {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>Creada:</span>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>
                  {new Date(order.created_at).toLocaleString('es-PE')}
                </span>
              </div>
            </div>

            <div style={{ 
              borderTop: '1px solid #e5e7eb', 
              paddingTop: '20px',
              marginBottom: '20px'
            }}>
              <h4 style={{ 
                margin: '0 0 12px 0', 
                fontSize: '14px', 
                color: '#374151',
                fontWeight: '600'
              }}>
                Items:
              </h4>
              <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                {order.items.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    marginBottom: '6px',
                    color: '#6b7280',
                    padding: '4px 0'
                  }}>
                    <span style={{ fontWeight: '500' }}>
                      {item.description} x{item.quantity}
                    </span>
                    <span style={{ fontWeight: '600', color: '#374151' }}>
                      S/ {(item.quantity * parseFloat(item.unit_price)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {order.status !== 'delivered' && (
              <button
                onClick={() => handleAdvanceOrder(order.id)}
                style={{
                  width: '100%',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
              >
                {getNextStatusText(order.status)}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Mensaje cuando no hay órdenes */}
      {orders.length === 0 && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          color: '#6b7280'
        }}>
          <div style={{
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              marginBottom: '12px',
              color: '#374151'
            }}>
              No hay órdenes activas
            </h3>
            <p style={{ fontSize: '1rem', marginBottom: '32px' }}>
              Crea una nueva orden para comenzar a gestionar los pedidos
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              + Crear Primera Orden
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 