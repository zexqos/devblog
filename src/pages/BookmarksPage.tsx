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
  overlay:   { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal:     { background: 'var(--bg-card)', borderRadius: '16px', padding: '28px', maxWidth: '360px', width: '90%', textAlign: 'center' as const, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' },
  modalTitle:{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' },
  modalText: { color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' },
  modalBtns: { display: 'flex', gap: '12px', justifyContent: 'center' },
  cancelBtn: { padding: '8px 24px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: '600' },
  confirmBtn:{ padding: '8px 24px', background: '#EF4444', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: '600' },
};

function BookmarksPage() {
  const navigate = useNavigate();
  const { bookmarks, clearBookmarks } = useBookmarks();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  const handleClearConfirm = () => {
    clearBookmarks();
    setShowConfirm(false);
  };

  return (
    <div>
      {showConfirm && (
        <div style={styles.overlay} onClick={() => setShowConfirm(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <p style={styles.modalTitle}>Очистить закладки?</p>
            <p style={styles.modalText}>Все сохранённые посты будут удалены. Это действие нельзя отменить.</p>
            <div style={styles.modalBtns}>
              <button style={styles.cancelBtn} onClick={() => setShowConfirm(false)}>
                Отмена
              </button>
              <button style={styles.confirmBtn} onClick={handleClearConfirm}>
                Очистить
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.header}>
        <h1 style={styles.title}>🔖 Мои закладки</h1>
        {bookmarks.length > 0 && (
          <button style={styles.clearBtn} onClick={() => setShowConfirm(true)}>
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