import { useSearchParams, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import PostCard from '../components/PostCard/PostCard';
import SearchBar from '../components/SearchBar/SearchBar';
import Skeleton from '../components/Skeleton/Skeleton';
import type { Article } from '../types';

const styles: Record<string, React.CSSProperties> = {
  header:   { marginBottom: '24px' },
  title:    { fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' },
  grid:     { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  empty:    { textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' },
  emptyIcon:{ fontSize: '48px', display: 'block', marginBottom: '12px' },
  skeletonCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' },
  skeletonBody: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' },
  mark:     { background: 'var(--tag-bg)', color: 'var(--accent)', borderRadius: '3px', padding: '0 2px' },
};

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.trim()})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} style={styles.mark}>{part}</mark>
      : part
  );
}

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = searchParams.get('q') || '';

  const { data: articles, loading } = useFetch<Article[]>(
    q ? '/articles' : null,
    { q, per_page: 12 }
  );

  const handleSearch = (val: string) => {
    if (val.trim()) setSearchParams({ q: val.trim() });
    else navigate('/');
  };

  return (
    <div>
      <div style={styles.header}>
        <SearchBar value={q} onChange={handleSearch} placeholder="Поиск статей..." />
        {q && !loading && (
          <h2 style={styles.title}>
            Результаты по запросу: «{q}»
            {articles && ` — ${articles.length} статей`}
          </h2>
        )}
        {!q && (
          <div style={styles.empty}>
            <span style={styles.emptyIcon}>🔍</span>
            <p>Введите поисковый запрос</p>
          </div>
        )}
      </div>

      <div style={styles.grid}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={styles.skeletonCard}>
                <Skeleton width="100%" height="180px" borderRadius="0" />
                <div style={styles.skeletonBody}>
                  <Skeleton width="60%" height="14px" />
                  <Skeleton width="90%" height="20px" />
                  <Skeleton width="40%" height="14px" />
                </div>
              </div>
            ))
          : articles && articles.length > 0
            ? articles.map(article => (
                <div key={article.id}>
                  <PostCard
                    article={{
                      ...article,
                      title: article.title,
                    }}
                  />
                  <div style={{ padding: '0 4px', marginTop: '-8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {highlightMatch(article.title, q)}
                  </div>
                </div>
              ))
            : q && !loading && (
                <div style={styles.empty}>
                  <span style={styles.emptyIcon}>📭</span>
                  <p>Ничего не найдено по запросу «{q}»</p>
                </div>
              )
        }
      </div>
    </div>
  );
}

export default SearchPage;