import { describe, expect, it } from 'vitest';

import {
  createCodeIndexHarness,
  expectBlockedRender,
  parseJsonOutput,
  registerCodeIndexCliTeardown,
} from './code-index-cli-harness.js';

registerCodeIndexCliTeardown();

const diff = [
  'diff --git a/src/example.ts b/src/example.ts',
  'index 1111111..2222222 100644',
  '--- a/src/example.ts',
  '+++ b/src/example.ts',
  '@@ -1 +1 @@',
  '-export const value = 1;',
  '+export const value = 2;',
].join('\n');

const readCommands: Array<{ name: string; args: string[] }> = [
  {
    name: 'code-graph-query',
    args: ['code-graph-query', '--operation', 'outline', '--subject', 'missing-symbol'],
  },
  {
    name: 'code-graph-context',
    args: ['code-graph-context', '--query-mode', 'neighborhood', '--input', 'missing symbol', '--subject', 'missing-symbol'],
  },
  {
    name: 'detect changes',
    args: ['detect-changes', '--diff', diff],
  },
];

const formats = ['json', 'text', 'jsonl'];

describe('code-index CLI blocked-read rendering', () => {
  for (const command of readCommands) {
    for (const format of formats) {
      it(`renders ${command.name} stale readiness as blocked ${format}`, async () => {
        const harness = createCodeIndexHarness(`${command.name}-${format}`);
        harness.env.SPECKIT_CODE_GRAPH_INDEX_SKILLS = 'true';
        const result = await harness.runCli([...command.args, '--format', format]);

        // Exit-code policy: a blocked read is a rendered result, not an error —
        // the CLI must exit 0 (EXIT_SUCCESS), reserving 1/64/69/75 for failures.
        expect(result.signal).toBeNull();
        expect(result.exitCode).toBe(0);
        if (format === 'json' || format === 'jsonl') {
          expectBlockedRender(parseJsonOutput(result));
        } else {
          expectBlockedRender(`${result.stdout}\n${result.stderr}`);
        }
      });
    }
  }
});
