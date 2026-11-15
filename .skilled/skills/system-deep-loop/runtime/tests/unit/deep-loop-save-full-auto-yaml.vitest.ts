// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Loop Save Full-Auto YAML Tests
// ───────────────────────────────────────────────────────────────────
//
// The continuity writer only plans unless it runs with --full-auto, and a
// full-auto save writes continuity only from the four continuity fields. A loop
// whose save step drops either one finishes without updating continuity.

import { describe, expect, it } from 'vitest';

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ASSETS = fileURLToPath(new URL('../../../../../commands/deep/assets/', import.meta.url));
const SAVE_COMMAND = /generate-context\.js \/tmp\/save-context-data-<session-id>\.json \{spec_folder\}( --full-auto)?"/g;
const WORKFLOWS = [
  'deep-review.yaml',
  'deep-research.yaml',
];

describe('deep loop save step', () => {
  it.each(WORKFLOWS)('%s runs the continuity writer in full-auto mode', (name) => {
    const text = readFileSync(`${ASSETS}${name}`, 'utf8');
    const commands = [...text.matchAll(SAVE_COMMAND)];

    expect(commands).toHaveLength(1);
    expect(commands[0][1]).toBe(' --full-auto');
  });

  it.each(WORKFLOWS)(
    '%s puts the four continuity fields in its example payload',
    (name) => {
      const text = readFileSync(`${ASSETS}${name}`, 'utf8');
      for (const field of ['recent_action', 'next_safe_action', 'blockers', 'key_files']) {
        expect(text).toContain(`"${field}": `);
      }
    },
  );
});
