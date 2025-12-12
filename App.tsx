import React, { useState, useEffect, useCallback } from 'react';
import Confetti from 'react-confetti';
import { Recipe, GameStatus, Guess } from './types';
import { RECIPES } from './constants';
import CraftingTable from './components/CraftingTable';
import Controls from './components/Controls';
import { Github } from 'lucide-react';

// Main Container Styles to mimic Minecraft Window
const WINDOW_STYLE = "bg-[#C6C6C6] border-t-white border-l-white border-b-[#555] border-r-[#555] border-4 w-full max-w-3xl p-1 shadow-2xl relative";

// Helper functions for daily puzzle
const getTodayString = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
};

const getDailyRecipe = (dateString: string): Recipe => {
  // Gera um seed determinístico baseado na data
  let seed = 0;
  for (let i = 0; i < dateString.length; i++) {
    seed = ((seed << 5) - seed) + dateString.charCodeAt(i);
    seed = seed & seed; // Convert to 32bit integer
  }
  
  // Usa o seed para escolher uma receita determinística
  const recipeIndex = Math.abs(seed) % RECIPES.length;
  return RECIPES[recipeIndex];
};

const STORAGE_KEY = 'craftle_daily_game';

interface DailyGameState {
  date: string;
  recipeId: string;
  revealedIndices: number[];
  guesses: Guess[];
  gameStatus: GameStatus;
}

const App: React.FC = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  // const [todayString, setTodayString] = useState<string>(getTodayString()); // Comentado - sistema diário desabilitado

  // Função para iniciar um novo jogo
  const startNewGame = useCallback(() => {
    // Escolhe uma receita aleatória
    const randomRecipe = RECIPES[Math.floor(Math.random() * RECIPES.length)];
    setRecipe(randomRecipe);
    
    // Revela uma posição aleatória do grid (pode ser vazia ou com item)
    const allIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const startIndex = allIndices[Math.floor(Math.random() * allIndices.length)];
    
    setRevealedIndices(new Set([startIndex]));
    setGuesses([]);
    setGameStatus('playing');
  }, []);

  // Inicializa o jogo ao carregar
  useEffect(() => {
    startNewGame();
    
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [startNewGame]);

  // SISTEMA DIÁRIO COMENTADO - Permite jogar múltiplas vezes
  /*
  // Check if it's a new day and load/save game state
  useEffect(() => {
    const currentDate = getTodayString();
    setTodayString(currentDate);
    
    // Verifica se é um novo dia
    const savedState = localStorage.getItem(STORAGE_KEY);
    let gameState: DailyGameState | null = null;
    
    if (savedState) {
      try {
        gameState = JSON.parse(savedState);
      } catch (e) {
        console.error('Erro ao carregar estado salvo:', e);
      }
    }
    
    // Se é um novo dia ou não há estado salvo, cria novo jogo
    if (!gameState || gameState.date !== currentDate) {
      const dailyRecipe = getDailyRecipe(currentDate);
      setRecipe(dailyRecipe);
      
      // Gera seed determinístico para o índice inicial revelado (diferente do seed da receita)
      let seed = 0;
      const dateForSeed = currentDate + '_start';
      for (let i = 0; i < dateForSeed.length; i++) {
        seed = ((seed << 5) - seed) + dateForSeed.charCodeAt(i);
        seed = seed & seed;
      }
      
      // Revela uma posição aleatória do grid (pode ser vazia ou com item)
      // Isso não revela quantos ingredientes existem
      const allIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      const startIndex = allIndices[Math.abs(seed) % allIndices.length];
      
      setRevealedIndices(new Set([startIndex]));
      setGuesses([]);
      setGameStatus('playing');
      
      // Salva o novo estado
      const newState: DailyGameState = {
        date: currentDate,
        recipeId: dailyRecipe.id,
        revealedIndices: [startIndex],
        guesses: [],
        gameStatus: 'playing'
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } else {
      // Carrega o estado salvo do mesmo dia
      const savedRecipe = RECIPES.find(r => r.id === gameState!.recipeId);
      if (savedRecipe) {
        setRecipe(savedRecipe);
        setRevealedIndices(new Set(gameState!.revealedIndices));
        setGuesses(gameState!.guesses);
        setGameStatus(gameState!.gameStatus);
      }
    }
    
    // Verifica a cada minuto se mudou o dia
    const checkNewDay = setInterval(() => {
      const newDate = getTodayString();
      if (newDate !== currentDate) {
        window.location.reload(); // Recarrega a página quando muda o dia
      }
    }, 60000); // Verifica a cada minuto
    
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(checkNewDay);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Salva o estado do jogo sempre que mudar
  useEffect(() => {
    if (recipe) {
      const gameState: DailyGameState = {
        date: todayString,
        recipeId: recipe.id,
        revealedIndices: Array.from(revealedIndices),
        guesses: guesses,
        gameStatus: gameStatus
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }
  }, [recipe, revealedIndices, guesses, gameStatus, todayString]);
  */

  // Sistema de vidas fixo (padrão: 5 vidas)
  const MAX_LIVES = 5;
  const livesUsed = guesses.filter(g => !g.isCorrect).length;
  const livesLeft = MAX_LIVES - livesUsed;

  // Sistema de dicas: revela uma posição aleatória do grid (pode ser vazia ou com item)
  // Isso não revela quantos ingredientes existem
  const revealNextHint = (currentRevealed: Set<number>, currentRecipe: Recipe) => {
    // Todas as posições do grid (0-8), não apenas as ocupadas
    const allIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const hiddenIndices = allIndices.filter(i => !currentRevealed.has(i));
    
    if (hiddenIndices.length > 0) {
        // Revela uma posição aleatória (pode ser vazia ou com item)
        const nextIndex = hiddenIndices[Math.floor(Math.random() * hiddenIndices.length)];
        const newSet = new Set(currentRevealed);
        newSet.add(nextIndex);
        setRevealedIndices(newSet);
        return true; // revealed something
    }
    return false; // nothing left to reveal
  };

  // Helper function to normalize strings (remove accents and convert to lowercase)
  const normalizeString = (str: string): string => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  };

  const handleGuess = (text: string) => {
    if (!recipe || gameStatus !== 'playing') return;

    const normalizedGuess = normalizeString(text);
    const normalizedTarget = normalizeString(recipe.output.name);
    const isCorrect = normalizedGuess === normalizedTarget;

    const newGuess: Guess = { text, isCorrect };
    setGuesses(prev => [...prev, newGuess]);

    if (isCorrect) {
        setGameStatus('won');
    } else {
        // Wrong guess logic
        if (livesLeft <= 1) { // This was the last life
            setGameStatus('lost');
        } else {
            // Reveal hint (uma posição aleatória do grid)
            revealNextHint(revealedIndices, recipe);
        }
    }
  };

  if (!recipe) return <div className="min-h-screen bg-[#2e2e2e] flex items-center justify-center text-white">Carregando Chunks...</div>;

  return (
    <div className="min-h-screen bg-[#2e2e2e] flex flex-col items-center justify-center p-4 w-full overflow-x-hidden">
      {gameStatus === 'won' && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />}
      
      {/* Title */}
      <div className="mb-6 text-center w-full px-4">
        <h1 className="text-2xl sm:text-4xl text-white mb-2 drop-shadow-md flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
             <img 
               src="https://minecraft.wiki/images/thumb/Crafting_Table_JE4_BE3.png/150px-Crafting_Table_JE4_BE3.png?5767f" 
               alt="Bancada de Trabalho" 
               className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
               style={{ imageRendering: 'pixelated' as const }}
             />
             <span className="whitespace-nowrap">CRAFTLE</span>
             <img 
               src="https://minecraft.wiki/images/thumb/Crafting_Table_JE4_BE3.png/150px-Crafting_Table_JE4_BE3.png?5767f" 
               alt="Bancada de Trabalho" 
               className="w-6 h-6 sm:w-8 sm:h-8 scale-x-[-1] flex-shrink-0"
               style={{ imageRendering: 'pixelated' as const }}
             />
        </h1>
        <p className="text-[#aaaaaa] text-xs">Adivinhe o item pela receita</p>
        {/* <p className="text-[#666666] text-[8px] mt-1">Puzzle Diário • Um jogo por dia</p> */}
      </div>

      <div className={`${WINDOW_STYLE} w-full mx-4`}>
        {/* Window Header */}
        <div className="mb-4 text-[#3f3f3f] text-lg select-none pb-2 border-b-2 border-[#a0a0a0]">
            Bancada de Trabalho
        </div>

        <CraftingTable 
            recipe={recipe} 
            revealedIndices={revealedIndices} 
            isWon={gameStatus === 'won' || gameStatus === 'lost'} // Reveal result on loss too? Usually strictly on win or end.
        />

        <div className="my-6 border-b-2 border-white opacity-50"></div>

        <Controls 
            onGuess={handleGuess}
            guesses={guesses}
            gameStatus={gameStatus}
            livesLeft={livesLeft}
            maxLives={MAX_LIVES}
        />

        {/* Game Over / Win Message Overlay */}
        {gameStatus === 'lost' && (
            <div className="mt-4 text-center">
                <p className="text-red-600 mb-2">Você morreu!</p>
                <p className="text-sm text-[#3f3f3f]">Era um <span className="font-bold">{recipe.output.name}</span></p>
                <button 
                    onClick={startNewGame}
                    className="mt-4 px-4 py-2 bg-[#8b8b8b] text-white border-2 border-white hover:bg-[#a0a0a0] text-xs"
                >
                    Jogar Novamente
                </button>
                {/* <p className="text-xs text-[#3f3f3f] mt-2">Volte amanhã às 00:00 para um novo puzzle!</p> */}
            </div>
        )}
         {gameStatus === 'won' && (
            <div className="mt-4 text-center">
                <p className="text-green-600 mb-2">Parabéns! Você fabricou!</p>
                <button 
                    onClick={startNewGame}
                    className="mt-4 px-4 py-2 bg-[#8b8b8b] text-white border-2 border-white hover:bg-[#a0a0a0] text-xs"
                >
                    Fabricar Outro
                </button>
                {/* <p className="text-xs text-[#3f3f3f] mt-2">Volte amanhã às 00:00 para um novo puzzle!</p> */}
            </div>
        )}

      </div>
      
      <div className="mt-8 text-white/30 text-[10px] text-center max-w-md space-y-2 px-4 w-full">
        <p className="break-words">Minecraft é uma marca registrada da Mojang Synergies AB. Este é um projeto de fã.</p>
        <p className="flex items-center justify-center gap-2 flex-wrap">
          <span>Feito por</span> <span className="font-bold">Matheus Nardi</span>
          <a 
            href="https://github.com/Matheus-Nardi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center hover:text-white transition-colors flex-shrink-0"
            aria-label="GitHub de Matheus Nardi"
          >
            <Github size={12} />
          </a>
        </p>
      </div>
    </div>
  );
};

export default App;