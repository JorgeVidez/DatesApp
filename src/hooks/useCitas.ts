import { useContext } from 'react';
import { CitasContext } from '@/context/CitasContext';

/**
 * Hook personalizado para acceder y manipular el estado de las citas.
 * Conecta los componentes con CitasContext y permite realizar operaciones
 * CRUD persistidas en Supabase.
 */
export function useCitas() {
  const context = useContext(CitasContext);
  if (context === undefined) {
    throw new Error('useCitas debe ser usado dentro de un CitasProvider');
  }
  return context;
}
