// ───────────────────────────────────────────────────────────────
// MODULE: Fan-out executable version provenance
// ───────────────────────────────────────────────────────────────
//
// A lineage records which executable it ran as a content hash of the first
// PATH match. The shell runs that first executable match even when it cannot be
// read, so hashing a later match instead would record a binary that never ran.

import { afterAll, describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { chmodSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { runtimeRoot } from '../helpers/spawn-cjs';

const requireCjs = createRequire(import.meta.url);
const { buildLineageCommand } = requireCjs(resolve(runtimeRoot, 'scripts', 'fanout-run.cjs')) as {
  buildLineageCommand: (
    lineage: Record<string, unknown>,
    prompt: string,
    resolvedSandbox: string,
    resolvedPermission: string,
    options?: { env?: NodeJS.ProcessEnv },
  ) => { effectiveConfig: Record<string, unknown> };
};

const temps: string[] = [];
afterAll(() => {
  for (const dir of temps) rmSync(dir, { recursive: true, force: true });
});

function binDir(root: string, name: string, body: string, mode: number): string {
  const dir = join(root, name);
  mkdirSync(dir);
  const file = join(dir, 'codex');
  writeFileSync(file, body);
  chmodSync(file, mode);
  return dir;
}

function versionFor(pathValue: string): unknown {
  return buildLineageCommand(
    { kind: 'cli-codex', model: 'gpt-5.6-codex', reasoningEffort: 'high' },
    'prompt',
    'workspace-write',
    'default',
    { env: { ...process.env, PATH: pathValue } },
  ).effectiveConfig.executableVersion;
}

const sha = (text: string) => `sha256:${createHash('sha256').update(text).digest('hex')}`;

describe('executable version provenance follows the binary the shell would run', () => {
  const root = mkdtempSync(join(tmpdir(), 'fanout-exec-version-'));
  temps.push(root);
  const later = binDir(root, 'later', '#!/bin/sh\necho later\n', 0o755);

  it('hashes the first readable PATH match', () => {
    const first = binDir(root, 'readable', '#!/bin/sh\necho first\n', 0o755);
    expect(versionFor(`${first}:${later}`)).toBe(sha('#!/bin/sh\necho first\n'));
  });

  it.skipIf(process.getuid?.() === 0)('reports unknown for an executable first match it cannot read, not the later binary', () => {
    const first = binDir(root, 'exec-only', '#!/bin/sh\necho hidden\n', 0o111);
    expect(versionFor(`${first}:${later}`)).toBe('unknown');
  });

  it.skipIf(process.getuid?.() === 0)('passes over a first match the shell could not execute either', () => {
    const first = binDir(root, 'no-access', '#!/bin/sh\necho none\n', 0o000);
    expect(versionFor(`${first}:${later}`)).toBe(sha('#!/bin/sh\necho later\n'));
  });
});
