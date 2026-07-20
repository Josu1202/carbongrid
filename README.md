# CarbonGrid — Fase 1

Base visual de la aplicación demostrativa para el taller **Sostenibilidad digital y análisis energético mediante Electricity Maps**.

## Tecnologías

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React
- Recharts preparado para las siguientes fases

## Incluido en esta fase

- Dashboard responsive.
- Barra lateral en escritorio y menú móvil.
- Barra superior.
- Tema claro y oscuro persistente.
- Tarjetas reutilizables de indicadores.
- Mezcla eléctrica demostrativa.
- Espacios preparados para comparación y recomendación.
- Datos locales de demostración.
- Variables de entorno preparadas para la API.

## Ejecutar

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`. La página principal redirige a `/dashboard`.

## API key

1. Copia `.env.example` como `.env.local`.
2. En la siguiente fase coloca la clave así:

```env
ELECTRICITY_MAPS_API_KEY=TU_CLAVE
ELECTRICITY_MAPS_API_BASE_URL=https://api.electricitymaps.com
NEXT_PUBLIC_DEMO_MODE=true
```

La variable **no** utiliza el prefijo `NEXT_PUBLIC_`, porque la clave se manejará en una ruta del servidor para evitar exponerla en el navegador.

## Estructura principal

```text
app/
  dashboard/page.tsx
  globals.css
  layout.tsx
  page.tsx
src/
  components/
    dashboard/
    layout/
    ui/
  constants/
  data/
  lib/
  types/
```

## Siguiente fase

Integración segura con Electricity Maps mediante rutas API de Next.js, validación de respuestas, manejo de errores y fallback automático a datos locales.
