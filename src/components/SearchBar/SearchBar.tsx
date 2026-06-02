import { useRef } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value:        string;
  onChange:     (v: string) => void;
  placeholder?: string;
  onSubmit?:    () => void;
}

function SearchBar({ value, onChange, placeholder = 'Поиск...', onSubmit }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange('');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>🔍</span>
      <input
        ref={inputRef}
        className={styles.input}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && onSubmit) onSubmit(); }}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
      />
      {value && (
        <button
          className={styles.clearBtn}
          onMouseDown={e => e.preventDefault()}
          onClick={handleClear}
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;