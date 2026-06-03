import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration, Link } from 'react-router-dom';
import { BookmarksProvider } from './context/BookmarksContext';
import { FeedProvider } from './context/FeedContext';
import { useTheme } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';

function Layout() {
  const { theme, toggleTheme } = useTheme();

  const styles: Record<string, React.CSSProperties> = {
    app: {
      minHeight: '100vh',
      backgroundColor: 'var(--bg-main)',
      color: 'var(--text-primary)',
      transition: 'background-color 0.3s, color 0.3s',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 40px',
      borderBottom: '1px solid var(--border)',
      backgroundColor: 'var(--bg-card)',
    },
    logo: {
      fontSize: '22px',
      fontWeight: '800',
      color: 'var(--accent)',
      textDecoration: 'none',
    },
    nav: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
    },
    link: {
      color: 'var(--text-primary)',
      textDecoration: 'none',
      fontSize: '15px',
      fontWeight: '500',
    },
    themeBtn: {
      background: 'transparent',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      padding: '4px',
      display: 'flex',
      alignItems: 'center',
    },
    main: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '32px 24px',
    }
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <Link to="/" style={styles.logo}>DevBlog</Link>
        <nav style={styles.nav}>
          <Link to="/" style={styles.link}>Лента</Link>
          <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            🔖 Закладки
          </span>
          <button onClick={toggleTheme} style={styles.themeBtn} title="Переключить тему">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </nav>
      </header>

      <main style={styles.main}>
        <Outlet />
      </main>

      <ScrollRestoration />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/post/:id',
        element: <PostPage />,
      },
    ],
  },
]);

function App() {
  return (
    <BookmarksProvider>
      <FeedProvider>
        <RouterProvider router={router} />
      </FeedProvider>
    </BookmarksProvider>
  );
}

export default App;