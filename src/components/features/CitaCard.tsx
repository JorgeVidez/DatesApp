'use client';

import React from 'react';
import { Cita } from '@/types/cita';
import StarRating from '../ui/StarRating';

interface CitaCardProps {
  cita: Cita;
  onEdit?: (cita: Cita) => void;
  onDelete?: (id: string) => void;
  onSelect?: (cita: Cita) => void;
}

export default function CitaCard({ cita, onEdit, onDelete, onSelect }: CitaCardProps) {
  return (
    <article 
      onClick={() => onSelect?.(cita)}
      className="bg-surface rounded-xl overflow-hidden border border-outline-variant/20 custom-card-shadow transition-all duration-300 relative group cursor-pointer flex flex-col h-full focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
    >
      {/* Content Area */}
      <div className="p-sm flex flex-col gap-xs flex-grow justify-between">
        <div className="flex flex-col gap-xs">
          {/* Header Row: Category & Actions */}
          <div className="flex justify-between items-center gap-2 mb-1">
            <div className="inline-flex items-center w-fit bg-secondary-container text-on-secondary-container rounded-full px-3 py-1">
              <span className="font-label-sm text-label-sm">{cita.categoria}</span>
            </div>
            
            {/* Edit/Delete actions */}
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(cita);
                  }}
                  aria-label={`Editar cita: ${cita.titulo}`}
                  className="bg-surface-container-lowest border border-outline-variant/20 rounded-full p-2 text-on-surface-variant hover:text-primary hover:bg-surface transition-colors shadow-sm flex items-center justify-center active:scale-90 focus-ring-visible"
                >
                  <span className="material-symbols-outlined text-[16px]" aria-hidden="true">edit</span>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('¿Seguro que deseas eliminar esta cita?')) {
                      onDelete(cita.id);
                    }
                  }}
                  aria-label={`Eliminar cita: ${cita.titulo}`}
                  className="bg-surface-container-lowest border border-outline-variant/20 rounded-full p-2 text-on-surface-variant hover:text-error hover:bg-surface transition-colors shadow-sm flex items-center justify-center active:scale-90 focus-ring-visible"
                >
                  <span className="material-symbols-outlined text-[16px]" aria-hidden="true">delete</span>
                </button>
              )}
            </div>
          </div>

          {/* Title & Location/Stars */}
          <h3 className="font-label-md text-label-md text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
            {cita.titulo}
          </h3>

          <div className="flex items-center justify-between text-xs text-on-surface-variant/80">
            <div className="flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]" aria-hidden="true">location_on</span>
              <span className="truncate max-w-[120px]">{cita.lugar}</span>
            </div>
            <StarRating rating={cita.puntuacion} size="sm" />
          </div>

          {/* Description */}
          <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 leading-snug mt-1">
            {cita.descripcion}
          </p>

          {/* Notes if available */}
          {cita.notas && (
            <p className="font-body-md text-body-md italic text-primary/70 line-clamp-1 border-l-2 border-primary/20 pl-2 mt-1 text-xs">
              &quot;{cita.notas}&quot;
            </p>
          )}
        </div>

        {/* Footer chips */}
        <div className="flex justify-between items-center mt-sm pt-xs border-t border-secondary-container/30">
          <div className="flex gap-2">
            <span className="bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm px-2 py-0.5 rounded-full text-xs">
              {cita.costo}
            </span>
            {cita.duracion && (
              <span className="bg-surface-variant text-on-surface-variant font-label-sm text-label-sm px-2 py-0.5 rounded-full text-xs">
                {cita.duracion}
              </span>
            )}
          </div>
          {cita.fecha && (
            <span className="font-label-sm text-label-sm text-primary flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]" aria-hidden="true">calendar_today</span>
              {cita.fecha}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
