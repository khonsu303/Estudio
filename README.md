# Mobile Login App 🚀

Una aplicación React moderna con sistema de autenticación premium, construida con Vite y diseño glassmorphism.

## ✨ Características

- 🔐 **Sistema de Autenticación Completo**
  - Login de usuario
  - Registro de nuevos usuarios
  - Persistencia con localStorage
  - Rutas protegidas

- 🎨 **Diseño Premium**
  - Efectos glassmorphism
  - Gradientes animados
  - Micro-animaciones
  - Tema oscuro moderno
  - Totalmente responsive

- ⚡ **Tecnologías Modernas**
  - React 18
  - Vite
  - React Router DOM
  - CSS moderno con variables

## 📁 Estructura del Proyecto

```
mobile/
├── public/
├── src/
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Login.css
│   │   ├── Dashboard.jsx
│   │   └── Dashboard.css
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos para ejecutar

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador**
   - La aplicación se abrirá automáticamente en `http://localhost:3000`

4. **Construir para producción**
   ```bash
   npm run build
   ```

5. **Previsualizar build de producción**
   ```bash
   npm run preview
   ```

## 🔑 Uso del Sistema de Login

### Credenciales de Prueba
Puedes usar cualquier correo electrónico y una contraseña de al menos 6 caracteres:

- Email: `test@ejemplo.com`
- Password: `123456` (o cualquier contraseña de 6+ caracteres)

### Características del Login
- **Validación de formularios** en tiempo real
- **Mensajes de error** claros y descriptivos
- **Estado de carga** durante el proceso de autenticación
- **Modo dual**: Alternar entre Login y Registro
- **Botones de redes sociales** (UI preparada para integración futura)

## 🎨 Personalización

### Colores
Los colores principales se definen en `src/index.css`:

```css
:root {
  --color-primary: hsl(250, 84%, 54%);
  --color-secondary: hsl(280, 70%, 60%);
  --color-accent: hsl(320, 85%, 65%);
  /* ... más colores */
}
```

### Componentes
Todos los componentes están en `src/components/` y tienen sus propios archivos CSS para facilitar la personalización.

## 🔧 Configuración

### Vite Config
El proyecto usa Vite con configuración optimizada en `vite.config.js`:
- Puerto por defecto: 3000
- Apertura automática del navegador
- Hot Module Replacement (HMR)

## 📱 Responsive Design

La aplicación es totalmente responsive y se adapta a:
- 📱 Móviles (< 640px)
- 📱 Tablets (640px - 1024px)
- 💻 Desktop (> 1024px)

## 🔐 Seguridad

**Nota importante**: Esta es una implementación de demostración. Para producción:

- Implementa autenticación real con un backend
- Usa HTTPS
- Implementa tokens JWT
- Agrega validación del lado del servidor
- Implementa rate limiting
- Usa hash seguro para contraseñas (bcrypt)

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

Desarrollado con ❤️ por tu equipo de desarrollo

## 🐛 Reportar Problemas

Si encuentras algún bug o tienes alguna sugerencia, por favor abre un issue en el repositorio.

---

**¡Disfruta construyendo tu aplicación!** 🎉
