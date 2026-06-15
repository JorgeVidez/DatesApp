'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Cita } from '@/types/cita';

interface CitasContextType {
  citas: Cita[];
  addCita: (cita: Omit<Cita, 'id'>) => void;
  updateCita: (cita: Cita) => void;
  deleteCita: (id: string) => void;
}

const CitasContext = createContext<CitasContextType | undefined>(undefined);

// Initial Mock Data
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
  const [citas, setCitas] = useState<Cita[]>(INITIAL_CITAS);

  const addCita = (formData: Omit<Cita, 'id'>) => {
    const newCita: Cita = {
      ...formData,
      id: Date.now().toString(),
    };
    setCitas((prev) => [newCita, ...prev]);
  };

  const updateCita = (updatedData: Cita) => {
    setCitas((prev) =>
      prev.map((c) => (c.id === updatedData.id ? updatedData : c))
    );
  };

  const deleteCita = (id: string) => {
    setCitas((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <CitasContext.Provider value={{ citas, addCita, updateCita, deleteCita }}>
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
