import React, { useState, useEffect } from 'react';
import { Box } from 'lucide-react'; // Ícone de fallback caso nada carregue

/**
 * Sistema de carregamento de imagens com múltiplos fallbacks para máxima estabilidade
 * 
 * Estratégia de fallback (em ordem de prioridade):
 * 1. PrismarineJS 1.17.1 (items/) - Versão mais estável e completa
 * 2. PrismarineJS 1.17.1 (blocks/) - Alguns itens estão em blocks
 * 3. PrismarineJS 1.19.1 (items/) - Versão alternativa
 * 4. PrismarineJS 1.19.1 (blocks/) - Fallback alternativo
 * 5. MCAssets CDN 1.20.1 (item/) - CDN confiável com estrutura diferente
 * 6. MCAssets CDN 1.20.1 (block/) - Fallback do CDN
 * 7. Minecraft Wiki - Mapeamento manual para itens conhecidos
 * 8. Ícone Lucide Box - Fallback visual final
 */

// Usando versões estáveis que têm todas as imagens garantidas
// Versões mais antigas são mais completas e estáveis
const MC_VERSION_STABLE = '1.17.1'; // Versão muito estável e completa (testada)
const MC_VERSION_ALT = '1.19.1'; // Versão alternativa
const MC_VERSION_LATEST = '1.20.1'; // Para mcasset.cloud

// URLs ordenadas por prioridade (mais confiável primeiro)
const BASE_URLS = [
  // Opção 1: Versão estável 1.17.1 (mais completa e testada)
  `https://raw.githubusercontent.com/PrismarineJS/minecraft-assets/master/data/${MC_VERSION_STABLE}`,
  // Opção 2: Versão alternativa 1.19.1
  `https://raw.githubusercontent.com/PrismarineJS/minecraft-assets/master/data/${MC_VERSION_ALT}`,
  // Opção 3: MCAssets CDN (espelho direto dos arquivos .jar - extremamente confiável)
  `https://assets.mcasset.cloud/${MC_VERSION_LATEST}/assets/minecraft/textures`,
];

// Mapeamento de IDs para nomes de arquivo do minecraft.wiki (fallback)
// Expandido para incluir todos os itens mais comuns do jogo
const WIKI_IMAGE_MAP: Record<string, string> = {
  // Ferramentas
  'diamond_sword': 'Invicon_Diamond_Sword.png',
  'iron_sword': 'Invicon_Iron_Sword.png',
  'diamond_pickaxe': 'Invicon_Diamond_Pickaxe.png',
  'iron_pickaxe': 'Invicon_Iron_Pickaxe.png',
  'diamond_axe': 'Invicon_Diamond_Axe.png',
  'iron_axe': 'Invicon_Iron_Axe.png',
  'diamond_shovel': 'Invicon_Diamond_Shovel.png',
  'iron_shovel': 'Invicon_Iron_Shovel.png',
  'diamond_hoe': 'Invicon_Diamond_Hoe.png',
  'iron_hoe': 'Invicon_Iron_Hoe.png',
  
  // Armaduras
  'diamond_helmet': 'Invicon_Diamond_Helmet.png',
  'diamond_chestplate': 'Invicon_Diamond_Chestplate.png',
  'diamond_leggings': 'Diamond_Leggings_JE2_BE2.png',
  'diamond_boots': 'Invicon_Diamond_Boots.png',
  'iron_helmet': 'Invicon_Iron_Helmet.png',
  'iron_chestplate': 'Invicon_Iron_Chestplate.png',
  'iron_leggings': 'Iron_Leggings_JE2_BE2.png',
  'iron_boots': 'Invicon_Iron_Boots.png',
  'leather_helmet': 'Invicon_Leather_Cap.png',
  'leather_chestplate': 'Leather_Tunic_JE4_BE2.png',
  'leather_leggings': 'Leather_Pants_JE2_BE2.png',
  'leather_boots': 'Invicon_Leather_Boots.png',
  
  // Armas e combate
  'bow': 'Bow_JE2_BE1.png',
  'arrow': 'Arrow_JE2_BE2.png',
  'shield': 'Shield_JE2_BE1.png',
  'crossbow': 'Crossbow_JE2_BE2.png',
  
  // Itens essenciais
  'torch': 'Torch.gif',
  'chest': 'Chest_%28S%29_JE1.png',
  'crafting_table': 'Crafting_Table_JE4_BE3.png',
  'furnace': 'Furnace_JE4_BE2.png',
  'white_bed': 'White_Bed_JE2_BE2.png',
  'ladder': 'Ladder_%28texture%29_JE3_BE2.png',
  'oak_door': 'Oak_Door_JE2_BE2.png',
  'oak_trapdoor': 'Oak_Trapdoor_JE2_BE2.png',
  
  // Redstone
  'lever': 'Powered_Wall_Lever_%28S%29_JE5-L3.png',
  'stone_button': 'Stone_Button_JE2_BE2.png',
  'stone_pressure_plate': 'Stone_Pressure_Plate_JE2_BE2.png',
  'redstone_torch': 'Redstone_Torch_JE2_BE2.png',
  'repeater': 'Redstone_Repeater_JE3_BE2.png',
  'comparator': 'Redstone_Comparator_JE2_BE2.png',
  
  // Blocos de construção
  'bricks': 'Bricks_JE3_BE2.png',
  'brick_stairs': 'Brick_Stairs_JE2_BE2.png',
  'oak_fence': 'Oak_Fence_JE2_BE2.png',
  'oak_fence_gate': 'Oak_Fence_Gate_JE2_BE2.png',
  'glass_pane': 'Glass_Pane_JE3_BE2.png',
  'stone_bricks': 'Stone_Bricks_JE3_BE2.png',
  
  // Transporte
  'oak_boat': 'Oak_Boat_JE2_BE2.png',
  'minecart': 'Minecart_JE3_BE2.png',
  'rail': 'Rail_JE2_BE2.png',
  'powered_rail': 'Powered_Rail_JE2_BE2.png',
  
  // Outros úteis
  'flint_and_steel': 'Flint_and_Steel_JE4_BE2.png',
  'bucket': 'Bucket_JE2_BE2.png',
  'compass': 'Compass_JE3_BE2.png',
  'clock': 'Clock_JE3_BE2.png',
  'map': 'Map_JE2_BE2.png',
  'lantern': 'Lantern_JE2_BE2.png',
  'campfire': 'Campfire_JE1_BE1.png',
  'anvil': 'Anvil_JE2_BE1.png',
  
  // Materiais comuns
  'diamond': 'Diamond_JE3_BE3.png',
  'stick': 'Stick_JE1_BE1.png',
  'oak_planks': 'Oak_Planks_JE6_BE3.png',
  'iron_ingot': 'Iron_Ingot_JE3_BE2.png',
  'coal': 'Coal_JE4_BE3.png',
  'string': 'String_JE2_BE2.png',
  'leather': 'Leather_JE2_BE2.png',
  'flint': 'Flint_JE3_BE3.png',
  'cobblestone': 'Cobblestone_JE5_BE3.png',
  'iron_block': 'Block_of_Iron_JE3_BE2.png',
  'diamond_block': 'Block_of_Diamond_JE2_BE2.png',
  'gold_ingot': 'Gold_Ingot_JE3_BE2.png',
  'redstone': 'Redstone_Dust_JE3_BE2.png',
  'wooden_planks': 'Oak_Planks_JE6_BE3.png',
};

const WIKI_BASE_URL = 'https://minecraft.wiki/images';

interface MinecraftIconProps {
  name: string; // O ID oficial, ex: 'diamond_sword' ou 'oak_planks'
  size?: number;
  alt?: string;
  className?: string;
}

export const MinecraftIcon: React.FC<MinecraftIconProps> = ({ 
  name, 
  size = 32, 
  alt,
  className = ''
}) => {
  const [imgSrc, setImgSrc] = useState<string>(() => {
    // Inicializa com a primeira URL (versão mais estável)
    return `${BASE_URLS[0]}/items/${name}.png`;
  });
  const [hasError, setHasError] = useState(false);
  const [currentBaseUrl, setCurrentBaseUrl] = useState(0);
  const [currentType, setCurrentType] = useState<'items' | 'blocks'>('items');
  const [triedWiki, setTriedWiki] = useState(false);

  // Atualiza quando name muda
  useEffect(() => {
    setCurrentBaseUrl(0);
    setCurrentType('items');
    setHasError(false);
    setTriedWiki(false);
    setImgSrc(`${BASE_URLS[0]}/items/${name}.png`);
  }, [name]);

  const handleError = () => {
    // Estratégia de fallback em cascata (ordem de prioridade):
    
    // 1. Se está usando PrismarineJS (URLs 0 ou 1), primeiro tenta trocar de items para blocks
    if (currentBaseUrl < 2 && currentType === 'items' && imgSrc.includes('/items/')) {
      setCurrentType('blocks');
      setImgSrc(`${BASE_URLS[currentBaseUrl]}/blocks/${name}.png`);
      return;
    }
    
    // 2. Se já tentou blocks no PrismarineJS, tenta próxima URL base
    if (currentBaseUrl < BASE_URLS.length - 1) {
      const nextUrl = currentBaseUrl + 1;
      setCurrentBaseUrl(nextUrl);
      setCurrentType('items');
      
      // mcasset.cloud (índice 2) usa estrutura diferente: /item/ ou /block/
      if (nextUrl === 2) {
        // mcasset.cloud estrutura: /item/nome.png ou /block/nome.png
        setImgSrc(`${BASE_URLS[nextUrl]}/item/${name}.png`);
      } else {
        // PrismarineJS usa /items/ ou /blocks/
        setImgSrc(`${BASE_URLS[nextUrl]}/items/${name}.png`);
      }
      return;
    }
    
    // 3. Se mcasset.cloud falhou em /item/, tenta /block/
    if (currentBaseUrl === 2 && currentType === 'items' && imgSrc.includes('/item/')) {
      setCurrentType('blocks');
      setImgSrc(`${BASE_URLS[2]}/block/${name}.png`);
      return;
    }
    
    // 4. Se todas as URLs do minecraft-assets e mcasset.cloud falharam, tenta minecraft.wiki
    if (!triedWiki && WIKI_IMAGE_MAP[name]) {
      setTriedWiki(true);
      setImgSrc(`${WIKI_BASE_URL}/${WIKI_IMAGE_MAP[name]}`);
      return;
    }
    
    // 5. Se tudo falhou, mostra fallback visual
    console.warn(`⚠️ Não foi possível carregar imagem para: ${name} após todas as tentativas`);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div 
        style={{ 
          width: size, 
          height: size, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: '#333', 
          borderRadius: 4 
        }}
        className={className}
      >
        <Box size={size * 0.6} color="#666" />
      </div>
    );
  }

  if (!imgSrc) {
    return (
      <div 
        style={{ 
          width: size, 
          height: size, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: '#333', 
          borderRadius: 4 
        }}
        className={className}
      >
        <Box size={size * 0.6} color="#666" />
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt || name}
      width={size}
      height={size}
      onError={handleError}
      onLoad={() => {
        // Debug: confirma que a imagem carregou
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ Imagem carregada: ${name} de ${imgSrc}`);
        }
      }}
      className={className}
      style={{ 
        imageRendering: 'pixelated' as const,
        maxWidth: '100%',
        height: 'auto',
        display: 'block'
      }}
    />
  );
};

