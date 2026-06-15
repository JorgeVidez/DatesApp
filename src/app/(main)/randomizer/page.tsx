'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCitas } from '@/context/CitasContext';
import { Cita } from '@/types/cita';
import StarRating from '@/components/ui/StarRating';

export default function RandomizerPage() {
  const { citas } = useCitas();
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
  const [shuffling, setShuffling] = useState(false);

  const handleRollRandom = () => {
    if (citas.length === 0) return;
    setShuffling(true);
    
    // Simulate a shuffling delay of 1 second for visual suspense
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * citas.length);
      setSelectedCita(citas[randomIndex]);
      setShuffling(false);
    }, 1000);
  };

  const handleReset = () => {
    setSelectedCita(null);
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center justify-center py-md">
      
      {/* Header Text */}
      <div className="text-center mb-lg">
        <h1 className="font-display-lg-mobile text-display-lg-mobile text-on-surface mb-xs">
          ¿Qué hacemos hoy?
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Deja que el azar decida vuestra próxima aventura.
        </p>
      </div>

      {/* Card Stack Area */}
      <div className="relative w-full aspect-[3/4] max-w-[320px] mb-lg">
        
        {/* Background Card 2 */}
        <div className="absolute inset-0 bg-surface-container-high rounded-[2rem] shadow-[0_8px_24px_rgba(250,210,225,0.2)] transform rotate-[-6deg] translate-y-4 scale-95 origin-bottom border border-secondary/10 z-10 transition-all duration-500">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-fixed to-transparent" aria-hidden="true"></div>
        </div>
        
        {/* Background Card 1 */}
        <div className="absolute inset-0 bg-surface-container rounded-[2rem] shadow-[0_8px_24px_rgba(250,210,225,0.3)] transform rotate-[4deg] translate-y-2 scale-95 origin-bottom border border-secondary/10 z-20 transition-all duration-500">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-secondary-container to-transparent" aria-hidden="true"></div>
        </div>

        {/* Foreground Card (Active) */}
        <div className={`card-stack-1 absolute inset-0 bg-surface-container-lowest rounded-[2rem] shadow-[0_12px_32px_rgba(250,210,225,0.5)] border border-primary/5 flex flex-col p-md overflow-hidden z-30 transition-all duration-300 hover:shadow-[0_16px_40px_rgba(250,210,225,0.6)] group ${
          shuffling ? 'animate-shake' : ''
        }`}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed/20 via-transparent to-secondary-fixed/20 pointer-events-none" aria-hidden="true"></div>

          {shuffling ? (
            /* Shuffling State */
            <div className="flex flex-col items-center justify-center h-full w-full gap-md">
              <span className="material-symbols-outlined text-[64px] text-primary animate-spin" aria-hidden="true">
                casino
              </span>
              <p className="font-label-md text-label-md text-primary animate-pulse">
                Mezclando cartas románticas...
              </p>
            </div>
          ) : selectedCita ? (
            /* Revealed Card State */
            <div className="flex flex-col h-full w-full justify-between relative z-10 animate-fade-in">
              <div className="flex flex-col gap-xs">
                {/* Image */}
                <div className="w-full h-32 rounded-xl overflow-hidden mb-sm shrink-0 border border-outline-variant/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedCita.imagenUrl || 'https://images.unsplash.com/photo-1526218626217-dc65a29bb444?auto=format&fit=crop&q=80&w=200'}
                    alt={selectedCita.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Tags */}
                <span className="bg-secondary-container text-on-secondary-container font-label-sm text-[10px] px-2.5 py-0.5 rounded-full w-max">
                  {selectedCita.categoria}
                </span>
                
                {/* Title */}
                <h3 className="font-headline-md text-lg text-on-surface line-clamp-1 mt-1">
                  {selectedCita.titulo}
                </h3>

                {/* Stars and Location */}
                <div className="flex justify-between items-center text-xs text-on-surface-variant/80">
                  <span className="flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[14px]" aria-hidden="true">location_on</span>
                    {selectedCita.lugar}
                  </span>
                  <StarRating rating={selectedCita.puntuacion} size="sm" />
                </div>

                {/* Description */}
                <p className="font-body-md text-body-md text-on-surface-variant text-xs line-clamp-3 leading-relaxed mt-sm">
                  {selectedCita.descripcion}
                </p>
              </div>

              {/* Action buttons inside card */}
              <div className="flex gap-2 mt-md pt-sm border-t border-secondary-container/30">
                <button
                  onClick={handleReset}
                  className="flex-1 py-2 rounded-full border border-outline font-label-sm text-xs text-on-surface-variant hover:bg-surface-container-low focus-ring-visible"
                >
                  Volver
                </button>
                <Link
                  href="/programar"
                  className="flex-1 py-2 rounded-full bg-secondary-container text-on-secondary-container font-bold font-label-sm text-xs text-center flex items-center justify-center gap-0.5 hover:opacity-90 shadow-sm focus-ring-visible"
                >
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">calendar_month</span>
                  Programar
                </Link>
              </div>
            </div>
          ) : (
            /* Cover Card State (Mystery) */
            <div className="flex flex-col items-center justify-center h-full w-full text-center">
              <div className="w-24 h-24 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-md shadow-sm group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-[48px]" aria-hidden="true">casino</span>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-xs">
                Cita Sorpresa
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant px-sm text-sm">
                Presiona el botón para descubrir una idea única de nuestra colección y salir de la rutina.
              </p>
              <div className="absolute bottom-md text-secondary opacity-60 font-label-sm text-label-sm flex flex-col items-center">
                <span className="material-symbols-outlined mb-1 animate-bounce" aria-hidden="true">casino</span>
                Prueba tu suerte
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Action Button */}
      <button
        onClick={handleRollRandom}
        disabled={shuffling || citas.length === 0}
        className="w-full max-w-[320px] py-4 px-8 bg-primary text-on-primary rounded-full font-label-md text-label-md shadow-[0_8px_16px_rgba(250,210,225,0.4)] hover:shadow-[0_12px_24px_rgba(250,210,225,0.6)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus-ring-visible"
      >
        <span className="material-symbols-outlined" aria-hidden="true">auto_awesome</span>
        {selectedCita ? 'Elegir Otra Cita' : 'Descubrir Cita'}
      </button>

      {citas.length === 0 && (
        <p className="font-body-md text-body-md text-error mt-sm text-center">
          Debes agregar al menos una idea de cita para jugar.
        </p>
      )}

      {/* Adjust preferences stub button */}
      <button
        onClick={() => alert('¡Pronto podrás configurar filtros como categoría, presupuesto y clima!')}
        className="mt-md py-2 px-4 bg-surface-container-highest text-on-surface rounded-full font-label-sm text-label-sm border border-outline-variant/20 hover:bg-surface-variant transition-colors flex items-center gap-1 shrink-0 focus-ring-visible"
      >
        <span className="material-symbols-outlined text-[16px]" aria-hidden="true">tune</span>
        Ajustar Preferencias
      </button>

    </div>
  );
}
