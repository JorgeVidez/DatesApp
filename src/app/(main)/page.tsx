'use client';

import React from 'react';
import Link from 'next/link';
import { useCitas } from '@/hooks/useCitas';
import { Cita } from '@/types/cita';
import CitaCard from '@/components/features/CitaCard';
import CitaForm from '@/components/features/CitaForm';
import CitaDetalle from '@/components/features/CitaDetalle';

/**
 * Heurística inteligente para determinar si una cita ya ha transcurrido.
 * Una cita es pasada si tiene foto de recuerdo (fotoUrl) o si su fecha
 * agendada es anterior al momento actual.
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

export default function Dashboard() {
  const {
    citas,
    loading,
    error,
    addCita,
    citaSeleccionada,
    setCitaSeleccionada,
    subirFotoACita,
  } = useCitas();

  // Filtrar citas que tienen fecha para clasificar entre programadas y pasadas
  const citasAgendadas = citas.filter((c) => c.fecha);

  const proximasCitas = citasAgendadas.filter((c) => !isCitaPasada(c));
  const momentosInolvidables = citasAgendadas.filter((c) => isCitaPasada(c));

  // Tomamos los 3 momentos más recientes para el teaser del dashboard
  const recuerdosRecientes = momentosInolvidables.slice(0, 3);

  // Las ideas de citas (sin fecha agendada)
  const ideasSinAgendar = citas.filter((c) => !c.fecha);

  const handleCitaSubmit = async (formData: Omit<Cita, 'id'>) => {
    try {
      await addCita(formData);
    } catch (err) {
      console.error('Error al crear la cita:', err);
    }
  };

  return (
    <div className="flex flex-col gap-lg pb-12">
      {/* Page Header */}
      <header className="mb-md">
        <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
          Nuestro Espacio de Citas
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">
          Planifica momentos únicos y conserva fotos de nuestros recuerdos más felices.
        </p>
      </header>

      {/* Database connection warning state */}
      {error && error.includes('Supabase no está configurado') && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-amber-700 dark:text-amber-400 text-sm">
          <span className="material-symbols-outlined shrink-0" aria-hidden="true">warning</span>
          <div>
            <span className="font-bold">Modo Demo Local:</span> Supabase no está conectado. Las citas agregadas y fotos cargadas se guardarán en memoria temporalmente para que puedas probar la aplicación.
          </div>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-lg items-start">
        {/* Left Column: Form (col-span-5) */}
        <div className="xl:col-span-5 flex flex-col gap-md">
          <div className="sticky top-4">
            <CitaForm onSubmit={handleCitaSubmit} />
          </div>
        </div>

        {/* Right Column: Split Lists (col-span-7) */}
        <div className="xl:col-span-7 flex flex-col gap-xl">
          {loading ? (
            /* Skeleton Loading State */
            <div className="space-y-6">
              <div className="h-8 w-48 bg-surface-variant animate-pulse rounded-full"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                <div className="h-64 bg-surface-variant animate-pulse rounded-2xl"></div>
                <div className="h-64 bg-surface-variant animate-pulse rounded-2xl"></div>
              </div>
            </div>
          ) : (
            <>
              {/* Sección 1: Nuestras Próximas Citas */}
              <section className="space-y-md">
                <div className="flex items-center gap-2 border-b border-outline-variant/15 pb-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">calendar_today</span>
                  <h3 className="font-headline-md text-xl text-on-surface">
                    Nuestras Próximas Citas ({proximasCitas.length})
                  </h3>
                </div>

                {proximasCitas.length === 0 ? (
                  <div className="bg-surface rounded-2xl p-lg border border-dashed border-outline-variant/40 text-center py-12 flex flex-col items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-3xl text-outline-variant/80">favorite_border</span>
                    <h4 className="font-label-md text-on-surface text-sm">No hay citas programadas</h4>
                    <p className="font-body-md text-on-surface-variant text-xs max-w-[280px]">
                      Usa el formulario de al lado para registrar y agendar nuestra siguiente aventura romántica.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                    {proximasCitas.map((cita) => (
                      <CitaCard
                        key={cita.id}
                        cita={cita}
                        onSelect={setCitaSeleccionada}
                      />
                    ))}
                  </div>
                )}
              </section>

              {/* Sección 2: Teaser de Recuerdos Recientes */}
              <section className="space-y-md">
                <div className="flex justify-between items-center border-b border-outline-variant/15 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[22px]">auto_awesome</span>
                    <h3 className="font-headline-md text-xl text-on-surface">
                      Recuerdos Recientes
                    </h3>
                  </div>
                  {momentosInolvidables.length > 0 && (
                    <Link
                      href="/momentos"
                      className="text-primary hover:text-surface-tint font-label-md text-label-md text-xs sm:text-sm flex items-center gap-0.5 focus-ring-visible px-2 py-1 rounded-lg"
                    >
                      Ver todo el álbum
                      <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span>
                    </Link>
                  )}
                </div>

                {recuerdosRecientes.length === 0 ? (
                  <div className="bg-surface rounded-2xl p-lg border border-dashed border-outline-variant/40 text-center py-12 flex flex-col items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-3xl text-outline-variant/80">photo_library</span>
                    <h4 className="font-label-md text-on-surface text-sm">Aún no hay recuerdos recientes</h4>
                    <p className="font-body-md text-on-surface-variant text-xs max-w-[280px]">
                      Cuando completemos una cita, abre su detalle y sube una foto de recuerdo para comenzar nuestro álbum digital.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
                      {recuerdosRecientes.map((cita) => {
                        const hasFoto = !!cita.fotoUrl;
                        return (
                          <div
                            key={cita.id}
                            onClick={() => setCitaSeleccionada(cita)}
                            className="bg-white p-2.5 pb-4 rounded-sm border border-neutral-200 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.01] flex flex-col select-none group"
                          >
                            <div className="aspect-square w-full overflow-hidden bg-neutral-100 relative flex items-center justify-center">
                              {hasFoto ? (
                                <img
                                  src={cita.fotoUrl}
                                  alt={cita.titulo}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-neutral-200 flex flex-col items-center justify-center gap-1.5 p-4 text-center">
                                  <span className="material-symbols-outlined text-2xl text-neutral-400 group-hover:text-primary transition-colors">add_a_photo</span>
                                  <span className="text-[9px] font-bold tracking-wider uppercase text-neutral-500">Subir Recuerdo</span>
                                </div>
                              )}
                            </div>
                            <h4 className="font-bold text-[11px] sm:text-xs font-literata text-neutral-800 text-center mt-2 line-clamp-1 truncate group-hover:text-primary transition-colors">
                              {cita.titulo}
                            </h4>
                            <p className="text-[9px] text-neutral-500 font-sans text-center mt-0.5">{cita.fecha}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>

              {/* Sección 3: Ideas por Agendar */}
              {ideasSinAgendar.length > 0 && (
                <section className="space-y-md">
                  <div className="flex items-center gap-2 border-b border-outline-variant/15 pb-2">
                    <span className="material-symbols-outlined text-primary text-[22px]">lightbulb</span>
                    <h3 className="font-headline-md text-xl text-on-surface">
                      Ideas por Programar ({ideasSinAgendar.length})
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-md opacity-85 hover:opacity-100 transition-opacity">
                    {ideasSinAgendar.map((cita) => (
                      <CitaCard
                        key={cita.id}
                        cita={cita}
                        onSelect={setCitaSeleccionada}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>

      {/* Detalle de Cita Modal */}
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
