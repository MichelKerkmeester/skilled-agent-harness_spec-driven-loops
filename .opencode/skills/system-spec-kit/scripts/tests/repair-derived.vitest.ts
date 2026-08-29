// Proves the repair tool settles derived facts and leaves authored ones alone.
//
// The refusal cases matter more than the repair cases. A tool that quietly
// widened what it was willing to write would turn a red gate green by making
// packets assert things nobody established, and that failure is invisible in a
// passing run — so the authored fixture is asserted on file bytes rather than on
// the tool's own account of what it did.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const REPO = path.resolve(__dirname, '../../../../..');
const TOOL = '.opencode/skills/system-spec-kit/scripts/spec/repair-derived.cjs';
const SPECS = path.join(REPO, 'specs');

const created: string[] = [];

afterEach(() => {
  while (created.length) {
    const dir = created.pop();
    if (dir) fs.rmSync(dir, { recursive: true, force: true });
  }
});

function run(args: string[]): { status: number; stdout: string } {
  try {
    const stdout = execFileSync('node', [TOOL, ...args], { cwd: REPO, encoding: 'utf8' });
    return { status: 0, stdout };
  } catch (error) {
    const err = error as { status?: number; stdout?: string };
    return { status: err.status ?? 1, stdout: err.stdout ?? '' };
  }
}

// Fixtures live inside the packet tree because the tool refuses anything
// outside it, which is the containment behaviour a separate test asserts.
function fixture(name: string, files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(SPECS, `.repair-fixture-${name}-`));
  created.push(dir);
  for (const [file, body] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, file), body);
  }
  return path.relative(REPO, dir);
}

function summaryDoc(pointer: string, specFolder: string): string {
  return [
    '---',
    'title: "Implementation Summary: Fixture"',
    'description: "Fixture packet used to exercise the repair tool."',
    '_memory:',
    '  continuity:',
    `    packet_pointer: "${pointer}"`,
    '---',
    '# Implementation Summary: Fixture',
    '',
    '| Field | Value |',
    '|-------|-------|',
    `| **Spec Folder** | ${specFolder} |`,
    '',
  ].join('\n');
}

describe('repair-derived', () => {
  it('refuses a target outside the packet tree', () => {
    const outside = run(['--folder', '.opencode/skills']);
    expect(outside.status).toBe(2);
    const traversal = run(['--folder', '../elsewhere']);
    expect(traversal.status).toBe(2);
  });

  it('refuses an unknown argument and a flag with no value', () => {
    expect(run(['--bogus']).status).toBe(2);
    expect(run(['--folder']).status).toBe(2);
  });

  it('rewrites a stale recorded location from the packet path on disk', () => {
    const dir = fixture('location', {
      'implementation-summary.md': summaryDoc('wrong-track/999-stale', '999-stale-name'),
    });
    const before = fs.readFileSync(path.join(REPO, dir, 'implementation-summary.md'), 'utf8');
    expect(before).toContain('999-stale-name');

    run(['--folder', dir, '--apply']);

    const after = fs.readFileSync(path.join(REPO, dir, 'implementation-summary.md'), 'utf8');
    const expectedPointer = path.relative(SPECS, path.join(REPO, dir)).split(path.sep).join('/');
    expect(after).toContain(`packet_pointer: "${expectedPointer}"`);
    expect(after).toContain(path.basename(dir));
    expect(after).not.toContain('999-stale-name');
  });

  it('leaves a packet alone when nothing derived is wrong', () => {
    const pointerFor = (dir: string) => path.relative(SPECS, path.join(REPO, dir)).split(path.sep).join('/');
    const dir = fixture('correct', { 'implementation-summary.md': summaryDoc('placeholder', 'placeholder') });
    // Write the correct values in, so the only remaining failures are authored.
    const correct = summaryDoc(pointerFor(dir), path.basename(dir));
    fs.writeFileSync(path.join(REPO, dir, 'implementation-summary.md'), correct);

    run(['--folder', dir, '--apply']);

    const after = fs.readFileSync(path.join(REPO, dir, 'implementation-summary.md'), 'utf8');
    expect(after).toBe(correct);
  });

  it('reports without writing unless application is requested', () => {
    const dir = fixture('dryrun', {
      'implementation-summary.md': summaryDoc('wrong-track/999-stale', '999-stale-name'),
    });
    const file = path.join(REPO, dir, 'implementation-summary.md');
    const before = fs.readFileSync(file, 'utf8');

    const result = run(['--folder', dir]);

    expect(fs.readFileSync(file, 'utf8')).toBe(before);
    expect(result.stdout).toContain('would repair');
  });

  it('changes nothing on a second run over the same packet', () => {
    const dir = fixture('idempotent', {
      'implementation-summary.md': summaryDoc('wrong-track/999-stale', '999-stale-name'),
    });
    const file = path.join(REPO, dir, 'implementation-summary.md');

    run(['--folder', dir, '--apply']);
    const afterFirst = fs.readFileSync(file, 'utf8');
    run(['--folder', dir, '--apply']);

    expect(fs.readFileSync(file, 'utf8')).toBe(afterFirst);
  });
});
