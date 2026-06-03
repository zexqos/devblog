import { memo, useState } from 'react';
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
  const [imgError, setImgError] = useState(false);

  const handleNavigateToPost = () => {
    navigate(`/post/${article.id}`);
  };

  return (
    <div className={styles.card}>
      {/* 1. Обложка поста */}
      {!article.cover_image || imgError ? (
        <div className={styles.coverPlaceholder} onClick={handleNavigateToPost}>
          📝
        </div>
      ) : (
        <div className={styles.coverWrapper} onClick={handleNavigateToPost}>
          <img
            src={article.cover_image}
            alt=""
            className={styles.cover}
            onError={() => setImgError(true)} 
          />
        </div>
      )}

      <div className={styles.body}>
        {/* 2. Заголовок (теперь идет сразу под обложкой) */}
        <h2 className={styles.title} onClick={handleNavigateToPost}>
          {article.title}
        </h2>

        {/* 3. Блок автора и мета-данных (теперь РЯДОМ с заголовком, как просил препод) */}
        <div className={styles.meta} onClick={handleNavigateToPost}>
          <img
            src={article.user.profile_image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50'}
            alt=""
            className={styles.avatar}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50';
            }}
          />
          <span className={styles.authorName}>{article.user.name}</span>
          <span className={styles.dot}>·</span>
          <span>{article.reading_time_minutes} мин</span>
          <span className={styles.dot}>·</span>
          <span>{article.readable_publish_date}</span>
        </div>

        {/* 4. ТЕГИ СНИЗУ: убрали из верхней части, чтобы не мешали при быстром перемещении */}
        <div className={styles.tags} style={{ marginTop: 'auto', paddingBottom: '12px' }}>
          {(Array.isArray(article.tag_list) ? article.tag_list : []).slice(0, 3).map(tag => (
            <span
              key={tag}
              onClick={(e) => e.stopPropagation()}
              style={{ display: 'inline-block' }}
            >
              <TagBadge
                key={tag}
                tag={tag}
                onClick={() => navigate(`/tag/${tag}`)}
              />
            </span>
          ))}
        </div>

        {/* 5. Кнопки взаимодействия */}
        <div className={styles.actions}>
          <button
            className={`${styles.actionBtn} ${liked ? styles.actionBtnActive : ''}`}
            onClick={(e) => { e.stopPropagation(); toggleLike(article.id); }}
          >
            ♥ {article.public_reactions_count + (liked ? 1 : 0)}
          </button>
          
          <button 
            className={styles.actionBtn}
            onClick={(e) => { e.stopPropagation(); handleNavigateToPost(); }}
          >
            💬 {article.comments_count}
          </button>
          
          <button
            className={`${styles.actionBtn} ${styles.bookmarkBtn} ${bookmarked ? styles.actionBtnActive : ''}`}
            onClick={(e) => { e.stopPropagation(); toggleBookmark(article.id); }}
          >
            🔖 {bookmarked ? 'Сохранено' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(PostCard);