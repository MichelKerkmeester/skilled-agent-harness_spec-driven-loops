import { afterEach, describe, expect, it, vi } from 'vitest';

import { truncateMemoryTitle } from '../core/title-builder';
import { generateImplementationSummary } from '../lib/semantic-summarizer';
import { extractTriggerPhrases as extractSharedTriggerPhrases } from '@spec-kit/shared/trigger-extractor';

const ORIGINAL_ENV: Record<string, string | undefined> = {
  EMBEDDINGS_PROVIDER: process.env.EMBEDDINGS_PROVIDER,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_EMBEDDINGS_MODEL: process.env.OPENAI_EMBEDDINGS_MODEL,
  VOYAGE_API_KEY: process.env.VOYAGE_API_KEY,
  VOYAGE_EMBEDDINGS_MODEL: process.env.VOYAGE_EMBEDDINGS_MODEL,
  HF_EMBEDDINGS_MODEL: process.env.HF_EMBEDDINGS_MODEL,
};

function restoreEnv(): void {
  for (const [key, value] of Object.entries(ORIGINAL_ENV)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

afterEach(() => {
  vi.resetModules();
  vi.doUnmock('../../shared/embeddings/factory');
  restoreEnv();
});

describe('memory pipeline regressions', () => {
  it('truncates memory titles at the last whole word', () => {
    expect(truncateMemoryTitle('Alpha beta gamma delta epsilon', 21)).toBe('Alpha beta gamma...');
  });

  it('trims extracted outcomes back to a whole word boundary', () => {
    const summary = generateImplementationSummary([
      { prompt: 'Fix the memory pipeline regressions.' },
      {
        content: 'Completed: Implemented deterministic outcome trimming for memory titles and key outcomes across summarizer boundary handling safely.',
      },
    ]);

    expect(summary.outcomes[0]).toBe(
      'Implemented deterministic outcome trimming for memory titles and key outcomes',
    );
  });

  it('filters generic single-word trigger phrases while preserving meaningful phrases', () => {
    const phrases = extractSharedTriggerPhrases(
      'Manual testing per spec phase validated deterministic trigger extraction for embeddings provider selection and memory title truncation.',
    );

    expect(phrases).not.toContain('manual');
    expect(phrases).not.toContain('testing');
    expect(phrases).not.toContain('spec');
    expect(phrases.join(' ')).toContain('embeddings provider');
  });


});
