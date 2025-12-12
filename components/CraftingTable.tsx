import React from 'react';
import { Recipe } from '../types';
import MinecraftSlot from './MinecraftSlot';
import { ArrowRight } from 'lucide-react';

interface CraftingTableProps {
  recipe: Recipe;
  revealedIndices: Set<number>;
  isWon: boolean;
}

const CraftingTable: React.FC<CraftingTableProps> = ({ recipe, revealedIndices, isWon }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 p-4 w-full overflow-x-hidden">
      
      {/* Grid 3x3 */}
      <div className="relative p-2 bg-[#c6c6c6]">
         <div className="grid grid-cols-3 gap-1">
            {recipe.ingredients.map((item, index) => (
                <MinecraftSlot 
                    key={index} 
                    item={item} 
                    isRevealed={revealedIndices.has(index)} 
                />
            ))}
         </div>
      </div>

      {/* Arrow */}
      <div className="flex items-center justify-center">
        {/* Pixel Art Arrow attempt using CSS shapes or just a big icon */}
        <ArrowRight 
            size={60} 
            strokeWidth={4} 
            className="text-[#373737] hidden md:block"
        />
        <ArrowRight 
            size={40} 
            strokeWidth={4} 
            className="text-[#373737] md:hidden rotate-90 my-2"
        />
      </div>

      {/* Output Slot */}
      <div className="relative p-2">
         <MinecraftSlot 
            item={recipe.output} 
            isRevealed={isWon} 
            size="lg" 
            isResult={true}
         />
      </div>
    </div>
  );
};

export default CraftingTable;