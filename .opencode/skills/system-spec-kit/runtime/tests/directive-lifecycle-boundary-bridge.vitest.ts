// ───────────────────────────────────────────────────────────────
// MODULE: Directive Lifecycle Boundary Bridge Tests
// ───────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { notifyDirectiveLifecycleBoundary } from '../hooks/claude/directive-lifecycle-boundary.js';

const packageRoot = resolve(import.meta.dirname, '..');
const repoRoot = resolve(packageRoot, '../../../..');
let tempDir = '';
const ORIGINAL_BOUNDARY_TARGET = process.env.SPECKIT_DIRECTIVE_LIFECYCLE_BOUNDARY_TARGET;

function runBoundaryOwner(relativeTarget: string, payload: Record<string, unknown> | string) {
  tempDir ||= mkdtempSync(join(tmpdir(), 'directive-boundary-bridge-'));
  const receipt = join(tempDir, `receipt-${Math.random().toString(36).slice(2)}.json`);
  const stub = join(tempDir, 'boundary-target.mjs');
  writeFileSync(stub, "import fs from 'node:fs'; const chunks=[]; for await (const chunk of process.stdin) chunks.push(chunk); fs.writeFileSync(process.env.BOUNDARY_RECEIPT, Buffer.concat(chunks));\n");
  const result = spawnSync(process.execPath, [join(packageRoot, relativeTarget)], {
    cwd: repoRoot,
    input: typeof payload === 'string' ? payload : JSON.stringify(payload),
    encoding: 'utf8',
    timeout: 8_000,
    env: {
      ...process.env,
      SPECKIT_DIRECTIVE_LIFECYCLE_BOUNDARY_TARGET: stub,
      BOUNDARY_RECEIPT: receipt,
    },
  });
  expect(result.status, result.stderr).toBe(0);
  return JSON.parse(readFileSync(receipt, 'utf8')) as Record<string, unknown>;
}

afterEach(() => {
  if (tempDir) rmSync(tempDir, { recursive: true, force: true });
  tempDir = '';
  if (ORIGINAL_BOUNDARY_TARGET === undefined) delete process.env.SPECKIT_DIRECTIVE_LIFECYCLE_BOUNDARY_TARGET;
  else process.env.SPECKIT_DIRECTIVE_LIFECYCLE_BOUNDARY_TARGET = ORIGINAL_BOUNDARY_TARGET;
});

describe('registered host lifecycle coupling', () => {
  it('session start advances the identified session epoch', () => {
    const received = runBoundaryOwner('dist/hooks/claude/session-prime.js', {
      session_id: 's-start',
      source: 'startup',
    });
    expect(received).toMatchObject({ session_id: 's-start', boundary: 'startup' });
  });

  it('pre-compaction advances the identified session epoch', () => {
    const received = runBoundaryOwner('dist/hooks/claude/compact-inject.js', {
      session_id: 's-compact',
      trigger: 'manual',
    });
    expect(received).toMatchObject({ session_id: 's-compact', boundary: 'compact' });
  });

  it('missing session identity advances the global generation', () => {
    const received = runBoundaryOwner('dist/hooks/claude/session-prime.js', {
      source: 'resume',
    });
    expect(received).toMatchObject({ session_id: null, boundary: 'resume' });
  });

  it('does not acknowledge a failed canonical boundary mutation', () => {
    tempDir ||= mkdtempSync(join(tmpdir(), 'directive-boundary-bridge-'));
    const failingTarget = join(tempDir, 'failing-boundary.mjs');
    writeFileSync(failingTarget, 'process.exit(1);\n');
    process.env.SPECKIT_DIRECTIVE_LIFECYCLE_BOUNDARY_TARGET = failingTarget;
    expect(notifyDirectiveLifecycleBoundary({ sessionId: 's-fail', boundary: 'resume' })).toBe(false);
  });

  it('post-compaction uses the same canonical boundary bridge', () => {
    const received = runBoundaryOwner('hooks/devin/post-compaction.cjs', {
      session_id: 's-post',
      summary: 'resume safely',
      cwd: join(repoRoot, '.opencode'),
    });
    expect(received).toMatchObject({ session_id: 's-post', boundary: 'post-compact' });
  });

  it('post-compaction globally invalidates malformed payloads', () => {
    const received = runBoundaryOwner('hooks/devin/post-compaction.cjs', '{not-json');
    expect(received).toMatchObject({ session_id: null, boundary: 'post-compact' });
  });
});
