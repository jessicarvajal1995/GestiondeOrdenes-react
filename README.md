# 🍽️ Sistema de Gestión de Órdenes - Frontend

Sistema web responsivo que hice para gestionar órdenes de restaurante usando **React + Vite** siguiendo principios **SOLID**.

## 📋 **Lo que incluye**

- ✅ **Gestión completa de órdenes** (crear, visualizar, avanzar estados)
- ✅ **Diseño responsivo** (funciona en móvil, tablet y escritorio)
- ✅ **Integración con API REST** (conecta con backend Laravel)
- ✅ **Arquitectura SOLID** (fácil de mantener y escalar)
- ✅ **Estados en tiempo real** (iniciada → enviada → entregada)
- ✅ **Validación de formularios** y manejo de errores
- ✅ **Interfaz moderna** hecha con CSS puro

---

## 🚀 **Cómo instalarlo y configurarlo**

### **Lo que necesitas tener instalado**

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (también funciona con yarn/pnpm)
- **Backend API** corriendo en `http://localhost:8000`

### **1. Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd gestionOrdenes
```

### **2. Instalar las dependencias**

```bash
npm install
```

### **3. Configurar variables de entorno (opcional)**

Si quieres cambiar la URL de la API, crea un archivo `.env` en la raíz:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

> **Nota:** Si no configuras esto, usará `http://localhost:8000/api` por defecto.

---

## 🏃‍♂️ **Cómo ejecutar el proyecto**

### **Para desarrollo**

```bash
npm run dev
```

La aplicación estará disponible en:
- **Local:** `http://localhost:5173` (o el puerto que esté libre)
- **Red:** Usa `--host` si quieres que otros accedan desde la red

### **Para producción**

```bash
# Construir para producción
npm run build

# Ver cómo queda la build
npm run preview
```

### **Para verificar el código**

```bash
# Revisar errores de código
npm run lint

# Arreglar errores automáticamente
npm run lint --fix
```

---

## 🔧 **Configuración del Backend**

### **Lo que espera el frontend**

El frontend necesita que la API esté corriendo en `http://localhost:8000` con estos endpoints:

| Método | Endpoint | Para qué sirve |
|--------|----------|-------------|
| `GET` | `/api/orders` | Traer todas las órdenes activas |
| `POST` | `/api/orders` | Crear una nueva orden |
| `POST` | `/api/orders/{id}/advance` | Avanzar el estado de una orden |

### **Formato de respuesta que espero**

```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": [...] // Array de órdenes u objeto de orden
}
```

### **Configuración de CORS**

Asegúrate de que el backend permita requests desde el frontend:

```php
// En Laravel: config/cors.php
'allowed_origins' => ['http://localhost:5173', 'http://localhost:5174', /* otros puertos */],
```

---

## 📱 **Cómo usar la aplicación**

### **1. Crear una nueva orden**
1. Hacer clic en **"+ Nueva Orden"**
2. Escribir el **nombre del cliente**
3. Agregar **items** con descripción, cantidad y precio
4. Hacer clic en **"Crear Orden"**

### **2. Manejar los estados**
- **Iniciada** → Clic en **"Marcar como Enviada"**
- **Enviada** → Clic en **"Marcar como Entregada"**
- **Entregada** → Se elimina automáticamente

### **3. Actualizar la lista**
- Usar el botón **"🔄 Actualizar"** para recargar las órdenes

---

## 🏗️ **Cómo organicé el proyecto**

### **Estructura de carpetas**

```
src/
├── components/          # Componentes que reutilizo
│   └── OrderForm.jsx   # Formulario para crear órdenes
├── hooks/              # Hooks personalizados que hice
│   ├── useOrders.js    # Maneja todo el estado de órdenes
│   └── useWindowSize.js # Detecta el tamaño de pantalla
├── services/           # Servicios para separar la lógica
│   ├── orderService.js # Todo lo relacionado con la API
│   └── notificationService.js # Sistema de notificaciones
├── config.js           # Configuración general
├── App.jsx            # Componente principal
└── OrdersManager.jsx  # El componente que maneja todo
```



### **Comandos útiles para debugging**

```bash
# Ver logs más detallados
npm run dev -- --debug

# Limpiar cache de Vite
rm -rf node_modules/.vite

# Reinstalar todo desde cero
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 **Documentación adicional**

- 📖 [Cómo integré la API](./API_INTEGRATION.md) y repositorio backend: https://github.com/jessicarvajal1995/challenge-laravel-2025-jessika-carvajal
- 🏗️ [Principios SOLID que apliqué](./SOLID_PRINCIPLES.md)
- 🎨 [Estilos que uso](./src/App.css)



