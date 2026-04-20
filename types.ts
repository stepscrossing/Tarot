export interface TarotCard {
  id: string;
  nameEn: string;
  nameZh: string;
  type: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  number?: number;
  image: string; // Placeholder URL
}

export interface DrawResult {
  cardId: string;
  isReversed: boolean;
  position: number; // 0, 1, 2
}

export interface DeckCardState {
  id: string; // Unique ID for this instance in the deck (not just card definition ID)
  definitionId: string;
  isReversed: boolean;
  angle: number; // For circular layout
}

export interface Reading {
  id: string;
  sessionId: string;
  cards: DrawResult[];
  createdAt: string;
}
