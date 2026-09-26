import React, { act } from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot, type Root } from 'react-dom/client';
import { afterEach, expect, test, vi } from 'vitest';
import { Checkout } from '../src/Checkout';
let root: Root | undefined;
let container: HTMLDivElement | undefined;
afterEach(async () => {
  if (root) await act(async () => root?.unmount());
  container?.remove();
  root = undefined;
});
test('hydrates the existing DOM and handles the first interaction', async () => {
  const save = vi.fn().mockResolvedValue(undefined);
  container = document.createElement('div');
  document.body.append(container);
  container.innerHTML = renderToString(<Checkout quantity={2} save={save} />);
  const serverOutput = container.querySelector('output');
  await act(async () => {
    root = hydrateRoot(container!, <Checkout quantity={2} save={save} />);
  });
  expect(container.querySelector('output')).toBe(serverOutput);
  expect(serverOutput).toHaveTextContent(/^25\.00$/);
  await act(async () => container!.querySelector('button')!.click());
  expect(save).toHaveBeenCalledOnce();
});
test('recovers a server/client mismatch into the correct disabled state', async () => {
  const save = vi.fn().mockResolvedValue(undefined),
    recovered = vi.fn();
  container = document.createElement('div');
  document.body.append(container);
  container.innerHTML = renderToString(<Checkout quantity={2} save={save} />);
  await act(async () => {
    root = hydrateRoot(container!, <Checkout quantity={0} save={save} />, {
      onRecoverableError: recovered,
    });
  });
  expect(recovered).toHaveBeenCalled();
  expect(container.querySelector('output')).toHaveTextContent(/^0\.00$/);
  expect(container.querySelector('button')).toBeDisabled();
});
