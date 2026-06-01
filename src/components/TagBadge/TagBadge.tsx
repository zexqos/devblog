import styles from './TagBadge.module.css';

interface TagBadgeProps {
  tag:      string;
  onClick?: () => void;
  active?:  boolean;
}

function TagBadge({ tag, onClick, active = false }: TagBadgeProps) {
  const className = [
    styles.tag,
    onClick ? styles.tagClickable : '',
    active  ? styles.tagActive   : '',
  ].filter(Boolean).join(' ');

  return (
    <span className={className} onClick={onClick}>
      #{tag}
    </span>
  );
}

export default TagBadge;