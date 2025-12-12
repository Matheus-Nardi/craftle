/**
 * Script para pré-processar receitas do minecraft-data e gerar JSON estático
 * Este script roda em Node.js (tempo de build) e gera dados que podem ser usados no navegador
 */

import mcData from 'minecraft-data';
import { writeFileSync } from 'fs';
import { join } from 'path';

const MC_VERSION = '1.20.1';
const mc = mcData(MC_VERSION);

interface ProcessedRecipe {
  itemId: string;
  itemName: string;
  grid: Array<{
    slot: number;
    itemId: string | null;
    itemName: string | null;
  }>;
}

/**
 * Converte uma receita shaped para array linear
 */
const convertShapedRecipe = (inShape: any, itemsMap: Map<number, string>): Array<{ slot: number; itemId: string | null; itemName: string | null }> => {
  const grid: Array<{ slot: number; itemId: string | null; itemName: string | null }> = Array(9).fill(null).map((_, i) => ({ slot: i, itemId: null, itemName: null }));

  inShape.forEach((row: any, rowIndex: number) => {
    if (rowIndex >= 3) return;

    row.forEach((ingredientId: any, colIndex: number) => {
      if (colIndex >= 3) return;

      const id = Array.isArray(ingredientId) ? ingredientId[0] : ingredientId;
      
      if (id !== null && id !== undefined && typeof id === 'number') {
        const slotIndex = (rowIndex * 3) + colIndex;
        const itemName = itemsMap.get(id);
        if (itemName) {
          grid[slotIndex] = {
            slot: slotIndex,
            itemId: itemName,
            itemName: itemName
          };
        }
      }
    });
  });

  return grid;
};

/**
 * Converte uma receita shapeless para array linear
 */
const convertShapelessRecipe = (ingredients: any, itemsMap: Map<number, string>): Array<{ slot: number; itemId: string | null; itemName: string | null }> => {
  const grid: Array<{ slot: number; itemId: string | null; itemName: string | null }> = Array(9).fill(null).map((_, i) => ({ slot: i, itemId: null, itemName: null }));

  ingredients.forEach((ingredientId: any, index: number) => {
    if (index >= 9) return;

    const id = Array.isArray(ingredientId) ? ingredientId[0] : ingredientId;
    
    if (id !== null && id !== undefined && typeof id === 'number') {
      const itemName = itemsMap.get(id);
      if (itemName) {
        grid[index] = {
          slot: index,
          itemId: itemName,
          itemName: itemName
        };
      }
    }
  });

  return grid;
};

/**
 * Processa uma receita e retorna o grid processado
 */
const processRecipe = (itemId: string, itemsMap: Map<number, string>): ProcessedRecipe | null => {
  const targetItem = mc.itemsByName[itemId];
  if (!targetItem) {
    console.warn(`Item não encontrado: ${itemId}`);
    return null;
  }

  const recipes = mc.recipes[targetItem.id];
  if (!recipes || recipes.length === 0) {
    console.warn(`Nenhuma receita encontrada para: ${itemId}`);
    return null;
  }

  const recipe = recipes[0];
  let grid: Array<{ slot: number; itemId: string | null; itemName: string | null }>;

  if ('inShape' in recipe && recipe.inShape) {
    grid = convertShapedRecipe(recipe.inShape, itemsMap);
  } else if ('ingredients' in recipe && recipe.ingredients) {
    grid = convertShapelessRecipe(recipe.ingredients, itemsMap);
  } else {
    console.warn(`Formato de receita desconhecido para: ${itemId}`);
    return null;
  }

  return {
    itemId: itemId,
    itemName: targetItem.displayName || itemId,
    grid: grid
  };
};

/**
 * Gera o arquivo JSON com todas as receitas processadas
 */
const generateRecipesData = () => {
  console.log('Gerando dados de receitas...');

  // Cria mapa de ID numérico -> nome do item
  const itemsMap = new Map<number, string>();
  Object.values(mc.items).forEach((item: any) => {
    if (item.name) {
      itemsMap.set(item.id, item.name);
    }
  });

  // Lista de itens desejados (50 receitas mais famosas)
  const desiredRecipes = [
    // Ferramentas
    'diamond_sword', 'iron_sword', 'diamond_pickaxe', 'iron_pickaxe',
    'diamond_axe', 'iron_axe', 'diamond_shovel', 'iron_shovel',
    'diamond_hoe', 'iron_hoe',
    // Armaduras
    'diamond_helmet', 'diamond_chestplate', 'diamond_leggings', 'diamond_boots',
    'iron_helmet', 'iron_chestplate', 'iron_leggings', 'iron_boots',
    'leather_helmet', 'leather_chestplate', 'leather_leggings', 'leather_boots',
    // Armas e Combate
    'bow', 'arrow', 'shield', 'crossbow',
    // Itens Essenciais
    'torch', 'chest', 'crafting_table', 'furnace', 'white_bed', 'ladder',
    'oak_door', 'oak_trapdoor',
    // Redstone
    'lever', 'stone_button', 'stone_pressure_plate', 'redstone_torch', 'repeater', 'comparator',
    // Blocos de Construção
    'bricks', 'brick_stairs', 'oak_fence', 'oak_fence_gate', 'glass_pane', 'stone_bricks',
    // Transporte
    'oak_boat', 'minecart', 'rail', 'powered_rail',
    // Outros Úteis
    'flint_and_steel', 'bucket', 'compass', 'clock', 'map', 'lantern',
    'campfire', 'anvil'
  ];

  // Processa todas as receitas
  const processedRecipes: ProcessedRecipe[] = [];
  for (const itemId of desiredRecipes) {
    const recipe = processRecipe(itemId, itemsMap);
    if (recipe) {
      processedRecipes.push(recipe);
    }
  }

  // Salva o arquivo TypeScript (solução offline completa)
  const outputPath = join(process.cwd(), 'services', 'recipesData.generated.ts');
  const tsContent = `/**
 * Dados de receitas gerados automaticamente pelo script generate-recipes.ts
 * NÃO EDITAR MANUALMENTE - Este arquivo é gerado automaticamente
 * Para atualizar, execute: npm run generate-recipes
 */

export interface ProcessedRecipe {
  itemId: string;
  itemName: string;
  grid: Array<{
    slot: number;
    itemId: string | null;
    itemName: string | null;
  }>;
}

export const recipesData: ProcessedRecipe[] = ${JSON.stringify(processedRecipes, null, 2)} as ProcessedRecipe[];
`;
  
  writeFileSync(outputPath, tsContent, 'utf-8');

  // Também salva JSON para referência (opcional)
  const jsonPath = join(process.cwd(), 'src', 'data', 'recipes.json');
  writeFileSync(jsonPath, JSON.stringify(processedRecipes, null, 2), 'utf-8');

  console.log(`✅ ${processedRecipes.length} receitas processadas e salvas em:`);
  console.log(`   - ${outputPath} (TypeScript - usado pelo app)`);
  console.log(`   - ${jsonPath} (JSON - referência)`);
};

generateRecipesData();

