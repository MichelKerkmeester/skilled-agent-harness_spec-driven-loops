// ───────────────────────────────────────────────────────────────────
// MODULE: Validate Recursive Archive Reach
// ───────────────────────────────────────────────────────────────────
// An opt-in archive pass must reach the archived packets beside a track, a
// sub-track and a phase parent, while the default recursive run stays on the
// live folders. A linked archive is never followed, so validation can only
// visit packets the tree actually owns.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

// @ts-expect-error -- fixture helper is ESM JavaScript without a declaration file
import { buildSubtrackTree } from './fixtures/subtrack-tree.mjs';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const cliRoot = path.resolve(testDir, '..');
const validateScript = path.join(cliRoot, 'spec', 'validate.sh');

interface RunResult {
  status: number | null;
  stdout: string;
  stderr: string;
}

let root: string;

beforeEach(() => {
  root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'validate-archive-')));
});

afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true });
});

function runValidate(
  folder: string,
  args: string[] = [],
  extraEnv: Record<string, string> = {},
): RunResult {
  const env: NodeJS.ProcessEnv = { ...process.env };
  for (const key of ['SPECKIT_SKIP_VALIDATION', 'SPECKIT_VALIDATION', 'SPECKIT_JSON', 'SPECKIT_QUIET']) {
    delete env[key];
  }
  Object.assign(
    env,
    {
      HOOK_FLAGS_CONFIG: path.join(root, 'absent-hook-flags.env'),
      SPECKIT_RULES: 'FILE_EXISTS',
    },
    extraEnv,
  );
  const result = spawnSync('bash', [validateScript, folder, ...args], {
    encoding: 'utf8',
    env,
  });
  return { status: result.status, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

function parseReports(stdout: string): Array<Record<string, unknown>> {
  return stdout
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => JSON.parse(line) as Record<string, unknown>);
}

function visitedFolders(stdout: string): string[] {
  return parseReports(stdout).map((report) => String(report.folder));
}

function relativeFolders(specs: string, stdout: string): string[] {
  return visitedFolders(stdout).map((folder) =>
    path.relative(specs, folder).split(path.sep).join('/'));
}

function writePacket(folder: string): string {
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(path.join(folder, 'spec.md'), '# Probe\n');
  return folder;
}

function archivePacket(parent: string, name: string): string {
  return writePacket(path.join(parent, 'z_archive', name));
}

describe('recursive validation over archived packets', () => {
  it('visits an archived track packet only with --include-archive', () => {
    const specs = path.join(root, 'specs');
    const track = path.join(specs, 'demo');
    fs.mkdirSync(track, { recursive: true });
    archivePacket(track, '001-old-probe');

    const without = relativeFolders(specs, runValidate(track, ['--recursive', '--json']).stdout);
    const withFlag = relativeFolders(
      specs,
      runValidate(track, ['--recursive', '--include-archive', '--json']).stdout,
    );

    expect(without).toContain('demo');
    expect(without).not.toContain('demo/z_archive/001-old-probe');
    expect(withFlag).toContain('demo/z_archive/001-old-probe');
  });

  it('visits an archived sub-track packet only with --include-archive', () => {
    const { entries, specs } = buildSubtrackTree(root);

    const without = relativeFolders(
      specs,
      runValidate(entries.sub, ['--recursive', '--json']).stdout,
    );
    const withFlag = relativeFolders(
      specs,
      runValidate(entries.sub, ['--recursive', '--include-archive', '--json']).stdout,
    );

    expect(without).toContain('demo/sub');
    expect(without).not.toContain('demo/sub/z_archive/001-old-probe');
    expect(withFlag).toContain('demo/sub/z_archive/001-old-probe');
  });

  it('visits an archived phase beside a phase parent only with --include-archive', () => {
    const specs = path.join(root, 'specs');
    const parent = path.join(specs, 'demo', '001-outer');
    writePacket(parent);
    writePacket(path.join(parent, '001-phase-one'));
    archivePacket(parent, '002-old-phase');

    const without = relativeFolders(
      specs,
      runValidate(parent, ['--recursive', '--json']).stdout,
    );
    const withFlag = relativeFolders(
      specs,
      runValidate(parent, ['--recursive', '--include-archive', '--json']).stdout,
    );

    expect(without).toContain('demo/001-outer/001-phase-one');
    expect(without).not.toContain('demo/001-outer/z_archive/002-old-phase');
    expect(withFlag).toContain('demo/001-outer/z_archive/002-old-phase');
  });

  it('rejects --include-archive without --recursive', () => {
    const track = path.join(root, 'specs', 'demo');
    fs.mkdirSync(track, { recursive: true });

    const result = runValidate(track, ['--include-archive']);

    expect(result.status).toBe(2);
    expect(result.stderr).toContain('--include-archive requires --recursive');
  });

  it('does not follow a symlinked z_archive', () => {
    const specs = path.join(root, 'specs');
    const track = path.join(specs, 'demo');
    fs.mkdirSync(track, { recursive: true });
    const outside = path.join(root, 'outside-archive');
    writePacket(path.join(outside, '001-linked-probe'));
    fs.symlinkSync(outside, path.join(track, 'z_archive'));

    const result = runValidate(track, ['--recursive', '--include-archive', '--json']);
    const folders = visitedFolders(result.stdout);

    expect(folders).toContain(track);
    expect(folders.some((folder) => folder.startsWith(outside))).toBe(false);
  });
});
