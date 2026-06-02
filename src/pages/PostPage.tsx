import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
  body:      { color: 'var(--text-primary)', lineHeight: '1.8', fontSize: '16px', paddingBottom: '32px', borderBottom: '1px solid var(--border)' },
  skeletonWrap: { display: 'flex', flexDirection: 'column', gap: '12px' },
  commentsSection: { marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '20px' },
  commentsTitle:   { fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)' },
  commentForm:     { display: 'flex', flexDirection: 'column', gap: '10px' },
  textarea:        { width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical', outline: 'none' },
  submitBtn:       { alignSelf: 'flex-end', background: 'var(--accent)', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
  commentsList:    { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' },
  commentCard:     { display: 'flex', gap: '12px', padding: '14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', position: 'relative' },
  commentAvatar:   { width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' },
  commentContent:  { display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' },
  commentHeader:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', width: '100%' },
  commentAuthor:   { fontWeight: '600', color: 'var(--text-primary)' },
  commentDate:     { color: 'var(--text-secondary)' },
  commentBody:     { fontSize: '14px', color: 'var(--text-primary)', margin: '0', lineHeight: '1.4', paddingRight: '40px' },
  deleteBtn:       { background: 'transparent', border: 'none', color: 'red', cursor: 'pointer', fontSize: '12px', padding: '2px 6px', borderRadius: '4px', opacity: 0.7 }
};

interface Comment {
  id: number;
  userName: string;
  avatar: string;
  body: string;
  date: string;
  isOwn?: boolean;
}

const RANDOM_NAMES = ['Максим Петров', 'Елена Смирнова', 'Арсен Ибрагимов', 'Аня Кузнецова', 'Игорь Соколов', 'Данияр', 'Ольга Волк', 'Никита Борзов', 'Алина', 'Владимир К.'];
const RANDOM_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
];
const RANDOM_TEXTS = [
  'Отличная статья! Всё расписано очень доступно и понятно.',
  'Сохранил себе в закладки, спасибо за крутой контент.',
  'Абсолютно согласен с автором. TypeScript тут прям зарешал.',
  'Интересный подход, но я бы сделал немного иначе.',
  'Топовый разбор темы, жду продолжения!',
  'Полезно, как раз сейчас разбираюсь с этим функционалом.',
  'Хороший пост, автору респект 🔥',
  'Кратко и по делу, без лишней воды.'
];

function PostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleBookmark, toggleLike, isBookmarked, isLiked } = useBookmarks();

  // ИСПРАВЛЕНО: Прямой абсолютный URL к серверу API
  const { data: article, loading, error } = useFetch<Article>(
    id ? `https://dev.to/api/articles/${id}` : null
  );

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState('');

  useEffect(() => {
    if (article) {
      const count = article.comments_count || 0;
      const generated: Comment[] = [];

      for (let i = 0; i < count; i++) {
        const randomName = RANDOM_NAMES[i % RANDOM_NAMES.length];
        const randomAvatar = RANDOM_AVATARS[i % RANDOM_AVATARS.length];
        const randomText = RANDOM_TEXTS[i % RANDOM_TEXTS.length];
        const randomMinutes = Math.floor(Math.random() * 50) + 10;

        generated.push({
          id: i,
          userName: `${randomName} #${i + 1}`,
          avatar: randomAvatar,
          body: randomText,
          date: `${randomMinutes} мин. назад`,
          isOwn: false
        });
      }
      setComments(generated);
    }
  }, [article]);

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

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      userName: 'Вы (Студент)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      body: commentInput.trim(),
      date: 'Только что',
      isOwn: true
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentInput('');
  };

  const handleDeleteComment = (commentId: number) => {
    setComments((prev) => prev.filter(comment => comment.id !== commentId));
  };

  return (
    <div style={{ maxWidth: '740px', margin: '0 auto', padding: '0 16px 40px 16px' }}>
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
        <button style={styles.actionBtnActive}>
          💬 {comments.length}
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

      <section style={styles.commentsSection}>
        <h2 style={styles.commentsTitle}>
          Комментарии ({comments.length})
        </h2>

        <form onSubmit={handleCommentSubmit} style={styles.commentForm}>
          <textarea
            style={styles.textarea}
            placeholder="Напишите комментарий..."
            rows={3}
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
          <button 
            type="submit" 
            style={{...styles.submitBtn, opacity: commentInput.trim() ? 1 : 0.6}} 
            disabled={!commentInput.trim()}
          >
            Отправить
          </button>
        </form>

        <div style={styles.commentsList}>
          {comments.map((comment) => (
            <div key={comment.id} style={styles.commentCard}>
              <img src={comment.avatar} alt={comment.userName} style={styles.commentAvatar} />
              <div style={styles.commentContent}>
                <div style={styles.commentHeader}>
                  <div>
                    <span style={styles.commentAuthor}>{comment.userName}</span>
                    <span style={{...styles.commentDate, marginLeft: '8px'}}>{comment.date}</span>
                  </div>
                  
                  {comment.isOwn && (
                    <button 
                      onClick={() => handleDeleteComment(comment.id)} 
                      style={styles.deleteBtn}
                    >
                      Удалить
                    </button>
                  )}
                </div>
                <p style={styles.commentBody}>{comment.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PostPage;