import { Recipe, Item } from './types';
import { 
  Sword, 
  Pickaxe, 
  Shovel, 
  Gem, 
  Slash, 
  Box, 
  Flame, 
  Circle,
  Footprints,
  Hammer,
  Target,
  Shield,
  Shirt
} from 'lucide-react';

/*
Posições no array:     Visualização no grid:
[0] [1] [2]      →     0  1  2
[3] [4] [5]      →     3  4  5
[6] [7] [8]      →     6  7  8

*/


/**
 * Helper function to get Minecraft sprite URL
 * Padrão identificado: https://minecraft.wiki/images/{ItemName}_JE{version}_BE{version}.png?{hash}
 * 
 * Exemplos:
 * - Coal: https://minecraft.wiki/images/Coal_JE4_BE3.png?165e9
 * - Stick: https://minecraft.wiki/images/Stick_JE1_BE1.png?1fc15
 * - Diamond: https://minecraft.wiki/images/Diamond_JE3_BE3.png?99d00
 * - Iron Ingot: https://minecraft.wiki/images/Iron_Ingot_JE3_BE2.png?849cb
 */
const getSpriteUrl = (itemId: string, itemName?: string): string => {
  const baseUrl = 'https://minecraft.wiki/images';
  
  // Mapeamento de IDs para URLs diretas ou nomes de arquivo e versões
  // Para sprites Invicon, usar URL direta
  const spriteMap: Record<string, string | { fileName: string; jeVersion: string; beVersion: string }> = {
    'diamond': { fileName: 'Diamond', jeVersion: 'JE3', beVersion: 'BE3' },
    'stick': { fileName: 'Stick', jeVersion: 'JE1', beVersion: 'BE1' },
    'plank': { fileName: 'Oak_Planks', jeVersion: 'JE6', beVersion: 'BE3' },
    'coal': { fileName: 'Coal', jeVersion: 'JE4', beVersion: 'BE3' },
    'iron': { fileName: 'Iron_Ingot', jeVersion: 'JE3', beVersion: 'BE2' },
    'd_sword': 'https://minecraft.wiki/images/Invicon_Diamond_Leggings.png?b4750',
    'd_pick': { fileName: 'Diamond_Pickaxe', jeVersion: 'JE3', beVersion: 'BE3' },
    'w_shovel': { fileName: 'Wooden_Shovel', jeVersion: 'JE2', beVersion: 'BE2' },
    'torch': 'https://minecraft.wiki/images/thumb/Torch.gif/150px-Torch.gif?8e1d4',
    'boots': 'https://minecraft.wiki/images/Invicon_Iron_Boots.png?caf88',
    'string': 'https://minecraft.wiki/images/thumb/String_JE2_BE2.png/120px-String_JE2_BE2.png?25d69',
    'bow': 'https://minecraft.wiki/images/Bow_JE2_BE1.png?c428a',
    'd_leggings': 'https://minecraft.wiki/images/thumb/Diamond_Leggings_JE2_BE2.png/160px-Diamond_Leggings_JE2_BE2.png?a2414',
    'i_leggings': 'https://minecraft.wiki/images/thumb/Iron_Boots_JE2_BE2.png/160px-Iron_Boots_JE2_BE2.png?1b360',
    'shield': 'https://minecraft.wiki/images/thumb/Shield_JE2_BE1.png/160px-Shield_JE2_BE1.png?4837d',
    'leather': 'https://minecraft.wiki/images/Leather_JE2_BE2.png?10fae',
    'leather_tunic': 'https://minecraft.wiki/images/thumb/Leather_Tunic_JE4_BE2.png/160px-Leather_Tunic_JE4_BE2.png?a872d',
    'escada_mao': 'https://minecraft.wiki/images/thumb/Ladder_%28texture%29_JE3_BE2.png/150px-Ladder_%28texture%29_JE3_BE2.png?57138',
    'silex': 'https://minecraft.wiki/images/Flint_JE3_BE3.png?d10d1',
    'perdeneira': 'https://minecraft.wiki/images/Flint_and_Steel_JE4_BE2.png?1aaaf',
    'pedregulho': 'https://minecraft.wiki/images/Cobblestone_JE5_BE3.png?29624',
    'alavanca': 'https://minecraft.wiki/images/thumb/Powered_Wall_Lever_%28S%29_JE5-L3.png/150px-Powered_Wall_Lever_%28S%29_JE5-L3.png?6d95a',
    'bau': 'https://minecraft.wiki/images/thumb/Chest_%28S%29_JE1.png/120px-Chest_%28S%29_JE1.png?0bbed'
  };
  
  const sprite = spriteMap[itemId];
  if (!sprite) {
    // Fallback: tenta gerar o nome do arquivo a partir do nome do item
    if (itemName) {
      const fileName = itemName.replace(/\s+/g, '_');
      // Versões padrão (mais comuns)
      return `${baseUrl}/${fileName}_JE3_BE3.png`;
    }
    return '';
  }
  
  // Se for uma string (URL direta), retorna ela
  if (typeof sprite === 'string') {
    return sprite;
  }
  
  // Gera URL no padrão: https://minecraft.wiki/images/{FileName}_{JEVersion}_{BEVersion}.png
  return `${baseUrl}/${sprite.fileName}_${sprite.jeVersion}_${sprite.beVersion}.png`;
};

// --- Items ---

const DIAMOND: Item = { 
  id: 'diamond', 
  name: 'Diamante', 
  color: '#00ffff', 
  icon: Gem,
  imageUrl: getSpriteUrl('diamond', 'Diamond')
};

const STICK: Item = { 
  id: 'stick', 
  name: 'Graveto', 
  color: '#8b4513', 
  icon: Slash,
  imageUrl: getSpriteUrl('stick', 'Stick')
};

const WOOD_PLANK: Item = { 
  id: 'plank', 
  name: 'Tábua de Carvalho', 
  color: '#d2b48c', 
  icon: Box,
  imageUrl: getSpriteUrl('plank', 'Oak Plank')
};

const COAL: Item = { 
  id: 'coal', 
  name: 'Carvão', 
  color: '#333333', 
  icon: Circle,
  imageUrl: getSpriteUrl('coal', 'Coal')
};

const IRON_INGOT: Item = { 
  id: 'iron', 
  name: 'Lingote de Ferro', 
  color: '#d8d8d8', 
  icon: Hammer,
  imageUrl: getSpriteUrl('iron', 'Iron Ingot')
};

const STRING: Item = { 
  id: 'string', 
  name: 'Linha', 
  color: '#ffffff', 
  icon: Slash,
  imageUrl: getSpriteUrl('string', 'String')
};

const LEATHER: Item = { 
  id: 'leather', 
  name: 'Couro', 
  color: '#8b4513', 
  icon: Circle,
  imageUrl: getSpriteUrl('leather', 'Leather')
};

const SILEX: Item = {
  id: 'silx',
  name: 'Sílex',
  color: '#8b4513',
  icon: Circle,
  imageUrl: getSpriteUrl('silex', 'Silx')
}

const PEDREGULHO: Item = {
  id: 'pedregulho',
  name: 'Pedregulho',
  color: '#8b4513',
  icon: Circle,
  imageUrl: getSpriteUrl('pedregulho', 'Pedregulho')
};

// --- Outputs ---

const DIAMOND_SWORD_ITEM: Item = { 
  id: 'd_sword', 
  name: 'Espada de Diamante', 
  color: '#00ffff', 
  icon: Sword,
  imageUrl: getSpriteUrl('d_sword', 'Diamond Sword')
};

const DIAMOND_PICKAXE_ITEM: Item = { 
  id: 'd_pick', 
  name: 'Picareta de Diamante', 
  color: '#00ffff', 
  icon: Pickaxe,
  imageUrl: getSpriteUrl('d_pick', 'Diamond Pickaxe')
};

const WOODEN_SHOVEL_ITEM: Item = { 
  id: 'w_shovel', 
  name: 'Pá de Madeira', 
  color: '#d2b48c', 
  icon: Shovel,
  imageUrl: getSpriteUrl('w_shovel', 'Wooden Shovel')
};

const TORCH_ITEM: Item = { 
  id: 'torch', 
  name: 'Tocha', 
  color: '#ffa500', 
  icon: Flame,
  imageUrl: getSpriteUrl('torch', 'Torch')
};

const BOOTS_ITEM: Item = { 
  id: 'boots', 
  name: 'Botas de Ferro', 
  color: '#d8d8d8', 
  icon: Footprints,
  imageUrl: getSpriteUrl('boots', 'Iron Boots')
};

const BOW_ITEM: Item = { 
  id: 'bow', 
  name: 'Arco', 
  color: '#8b4513', 
  icon: Target,
  imageUrl: getSpriteUrl('bow', 'Bow')
};

const DIAMOND_LEGGINGS_ITEM: Item = { 
  id: 'd_leggings', 
  name: 'Calças de Diamante', 
  color: '#00ffff', 
  icon: Footprints,
  imageUrl: getSpriteUrl('d_leggings', 'Diamond Leggings')
};

const IRON_LEGGINGS_ITEM: Item = { 
  id: 'i_leggings', 
  name: 'Calças de Ferro', 
  color: '#d8d8d8', 
  icon: Footprints,
  imageUrl: getSpriteUrl('i_leggings', 'Iron Leggings')
};

const SHIELD_ITEM: Item = { 
  id: 'shield', 
  name: 'Escudo', 
  color: '#8b4513', 
  icon: Shield,
  imageUrl: getSpriteUrl('shield', 'Shield')
};

const LEATHER_TUNIC_ITEM: Item = { 
  id: 'leather_tunic', 
  name: 'Túnica de Couro', 
  color: '#8b4513', 
  icon: Shirt,
  imageUrl: getSpriteUrl('leather_tunic', 'Leather Tunic')
};

const ESCADA_MAO_ITEM: Item = { 
  id: 'escada_mao', 
  name: 'Escada de Mão', 
  color: '#8b4513', 
  icon: '',
  imageUrl: getSpriteUrl('escada_mao', 'Escada de Mão')
};

const PERDENEIRA: Item = {
  id: 'perdeneira',
  name: 'Perdeneira',
  color: '#8b4513',
  icon: Flame,
  imageUrl: getSpriteUrl('perdeneira', 'Perdeneira')
};

const ALAVANCA: Item = {
  id: 'alavanca',
  name: 'Alavanca',
  color: '#8b4513',
  icon: '',
  imageUrl: getSpriteUrl('alavanca', 'Alavanca')
};

const BAU: Item = {
  id: 'bau',
  name: 'Baú',
  color: '#8b4513',
  icon: Box,
  imageUrl: getSpriteUrl('bau', 'Baú')
};



// --- Recipes ---

// Helper to create empty grid
const emptyGrid = (): (Item | null)[] => Array(9).fill(null);

// Recipe 1: Diamond Sword
// . D .
// . D .
// . S .
const r1Grid = emptyGrid();
r1Grid[1] = DIAMOND;
r1Grid[4] = DIAMOND;
r1Grid[7] = STICK;

const RECIPE_SWORD: Recipe = {
  id: 'recipe_sword',
  output: DIAMOND_SWORD_ITEM,
  ingredients: r1Grid
};

// Recipe 2: Torch
// . C . (Coal usually on top of stick)
// . S .
const r2Grid = emptyGrid();
r2Grid[4] = COAL;
r2Grid[7] = STICK;

const RECIPE_TORCH: Recipe = {
  id: 'recipe_torch',
  output: TORCH_ITEM,
  ingredients: r2Grid
};

// Recipe 3: Diamond Pickaxe
// D D D
// . S .
// . S .
const r3Grid = emptyGrid();
r3Grid[0] = DIAMOND;
r3Grid[1] = DIAMOND;
r3Grid[2] = DIAMOND;
r3Grid[4] = STICK;
r3Grid[7] = STICK;

const RECIPE_PICKAXE: Recipe = {
  id: 'recipe_pickaxe',
  output: DIAMOND_PICKAXE_ITEM,
  ingredients: r3Grid
};

// Recipe 4: Iron Boots
// I . I
// I . I
const r4Grid = emptyGrid();
r4Grid[0] = IRON_INGOT;
r4Grid[2] = IRON_INGOT;
r4Grid[3] = IRON_INGOT;
r4Grid[5] = IRON_INGOT;

const RECIPE_BOOTS: Recipe = {
  id: 'recipe_boots',
  output: BOOTS_ITEM,
  ingredients: r4Grid
};

// Recipe 5: Bow
// . S S
// S . S
// . S S
// 3 gravetos na diagonal (topo centro, meio esquerda, baixo centro)
// 3 linhas na coluna direita (topo, meio, baixo)
const r5Grid = emptyGrid();
r5Grid[1] = STICK;  // topo centro (Graveto)
r5Grid[2] = STRING; // topo direita (Linha)
r5Grid[3] = STICK;  // meio esquerda (Graveto)
r5Grid[5] = STRING; // meio direita (Linha)
r5Grid[7] = STICK;  // baixo centro (Graveto)
r5Grid[8] = STRING; // baixo direita (Linha)

const RECIPE_BOW: Recipe = {
  id: 'recipe_bow',
  output: BOW_ITEM,
  ingredients: r5Grid
};

// Recipe 6: Diamond Leggings
// D D D
// D . D
// D . D
const r6Grid = emptyGrid();
r6Grid[0] = DIAMOND;
r6Grid[1] = DIAMOND;
r6Grid[2] = DIAMOND;
r6Grid[3] = DIAMOND;
r6Grid[5] = DIAMOND;
r6Grid[6] = DIAMOND;
r6Grid[8] = DIAMOND;

const RECIPE_DIAMOND_LEGGINGS: Recipe = {
  id: 'recipe_d_leggings',
  output: DIAMOND_LEGGINGS_ITEM,
  ingredients: r6Grid
};

// Recipe 7: Iron Leggings
// I I I
// I . I
// I . I
const r7Grid = emptyGrid();
r7Grid[0] = IRON_INGOT;
r7Grid[1] = IRON_INGOT;
r7Grid[2] = IRON_INGOT;
r7Grid[3] = IRON_INGOT;
r7Grid[5] = IRON_INGOT;
r7Grid[6] = IRON_INGOT;
r7Grid[8] = IRON_INGOT;

const RECIPE_IRON_LEGGINGS: Recipe = {
  id: 'recipe_i_leggings',
  output: IRON_LEGGINGS_ITEM,
  ingredients: r7Grid
};

// Recipe 8: Shield
// P I P
// P P P
// . P .
// Onde P = Tábua, I = Lingote de Ferro
const r8Grid = emptyGrid();
r8Grid[0] = WOOD_PLANK;  // P (topo esquerda)
r8Grid[1] = IRON_INGOT;  // I (topo centro)
r8Grid[2] = WOOD_PLANK;  // P (topo direita)
r8Grid[3] = WOOD_PLANK;  // P (meio esquerda)
r8Grid[4] = WOOD_PLANK;  // P (meio centro)
r8Grid[5] = WOOD_PLANK;  // P (meio direita)
r8Grid[7] = WOOD_PLANK;  // P (baixo centro)

const RECIPE_SHIELD: Recipe = {
  id: 'recipe_shield',
  output: SHIELD_ITEM,
  ingredients: r8Grid
};

// Recipe 9: Leather Tunic
// L . L
// L L L
// L L L
const r9Grid = emptyGrid();
r9Grid[0] = LEATHER;
r9Grid[2] = LEATHER;
r9Grid[3] = LEATHER;
r9Grid[4] = LEATHER;
r9Grid[5] = LEATHER;
r9Grid[6] = LEATHER;
r9Grid[7] = LEATHER;
r9Grid[8] = LEATHER;

const RECIPE_LEATHER_TUNIC: Recipe = {
  id: 'recipe_leather_tunic',
  output: LEATHER_TUNIC_ITEM,
  ingredients: r9Grid
};

// Recipe 10: Escada de mao
// S . S
// S S S
// S . S
const r10Grid = emptyGrid();
r10Grid[0] = STICK;
r10Grid[2] = STICK;
r10Grid[3] = STICK;
r10Grid[4] = STICK;
r10Grid[5] = STICK;
r10Grid[6] = STICK;
r10Grid[8] = STICK;



const RECIPE_ESCADAMAO: Recipe = {
  id: 'recipe_escada_mao',
  output: ESCADA_MAO_ITEM,
  ingredients: r10Grid
};

const r11Grid = emptyGrid();
r11Grid[3] = IRON_INGOT
r11Grid[4] = SILEX

const RECIPE_PERDENEIRA: Recipe = {
  id: 'recipe_perdeneira',
  output: PERDENEIRA,
  ingredients: r11Grid
};

const r12Grid = emptyGrid();
r12Grid[4] = STICK;
r12Grid[7] = PEDREGULHO;

const RECIPE_ALAVANCA: Recipe = {
  id: 'recipe_alavanca',
  output: ALAVANCA,
  ingredients: r12Grid
};

const r13Grid = emptyGrid();
r13Grid[0] = WOOD_PLANK;
r13Grid[1] = WOOD_PLANK;
r13Grid[2] = WOOD_PLANK;
r13Grid[3] = WOOD_PLANK;
r13Grid[5] = WOOD_PLANK;
r13Grid[6] = WOOD_PLANK;
r13Grid[7] = WOOD_PLANK;
r13Grid[8] = WOOD_PLANK;

const RECIPE_BAU: Recipe = {
  id: 'recipe_bau',
  output: BAU,
  ingredients: r13Grid
};

export const RECIPES: Recipe[] = [
  RECIPE_SWORD, 
  RECIPE_TORCH, 
  RECIPE_PICKAXE, 
  RECIPE_BOOTS,
  RECIPE_BOW,
  RECIPE_DIAMOND_LEGGINGS,
  RECIPE_IRON_LEGGINGS,
  RECIPE_SHIELD,
  RECIPE_LEATHER_TUNIC,
  RECIPE_ESCADAMAO,
  RECIPE_PERDENEIRA,
  RECIPE_ALAVANCA,
  RECIPE_BAU
];

// Export all craftable item names for autocomplete
export const CRAFTABLE_ITEMS: string[] = RECIPES.map(recipe => recipe.output.name);

/**
 * Função auxiliar para gerar URL de sprite do Minecraft baseada no padrão identificado
 * 
 * Padrão: https://minecraft.wiki/images/{ItemName}_JE{version}_BE{version}.png
 * 
 * @param itemName - Nome do item (ex: "Diamond", "Iron Ingot")
 * @param jeVersion - Versão Java Edition (padrão: "JE3")
 * @param beVersion - Versão Bedrock Edition (padrão: "BE3")
 * @returns URL completa do sprite
 * 
 * @example
 * generateSpriteUrl("Diamond") // https://minecraft.wiki/images/Diamond_JE3_BE3.png
 * generateSpriteUrl("Iron Ingot", "JE3", "BE2") // https://minecraft.wiki/images/Iron_Ingot_JE3_BE2.png
 */
export const generateSpriteUrl = (
  itemName: string, 
  jeVersion: string = 'JE3', 
  beVersion: string = 'BE3'
): string => {
  const baseUrl = 'https://minecraft.wiki/images';
  // Converte espaços em underscores e mantém a capitalização
  const fileName = itemName.replace(/\s+/g, '_');
  return `${baseUrl}/${fileName}_${jeVersion}_${beVersion}.png`;
};

// Colors
export const MC_BG_GRAY = '#C6C6C6';
export const MC_SLOT_BG = '#8B8B8B';
export const MC_TEXT_SHADOW = '2px 2px 0px #3f3f3f';
