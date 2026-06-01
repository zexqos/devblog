import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import TagPage from './pages/TagPage';
import SearchPage from './pages/SearchPage';
import BookmarksPage from './pages/BookmarksPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path='post/:id' element={<PostPage />} />
        <Route path='tag/:tag' element={<TagPage />} />
        <Route path='search' element={<SearchPage />} />
        <Route path='bookmarks' element={<BookmarksPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;