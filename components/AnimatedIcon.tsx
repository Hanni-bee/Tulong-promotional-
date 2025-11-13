"use client";

import { useState } from 'react';

interface AnimatedIconProps {
  emoji: string;
  animationType?: 'pulse' | 'bounce' | 'rotate' | 'shake' | 'glow' | 'float';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: string;
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({ 
  emoji, 
  animationType = 'pulse',
  size = 'md',
  className = '',
  color
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: 'text-3xl',
    md: 'text-4xl',
    lg: 'text-5xl',
    xl: 'text-6xl'
  };

  const animationClasses = {
    pulse: 'animate-pulse hover:animate-none hover:scale-125',
    bounce: 'hover:animate-bounce',
    rotate: 'hover:animate-spin',
    shake: 'hover:animate-pulse hover:rotate-12',
    glow: 'hover:drop-shadow-[0_0_15px_rgba(211,47,47,0.8)]',
    float: 'animate-[float_3s_ease-in-out_infinite] hover:scale-110'
  };

  return (
    <div
      className={`${sizeClasses[size]} ${animationClasses[animationType]} transition-all duration-300 cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        filter: isHovered && color ? `drop-shadow(0 0 10px ${color})` : 'none',
        transform: isHovered ? 'scale(1.2)' : 'scale(1)',
      }}
    >
      {emoji}
    </div>
  );
};

export default AnimatedIcon;


