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

export function CitasProvider({ children }: { children: ReactNode }) {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);

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
        throw new Error('Supabase no está configurado en las variables de entorno.');
      }

      const data = await citaService.getCitas();
      setCitas(data);
    } catch (err: any) {
      console.error('Error al cargar citas de Supabase:', err.message);
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const addCita = async (formData: Omit<Cita, 'id'>) => {
    setLoading(true);
    try {
      const newCita = await citaService.addCita(formData);
      setCitas((prev) => [newCita, ...prev]);
    } catch (err: any) {
      console.error('Error al agregar cita:', err);
      alert('Error al agregar la cita en Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const updateCita = async (updatedData: Cita) => {
    setLoading(true);
    try {
      const updated = await citaService.updateCitaService(updatedData);
      setCitas((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
      
      // Actualizar la cita seleccionada si corresponde
      if (citaSeleccionada?.id === updatedData.id) {
        setCitaSeleccionada(updatedData);
      }
    } catch (err: any) {
      console.error('Error al actualizar cita:', err);
      alert('Error al actualizar la cita en Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const deleteCita = async (id: string) => {
    setLoading(true);
    try {
      await citaService.deleteCitaService(id);
      setCitas((prev) => prev.filter((c) => c.id !== id));
      if (citaSeleccionada?.id === id) {
        setCitaSeleccionada(null);
      }
    } catch (err: any) {
      console.error('Error al eliminar cita:', err);
      alert('Error al eliminar la cita de Supabase.');
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
