export interface Cita {
  id: string;
  titulo: string;
  descripcion: string;
  lugar: string;
  categoria: string;
  puntuacion: number; // 1 to 5 stars
  fecha?: string;     // format: e.g. "Jue, 12 Oct" or "2026-06-15" (optional)
  hora?: string;      // e.g. "20:00" (optional)
  notas?: string;     // optional notes for the partner
  costo: 'Económico' | 'Medio' | 'Elevado' | '$' | '$$' | '$$$';
  duracion?: string;  // e.g. "Aprox. 2 horas"
  imagenUrl?: string; // image illustration
  fotoUrl?: string;   // photo memory (uploaded via Supabase)
  fotos?: string[];   // gallery of memories (multiple photos)
}
