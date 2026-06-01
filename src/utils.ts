export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

export function formatReadingTime(min: number): string {
  return `${min} мин чтения`;
}

export function truncateText(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '...';
}

export function buildApiUrl(
  path: string,
  params?: Record<string, string | number | undefined>
): string {
  const url = new URL('https://dev.to/api' + path);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

export function highlightMatch(text: string, query: string): string {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.trim()})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

export function getTagColor(tag: string): string {
  const colors = [
    '#EFF6FF', '#F0FDF4', '#FFF7ED',
    '#FDF4FF', '#FFF1F2', '#F0F9FF',
  ];
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}