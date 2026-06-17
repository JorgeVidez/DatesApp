'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Cita } from '@/types/cita';
import StarRating from '../ui/StarRating';

interface CitaFormProps {
  onSubmit: (cita: Omit<Cita, 'id'>) => void;
  initialData?: Cita | null;
  onCancel?: () => void;
}

const IMAGE_PRESETS = [
  {
    name: 'Picnic',
    url: 'https://images.unsplash.com/photo-1526218626217-dc65a29bb444?auto=format&fit=crop&q=80&w=800',
    description: 'Picnic al atardecer en el parque',
  },
  {
    name: 'Cena',
    url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800',
    description: 'Cena a la luz de las velas',
  },
  {
    name: 'Cine',
    url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800',
    description: 'Cine bajo las estrellas o sala clásica',
  },
  {
    name: 'Cafetería',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800',
    description: 'Café de especialidad o bistró acogedor',
  },
  {
    name: 'Cultura',
    url: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&q=80&w=800',
    description: 'Galería de arte o museo',
  },
  {
    name: 'Música/Show',
    url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=800',
    description: 'Concierto o teatro en vivo',
  },
];

export default function CitaForm({ onSubmit, initialData, onCancel }: CitaFormProps) {
  const [titulo, setTitulo] = useState('');
  const [lugar, setLugar] = useState('');
  const [categoria, setCategoria] = useState('Gastronomía');
  const [descripcion, setDescripcion] = useState('');
  const [puntuacion, setPuntuacion] = useState(5);
  const [costo, setCosto] = useState<Cita['costo']>('$$');
  const [duracion, setDuracion] = useState('');
  const [imagenUrl, setImagenUrl] = useState(IMAGE_PRESETS[1].url);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [notas, setNotas] = useState('');
  const [isCustomImage, setIsCustomImage] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categoriesList = [
    { value: 'Gastronomía', label: 'Gastronomía 🍽️' },
    { value: 'Al Aire Libre', label: 'Al Aire Libre 🌳' },
    { value: 'Entretenimiento', label: 'Entretenimiento 🎬' },
    { value: 'Cultura', label: 'Cultura 🎨' },
    { value: 'Relajado', label: 'Relajado ☕' },
    { value: 'Aventura', label: 'Aventura 🎒' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (initialData) {
      setTitulo(initialData.titulo);
      setLugar(initialData.lugar);
      setCategoria(initialData.categoria);
      setDescripcion(initialData.descripcion);
      setPuntuacion(initialData.puntuacion);
      setCosto(initialData.costo);
      setDuracion(initialData.duracion || '');
      setImagenUrl(initialData.imagenUrl || '');
      setFecha(initialData.fecha || '');
      setHora(initialData.hora || '');
      setNotas(initialData.notas || '');

      const isPreset = IMAGE_PRESETS.some((preset) => preset.url === initialData.imagenUrl);
      setIsCustomImage(!isPreset && !!initialData.imagenUrl);
    }
  }, [initialData]);

  const handlePresetSelect = (url: string) => {
    setIsCustomImage(false);
    setImagenUrl(url);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !lugar || !descripcion) {
      alert('Por favor, completa los campos requeridos (Título, Lugar y Descripción).');
      return;
    }

    onSubmit({
      titulo,
      lugar,
      categoria,
      descripcion,
      puntuacion,
      costo,
      duracion: duracion || undefined,
      imagenUrl: imagenUrl || undefined,
      fecha: fecha || undefined,
      hora: hora || undefined,
      notas: notas || undefined,
    });

    if (!initialData) {
      setTitulo('');
      setLugar('');
      setCategoria('Gastronomía');
      setDescripcion('');
      setPuntuacion(5);
      setCosto('$$');
      setDuracion('');
      setImagenUrl(IMAGE_PRESETS[1].url);
      setFecha('');
      setHora('');
      setNotas('');
      setIsCustomImage(false);
    }
  };

  const inputClass =
    'w-full bg-gradient-to-b from-surface to-surface-container-lowest border border-outline-variant/60 rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-outline-variant/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm';

  const labelClass = 'block font-label-md text-label-md text-on-surface mb-2';

  return (
    <form
      onSubmit={handleFormSubmit}
      className="bg-surface rounded-2xl p-md md:p-lg border border-outline-variant/20 soft-shadow space-y-md max-w-2xl w-full mx-auto"
    >
      <div className="flex justify-between items-center pb-sm border-b border-secondary-container/30">
        <h3 className="font-headline-md text-headline-md text-primary">
          {initialData ? 'Editar Cita Romántica' : 'Registrar Nueva Cita'}
        </h3>
        <span className="material-symbols-outlined text-primary text-2xl" aria-hidden="true">favorite</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {/* Título */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="titulo" className={labelClass}>
            Título de la Cita *
          </label>
          <input
            id="titulo"
            type="text"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej. Tarde de Picnic en el Jardín Botánico"
            className={inputClass}
          />
        </div>

        {/* Lugar */}
        <div>
          <label htmlFor="lugar" className={labelClass}>
            Lugar *
          </label>
          <input
            id="lugar"
            type="text"
            required
            value={lugar}
            onChange={(e) => setLugar(e.target.value)}
            placeholder="Ej. Palermo Soho / Casa"
            className={inputClass}
          />
        </div>

        {/* Categoría */}
        <div className="relative" ref={dropdownRef}>
          <label className={labelClass}>
            Categoría *
          </label>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`${inputClass} flex items-center justify-between cursor-pointer`}
          >
            <span>{categoriesList.find(c => c.value === categoria)?.label || categoria}</span>
            <span className="material-symbols-outlined text-[18px] transition-transform duration-200" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
              keyboard_arrow_down
            </span>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-surface border border-outline-variant/60 rounded-xl shadow-lg z-30 max-h-60 overflow-y-auto py-1 animate-fade-in">
              {categoriesList.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => {
                    setCategoria(cat.value);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-2 hover:bg-secondary-container/30 text-on-surface ${
                    categoria === cat.value ? 'bg-secondary-container/50 font-bold text-primary' : ''
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Descripción */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="descripcion" className={labelClass}>
            Descripción *
          </label>
          <textarea
            id="descripcion"
            required
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe qué harán, qué comerán o qué hace especial esta idea de cita..."
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Calificación / Estrellas */}
        <div>
          <label className={labelClass}>Calificación / Preferencia</label>
          <div className="h-[46px] flex items-center bg-gradient-to-b from-surface to-surface-container-lowest border border-outline-variant/60 rounded-xl px-4 shadow-sm">
            <StarRating rating={puntuacion} onChange={setPuntuacion} size="md" />
          </div>
        </div>

        {/* Costo */}
        <div>
          <label className={labelClass}>Costo Estimado</label>
          <div className="grid grid-cols-3 gap-2 bg-gradient-to-b from-surface to-surface-container-lowest border border-outline-variant/60 rounded-xl p-1 shadow-sm">
            {(['$', '$$', '$$$'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setCosto(option)}
                className={`py-2 rounded-lg font-label-md text-label-md transition-all focus-ring-visible cursor-pointer ${
                  costo === option
                    ? 'bg-primary text-on-primary shadow-sm font-bold'
                    : 'text-on-surface-variant hover:bg-secondary-container/30'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Duración */}
        <div>
          <label htmlFor="duracion" className={labelClass}>
            Duración aproximada
          </label>
          <input
            id="duracion"
            type="text"
            value={duracion}
            onChange={(e) => setDuracion(e.target.value)}
            placeholder="Ej. Aprox. 2 horas / Todo el día"
            className={inputClass}
          />
        </div>

        {/* Fecha (Opcional) */}
        <div>
          <label htmlFor="fecha" className={labelClass}>
            Fecha sugerida / agendada
          </label>
          <input
            id="fecha"
            type="text"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            placeholder="Ej. Sáb, 24 Oct / 2026-06-15"
            className={inputClass}
          />
        </div>

        {/* Imagen de Portada */}
        <div className="col-span-1 md:col-span-2">
          <label className={labelClass}>Imagen Ilustrativa</label>
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setIsCustomImage(false)}
              className={`px-4 py-2 rounded-full font-label-sm text-label-sm transition-all focus-ring-visible ${
                !isCustomImage
                  ? 'bg-secondary-container text-on-secondary-container font-bold shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              Elegir de Galería
            </button>
            <button
              type="button"
              onClick={() => setIsCustomImage(true)}
              className={`px-4 py-2 rounded-full font-label-sm text-label-sm transition-all focus-ring-visible ${
                isCustomImage
                  ? 'bg-secondary-container text-on-secondary-container font-bold shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              Enlace personalizado
            </button>
          </div>

          {!isCustomImage ? (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {IMAGE_PRESETS.map((preset) => {
                const isSelected = imagenUrl === preset.url;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handlePresetSelect(preset.url)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all focus-ring-visible ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary-container scale-95'
                        : 'border-transparent hover:border-outline-variant opacity-80 hover:opacity-100'
                    }`}
                    title={preset.description}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white font-label-sm text-[10px] py-0.5 text-center truncate">
                      {preset.name}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <input
              type="url"
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
              placeholder="https://ejemplo.com/mi-imagen.jpg"
              className={inputClass}
            />
          )}
        </div>

        {/* Notas para tu Pareja */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="notas" className={labelClass}>
            Notas especiales (Vestimenta, sorpresas, reservación...)
          </label>
          <div className="relative group">
            <textarea
              id="notas"
              rows={2}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Ej. Llevar abrigo para la noche. La reservación está a nombre de Martín."
              className={`${inputClass} resize-none pr-10`}
            />
            <div className="absolute bottom-3 right-3 text-outline-variant/60 group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">edit_note</span>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-3 pt-md border-t border-secondary-container/30">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-full border border-outline font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low transition-all active:scale-[0.98] focus-ring-visible"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="bg-primary text-on-primary rounded-full py-3 px-8 font-label-md text-label-md flex items-center justify-center gap-xs shadow-[0_4px_12px_rgba(183,16,42,0.3)] hover:shadow-[0_6px_16px_rgba(183,16,42,0.4)] hover:bg-surface-tint active:scale-[0.98] transition-all duration-200 focus-ring-visible"
        >
          {initialData ? 'Guardar Cambios' : 'Agregar Cita'}
          <span className="material-symbols-outlined text-sm" aria-hidden="true">favorite</span>
        </button>
      </div>
    </form>
  );
}
