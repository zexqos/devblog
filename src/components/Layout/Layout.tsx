import { useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useBookmarks } from '../../context/BookmarksContext';
import styles from './Layout.module.css';

function Layout() {
  const { theme, toggleTheme } = useTheme();
  const { bookmarks } = useBookmarks();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    document.title = 'DevBlog — блог для разработчиков';
  }, [location.pathname]);

  return (
    <>
      <nav className={styles.nav}>
        <NavLink to="/" className={styles.logo}>DevBlog</NavLink>

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
          }
        >
          Лента
        </NavLink>

        <button
          className={styles.bookmarkBtn}
          onClick={() => navigate('/bookmarks')}
        >
          🔖 Закладки
          {bookmarks.length > 0 && (
            <span className={styles.badge}>{bookmarks.length}</span>
          )}
        </button>

        <button
          className={styles.themeBtn}
          onClick={toggleTheme}
          title={theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </nav>

      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;