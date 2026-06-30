import { describe, test, expect } from 'vitest';
import { formatBytes } from './format';

describe('formatBytes', () => {
  test('converts bytes to MB', () => {
    expect(formatBytes(1500000)).toBe('1.5 MB');
  });

  test('returns 0 B for zero', () => {
    expect(formatBytes(0)).toBe('0 B');
  });

  test('converts bytes to GB', () => {
    expect(formatBytes(1.5e9)).toBe('1.5 GB');
  });
});
