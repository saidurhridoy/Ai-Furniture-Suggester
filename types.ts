export interface FurnitureSuggestion {
  name: string;
  description: string;
  material: string;
  url: string;
  imageUrl: string;
}

export interface SuggestionCategory {
  category: string;
  suggestions: FurnitureSuggestion[];
}