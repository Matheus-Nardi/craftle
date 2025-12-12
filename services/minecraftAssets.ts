/**
 * Serviço para gerenciar URLs de imagens dos itens do Minecraft
 * Usa minecraft-assets do PrismarineJS
 */

const MC_VERSION = '1.20.1';
const ASSET_BASE_URL = `https://raw.githubusercontent.com/PrismarineJS/minecraft-assets/master/data/${MC_VERSION}/items`;

/**
 * Retorna a URL da imagem baseada no ID padrão do Minecraft.
 * Ex: getIconUrl('diamond_sword') -> .../diamond_sword.png
 */
export const getIconUrl = (minecraftId: string): string => {
  return `${ASSET_BASE_URL}/${minecraftId}.png`;
};

