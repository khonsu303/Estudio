# Backend API para Mobile Login App

API RESTful construida con Node.js, Express y MongoDB para gestión de autenticación.

## 🚀 Características

- ✅ Registro de usuarios
- ✅ Login con JWT
- ✅ Protección de rutas
- ✅ Encriptación de contraseñas con bcryptjs
- ✅ Validación de datos
- ✅ Manejo de errores

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- MongoDB (local o MongoDB Atlas)
- npm o yarn

## 🔧 Instalación

### 1. Instalar Dependencias

```bash
cd backend
npm install
```

### 2. Configurar MongoDB

**Opción A: MongoDB Local**

1. Instalar MongoDB Community Edition:
   - Windows: https://www.mongodb.com/try/download/community
   - Mac: `brew install mongodb-community`
   - Linux: Seguir la guía oficial

2. Iniciar MongoDB:
   ```bash
   # Windows (como servicio)
   net start MongoDB
   
   # Mac/Linux
   mongod
   ```

**Opción B: MongoDB Atlas (Cloud) - Recomendado**

1. Crear cuenta gratuita en https://www.mongodb.com/cloud/atlas
2. Crear un cluster gratuito
3. Crear un usuario de base de datos
4. Obtener la cadena de conexión
5. Actualizar `.env` con tu cadena de conexión

### 3. Configurar Variables de Entorno

Edita el archivo `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mobile-app
# O usa MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/mobile-app
JWT_SECRET=cambia_esto_por_una_clave_muy_segura
JWT_EXPIRE=7d
NODE_ENV=development
```

### 4. Iniciar el Servidor

```bash
# Modo desarrollo (con nodemon - auto-reload)
npm run dev

# Modo producción
npm start
```

El servidor estará corriendo en `http://localhost:5000`

## 📡 Endpoints de la API

### Autenticación

#### Registro de Usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "123456"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "648f4d5e9c1a2b3c4d5e6f7g",
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "avatar": "https://ui-avatars.com/api/..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@ejemplo.com",
  "password": "123456"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "648f4d5e9c1a2b3c4d5e6f7g",
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "avatar": "https://ui-avatars.com/api/..."
  }
}
```

#### Obtener Usuario Actual
```http
GET /api/auth/me
Authorization: Bearer {token}
```

**Respuesta:**
```json
{
  "success": true,
  "user": {
    "id": "648f4d5e9c1a2b3c4d5e6f7g",
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "avatar": "https://ui-avatars.com/api/..."
  }
}
```

#### Actualizar Perfil
```http
PUT /api/auth/update
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Juan Carlos Pérez",
  "email": "juancarlos@ejemplo.com"
}
```

## 🔒 Seguridad

- **Contraseñas**: Encriptadas con bcryptjs (10 salt rounds)
- **JWT**: Tokens firmados con secreto configurable
- **Validación**: Express-validator para validar entradas
- **CORS**: Configurado para aceptar solo desde el frontend
- **Variables sensibles**: Guardadas en archivo `.env`

## 🗄️ Modelo de Datos

### Usuario (User)

```javascript
{
  name: String,        // Requerido, max 50 caracteres
  email: String,       // Requerido, único, validado
  password: String,    // Requerido, min 6 caracteres, encriptado
  avatar: String,      // URL generada automáticamente
  createdAt: Date,     // Timestamp de creación
  updatedAt: Date      // Timestamp de actualización
}
```

## 🧪 Probar la API

### Con curl

```bash
# Registro
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

### Con Postman o Thunder Client

1. Importar la colección de endpoints
2. Crear las requests según los ejemplos anteriores
3. Guardar el token recibido
4. Usar el token en el header `Authorization: Bearer {token}`

## 📁 Estructura del Proyecto

```
backend/
├── config/
│   └── db.js              # Configuración de MongoDB
├── middleware/
│   └── auth.js            # Middleware de autenticación
├── models/
│   └── User.js            # Modelo de Usuario
├── routes/
│   └── auth.js            # Rutas de autenticación
├── .env                   # Variables de entorno
├── .env.example           # Ejemplo de variables
├── .gitignore            # Archivos ignorados por git
├── package.json          # Dependencias
├── server.js             # Servidor principal
└── README.md             # Este archivo
```

## 🐛 Solución de Problemas

### MongoDB no se conecta

**Error:** `MongooseServerSelectionError`

**Solución:**
- Verificar que MongoDB esté corriendo
- Verificar la cadena de conexión en `.env`
- Para MongoDB Atlas, verificar IP whitelist

### Puerto ya en uso

**Error:** `EADDRINUSE`

**Solución:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID {PID} /F

# Mac/Linux
lsof -i :5000
kill -9 {PID}
```

## 📝 Notas de Producción

Antes de desplegar en producción:

1. ✅ Cambiar `JWT_SECRET` por una clave muy segura
2. ✅ Usar MongoDB Atlas en lugar de local
3. ✅ Configurar HTTPS
4. ✅ Implementar rate limiting
5. ✅ Agregar logging apropiado
6. ✅ Configurar CORS para dominio específico
7. ✅ Implementar refresh tokens
8. ✅ Agregar verificación de email

## 📄 Licencia

MIT

---

**¡El backend está listo para usar!** 🎉
