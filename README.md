# CarbonGrid — Fase 2

Dashboard demostrativo para interpretar datos eléctricos de Electricity Maps con una integración segura desde el servidor.

## Incluido

- Nueva identidad visual inspirada en energía eléctrica: azul profundo, cian y amarillo de alta tensión.
- Selector de zonas eléctricas.
- Ruta segura `GET /api/electricity/latest?zone=SV`.
- La API key nunca llega al navegador.
- Consulta de intensidad de carbono, mezcla eléctrica y flujos.
- Normalización compatible con respuestas que usan objeto raíz o arreglo `data`.
- Manejo de errores y fallback automático a datos locales.
- Indicadores de modo en vivo/demostración, estimación, actualización y granularidad.
- Skeleton de carga y actualización manual.

## Instalación

```bash
npm install
cp .env.example .env.local
npm run dev
```

En Windows puedes copiar `.env.example` manualmente y renombrarlo como `.env.local`.

## API key

En `.env.local` coloca:

```env
ELECTRICITY_MAPS_API_KEY=TU_CLAVE_REAL
NEXT_PUBLIC_DEMO_MODE=false
```

La URL y los paths pueden cambiar según el producto o licencia mostrada en tu Playground. Si tu Playground genera rutas distintas, copia esos valores en:

```env
ELECTRICITY_MAPS_API_BASE_URL=
ELECTRICITY_MAPS_CARBON_INTENSITY_PATH=
ELECTRICITY_MAPS_POWER_BREAKDOWN_PATH=
ELECTRICITY_MAPS_FLOWS_PATH=
```

La aplicación envía la clave mediante `auth-token` y también `Authorization: Bearer` para facilitar la adaptación entre configuraciones. Puedes conservar únicamente el encabezado que exija tu cuenta.

## Modo demostración

```env
NEXT_PUBLIC_DEMO_MODE=true
```

Usa siempre datos locales. Con `false`, intenta la API; si la API falla, activa automáticamente el respaldo e informa al usuario.

## Verificación

```bash
npm run lint
npm run build
```
