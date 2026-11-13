// ───────────────────────────────────────────────────────────────
// MODULE: Measure Brief Cost
// ───────────────────────────────────────────────────────────────

// Pins the brief-cost reader to the live head alone. A hook that answers from
// its fallback or outage text still prints a brief, but those bytes are not
// what a working install sends, so the reader marks each row and counts the
// summary over live rows. A selection with no live row is refused rather than
// reported as a cost of zero.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT = resolve(HERE, '../scripts/measure-brief-cost.mjs');

const CORPUS_REL =
  '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl';
const HOOK_REL = '.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js';

const LIVE_HEAD = 'Advisor: live · sk-doc → /create:readme';
const LIVE_CONTEXT = `${LIVE_HEAD}\nsecond line`;
const STALE_HEAD = 'Advisor: stale';

const CORPUS_ROWS = [
  { id: 'cost-live', prompt: 'live row', row_type: 'typed', split: 'none' },
  { id: 'cost-stale', prompt: 'stale row', row_type: 'typed', split: 'none' },
] as const;

// The stub stands in for the hook shim. It keeps the two shapes the reader has
// to tell apart: a live head for the prompt that asks for one, and the fallback
// text every other prompt gets when the advisor cannot answer. When
// COST_PROBE_FILE is set, it also records the temp folder it inherited, so a
// test can prove each hook child ran inside the run's sandbox.
const HOOK_STUB = `const { appendFileSync, readFileSync } = require('node:fs');

const input = JSON.parse(readFileSync(0, 'utf8'));
const head = input.prompt.includes('live') ? '${LIVE_HEAD}' : '${STALE_HEAD}';
const context = head + '\\n' + 'second line';
if (process.env.COST_PROBE_FILE) {
  appendFileSync(process.env.COST_PROBE_FILE, process.env.TMPDIR + '\\n');
}
process.stdout.write(JSON.stringify({ hookSpecificOutput: { additionalContext: context } }));
`;

function makeRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'brief-cost-'));
  const corpusPath = join(root, CORPUS_REL);
  mkdirSync(dirname(corpusPath), { recursive: true });
  writeFileSync(corpusPath, `${CORPUS_ROWS.map((row) => JSON.stringify(row)).join('\n')}\n`);
  const hookPath = join(root, HOOK_REL);
  mkdirSync(dirname(hookPath), { recursive: true });
  writeFileSync(hookPath, HOOK_STUB);
  return root;
}

function runScript(
  args: readonly string[],
  env: Record<string, string> = {},
): ReturnType<typeof spawnSync> {
  return spawnSync(process.execPath, [SCRIPT, ...args], {
    encoding: 'utf8',
    timeout: 20_000,
    env: { ...process.env, ...env },
  });
}

describe('brief cost measurement', () => {
  it('measures the live rows and leaves the stale row out of the summary', () => {
    const root = makeRoot();
    try {
      const result = runScript(['--root', root]);

      expect(result.status).toBe(0);
      const summary = JSON.parse(String(result.stdout));
      expect(summary.liveRows).toBe(1);
      expect(summary.rows).toHaveLength(2);
      const stale = summary.rows.find((row: { id: string }) => row.id === 'cost-stale');
      expect(stale.live).toBe(false);
      expect(summary.medianHeadBytes).toBe(Buffer.byteLength(LIVE_HEAD, 'utf8'));
      expect(summary.medianBytes).toBe(Buffer.byteLength(LIVE_CONTEXT, 'utf8'));
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('refuses a selection whose only row is stale', () => {
    const root = makeRoot();
    try {
      const result = runScript(['--root', root, '--rows', 'cost-stale']);

      expect(result.status).toBe(2);
      expect(JSON.parse(String(result.stdout))).toEqual({
        error: 'degraded_brief',
        rows: 1,
        liveRows: 0,
      });
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('runs each hook child with TMPDIR inside its sandbox', () => {
    const root = makeRoot();
    const probeFile = join(root, 'tmpdirs.txt');
    try {
      const result = runScript(['--root', root], { COST_PROBE_FILE: probeFile });

      expect(result.status).toBe(0);
      const recorded = readFileSync(probeFile, 'utf8').trim().split('\n').filter(Boolean);
      expect(recorded).toHaveLength(2);
      for (const dir of recorded) {
        expect(basename(dir).startsWith('ssa-cost-')).toBe(true);
        expect(dir).not.toBe(tmpdir());
        expect(existsSync(dir)).toBe(false);
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
