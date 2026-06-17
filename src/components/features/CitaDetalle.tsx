'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Cita } from '@/types/cita';
import StarRating from '../ui/StarRating';

interface CitaDetalleProps {
  cita: Cita;
  onClose: () => void;
  onUploadFoto: (citaId: string, file: File) => Promise<void>;
}

export default function CitaDetalle({ cita, onClose, onUploadFoto }: CitaDetalleProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [activeFotoIndex, setActiveFotoIndex] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Unificamos las fotos: priorizamos el array 'fotos', si no existe usamos 'fotoUrl'
  const listFotos = Array.isArray(cita.fotos) && cita.fotos.length > 0
    ? cita.fotos
    : (cita.fotoUrl ? [cita.fotoUrl] : []);

  // Asegura que el índice activo no quede fuera de rango si cambian las fotos
  useEffect(() => {
    if (activeFotoIndex >= listFotos.length && listFotos.length > 0) {
      setActiveFotoIndex(listFotos.length - 1);
    }
  }, [listFotos.length, activeFotoIndex]);

  // Cerrar modal al presionar Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Evitar scroll en el fondo al estar abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const totalFiles = files.length;
      for (let i = 0; i < totalFiles; i++) {
        setUploadProgress(`Subiendo foto ${i + 1} de ${totalFiles}...`);
        await onUploadFoto(cita.id, files[i]);
      }
      // Fijar la foto recién subida como activa
      setActiveFotoIndex(listFotos.length + totalFiles - 1);
    } catch (error) {
      console.error('Error al subir fotos en el detalle:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const hasFotos = listFotos.length > 0;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-surface border border-outline-variant/30 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col relative animate-slide-up"
      >
        {/* Botón de Cerrar */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            aria-label="Cerrar detalles"
            className="w-10 h-10 bg-surface-container-lowest/90 hover:bg-surface border border-outline-variant/20 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-all duration-200 shadow-sm active:scale-90 focus-ring-visible"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">close</span>
          </button>
        </div>

        {/* Portada / Héroe */}
        <div className="relative h-44 sm:h-56 w-full overflow-hidden shrink-0 bg-gradient-to-br from-primary-container/30 via-surface-container-low to-secondary-container/20">
          {hasFotos ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={listFotos[activeFotoIndex]}
                alt={cita.titulo}
                className="w-full h-full object-cover blur-[1px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-black/25"></div>
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
          )}
          
          <div className="absolute bottom-4 left-6 right-16">
            <span className="bg-secondary-container text-on-secondary-container font-label-sm text-xs px-3 py-1 rounded-full shadow-sm mb-2 inline-block">
              {cita.categoria}
            </span>
            <h2 id="modal-title" className="font-headline-md text-2xl sm:text-3xl text-on-surface drop-shadow-sm truncate">
              {cita.titulo}
            </h2>
          </div>
        </div>

        {/* Información Detallada */}
        <div className="p-6 sm:p-8 space-y-6 flex-grow">
          {/* Fila de Datos Básicos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-on-surface-variant/70 font-label-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-primary" aria-hidden="true">calendar_today</span>
                Fecha
              </span>
              <span className="font-bold text-on-surface">{cita.fecha || 'Sin fecha'}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-on-surface-variant/70 font-label-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-primary" aria-hidden="true">schedule</span>
                Hora
              </span>
              <span className="font-bold text-on-surface">{cita.hora || 'Por definir'}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-on-surface-variant/70 font-label-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-primary" aria-hidden="true">payments</span>
                Presupuesto
              </span>
              <span className="font-bold text-on-surface">
                {cita.costo === '$' ? 'Económico' : cita.costo === '$$' ? 'Medio' : 'Elevado'}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-on-surface-variant/70 font-label-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-primary" aria-hidden="true">hourglass_bottom</span>
                Duración
              </span>
              <span className="font-bold text-on-surface">{cita.duracion || 'Por definir'}</span>
            </div>
          </div>

          {/* Lugar y Calificación */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm border-b border-outline-variant/10 pb-4">
            <div className="flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-[20px] text-primary" aria-hidden="true">location_on</span>
              <span className="font-label-md font-bold">Lugar:</span>
              <span className="text-on-surface-variant">{cita.lugar}</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-[20px] text-primary" aria-hidden="true">star</span>
              <span className="font-label-md font-bold">Preferencia:</span>
              <StarRating rating={cita.puntuacion} size="sm" />
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <h4 className="font-label-md text-on-surface flex items-center gap-1 text-sm">
              <span className="material-symbols-outlined text-[18px] text-primary" aria-hidden="true">description</span>
              Descripción de la cita
            </h4>
            <p className="font-body-md text-on-surface-variant leading-relaxed text-sm bg-surface-container-low/40 p-4 rounded-xl border border-outline-variant/10">
              {cita.descripcion}
            </p>
          </div>

          {/* Notas */}
          {cita.notas && (
            <div className="space-y-2 border-l-4 border-primary/40 pl-4 py-1">
              <h4 className="font-label-md text-primary flex items-center gap-1 text-xs">
                <span className="material-symbols-outlined text-[16px]" aria-hidden="true">notes</span>
                Notas especiales:
              </h4>
              <p className="font-body-md italic text-on-surface-variant/90 text-sm leading-relaxed">
                &quot;{cita.notas}&quot;
              </p>
            </div>
          )}

          {/* SECCIÓN DE GALERÍA DE FOTOS MULTIPLES */}
          <div className="border-t border-outline-variant/30 pt-6 space-y-6">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
              id="foto-cita-upload-multi"
            />

            {hasFotos ? (
              /* Galería Polaroid Interactiva */
              <div className="flex flex-col items-center justify-center space-y-6">
                <h4 className="font-display-lg-mobile text-lg text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined">auto_awesome_motion</span>
                  Nuestros Recuerdos ({listFotos.length})
                </h4>

                {/* Polaroid Principal Grande */}
                <div className="bg-white p-4 pb-8 rounded-sm shadow-xl border border-neutral-200 max-w-[280px] sm:max-w-[320px] transform hover:scale-[1.01] transition-transform duration-300 relative">
                  
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 z-20 flex flex-col items-center justify-center text-white gap-2 rounded-sm p-4">
                      <span className="material-symbols-outlined animate-spin text-3xl">favorite</span>
                      <span className="font-label-sm text-[11px] animate-pulse text-center">{uploadProgress}</span>
                    </div>
                  )}

                  <div className="aspect-square w-full overflow-hidden bg-neutral-100 relative shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={listFotos[activeFotoIndex]}
                      alt="Recuerdo activo"
                      className="w-full h-full object-cover transition-all duration-300"
                    />
                  </div>
                  
                  <div className="mt-4 text-center font-literata text-neutral-800 text-sm sm:text-base leading-tight">
                    <p className="truncate px-2 font-bold">{cita.titulo}</p>
                    <p className="text-xs text-neutral-500 mt-1">{cita.fecha || 'Momento vivido'}</p>
                  </div>
                </div>

                {/* Fila de Miniaturas e Input para agregar más */}
                <div className="flex flex-wrap items-center justify-center gap-2 max-w-full">
                  {listFotos.map((foto, index) => {
                    const isActive = index === activeFotoIndex;
                    return (
                      <button
                        key={index}
                        onClick={() => setActiveFotoIndex(index)}
                        className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          isActive
                            ? 'border-primary ring-2 ring-primary-container scale-95 shadow-md'
                            : 'border-outline-variant/40 opacity-70 hover:opacity-100'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={foto} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    );
                  })}

                  {/* Botón rápido para subir más fotos */}
                  {!isUploading && (
                    <button
                      onClick={triggerFileSelect}
                      title="Agregar más fotos a esta cita"
                      className="w-14 h-14 rounded-lg border-2 border-dashed border-outline-variant/60 hover:border-primary flex items-center justify-center text-outline-variant hover:text-primary hover:bg-primary/5 transition-all cursor-pointer active:scale-95"
                    >
                      <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Carga Inicial de Fotos (Soporte Multiple) */
              <div className="bg-surface-container-lowest border border-dashed border-outline-variant/50 rounded-2xl p-6 text-center space-y-4 flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl" aria-hidden="true">photo_camera</span>
                </div>
                
                <div className="space-y-1 max-w-[320px]">
                  <h4 className="font-label-md text-on-surface">¿Ya vivieron este momento?</h4>
                  <p className="font-body-md text-on-surface-variant text-xs">
                    Sube una o varias fotos desde tu celular para convertir esta cita en un recuerdo inolvidable.
                  </p>
                </div>

                {isUploading ? (
                  <div className="flex flex-col items-center justify-center py-2 gap-2 text-primary">
                    <span className="material-symbols-outlined animate-spin text-3xl">favorite</span>
                    <span className="font-label-sm text-xs animate-pulse text-on-surface-variant">
                      {uploadProgress}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={triggerFileSelect}
                    type="button"
                    className="bg-primary text-on-primary font-label-md text-label-md rounded-full px-6 py-2.5 shadow-md hover:bg-surface-tint active:scale-95 transition-all duration-200 flex items-center gap-1.5 cursor-pointer focus-ring-visible"
                  >
                    <span className="material-symbols-outlined text-sm">upload</span>
                    Subir Fotos
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
