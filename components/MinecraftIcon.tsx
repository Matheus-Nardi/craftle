import React, { useState, useEffect } from 'react';
import { Box } from 'lucide-react'; // Ícone de fallback caso nada carregue

// Usando versão 1.19.1 que tem todas as imagens garantidas
// (99% dos itens não mudam visualmente entre patches)
const MC_VERSION = '1.19.1';
const MC_VERSION_LATEST = '1.20.1'; // Para mcasset.cloud

// URLs ordenadas por prioridade (mais confiável primeiro)
const BASE_URLS = [
  // Opção 1: Versão estável do PrismarineJS (recomendado)
  `https://raw.githubusercontent.com/PrismarineJS/minecraft-assets/master/data/${MC_VERSION}`,
  // Opção 2: MCAssets CDN (espelho direto dos arquivos .jar - extremamente confiável)
  `https://assets.mcasset.cloud/${MC_VERSION_LATEST}/assets/minecraft/textures`,
];

// Mapeamento de IDs para nomes de arquivo do minecraft.wiki (fallback)
const WIKI_IMAGE_MAP: Record<string, string> = {
  'diamond_sword': 'Invicon_Diamond_Sword.png',
  'diamond_pickaxe': 'Invicon_Diamond_Pickaxe.png',
  'diamond': 'Diamond_JE3_BE3.png',
  'stick': 'Stick_JE1_BE1.png',
  'torch': 'Torch.gif',
  'iron_boots': 'Invicon_Iron_Boots.png',
  'bow': 'Bow_JE2_BE1.png',
  'diamond_leggings': 'Diamond_Leggings_JE2_BE2.png',
  'iron_leggings': 'Iron_Leggings_JE2_BE2.png',
  'shield': 'Shield_JE2_BE1.png',
  'leather_chestplate': 'Leather_Tunic_JE4_BE2.png',
  'ladder': 'Ladder_%28texture%29_JE3_BE2.png',
  'flint_and_steel': 'Flint_and_Steel_JE4_BE2.png',
  'lever': 'Powered_Wall_Lever_%28S%29_JE5-L3.png',
  'chest': 'Chest_%28S%29_JE1.png',
  'oak_planks': 'Oak_Planks_JE6_BE3.png',
  'iron_ingot': 'Iron_Ingot_JE3_BE2.png',
  'coal': 'Coal_JE4_BE3.png',
  'string': 'String_JE2_BE2.png',
  'leather': 'Leather_JE2_BE2.png',
  'flint': 'Flint_JE3_BE3.png',
  'cobblestone': 'Cobblestone_JE5_BE3.png',
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
    // Inicializa com a primeira URL
    return `${BASE_URLS[0]}/items/${name}.png`;
  });
  const [hasError, setHasError] = useState(false);
  const [currentBaseUrl, setCurrentBaseUrl] = useState(0);
  const [currentType, setCurrentType] = useState<'items' | 'blocks'>('items');

  // Atualiza quando name muda
  useEffect(() => {
    setCurrentBaseUrl(0);
    setCurrentType('items');
    setHasError(false);
    setImgSrc(`${BASE_URLS[0]}/items/${name}.png`);
  }, [name]);

  const handleError = () => {
    // Se está usando PrismarineJS, primeiro tenta trocar de items para blocks
    if (currentBaseUrl === 0 && currentType === 'items' && imgSrc.includes('/items/')) {
      setCurrentType('blocks');
      setImgSrc(`${BASE_URLS[0]}/blocks/${name}.png`);
      return;
    }
    
    // Se já tentou blocks no PrismarineJS ou está na primeira URL, tenta próxima (mcasset.cloud)
    if (currentBaseUrl < BASE_URLS.length - 1) {
      const nextUrl = currentBaseUrl + 1;
      setCurrentBaseUrl(nextUrl);
      setCurrentType('items');
      
      // mcasset.cloud usa estrutura diferente: /item/ ou /block/
      if (nextUrl === 1) {
        // mcasset.cloud estrutura: /item/nome.png ou /block/nome.png
        setImgSrc(`${BASE_URLS[nextUrl]}/item/${name}.png`);
      } else {
        setImgSrc(`${BASE_URLS[nextUrl]}/items/${name}.png`);
      }
      return;
    }
    
    // Se mcasset.cloud falhou, tenta blocks também
    if (currentBaseUrl === 1 && currentType === 'items' && imgSrc.includes('/item/')) {
      setCurrentType('blocks');
      setImgSrc(`${BASE_URLS[1]}/block/${name}.png`);
      return;
    }
    
    // Se todas as URLs do minecraft-assets e mcasset.cloud falharam, tenta minecraft.wiki
    if (WIKI_IMAGE_MAP[name]) {
      setImgSrc(`${WIKI_BASE_URL}/${WIKI_IMAGE_MAP[name]}`);
      return;
    }
    
    // Se tudo falhou, mostra fallback
    console.warn(`Não foi possível carregar imagem para: ${name}`);
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

