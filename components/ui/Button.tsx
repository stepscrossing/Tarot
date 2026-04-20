import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'retro';
}

export const Button: React.FC<ButtonProps> = ({ 
  className = '', 
  variant = 'primary', 
  children, 
  ...props 
}) => {
  // Removed font-serif to allow global font to take effect, or passed via className
  const baseStyles = "relative tracking-widest uppercase transition-all duration-300 transform disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "px-8 py-3 bg-gold text-background border border-gold hover:bg-gold-light hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] active:scale-95",
    outline: "px-8 py-3 bg-transparent text-gold border border-gold hover:bg-gold/10 active:scale-95",
    // Removed fixed padding/text size from retro variant base to allow override
    retro: "text-gold border border-gold/40 hover:border-gold hover:shadow-[0_0_50px_rgba(212,175,55,0.4)] active:scale-95 group overflow-hidden bg-black/20 backdrop-blur-sm"
  };

  if (variant === 'retro') {
    return (
      <button 
        className={`${baseStyles} ${variants.retro} ${className}`}
        {...props}
      >
        {/* Hover Fill Effect */}
        <span className="absolute inset-0 w-full h-full bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center ease-out z-0"></span>
        
        {/* Inner Border Frame */}
        <span className="absolute inset-1.5 border border-gold/30 group-hover:border-background/30 z-10 transition-colors duration-300"></span>

        {/* Decorative Corners */}
        <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-gold group-hover:border-background z-20 transition-colors duration-300"></span>
        <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-gold group-hover:border-background z-20 transition-colors duration-300"></span>
        <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-gold group-hover:border-background z-20 transition-colors duration-300"></span>
        <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-gold group-hover:border-background z-20 transition-colors duration-300"></span>
        
        {/* Content */}
        <span className="relative z-30 flex items-center justify-center gap-4 group-hover:text-background transition-colors duration-300">
          <span className="text-sm transform rotate-45 opacity-80">✦</span>
          {children}
          <span className="text-sm transform rotate-45 opacity-80">✦</span>
        </span>
      </button>
    );
  }

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};