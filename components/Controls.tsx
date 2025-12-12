import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Guess, GameStatus } from '../types';
import { CRAFTABLE_ITEMS } from '../constants';

interface ControlsProps {
  onGuess: (text: string) => void;
  guesses: Guess[];
  gameStatus: GameStatus;
  livesLeft: number;
  maxLives: number;
}

const Controls: React.FC<ControlsProps> = ({ onGuess, guesses, gameStatus, livesLeft, maxLives }) => {
  const [inputText, setInputText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Helper function to normalize strings (remove accents and convert to lowercase)
  const normalizeString = (str: string): string => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  };

  // Filter suggestions based on input and exclude already tried items
  const filteredSuggestions = useMemo(() => {
    const triedItems = new Set(guesses.map(g => normalizeString(g.text)));
    const availableItems = CRAFTABLE_ITEMS.filter(item => 
      !triedItems.has(normalizeString(item))
    );
    
    if (!inputText.trim()) return availableItems;
    const normalizedInput = normalizeString(inputText);
    return availableItems.filter(item => 
      normalizeString(item).includes(normalizedInput)
    );
  }, [inputText, guesses]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showSuggestions || filteredSuggestions.length === 0) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        const selected = filteredSuggestions[selectedIndex];
        setInputText(selected);
        setShowSuggestions(false);
        setSelectedIndex(-1);
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    if (showSuggestions) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [showSuggestions, filteredSuggestions, selectedIndex]);

  // Scroll selected suggestion into view
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    setShowSuggestions(true);
    setSelectedIndex(-1);
    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    // If a suggestion is selected, use it
    const finalText = selectedIndex >= 0 && filteredSuggestions[selectedIndex] 
      ? filteredSuggestions[selectedIndex] 
      : inputText;
    
    // Check if this answer was already tried
    const normalizedFinalText = normalizeString(finalText);
    const alreadyTried = guesses.some(guess => 
      normalizeString(guess.text) === normalizedFinalText
    );
    
    if (alreadyTried) {
      setErrorMessage('Você já tentou este item!');
      // Clear error after 3 seconds
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    onGuess(finalText);
    setInputText('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
    setErrorMessage('');
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    // Delay to allow click on suggestion
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(document.activeElement)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }, 200);
  };

  const isGameOver = gameStatus !== 'playing';

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-4 overflow-x-hidden">
      
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 w-full relative max-w-full">
        <div className="flex-1 relative">
          <div className="bg-[#8b8b8b] border-2 border-b-white border-r-white border-t-[#373737] border-l-[#373737] p-1">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              disabled={isGameOver}
              placeholder={isGameOver ? (gameStatus === 'won' ? "VOCÊ FABRICOU!" : "FIM DE JOGO") : "Qual é este item?"}
              className="w-full h-full bg-[#8b8b8b] text-white font-['Press_Start_2P'] p-3 focus:outline-none placeholder-gray-400 text-xs sm:text-sm md:text-base max-w-full"
              autoFocus
              list="craftable-items"
            />
          </div>
          
          {/* Autocomplete Suggestions */}
          {showSuggestions && !isGameOver && filteredSuggestions.length > 0 && (
            <div 
              ref={suggestionsRef}
              className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto bg-[#8b8b8b] border-2 border-b-white border-r-white border-t-[#373737] border-l-[#373737]"
              style={{ 
                scrollbarWidth: 'thin',
                scrollbarColor: '#c6c6c6 #8b8b8b'
              }}
            >
              {filteredSuggestions.map((suggestion, index) => (
                <div
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`
                    px-3 py-2 cursor-pointer font-['Press_Start_2P'] text-xs md:text-sm
                    ${index === selectedIndex 
                      ? 'bg-[#c6c6c6] text-[#202020]' 
                      : 'text-white hover:bg-[#a0a0a0]'
                    }
                  `}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
          
          {/* Datalist fallback for native browser autocomplete */}
          <datalist id="craftable-items">
            {CRAFTABLE_ITEMS.map(item => (
              <option key={item} value={item} />
            ))}
          </datalist>
          
          {/* Error Message */}
          {errorMessage && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-red-600 text-white text-xs font-['Press_Start_2P'] px-2 py-1 border-2 border-red-800 z-50">
              {errorMessage}
            </div>
          )}
        </div>
        <button
            type="submit"
            disabled={isGameOver || !inputText.trim() || !!errorMessage}
            className={`
                px-4 sm:px-6 py-3 
                font-['Press_Start_2P'] text-xs sm:text-sm whitespace-nowrap flex-shrink-0
                border-t-white border-l-white border-b-[#555] border-r-[#555] border-4
                active:border-t-[#555] active:border-l-[#555] active:border-b-white active:border-r-white
                ${isGameOver || errorMessage ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#c6c6c6] hover:bg-[#dcdcdc] text-[#202020]'}
            `}
        >
            Fabricar
        </button>
      </form>

      {/* Status Bar - Vidas com corações */}
      <div className="flex justify-center items-center gap-1 sm:gap-2 text-xs md:text-sm text-[#3f3f3f] mt-2">
         <span className="mr-2 hidden sm:inline">Vidas:</span>
         <div className="flex gap-1 items-center">
           {Array.from({ length: maxLives }).map((_, index) => {
             const isFull = index < livesLeft;
             return (
               <img
                 key={index}
                 src="/assets/hardcore-heart.png"
                 alt={isFull ? "Coração cheio" : "Coração vazio"}
                 className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200 ${
                   isFull 
                     ? 'opacity-100 brightness-100' 
                     : 'opacity-25 brightness-50 grayscale'
                 }`}
                 style={{ imageRendering: 'pixelated' as const }}
               />
             );
           })}
         </div>
      </div>

      {/* History */}
      <div className="mt-4 max-h-40 overflow-y-auto space-y-2 p-2 bg-[#00000020] border-2 border-[#373737]">
        {guesses.length === 0 && (
            <p className="text-gray-500 text-xs text-center py-2">Nenhuma tentativa ainda...</p>
        )}
        {[...guesses].reverse().map((g, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs md:text-sm">
                <span className={g.isCorrect ? 'text-green-700' : 'text-red-700'}>
                    {g.isCorrect ? '✔' : '✘'}
                </span>
                <span className="text-[#202020]">{g.text}</span>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Controls;