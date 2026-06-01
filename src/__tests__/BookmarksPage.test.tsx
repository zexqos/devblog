import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { BookmarksProvider } from '../context/BookmarksContext';
import { ThemeProvider } from '../context/ThemeContext';
import BookmarksPage from '../pages/BookmarksPage';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <ThemeProvider>
      <BookmarksProvider>
        {children}
      </BookmarksProvider>
    </ThemeProvider>
  </MemoryRouter>
);

describe('BookmarksPage', () => {
  it('показывает пустое состояние когда нет закладок', () => {
    render(<BookmarksPage />, { wrapper });
    expect(screen.getByText(/Закладок пока нет/)).toBeInTheDocument();
  });

  it('показывает кнопку Перейти в ленту', () => {
    render(<BookmarksPage />, { wrapper });
    expect(screen.getByText('Перейти в ленту')).toBeInTheDocument();
  });

  it('показывает заголовок Мои закладки', () => {
    render(<BookmarksPage />, { wrapper });
    expect(screen.getByText(/Мои закладки/)).toBeInTheDocument();
  });

  it('кнопка Перейти в ленту кликабельна', async () => {
    render(<BookmarksPage />, { wrapper });
    const btn = screen.getByText('Перейти в ленту');
    await userEvent.click(btn);
  });
});