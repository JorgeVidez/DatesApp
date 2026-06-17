'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCitas } from '@/hooks/useCitas';
import { Cita } from '@/types/cita';

const HOURS = ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

function ProgramarContent() {
  const { citas, updateCita } = useCitas();
  const router = useRouter();
  const searchParams = useSearchParams();
  const routerCitaId = searchParams.get('id');

  const [selectedCitaId, setSelectedCitaId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<number>(12); // Oct 12 default
  const [selectedHour, setSelectedHour] = useState<string>('20:00');
  const [notes, setNotes] = useState('');

  // Set initial Cita ID on mount or when parameters change
  useEffect(() => {
    if (routerCitaId && citas.some((c) => c.id === routerCitaId)) {
      setSelectedCitaId(routerCitaId);
    } else if (citas.length > 0) {
      setSelectedCitaId(citas[0].id);
    }
  }, [routerCitaId, citas]);

  const activeCita = citas.find((c) => c.id === selectedCitaId);

  const handleConfirm = () => {
    if (!activeCita) return;
    
    const updatedCita: Cita = {
      ...activeCita,
      fecha: `Jue, ${selectedDate} Oct`,
      hora: selectedHour,
      notas: notes || undefined,
    };
    
    updateCita(updatedCita);
    alert('¡Cita programada con éxito! Volviendo al Dashboard.');
    router.push('/');
  };

  const handleCitaSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCitaId(e.target.value);
  };

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col font-jakarta">
      
      {/* Header (Suppressing Global Navs) */}
      <header className="flex items-center justify-between px-margin-mobile h-16 w-full sticky top-0 bg-background/90 backdrop-blur-sm z-40 border-b border-surface-variant/30">
        <Link
          href="/"
          className="w-10 h-10 flex items-center justify-start text-on-surface hover:opacity-80 transition-opacity focus-ring-visible rounded-full"
          aria-label="Volver al Dashboard"
        >
          <span className="material-symbols-outlined" aria-hidden="true" style={{ fontVariationSettings: "'wght' 300" }}>
            arrow_back_ios
          </span>
        </Link>
        <h1 className="font-headline-md text-headline-md text-on-surface">Programar</h1>
        <div className="w-10"></div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-margin-mobile md:px-lg py-lg md:py-xl flex flex-col gap-lg">
        
        {/* Header Text */}
        <div>
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
            Programar nuestra cita
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
            Selecciona el momento perfecto para conectar y crear recuerdos invaluables.
          </p>
        </div>

        {citas.length === 0 ? (
          <div className="bg-surface-container-low rounded-xl p-lg text-center flex flex-col items-center justify-center gap-md py-16">
            <span className="material-symbols-outlined text-4xl text-primary" aria-hidden="true">heart_broken</span>
            <p className="font-label-md text-label-md text-on-surface-variant">
              No tienes ninguna idea de cita creada todavía para programar.
            </p>
            <Link
              href="/ideas?action=new"
              className="bg-primary text-on-primary font-label-md text-label-md py-3 px-6 rounded-full focus-ring-visible"
            >
              Crear una Idea de Cita
            </Link>
          </div>
        ) : (
          /* Content Grid Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
            
            {/* Left Column: Cita Details & Time / Notes (col-span-7) */}
            <div className="lg:col-span-7 flex flex-col gap-lg">
              
              {/* Cita Selector */}
              <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant/20">
                <label htmlFor="cita-select" className="block font-label-md text-label-md text-on-surface-variant mb-2">
                  Selecciona la idea de cita a programar
                </label>
                <select
                  id="cita-select"
                  value={selectedCitaId}
                  onChange={handleCitaSelect}
                  className="w-full bg-gradient-to-b from-surface to-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                >
                  {citas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.titulo} ({c.categoria})
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Idea Details Box */}
              {activeCita && (
                <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0_8px_24px_rgba(250,210,225,0.2)] border border-outline-variant/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 z-10">
                    <span className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container font-label-sm text-label-sm px-3 py-1 rounded-full">
                      {activeCita.categoria}
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-md items-start sm:items-center relative z-10">
                    <div className="w-full sm:w-28 h-28 rounded-lg overflow-hidden shrink-0 border border-outline-variant/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt={activeCita.titulo}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        src={activeCita.imagenUrl || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=200'}
                      />
                    </div>
                    <div>
                      <h3 className="font-headline-md text-xl text-on-surface mb-1">
                        {activeCita.titulo}
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 text-sm">
                        {activeCita.descripcion}
                      </p>
                      <div className="flex gap-4 mt-2 text-on-tertiary-fixed-variant text-xs">
                        <div className="flex items-center gap-1 font-label-sm">
                          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">schedule</span>
                          {activeCita.duracion || '2-3 horas'}
                        </div>
                        <div className="flex items-center gap-1 font-label-sm">
                          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">payments</span>
                          {activeCita.costo}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Time Picker Grid */}
              <div className="bg-surface-container-lowest rounded-xl p-md md:p-lg shadow-sm border border-outline-variant/20">
                <h4 className="font-headline-md text-lg text-on-surface mb-md">Seleccionar Horario</h4>
                <div className="grid grid-cols-3 gap-3">
                  {HOURS.map((hour) => {
                    const isSelected = selectedHour === hour;
                    return (
                      <button
                        key={hour}
                        type="button"
                        onClick={() => setSelectedHour(hour)}
                        className={`py-3 px-4 rounded-lg border text-center font-label-md text-label-md transition-all focus-ring-visible ${
                          isSelected
                            ? 'bg-primary text-on-primary border-primary shadow-sm scale-[1.02] font-bold'
                            : 'border-outline-variant/40 text-on-surface-variant hover:border-primary hover:text-primary'
                        }`}
                      >
                        {hour}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes Input Area */}
              <div className="bg-surface-container-lowest rounded-xl p-md md:p-lg shadow-sm border border-outline-variant/20">
                <label className="block font-headline-md text-lg text-on-surface mb-sm" htmlFor="date-notes">
                  Notas para nuestra cita
                </label>
                <p className="font-body-md text-body-md text-on-surface-variant mb-4 text-sm">
                  ¿Hay algo especial que debamos recordar? (Código de vestimenta, sorpresas, reservaciones).
                </p>
                <div className="relative">
                  <textarea
                    id="date-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej. Reservación a nombre de Martín. Sorpresa al final de la noche..."
                    rows={3}
                    className="w-full bg-gradient-to-b from-surface to-surface-container-lowest border border-outline-variant rounded-lg p-4 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none pr-10"
                  />
                  <div className="absolute bottom-3 right-3 text-on-surface-variant/50">
                    <span className="material-symbols-outlined text-[20px]" aria-hidden="true">edit_note</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Calendar Date Picker (col-span-5) */}
            <div className="lg:col-span-5 relative">
              <div className="sticky top-md bg-surface-container-lowest rounded-xl p-md md:p-lg shadow-sm border border-outline-variant/20">
                
                <div className="flex justify-between items-center mb-md">
                  <h4 className="font-headline-md text-lg text-on-surface">Octubre 2026</h4>
                  <div className="flex gap-2">
                    <button type="button" className="p-1 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors" disabled aria-label="Mes anterior">
                      <span className="material-symbols-outlined" aria-hidden="true">chevron_left</span>
                    </button>
                    <button type="button" className="p-1 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors" disabled aria-label="Mes siguiente">
                      <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
                    </button>
                  </div>
                </div>

                {/* Calendar Grid Header */}
                <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                  {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day) => (
                    <div key={day} className="font-label-sm text-label-sm text-on-surface-variant/70">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid Days */}
                <div className="grid grid-cols-7 gap-2 text-center">
                  {/* Empty slots for October 2026 starting on Thursday */}
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  
                  {/* Calendar Days */}
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((day) => {
                    const isSelected = selectedDate === day;
                    const isSuggested = [2, 5, 12, 14, 18].includes(day);
                    
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setSelectedDate(day)}
                        className={`w-9 h-9 rounded-full mx-auto flex items-center justify-center font-body-md text-body-md relative transition-colors focus-ring-visible ${
                          isSelected
                            ? 'bg-primary text-on-primary font-bold shadow-md scale-110 z-10'
                            : 'text-on-surface hover:bg-secondary-container hover:text-on-secondary-container'
                        }`}
                        aria-label={`${day} de Octubre, ${isSuggested ? 'Fecha sugerida' : ''}`}
                      >
                        {day}
                        {isSuggested && !isSelected && (
                          <span className="absolute bottom-1 w-1 h-1 bg-secondary rounded-full" aria-hidden="true"></span>
                        )}
                      </button>
                    );
                  })}
                  
                  {/* Filler ellipses */}
                  <div className="col-span-7 flex justify-center mt-2">
                    <span className="font-label-sm text-label-sm text-on-surface-variant/50">...</span>
                  </div>
                </div>

                {/* Calendar Legend */}
                <div className="mt-md flex items-center gap-4 border-t border-outline-variant/30 pt-md">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary" aria-hidden="true"></span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Fechas sugeridas
                    </span>
                  </div>
                </div>

                {/* Confirm Action Box */}
                <div className="mt-lg pt-md border-t border-outline-variant/30">
                  <div className="flex justify-between items-center mb-md font-label-md text-label-md">
                    <span className="text-on-surface-variant">Fecha seleccionada:</span>
                    <span className="text-primary">{`Jue, ${selectedDate} Oct • ${selectedHour}`}</span>
                  </div>
                  
                  <button
                    onClick={handleConfirm}
                    className="w-full bg-primary text-on-primary font-label-md text-label-md py-4 rounded-full hover:bg-surface-tint transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group active:scale-95 focus-ring-visible"
                  >
                    Confirmar Cita
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" aria-hidden="true">
                      arrow_forward
                    </span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

export default function ProgramarPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-20 text-primary">
        <span className="material-symbols-outlined animate-spin text-4xl">favorite</span>
      </div>
    }>
      <ProgramarContent />
    </Suspense>
  );
}
