'use client';

import React, { useState } from 'react';
import { Cita } from '@/types/cita';
import CitaCard from '@/components/features/CitaCard';
import CitaForm from '@/components/features/CitaForm';

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

export default function Home() {
  const [citas, setCitas] = useState<Cita[]>(INITIAL_CITAS);
  const [editingCita, setEditingCita] = useState<Cita | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddOrUpdateCita = (formData: Omit<Cita, 'id'>) => {
    if (editingCita) {
      // Update existing
      setCitas((prev) =>
        prev.map((c) => (c.id === editingCita.id ? { ...formData, id: editingCita.id } : c))
      );
      setEditingCita(null);
    } else {
      // Create new
      const newCita: Cita = {
        ...formData,
        id: Date.now().toString(),
      };
      setCitas((prev) => [newCita, ...prev]);
    }
    setShowForm(false);
  };

  const handleEdit = (cita: Cita) => {
    setEditingCita(cita);
    setShowForm(true);
    // Scroll to form on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    setCitas((prev) => prev.filter((c) => c.id !== id));
    if (editingCita?.id === id) {
      setEditingCita(null);
      setShowForm(false);
    }
  };

  const handleCancel = () => {
    setEditingCita(null);
    setShowForm(false);
  };

  // Calculate stats
  const totalIdeas = citas.length;
  const ratingSum = citas.reduce((acc, curr) => acc + curr.puntuacion, 0);
  const averageRating = totalIdeas > 0 ? (ratingSum / totalIdeas).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-background flex flex-col font-jakarta">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-40 bg-background/95 backdrop-blur-md flex justify-between items-center px-margin-mobile h-16 border-b border-outline-variant/20">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full overflow-hidden bg-secondary-container border border-outline-variant/30 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Avatar de pareja"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
            />
          </div>
          <span className="font-label-md text-label-md text-on-surface-variant hidden sm:inline">Martín & Lucía</span>
        </div>
        <h1 className="font-headline-md text-headline-md text-primary tracking-tight absolute left-1/2 -translate-x-1/2">
          L&apos;Amour Moderne
        </h1>
        <button
          aria-label="notificaciones"
          className="text-primary hover:opacity-80 transition-opacity active:scale-95 flex items-center justify-center p-2"
        >
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="pt-24 pb-20 px-margin-mobile max-w-max-width mx-margin-desktop w-full flex-grow flex flex-col gap-md">
        
        {/* Welcome Section */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-sm mb-sm">
          <div>
            <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
              Bienvenido, Mi Amor.
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
              Aquí está tu resumen romántico para hoy.
            </p>
          </div>
          
          {/* Action button to toggle form */}
          {!showForm && (
            <button
              onClick={() => {
                setEditingCita(null);
                setShowForm(true);
              }}
              className="bg-primary text-on-primary rounded-full py-3 px-6 font-label-md text-label-md flex justify-center items-center gap-xs shadow-[0_4px_12px_rgba(183,16,42,0.3)] hover:shadow-[0_6px_16px_rgba(183,16,42,0.4)] hover:bg-surface-tint active:scale-[0.98] transition-all duration-200"
            >
              <span className="material-symbols-outlined">add</span>
              Agregar Nueva Cita
            </button>
          )}
        </header>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
          
          {/* Left Column: Form & Stats */}
          <div className={`lg:col-span-5 flex flex-col gap-md ${showForm ? 'block' : 'hidden lg:flex'}`}>
            
            {/* Stats Row */}
            <section className="grid grid-cols-2 gap-sm">
              <div className="bg-surface rounded-xl p-md flex flex-col justify-center items-center text-center shadow-[0_2px_12px_rgba(250,210,225,0.3)] border border-outline-variant/10 relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-secondary-container rounded-full opacity-35 blur-xl"></div>
                <span className="font-display-lg-mobile text-display-lg-mobile text-primary leading-none">
                  {totalIdeas.toString().padStart(2, '0')}
                </span>
                <span className="font-label-sm text-label-sm text-secondary mt-2 uppercase tracking-wide">
                  Citas Totales
                </span>
              </div>
              <div className="bg-surface rounded-xl p-md flex flex-col justify-center items-center text-center shadow-[0_2px_12px_rgba(250,210,225,0.3)] border border-outline-variant/10 relative overflow-hidden">
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-primary-container rounded-full opacity-20 blur-xl"></div>
                <span className="font-display-lg-mobile text-display-lg-mobile text-primary leading-none flex items-center justify-center">
                  {averageRating}
                  <span className="material-symbols-outlined text-sm ml-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </span>
                <span className="font-label-sm text-label-sm text-secondary mt-2 uppercase tracking-wide">
                  Puntaje Promedio
                </span>
              </div>
            </section>

            {/* CitaForm (Client-side handled) */}
            <CitaForm
              onSubmit={handleAddOrUpdateCita}
              initialData={editingCita}
              onCancel={showForm ? handleCancel : undefined}
            />
          </div>

          {/* Right Column: Grid of Cards */}
          <div className={`${showForm ? 'lg:col-span-7' : 'lg:col-span-12'} flex flex-col gap-md`}>
            
            <div className="flex items-center justify-between px-1">
              <h3 className="font-headline-md text-headline-md text-secondary">
                {showForm ? 'Tus Ideas de Cita' : 'Todas Nuestras Ideas de Citas'}
              </h3>
              <div className="text-on-surface-variant/60 text-xs font-label-sm">
                Mostrando {totalIdeas} {totalIdeas === 1 ? 'idea' : 'ideas'}
              </div>
            </div>

            {/* Cards Grid */}
            {citas.length === 0 ? (
              <div className="bg-surface rounded-2xl p-xl border border-dashed border-outline-variant/40 flex flex-col items-center justify-center text-center gap-md">
                <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">favorite_border</span>
                </div>
                <div>
                  <h4 className="font-label-md text-label-md text-on-surface mb-1">No hay citas registradas</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                    Comienza a planear momentos hermosos juntos agregando tu primera idea en el formulario.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingCita(null);
                    setShowForm(true);
                  }}
                  className="bg-primary text-on-primary rounded-full py-2.5 px-6 font-label-md text-label-md"
                >
                  Crear Primera Cita
                </button>
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 gap-md ${
                  showForm
                    ? 'sm:grid-cols-1 md:grid-cols-2'
                    : 'sm:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {citas.map((cita) => (
                  <CitaCard
                    key={cita.id}
                    cita={cita}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <footer className="fixed bottom-0 left-0 w-full z-40 rounded-t-xl bg-surface-container-low shadow-[0_-4px_12px_rgba(250,210,225,0.3)] flex justify-around items-center px-margin-mobile py-2 pb-6 md:hidden">
        <button className="flex flex-col items-center justify-center text-primary px-4 py-1 rounded-xl">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="font-label-sm text-[10px] mt-0.5">Dashboard</span>
        </button>
        <button
          onClick={() => {
            setEditingCita(null);
            setShowForm(true);
          }}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 rounded-xl"
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span className="font-label-sm text-[10px] mt-0.5">Nueva Cita</span>
        </button>
      </footer>
    </div>
  );
}
