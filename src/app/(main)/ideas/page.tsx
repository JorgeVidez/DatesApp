'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCitas } from '@/context/CitasContext';
import { Cita } from '@/types/cita';
import CitaCard from '@/components/features/CitaCard';
import CitaForm from '@/components/features/CitaForm';

function IdeasContent() {
  const { citas, addCita, updateCita, deleteCita } = useCitas();
  const [editingCita, setEditingCita] = useState<Cita | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const searchParams = useSearchParams();
  const action = searchParams.get('action');

  // Trigger form opening if URL has action=new
  useEffect(() => {
    if (action === 'new') {
      setEditingCita(null);
      setShowForm(true);
    }
  }, [action]);

  const handleFormSubmit = (formData: Omit<Cita, 'id'>) => {
    if (editingCita) {
      updateCita({ ...formData, id: editingCita.id });
      setEditingCita(null);
    } else {
      addCita(formData);
    }
    setShowForm(false);
  };

  const handleEdit = (cita: Cita) => {
    setEditingCita(cita);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    deleteCita(id);
    if (editingCita?.id === id) {
      setEditingCita(null);
      setShowForm(false);
    }
  };

  const handleCancel = () => {
    setEditingCita(null);
    setShowForm(false);
  };

  // Get unique categories for filtering
  const categories = ['Todas', ...Array.from(new Set(citas.map((c) => c.categoria)))];

  // Filtered ideas
  const filteredCitas = selectedCategory === 'Todas'
    ? citas
    : citas.filter((c) => c.categoria === selectedCategory);

  return (
    <div className="flex flex-col gap-md">
      
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-sm pb-sm border-b border-outline-variant/20">
        <div>
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
            Nuestras Ideas de Citas
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
            Explora y agrega nuevas experiencias para compartir.
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => {
              setEditingCita(null);
              setShowForm(true);
            }}
            className="bg-primary text-on-primary rounded-full py-3 px-6 font-label-md text-label-md flex justify-center items-center gap-xs shadow-[0_4px_12px_rgba(183,16,42,0.3)] hover:shadow-[0_6px_16px_rgba(183,16,42,0.4)] hover:bg-surface-tint active:scale-[0.98] transition-all duration-200 shrink-0"
          >
            <span className="material-symbols-outlined">add</span>
            Agregar Nueva Idea
          </button>
        )}
      </header>

      {/* Grid Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
        
        {/* Left Column: Form (mounted when active) */}
        {showForm && (
          <div className="lg:col-span-5 flex flex-col gap-md">
            <CitaForm
              onSubmit={handleFormSubmit}
              initialData={editingCita}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Right Column: Listing */}
        <div className={`${showForm ? 'lg:col-span-7' : 'lg:col-span-12'} flex flex-col gap-md`}>
          
          {/* Category Filter row */}
          {!showForm && (
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 pt-1 border-b border-outline-variant/10">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full font-label-sm text-label-sm transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-primary text-on-primary shadow-sm font-bold'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-secondary-container/30'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}

          {/* Cards Grid */}
          {filteredCitas.length === 0 ? (
            <div className="bg-surface rounded-2xl p-xl border border-dashed border-outline-variant/40 flex flex-col items-center justify-center text-center gap-md py-16">
              <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">favorite_border</span>
              </div>
              <div>
                <h4 className="font-label-md text-label-md text-on-surface mb-1">
                  No hay citas en esta categoría
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                  Crea una nueva idea en esta categoría o explora otras secciones.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingCita(null);
                  setShowForm(true);
                }}
                className="bg-primary text-on-primary rounded-full py-2.5 px-6 font-label-md text-label-md"
              >
                Crear Cita
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
              {filteredCitas.map((cita) => (
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

    </div>
  );
}

export default function IdeasPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-20 text-primary">
        <span className="material-symbols-outlined animate-spin text-4xl">favorite</span>
      </div>
    }>
      <IdeasContent />
    </Suspense>
  );
}
