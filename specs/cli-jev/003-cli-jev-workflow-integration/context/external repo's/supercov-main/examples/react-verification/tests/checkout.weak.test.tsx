import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect, vi } from 'vitest';
import { Checkout } from '../src/Checkout';

test('renders an empty order', () => {
  render(<Checkout quantity={0} save={vi.fn()} />);
  expect(screen.getByRole('heading')).toBeInTheDocument();
});
test('submits an order', async () => {
  const save = vi.fn().mockResolvedValue(undefined);
  render(<Checkout quantity={2} save={save} />);
  await userEvent.click(screen.getByTestId('checkout'));
  await waitFor(() => expect(save).toHaveBeenCalledOnce());
});
test('renders an alert on failure', async () => {
  render(
    <Checkout
      quantity={2}
      save={vi.fn().mockRejectedValue(new Error('offline'))}
    />,
  );
  await userEvent.click(screen.getByTestId('checkout'));
  expect(await screen.findByRole('alert')).toBeInTheDocument();
});
