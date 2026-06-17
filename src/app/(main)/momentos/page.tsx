'use client';

import React, { useState } from 'react';
import { useCitas } from '@/hooks/useCitas';
import { Cita } from '@/types/cita';
import CitaDetalle from '@/components/features/CitaDetalle';

/**
 * Heurística inteligente para determinar si una cita ya ha transcurrido.
 * Copiada del dashboard para mantener consistencia.
 */
function isCitaPasada(cita: Cita): boolean {
  if (cita.fotoUrl) return true;
  if (!cita.fecha) return false;

  try {
    const parsedDate = Date.parse(cita.fecha);
    if (!isNaN(parsedDate)) {
      return new Date(parsedDate) < new Date();
    }

    const lower = cita.fecha.toLowerCase();
    const monthsMap: { [key: string]: number } = {
      ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5, jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11,
      jan: 0, apr: 3, aug: 7, dec: 11
    };

    let monthIndex = -1;
    let day = 1;

    for (const [key, val] of Object.entries(monthsMap)) {
      if (lower.includes(key)) {
        monthIndex = val;
        const match = lower.match(/\d+/);
        if (match) day = parseInt(match[0], 10);
        break;
      }
    }

    if (monthIndex !== -1) {
      const now = new Date();
      const currentYear = now.getFullYear();
      const citaDate = new Date(currentYear, monthIndex, day);
      return citaDate < now;
    }
  } catch (error) {
    console.error('Error al parsear la fecha de la cita:', error);
  }

  return false;
}

export default function MomentosInolvidablesPage() {
  const {
    citas,
    loading,
    citaSeleccionada,
    setCitaSeleccionada,
    subirFotoACita,
  } = useCitas();

  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtrar citas pasadas que tienen fecha agendada
  const momentos = citas.filter((c) => c.fecha && isCitaPasada(c));

  // Obtener categorías únicas para filtrar recuerdos
  const categories = ['Todas', ...Array.from(new Set(momentos.map((m) => m.categoria)))];

  // Aplicar filtros de categoría y búsqueda
  const filteredMomentos = momentos.filter((m) => {
    const matchesCategory = selectedCategory === 'Todas' || m.categoria === selectedCategory;
    const matchesSearch =
      m.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.lugar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.descripcion && m.descripcion.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Clases CSS para rotaciones aleatorias/alternadas de las Polaroid
  const getRotationClass = (index: number) => {
    const rotations = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2', '-rotate-[1.5deg]', 'rotate-[1.5deg]'];
    return rotations[index % rotations.length];
  };

  return (
    <div className="flex flex-col gap-lg pb-12">
      
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md pb-md border-b border-outline-variant/20">
        <div>
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
            Álbum de Momentos Inolvidables
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">
            Nuestros recuerdos favoritos impresos en fotos y momentos románticos compartidos.
          </p>
        </div>
      </header>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface-container-low/50 p-4 rounded-2xl border border-outline-variant/10">
        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 hide-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-label-sm text-label-sm transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-on-primary shadow-sm font-bold'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:bg-secondary-container/30'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Text Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Buscar recuerdos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-full pl-10 pr-4 py-2.5 font-body-md text-sm text-on-surface placeholder:text-outline-variant/75 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          />
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">
            search
          </span>
        </div>
      </div>

      {loading ? (
        /* Loading Skeleton Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg pt-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-surface border rounded-xl p-4 pb-8 space-y-4 animate-pulse">
              <div className="aspect-square bg-surface-variant rounded-md"></div>
              <div className="h-4 w-3/4 bg-surface-variant rounded"></div>
              <div className="h-3 w-1/2 bg-surface-variant rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredMomentos.length === 0 ? (
        /* Empty State */
        <div className="bg-surface rounded-3xl p-xl border border-dashed border-outline-variant/40 text-center py-20 flex flex-col items-center justify-center gap-md max-w-xl mx-auto mt-8">
          <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">photo_camera</span>
          </div>
          <div className="space-y-1">
            <h4 className="font-headline-md text-lg text-on-surface">No hay momentos inolvidables</h4>
            <p className="font-body-md text-on-surface-variant text-sm max-w-[360px] mx-auto leading-relaxed">
              {searchQuery || selectedCategory !== 'Todas'
                ? 'Ningún momento coincide con los filtros aplicados. Intenta cambiar tu búsqueda.'
                : 'Aún no hemos agregado fotos a nuestras citas vividas. Ve a tu Dashboard, haz clic en una cita ya realizada y sube una foto de recuerdo.'}
            </p>
          </div>
        </div>
      ) : (
        /* Scrapbook Polaroid Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg pt-4 px-2">
          {filteredMomentos.map((moment, index) => {
            const hasUploadedFoto = !!moment.fotoUrl;
            
            return (
              <div
                key={moment.id}
                onClick={() => setCitaSeleccionada(moment)}
                className={`bg-white p-4 pb-8 rounded-sm shadow-md hover:shadow-xl border border-neutral-200 transition-all duration-300 cursor-pointer flex flex-col justify-between group select-none hover:scale-[1.02] hover:rotate-0 hover:z-10 ${getRotationClass(
                  index
                )}`}
              >
                {/* Photo Area */}
                <div className="aspect-square w-full overflow-hidden bg-neutral-100 relative shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={moment.fotoUrl || moment.imagenUrl || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800'}
                    alt={moment.titulo}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                      hasUploadedFoto ? 'grayscale-[5%] group-hover:grayscale-0' : 'brightness-[85%]'
                    }`}
                  />
                  
                  {/* Category overlay */}
                  <span className="absolute top-2 left-2 bg-neutral-900/70 text-white font-label-sm text-[10px] px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                    {moment.categoria}
                  </span>

                  {/* Missing Photo Camera Icon Overlay */}
                  {!hasUploadedFoto && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white gap-2 p-4">
                      <span className="material-symbols-outlined text-3xl animate-pulse">add_a_photo</span>
                      <span className="font-label-sm text-[11px] font-bold text-center tracking-wide uppercase">
                        Agregar Recuerdo
                      </span>
                    </div>
                  )}
                </div>

                {/* Polaroid Caption Area */}
                <div className="mt-4 text-center font-literata text-neutral-800 flex flex-col gap-1">
                  <h4 className="font-bold text-sm sm:text-base line-clamp-1 group-hover:text-primary transition-colors px-2">
                    {moment.titulo}
                  </h4>
                  <div className="flex items-center justify-center gap-1.5 text-neutral-500 font-sans text-xs">
                    <span className="material-symbols-outlined text-xs">location_on</span>
                    <span className="truncate max-w-[120px]">{moment.lugar}</span>
                    <span>•</span>
                    <span className="font-semibold">{moment.fecha}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CitaDetalle Floating Modal */}
      {citaSeleccionada && (
        <CitaDetalle
          cita={citaSeleccionada}
          onClose={() => setCitaSeleccionada(null)}
          onUploadFoto={subirFotoACita}
        />
      )}
    </div>
  );
}
