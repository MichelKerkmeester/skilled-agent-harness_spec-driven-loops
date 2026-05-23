// ───────────────────────────────────────────────────────────────
// TEST: Sidecar Worker — F47 bounded stdin + input-array validation
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { __sidecarWorkerTestables } from '../../lib/embedders/sidecar-worker.js';

const { parseRequest } = __sidecarWorkerTestables;

describe('sidecar-worker bounded parsing', () => {
  it('rejects an embed request with input.length exceeding MAX_INPUT_ITEMS (500)', () => {
    const oversizedInput = Array.from({ length: 501 }, (_v, i) => `text-${i}`);
    const line = JSON.stringify({
      id: 42,
      type: 'embed',
      input: oversizedInput,
      model: 'test-model',
      dimensions: 768,
    });

    expect(() => parseRequest(line)).toThrow(
      'Embed request input exceeds maximum of 500 items',
    );
  });

  it('accepts an embed request with input.length exactly at MAX_INPUT_ITEMS (500)', () => {
    const atCapInput = Array.from({ length: 500 }, (_v, i) => `text-${i}`);
    const line = JSON.stringify({
      id: 42,
      type: 'embed',
      input: atCapInput,
      model: 'test-model',
      dimensions: 768,
    });

    const request = parseRequest(line);
    expect(request.type).toBe('embed');
    expect((request as { input: string[] }).input).toHaveLength(500);
  });

  it('accepts a normal embed request with a small input array', () => {
    const line = JSON.stringify({
      id: 1,
      type: 'embed',
      input: ['hello', 'world'],
      model: 'test-model',
      dimensions: 768,
    });

    const request = parseRequest(line);
    expect(request.type).toBe('embed');
    expect((request as { input: string[] }).input).toEqual(['hello', 'world']);
  });

  it('rejects an embed request where input is not a string array', () => {
    const line = JSON.stringify({
      id: 1,
      type: 'embed',
      input: [1, 2, 3],
      model: 'test-model',
      dimensions: 768,
    });

    expect(() => parseRequest(line)).toThrow(
      'Embed request input must be string[]',
    );
  });

  it('accepts a ping request', () => {
    const line = JSON.stringify({ id: 1, type: 'ping' });
    const request = parseRequest(line);
    expect(request.type).toBe('ping');
  });

  it('accepts a shutdown request', () => {
    const line = JSON.stringify({ id: 1, type: 'shutdown' });
    const request = parseRequest(line);
    expect(request.type).toBe('shutdown');
  });

  it('rejects an unknown request type', () => {
    const line = JSON.stringify({ id: 1, type: 'unknown' });
    expect(() => parseRequest(line)).toThrow(
      'Unknown sidecar request type: unknown',
    );
  });

  it('rejects a request with a missing id', () => {
    const line = JSON.stringify({ type: 'ping' });
    expect(() => parseRequest(line)).toThrow(
      'Invalid sidecar request envelope',
    );
  });

  it('rejects a request with a missing type', () => {
    const line = JSON.stringify({ id: 1 });
    expect(() => parseRequest(line)).toThrow(
      'Invalid sidecar request envelope',
    );
  });
});