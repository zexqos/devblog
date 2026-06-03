import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeed } from '../context/FeedContext';
import useDebounce from '../hooks/useDebounce';
import PostCard from '../components/PostCard/PostCard';
import SearchBar from '../components/SearchBar/SearchBar';
import TagBadge from '../components/TagBadge/TagBadge';
import Skeleton from '../components/Skeleton/Skeleton';
import type { Article } from '../types';

const POPULAR_TAGS = ['react', 'typescript', 'javascript', 'python', 'css', 'webdev', 'node'];
const BASE_URL = 'https://dev.to/api';

const styles: Record<string, React.CSSProperties> = {
  header:       { marginBottom: '24px' },
  tagsBlock:    { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', margin: '16px 0' },
  tagsTitle:    { fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' },
  tags:         { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  grid:         { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  skeletonCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' },
  skeletonBody: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' },
  center:       { textAlign: 'center', padding: '40px 0' },
  loadMore:     { display: 'block', margin: '32px auto 0', padding: '10px 32px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  activeTags:   { fontSize: '13px', color: 'var(--text-secondary)', marginTop: '12px', marginBottom: '0' },
  clearTags:    { background: 'transparent', border: 'none', color: 'var(--accent)', fontSize: '13px', cursor: 'pointer', padding: '0 4px', textDecoration: 'underline' },
  moreGrid:     { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' },
};

function SkeletonCard() {
  return (
    <div style={styles.skeletonCard}>
      <Skeleton width="100%" height="180px" borderRadius="0" />
      <div style={styles.skeletonBody}>
        <Skeleton width="60%" height="14px" />
        <Skeleton width="90%" height="20px" />
        <Skeleton width="75%" height="20px" />
        <Skeleton width="40%" height="14px" />
      </div>
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const { articles, setArticles, currentPage, setCurrentPage, search, setSearch } = useFeed();
  const [activeTags, setActiveTags]     = useState<string[]>([]);
  const [loading, setLoading]           = useState(false);
  const [moreLoading, setMoreLoading]   = useState(false);
  const [error, setError]               = useState<string | null>(null);

  // Используем поисковый запрос напрямую для мгновенного отклика при возврате назад
  const isSearchMode = search.trim().length > 0;

  const fetchArticles = useCallback(async (tag?: string, isLoadMore = false) => {
    if (isLoadMore) {
      setMoreLoading(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const nextPage = isLoadMore ? currentPage + 1 : 1;
      const url = new URL(`${BASE_URL}/articles`);
      
      url.searchParams.set('per_page', isLoadMore ? '20' : '30');
      url.searchParams.set('page', String(nextPage));
      
      if (tag) {
        url.searchParams.set('tag', tag);
      }

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Не удалось загрузить публикации');
      const data: Article[] = await res.json();

      if (isLoadMore) {
        setArticles([...articles, ...data]);
        setCurrentPage(nextPage);
      } else {
        setArticles(data);
        setCurrentPage(1);
      }
    } catch (e: any) {
      setError(e.message || 'Ошибка при загрузке данных');
    } finally {
      setLoading(false);
      setMoreLoading(false);
    }
  }, [currentPage, articles, setArticles, setCurrentPage]);

  // Загружаем только если массив пустой (первый вход на сайт) или изменились теги
  useEffect(() => {
    if (articles.length === 0 || activeTags.length > 0) {
      fetchArticles(activeTags[0], false);
    }
  }, [activeTags]);

  // Фильтрация без дебаунса для мгновенного восстановления состояния из контекста
  const filteredArticles = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return articles;

    return articles.filter(article => 
      article.title.toLowerCase().includes(query) || 
      (article.description && article.description.toLowerCase().includes(query))
    );
  }, [articles, search]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
  };

  const handleSearchSubmit = () => {};

  const handleTagClick = (tag: string) => {
    if (tag === '') {
      setActiveTags([]);
      setArticles([]);
      return;
    }
    setSearch(''); 
    setActiveTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleLoadMore = () => {
    fetchArticles(activeTags[0], true);
  };

  const handleResetSearch = () => {
    setSearch('');
  };

  return (
    <div>
      <div style={styles.header}>
        <SearchBar
          value={search}
          onChange={handleSearchChange}
          placeholder="Поиск статей..."
          onSubmit={handleSearchSubmit}
        />

        {!isSearchMode && (
          <div style={styles.tagsBlock}>
            <h3 style={styles.tagsTitle}>🏷️ Популярные теги:</h3>
            <div style={styles.tags}>
              <TagBadge tag="Все" active={activeTags.length === 0} onClick={() => handleTagClick('')} />
              {POPULAR_TAGS.map(tag => (
                <TagBadge
                  key={tag}
                  tag={tag}
                  active={activeTags.includes(tag)}
                  onClick={() => handleTagClick(tag)}
                />
              ))}
            </div>
            {activeTags.length > 0 && (
              <p style={styles.activeTags}>
                Выбрано: {activeTags.map(t => `#${t}`).join(', ')}
                <button style={styles.clearTags} onClick={() => setActiveTags([])}>сбросить</button>
              </p>
            )}
          </div>
        )}

        {isSearchMode && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '10px 14px',
            margin: '16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: 'var(--text-secondary)',
          }}>
            🔍 Поиск: <b style={{ color: 'var(--text-primary)' }}>«{search}»</b>
            {<span>— {filteredArticles.length} найденных статей</span>}
            <button
              onClick={handleResetSearch}
              style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '500' }}
            >
              ✕ Сбросить
            </button>
          </div>
        )}
      </div>

      {error && (
        <div style={styles.center}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>❌ {error}</p>
          <button onClick={() => fetchArticles(activeTags[0], false)} style={styles.loadMore}>Попробовать снова</button>
        </div>
      )}

      <div style={styles.grid}>
        {loading && articles.length === 0
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : filteredArticles.map(article => (
              <PostCard key={article.id} article={article} />
            ))
        }
      </div>

      {moreLoading && (
        <div style={styles.moreGrid}>
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {filteredArticles.length === 0 && !loading && !error && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '54px', marginBottom: '16px', margin: 0 }}>📭</p>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Ничего не найдено</h3>
          <p style={{ fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
            По запросу <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>«{search}»</span> не нашлось подходящих публикаций в текущей ленте.
          </p>
          <button onClick={handleResetSearch} style={{ ...styles.loadMore, marginTop: '20px' }}>
            Сбросить поиск
          </button>
        </div>
      )}

      {!loading && !moreLoading && !error && filteredArticles.length > 0 && !isSearchMode && (
        <button style={styles.loadMore} onClick={handleLoadMore}>
          Загрузить ещё
        </button>
      )}
    </div>
  );
}

export default HomePage;