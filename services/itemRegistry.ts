/**
 * Registro de mapeamento de IDs customizados para IDs oficiais do Minecraft
 * e customizações (nomes em português, cores)
 */

import { Item } from '../types';
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

/**
 * Mapeamento de IDs customizados para IDs oficiais do Minecraft
 */
export const ID_MAPPING: Record<string, string> = {
  'd_sword': 'diamond_sword',
  'd_pick': 'diamond_pickaxe',
  'w_shovel': 'wooden_shovel',
  'd_leggings': 'diamond_leggings',
  'i_leggings': 'iron_leggings',
  'escada_mao': 'ladder',
  'perdeneira': 'flint_and_steel',
  'bau': 'chest',
  'pedregulho': 'cobblestone',
  'alavanca': 'lever',
  'silex': 'flint',
  'iron': 'iron_ingot',
  'plank': 'oak_planks',
  'diamond': 'diamond',
  'stick': 'stick',
  'coal': 'coal',
  'string': 'string',
  'leather': 'leather',
  'torch': 'torch',
  'boots': 'iron_boots',
  'bow': 'bow',
  'shield': 'shield',
  'leather_tunic': 'leather_chestplate'
};

/**
 * Customizações de itens (nomes em português, cores, ícones)
 */
export const ITEM_CUSTOMIZATIONS: Record<string, Partial<Item>> = {
  'diamond_sword': { 
    name: 'Espada de Diamante', 
    color: '#00ffff',
    icon: Sword
  },
  'diamond_pickaxe': { 
    name: 'Picareta de Diamante', 
    color: '#00ffff',
    icon: Pickaxe
  },
  'wooden_shovel': { 
    name: 'Pá de Madeira', 
    color: '#d2b48c',
    icon: Shovel
  },
  'diamond': { 
    name: 'Diamante', 
    color: '#00ffff',
    icon: Gem
  },
  'stick': { 
    name: 'Graveto', 
    color: '#8b4513',
    icon: Slash
  },
  'oak_planks': { 
    name: 'Tábua de Carvalho', 
    color: '#d2b48c',
    icon: Box
  },
  'coal': { 
    name: 'Carvão', 
    color: '#333333',
    icon: Circle
  },
  'iron_ingot': { 
    name: 'Lingote de Ferro', 
    color: '#d8d8d8',
    icon: Hammer
  },
  'string': { 
    name: 'Linha', 
    color: '#ffffff',
    icon: Slash
  },
  'leather': { 
    name: 'Couro', 
    color: '#8b4513',
    icon: Circle
  },
  'torch': { 
    name: 'Tocha', 
    color: '#ffa500',
    icon: Flame
  },
  'iron_boots': { 
    name: 'Botas de Ferro', 
    color: '#d8d8d8',
    icon: Footprints
  },
  'bow': { 
    name: 'Arco', 
    color: '#8b4513',
    icon: Target
  },
  'diamond_leggings': { 
    name: 'Calças de Diamante', 
    color: '#00ffff',
    icon: Footprints
  },
  'iron_leggings': { 
    name: 'Calças de Ferro', 
    color: '#d8d8d8',
    icon: Footprints
  },
  'shield': { 
    name: 'Escudo', 
    color: '#8b4513',
    icon: Shield
  },
  'leather_chestplate': { 
    name: 'Túnica de Couro', 
    color: '#8b4513',
    icon: Shirt
  },
  'ladder': { 
    name: 'Escada de Mão', 
    color: '#8b4513'
  },
  'flint_and_steel': { 
    name: 'Pederneira', 
    color: '#8b4513',
    icon: Flame
  },
  'chest': { 
    name: 'Baú', 
    color: '#8b4513',
    icon: Box
  },
  'cobblestone': { 
    name: 'Pedregulho', 
    color: '#8b4513',
    icon: Circle
  },
  'lever': { 
    name: 'Alavanca', 
    color: '#8b4513'
  },
  'flint': { 
    name: 'Sílex', 
    color: '#8b4513',
    icon: Circle
  },
  // === NOVAS FERRAMENTAS ===
  'iron_sword': { 
    name: 'Espada de Ferro', 
    color: '#d8d8d8',
    icon: Sword
  },
  'iron_pickaxe': { 
    name: 'Picareta de Ferro', 
    color: '#d8d8d8',
    icon: Pickaxe
  },
  'diamond_axe': { 
    name: 'Machado de Diamante', 
    color: '#00ffff',
    icon: Pickaxe
  },
  'iron_axe': { 
    name: 'Machado de Ferro', 
    color: '#d8d8d8',
    icon: Pickaxe
  },
  'diamond_shovel': { 
    name: 'Pá de Diamante', 
    color: '#00ffff',
    icon: Shovel
  },
  'iron_shovel': { 
    name: 'Pá de Ferro', 
    color: '#d8d8d8',
    icon: Shovel
  },
  'diamond_hoe': { 
    name: 'Enxada de Diamante', 
    color: '#00ffff',
    icon: Pickaxe
  },
  'iron_hoe': { 
    name: 'Enxada de Ferro', 
    color: '#d8d8d8',
    icon: Pickaxe
  },
  // === ARMADURAS ===
  'diamond_helmet': { 
    name: 'Capacete de Diamante', 
    color: '#00ffff',
    icon: Shield
  },
  'diamond_chestplate': { 
    name: 'Peitoral de Diamante', 
    color: '#00ffff',
    icon: Shirt
  },
  'diamond_boots': { 
    name: 'Botas de Diamante', 
    color: '#00ffff',
    icon: Footprints
  },
  'iron_helmet': { 
    name: 'Capacete de Ferro', 
    color: '#d8d8d8',
    icon: Shield
  },
  'iron_chestplate': { 
    name: 'Peitoral de Ferro', 
    color: '#d8d8d8',
    icon: Shirt
  },
  'leather_helmet': { 
    name: 'Capacete de Couro', 
    color: '#8b4513',
    icon: Shield
  },
  'leather_leggings': { 
    name: 'Calças de Couro', 
    color: '#8b4513',
    icon: Footprints
  },
  'leather_boots': { 
    name: 'Botas de Couro', 
    color: '#8b4513',
    icon: Footprints
  },
  // === ARMAS E COMBATE ===
  'arrow': { 
    name: 'Flecha', 
    color: '#8b4513'
  },
  'crossbow': { 
    name: 'Besta', 
    color: '#8b4513',
    icon: Target
  },
  // === ITENS ESSENCIAIS ===
  'crafting_table': { 
    name: 'Mesa de Trabalho', 
    color: '#8b4513',
    icon: Box
  },
  'furnace': { 
    name: 'Forno', 
    color: '#8b4513',
    icon: Box
  },
  'white_bed': { 
    name: 'Cama', 
    color: '#ffffff',
    icon: Box
  },
  'oak_door': { 
    name: 'Porta', 
    color: '#8b4513'
  },
  'oak_trapdoor': { 
    name: 'Alçapão', 
    color: '#8b4513'
  },
  // === REDSTONE ===
  'stone_button': { 
    name: 'Botão de Pedra', 
    color: '#8b4513'
  },
  'stone_pressure_plate': { 
    name: 'Placa de Pressão', 
    color: '#8b4513'
  },
  'redstone_torch': { 
    name: 'Tocha de Redstone', 
    color: '#ff0000',
    icon: Flame
  },
  'repeater': { 
    name: 'Repetidor', 
    color: '#8b4513'
  },
  'comparator': { 
    name: 'Comparador', 
    color: '#8b4513'
  },
  // === BLOCO DE CONSTRUÇÃO ===
  'bricks': { 
    name: 'Tijolos', 
    color: '#8b4513',
    icon: Box
  },
  'brick_stairs': { 
    name: 'Escadas de Tijolo', 
    color: '#8b4513'
  },
  'oak_fence': { 
    name: 'Cerca', 
    color: '#8b4513'
  },
  'oak_fence_gate': { 
    name: 'Portão de Cerca', 
    color: '#8b4513'
  },
  'glass_pane': { 
    name: 'Painel de Vidro', 
    color: '#ffffff'
  },
  'stone_bricks': { 
    name: 'Tijolos de Pedra', 
    color: '#8b4513',
    icon: Box
  },
  // === TRANSPORTE ===
  'oak_boat': { 
    name: 'Barco', 
    color: '#8b4513'
  },
  'minecart': { 
    name: 'Carrinho', 
    color: '#d8d8d8',
    icon: Box
  },
  'rail': { 
    name: 'Trilho', 
    color: '#8b4513'
  },
  'powered_rail': { 
    name: 'Trilho com Energia', 
    color: '#8b4513'
  },
  // === OUTROS ÚTEIS ===
  'bucket': { 
    name: 'Balde', 
    color: '#d8d8d8',
    icon: Box
  },
  'compass': { 
    name: 'Bússola', 
    color: '#d8d8d8',
    icon: Circle
  },
  'clock': { 
    name: 'Relógio', 
    color: '#d8d8d8',
    icon: Circle
  },
  'map': { 
    name: 'Mapa', 
    color: '#8b4513',
    icon: Box
  },
  'lantern': { 
    name: 'Lanterna', 
    color: '#ffa500',
    icon: Flame
  },
  'campfire': { 
    name: 'Fogueira', 
    color: '#ffa500',
    icon: Flame
  },
  'anvil': { 
    name: 'Bigorna', 
    color: '#d8d8d8',
    icon: Hammer
  }
};

/**
 * Converte um ID customizado para o ID oficial do Minecraft
 */
export const getOfficialId = (customId: string): string => {
  return ID_MAPPING[customId] || customId;
};

/**
 * Obtém customizações para um item (nome PT-BR, cor, ícone)
 */
export const getItemCustomization = (officialId: string): Partial<Item> => {
  return ITEM_CUSTOMIZATIONS[officialId] || {};
};

