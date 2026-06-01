import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookmarks } from '../context/BookmarksContext';
import PostCard from '../components/PostCard/PostCard';
import Skeleton from '../components/Skeleton/Skeleton';
import type { Article } from '../types';

const styles: Record<string, React.CSSProperties> = {
  header:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' },
  title:     { fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' },
  clearBtn:  { background: 'transparent', border: '1px solid #FCA5A5', color: '#EF4444', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '14px' },
  count:     { color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' },
  grid:      { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  empty:     { textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' },
  emptyIcon: { fontSize: '48px', display: 'block', marginBottom: '12px' },
  toFeedBtn: { marginTop: '16px', padding: '10px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '15px', fontWeight: '600' },
  skeletonCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' },
  skeletonBody: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' },
};

function BookmarksPage() {
  const navigate = useNavigate();
  const { bookmarks, clearBookmarks } = useBookmarks();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    if (bookmarks.length === 0) { setArticles([]); return; }
    setLoading(true);
    Promise.all(
      bookmarks.map(id =>
        fetch(`https://dev.to/api/articles/${id}`).then(r => r.json())
      )
    )
      .then(data => setArticles(data))
      .finally(() => setLoading(false));
  }, [bookmarks]);

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>🔖 Мои закладки</h1>
        {bookmarks.length > 0 && (
          <button style={styles.clearBtn} onClick={clearBookmarks}>
            Очистить всё
          </button>
        )}
      </div>

      {bookmarks.length > 0 && (
        <p style={styles.count}>Сохранено: {bookmarks.length} постов</p>
      )}

      {bookmarks.length === 0 ? (
        <div style={styles.empty}>
          <span style={styles.emptyIcon}>📭</span>
          <p>Закладок пока нет — сохраняй интересные посты!</p>
          <button style={styles.toFeedBtn} onClick={() => navigate('/')}>
            Перейти в ленту
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {loading
            ? Array.from({ length: bookmarks.length }).map((_, i) => (
                <div key={i} style={styles.skeletonCard}>
                  <Skeleton width="100%" height="180px" borderRadius="0" />
                  <div style={styles.skeletonBody}>
                    <Skeleton width="60%" height="14px" />
                    <Skeleton width="90%" height="20px" />
                    <Skeleton width="40%" height="14px" />
                  </div>
                </div>
              ))
            : articles.map(article => (
                <PostCard key={article.id} article={article} />
              ))
          }
        </div>
      )}
    </div>
  );
}

export default BookmarksPage;