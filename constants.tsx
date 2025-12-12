import { Recipe, Item } from './types';
import { getRecipeGrid, createItem } from './services/recipeEngine';

/*
Posições no array:     Visualização no grid:
[0] [1] [2]      →     0  1  2
[3] [4] [5]      →     3  4  5
[6] [7] [8]      →     6  7  8
*/

/**
 * Lista de IDs oficiais dos itens que queremos incluir no jogo
 * 50 receitas mais famosas e úteis do Minecraft
 * Basta adicionar um novo ID aqui para incluir uma nova receita automaticamente
 */
const DESIRED_RECIPES: string[] = [
  // === FERRAMENTAS (Tools) ===
  'diamond_sword',        // Espada de Diamante
  'iron_sword',           // Espada de Ferro
  'diamond_pickaxe',      // Picareta de Diamante
  'iron_pickaxe',         // Picareta de Ferro
  'diamond_axe',          // Machado de Diamante
  'iron_axe',             // Machado de Ferro
  'diamond_shovel',       // Pá de Diamante
  'iron_shovel',          // Pá de Ferro
  'diamond_hoe',          // Enxada de Diamante
  'iron_hoe',             // Enxada de Ferro
  
  // === ARMADURAS (Armor) ===
  'diamond_helmet',       // Capacete de Diamante
  'diamond_chestplate',    // Peitoral de Diamante
  'diamond_leggings',     // Calças de Diamante
  'diamond_boots',         // Botas de Diamante
  'iron_helmet',          // Capacete de Ferro
  'iron_chestplate',       // Peitoral de Ferro
  'iron_leggings',        // Calças de Ferro
  'iron_boots',           // Botas de Ferro
  'leather_helmet',       // Capacete de Couro
  'leather_chestplate',    // Peitoral de Couro
  'leather_leggings',     // Calças de Couro
  'leather_boots',        // Botas de Couro
  
  // === ARMAS E COMBATE ===
  'bow',                  // Arco
  'arrow',                // Flecha
  'shield',               // Escudo
  'crossbow',             // Besta
  
  // === ITENS ESSENCIAIS ===
  'torch',                // Tocha
  'chest',                // Baú
  'crafting_table',       // Mesa de Trabalho
  'furnace',              // Forno
  'white_bed',            // Cama
  'ladder',               // Escada
  'oak_door',             // Porta
  'oak_trapdoor',         // Alçapão
  
  // === REDSTONE ===
  'lever',                // Alavanca
  'stone_button',          // Botão
  'stone_pressure_plate',  // Placa de Pressão
  'redstone_torch',       // Tocha de Redstone
  'repeater',             // Repetidor
  'comparator',           // Comparador
  
  // === BLOCO DE CONSTRUÇÃO ===
  'bricks',               // Tijolos
  'brick_stairs',         // Escadas de Tijolo
  'oak_fence',            // Cerca
  'oak_fence_gate',       // Portão de Cerca
  'glass_pane',           // Painel de Vidro
  'stone_bricks',         // Tijolos de Pedra
  
  // === TRANSPORTE ===
  'oak_boat',             // Barco
  'minecart',             // Carrinho
  'rail',                 // Trilho
  'powered_rail',         // Trilho com Energia
  
  // === OUTROS ÚTEIS ===
  'flint_and_steel',      // Pederneira
  'bucket',               // Balde
  'compass',              // Bússola
  'clock',                // Relógio
  'map',                  // Mapa
  'lantern',              // Lanterna
  'campfire',             // Fogueira
  'anvil',                // Bigorna
];

/**
 * Gera a lista de receitas dinamicamente usando minecraft-data
 * Cada receita é gerada automaticamente a partir do ID do item
 */
export const RECIPES: Recipe[] = DESIRED_RECIPES.map(itemId => {
  // Gera o grid de ingredientes dinamicamente
  const dynamicGrid = getRecipeGrid(itemId);
  
  // Cria o objeto do item resultado usando o serviço
  const outputItem: Item = createItem(itemId);
  
  return {
    id: `recipe_${itemId}`,
    output: outputItem,
    ingredients: dynamicGrid
  };
});

// Export all craftable item names for autocomplete
export const CRAFTABLE_ITEMS: string[] = RECIPES.map(recipe => recipe.output.name);

// Colors (mantidas para compatibilidade com outros componentes)
export const MC_BG_GRAY = '#C6C6C6';
export const MC_SLOT_BG = '#8B8B8B';
export const MC_TEXT_SHADOW = '2px 2px 0px #3f3f3f';
