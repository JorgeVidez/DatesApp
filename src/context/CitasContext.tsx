'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cita } from '@/types/cita';
import * as citaService from '@/services/citaService';
import imageCompression from 'browser-image-compression';

export interface CitasContextType {
  citas: Cita[];
  loading: boolean;
  error: string | null;
  citaSeleccionada: Cita | null;
  setCitaSeleccionada: (cita: Cita | null) => void;
  addCita: (cita: Omit<Cita, 'id'>) => Promise<void>;
  updateCita: (cita: Cita) => Promise<void>;
  deleteCita: (id: string) => Promise<void>;
  subirFotoACita: (citaId: string, file: File) => Promise<void>;
  refrescarCitas: () => Promise<void>;
}

// Exportamos el contexto para que pueda ser importado por el hook personalizado
export const CitasContext = createContext<CitasContextType | undefined>(undefined);

// Datos iniciales de mockup por si Supabase no está configurado o falla
const INITIAL_CITAS: Cita[] = [
  {
    id: '1',
    titulo: 'Picnic al Atardecer en el Parque',
    descripcion: 'Una tarde relajada disfrutando de la naturaleza con una cesta preparada, quesos artesanales y vino blanco.',
    lugar: 'Barrio Francés',
    categoria: 'Al Aire Libre',
    puntuacion: 4,
    fecha: 'Sáb, 20 Jun',
    costo: '$',
    duracion: 'Aprox. 2 horas',
    imagenUrl: 'https://images.unsplash.com/photo-1526218626217-dc65a29bb444?auto=format&fit=crop&q=80&w=800',
    notas: 'Llevar manta para el pasto y repelente.',
  },
  {
    id: '2',
    titulo: 'Cena Romántica Italiana',
    descripcion: 'Reserva en ese pequeño restaurante italiano iluminado con velas. Perfecto para conversaciones profundas y buena pasta.',
    lugar: 'Bistro de París',
    categoria: 'Gastronomía',
    puntuacion: 5,
    fecha: 'Vie, 26 Jun',
    costo: '$$$',
    duracion: '2-3 horas',
    imagenUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800',
    notas: 'Ponerse algo elegante. Sorpresa al final de la noche.',
  },
  {
    id: '3',
    titulo: 'Cine de Verano',
    descripcion: 'Noche de película bajo las estrellas. Llevaremos mantas cómodas y nuestras bebidas favoritas para disfrutar la función.',
    lugar: 'Jardín Botánico',
    categoria: 'Entretenimiento',
    puntuacion: 4,
    fecha: 'Sáb, 4 Jul',
    costo: '$$',
    duracion: 'Aprox. 3 horas',
    imagenUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800',
    notas: 'Llevar almohadones cómodos.',
  },
];

export function CitasProvider({ children }: { children: ReactNode }) {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  const [usingMockData, setUsingMockData] = useState<boolean>(false);

  // Cargar citas al montar el componente
  useEffect(() => {
    refrescarCitas();
  }, []);

  const refrescarCitas = async () => {
    setLoading(true);
    setError(null);
    try {
      // Verificamos si las variables de entorno de Supabase están configuradas
      const isConfigured = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project-id.supabase.co';

      if (!isConfigured) {
        throw new Error('Supabase no está configurado. Usando base de datos simulada local.');
      }

      const data = await citaService.getCitas();
      setCitas(data);
      setUsingMockData(false);
    } catch (err: any) {
      console.warn('Conexión a Supabase fallida. Usando datos mock locales:', err.message);
      setCitas(INITIAL_CITAS);
      setError(err.message || 'Error de conexión');
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  const addCita = async (formData: Omit<Cita, 'id'>) => {
    setLoading(true);
    try {
      if (usingMockData) {
        // Simular inserción local
        const newCita: Cita = {
          ...formData,
          id: Date.now().toString(),
        };
        setCitas((prev) => [newCita, ...prev]);
      } else {
        const newCita = await citaService.addCita(formData);
        setCitas((prev) => [newCita, ...prev]);
      }
    } catch (err: any) {
      console.error('Error al agregar cita:', err);
      // Fallback local en caso de error de red
      const newCita: Cita = {
        ...formData,
        id: Date.now().toString(),
      };
      setCitas((prev) => [newCita, ...prev]);
      alert('Error en el servidor. La cita se guardó localmente de forma temporal.');
    } finally {
      setLoading(false);
    }
  };

  const updateCita = async (updatedData: Cita) => {
    setLoading(true);
    try {
      if (usingMockData) {
        setCitas((prev) =>
          prev.map((c) => (c.id === updatedData.id ? updatedData : c))
        );
      } else {
        const updated = await citaService.updateCitaService(updatedData);
        setCitas((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        );
      }
      
      // Actualizar la cita seleccionada si corresponde
      if (citaSeleccionada?.id === updatedData.id) {
        setCitaSeleccionada(updatedData);
      }
    } catch (err: any) {
      console.error('Error al actualizar cita:', err);
      // Fallback local
      setCitas((prev) =>
        prev.map((c) => (c.id === updatedData.id ? updatedData : c))
      );
      if (citaSeleccionada?.id === updatedData.id) {
        setCitaSeleccionada(updatedData);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteCita = async (id: string) => {
    setLoading(true);
    try {
      if (!usingMockData) {
        await citaService.deleteCitaService(id);
      }
      setCitas((prev) => prev.filter((c) => c.id !== id));
      if (citaSeleccionada?.id === id) {
        setCitaSeleccionada(null);
      }
    } catch (err: any) {
      console.error('Error al eliminar cita:', err);
      // Fallback local
      setCitas((prev) => prev.filter((c) => c.id !== id));
      if (citaSeleccionada?.id === id) {
        setCitaSeleccionada(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const subirFotoACita = async (citaId: string, file: File) => {
    try {
      // Configuración de compresión de imágenes
      const options = {
        maxSizeMB: 0.6,          // Peso máximo objetivo de ~600 KB
        maxWidthOrHeight: 1200,  // Dimensión máxima (ancho o alto) de 1200px
        useWebWorker: true,
      };

      console.log(`[Compresión] Peso original: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      const compressedFile = await imageCompression(file, options);
      console.log(`[Compresión] Peso final: ${(compressedFile.size / 1024).toFixed(2)} KB`);

      if (usingMockData) {
        // En modo mockup local, creamos un object URL del archivo comprimido
        const fakeUrl = URL.createObjectURL(compressedFile);
        // Esperamos 1s para simular la carga
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        setCitas((prev) =>
          prev.map((c) => {
            if (c.id === citaId) {
              const existing = c.fotos || [];
              const updatedFotos = [...existing, fakeUrl];
              return { ...c, fotoUrl: fakeUrl, fotos: updatedFotos };
            }
            return c;
          })
        );

        if (citaSeleccionada?.id === citaId) {
          setCitaSeleccionada((prev) => {
            if (!prev) return null;
            const existing = prev.fotos || [];
            const updatedFotos = [...existing, fakeUrl];
            return { ...prev, fotoUrl: fakeUrl, fotos: updatedFotos };
          });
        }
      } else {
        // En modo producción, subimos el archivo comprimido a Supabase Storage
        const publicUrl = await citaService.uploadCitaFoto(citaId, compressedFile);
        
        setCitas((prev) =>
          prev.map((c) => {
            if (c.id === citaId) {
              const existing = c.fotos || [];
              const updatedFotos = [...existing, publicUrl];
              return { ...c, fotoUrl: publicUrl, fotos: updatedFotos };
            }
            return c;
          })
        );

        if (citaSeleccionada?.id === citaId) {
          setCitaSeleccionada((prev) => {
            if (!prev) return null;
            const existing = prev.fotos || [];
            const updatedFotos = [...existing, publicUrl];
            return { ...prev, fotoUrl: publicUrl, fotos: updatedFotos };
          });
        }
      }
    } catch (err: any) {
      console.error('Error al subir la foto de la cita:', err);
      alert('Hubo un problema al subir la foto: ' + err.message);
      throw err;
    }
  };

  return (
    <CitasContext.Provider
      value={{
        citas,
        loading,
        error,
        citaSeleccionada,
        setCitaSeleccionada,
        addCita,
        updateCita,
        deleteCita,
        subirFotoACita,
        refrescarCitas,
      }}
    >
      {children}
    </CitasContext.Provider>
  );
}

export function useCitas() {
  const context = useContext(CitasContext);
  if (context === undefined) {
    throw new Error('useCitas debe ser usado dentro de un CitasProvider');
  }
  return context;
}
