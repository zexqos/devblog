import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import useDebounce from '../hooks/useDebounce';
import PostCard from '../components/PostCard/PostCard';
import SearchBar from '../components/SearchBar/SearchBar';
import TagBadge from '../components/TagBadge/TagBadge';
import Skeleton from '../components/Skeleton/Skeleton';
import type { Article } from '../types';

const POPULAR_TAGS = ['react', 'typescript', 'javascript', 'python', 'css', 'webdev', 'node'];

const styles: Record<string, React.CSSProperties> = {
  header:    { marginBottom: '24px' },
  tags:      { display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '16px 0' },
  grid:      { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  skeletonCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' },
  skeletonBody: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' },
  center:    { textAlign: 'center', padding: '40px 0' },
  loadMore:  { display: 'block', margin: '32px auto 0', padding: '10px 32px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
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
  const navigate   = useNavigate();
  const [search, setSearch]           = useState('');
  const [activeTag, setActiveTag]     = useState('');
  const [page, setPage]               = useState(1);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const params = {
    per_page: 12,
    page,
    ...(activeTag       ? { tag: activeTag }     : {}),
    ...(debouncedSearch ? { q: debouncedSearch } : {}),
  };

  const { data, loading, error, refetch } = useFetch<Article[]>('/articles', params);

  useEffect(() => {
    if (data && page === 1) {
      setAllArticles(data);
      setIsLoadingMore(false);
    }
  }, [data, page]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
  };

  const handleSearchSubmit = () => {
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`);
  };

  const handleTagClick = (tag: string) => {
    setActiveTag(tag === activeTag ? '' : tag);
    setPage(1);
    setAllArticles([]);
  };

  const handleLoadMore = () => {
    if (data) {
      setAllArticles(prev => {
        const existingIds = new Set(prev.map(a => a.id));
        const newArticles = data.filter(a => !existingIds.has(a.id));
        return [...prev, ...newArticles];
      });
      setIsLoadingMore(true);
      setPage(p => p + 1);
    }
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
            active={!activeTag}
            onClick={() => handleTagClick('')}
          />
          {POPULAR_TAGS.map(tag => (
            <TagBadge
              key={tag}
              tag={tag}
              active={activeTag === tag}
              onClick={() => handleTagClick(tag)}
            />
          ))}
        </div>
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
          : allArticles.map(article => (
              <PostCard key={article.id} article={article} />
            ))
        }
      </div>

      {isLoadingMore && loading && (
        <div style={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && !error && data && data.length === 12 && (
        <button style={styles.loadMore} onClick={handleLoadMore}>
          Загрузить ещё
        </button>
      )}
    </div>
  );
}

export default HomePage;