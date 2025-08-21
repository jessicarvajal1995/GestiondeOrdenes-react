import { useState } from 'react'
import { useBreakpoint } from '../hooks/useWindowSize'

/**
 * Componente del formulario para crear órdenes
 * Lo separé del componente principal para que sea más limpio y reutilizable
 */
const OrderForm = ({ 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  initialData = {
    client_name: '',
    items: [{ description: '', quantity: 1, unit_price: 0 }]
  }
}) => {
  const [orderData, setOrderData] = useState(initialData)
  const { isDesktop } = useBreakpoint()

  const addItem = () => {
    setOrderData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unit_price: 0 }]
    }))
  }

  const removeItem = (index) => {
    setOrderData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const updateItem = (index, field, value) => {
    setOrderData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const handleSubmit = () => {
    // Validación básica antes de enviar
    if (!orderData.client_name.trim()) {
      alert('Por favor ingresa el nombre del cliente')
      return
    }

    const validItems = orderData.items.filter(item => 
      item.description.trim() && item.quantity > 0 && item.unit_price > 0
    )

    if (validItems.length === 0) {
      alert('Por favor agrega al menos un item válido')
      return
    }

    // Preparar datos para enviar al backend
    const submitData = {
      client_name: orderData.client_name,
      items: validItems.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: parseFloat(item.unit_price)
      }))
    }

    onSubmit(submitData)
  }

  const calculateTotal = () => {
    return orderData.items.reduce((sum, item) => 
      sum + (item.quantity * parseFloat(item.unit_price || 0)), 0
    ).toFixed(2)
  }

  const formStyles = {
    backgroundColor: '#f9fafb',
    padding: isDesktop ? '32px' : '20px',
    borderRadius: '12px',
    marginBottom: '32px',
    border: '1px solid #e5e7eb',
    position: 'relative',
    zIndex: 0
  }

  return (
    <div style={formStyles}>
      <h3 style={{ 
        margin: '0 0 24px 0',
        fontSize: isDesktop ? '1.5rem' : '1.25rem',
        color: '#1f2937'
      }}>
        Crear Nueva Orden
      </h3>
      
      {/* En escritorio uso grid de 2 columnas para mejor aprovechamiento */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isDesktop ? '1fr 2fr' : '1fr',
        gap: isDesktop ? '32px' : '20px'
      }}>
        {/* Información del cliente */}
        <div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#374151'
            }}>
              Nombre del Cliente:
            </label>
            <input
              type="text"
              value={orderData.client_name}
              onChange={(e) => setOrderData(prev => ({ ...prev, client_name: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="Ingresa el nombre del cliente"
              disabled={isSubmitting}
            />
          </div>

          {/* Panel de resumen solo en escritorio */}
          {isDesktop && (
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{ 
                margin: '0 0 12px 0',
                color: '#374151',
                fontSize: '16px'
              }}>
                Resumen de la Orden
              </h4>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                <p style={{ margin: '8px 0' }}>
                  Items: {orderData.items.filter(item => item.description.trim()).length}
                </p>
                <p style={{ margin: '8px 0', fontWeight: 'bold', color: '#059669' }}>
                  Total: S/ {calculateTotal()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Lista de items de la orden */}
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '16px' 
          }}>
            <label style={{ 
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#374151'
            }}>
              Items de la Orden:
            </label>
            <button
              onClick={addItem}
              disabled={isSubmitting}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                opacity: isSubmitting ? 0.5 : 1
              }}
            >
              + Agregar Item
            </button>
          </div>

          <div style={{ 
            maxHeight: isDesktop ? '400px' : 'none',
            overflowY: isDesktop ? 'auto' : 'visible',
            paddingRight: isDesktop ? '8px' : '0'
          }}>
            {orderData.items.map((item, index) => (
              <div key={index} style={{
                display: 'grid',
                gridTemplateColumns: isDesktop ? '2fr 80px 100px 40px' : '1fr',
                gap: '10px',
                marginBottom: '12px',
                padding: '16px',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}>
                <input
                  type="text"
                  placeholder="Descripción del plato"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  disabled={isSubmitting}
                  style={{
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                />
                <input
                  type="number"
                  placeholder="Cant."
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                  disabled={isSubmitting}
                  style={{
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  min="1"
                />
                <input
                  type="text"
                  placeholder="Precio"
                  value={item.unit_price}
                  onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                  disabled={isSubmitting}
                  style={{
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  step="0.01"
                  min="0"
                />
                {orderData.items.length > 1 && (
                  <button
                    onClick={() => removeItem(index)}
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '6px',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      width: '100%',
                      opacity: isSubmitting ? 0.5 : 1
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        justifyContent: 'flex-end',
        marginTop: '24px',
        flexDirection: isDesktop ? 'row' : 'column'
      }}>
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          style={{
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            opacity: isSubmitting ? 0.5 : 1
          }}
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            opacity: isSubmitting ? 0.5 : 1
          }}
        >
          {isSubmitting ? 'Creando...' : 'Crear Orden'}
        </button>
      </div>
    </div>
  )
}

export default OrderForm 