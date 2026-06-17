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
    
    // Simulate a shuffling delay of 1.2 seconds for visual suspense
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * citas.length);
      setSelectedCita(citas[randomIndex]);
      setShuffling(false);
    }, 1200);
  };

  const handleReset = () => {
    setSelectedCita(null);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-md relative min-h-[calc(100vh-12rem)] lg:min-h-0">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-secondary-container rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 pointer-events-none" aria-hidden="true"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-primary-fixed-dim rounded-full mix-blend-multiply filter blur-3xl opacity-15 dark:opacity-5 pointer-events-none" aria-hidden="true"></div>

      {!selectedCita ? (
        /* RANDOMIZER STATE (Cover deck) */
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center z-10 animate-fade-in">
          <h2 className="font-display-lg-mobile lg:font-display-lg text-on-surface mb-4">
            ¿No saben qué hacer hoy?
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl max-w-[480px]">
            Deja que el destino decida. Toca el mazo o presiona el botón para descubrir tu próxima experiencia juntos.
          </p>

          {/* Interactive Deck/Visual Stack */}
          <button
            type="button"
            onClick={handleRollRandom}
            disabled={shuffling || citas.length === 0}
            className="relative w-64 h-80 mb-lg cursor-pointer group focus:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Barajar cartas de cita"
          >
            {/* Card Stack Illusion - Card 3 */}
            <div className="absolute inset-0 bg-surface border border-outline-variant/30 rounded-xl transform rotate-6 translate-x-4 shadow-sm transition-transform group-hover:rotate-12 group-hover:translate-x-6 duration-300"></div>
            
            {/* Card Stack Illusion - Card 2 */}
            <div className="absolute inset-0 bg-surface border border-outline-variant/30 rounded-xl transform -rotate-3 -translate-x-2 shadow-sm transition-transform group-hover:-rotate-6 group-hover:-translate-x-4 duration-300"></div>
            
            {/* Main Active Card */}
            <div className={`absolute inset-0 bg-secondary-container rounded-xl card-shadow border border-white/20 flex flex-col items-center justify-center transition-transform group-hover:-translate-y-4 duration-300 z-10 overflow-hidden ${
              shuffling ? 'animate-shake' : ''
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" aria-hidden="true"></div>
              
              {shuffling ? (
                <div className="flex flex-col items-center justify-center gap-xs">
                  <span className="material-symbols-outlined text-[64px] text-on-secondary-container animate-spin" aria-hidden="true">
                    sync
                  </span>
                  <span className="font-label-md text-label-md text-on-secondary-container/80 animate-pulse">
                    Eligiendo...
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-[64px] text-on-secondary-container mb-4" aria-hidden="true">
                    shuffle
                  </span>
                  <span className="font-headline-md text-headline-md text-on-secondary-container">
                    Barajar
                  </span>
                </div>
              )}
            </div>
          </button>

          {/* Action Button */}
          <button
            onClick={handleRollRandom}
            disabled={shuffling || citas.length === 0}
            className="px-8 py-4 bg-primary text-on-primary rounded-full font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all shadow-[0_8px_24px_rgba(250,210,225,0.4)] tracking-wide disabled:opacity-50 disabled:cursor-not-allowed focus-ring-visible"
          >
            {shuffling ? 'SELECCIONANDO...' : 'DESCUBRIR CITA'}
          </button>

          {citas.length === 0 && (
            <p className="font-body-md text-body-md text-error mt-sm text-center">
              Debes agregar al menos una idea de cita para poder barajar.
            </p>
          )}
        </div>
      ) : (
        /* RESULT STATE (Split Card layout) */
        <div className="w-full max-w-3xl mx-auto z-10 animate-fade-in">
          
          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1 bg-secondary-container text-on-secondary-container rounded-full font-label-sm text-label-sm mb-4 tracking-widest uppercase shadow-sm">
              ¡Cita Encontrada!
            </span>
            <h2 className="font-display-lg-mobile lg:font-display-lg text-on-surface">
              {selectedCita.titulo}
            </h2>
          </div>

          {/* Result Card Container */}
          {selectedCita.fotoUrl ? (
            <div className="bg-surface rounded-xl overflow-hidden card-shadow border border-outline-variant/40 flex flex-col md:flex-row w-full">
              {/* Image Side (Memory Photo) */}
              <div className="md:w-1/2 h-64 md:h-auto relative bg-surface-container-highest min-h-[240px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={selectedCita.titulo}
                  className="w-full h-full object-cover"
                  src={selectedCita.fotoUrl}
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-white/95 dark:bg-surface-container-lowest/95 backdrop-blur-sm text-on-surface rounded-full font-label-sm text-label-sm border border-outline-variant/30 shadow-sm">
                    {selectedCita.categoria}
                  </span>
                  <span className="px-3 py-1 bg-white/95 dark:bg-surface-container-lowest/95 backdrop-blur-sm text-on-surface rounded-full font-label-sm text-label-sm border border-outline-variant/30 shadow-sm">
                    <StarRating rating={selectedCita.puntuacion} size="sm" />
                  </span>
                </div>
              </div>

              {/* Content Side */}
              <div className="p-md md:p-lg md:w-1/2 flex flex-col justify-between bg-surface-bright border-t md:border-t-0 md:border-l border-outline-variant/20">
                <div className="flex flex-col gap-sm">
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    {selectedCita.descripcion}
                  </p>

                  {selectedCita.notas && (
                    <p className="font-body-md text-body-md italic text-primary/80 border-l-2 border-primary/30 pl-3 py-0.5 text-sm">
                      &quot;{selectedCita.notas}&quot;
                    </p>
                  )}

                  <div className="flex flex-col gap-3 my-4">
                    <div className="flex items-center gap-3 text-on-surface-variant">
                      <span className="material-symbols-outlined text-secondary" aria-hidden="true">schedule</span>
                      <span className="font-label-md text-label-md">
                        Duración: {selectedCita.duracion || '2-3 horas'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-on-surface-variant">
                      <span className="material-symbols-outlined text-secondary" aria-hidden="true">payments</span>
                      <span className="font-label-md text-label-md">
                        Costo Estimado: {selectedCita.costo === '$' ? 'Económico' : selectedCita.costo === '$$' ? 'Medio' : 'Elevado'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-on-surface-variant">
                      <span className="material-symbols-outlined text-secondary" aria-hidden="true">location_on</span>
                      <span className="font-label-md text-label-md">
                        Lugar: {selectedCita.lugar}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-lg pt-sm border-t border-outline-variant/20">
                  <Link
                    href={`/programar?id=${selectedCita.id}`}
                    className="flex-grow py-3 px-6 bg-primary text-on-primary rounded-full font-label-md text-label-md hover:opacity-90 transition-all text-center focus-ring-visible shadow-md shadow-primary/20"
                  >
                    Programar esta Cita
                  </Link>
                  
                  <button
                    type="button"
                    onClick={handleReset}
                    className="py-3 px-6 bg-transparent border border-outline text-on-surface rounded-full font-label-md text-label-md hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 focus-ring-visible"
                  >
                    <span className="material-symbols-outlined text-[18px]" aria-hidden="true">refresh</span>
                    Otra Opción
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-surface rounded-xl overflow-hidden card-shadow border border-outline-variant/40 flex flex-col w-full max-w-xl mx-auto">
              <div className="p-md md:p-lg flex flex-col justify-between bg-surface-bright">
                <div className="flex flex-col gap-sm">
                  <div className="flex gap-2 mb-2">
                    <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full font-label-sm text-label-sm shadow-sm">
                      {selectedCita.categoria}
                    </span>
                    <span className="px-3 py-1 bg-surface-container text-on-surface rounded-full font-label-sm text-label-sm border border-outline-variant/30 shadow-sm">
                      <StarRating rating={selectedCita.puntuacion} size="sm" />
                    </span>
                  </div>

                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    {selectedCita.descripcion}
                  </p>

                  {selectedCita.notas && (
                    <p className="font-body-md text-body-md italic text-primary/80 border-l-2 border-primary/30 pl-3 py-0.5 text-sm">
                      &quot;{selectedCita.notas}&quot;
                    </p>
                  )}

                  <div className="flex flex-col gap-3 my-4 border-t border-outline-variant/10 pt-4">
                    <div className="flex items-center gap-3 text-on-surface-variant">
                      <span className="material-symbols-outlined text-secondary" aria-hidden="true">schedule</span>
                      <span className="font-label-md text-label-md">
                        Duración: {selectedCita.duracion || '2-3 horas'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-on-surface-variant">
                      <span className="material-symbols-outlined text-secondary" aria-hidden="true">payments</span>
                      <span className="font-label-md text-label-md">
                        Costo Estimado: {selectedCita.costo === '$' ? 'Económico' : selectedCita.costo === '$$' ? 'Medio' : 'Elevado'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-on-surface-variant">
                      <span className="material-symbols-outlined text-secondary" aria-hidden="true">location_on</span>
                      <span className="font-label-md text-label-md">
                        Lugar: {selectedCita.lugar}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-lg pt-sm border-t border-outline-variant/20">
                  <Link
                    href={`/programar?id=${selectedCita.id}`}
                    className="flex-grow py-3 px-6 bg-primary text-on-primary rounded-full font-label-md text-label-md hover:opacity-90 transition-all text-center focus-ring-visible shadow-md shadow-primary/20"
                  >
                    Programar esta Cita
                  </Link>
                  
                  <button
                    type="button"
                    onClick={handleReset}
                    className="py-3 px-6 bg-transparent border border-outline text-on-surface rounded-full font-label-md text-label-md hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 focus-ring-visible"
                  >
                    <span className="material-symbols-outlined text-[18px]" aria-hidden="true">refresh</span>
                    Otra Opción
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Adjust preferences stub button under the stack */}
      {!selectedCita && (
        <button
          onClick={() => alert('¡Pronto podrás configurar filtros como categoría, presupuesto y clima!')}
          className="mt-md py-2 px-4 bg-surface-container-highest text-on-surface rounded-full font-label-sm text-label-sm border border-outline-variant/20 hover:bg-surface-variant transition-colors flex items-center gap-1 shrink-0 z-10 focus-ring-visible"
        >
          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">tune</span>
          Ajustar Preferencias
        </button>
      )}

    </div>
  );
}
