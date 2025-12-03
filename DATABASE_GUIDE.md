# 🚀 Guía Completa: Conectar a Base de Datos

## 📋 Resumen de lo que se ha creado

Tu aplicación ahora tiene:

✅ **Frontend (React)** - Ya corriendo en `http://localhost:3000`  
✅ **Backend (Node.js + Express)** - Servidor API listo  
✅ **Base de Datos (MongoDB)** - Configurado y listo para usar  

---

## 🏗️ Arquitectura de la Aplicación

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│   FRONTEND      │◄───────►│    BACKEND      │◄───────►│    MONGODB      │
│   React App     │  HTTP   │   Express API   │  DB     │   Database      │
│   :3000         │         │   :5000         │         │   :27017/Atlas  │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

### Flujo de Datos:

1. **Usuario** ingresa credenciales en el frontend
2. **Frontend** envía petición HTTP al backend (API)
3. **Backend** valida datos y comunica con MongoDB
4. **MongoDB** guarda/recupera información
5. **Backend** responde al frontend con el resultado
6. **Frontend** muestra la información al usuario

---

## 🛠️ Paso 1: Configurar MongoDB

**ELIGE UNA OPCIÓN:**

### Opción A: MongoDB Atlas (Cloud) - ⭐ RECOMENDADO

1. Ve a https://www.mongodb.com/cloud/atlas/register
2. Crea una cuenta gratuita
3. Crea un cluster gratuito
4. Obtén tu cadena de conexión
5. Actualiza `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/mobile-app
   ```

**[Ver guía detallada en MONGODB_SETUP.md](MONGODB_SETUP.md)**

### Opción B: MongoDB Local

1. Descarga de https://www.mongodb.com/try/download/community
2. Instala MongoDB Community Edition
3. Inicia el servicio: `net start MongoDB`
4. El archivo `.env` ya está configurado para local

**[Ver guía detallada en MONGODB_SETUP.md](MONGODB_SETUP.md)**

---

## 🚀 Paso 2: Iniciar el Backend

Abre una **nueva terminal** (sin cerrar la del frontend):

```bash
# Navegar a la carpeta backend
cd backend

# Iniciar servidor en modo desarrollo
npm run dev
```

**Deberías ver:**
```
✅ MongoDB conectado: ...
🚀 Servidor corriendo en puerto 5000
📍 URL: http://localhost:5000
```

---

## 🎨 Paso 3: El Frontend Ya Está Actualizado

El frontend ya está configurado para conectarse al backend. Los cambios fueron:

- ✅ `AuthContext.jsx` actualizado para usar la API
- ✅ Llamadas HTTP reales en lugar de simulación
- ✅ Manejo de tokens JWT
- ✅ Persistencia de sesión

---

## 🧪 Paso 4: Probar la Aplicación

Con **ambos servidores corriendo**:

1. **Frontend:** `http://localhost:3000` (ya corriendo)
2. **Backend:** `http://localhost:5000` (recién iniciado)

### Prueba el Registro:

1. Ve a http://localhost:3000
2. Haz clic en "Regístrate"
3. Ingresa:
   - Nombre: Tu Nombre
   - Email: tu@email.com
   - Password: 123456
4. Haz clic en "Registrarse"

Si todo va bien:
- ✅ Serás redirigido al Dashboard
- ✅ El usuario se guardó en MongoDB
- ✅ Recibes un token JWT

### Prueba el Login:

1. Cierra sesión
2. Inicia sesión con las mismas credenciales
3. ✅ Deberías entrar al Dashboard

---

## 🔍 Verificar que Funciona

### Ver usuarios en MongoDB

**MongoDB Atlas:**
1. Ve a tu cluster en MongoDB Atlas
2. Click en "Browse Collections"
3. Verás la base de datos `mobile-app`
4. Colección `users` con tus usuarios

**MongoDB Compass (Local):**
1. Abre MongoDB Compass
2. Conecta a `mongodb://localhost:27017`
3. Navega a `mobile-app` → `users`
4. Verás los usuarios registrados

### Probar el Backend directamente

Abre otra terminal y prueba:

```bash
# Registrar usuario
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@test.com\",\"password\":\"123456\"}"

# Login
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@test.com\",\"password\":\"123456\"}"
```

---

## 📂 Estructura Final del Proyecto

```
mobile/
├── backend/                    # ← NUEVO: API Backend
│   ├── config/
│   │   └── db.js              # Conexión a MongoDB
│   ├── middleware/
│   │   └── auth.js            # Autenticación JWT
│   ├── models/
│   │   └── User.js            # Modelo de Usuario
│   ├── routes/
│   │   └── auth.js            # Rutas de autenticación
│   ├── .env                   # Variables de entorno
│   ├── server.js              # Servidor principal
│   ├── package.json
│   └── README.md
│
├── src/                       # Frontend React
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Login.css
│   │   ├── Dashboard.jsx
│   │   └── Dashboard.css
│   ├── context/
│   │   └── AuthContext.jsx    # ← ACTUALIZADO: Usa API real
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── MONGODB_SETUP.md           # ← NUEVO: Guía MongoDB
├── DATABASE_GUIDE.md          # ← Este archivo
└── README.md
```

---

## 🔒 Características de Seguridad Implementadas

✅ **Contraseñas encriptadas** con bcryptjs  
✅ **Tokens JWT** para autenticación  
✅ **Validación de datos** en backend  
✅ **Rutas protegidas** con middleware  
✅ **Variables de entorno** para secretos  
✅ **CORS configurado** solo para frontend  

---

## 🐛 Solución de Problemas Comunes

### Error: "Failed to fetch"

**Causa:** Backend no está corriendo

**Solución:**
```bash
cd backend
npm run dev
```

### Error: "MongooseServerSelectionError"

**Causa:** No puede conectar a MongoDB

**Solución:**
- Verifica que MongoDB esté corriendo
- Revisa las credenciales en `.env`
- [Ver guía completa de MongoDB](MONGODB_SETUP.md)

### Error: "User already exists"

**Causa:** Email ya registrado

**Solución:**
- Usa otro email
- O borra el usuario desde MongoDB Compass

### Frontend no se conecta al Backend

**Verifica:**
1. ✅ Backend corriendo en puerto 5000
2. ✅ Frontend corriendo en puerto 3000
3. ✅ CORS configurado en `backend/server.js`

---

## 📱 Endpoints de la API

| Método | Endpoint | Descripción | Requiere Auth |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Registrar usuario | ❌ |
| POST | `/api/auth/login` | Iniciar sesión | ❌ |
| GET | `/api/auth/me` | Obtener usuario actual | ✅ |
| PUT | `/api/auth/update` | Actualizar perfil | ✅ |

---

## 🎯 Próximos Pasos Sugeridos

1. **Funcionalidades:**
   - [ ] Recuperación de contraseña
   - [ ] Verificación de email
   - [ ] Subida de avatar personalizado
   - [ ] Roles de usuario

2. **Mejoras de Seguridad:**
   - [ ] Refresh tokens
   - [ ] Rate limiting
   - [ ] Verificación en dos pasos

3. **Despliegue:**
   - [ ] Desplegar frontend en Vercel/Netlify
   - [ ] Desplegar backend en Render/Railway
   - [ ] Usar MongoDB Atlas en producción

---

## 📚 Recursos Útiles

- [Documentación de Express](https://expressjs.com/)
- [Documentación de MongoDB](https://docs.mongodb.com/)
- [Documentación de Mongoose](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/) - Para debuggear tokens

---

## ✅ Checklist de Verificación

Asegúrate de que todo funcione:

- [ ] MongoDB está instalado/configurado (Atlas o Local)
- [ ] Backend instalado (`cd backend && npm install`)
- [ ] Variables de entorno configuradas (`.env`)
- [ ] Backend corriendo (`npm run dev` en backend/)
- [ ] Frontend corriendo (`npm run dev` en raíz)
- [ ] Puedes registrar un usuario
- [ ] Puedes iniciar sesión
- [ ] El usuario persiste en MongoDB
- [ ] El token se guarda en localStorage

---

## 🎉 ¡Felicidades!

Tu aplicación ahora tiene:
- ✅ Frontend moderno con React
- ✅ Backend robusto con Node.js/Express
- ✅ Base de datos MongoDB
- ✅ Autenticación completa con JWT
- ✅ Encriptación de contraseñas
- ✅ Persistencia de sesión

**¡Estás listo para seguir desarrollando!** 🚀
