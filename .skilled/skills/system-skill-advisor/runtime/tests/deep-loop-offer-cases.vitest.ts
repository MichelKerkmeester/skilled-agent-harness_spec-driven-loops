// ───────────────────────────────────────────────────────────────
// MODULE: Deep-loop offer cases
// ───────────────────────────────────────────────────────────────

// The Python fallback carries its own copy of the deep-loop offer gate, so both
// gates read one fixture file. A case that fails here and passes in the Python
// suite, or the reverse, means the two copies drifted apart.

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { asksForLoopRun, isStuckRunComplaint, isWritingAboutTopic } from '../lib/command-attach.js';

interface OfferCase {
  readonly id: string;
  readonly prompt: string;
  readonly asksForLoopRun: boolean;
  readonly stuckRun: boolean;
  readonly writingAbout: boolean;
}

const FIXTURE = resolve(dirname(fileURLToPath(import.meta.url)), 'fixtures/deep-loop-offer-cases.json');
const { cases } = JSON.parse(readFileSync(FIXTURE, 'utf8')) as { readonly cases: readonly OfferCase[] };

describe('deep-loop offer cases shared with the Python fallback', () => {
  it('has cases on both sides of the gate', () => {
    expect(cases.some((entry) => entry.asksForLoopRun)).toBe(true);
    expect(cases.some((entry) => !entry.asksForLoopRun)).toBe(true);
  });

  it.each(cases.map((entry) => [entry.id, entry] as const))('%s', (_id, entry) => {
    expect(asksForLoopRun(entry.prompt), 'asks for a loop run').toBe(entry.asksForLoopRun);
    expect(isStuckRunComplaint(entry.prompt), 'stuck run').toBe(entry.stuckRun);
    expect(isWritingAboutTopic(entry.prompt), 'writing about the loop').toBe(entry.writingAbout);
  });
});
