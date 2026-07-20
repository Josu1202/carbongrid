export interface DigitalActivity {
  id: string;
  name: string;
  description: string;
  energyKwh: number;
  flexible: boolean;
}

export const digitalActivities: DigitalActivity[] = [
  {
    id: "ai-processing",
    name: "Procesamiento de IA",
    description: "Tarea programable de inferencia o procesamiento por lotes.",
    energyKwh: 0.6,
    flexible: true,
  },
  {
    id: "videoconference",
    name: "Videoconferencia institucional",
    description: "Sesión sincrónica con varias personas conectadas.",
    energyKwh: 0.15,
    flexible: false,
  },
  {
    id: "streaming",
    name: "Sesión educativa por streaming",
    description: "Transmisión de contenido audiovisual con fines educativos.",
    energyKwh: 0.2,
    flexible: false,
  },
  {
    id: "computer-lab",
    name: "Laboratorio con varios equipos",
    description: "Uso conjunto de computadoras durante una práctica.",
    energyKwh: 3,
    flexible: true,
  },
  {
    id: "cloud-backup",
    name: "Respaldo en la nube",
    description: "Carga programable de archivos y copias de seguridad.",
    energyKwh: 1.5,
    flexible: true,
  },
  {
    id: "custom",
    name: "Consumo personalizado",
    description: "Introduce manualmente la energía estimada de la actividad.",
    energyKwh: 1,
    flexible: true,
  },
];
