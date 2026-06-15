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
    <div className="flex items-center gap-0.5">
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
              onChange ? 'cursor-pointer focus:outline-none transition-transform hover:scale-110 active:scale-95' : 'cursor-default'
            } text-primary-container`}
            disabled={!onChange}
            aria-label={`Calificar con ${star} de ${maxStars} estrellas`}
          >
            <span
              className={`material-symbols-outlined ${getStarSizeClass()}`}
              style={{
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
