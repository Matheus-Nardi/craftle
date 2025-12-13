import { LucideIcon } from 'lucide-react';

export interface Item {
  id: string;
  name: string;
  // Visual representation
  color?: string; 
  icon?: LucideIcon;
  imageUrl?: string; // Prepared for sprite assets
}

export interface Recipe {
  id: string;
  output: Item;
  // Array of 9 positions (0-8) representing the 3x3 grid. 
  // null means empty slot.
  ingredients: (Item | null)[]; 
}

export type GameStatus = 'playing' | 'won' | 'lost';

export interface Guess {
  text: string;
  isCorrect: boolean;
}

export interface PlayerStats {
  totalGames: number;
  wins: number;
  losses: number;
  winStreak: number;
  bestStreak: number;
  averageGuesses: number;
  itemsDiscovered: Set<string>;
  lastPlayed: Date;
}