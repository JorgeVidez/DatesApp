'use client';

import React from 'react';
import Link from 'next/link';
import { useCitas } from '@/context/CitasContext';

export default function Dashboard() {
  const { citas } = useCitas();

  const nextCita = citas.find(c => c.fecha) || citas[0];
  const recentIdeas = citas.slice(0, 3);
  const totalIdeas = citas.length;
  const citasEsteMes = citas.filter(c => c.fecha).length || 4;

  return (
    <div className="flex flex-col gap-lg">
      
      {/* Page Header */}
      <header className="mb-md">
        <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
          Bienvenido, Mi Amor.
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">
          Aquí está tu resumen romántico para hoy.
        </p>
      </header>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        
        {/* Left Column: Next Date & Stats (col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-lg">
          
          {/* Next Date Héroe Card */}
          {nextCita ? (
            <section className="glass-card rounded-xl overflow-hidden relative group shadow-[0_8px_32px_rgba(250,210,225,0.4)]">
              <div className="h-64 relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Próxima cita"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={nextCita.imagenUrl || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
                
                <div className="absolute bottom-md left-md right-md flex justify-between items-end">
                  <div>
                    <span className="bg-secondary-container text-on-secondary-container font-label-sm text-label-sm px-3 py-1 rounded-full mb-2 inline-block shadow-sm">
                      Próxima Cita
                    </span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      {nextCita.titulo}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2 mt-1">
                      <span className="material-symbols-outlined text-[16px]" aria-hidden="true">location_on</span>
                      {nextCita.lugar}
                    </p>
                  </div>
                  
                  {/* Countdown Box */}
                  <div className="bg-surface text-primary rounded-lg p-3 text-center shadow-md border border-outline-variant/30 shrink-0">
                    <div className="font-display-lg-mobile text-display-lg-mobile leading-none">03</div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">
                      Días
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="glass-card rounded-xl p-md text-center flex flex-col items-center justify-center gap-sm h-64">
              <span className="material-symbols-outlined text-4xl text-primary-container" aria-hidden="true">calendar_today</span>
              <p className="font-label-md text-label-md text-on-surface-variant">No hay próximas citas programadas</p>
              <Link
                href="/programar"
                className="bg-primary text-on-primary font-label-sm text-label-sm px-4 py-2 rounded-full shadow-sm hover:opacity-95 focus-ring-visible"
              >
                Programar una ahora
              </Link>
            </section>
          )}

          {/* Quick Stats Grid */}
          <section className="grid grid-cols-2 gap-md">
            
            {/* Stat 1 */}
            <div className="bg-surface-container-low rounded-xl p-md border border-outline-variant/20 soft-shadow hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-sm">
                <div className="bg-primary-container text-on-primary-container p-2 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]" aria-hidden="true">event_available</span>
                </div>
                <h4 className="font-label-md text-label-md text-on-surface-variant">
                  Citas este Mes
                </h4>
              </div>
              <p className="font-display-lg-mobile text-display-lg-mobile text-primary">
                {citasEsteMes.toString().padStart(2, '0')}
              </p>
            </div>

            {/* Stat 2 */}
            <div className="bg-surface-container-low rounded-xl p-md border border-outline-variant/20 soft-shadow hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-sm">
                <div className="bg-secondary-container text-on-secondary-container p-2 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]" aria-hidden="true">lightbulb</span>
                </div>
                <h4 className="font-label-md text-label-md text-on-surface-variant">
                  Ideas Totales
                </h4>
              </div>
              <p className="font-display-lg-mobile text-display-lg-mobile text-secondary">
                {totalIdeas.toString().padStart(2, '0')}
              </p>
            </div>
          </section>

        </div>

        {/* Right Column: Recent Ideas (col-span-5) */}
        <div className="lg:col-span-5">
          <section className="bg-surface-container-low rounded-xl p-md border border-outline-variant/20 h-full soft-shadow flex flex-col justify-between">
            
            <div>
              <div className="flex justify-between items-center mb-md pb-sm border-b border-secondary-container/50">
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  Ideas Recientes
                </h3>
                <Link
                  href="/ideas"
                  className="text-primary hover:text-surface-tint transition-colors font-label-md text-label-md flex items-center gap-1 focus-ring-visible rounded-lg"
                >
                  Ver todas <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span>
                </Link>
              </div>

              {/* Ideas List */}
              <div className="flex flex-col gap-4">
                {recentIdeas.map((idea) => (
                  <Link
                    key={idea.id}
                    href="/ideas"
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-surface transition-colors cursor-pointer group focus-ring-visible"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative shadow-inner">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt={idea.titulo}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        src={idea.imagenUrl || 'https://images.unsplash.com/photo-1526218626217-dc65a29bb444?auto=format&fit=crop&q=80&w=200'}
                      />
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors truncate">
                          {idea.titulo}
                        </h4>
                        <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors text-sm shrink-0" aria-hidden="true">
                          favorite_border
                        </span>
                      </div>
                      
                      <p className="font-body-md text-body-md text-on-surface-variant text-sm line-clamp-1 mt-0.5">
                        {idea.descripcion}
                      </p>
                      
                      <div className="flex gap-2 mt-2">
                        <span className="bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-[10px] px-2 py-0.5 rounded-full">
                          {idea.categoria}
                        </span>
                        <span className="bg-surface-variant text-on-surface-variant font-label-sm text-[10px] px-2 py-0.5 rounded-full">
                          {idea.costo === '$' ? 'Económico' : idea.costo === '$$' ? 'Medio' : 'Elevado'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}

                {recentIdeas.length === 0 && (
                  <p className="text-center font-body-md text-body-md text-on-surface-variant py-md">
                    No hay ideas de citas todavía.
                  </p>
                )}
              </div>
            </div>

            <Link
              href="/ideas?action=new"
              className="w-full mt-lg py-3 border border-outline-variant text-on-surface-variant rounded-full font-label-md text-label-md hover:bg-surface-variant hover:text-on-surface transition-colors flex items-center justify-center gap-1 focus-ring-visible"
            >
              <span className="material-symbols-outlined text-sm" aria-hidden="true">add</span>
              Añadir Nueva Idea
            </Link>

          </section>
        </div>

      </div>

    </div>
  );
}
