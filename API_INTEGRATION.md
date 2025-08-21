# Integración con API - Sistema de Gestión de Órdenes

## 🚀 Configuración

**Repositorio Backend:** https://github.com/jessicarvajal1995/challenge-laravel-2025-jessika-carvajal

### Prerrequisitos
1. **Backend API ejecutándose en:** `http://localhost:8000`
2. **Frontend React ejecutándose en:** `http://localhost:5173`

### Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto con:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## 📋 Endpoints Integrados

### ✅ Implementados

| Método | Endpoint | Descripción | Estado |
|--------|----------|-------------|---------|
| `GET` | `/orders` | Listar órdenes activas | ✅ Implementado |
| `POST` | `/orders` | Crear nueva orden | ✅ Implementado |
| `POST` | `/orders/{id}/advance` | Avanzar estado de orden | ✅ Implementado |

### 🔄 Funcionalidades

#### 1. **Cargar Órdenes**
- Se ejecuta automáticamente al cargar la página
- Botón "Actualizar" para recargar manualmente
- Caché de 30s en el backend (usando Redis)
- Manejo de errores de conexión

#### 2. **Crear Orden**
- Validación de datos en frontend
- Envío de datos en formato JSON
- Recálculo automático de totales
- Feedback visual durante envío

#### 3. **Avanzar Estados**
- Flujo: `initiated` → `sent` → `delivered`
- Las órdenes `delivered` se eliminan automáticamente
- Actualización inmediata de la lista



## 🔧 Configuración Técnica

### Axios Configuration
```javascript
axios.defaults.timeout = 10000 // 10 segundos
```

### Estructura de Respuesta Esperada
```javascript
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": [...] // Array de órdenes u objeto de orden
}
```

### Formato de Orden
```javascript
{
  "id": 1,
  "client_name": "Nombre del Cliente",
  "status": "initiated|sent|delivered",
  "total_amount": "25.50",
  "created_at": "2025-08-17T00:14:12.000000Z",
  "updated_at": "2025-08-17T00:14:12.000000Z",
  "items": [
    {
      "id": 1,
      "description": "Descripción del item",
      "quantity": 1,
      "unit_price": "15.50"
    }
  ]
}
```

