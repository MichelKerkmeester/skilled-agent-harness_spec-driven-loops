// ───────────────────────────────────────────────────────────────────
// MODULE: Generate Context Help Test
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { HELP_TEXT, parseArguments } from '../continuity/generate-context';

describe('generate-context --help planner mode copy', () => {
  it('states that only full-auto writes continuity fields', () => {
    expect(HELP_TEXT).toContain('only full-auto writes the continuity fields');
    expect(HELP_TEXT).not.toContain('mutation-first');
  });
});

describe('generate-context --runtime', () => {
  const runtimes = ['claude', 'codex', 'opencode', 'pi', 'devin', 'dsh'] as const;

  it('documents the runtime flag, every slug and the continuity pointer in help', () => {
    expect(HELP_TEXT).toContain('--runtime <slug>');
    expect(HELP_TEXT).toContain('session_ref');
    for (const runtime of [...runtimes, 'cursor']) {
      expect(HELP_TEXT).toContain(runtime);
    }
  });

  it.each([...runtimes, 'cursor'])('accepts the known runtime slug %s', async (runtime) => {
    const parsed = await parseArguments([
      '--json',
      '{"specFolder":"specs/001-fixture"}',
      '--runtime',
      runtime,
    ]);

    expect(parsed.runtime).toBe(runtime);
  });

  it('rejects an unknown runtime through the argument-error path', async () => {
    await expect(parseArguments([
      '--json',
      '{"specFolder":"specs/001-fixture"}',
      '--runtime',
      'unknown-runtime',
    ])).rejects.toThrow('--runtime requires one of');
  });

  it('rejects a missing runtime value', async () => {
    await expect(parseArguments([
      '--json',
      '{"specFolder":"specs/001-fixture"}',
      '--runtime',
    ])).rejects.toThrow('--runtime requires one of');
  });
});
