import { useRef } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

function SearchBar({
  value,
  onChange,
  placeholder = 'Поиск...',
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange('');
    // Фокусируемся сразу, без задержек анимации
    inputRef.current?.focus(); 
  };

  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>🔍</span>

      <input
        ref={inputRef}
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />

      {value && (
        <button
          type="button"
          className={styles.clearBtn}
          // Предотвращаем потерю фокуса при клике мыши
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleClear}
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;