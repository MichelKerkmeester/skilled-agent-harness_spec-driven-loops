// ───────────────────────────────────────────────────────────────────
// MODULE: Validate Sub-Track
// ───────────────────────────────────────────────────────────────────
// Track validation treats declared sub-tracks as containers and includes their
// immediate packets and phases without changing flat-track discovery.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

// @ts-expect-error -- fixture helper is ESM JavaScript without a declaration file
import { buildFlatTree, buildSubtrackTree } from './fixtures/subtrack-tree.mjs';

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
  root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'validate-subtrack-')));
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

function relativeFolders(specs: string, stdout: string): string[] {
  return parseReports(stdout).map((report) =>
    path.relative(specs, String(report.folder)).split(path.sep).join('/'));
}

describe('recursive validation for declared sub-tracks', () => {
  it('validates a declared sub-track folder as a container in strict mode', () => {
    const { entries } = buildSubtrackTree(root);
    fs.rmSync(entries.nested, { recursive: true, force: true });
    const { status, stdout } = runValidate(entries.sub, ['--strict']);

    expect(status).toBe(0);
    expect(stdout).toContain('RESULT: PASSED');
  });

  it('does not validate a symlinked description as a sub-track container', () => {
    const { entries } = buildSubtrackTree(root);
    fs.rmSync(path.join(entries.sub, 'description.json'));
    const outsideDescription = path.join(root, 'outside-description.json');
    fs.writeFileSync(outsideDescription, JSON.stringify({ level: 'sub-track', specFolder: 'demo/sub' }));
    fs.symlinkSync(outsideDescription, path.join(entries.sub, 'description.json'));

    const result = runValidate(entries.sub, ['--strict', '--json']);

    const report = parseReports(result.stdout)[0];
    expect(report?.entries).toEqual(expect.any(Array));
    expect((report?.entries as Array<{ rule: string }>).map(({ rule }) => rule)).not.toContain('TRACK_ROOT');
  });

  it('includes sub-track packets at track depth while skipping archives and symlinks', () => {
    const { entries, specs } = buildSubtrackTree(root);
    const result = runValidate(path.join(specs, 'demo'), ['--recursive', '--json']);
    const folders = relativeFolders(specs, result.stdout);

    expect(folders).toContain('demo/sub');
    expect(folders).toContain('demo/sub/001-nested-probe');
    // Same depth as a flat track: its packets, not their phases.
    expect(folders).not.toContain('demo/sub/001-nested-probe/001-phase-one');
    expect(folders).not.toContain('demo/sub/z_archive/001-old-probe');
    expect(folders).not.toContain('demo/linked/001-outside-probe');
    expect(folders).not.toContain('demo/loose');
    expect(result.stderr.match(/Skipped symlinked sub-track/g) ?? []).toHaveLength(1);
  });

  it('finds every packet name the track reader counts inside a sub-track', () => {
    const { entries, specs } = buildSubtrackTree(root);
    for (const name of ['002_underscored', '003', '004x']) {
      fs.mkdirSync(path.join(entries.sub, name), { recursive: true });
      fs.writeFileSync(path.join(entries.sub, name, 'spec.md'), '# Probe\n');
    }
    const result = runValidate(path.join(specs, 'demo'), ['--recursive', '--json']);
    const folders = relativeFolders(specs, result.stdout);

    expect(folders).toContain('demo/sub/002_underscored');
    expect(folders).toContain('demo/sub/003');
    expect(folders).not.toContain('demo/sub/004x');
  });

  it('skips a symlinked numbered packet inside a sub-track', () => {
    const { entries, specs } = buildSubtrackTree(root);
    const outsidePacket = path.join(root, 'outside-packet');
    fs.mkdirSync(outsidePacket, { recursive: true });
    fs.writeFileSync(path.join(outsidePacket, 'spec.md'), '# Outside packet\n');
    fs.symlinkSync(outsidePacket, path.join(entries.sub, '002-linked'));

    const result = runValidate(path.join(specs, 'demo'), ['--recursive', '--json']);

    expect(relativeFolders(specs, result.stdout)).not.toContain('demo/sub/002-linked');
  });

  it('keeps the flat-track recursive folder list unchanged', () => {
    const { specs } = buildFlatTree(root);
    const result = runValidate(path.join(specs, 'alpha'), ['--recursive', '--json']);

    expect(relativeFolders(specs, result.stdout)).toEqual([
      'alpha',
      'alpha/001-one',
      'alpha/002-two',
    ]);
  });

  it('does not grant a container exemption to undeclared folders or packets', () => {
    const { entries } = buildSubtrackTree(root);
    const looseReport = parseReports(runValidate(entries.loose, ['--json']).stdout)[0];
    const packetReport = parseReports(runValidate(entries.nested, ['--json']).stdout)[0];

    expect((looseReport.entries as Array<{ rule: string }>).map(({ rule }) => rule)).not.toContain('TRACK_ROOT');
    expect((packetReport.entries as Array<{ rule: string }>).map(({ rule }) => rule)).not.toContain('TRACK_ROOT');
  });
});
