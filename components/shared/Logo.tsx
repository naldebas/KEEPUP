import React from 'react';
import { cn } from '../../lib/utils';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn(className)}
    viewBox="0 0 160 32"
    height="32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="scale(0.65) translate(-2, -2)">
        {/* Three people icons */}
        <g fill="#1e293b">
            {/* Central person */}
            <circle cx="24" cy="9" r="5"/>
            <path d="M19 15 A 5 5 0 0 1 29 15 Z"/>
            {/* Left person */}
            <circle cx="12" cy="13" r="5"/>
            <path d="M7 19 A 5 5 0 0 1 17 19 Z"/>
            {/* Right person */}
            <circle cx="36" cy="13" r="5"/>
            <path d="M31 19 A 5 5 0 0 1 41 19 Z"/>
        </g>

        {/* Heart icon, transformed into position */}
        <g transform="translate(12, 22) scale(0.8)">
            <path fill="#f97316" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </g>

        {/* Hand icon cupping the heart */}
        <path fill="#1e293b" d="M15,38 C 15,45 33,45 33,38 C 30,38 27,41 24,41 C 21,41 18,38 15,38 Z"/>
    </g>

    <text
      x="40"
      y="23"
      fontFamily="Inter var, Inter, sans-serif"
      fontSize="20"
      fontWeight="800"
      fill="#f97316" /* orange-500 */
      letterSpacing="-0.5"
    >
      KEEPUP
    </text>
  </svg>
);
