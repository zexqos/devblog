import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from '../components/SearchBar/SearchBar';

describe('SearchBar', () => {
  it('рендерит поле ввода', () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText('Поиск...')).toBeInTheDocument();
  });

  it('вызывает onChange при вводе', async () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);
    await userEvent.type(screen.getByPlaceholderText('Поиск...'), 'react');
    expect(onChange).toHaveBeenCalled();
  });

  it('показывает кнопку ✕ когда value не пустой', () => {
    render(<SearchBar value="react" onChange={vi.fn()} />);
    expect(screen.getByText('✕')).toBeInTheDocument();
  });

  it('не показывает кнопку ✕ когда value пустой', () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.queryByText('✕')).not.toBeInTheDocument();
  });

  it('кнопка ✕ вызывает onChange с пустой строкой', async () => {
    const onChange = vi.fn();
    render(<SearchBar value="react" onChange={onChange} />);
    await userEvent.click(screen.getByText('✕'));
    expect(onChange).toHaveBeenCalledWith('');
  });
});