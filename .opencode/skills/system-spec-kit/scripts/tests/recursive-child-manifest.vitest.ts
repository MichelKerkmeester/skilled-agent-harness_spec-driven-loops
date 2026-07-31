import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scriptsRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(scriptsRoot, '..', '..', '..', '..');
const validateScript = path.join(scriptsRoot, 'spec', 'validate.sh');
const manifestCheck = path.resolve(
  repoRoot,
  '.opencode/specs/system-deep-loop/036-deep-loop-innovation/016-whole-system-gate/check-goal-file-manifest.sh',
);
const manifestPath = path.resolve(
  repoRoot,
  '.opencode/specs/system-deep-loop/036-deep-loop-innovation/016-whole-system-gate/goal-file-manifest.txt',
);
const sourcePacket = path.resolve(
  repoRoot,
  '.opencode/specs/system-deep-loop/036-deep-loop-innovation/001-deep-loop-market-research',
);
const temporaryRoots = new Set<string>();

function makeWorkspace(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'recursive-child-manifest-'));
  temporaryRoots.add(root);
  return root;
}

function copyPacket(target: string): void {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(sourcePacket)) {
    fs.cpSync(path.join(sourcePacket, entry), path.join(target, entry), { recursive: true });
  }
}

function manifestHash(entries: string[]): string {
  return createHash('sha256').update(`${entries.join('\n')}\n`).digest('hex');
}

function runValidate(parent: string, manifest: string, hash: string) {
  return spawnSync('bash', [validateScript, parent, '--recursive', '--strict'], {
    cwd: repoRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      SPECKIT_RULES: 'FILE_EXISTS',
      SPECKIT_CHILD_MANIFEST_FILE: manifest,
      SPECKIT_CHILD_MANIFEST_SHA256: hash,
    },
  });
}

afterEach(() => {
  for (const root of temporaryRoots) fs.rmSync(root, { recursive: true, force: true });
  temporaryRoots.clear();
});

describe('recursive child manifest boundary', () => {
  it('checks manifest membership against git and fails closed without git', () => {
    const tracked = spawnSync('bash', [manifestCheck, manifestPath, repoRoot], {
      cwd: repoRoot,
      encoding: 'utf8',
    });
    expect(tracked.status).toBe(0);
    expect(tracked.stdout).toContain('all entries are tracked');

    const workspace = makeWorkspace();
    const untrackedManifest = path.join(workspace, 'manifest.txt');
    fs.writeFileSync(untrackedManifest, 'not-tracked.txt\n', 'utf8');
    const untracked = spawnSync('bash', [manifestCheck, untrackedManifest, repoRoot], {
      cwd: repoRoot,
      encoding: 'utf8',
    });
    expect(untracked.status).toBe(1);
    expect(untracked.stderr).toContain('NOT TRACKED: not-tracked.txt');

    const unavailable = spawnSync('bash', [manifestCheck, manifestPath, repoRoot], {
      cwd: repoRoot,
      encoding: 'utf8',
      env: { ...process.env, SPECKIT_MANIFEST_GIT_BIN: 'missing-git-command' },
    });
    expect(unavailable.status).toBe(2);
    expect(unavailable.stderr).toContain('FAIL CLOSED: git is unavailable');
  });

  it('validates the declared set and rejects an unlisted child', () => {
    const workspace = makeWorkspace();
    const parent = path.join(workspace, 'parent');
    const declaredChild = path.join(parent, '001-deep-loop-market-research');
    const extraChild = path.join(parent, '002-unlisted-child');
    fs.mkdirSync(parent, { recursive: true });
    copyPacket(parent);
    copyPacket(declaredChild);

    const entries = ['001-deep-loop-market-research'];
    const manifest = path.join(workspace, 'child-manifest.txt');
    fs.writeFileSync(manifest, `${entries.join('\n')}\n`, 'utf8');
    const hash = manifestHash(entries);

    const declaredSet = runValidate(parent, manifest, hash);
    expect(declaredSet.status).toBe(0);
    expect(declaredSet.stdout).toContain(`Child manifest accepted: 1 entries (sha256: ${hash})`);

    copyPacket(extraChild);
    const unlistedChild = runValidate(parent, manifest, hash);
    expect(unlistedChild.status).toBe(2);
    expect(`${unlistedChild.stdout}\n${unlistedChild.stderr}`).toContain(
      'on-disk child is absent from the declared manifest: 002-unlisted-child',
    );
  });
});
