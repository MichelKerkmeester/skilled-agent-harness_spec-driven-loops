import { describe, expect, it } from 'vitest';

import { extractImportanceTier } from '../lib/parsing/memory-parser.js';

describe('importance tier marker parsing', () => {
  it('does not promote body substring marker examples', () => {
    const content = [
      '# Incident Notes',
      '',
      'The log sample included this literal marker:',
      '```text',
      '[CRITICAL] this is quoted output, not metadata',
      '```',
    ].join('\n');

    expect(extractImportanceTier(content)).toBe('normal');
  });

  it('honors frontmatter but not first-line tier markers', () => {
    expect(extractImportanceTier('---\nimportance_tier: archived\n---\n# Archive')).toBe('archived');
    expect(extractImportanceTier('[IMPORTANT]\n# Short note')).toBe('normal');
  });
});
