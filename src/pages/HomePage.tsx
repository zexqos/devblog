import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import useDebounce from '../hooks/useDebounce';
import PostCard from '../components/PostCard/PostCard';
import SearchBar from '../components/SearchBar/SearchBar';
import TagBadge from '../components/TagBadge/TagBadge';
import Skeleton from '../components/Skeleton/Skeleton';
import type { Article } from '../types';

const POPULAR_TAGS = ['react', 'typescript', 'javascript', 'python', 'css', 'webdev', 'node'];

const CACHE_KEY = 'homepage_articles';
const SCROLL_KEY = 'homepage_scroll';

const styles: Record<string, React.CSSProperties> = {
  header:    { marginBottom: '24px' },
  tags:      { display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '16px 0' },
  grid:      { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  skeletonCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' },
  skeletonBody: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' },
  center:    { textAlign: 'center', padding: '40px 0' },
  loadMore:  { display: 'block', margin: '32px auto 0', padding: '10px 32px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  activeTags:{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' },
  clearTags: { background: 'transparent', border: 'none', color: 'var(--accent)', fontSize: '13px', cursor: 'pointer', padding: '0 4px', textDecoration: 'underline' },
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
  const [search, setSearch]             = useState('');
  const [activeTags, setActiveTags]     = useState<string[]>([]);
  const [page, setPage]                 = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollRestored = useRef(false);

  const cached = sessionStorage.getItem(CACHE_KEY);
  const [allArticles, setAllArticles] = useState<Article[]>(
    cached ? JSON.parse(cached) : []
  );

  const debouncedSearch = useDebounce(search, 500);

  const params = {
    per_page: 100,
    page,
    ...(activeTags.length > 0 ? { tag: activeTags[0] } : {}),
    ...(debouncedSearch ? { q: debouncedSearch } : {}),
  };

  const { data, loading, error, refetch } = useFetch<Article[]>(
    '/articles',
    params
  );

  // Фильтрация по нескольким тегам на клиенте
  const filteredArticles = activeTags.length > 1
    ? allArticles.filter(a =>
        activeTags.every(tag =>
          (Array.isArray(a.tag_list) ? a.tag_list : []).includes(tag)
        )
      )
    : allArticles;

  useEffect(() => {
    if (data && !isLoadingMore) {
      setAllArticles(data);
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
    }
  }, [data]);

  useEffect(() => {
    if (allArticles.length > 0 && !scrollRestored.current) {
      const savedScroll = sessionStorage.getItem(SCROLL_KEY);
      if (savedScroll) {
        setTimeout(() => {
          window.scrollTo({ top: parseInt(savedScroll), behavior: 'instant' });
        }, 50);
      }
      scrollRestored.current = true;
    }
  }, [allArticles]);

  useEffect(() => {
    const saveScroll = () => {
      sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
    };
    window.addEventListener('beforeunload', saveScroll);
    return () => {
      saveScroll();
      window.removeEventListener('beforeunload', saveScroll);
    };
  }, []);

  const handleSearchChange = (val: string) => setSearch(val);

  const handleSearchSubmit = () => {
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`);
  };

  const handleTagClick = (tag: string) => {
    if (tag === '') {
      setActiveTags([]);
      setAllArticles([]);
      sessionStorage.removeItem(CACHE_KEY);
      setPage(1);
      return;
    }
    setActiveTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleLoadMore = () => {
    if (data) {
      setIsLoadingMore(true);
      const updated = (() => {
        const existingIds = new Set(allArticles.map(a => a.id));
        const newArticles = data.filter(a => !existingIds.has(a.id));
        return [...allArticles, ...newArticles];
      })();
      setAllArticles(updated);
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(updated));
      setPage(p => p + 1);
    }
  };

  const handleNavigate = (path: string) => {
    sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
    navigate(path);
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
        <div style={styles.tags}>
          <TagBadge
            tag="Все"
            active={activeTags.length === 0}
            onClick={() => handleTagClick('')}
          />
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
            <button style={styles.clearTags} onClick={() => setActiveTags([])}>
              сбросить
            </button>
          </p>
        )}
      </div>

      {error && (
        <div style={styles.center}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>❌ {error}</p>
          <button onClick={refetch} style={styles.loadMore}>Попробовать снова</button>
        </div>
      )}

      <div style={styles.grid}>
        {loading && !isLoadingMore
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : filteredArticles.map(article => (
              <PostCard
                key={article.id}
                article={article}
                onNavigate={handleNavigate}
              />
            ))
        }
      </div>

      {filteredArticles.length === 0 && !loading && activeTags.length > 1 && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '48px', marginBottom: '12px' }}>📭</p>
          <p>Нет статей по всем выбранным тегам сразу</p>
          <button
            style={{ ...styles.loadMore, marginTop: '16px' }}
            onClick={() => setActiveTags([activeTags[0]])}
          >
            Оставить только #{activeTags[0]}
          </button>
        </div>
      )}

      {isLoadingMore && loading && (
        <div style={{ ...styles.grid, marginTop: '20px' }}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && !error && data && data.length === 100 && activeTags.length <= 1 && (
        <button style={styles.loadMore} onClick={handleLoadMore}>
          Загрузить ещё
        </button>
      )}
    </div>
  );
}

export default HomePage;