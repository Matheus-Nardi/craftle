import React, { useRef } from 'react';
import { X, Share2 } from 'lucide-react';
import { PlayerStats } from '../types';
import { RECIPES } from '../constants';
import { useSwipe } from '../hooks/useSwipe';
import { shareStats } from '../utils/share';
import { tapFeedback } from '../utils/touchFeedback';

interface StatsModalProps {
  stats: PlayerStats;
  isOpen: boolean;
  onClose: () => void;
}

const StatsModal: React.FC<StatsModalProps> = ({ stats, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Swipe down para fechar
  const swipeHandlers = useSwipe({
    onSwipeDown: () => {
      tapFeedback();
      onClose();
    }
  });


  if (!isOpen) return null;

  const winRate = stats.totalGames > 0 
    ? ((stats.wins / stats.totalGames) * 100).toFixed(1) 
    : '0.0';

  const totalItems = RECIPES.length;
  const discoveredCount = stats.itemsDiscovered.size;
  const discoveryRate = totalItems > 0 
    ? ((discoveredCount / totalItems) * 100).toFixed(1) 
    : '0.0';

  const handleShare = async () => {
    tapFeedback();
    await shareStats({
      totalGames: stats.totalGames,
      wins: stats.wins,
      winStreak: stats.winStreak,
      bestStreak: stats.bestStreak
    });
  };

  const handleClose = () => {
    tapFeedback();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={handleClose}
    >
      <div 
        ref={modalRef}
        className="bg-[#C6C6C6] border-t-white border-l-white border-b-[#555] border-r-[#555] border-4 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl touch-pan-y"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={swipeHandlers.onTouchStart}
        onTouchMove={swipeHandlers.onTouchMove}
        onTouchEnd={swipeHandlers.onTouchEnd}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b-2 border-[#a0a0a0] sticky top-0 bg-[#C6C6C6] z-10">
          <h2 className="text-lg sm:text-xl font-bold text-[#3f3f3f]">Estatísticas</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 sm:p-2 bg-[#8b8b8b] border-2 border-b-white border-r-white border-t-[#373737] border-l-[#373737] hover:bg-[#a0a0a0] active:border-t-white active:border-l-white active:border-b-[#373737] active:border-r-[#373737] transition-all active:scale-95"
              aria-label="Compartilhar"
              title="Compartilhar Estatísticas"
            >
              <Share2 size={16} className="text-white" />
            </button>
            <button
              onClick={handleClose}
              className="p-1.5 sm:p-2 bg-[#8b8b8b] border-2 border-b-white border-r-white border-t-[#373737] border-l-[#373737] hover:bg-[#a0a0a0] active:border-t-white active:border-l-white active:border-b-[#373737] active:border-r-[#373737] transition-all active:scale-95"
              aria-label="Fechar"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
        </div>
        
        {/* Indicador de swipe (mobile) */}
        <div className="sm:hidden flex justify-center py-2 border-b border-[#a0a0a0]">
          <div className="w-12 h-1 bg-[#8b8b8b] rounded-full"></div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* Estatísticas Gerais */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-[#3f3f3f] border-b border-[#a0a0a0] pb-2">
              Geral
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div className="bg-[#8b8b8b] p-2 sm:p-3 border-2 border-b-white border-r-white border-t-[#373737] border-l-[#373737] active:scale-95 transition-transform">
                <div className="text-[10px] sm:text-xs text-gray-400 mb-1">Total de Jogos</div>
                <div className="text-xl sm:text-2xl font-bold text-white">{stats.totalGames}</div>
              </div>
              <div className="bg-[#8b8b8b] p-2 sm:p-3 border-2 border-b-white border-r-white border-t-[#373737] border-l-[#373737] active:scale-95 transition-transform">
                <div className="text-[10px] sm:text-xs text-gray-400 mb-1">Taxa de Vitória</div>
                <div className="text-xl sm:text-2xl font-bold text-white">{winRate}%</div>
              </div>
              <div className="bg-[#8b8b8b] p-2 sm:p-3 border-2 border-b-white border-r-white border-t-[#373737] border-l-[#373737] active:scale-95 transition-transform">
                <div className="text-[10px] sm:text-xs text-gray-400 mb-1">Vitórias</div>
                <div className="text-xl sm:text-2xl font-bold text-green-400">{stats.wins}</div>
              </div>
              <div className="bg-[#8b8b8b] p-2 sm:p-3 border-2 border-b-white border-r-white border-t-[#373737] border-l-[#373737] active:scale-95 transition-transform">
                <div className="text-[10px] sm:text-xs text-gray-400 mb-1">Derrotas</div>
                <div className="text-xl sm:text-2xl font-bold text-red-400">{stats.losses}</div>
              </div>
            </div>
          </div>

          {/* Streaks */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-[#3f3f3f] border-b border-[#a0a0a0] pb-2">
              Sequências
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div className="bg-[#8b8b8b] p-2 sm:p-3 border-2 border-b-white border-r-white border-t-[#373737] border-l-[#373737] active:scale-95 transition-transform">
                <div className="text-[10px] sm:text-xs text-gray-400 mb-1">Sequência Atual</div>
                <div className="text-xl sm:text-2xl font-bold text-yellow-400">{stats.winStreak}</div>
              </div>
              <div className="bg-[#8b8b8b] p-2 sm:p-3 border-2 border-b-white border-r-white border-t-[#373737] border-l-[#373737] active:scale-95 transition-transform">
                <div className="text-[10px] sm:text-xs text-gray-400 mb-1">Melhor Sequência</div>
                <div className="text-xl sm:text-2xl font-bold text-yellow-400">{stats.bestStreak}</div>
              </div>
            </div>
          </div>

          {/* Média de Tentativas */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-[#3f3f3f] border-b border-[#a0a0a0] pb-2">
              Desempenho
            </h3>
            <div className="bg-[#8b8b8b] p-2 sm:p-3 border-2 border-b-white border-r-white border-t-[#373737] border-l-[#373737] active:scale-95 transition-transform">
              <div className="text-[10px] sm:text-xs text-gray-400 mb-1">Média de Tentativas</div>
              <div className="text-xl sm:text-2xl font-bold text-white">
                {stats.averageGuesses > 0 ? stats.averageGuesses.toFixed(1) : '0.0'}
              </div>
            </div>
          </div>

          {/* Itens Descobertos */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-[#3f3f3f] border-b border-[#a0a0a0] pb-2">
              Itens Descobertos
            </h3>
            <div className="bg-[#8b8b8b] p-3 border-2 border-b-white border-r-white border-t-[#373737] border-l-[#373737]">
              <div className="text-xs text-gray-400 mb-2">
                {discoveredCount} de {totalItems} ({discoveryRate}%)
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {stats.itemsDiscovered.size === 0 ? (
                  <p className="text-white text-sm">Nenhum item descoberto ainda</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Array.from(stats.itemsDiscovered)
                      .sort()
                      .map((itemName) => (
                        <div
                          key={itemName}
                          className="bg-[#a0a0a0] px-2 py-1 text-xs text-white border border-[#373737]"
                        >
                          {itemName}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Última Jogada */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#3f3f3f] border-b border-[#a0a0a0] pb-2">
              Histórico
            </h3>
            <div className="bg-[#8b8b8b] p-3 border-2 border-b-white border-r-white border-t-[#373737] border-l-[#373737]">
              <div className="text-xs text-gray-400 mb-1">Última Jogada</div>
              <div className="text-sm text-white">
                {stats.lastPlayed.toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t-2 border-[#a0a0a0] flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-end sticky bottom-0 bg-[#C6C6C6]">
          <button
            onClick={handleShare}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-[#8b8b8b] text-white border-2 border-white hover:bg-[#a0a0a0] active:bg-[#a0a0a0] active:scale-95 text-xs sm:text-sm font-['Press_Start_2P'] transition-all flex items-center justify-center gap-2"
          >
            <Share2 size={14} />
            Compartilhar
          </button>
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-[#8b8b8b] text-white border-2 border-white hover:bg-[#a0a0a0] active:bg-[#a0a0a0] active:scale-95 text-xs sm:text-sm font-['Press_Start_2P'] transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;

