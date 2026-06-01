import styles from './SearchBar.module.css';

interface SearchBarProps {
  value:        string;
  onChange:     (v: string) => void;
  placeholder?: string;
}

function SearchBar({ value, onChange, placeholder = 'Поиск...' }: SearchBarProps) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>🔍</span>
      <input
        className={styles.input}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button className={styles.clearBtn} onClick={() => onChange('')}>✕</button>
      )}
    </div>
  );
}

export default SearchBar;