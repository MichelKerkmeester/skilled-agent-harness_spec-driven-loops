import { describe, expect, it } from 'vitest';

import { buildWarmMemoryContextArgs, renderSpecMemoryCliBrief } from '../hooks/spec-memory-cli-fallback.js';

describe('spec memory CLI fallback hook lane', () => {
  it('suppresses constitutional replay after the first fallback call', () => {
    const args = buildWarmMemoryContextArgs('continue the current memory packet');

    expect(args).toMatchObject({
      mode: 'quick',
      limit: 5,
      includeContent: false,
      includeConstitutional: false,
    });
  });

  it('renders one constitutional block from a fallback-chain payload', () => {
    const brief = renderSpecMemoryCliBrief({
      data: {
        memory: { formattedContext: 'Constitutional context: read first.' },
        hints: ['Constitutional context: read first.'],
      },
    });

    expect(brief?.match(/Constitutional context/g)).toHaveLength(1);
  });
});
