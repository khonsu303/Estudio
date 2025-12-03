# 🚀 Guía de Despliegue (Subir a Internet)

Para que tu aplicación funcione en internet, necesitas subir dos partes:
1. **Backend (API):** A Render (Gratis).
2. **Frontend (Web):** A Netlify (Gratis).

---

## PASO 1: Subir el Backend a Render

1.  Sube tu código a **GitHub** (si no lo has hecho).
    *   Asegúrate de que la carpeta `backend` esté en tu repositorio.
2.  Crea una cuenta en [Render.com](https://render.com).
3.  Haz clic en **"New"** -> **"Web Service"**.
4.  Conecta tu repositorio de GitHub.
5.  Configura lo siguiente:
    *   **Root Directory:** `backend` (¡Importante!)
    *   **Build Command:** `npm install`
    *   **Start Command:** `node server.js`
6.  En la sección **"Environment Variables"** (Variables de Entorno), añade:
    *   `MONGODB_URI`: (Tu conexión de MongoDB Atlas)
    *   `JWT_SECRET`: (Cualquier palabra secreta larga)
    *   `NODE_ENV`: `production`
7.  Haz clic en **"Create Web Service"**.
8.  Espera a que termine. Render te dará una URL (ej: `https://mi-backend.onrender.com`). **Copia esa URL.**

---

## PASO 2: Subir el Frontend a Netlify

1.  Ve a [Netlify.com](https://www.netlify.com) y crea una cuenta.
2.  Haz clic en **"Add new site"** -> **"Import an existing project"**.
3.  Conecta tu GitHub.
4.  Configura lo siguiente:
    *   **Base directory:** (Déjalo vacío o pon `/` si te pide)
    *   **Build command:** `npm run build`
    *   **Publish directory:** `dist`
5.  Haz clic en **"Show advanced"** -> **"New Variable"**.
    *   **Key:** `VITE_API_URL`
    *   **Value:** (Pega la URL de Render que copiaste en el paso 1) + `/api`
        *   Ejemplo: `https://mi-backend.onrender.com/api`
6.  Haz clic en **"Deploy site"**.

---

## ¡Listo! 🎉

Netlify te dará una URL (ej: `https://mi-estudio-app.netlify.app`). ¡Esa es tu página web funcionando en internet!

**Nota:** El backend en Render (versión gratuita) se "duerme" si nadie lo usa. La primera vez que entres puede tardar unos 30 segundos en cargar. ¡Es normal!
