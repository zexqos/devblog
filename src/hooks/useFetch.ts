import { useState, useEffect } from 'react';

const BASE_URL = 'https://dev.to/api';

interface UseFetchResult<T> {
  data:    T | null;
  loading: boolean;
  error:   string | null;
  refetch: () => void;
}

function useFetch<T>(
  path: string | null,
  params?: Record<string, string | number | undefined>
): UseFetchResult<T> {
  const [data,    setData]    = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error,   setError]   = useState<string | null>(null);
  const [tick,    setTick]    = useState(0);

  const refetch = () => setTick(t => t + 1);

  useEffect(() => {
    if (!path) { setLoading(false); return; }
    let cancelled = false;

    setLoading(true);
    setError(null);

    const url = new URL(BASE_URL + path);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) url.searchParams.set(key, String(value));
      });
    }

    fetch(url.toString())
      .then(res => {
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        return res.json() as Promise<T>;
      })
      .then(data => {
        if (!cancelled) { setData(data); setLoading(false); }
      })
      .catch((err: Error) => {
        if (!cancelled) { setError(err.message); setLoading(false); }
      });

    return () => { cancelled = true; };
  }, [path, JSON.stringify(params), tick]);

  return { data, loading, error, refetch };
}

export default useFetch;