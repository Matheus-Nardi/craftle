/**
 * Motor de receitas: converte dados pré-processados para o formato do jogo
 */

import { Item } from '../types';
import { getItemCustomization } from './itemRegistry';
import { getProcessedRecipe } from './recipeData';

/**
 * Cria um objeto Item completo a partir de um ID oficial do Minecraft
 */
export const createItem = (officialId: string): Item => {
  const customData = getItemCustomization(officialId);
  const processedRecipe = getProcessedRecipe(officialId);

  // Usa nome customizado em PT-BR, ou nome da receita processada, ou formata o ID
  const name = customData.name || processedRecipe?.itemName || officialId.replace(/_/g, ' ');

  return {
    id: officialId,
    name: name,
    color: customData.color || '#ffffff',
    // imageUrl não é mais necessário - o MinecraftIcon usa o id diretamente
    // Mantido como opcional para compatibilidade
    icon: customData.icon
  };
};

/**
 * Converte uma receita processada para array linear de 9 posições
 * @param processedGrid Grid processado com slots e itemIds
 * @returns Array de 9 posições (0-8) com Items ou null
 */
const convertProcessedGrid = (processedGrid: Array<{ slot: number; itemId: string | null; itemName: string | null }>): (Item | null)[] => {
  const grid: (Item | null)[] = Array(9).fill(null);

  processedGrid.forEach(({ slot, itemId }) => {
    if (itemId !== null && slot >= 0 && slot < 9) {
      grid[slot] = createItem(itemId);
    }
  });

  return grid;
};

/**
 * O ADAPTADOR: Transforma dados pré-processados no Grid de 9 posições
 * @param targetItemId ID oficial do item (ex: 'diamond_sword')
 * @returns Array de 9 posições (0-8) representando o grid de crafting
 */
export const getRecipeGrid = (targetItemId: string): (Item | null)[] => {
  const processedRecipe = getProcessedRecipe(targetItemId);
  
  if (!processedRecipe) {
    console.warn(`Receita não encontrada para: ${targetItemId}`);
    return Array(9).fill(null);
  }

  return convertProcessedGrid(processedRecipe.grid);
};

