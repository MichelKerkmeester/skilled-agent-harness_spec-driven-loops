// ───────────────────────────────────────────────────────────────────
// MODULE: Repair Derived Test
// ───────────────────────────────────────────────────────────────────

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
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

const TOOL_TREE = path.resolve(__dirname, '../../../../../..');
const TOOL = '.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs';

// The tool takes its working directory as the repository root and refuses any
// target outside <root>/specs, so each run works in a throwaway root. That root
// links the checked-in tool tree and owns the specs/ folder the fixtures go in,
// which keeps every fixture out of the real specs root.
let ROOT = '';
let SPECS = '';

beforeAll(() => {
  ROOT = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'repair-derived-')));
  SPECS = path.join(ROOT, 'specs');
  fs.mkdirSync(SPECS);
  fs.symlinkSync(path.join(TOOL_TREE, '.skilled'), path.join(ROOT, '.skilled'), 'dir');
});

afterAll(() => {
  if (!ROOT) return;
  // Remove the tool-tree link before the recursive remove so it never walks into the real tree. Without recursive, rmSync removes the link itself, and force tolerates setup that failed before the link existed.
  fs.rmSync(path.join(ROOT, '.skilled'), { force: true });
  fs.rmSync(ROOT, { recursive: true, force: true });
});

const created: string[] = [];

afterEach(() => {
  while (created.length) {
    const dir = created.pop();
    if (dir) fs.rmSync(dir, { recursive: true, force: true });
  }
});

function run(args: string[], env?: Record<string, string>): { status: number; stdout: string } {
  try {
    const stdout = execFileSync('node', [TOOL, ...args], {
      cwd: ROOT,
      encoding: 'utf8',
      env: env ? { ...process.env, ...env } : process.env,
    });
    return { status: 0, stdout };
  } catch (error) {
    const err = error as { status?: number; stdout?: string };
    return { status: err.status ?? 1, stdout: err.stdout ?? '' };
  }
}

// Fixtures live inside the packet tree because the tool refuses anything
// outside it, which is the containment behaviour a separate test asserts.
// They nest under a staging folder rather than sitting directly in the specs
// root: the validator classifies a direct child of the root that lacks the
// packet naming convention as a track drawer and applies no packet rules to
// it, which would leave the tool nothing derivable to report or repair.
function fixture(name: string, files: Record<string, string>): string {
  const staging = fs.mkdtempSync(path.join(SPECS, '.repair-fixture-'));
  created.push(staging);
  const dir = fs.mkdtempSync(path.join(staging, `${name}-`));
  created.push(dir);
  for (const [file, body] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, file), body);
  }
  return path.relative(ROOT, dir);
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
    const outside = run(['--folder', '.skilled/skills']);
    expect(outside.status).toBe(2);
    const traversal = run(['--folder', '../elsewhere']);
    expect(traversal.status).toBe(2);
  });

  it('refuses an unknown argument and a flag with no value', () => {
    expect(run(['--bogus']).status).toBe(2);
    expect(run(['--folder']).status).toBe(2);
  });

  // A bare path used to be ignored, which quietly promoted a one-packet command
  // with a dropped flag name into a rewrite of every packet in the tree.
  it('refuses a bare path rather than treating it as an unscoped run', () => {
    expect(run(['specs/sk-git', '--apply']).status).toBe(2);
  });

  // --folder became repeatable so a caller with a known packet set pays node's
  // startup once rather than per packet. Both cases below are regressions that
  // shipped with that change and were found by review rather than by this file.
  it('accepts a repeated --folder and inspects each packet once', () => {
    const a = fixture('batch-a', {});
    const b = fixture('batch-b', {});
    const result = run(['--folder', a, '--folder', b]);
    expect(result.stdout).toMatch(/inspected=2/);
  });

  // A repeated path used to become two targets, and with --apply two workers
  // could then re-derive the same packet at the same time.
  it('counts a folder given twice as one target', () => {
    const only = fixture('batch-dupe', {});
    const result = run(['--folder', only, '--folder', only]);
    expect(result.stdout).toMatch(/inspected=1/);
  });

  // Collecting folders into an array dropped --roots from the validation loop,
  // so a rejected root passed silently whenever a --folder was also supplied.
  it('still refuses a bad --roots when a --folder is present', () => {
    const good = fixture('batch-roots', {});
    expect(run(['--folder', good, '--roots', '/etc']).status).toBe(2);
  });

  it('rewrites a stale recorded location from the packet path on disk', () => {
    const dir = fixture('location', {
      'implementation-summary.md': summaryDoc('wrong-track/999-stale', '999-stale-name'),
    });
    const before = fs.readFileSync(path.join(ROOT, dir, 'implementation-summary.md'), 'utf8');
    expect(before).toContain('999-stale-name');

    run(['--folder', dir, '--apply']);

    const after = fs.readFileSync(path.join(ROOT, dir, 'implementation-summary.md'), 'utf8');
    const expectedPointer = path.relative(SPECS, path.join(ROOT, dir)).split(path.sep).join('/');
    expect(after).toContain(`packet_pointer: "${expectedPointer}"`);
    expect(after).toContain(path.basename(dir));
    expect(after).not.toContain('999-stale-name');
  });

  // An archived packet records where it lives now. The walk used to skip every
  // z_archive tree, and description.json kept the path a packet was archived
  // from, so an archive move left failures no tool would repair.
  it('walks into an archive and rewrites an archived packet\'s recorded paths', () => {
    const staging = fs.mkdtempSync(path.join(SPECS, '.repair-fixture-'));
    created.push(staging);
    const dir = path.join(staging, 'z_archive', '001-archived');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'implementation-summary.md'), summaryDoc('old-track/001-archived', '001-archived'));
    fs.writeFileSync(path.join(dir, 'description.json'), `${JSON.stringify({ specFolder: 'old-track/001-archived', title: 'Fixture' }, null, 2)}\n`);
    fs.writeFileSync(path.join(dir, 'graph-metadata.json'), `${JSON.stringify({ schema_version: 1, packet_id: 'old-track/001-archived', spec_folder: 'old-track/001-archived', parent_id: 'old-track', parent_id_review_required: true, children_ids: [] }, null, 2)}\n`);

    run(['--roots', path.relative(ROOT, staging), '--apply']);

    const expected = path.relative(SPECS, dir).split(path.sep).join('/');
    expect(JSON.parse(fs.readFileSync(path.join(dir, 'description.json'), 'utf8')).specFolder).toBe(expected);
    const graph = JSON.parse(fs.readFileSync(path.join(dir, 'graph-metadata.json'), 'utf8'));
    expect(graph.parent_id).toBeNull();
    expect(graph.parent_id_review_required).toBeUndefined();
    expect(fs.readFileSync(path.join(dir, 'implementation-summary.md'), 'utf8')).toContain(`packet_pointer: "${expected}"`);
  });

  it('leaves a packet alone when nothing derived is wrong', () => {
    const pointerFor = (dir: string) => path.relative(SPECS, path.join(ROOT, dir)).split(path.sep).join('/');
    const dir = fixture('correct', { 'implementation-summary.md': summaryDoc('placeholder', 'placeholder') });
    // Write the correct values in, so the only remaining failures are authored.
    const correct = summaryDoc(pointerFor(dir), path.basename(dir));
    fs.writeFileSync(path.join(ROOT, dir, 'implementation-summary.md'), correct);

    run(['--folder', dir, '--apply']);

    const after = fs.readFileSync(path.join(ROOT, dir, 'implementation-summary.md'), 'utf8');
    expect(after).toBe(correct);
  });

  it('reports without writing unless application is requested', () => {
    const dir = fixture('dryrun', {
      'implementation-summary.md': summaryDoc('wrong-track/999-stale', '999-stale-name'),
    });
    const file = path.join(ROOT, dir, 'implementation-summary.md');
    const before = fs.readFileSync(file, 'utf8');

    const result = run(['--folder', dir]);

    expect(fs.readFileSync(file, 'utf8')).toBe(before);
    expect(result.stdout).toContain('would repair');
  });

  // Editing a document invalidates the fingerprint taken over it, so the
  // re-derive is part of the repair. It has to appear in the plan as well as
  // happen: a step that only ever ran under --apply was a write the report
  // never mentioned and the exit code never counted.
  it('names the re-derive in the plan whenever it edits a document', () => {
    const dir = fixture('rederive', {
      'implementation-summary.md': summaryDoc('wrong-track/999-stale', '999-stale-name'),
    });

    const result = run(['--folder', dir]);

    expect(result.stdout).toContain('would repair');
    expect(result.stdout).toContain('re-derive graph metadata');
    expect(result.status).toBe(1);
  });

  // The recorded location lives in the leading YAML block. A pointer in the
  // body is an illustration of the format, and rewriting it corrupts the
  // passage that explains it.
  it('leaves a packet pointer outside the frontmatter alone', () => {
    const body = [
      '---',
      'title: "Implementation Summary: Fixture"',
      'description: "Fixture packet with no recorded pointer of its own."',
      '---',
      '# Implementation Summary: Fixture',
      '',
      'Continuity records the packet like this:',
      '',
      '    packet_pointer: "some/documented/example"',
      '',
    ].join('\n');
    const dir = fixture('bodypointer', { 'implementation-summary.md': body });
    const file = path.join(ROOT, dir, 'implementation-summary.md');

    run(['--folder', dir, '--apply']);

    expect(fs.readFileSync(file, 'utf8')).toBe(body);
  });

  // A repair that cannot land has to say so and fail the run. Reporting nothing
  // and exiting 1 reads as a clean dry run to anything gating on the code.
  it.skipIf(process.getuid?.() === 0)('reports a repair it could not make and exits 2', () => {
    const dir = fixture('unwritable', {
      'implementation-summary.md': summaryDoc('wrong-track/999-stale', '999-stale-name'),
    });
    const packet = path.join(ROOT, dir);
    const file = path.join(packet, 'implementation-summary.md');
    const before = fs.readFileSync(file, 'utf8');

    let result: { status: number; stdout: string };
    fs.chmodSync(packet, 0o555);
    try {
      result = run(['--folder', dir, '--apply']);
    } finally {
      fs.chmodSync(packet, 0o755);
    }

    expect(result.status).toBe(2);
    expect(result.stdout).toContain('FAILED');
    expect(fs.readFileSync(file, 'utf8')).toBe(before);
    // No half-written sibling left behind by the interrupted swap.
    expect(fs.readdirSync(packet)).toEqual(['implementation-summary.md']);
  });

  it('changes nothing on a second run over the same packet', () => {
    const dir = fixture('idempotent', {
      'implementation-summary.md': summaryDoc('wrong-track/999-stale', '999-stale-name'),
    });
    const file = path.join(ROOT, dir, 'implementation-summary.md');

    run(['--folder', dir, '--apply']);
    const afterFirst = fs.readFileSync(file, 'utf8');
    run(['--folder', dir, '--apply']);

    expect(fs.readFileSync(file, 'utf8')).toBe(afterFirst);
  });

  // The pre-commit gate blocks whenever this tool exits non-zero. A switched-off
  // validator used to print nothing under --json, which read as an unreadable
  // packet, so an operator who had turned validation off could not commit.
  it('passes a packet it would otherwise repair when validation is switched off', () => {
    const dir = fixture('switchedoff', {
      'implementation-summary.md': summaryDoc('wrong-track/999-stale', '999-stale-name'),
    });
    const file = path.join(ROOT, dir, 'implementation-summary.md');
    const before = fs.readFileSync(file, 'utf8');

    const result = run(['--folder', dir, '--apply'], { SPECKIT_SKIP_VALIDATION: '1' });

    expect(result.status).toBe(0);
    expect(result.stdout).not.toContain('UNREADABLE');
    expect(result.stdout).toContain('inspected=1 repaired=0 failed=0');
    expect(fs.readFileSync(file, 'utf8')).toBe(before);
  });
});
