import { describe, it, expect } from 'vitest';
import { formatBytes } from './format';

describe('formatBytes', () => {
  it('happy path: 1500000 → 1.5 MB', () => {
    expect(formatBytes(1500000)).toBe('1.5 MB');
  });

  it('zero: 0 → 0 B', () => {
    expect(formatBytes(0)).toBe('0 B');
  });

  it('large: 1.5e9 → 1.5 GB', () => {
    expect(formatBytes(1.5e9)).toBe('1.5 GB');
  });
});
