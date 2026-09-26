import test from 'node:test';
import assert from 'node:assert/strict';
import { canCheckout } from '../src/session.js';

test('a valid session can check out', () => {
  assert.equal(canCheckout(true, false), true);
});

test('a signed-out visitor cannot check out', () => {
  assert.equal(canCheckout(false, false), false);
});

test('a signed-in visitor with an expired session cannot check out', () => {
  assert.equal(canCheckout(true, true), false);
});
