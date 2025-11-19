
import React from 'react';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  textColor?: string;
  inverted?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  iconSize = 32, 
  textSize = "text-xl", 
  textColor = "text-slate-900",
  inverted = false 
}) => {
  // Professional geometric building + growth chart symbol
  // Primary Color: Indigo 600 (#4f46e5)
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex-shrink-0">
        <svg 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="transform transition-transform duration-300 hover:scale-105"
        >
          {/* Base Shape: Rounded Hexagon/Square container */}
          <rect 
            x="0" y="0" 
            width="40" height="40" 
            rx="12" 
            className={inverted ? "fill-white" : "fill-indigo-600"} 
          />
          
          {/* Icon: Stylized House/Arrow combination */}
          <path 
            d="M20 10L10 18V30H30V18L20 10Z" 
            className={inverted ? "fill-indigo-600" : "fill-white"}
            fillOpacity="0.9"
          />
          
          {/* Accent: Growth/check mark overlay */}
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M26 24L18 24L18 16L20 16L20 22L26 22V24Z" 
            className={inverted ? "fill-indigo-800" : "fill-indigo-200"}
          />
        </svg>
        
        {/* Optional: Subtle shine effect */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent rounded-r-xl pointer-events-none"></div>
      </div>

      <div className="flex flex-col justify-center">
        <span className={`font-bold tracking-tight leading-none ${textSize} ${textColor}`}>
          Lodgex
        </span>
        {iconSize > 24 && (
          <span className={`text-[10px] font-medium uppercase tracking-widest opacity-60 ${textColor}`}>
            CRM
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
