import test from 'node:test';
import assert from 'node:assert/strict';
import { canCheckout } from '../src/session.js';

test('an expired session cannot check out', () => {
  assert.equal(canCheckout(true, true), false);
});
