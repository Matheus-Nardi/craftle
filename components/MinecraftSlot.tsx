import React, { useState } from 'react';
import { Item } from '../types';

interface MinecraftSlotProps {
  item: Item | null;
  isRevealed: boolean;
  size?: 'sm' | 'md' | 'lg';
  isResult?: boolean;
}

const MinecraftSlot: React.FC<MinecraftSlotProps> = ({ item, isRevealed, size = 'md', isResult = false }) => {
  const [imageError, setImageError] = useState(false);
  
  // Dimensions based on size
  const dimClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16 sm:w-20 sm:h-20',
    lg: 'w-24 h-24'
  }[size];

  // The specific Minecraft slot bevel style
  // Outer border: Bottom/Right = white, Top/Left = dark gray (inset look)
  // Actually MC slots have a darker background #8b8b8b with specific shadowing
  // Top/Left borders: #373737
  // Bottom/Right borders: #FFF
  
  return (
    <div 
      className={`
        ${dimClasses} 
        bg-[#8b8b8b] 
        relative 
        flex items-center justify-center
        border-t-[3px] border-l-[3px] border-b-[2px] border-r-[2px]
        border-t-[#373737] border-l-[#373737] border-b-white border-r-white
      `}
    >
      {/* Result slot often has no inner shadow or purely different logic, but consistent style looks best */}
      
      {isRevealed && item ? (
        <div className="animate-fade-in transition-opacity duration-500">
          {item.imageUrl && !imageError ? (
            <div className="relative group">
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-[85%] h-[85%] object-contain mx-auto"
                style={{
                  imageRendering: 'pixelated' as const
                }}
                onError={() => setImageError(true)}
              />
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 whitespace-nowrap">
                <div className="bg-[#100010] border-2 border-[#2f0664] text-white text-[10px] px-2 py-1 relative">
                  <span className='text-[#aaa]'>{item.name}</span>
                </div>
              </div>
            </div>
          ) : (
             <div className="relative group">
                {item.icon && (
                    <item.icon 
                        size={size === 'sm' ? 20 : size === 'lg' ? 48 : 40} 
                        color={item.color || 'white'} 
                        strokeWidth={2.5}
                        className="drop-shadow-md"
                    />
                )}
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 whitespace-nowrap">
                   <div className="bg-[#100010] border-2 border-[#2f0664] text-white text-[10px] px-2 py-1 relative">
                      <span className='text-[#aaa]'>{item.name}</span>
                   </div>
                </div>
             </div>
          )}
        </div>
      ) : isResult && !isRevealed ? (
          <span className="text-[#373737] text-4xl opacity-50">?</span>
      ) : null}
    </div>
  );
};

export default MinecraftSlot;