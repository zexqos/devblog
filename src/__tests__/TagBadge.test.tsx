import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import TagBadge from '../components/TagBadge/TagBadge';

describe('TagBadge', () => {
  it('рендерит текст тега', () => {
    render(<TagBadge tag="react" />);
    expect(screen.getByText('#react')).toBeInTheDocument();
  });

  it('вызывает onClick при клике', async () => {
    const onClick = vi.fn();
    render(<TagBadge tag="react" onClick={onClick} />);
    await userEvent.click(screen.getByText('#react'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('не вызывает onClick если он не передан', async () => {
    render(<TagBadge tag="react" />);
    await userEvent.click(screen.getByText('#react'));
  });
});