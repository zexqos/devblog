import { createContext, useContext } from 'react';
import type { BookmarksContextValue } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

const BookmarksContext = createContext<BookmarksContextValue | null>(null);

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks,  setBookmarks]  = useLocalStorage<number[]>('bookmarks',  []);
  const [likedPosts, setLikedPosts] = useLocalStorage<number[]>('likedPosts', []);

  const toggleBookmark = (id: number) => {
    setBookmarks(
      bookmarks.includes(id)
        ? bookmarks.filter(b => b !== id)
        : [...bookmarks, id]
    );
  };

  const toggleLike = (id: number) => {
    setLikedPosts(
      likedPosts.includes(id)
        ? likedPosts.filter(l => l !== id)
        : [...likedPosts, id]
    );
  };

  const isBookmarked = (id: number) => bookmarks.includes(id);
  const isLiked      = (id: number) => likedPosts.includes(id);
  const clearBookmarks = () => setBookmarks([]);

  return (
    <BookmarksContext.Provider value={{
      bookmarks, likedPosts,
      toggleBookmark, toggleLike,
      isBookmarked, isLiked, clearBookmarks,
    }}>
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks(): BookmarksContextValue {
  const context = useContext(BookmarksContext);
  if (!context) throw new Error('useBookmarks — вне BookmarksProvider');
  return context;
}