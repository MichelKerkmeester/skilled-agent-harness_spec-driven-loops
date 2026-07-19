// ───────────────────────────────────────────────────────────────
// MODULE: processLiveness drift guard
// ───────────────────────────────────────────────────────────────
// The PID-liveness probe (process.kill(pid, 0) classified into
// alive / dead / unknown-eperm) is the basis of every launcher's
// lease-reclaim decision. The canonical implementation lives in the
// model-server supervision library; the code-index launcher keeps a
// LOCAL copy because it does not import that library. This guard fails
// if the forked copy drifts from the canonical source so the
// lease-reclaim safety semantics cannot silently diverge between the
// memory and code-index daemons.

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../../../../../..');

const canonicalPath = resolve(repoRoot, '.opencode/bin/lib/model-server-supervision.cjs');
const forkPath = resolve(repoRoot, '.opencode/bin/mk-code-index-launcher.cjs');

// Extract the body of the `function processLiveness(pid) { ... }` declaration as a normalized string.
// Brace-matches from the opening `{` so a change to the function body (not just a one-line edit) is
// detected. Normalizes line endings only; indentation and content must stay identical.
function extractProcessLiveness(source: string): string {
  const normalized = source.replace(/\r\n/g, '\n');
  const marker = 'function processLiveness(pid) {';
  const start = normalized.indexOf(marker);
  if (start === -1) {
    throw new Error(`processLiveness declaration not found in source`);
  }
  let depth = 0;
  let bodyStart = -1;
  for (let i = start; i < normalized.length; i += 1) {
    const char = normalized[i];
    if (char === '{') {
      if (depth === 0) {
        bodyStart = i;
      }
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        return normalized.slice(bodyStart, i + 1);
      }
    }
  }
  throw new Error('Unbalanced braces while extracting processLiveness body');
}

describe('processLiveness drift guard (code-index launcher fork vs canonical supervision lib)', () => {
  it('keeps the code-index launcher copy of processLiveness identical to the canonical source', () => {
    const canonicalBody = extractProcessLiveness(readFileSync(canonicalPath, 'utf8'));
    const forkBody = extractProcessLiveness(readFileSync(forkPath, 'utf8'));

    expect(
      forkBody,
      [
        'mk-code-index-launcher.cjs has a forked processLiveness that drifted from the canonical copy',
        'in .opencode/bin/lib/model-server-supervision.cjs.',
        'Re-sync the two functions (the supervision-lib copy is the source of truth) so every launcher',
        'classifies PID liveness with the same alive/dead/unknown-eperm semantics for lease reclaim.',
      ].join(' '),
    ).toBe(canonicalBody);
  });
});
