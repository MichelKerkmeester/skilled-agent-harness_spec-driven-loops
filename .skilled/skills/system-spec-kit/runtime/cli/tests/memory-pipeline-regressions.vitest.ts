// ───────────────────────────────────────────────────────────────────
// MODULE: Memory Pipeline Regression Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { truncateMemoryTitle } from '../core/title-builder';
import { generateImplementationSummary } from '../lib/semantic-summarizer';
import { extractTriggerPhrases as extractSharedTriggerPhrases } from '@spec-kit/shared/trigger-extractor';

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
