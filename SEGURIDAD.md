# 🔒 Seguridad de Mily Nail's

## Protecciones activas
| Riesgo | Protección |
|---|---|
| Robo de la contraseña del panel probando muchas | Máx. 5 intentos fallidos cada 15 min por conexión |
| Sesión robada o falsificada | Cookie firmada con vencimiento (7 días), `HttpOnly`, `Secure`, `SameSite=Strict`, prefijo `__Host-` |
| Configuración débil | Si `ADMIN_PASSWORD` (<10) o `ADMIN_SECRET` (<32) son débiles o faltan, el panel no abre |
| Averiguar quién es clienta probando teléfonos | La consulta pública no devuelve nombre ni teléfono; máx. 10 consultas cada 15 min |
| Otro sitio haciendo acciones en nombre de Mily (CSRF) | Verificación de origen + `SameSite=Strict` |
| Datos basura o gigantes | Validación y límite de tamaño en servidor y en la base de datos |
| Doble registro de una visita | Restricción única `(clienta_id, numero)` en la base de datos |
| Acceso directo a la base de datos | RLS activado sin políticas + permisos revocados a roles públicos; la llave secreta solo vive en el servidor (`server-only`) |
| Filtración de detalles internos | Mensajes de error genéricos; los detalles solo van al log de Vercel |
| Página metida dentro de otra / scripts externos | Cabeceras CSP, `X-Frame-Options`, HSTS, `nosniff`, `Referrer-Policy`, `Permissions-Policy` |
| Videos de TikTok | Solo se aceptan dominios de TikTok e IDs numéricos; iframe con `sandbox` |
| Privacidad | No se guardan IPs reales (solo huella cifrada que se borra en 24 h); aviso de privacidad en `/privacidad` |

## Mantenimiento recomendado
- **Cada mes:** `npm audit` y `npm update`; haz commit y push.
- **Cada 6 meses o si alguien más vio la contraseña:** cambia `ADMIN_PASSWORD` en Vercel.
- **Si Mily pierde su celular:** cambia `ADMIN_SECRET` en Vercel (cierra todas las sesiones).
- **Nunca** compartas ni subas a GitHub la `SUPABASE_SERVICE_ROLE_KEY`. Si se filtra: Supabase → Settings → API → *Roll* (generar nueva) y actualízala en Vercel.
- Activa la **verificación en dos pasos (2FA)** en GitHub, Vercel y Supabase.
- Supabase plan gratis pausa proyectos sin uso; revisa que esté activo y haz respaldos (Database → Backups o exportar CSV).
