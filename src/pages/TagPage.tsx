import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import PostCard from '../components/PostCard/PostCard';
import Skeleton from '../components/Skeleton/Skeleton';
import type { Article } from '../types';

const styles: Record<string, React.CSSProperties> = {
  header:   { marginBottom: '24px' },
  title:    { fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' },
  subtitle: { color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '24px' },
  grid:     { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  empty:    { textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' },
  emptyIcon:{ fontSize: '48px', display: 'block', marginBottom: '12px' },
  skeletonCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' },
  skeletonBody: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' },
  back:     { background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 14px', color: 'var(--text-primary)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' },
  loadMore: { display: 'block', margin: '32px auto 0', padding: '10px 32px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
};

function TagPage() {
  const { tag } = useParams<{ tag: string }>();
  const navigate = useNavigate();

  const { data: articles, loading, error } = useFetch<Article[]>(
    '/articles',
    { tag: tag ?? '', per_page: 12 }
  );

  return (
    <div>
      <button style={styles.back} onClick={() => navigate(-1)}>← Назад</button>
      <div style={styles.header}>
        <h1 style={styles.title}>#{tag}</h1>
        <p style={styles.subtitle}>Статьи по тегу</p>
      </div>

      {error && <p style={{ color: 'var(--text-secondary)' }}>❌ {error}</p>}

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
            ? articles.map(article => <PostCard key={article.id} article={article} />)
            : !loading && (
                <div style={styles.empty}>
                  <span style={styles.emptyIcon}>📭</span>
                  <p>Статей по тегу #{tag} не найдено</p>
                </div>
              )
        }
      </div>
    </div>
  );
}

export default TagPage;