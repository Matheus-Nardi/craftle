import { PlayerStats } from '../types';

const STATS_STORAGE_KEY = 'craftle_player_stats';

/**
 * Carrega as estatísticas do jogador do localStorage
 */
export const loadStats = (): PlayerStats => {
  const stored = localStorage.getItem(STATS_STORAGE_KEY);
  if (!stored) {
    return getDefaultStats();
  }

  try {
    const parsed = JSON.parse(stored);
    // Converte itemsDiscovered de array para Set
    return {
      ...parsed,
      itemsDiscovered: new Set(parsed.itemsDiscovered || []),
      lastPlayed: new Date(parsed.lastPlayed || Date.now())
    };
  } catch (e) {
    console.error('Erro ao carregar estatísticas:', e);
    return getDefaultStats();
  }
};

/**
 * Salva as estatísticas do jogador no localStorage
 */
export const saveStats = (stats: PlayerStats): void => {
  try {
    // Converte Set para array para serialização
    const serializable = {
      ...stats,
      itemsDiscovered: Array.from(stats.itemsDiscovered),
      lastPlayed: stats.lastPlayed.toISOString()
    };
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(serializable));
  } catch (e) {
    console.error('Erro ao salvar estatísticas:', e);
  }
};

/**
 * Retorna estatísticas padrão
 */
const getDefaultStats = (): PlayerStats => {
  return {
    totalGames: 0,
    wins: 0,
    losses: 0,
    winStreak: 0,
    bestStreak: 0,
    averageGuesses: 0,
    itemsDiscovered: new Set<string>(),
    lastPlayed: new Date()
  };
};

/**
 * Atualiza as estatísticas após um jogo
 */
export const updateStatsAfterGame = (
  won: boolean,
  guessesCount: number,
  itemName: string
): PlayerStats => {
  const stats = loadStats();
  
  // Atualiza total de jogos
  stats.totalGames += 1;
  
  // Atualiza vitórias/derrotas
  if (won) {
    stats.wins += 1;
    // Incrementa streak a cada vitória
    stats.winStreak += 1;
  } else {
    stats.losses += 1;
    // Reseta streak se perdeu
    stats.winStreak = 0;
  }
  
  // Atualiza melhor streak
  if (stats.winStreak > stats.bestStreak) {
    stats.bestStreak = stats.winStreak;
  }
  
  // Atualiza média de tentativas
  // Calcula a média considerando todos os jogos anteriores
  const totalGuesses = stats.averageGuesses * (stats.totalGames - 1) + guessesCount;
  stats.averageGuesses = totalGuesses / stats.totalGames;
  
  // Adiciona item descoberto (se ganhou)
  if (won) {
    stats.itemsDiscovered.add(itemName);
  }
  
  // Atualiza última vez jogada
  stats.lastPlayed = new Date();
  
  saveStats(stats);
  return stats;
};

/**
 * Reseta as estatísticas (útil para testes ou reset do jogador)
 */
export const resetStats = (): void => {
  localStorage.removeItem(STATS_STORAGE_KEY);
};

