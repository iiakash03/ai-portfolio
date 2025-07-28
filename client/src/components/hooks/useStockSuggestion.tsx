import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import axios from 'axios';

interface StockMatch {
  '1. symbol': string;
  '2. name': string;
  '3. type': string;
  '4. region': string;
  '5. marketOpen': string;
  '6. marketClose': string;
  '7. timezone': string;
  '8. currency': string;
  '9. matchScore': string;
}

interface Suggestion {
  symbol: string;
  name: string;
}

export function useStockSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuggestions = useDebouncedCallback(async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${import.meta.env.VITE_ALPHA_VANTAGE_API_KEY}`
      );
      
      const matches = response.data.bestMatches || [];
      setSuggestions(
        matches.map((match:StockMatch) => ({
          symbol: match['1. symbol'],
          name: match['2. name']
        }))
      );
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, 500); // 500ms delay

  return { suggestions, isLoading, fetchSuggestions, setSuggestions };
}