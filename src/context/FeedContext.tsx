import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Article } from '../types';

interface FeedContextType {
  articles: Article[];
  setArticles: (articles: Article[]) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  search: string; // Новое: храним строку поиска в контексте
  setSearch: (search: string) => void; // Новое: функция изменения поиска
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export function FeedProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState(''); // Новое

  return (
    <FeedContext.Provider value={{ articles, setArticles, currentPage, setCurrentPage, search, setSearch }}>
      {children}
    </FeedContext.Provider>
  );
}

export function useFeed() {
  const context = useContext(FeedContext);
  if (!context) throw new Error('useFeed must be used within a FeedProvider');
  return context;
}