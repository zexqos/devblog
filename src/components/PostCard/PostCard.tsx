import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Article } from '../../types';
import { useBookmarks } from '../../context/BookmarksContext';
import TagBadge from '../TagBadge/TagBadge';
import styles from './PostCard.module.css';

interface PostCardProps {
  article: Article;
}

function PostCard({ article }: PostCardProps) {
  const navigate = useNavigate();
  const { toggleBookmark, toggleLike, isBookmarked, isLiked } = useBookmarks();

  const liked      = isLiked(article.id);
  const bookmarked = isBookmarked(article.id);

  return (
    <div className={styles.card}>
      {article.cover_image ? (
        <img
          src={article.cover_image}
          alt={article.title}
          className={styles.cover}
          onClick={() => navigate(`/post/${article.id}`)}
        />
      ) : (
        <div
          className={styles.coverPlaceholder}
          onClick={() => navigate(`/post/${article.id}`)}
        >
          📝
        </div>
      )}

      <div className={styles.body}>
        <div className={styles.tags}>
          {(Array.isArray(article.tag_list) ? article.tag_list : []).slice(0, 3).map(tag => (
            <TagBadge
              key={tag}
              tag={tag}
              onClick={() => navigate(`/tag/${tag}`)}
            />
          ))}
        </div>

        <h2
          className={styles.title}
          onClick={() => navigate(`/post/${article.id}`)}
        >
          {article.title}
        </h2>

        <div className={styles.meta}>
          <img
            src={article.user.profile_image}
            alt={article.user.name}
            className={styles.avatar}
          />
          <span>{article.user.name}</span>
          <span className={styles.dot}>·</span>
          <span>{article.reading_time_minutes} мин</span>
          <span className={styles.dot}>·</span>
          <span>{article.readable_publish_date}</span>
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.actionBtn} ${liked ? styles.actionBtnActive : ''}`}
            onClick={() => toggleLike(article.id)}
          >
            ♥ {article.public_reactions_count + (liked ? 1 : 0)}
          </button>
          <button className={styles.actionBtn}>
            💬 {article.comments_count}
          </button>
          <button
            className={`${styles.actionBtn} ${styles.bookmarkBtn} ${bookmarked ? styles.actionBtnActive : ''}`}
            onClick={() => toggleBookmark(article.id)}
          >
            {bookmarked ? '🔖' : '🔖'} {bookmarked ? 'Сохранено' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(PostCard);