import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
      <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
        404
      </h1>
      <p style={{ marginBottom: '24px' }}>Страница не найдена</p>
      <button
        onClick={() => navigate('/')}
        style={{ padding: '10px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}
      >
        На главную
      </button>
    </div>
  );
}

export default NotFoundPage;