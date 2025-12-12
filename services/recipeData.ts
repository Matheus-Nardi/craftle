/**
 * Carrega dados de receitas pré-processados
 * Este arquivo substitui o uso direto do minecraft-data no navegador
 * 
 * Os dados são gerados automaticamente pelo script generate-recipes.ts
 * e importados do arquivo recipesData.generated.ts (solução 100% offline)
 */

import { recipesData, ProcessedRecipe } from './recipesData.generated';

/**
 * Busca uma receita processada pelo ID do item
 */
export const getProcessedRecipe = (itemId: string): ProcessedRecipe | null => {
  const recipe = (recipesData as ProcessedRecipe[]).find(r => r.itemId === itemId);
  return recipe || null;
};

/**
 * Retorna todas as receitas processadas
 */
export const getAllProcessedRecipes = (): ProcessedRecipe[] => {
  return recipesData as ProcessedRecipe[];
};

