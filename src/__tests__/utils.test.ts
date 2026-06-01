import { describe, it, expect } from 'vitest';
import {
  formatDate, formatReadingTime, truncateText,
  buildApiUrl, highlightMatch, getTagColor
} from '../utils';

describe('formatDate', () => {
  it('форматирует дату в русский формат', () => {
    const result = formatDate('2025-05-28');
    expect(result).toContain('2025');
  });
  it('возвращает исходную строку при ошибке', () => {
    expect(formatDate('не дата')).toBe('не дата');
  });
});

describe('formatReadingTime', () => {
  it('возвращает строку с минутами', () => {
    expect(formatReadingTime(5)).toBe('5 мин чтения');
  });
  it('работает с 0', () => {
    expect(formatReadingTime(0)).toBe('0 мин чтения');
  });
});

describe('truncateText', () => {
  it('не обрезает короткий текст', () => {
    expect(truncateText('hello', 10)).toBe('hello');
  });
  it('обрезает длинный текст и добавляет ...', () => {
    const result = truncateText('hello world', 5);
    expect(result).toContain('...');
    expect(result.length).toBeLessThanOrEqual(8);
  });
});

describe('buildApiUrl', () => {
  it('строит URL без параметров', () => {
    expect(buildApiUrl('/articles')).toBe('https://dev.to/api/articles');
  });
  it('добавляет параметры в URL', () => {
    const url = buildApiUrl('/articles', { tag: 'react', per_page: 12 });
    expect(url).toContain('tag=react');
    expect(url).toContain('per_page=12');
  });
  it('игнорирует undefined параметры', () => {
    const url = buildApiUrl('/articles', { tag: undefined });
    expect(url).not.toContain('tag');
  });
});

describe('highlightMatch', () => {
  it('оборачивает совпадение в mark', () => {
    expect(highlightMatch('hello world', 'world')).toContain('<mark>');
  });
  it('возвращает текст без изменений если query пустой', () => {
    expect(highlightMatch('hello', '')).toBe('hello');
  });
});

describe('getTagColor', () => {
  it('возвращает строку цвета', () => {
    expect(getTagColor('react')).toMatch(/^#/);
  });
  it('один и тот же тег даёт одинаковый цвет', () => {
    expect(getTagColor('react')).toBe(getTagColor('react'));
  });
});