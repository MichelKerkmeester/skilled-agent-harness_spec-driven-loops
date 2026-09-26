import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect, vi } from 'vitest';
import { Checkout } from '../src/Checkout';

test('displays the exact order total', () => {
  render(<Checkout quantity={2} save={vi.fn()} />);
  expect(screen.getByRole('status')).toHaveTextContent(/^25\.00$/);
});
test('names the payment action accessibly', () => {
  render(<Checkout quantity={2} save={vi.fn()} />);
  expect(screen.getByTestId('checkout')).toHaveAccessibleName(
    'Pay for 2 items',
  );
});
test('disables payment for an empty order', () => {
  render(<Checkout quantity={0} save={vi.fn()} />);
  expect(screen.getByTestId('checkout')).toBeDisabled();
});
test('explains a failed payment', async () => {
  render(
    <Checkout
      quantity={2}
      save={vi.fn().mockRejectedValue(new Error('offline'))}
    />,
  );
  await userEvent.click(screen.getByTestId('checkout'));
  expect(await screen.findByRole('alert')).toHaveTextContent(
    /^Payment failed\. Try again\.$/,
  );
});
