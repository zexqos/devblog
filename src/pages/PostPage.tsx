import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import useFetch from '../hooks/useFetch';
import { useBookmarks } from '../context/BookmarksContext';
import TagBadge from '../components/TagBadge/TagBadge';
import Skeleton from '../components/Skeleton/Skeleton';
import type { Article } from '../types';

const styles: Record<string, React.CSSProperties> = {
  back:      { background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 14px', color: 'var(--text-primary)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' },
  cover:     { width: '100%', height: '300px', objectFit: 'cover', borderRadius: '14px', marginBottom: '24px' },
  tags:      { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' },
  title:     { fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1.3', marginBottom: '16px' },
  meta:      { display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' },
  avatar:    { width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' },
  actions:   { display: 'flex', gap: '12px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' },
  actionBtn: { background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 16px', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px' },
  actionBtnActive: { background: 'transparent', border: '1px solid var(--accent)', borderRadius: '8px', padding: '6px 16px', color: 'var(--accent)', cursor: 'pointer', fontSize: '14px' },
  body:      { color: 'var(--text-primary)', lineHeight: '1.8', fontSize: '16px' },
  skeletonWrap: { display: 'flex', flexDirection: 'column', gap: '12px' },
};

function PostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleBookmark, toggleLike, isBookmarked, isLiked } = useBookmarks();

  const { data: article, loading, error } = useFetch<Article>(
    id ? `/articles/${id}` : null
  );

  if (loading) return (
    <div style={styles.skeletonWrap}>
      <Skeleton width="100%" height="300px" borderRadius="14px" />
      <Skeleton width="50%" height="32px" />
      <Skeleton width="80%" height="32px" />
      <Skeleton width="40%" height="16px" />
      <Skeleton width="100%" height="200px" />
    </div>
  );

  if (error) return (
    <div>
      <p style={{ color: 'var(--text-secondary)' }}>❌ {error}</p>
      <button style={styles.back} onClick={() => navigate(-1)}>← Назад</button>
    </div>
  );

  if (!article) return null;

  const liked      = isLiked(article.id);
  const bookmarked = isBookmarked(article.id);

  return (
    <div style={{ maxWidth: '740px', margin: '0 auto' }}>
      <button style={styles.back} onClick={() => navigate(-1)}>← Назад</button>

      {article.cover_image && (
        <img src={article.cover_image} alt={article.title} style={styles.cover} />
      )}

      <div style={styles.tags}>
        {(Array.isArray(article.tag_list) ? article.tag_list : []).map(tag => (
          <TagBadge key={tag} tag={tag} onClick={() => navigate(`/tag/${tag}`)} />
        ))}
      </div>

      <h1 style={styles.title}>{article.title}</h1>

      <div style={styles.meta}>
        <img src={article.user.profile_image} alt={article.user.name} style={styles.avatar} />
        <span>{article.user.name}</span>
        <span>·</span>
        <span>{article.reading_time_minutes} мин чтения</span>
        <span>·</span>
        <span>{article.readable_publish_date}</span>
      </div>

      <div style={styles.actions}>
        <button
          style={liked ? styles.actionBtnActive : styles.actionBtn}
          onClick={() => toggleLike(article.id)}
        >
          ♥ {article.public_reactions_count + (liked ? 1 : 0)}
        </button>
        <button style={styles.actionBtn}>
          💬 {article.comments_count}
        </button>
        <button
          style={bookmarked ? styles.actionBtnActive : styles.actionBtn}
          onClick={() => toggleBookmark(article.id)}
        >
          🔖 {bookmarked ? 'Сохранено' : 'Сохранить'}
        </button>
      </div>

      <div style={styles.body}>
        <ReactMarkdown>{article.body_markdown}</ReactMarkdown>
      </div>
    </div>
  );
}

export default PostPage;