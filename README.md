# 💅 Mily Nail's — sitio web + Club Mily

Página web del nail studio **Mily Nail's** con galería de trabajos reales, videos de TikTok,
agenda por WhatsApp, mapa, redes sociales y un **programa de recompensas** con panel para Mily.

Hecho con **Next.js 15** + **Supabase** (base de datos gratuita), listo para **Vercel**.

---

## ✨ Qué incluye

| Sección | Detalle |
|---|---|
| Inicio | Logo, frase principal y botones de cita |
| Servicios | Tarjetas con precio "desde" (edítalas en `lib/config.ts`) |
| Trabajos reales | Galería con visor ampliado + videos de TikTok |
| Club Mily | Escalera de 10 visitas y consulta de sellos por número de WhatsApp |
| Cotiza | Calculadora de precios real; la clienta envía su cotización por WhatsApp (precios en `lib/precios.ts`) |
| Agenda | Formulario que abre WhatsApp con el mensaje listo |
| Ubicación | Mapa de Google + horario |
| Pie | Facebook, Instagram, TikTok y WhatsApp |
| `/panel` | Panel privado para que Mily registre clientas y visitas |
| `/privacidad` | Aviso de privacidad (plantilla, revisar antes de publicar) |

El fondo cambia de "escena" (esmaltes, uñas, gemas, coronas, flores) según la sección visible.

## 👑 Programa de recompensas

| Visita | Descuento | Nivel |
|---|---|---|
| 3 | 5 % | Brillo |
| 5 | 10 % | Gelish |
| 7 | 15 % | Glam |
| 10 | 30 % | Reina Mily |

Con un ticket promedio de ~$400 el costo real es **6 % de lo vendido** (rango sano: 5–10 %).
Después de la visita 10 el ciclo vuelve a empezar. Cambia la escala en `lib/rewards.ts`.

---

## 🚀 Puesta en marcha (paso a paso)

### 1. Base de datos (Supabase, gratis)
1. Crea una cuenta en <https://supabase.com> → **New project**.
2. Ve a **SQL Editor → New query**, pega el contenido de `supabase/schema.sql` y presiona **Run**.
3. En **Project Settings → API** copia:
   - `Project URL` → será `SUPABASE_URL`
   - `service_role` key → será `SUPABASE_SERVICE_ROLE_KEY` (¡secreta!)

### 2. Probar en tu computadora
```bash
npm install
cp .env.example .env.local   # y llena los valores
npm run dev                  # abre http://localhost:3000
```

### 3. Subir a GitHub
```bash
git init
git add .
git commit -m "Sitio Mily Nail's"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/mily-nails.git
git push -u origin main
```

### 4. Desplegar en Vercel
1. En <https://vercel.com> → **Add New → Project** → importa el repo `mily-nails`.
2. En **Environment Variables** agrega: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
   `ADMIN_PASSWORD` (mínimo 10 caracteres) y `ADMIN_SECRET` (mínimo 32 caracteres, genéralo con
   `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`).
   Si faltan o son muy cortas, el panel no abre (a propósito).
3. **Deploy**. Cada `git push` vuelve a publicar automáticamente.

---

## ✏️ Cómo editar el contenido

Todo está en **`lib/config.ts`**:
- `negocio.horario`, `negocio.direccion`, número de WhatsApp
- `negocio.mapsEmbed` → en Google Maps: **Compartir → Insertar un mapa → copiar** y pega solo el valor de `src="..."`
- `videosTikTok` → pega los links de tus videos (`https://www.tiktok.com/@mily_nails50/video/123…`)
- `servicios` y `trabajos` (fotos en `public/trabajos/`)

Los precios del cotizador están en **`lib/precios.ts`**.

## 🔒 Seguridad
Lee **`SEGURIDAD.md`** para ver qué protecciones tiene el sitio y la lista de mantenimiento.

## 🔐 Uso del panel
Entra a `tu-sitio.vercel.app/panel` con `ADMIN_PASSWORD`.
1. Registra a la clienta nueva (nombre + WhatsApp).
2. En cada cita presiona **"Registrar visita de hoy"** → el panel te dice si aplica descuento.
3. Si te equivocas, usa **"Deshacer última"**.
