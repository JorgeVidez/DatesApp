'use client';

import React, { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({
  rating,
  onChange,
  maxStars = 5,
  size = 'md',
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const getStarSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'text-[16px]';
      case 'lg':
        return 'text-[28px]';
      case 'md':
      default:
        return 'text-[20px]';
    }
  };

  const handleStarClick = (starValue: number) => {
    if (onChange) {
      onChange(starValue);
    }
  };

  const stars = Array.from({ length: maxStars }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-2">
      {stars.map((star) => {
        const isFilled = hoverRating !== null ? star <= hoverRating : star <= rating;
        return (
          <button
            key={star}
            type={onChange ? 'button' : undefined}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => onChange && setHoverRating(star)}
            onMouseLeave={() => onChange && setHoverRating(null)}
            className={`${
              onChange 
                ? 'cursor-pointer focus-ring-visible p-2 -m-2 rounded-full transition-transform hover:scale-110 active:scale-90' 
                : 'cursor-default'
            } text-primary-container inline-flex items-center justify-center`}
            disabled={!onChange}
            aria-label={onChange ? `Calificar con ${star} de ${maxStars} estrellas` : undefined}
          >
            <span
              className="material-symbols-outlined"
              aria-hidden="true"
              style={{
                fontSize: size === 'sm' ? '16px' : size === 'lg' ? '28px' : '20px',
                fontVariationSettings: isFilled ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 400",
              }}
            >
              star
            </span>
          </button>
        );
      })}
    </div>
  );
}
