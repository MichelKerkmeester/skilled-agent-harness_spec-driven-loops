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
import { pathToFileURL } from 'node:url';
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

// The optional cwd runs the tool from another repository root, for a test whose
// workspace needs an anchor the shared root does not carry.
function run(args: string[], env?: Record<string, string>, nodeFlags: string[] = [], cwd: string = ROOT): { status: number; stdout: string } {
  try {
    const stdout = execFileSync('node', [...nodeFlags, TOOL, ...args], {
      cwd,
      encoding: 'utf8',
      env: env ? { ...process.env, ...env } : process.env,
    });
    return { status: 0, stdout };
  } catch (error) {
    const err = error as { status?: number; stdout?: string };
    return { status: err.status ?? 1, stdout: err.stdout ?? '' };
  }
}

// Writes a module that pins process.pid before the tool starts, so a test can name
// the temp path the tool would choose. The module lives outside the fixture root.
function pinPidPreload(pid: number): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'repair-pin-'));
  created.push(dir);
  const file = path.join(dir, 'pin-pid.mjs');
  fs.writeFileSync(file, `Object.defineProperty(process, 'pid', { value: ${pid} });\n`);
  return file;
}

// Writes a module that replaces the target with a link to the replacement on one
// chosen read of it. A test uses it to change a file between the repair's plan and
// its write. The module lives outside the fixture root.
function swapOnReadPreload(target: string, replacement: string, readNumber: number): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'repair-swap-'));
  created.push(dir);
  const file = path.join(dir, 'swap-on-read.mjs');
  fs.writeFileSync(file, [
    "import fs from 'node:fs';",
    "import path from 'node:path';",
    `const target = ${JSON.stringify(target)};`,
    `const replacement = ${JSON.stringify(replacement)};`,
    'const readFileOriginal = fs.readFileSync;',
    'let reads = 0;',
    'fs.readFileSync = function readFileSwapping(file, ...rest) {',
    "  if (typeof file === 'string' && path.resolve(file) === target) {",
    '    reads += 1;',
    `    if (reads === ${readNumber}) {`,
    '      fs.unlinkSync(target);',
    '      fs.symlinkSync(replacement, target);',
    '    }',
    '  }',
    '  return readFileOriginal.call(fs, file, ...rest);',
    '};',
    '',
  ].join('\n'));
  return file;
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

  // A packet outside the tree with one failure a repair would fix, so a write
  // through a folder argument that got past the containment check would show.
  function outsidePacket(parent: string): { folder: string; summary: string; original: string } {
    const folder = path.join(parent, '001-outside');
    fs.mkdirSync(folder);
    const summary = path.join(folder, 'implementation-summary.md');
    const original = summaryDoc('wrong-track/999-stale', '999-stale-name');
    fs.writeFileSync(summary, original);
    return { folder, summary, original };
  }

  // The lexical check passes for a link whose name sits inside the tree, so only
  // the resolved path can refuse a folder argument that is itself a link.
  it('refuses a packet folder argument that is a link to a packet outside the tree', () => {
    const outsideRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'repair-outside-'));
    created.push(outsideRoot);
    const outside = outsidePacket(outsideRoot);
    const staging = fs.mkdtempSync(path.join(SPECS, '.repair-fixture-'));
    created.push(staging);
    fs.symlinkSync(outside.folder, path.join(staging, '001-linked'));
    const dir = path.relative(ROOT, path.join(staging, '001-linked'));

    expect(run(['--folder', dir]).status).toBe(2);
    expect(run(['--folder', dir, '--apply']).status).toBe(2);
    expect(fs.readFileSync(outside.summary, 'utf8')).toBe(outside.original);
  });

  // The same containment holds when the link is a parent above the packet. The
  // packet's own name is a plain directory, so only the resolved parent can show
  // that the packet sits outside the tree.
  it('refuses a packet folder reached through a linked parent directory outside the tree', () => {
    const outsideRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'repair-outside-'));
    created.push(outsideRoot);
    const outside = outsidePacket(outsideRoot);
    const staging = fs.mkdtempSync(path.join(SPECS, '.repair-fixture-'));
    created.push(staging);
    fs.symlinkSync(outsideRoot, path.join(staging, 'linked-parent'));
    const dir = path.relative(ROOT, path.join(staging, 'linked-parent', '001-outside'));

    expect(run(['--folder', dir]).status).toBe(2);
    expect(run(['--folder', dir, '--apply']).status).toBe(2);
    expect(fs.readFileSync(outside.summary, 'utf8')).toBe(outside.original);
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

  it('reports repairable=0 and writes nothing for a clean packet in a dry run', () => {
    const dir = fixture('clean-dryrun', { 'implementation-summary.md': summaryDoc('placeholder', 'placeholder') });
    const file = path.join(ROOT, dir, 'implementation-summary.md');
    const correct = summaryDoc(path.relative(SPECS, path.join(ROOT, dir)).split(path.sep).join('/'), path.basename(dir));
    fs.writeFileSync(file, correct);

    const result = run(['--folder', dir]);

    expect(result.stdout).toContain('inspected=1 repairable=0 failed=0');
    expect(result.stdout).not.toContain('would repair');
    expect(fs.readFileSync(file, 'utf8')).toBe(correct);
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

  // The repair wrote its sibling under a guessable name, `<file>.repair-<pid>-<n>.tmp`,
  // with no exclusive create. A link planted at that name was written through, so the
  // bytes landed outside the packet tree. The pid is pinned so the test can plant the
  // exact name the tool would have chosen.
  it('does not write through a link planted at the predictable repair temp name', () => {
    const outsideDir = fs.mkdtempSync(path.join(os.tmpdir(), 'repair-outside-'));
    created.push(outsideDir);
    const outside = path.join(outsideDir, 'victim.md');
    const original = 'OUTSIDE ORIGINAL\n';
    fs.writeFileSync(outside, original);

    const dir = fixture('temp-link', {
      'implementation-summary.md': summaryDoc('wrong-track/999-stale', '999-stale-name'),
    });
    const packet = path.join(ROOT, dir);
    const pinnedPid = 4242;
    for (let seq = 1; seq <= 3; seq += 1) {
      fs.symlinkSync(outside, path.join(packet, `.implementation-summary.md.repair-${pinnedPid}-${seq}.tmp`));
    }

    run(['--folder', dir, '--apply'], undefined, ['--import', pathToFileURL(pinPidPreload(pinnedPid)).href]);

    expect(fs.readFileSync(outside, 'utf8')).toBe(original);
    expect(fs.readFileSync(path.join(packet, 'implementation-summary.md'), 'utf8')).toContain(path.basename(dir));
  });

  // A file the repair would rewrite is refused when it is itself a link. Reading through
  // it takes content from outside the packet, and renaming over it swaps the link for a
  // regular file, so the anchor healer refuses it the same way. The folder name follows
  // the packet convention so the only condition under test is the link.
  it('refuses a rewrite target that is a symbolic link and leaves its target untouched', () => {
    const outsideDir = fs.mkdtempSync(path.join(os.tmpdir(), 'repair-outside-'));
    created.push(outsideDir);
    const outside = path.join(outsideDir, 'description.json');
    const original = `${JSON.stringify({ level: 1, title: 'Outside' }, null, 2)}\n`;
    fs.writeFileSync(outside, original);

    const dir = fixture('001-linked-doc', {
      'spec.md': '---\ntitle: "Fixture"\n---\n# Fixture\n<!-- SPECKIT_LEVEL: 2 -->\n',
    });
    const link = path.join(ROOT, dir, 'description.json');
    fs.symlinkSync(outside, link);

    const result = run(['--folder', dir, '--apply']);

    expect(result.stdout).toContain('left unchanged');
    expect(result.stdout).toContain('symbolic link, not followed');
    expect(fs.readFileSync(outside, 'utf8')).toBe(original);
    expect(fs.lstatSync(link).isSymbolicLink()).toBe(true);
  });

  // A rewrite target that links to a file inside the packet is refused like a link to
  // an outside file. Reading through it would take the level recorded in that file,
  // which then reads as a planned change to the packet's own description.
  it('leaves a rewrite target that links to a file inside the packet unread and unchanged', () => {
    const dir = fixture('001-inside-link', {
      'spec.md': '---\ntitle: "Fixture"\n---\n# Fixture\n<!-- SPECKIT_LEVEL: 2 -->\n',
      'implementation-summary.md': summaryDoc('wrong-track/999-stale', '999-stale-name'),
      'description-source.json': `${JSON.stringify({ level: 1, title: 'Inside' }, null, 2)}\n`,
    });
    const packet = path.join(ROOT, dir);
    const link = path.join(packet, 'description.json');
    fs.symlinkSync('description-source.json', link);
    const source = path.join(packet, 'description-source.json');
    const sourceBefore = fs.readFileSync(source, 'utf8');

    const dryRun = run(['--folder', dir]);
    expect(dryRun.stdout).toContain(`left unchanged ${path.join(dir, 'description.json')}: symbolic link, not followed`);
    expect(dryRun.stdout).not.toContain('description level');

    const applied = run(['--folder', dir, '--apply']);
    expect(applied.stdout).not.toContain('description level');
    expect(fs.readFileSync(source, 'utf8')).toBe(sourceBefore);
    expect(fs.lstatSync(link).isSymbolicLink()).toBe(true);
  });

  // The rewrite target is checked when it is planned and again when it is written.
  // A link that appears between the two is what the second check is for: the write
  // must be refused, so the link stays a link and its target is left as it was.
  function linkAppearsAfterPlanning(replacement: 'inside' | 'outside'): void {
    const outsideRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'repair-outside-'));
    created.push(outsideRoot);
    const outsideFile = path.join(outsideRoot, 'description.json');
    fs.writeFileSync(outsideFile, `${JSON.stringify({ level: 1, title: 'Outside' }, null, 2)}\n`);
    const files: Record<string, string> = {
      'spec.md': '---\ntitle: "Fixture"\n---\n# Fixture\n<!-- SPECKIT_LEVEL: 2 -->\n',
      'implementation-summary.md': summaryDoc('wrong-track/999-stale', '999-stale-name'),
      'description.json': `${JSON.stringify({ level: 1, title: 'Fixture' }, null, 2)}\n`,
    };
    if (replacement === 'inside') files['description-inside.json'] = `${JSON.stringify({ level: 1, title: 'Inside' }, null, 2)}\n`;
    const dir = fixture('001-link-after-plan', files);
    const packet = path.join(ROOT, dir);
    const link = path.join(packet, 'description.json');
    const target = replacement === 'inside' ? path.join(packet, 'description-inside.json') : outsideFile;
    const targetBefore = fs.readFileSync(target, 'utf8');

    // The planning step reads the description twice, and the level repair reads it
    // a third time when it writes, so the link appears at that read.
    const result = run(['--folder', dir, '--apply'], undefined, ['--import', pathToFileURL(swapOnReadPreload(link, target, 3)).href]);

    expect(fs.lstatSync(link).isSymbolicLink()).toBe(true);
    expect(fs.readFileSync(target, 'utf8')).toBe(targetBefore);
    expect(result.status).toBe(2);
    expect(result.stdout).toContain('FAILED');
    expect(result.stdout).toContain('symbolic link, not followed');
  }

  it('refuses to replace a rewrite target that became a link after planning, when the link points outside the packet', () => {
    linkAppearsAfterPlanning('outside');
  });

  it('refuses to replace a rewrite target that became a link after planning, when the link points inside the packet', () => {
    linkAppearsAfterPlanning('inside');
  });

  // The re-derive rewrites graph-metadata.json through the backfill writer, which replaces
  // a link with a regular file. A linked graph-metadata.json is therefore not re-derived:
  // the dry run leaves the step out of its plan, and apply leaves the link and its target
  // in place, so the two runs report the same packet.
  it('does not re-derive over a linked graph-metadata.json, in the dry run or with --apply', () => {
    // The graph writer takes its specs roots from a real .opencode directory above the
    // destination, and it renames over the final path component, so a re-derive into a
    // packet under such a root replaces a link with a regular file. This workspace carries
    // the anchor and a spec.md so the re-derive would reach that write.
    const workspace = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'repair-linked-graph-')));
    created.push(workspace);
    fs.mkdirSync(path.join(workspace, '.opencode'));
    fs.mkdirSync(path.join(workspace, 'specs', '.repair-fixture-linked'), { recursive: true });
    fs.symlinkSync(path.join(TOOL_TREE, '.skilled'), path.join(workspace, '.skilled'), 'dir');
    const dir = path.join('specs', '.repair-fixture-linked', '001-linked-graph');
    const packet = path.join(workspace, dir);
    fs.mkdirSync(packet);
    fs.writeFileSync(path.join(packet, 'spec.md'), '---\ntitle: "Fixture"\ndescription: "Fixture"\n---\n# Fixture\n<!-- SPECKIT_LEVEL: 2 -->\n');
    fs.writeFileSync(path.join(packet, 'implementation-summary.md'), summaryDoc('wrong-track/999-stale', '999-stale-name'));

    const outsideDir = fs.mkdtempSync(path.join(os.tmpdir(), 'repair-outside-'));
    created.push(outsideDir);
    const outside = path.join(outsideDir, 'graph-metadata.json');
    const original = `${JSON.stringify({ schema_version: 1, packet_id: 'outside', spec_folder: 'outside' }, null, 2)}\n`;
    fs.writeFileSync(outside, original);
    const link = path.join(packet, 'graph-metadata.json');
    fs.symlinkSync(outside, link);

    const dryRun = run(['--folder', dir], undefined, [], workspace);
    expect(dryRun.stdout).toContain(`left unchanged ${path.join(dir, 'graph-metadata.json')}: symbolic link, not followed`);
    expect(dryRun.stdout).not.toContain('re-derive graph metadata');

    const applied = run(['--folder', dir, '--apply'], undefined, [], workspace);
    expect(applied.stdout).toContain(`left unchanged ${path.join(dir, 'graph-metadata.json')}: symbolic link, not followed`);
    expect(fs.lstatSync(link).isSymbolicLink()).toBe(true);
    expect(fs.readFileSync(outside, 'utf8')).toBe(original);
    // The packet's other repair still lands, so the skip is only for the link.
    expect(fs.readFileSync(path.join(packet, 'implementation-summary.md'), 'utf8')).toContain(path.basename(dir));
  });

  // A dangling graph-metadata.json is refused like a live one: the re-derive would
  // otherwise rename a regular file over the link, and a dry run would name work it
  // never does. The absent target has to stay absent under both runs.
  it('refuses a dangling graph-metadata.json link in the dry run and with --apply, and creates nothing at its target', () => {
    const workspace = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'repair-dangling-graph-')));
    created.push(workspace);
    fs.mkdirSync(path.join(workspace, '.opencode'));
    fs.mkdirSync(path.join(workspace, 'specs', '.repair-fixture-dangling'), { recursive: true });
    fs.symlinkSync(path.join(TOOL_TREE, '.skilled'), path.join(workspace, '.skilled'), 'dir');
    const dir = path.join('specs', '.repair-fixture-dangling', '001-dangling-graph');
    const packet = path.join(workspace, dir);
    fs.mkdirSync(packet);
    fs.writeFileSync(path.join(packet, 'spec.md'), '---\ntitle: "Fixture"\ndescription: "Fixture"\n---\n# Fixture\n<!-- SPECKIT_LEVEL: 2 -->\n');
    fs.writeFileSync(path.join(packet, 'implementation-summary.md'), summaryDoc('wrong-track/999-stale', '999-stale-name'));

    const missingDir = fs.mkdtempSync(path.join(os.tmpdir(), 'repair-outside-'));
    created.push(missingDir);
    const missing = path.join(missingDir, 'graph-metadata.json');
    const link = path.join(packet, 'graph-metadata.json');
    fs.symlinkSync(missing, link);

    const dryRun = run(['--folder', dir], undefined, [], workspace);
    expect(dryRun.stdout).toContain(`left unchanged ${path.join(dir, 'graph-metadata.json')}: symbolic link, not followed`);
    expect(dryRun.stdout).not.toContain('re-derive graph metadata');
    expect(fs.lstatSync(link).isSymbolicLink()).toBe(true);
    expect(fs.existsSync(missing)).toBe(false);

    const applied = run(['--folder', dir, '--apply'], undefined, [], workspace);
    expect(applied.stdout).toContain(`left unchanged ${path.join(dir, 'graph-metadata.json')}: symbolic link, not followed`);
    expect(applied.stdout).not.toContain('re-derive graph metadata');
    expect(fs.lstatSync(link).isSymbolicLink()).toBe(true);
    expect(fs.existsSync(missing)).toBe(false);
    // The packet's other repair still lands, so the skip is only for the link.
    expect(fs.readFileSync(path.join(packet, 'implementation-summary.md'), 'utf8')).toContain(path.basename(dir));
  });

  // A dangling description.json reads as absent: the packet's other repairs run and the
  // link and its target are left as they were.
  it('treats a dangling description.json link as absent and creates nothing at its target', () => {
    const dir = fixture('dangling-description', {
      'implementation-summary.md': summaryDoc('wrong-track/999-stale', '999-stale-name'),
    });
    const packet = path.join(ROOT, dir);
    const missingDir = fs.mkdtempSync(path.join(os.tmpdir(), 'repair-outside-'));
    created.push(missingDir);
    const missing = path.join(missingDir, 'description.json');
    const link = path.join(packet, 'description.json');
    fs.symlinkSync(missing, link);

    const result = run(['--folder', dir, '--apply']);

    expect(result.stdout).toContain(`left unchanged ${path.join(dir, 'description.json')}: symbolic link, not followed`);
    expect(fs.existsSync(missing)).toBe(false);
    expect(fs.lstatSync(link).isSymbolicLink()).toBe(true);
    expect(fs.readFileSync(path.join(packet, 'implementation-summary.md'), 'utf8')).toContain(path.basename(dir));
  });

  // The packet level is read from plan.md, which the tool never writes for its level. A live
  // link there must read as absent, or the outside document would set the level the packet
  // records and change the dry-run plan.
  it('treats a live plan.md link as absent: its outside level reaches no plan, output or written file', () => {
    const outsideDir = fs.mkdtempSync(path.join(os.tmpdir(), 'repair-outside-'));
    created.push(outsideDir);
    const outside = path.join(outsideDir, 'plan.md');
    fs.writeFileSync(outside, '---\ntitle: "Outside plan"\n---\n# Outside plan\n<!-- SPECKIT_LEVEL: 3 -->\n');
    const outsideBefore = fs.readFileSync(outside, 'utf8');

    const dir = fixture('live-plan-link', {
      'implementation-summary.md': summaryDoc('wrong-track/999-stale', '999-stale-name'),
      'description.json': `${JSON.stringify({ level: 1, title: 'Fixture' }, null, 2)}\n`,
    });
    const packet = path.join(ROOT, dir);
    const link = path.join(packet, 'plan.md');
    const descriptionBefore = fs.readFileSync(path.join(packet, 'description.json'), 'utf8');
    fs.symlinkSync(outside, link);

    const linked = run(['--folder', dir]);
    fs.unlinkSync(link);
    const absent = run(['--folder', dir]);
    fs.symlinkSync(outside, link);

    const refusal = `left unchanged ${path.join(dir, 'plan.md')}: symbolic link, not followed`;
    expect(linked.stdout).toContain(refusal);
    expect(linked.status).toBe(absent.status);
    expect(linked.stdout.split('\n').filter((line) => !line.includes(refusal)).join('\n')).toBe(absent.stdout);
    expect(linked.stdout).not.toContain('description level');

    const applied = run(['--folder', dir, '--apply']);
    expect(applied.stdout).toContain(refusal);
    expect(applied.stdout).not.toContain('description level');
    expect(fs.readFileSync(path.join(packet, 'description.json'), 'utf8')).toBe(descriptionBefore);
    expect(fs.readFileSync(outside, 'utf8')).toBe(outsideBefore);
    expect(fs.lstatSync(link).isSymbolicLink()).toBe(true);
    for (const entry of fs.readdirSync(packet, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      expect(fs.readFileSync(path.join(packet, entry.name), 'utf8')).not.toContain('Outside plan');
    }
  });

  // A stub validate.sh stands in for a validator that does not produce a report. The real
  // tool is linked into a throwaway root so the run goes through the same entry, and the
  // stub is the only thing that changes.
  function runWithStubValidator(stubBody: string): { status: number; stdout: string } {
    const stubRoot = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'repair-stub-validator-')));
    const toolLink = path.join(stubRoot, TOOL);
    try {
      const specDir = path.join(stubRoot, 'specs', 'staging', '002-stub-probe');
      fs.mkdirSync(specDir, { recursive: true });
      fs.writeFileSync(path.join(specDir, 'spec.md'), '# Stub Probe\n');
      fs.mkdirSync(path.dirname(toolLink), { recursive: true });
      fs.writeFileSync(
        path.join(path.dirname(toolLink), 'validate.sh'),
        `#!/usr/bin/env bash\n${stubBody}`,
        { mode: 0o755 },
      );
      fs.symlinkSync(path.join(TOOL_TREE, TOOL), toolLink);
      try {
        const stdout = execFileSync('node', [TOOL, '--folder', 'specs/staging/002-stub-probe'], {
          cwd: stubRoot,
          encoding: 'utf8',
        });
        return { status: 0, stdout };
      } catch (error) {
        const err = error as { status?: number; stdout?: string };
        return { status: err.status ?? 1, stdout: err.stdout ?? '' };
      }
    } finally {
      fs.rmSync(toolLink, { force: true });
      fs.rmSync(stubRoot, { recursive: true, force: true });
    }
  }

  // validate.sh exits 3 when it will not validate at all, and its reason goes to stderr
  // with no report. The packet must not be reported as UNREADABLE with no cause, and the
  // exit must stay non-zero.
  it('names the validator stderr when validate.sh exits 3, and exits non-zero', () => {
    const { status, stdout } = runWithStubValidator([
      'echo "ERROR: validate.sh compiled validation orchestrator is stale." >&2',
      'echo "Run: cd .skilled/skills/system-spec-kit/runtime && npm run build" >&2',
      'exit 3',
      '',
    ].join('\n'));

    expect(status).toBe(2);
    expect(stdout).toContain(
      'UNREADABLE specs/staging/002-stub-probe: validator unavailable (exit 3): '
      + 'ERROR: validate.sh compiled validation orchestrator is stale. | '
      + 'Run: cd .skilled/skills/system-spec-kit/runtime && npm run build',
    );
  });

  // A validator that exits with no parseable report, and not with the exit 3 path, must
  // name its exit code and the last stderr lines, because the first lines are rarely the cause.
  it('names the exit code and the stderr tail when the validator exits with no report', () => {
    const { status, stdout } = runWithStubValidator([
      'echo "first line, dropped from the tail" >&2',
      'echo "second line" >&2',
      'echo "third line" >&2',
      'echo "fourth line" >&2',
      'exit 1',
      '',
    ].join('\n'));

    expect(status).toBe(2);
    expect(stdout).toContain(
      'UNREADABLE specs/staging/002-stub-probe: no report from validator (exit 1): '
      + 'second line | third line | fourth line',
    );
  });
});
