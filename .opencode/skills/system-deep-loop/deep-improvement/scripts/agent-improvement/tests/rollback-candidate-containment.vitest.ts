// ───────────────────────────────────────────────────────────────────
// MODULE: agent-improvement/rollback-candidate.cjs write-boundary containment
//   The target===config.target / target===manifest canonical equality gates
//   only prove internal consistency between args, config, and manifest —
//   none of which are independently trustworthy. This pins the additional
//   realpath-based containment check added as defense-in-depth: a target
//   that resolves outside the allowed roots (and outside any explicit
//   config.promotion.allowedTargetRoots allowlist) must be refused, even
//   when every equality gate agrees, and the target file must be left
//   untouched.
// ───────────────────────────────────────────────────────────────────

import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../../');
const ROLLBACK = path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/rollback-candidate.cjs',
);

let work: string;

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function buildPacket(target: string) {
  const backup = path.join(work, 'backup.txt');
  const configPath = path.join(work, 'config.json');
  const manifestPath = path.join(work, 'target_manifest.jsonc');

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, 'CURRENT TARGET BODY\n', 'utf8');
  fs.writeFileSync(backup, 'BACKUP TARGET BODY\n', 'utf8');
  writeJson(configPath, { target });
  fs.writeFileSync(
    manifestPath,
    `// agent target manifest\n${JSON.stringify({ targets: [{ path: target, classification: 'canonical' }] }, null, 2)}\n`,
    'utf8',
  );

  return { target, backup, configPath, manifestPath };
}

function runRollback(p: ReturnType<typeof buildPacket>) {
  return spawnSync(
    'node',
    [
      ROLLBACK,
      `--target=${p.target}`,
      `--backup=${p.backup}`,
      `--config=${p.configPath}`,
      `--manifest=${p.manifestPath}`,
    ],
    { encoding: 'utf8', cwd: WORKSPACE_ROOT },
  );
}

beforeEach(() => { work = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-rollback-containment-')); });
afterEach(() => { fs.rmSync(work, { recursive: true, force: true }); });

describe('agent-improvement/rollback-candidate.cjs write-boundary containment', () => {
  it('refuses to roll back when the target resolves outside the allowed roots, even though manifest/config agree', () => {
    // Target lives in a hermetic tmpdir outside .opencode/agents,
    // .claude/agents, and .opencode/skills, so it is unauthorized by
    // default — target===config.target and target===manifest canonical
    // target both still hold.
    const p = buildPacket(path.join(work, 'canonical-target.txt'));

    const result = runRollback(p);

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/resolves outside the allowed target roots/);
    expect(fs.readFileSync(p.target, 'utf8')).toBe('CURRENT TARGET BODY\n');
  });

  it('rolls back when the target resolves under an explicit config.promotion.allowedTargetRoots entry', () => {
    const p = buildPacket(path.join(work, 'canonical-target.txt'));
    const config = JSON.parse(fs.readFileSync(p.configPath, 'utf8'));
    config.promotion = { allowedTargetRoots: [work] };
    writeJson(p.configPath, config);

    const result = runRollback(p);

    expect(result.status, result.stderr).toBe(0);
    const out = JSON.parse(result.stdout);
    expect(out.status).toBe('rolled_back');
    expect(fs.readFileSync(p.target, 'utf8')).toBe('BACKUP TARGET BODY\n');
  });
});
