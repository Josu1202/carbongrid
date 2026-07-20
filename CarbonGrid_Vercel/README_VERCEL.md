# CarbonGrid — edición para Vercel

Esta edición conserva los Route Handlers de Next.js para consultar Electricity Maps desde el servidor. La API key no se incluye en el repositorio ni en el ZIP.

## Desarrollo local

1. Copia `.env.example` como `.env.local`.
2. Añade una API key nueva.
3. Ejecuta:

```bash
npm install
npm run dev
```

## Despliegue en Vercel

1. Sube este proyecto a GitHub.
2. En Vercel selecciona **Add New > Project** e importa el repositorio.
3. Vercel detectará Next.js automáticamente.
4. Antes del despliegue o después desde **Project > Settings > Environment Variables**, crea todas las variables descritas en `.env.example`.
5. Selecciona Production, Preview y Development según corresponda.
6. Ejecuta **Deploy**. Si añadiste las variables después, usa **Redeploy**.

## Seguridad

- `.env.local` está ignorado por Git.
- No utilices variables `NEXT_PUBLIC_` para secretos.
- La API key mostrada anteriormente en capturas debe revocarse y sustituirse por una nueva.

## Rutas

- `/dashboard`
- `/comparison`
- `/history`
- `/planner`

El historial puede recurrir a datos demostrativos si la licencia de Electricity Maps no ofrece acceso al endpoint o a la zona seleccionada.
