/**
 * Utilitário para compartilhamento nativo usando Web Share API
 */

interface ShareData {
  title: string;
  text: string;
  url?: string;
}

/**
 * Verifica se o Web Share API está disponível
 */
export const canShare = (): boolean => {
  return typeof navigator !== 'undefined' && 'share' in navigator;
};

/**
 * Compartilha conteúdo usando Web Share API nativo
 * @param data Dados para compartilhar
 * @returns Promise que resolve quando o compartilhamento é concluído
 */
export const share = async (data: ShareData): Promise<void> => {
  if (!canShare()) {
    // Fallback: copia para clipboard
    const text = `${data.title}\n${data.text}${data.url ? `\n${data.url}` : ''}`;
    try {
      await navigator.clipboard.writeText(text);
      alert('Conteúdo copiado para a área de transferência!');
    } catch (e) {
      console.error('Erro ao copiar:', e);
    }
    return;
  }

  try {
    await navigator.share(data);
  } catch (e: any) {
    // Ignora erro se o usuário cancelar
    if (e.name !== 'AbortError') {
      console.error('Erro ao compartilhar:', e);
    }
  }
};

/**
 * Compartilha estatísticas do jogo
 */
export const shareStats = async (stats: {
  totalGames: number;
  wins: number;
  winStreak: number;
  bestStreak: number;
}): Promise<void> => {
  const winRate = stats.totalGames > 0 
    ? ((stats.wins / stats.totalGames) * 100).toFixed(1) 
    : '0.0';

  const text = `🎮 CRAFTLE - Minhas Estatísticas\n\n` +
    `📊 Total de Jogos: ${stats.totalGames}\n` +
    `🏆 Vitórias: ${stats.wins} (${winRate}%)\n` +
    `🔥 Sequência Atual: ${stats.winStreak}\n` +
    `⭐ Melhor Sequência: ${stats.bestStreak}\n\n` +
    `Jogue também: ${window.location.href}`;

  await share({
    title: 'CRAFTLE - Estatísticas',
    text: text,
    url: window.location.href
  });
};

/**
 * Compartilha resultado de uma vitória
 */
export const shareWin = async (guesses: number, itemName: string): Promise<void> => {
  const text = `🎉 CRAFTLE - Vitória!\n\n` +
    `✅ Adivinhei "${itemName}" em ${guesses} tentativa${guesses > 1 ? 's' : ''}!\n\n` +
    `Jogue também: ${window.location.href}`;

  await share({
    title: 'CRAFTLE - Vitória!',
    text: text,
    url: window.location.href
  });
};

