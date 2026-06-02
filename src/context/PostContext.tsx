import { createContext, useContext, useState, ReactNode } from 'react';
import type { Article } from '../types';

interface PostContextType {
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  hasMore: boolean;
  setHasMore: (val: boolean) => void;
  scrollPosition: number;
  setScrollPosition: (pos: number) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);

  return (
    <PostContext.Provider value={{
      articles, setArticles,
      page, setPage,
      hasMore, setHasMore,
      scrollPosition, setScrollPosition
    }}>
      <children />
    </PostContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostContext);
  if (!context) throw new Error('usePosts must be used within a PostProvider');
  return context;
}