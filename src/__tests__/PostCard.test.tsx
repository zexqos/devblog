import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { BookmarksProvider } from '../context/BookmarksContext';
import PostCard from '../components/PostCard/PostCard';
import type { Article } from '../types';

const mockArticle: Article = {
  id: 1,
  title: 'Тестовый пост',
  description: 'Описание',
  body_html: '',
  body_markdown: '',
  cover_image: null,
  tag_list: ['react', 'typescript'],
  readable_publish_date: '12 мая',
  reading_time_minutes: 5,
  public_reactions_count: 42,
  comments_count: 10,
  url: 'https://dev.to/test',
  user: {
    name: 'Jane Smith',
    username: 'jane',
    profile_image: 'https://example.com/avatar.jpg',
  },
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <BookmarksProvider>{children}</BookmarksProvider>
  </MemoryRouter>
);

describe('PostCard', () => {
  it('рендерит заголовок', () => {
    render(<PostCard article={mockArticle} />, { wrapper });
    expect(screen.getByText('Тестовый пост')).toBeInTheDocument();
  });

  it('рендерит имя автора', () => {
    render(<PostCard article={mockArticle} />, { wrapper });
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('рендерит теги', () => {
    render(<PostCard article={mockArticle} />, { wrapper });
    expect(screen.getByText('#react')).toBeInTheDocument();
    expect(screen.getByText('#typescript')).toBeInTheDocument();
  });

 it('кнопка закладки меняет состояние', async () => {
  render(<PostCard article={mockArticle} />, { wrapper });
  const btn = screen.getByText(/Сохранить/);
  await userEvent.click(btn);
  expect(screen.getByText(/Сохранено/)).toBeInTheDocument();
});
});