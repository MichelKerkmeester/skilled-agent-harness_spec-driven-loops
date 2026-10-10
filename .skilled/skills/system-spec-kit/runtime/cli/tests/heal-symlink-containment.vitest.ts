// ───────────────────────────────────────────────────────────────
// MODULE: Heal Symlink Containment
// ───────────────────────────────────────────────────────────────

import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it } from 'vitest';

import { loadTemplateContractForDocument } from '../utils/template-structure.js';

const CLI_DIR = path.resolve(__dirname, '..');
const HEAL_SPEC_DOCS = path.join(CLI_DIR, 'spec', 'heal-spec-docs.cjs');

// Temporary roots and outside directories, removed after each test.
const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

function makeRoot(): string {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'heal-symlink-')));
  roots.push(root);
  return root;
}

function digest(file: string): string {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

// Anchors come from the contract the healer reads, so the fixture cannot drift
// from the Level 2 spec template.
function levelTwoSpecAnchors(): string[] {
  const contract = loadTemplateContractForDocument('2', 'spec.md', 'spec.md');
  if (!contract.supported) throw new Error('Level 2 spec.md contract did not resolve');
  return [...contract.requiredAnchors, ...(contract.optionalAnchors || [])];
}

// A spec.md the default healer stamps with a template-source header, so an
// unguarded write visibly changes the file.
function provableSpec(): string {
  return [
    '---',
    'title: "Symlink probe"',
    'description: "Symlink containment fixture."',
    '---',
    '# Symlink probe',
    '<!-- SPECKIT_LEVEL: 2 -->',
    '',
    ...levelTwoSpecAnchors().map((anchor) => `<!-- ANCHOR:${anchor} -->`),
    '',
  ].join('\n');
}

// Two anchors share one name, so the healer must rename the second pair.
function duplicateAnchorSpec(): string {
  return [
    '---',
    'title: "Anchor probe"',
    'description: "Symlink containment fixture."',
    '---',
    '# Anchor probe',
    '',
    '<!-- ANCHOR:summary -->',
    'First',
    '<!-- /ANCHOR:summary -->',
    '',
    '<!-- ANCHOR:summary -->',
    'Second',
    '<!-- /ANCHOR:summary -->',
    '',
  ].join('\n');
}

// The variant spelling only names the specs root on a case-insensitive filesystem,
// so the probe checks for that before a case-variant test relies on it.
function filesystemIsCaseInsensitive(dir: string): boolean {
  const probe = path.join(dir, 'case-probe');
  fs.writeFileSync(probe, '');
  try {
    return fs.existsSync(path.join(dir, 'CASE-PROBE'));
  } finally {
    fs.rmSync(probe, { force: true });
  }
}

// A repository holding the temp directory would make the working directory a
// repository too, so the cwd-outside test cannot prove what it claims there.
function repositoryAbove(dir: string): boolean {
  for (let current = dir; ; current = path.dirname(current)) {
    if (fs.existsSync(path.join(current, '.git'))) return true;
    if (path.dirname(current) === current) return false;
  }
}

function writeRegularPacket(root: string, name: string, spec: string): string {
  const packet = path.join(root, 'specs', 'heal-link', name);
  fs.mkdirSync(packet, { recursive: true });
  fs.writeFileSync(path.join(packet, 'spec.md'), spec);
  return packet;
}

// The outside file lives in its own temp directory, so it sits outside the
// packet root the healer is pointed at.
function outsideDirectory(): string {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'heal-symlink-outside-')));
  roots.push(dir);
  return dir;
}

function outsideFile(name: string, content: string): string {
  const file = path.join(outsideDirectory(), name);
  fs.writeFileSync(file, content);
  return file;
}

function linkedPacket(root: string, name: string, docName: string, target: string): string {
  const packet = path.join(root, 'specs', 'heal-link', name);
  fs.mkdirSync(packet, { recursive: true });
  fs.symlinkSync(target, path.join(packet, docName));
  return packet;
}

// A packet document that is a symbolic link names a file the packet does not
// own. Every write mode must refuse it, so the file behind the link keeps its
// bytes and the link stays a link.
describe('heal-spec-docs symbolic link containment', () => {
  it('default healer --apply leaves a symlinked spec.md and its outside target untouched', () => {
    const root = makeRoot();
    const outside = outsideFile('spec.md', provableSpec());
    const before = digest(outside);
    const packet = linkedPacket(root, '001-linked-spec', 'spec.md', outside);
    const control = writeRegularPacket(root, '002-control-spec', provableSpec());

    const result = spawnSync(process.execPath, [HEAL_SPEC_DOCS, '--roots', path.join(root, 'specs'), '--apply'], {
      encoding: 'utf8',
    });

    expect(result.status, result.stdout + result.stderr).toBe(0);
    // The control packet proves the healer would stamp this exact content, so
    // the outside file's unchanged digest is the containment result, not a no-op.
    expect(result.stdout).toContain(`healed ${path.join(control, 'spec.md')}`);
    expect(digest(outside)).toBe(before);
    expect(fs.lstatSync(path.join(packet, 'spec.md')).isSymbolicLink()).toBe(true);
    expect(result.stdout).toContain(`refused ${path.join(packet, 'spec.md')}: symbolic link`);
  });

  it('default healer --apply leaves a symlinked tasks.md with an empty trigger list untouched', () => {
    const root = makeRoot();
    const tasks = '---\ntitle: "Tasks probe"\ntrigger_phrases:\n---\n# Tasks probe\n';
    const outside = outsideFile('tasks.md', tasks);
    const before = digest(outside);
    const packet = linkedPacket(root, '001-linked-tasks', 'tasks.md', outside);
    fs.writeFileSync(path.join(packet, 'spec.md'), provableSpec());
    const control = writeRegularPacket(root, '002-control-tasks', provableSpec());
    fs.writeFileSync(path.join(control, 'tasks.md'), tasks);

    const result = spawnSync(process.execPath, [HEAL_SPEC_DOCS, '--roots', path.join(root, 'specs'), '--apply'], {
      encoding: 'utf8',
    });

    expect(result.status, result.stdout + result.stderr).toBe(0);
    // The control's empty trigger list is seeded, so the same content is one the
    // healer does rewrite when it is not behind a link.
    expect(result.stdout).toContain(`healed ${path.join(control, 'tasks.md')}`);
    expect(digest(outside)).toBe(before);
    expect(fs.lstatSync(path.join(packet, 'tasks.md')).isSymbolicLink()).toBe(true);
    expect(result.stdout).toContain(`refused ${path.join(packet, 'tasks.md')}: symbolic link`);
  });

  it('--anchor-repair --apply leaves a symlinked spec.md and its outside target untouched', () => {
    const root = makeRoot();
    const outside = outsideFile('spec.md', duplicateAnchorSpec());
    const before = digest(outside);
    const packet = linkedPacket(root, '001-linked-anchor', 'spec.md', outside);
    const control = writeRegularPacket(root, '002-control-anchor', duplicateAnchorSpec());

    const result = spawnSync(process.execPath, [HEAL_SPEC_DOCS, '--anchor-repair', '--roots', path.join(root, 'specs'), '--apply'], {
      encoding: 'utf8',
    });

    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(result.stdout).toContain(`repaired ${path.join(control, 'spec.md')}`);
    expect(digest(outside)).toBe(before);
    // The rename-based atomic write would replace the link with a regular file,
    // so the link surviving is part of the containment result.
    expect(fs.lstatSync(path.join(packet, 'spec.md')).isSymbolicLink()).toBe(true);
    expect(result.stdout).toContain(`left unchanged ${path.join(packet, 'spec.md')}: symbolic link`);
  });

  it('--lane-modes --apply leaves a symlinked spec.md and its outside target untouched', () => {
    const root = makeRoot();
    const outside = outsideFile('spec.md', provableSpec());
    const before = digest(outside);
    const packet = linkedPacket(root, '001-linked-lane', 'spec.md', outside);
    const control = writeRegularPacket(root, '002-control-lane', provableSpec());

    const result = spawnSync(process.execPath, [HEAL_SPEC_DOCS, '--lane-modes', '--roots', path.join(root, 'specs'), '--apply'], {
      encoding: 'utf8',
    });

    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(result.stdout).toContain(`applied header-add ${path.join(control, 'spec.md')}`);
    expect(digest(outside)).toBe(before);
    expect(fs.lstatSync(path.join(packet, 'spec.md')).isSymbolicLink()).toBe(true);
    expect(result.stdout).toContain(`refused containment ${path.join(packet, 'spec.md')}: symbolic link`);
  });

  it('default healer --apply replaces a spec.md that becomes a link after it is read, and leaves the outside target untouched', () => {
    const root = makeRoot();
    const spec = path.join(root, 'specs', 'heal-link', '001-swapped-spec', 'spec.md');
    fs.mkdirSync(path.dirname(spec), { recursive: true });
    fs.writeFileSync(spec, provableSpec());
    const outside = outsideFile('spec.md', provableSpec());
    const before = digest(outside);
    // Swaps the packet document for a link to the outside file right after the
    // healer reads it, which is the window between its checks and its write.
    const preload = path.join(root, 'swap-after-read.cjs');
    fs.writeFileSync(preload, [
      "'use strict';",
      "const fs = require('node:fs');",
      "const path = require('node:path');",
      'const readFileSync = fs.readFileSync;',
      'let swapped = false;',
      'fs.readFileSync = function readThenSwap(file, ...rest) {',
      '  const text = readFileSync.call(this, file, ...rest);',
      '  if (!swapped && path.resolve(String(file)) === process.env.HEAL_SWAP_TARGET) {',
      '    swapped = true;',
      '    fs.unlinkSync(file);',
      '    fs.symlinkSync(process.env.HEAL_SWAP_OUTSIDE, file);',
      '  }',
      '  return text;',
      '};',
      '',
    ].join('\n'));

    const result = spawnSync(
      process.execPath,
      ['-r', preload, HEAL_SPEC_DOCS, '--roots', path.join(root, 'specs'), '--apply'],
      {
        encoding: 'utf8',
        env: { ...process.env, HEAL_SWAP_TARGET: spec, HEAL_SWAP_OUTSIDE: outside },
      },
    );

    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(result.stdout).toContain(`healed ${spec}`);
    // The healed text replaces the link itself, so the outside file keeps its bytes.
    expect(digest(outside)).toBe(before);
    expect(fs.lstatSync(spec).isSymbolicLink()).toBe(false);
    expect(fs.readFileSync(spec, 'utf8')).toContain('SPECKIT_TEMPLATE_SOURCE:');
  });

  it('default healer --apply reports a dangling spec.md link as refused and does not create its target', () => {
    const root = makeRoot();
    const missingTarget = path.join(outsideDirectory(), 'spec.md');
    const packet = linkedPacket(root, '001-dangling-spec', 'spec.md', missingTarget);
    const control = writeRegularPacket(root, '002-control-dangling', provableSpec());

    const result = spawnSync(process.execPath, [HEAL_SPEC_DOCS, '--roots', path.join(root, 'specs'), '--apply'], {
      encoding: 'utf8',
    });

    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(result.stdout).toContain(`healed ${path.join(control, 'spec.md')}`);
    // Writing through a dangling link would create the file at its target, so
    // the target staying absent is the containment result.
    expect(fs.existsSync(missingTarget)).toBe(false);
    expect(fs.lstatSync(path.join(packet, 'spec.md')).isSymbolicLink()).toBe(true);
    expect(result.stdout).toContain(`refused ${path.join(packet, 'spec.md')}: symbolic link`);
  });

  it('default healer --apply refuses a symlinked spec.md whose target sits inside the same packet', () => {
    const root = makeRoot();
    const packet = path.join(root, 'specs', 'heal-link', '001-inside-link');
    fs.mkdirSync(packet, { recursive: true });
    const inside = path.join(packet, 'body.md');
    fs.writeFileSync(inside, provableSpec());
    const before = digest(inside);
    fs.symlinkSync(inside, path.join(packet, 'spec.md'));
    const control = writeRegularPacket(root, '002-control-inside', provableSpec());

    const result = spawnSync(process.execPath, [HEAL_SPEC_DOCS, '--roots', path.join(root, 'specs'), '--apply'], {
      encoding: 'utf8',
    });

    expect(result.status, result.stdout + result.stderr).toBe(0);
    // The target is a document the healer would stamp, so its unchanged digest
    // shows the link was refused and not that there was nothing to write.
    expect(result.stdout).toContain(`healed ${path.join(control, 'spec.md')}`);
    expect(digest(inside)).toBe(before);
    expect(fs.lstatSync(path.join(packet, 'spec.md')).isSymbolicLink()).toBe(true);
    expect(result.stdout).toContain(`refused ${path.join(packet, 'spec.md')}: symbolic link`);
  });

  it('default healer --apply changes no bytes on a plain packet with nothing left to heal', () => {
    const root = makeRoot();
    const control = writeRegularPacket(root, '001-healed-plain', provableSpec());
    const apply = () => spawnSync(process.execPath, [HEAL_SPEC_DOCS, '--roots', path.join(root, 'specs'), '--apply'], {
      encoding: 'utf8',
    });

    // The first run stamps the document, so the second run sees a packet with
    // nothing left to heal and must leave its bytes alone.
    expect(apply().status).toBe(0);
    const healed = digest(path.join(control, 'spec.md'));

    const rerun = apply();
    expect(rerun.status, rerun.stdout + rerun.stderr).toBe(0);
    expect(rerun.stdout).toContain('documents healed=0');
    expect(digest(path.join(control, 'spec.md'))).toBe(healed);
  });

  it.each<[string, () => string, string, string]>([
    ['--anchor-repair', duplicateAnchorSpec, 'repaired', 'left unchanged'],
    ['--lane-modes', provableSpec, 'applied header-add', 'refused containment'],
  ])('%s --apply refuses a dangling spec.md and does not create its target', (flag, spec, healedVerb, refusedVerb) => {
    const root = makeRoot();
    const missingTarget = path.join(outsideDirectory(), 'spec.md');
    const packet = linkedPacket(root, '001-dangling-spec', 'spec.md', missingTarget);
    const control = writeRegularPacket(root, '002-control-dangling', spec());

    const result = spawnSync(process.execPath, [HEAL_SPEC_DOCS, flag, '--roots', path.join(root, 'specs'), '--apply'], {
      encoding: 'utf8',
    });

    expect(result.status, result.stdout + result.stderr).toBe(0);
    // The control proves this mode acts on the same content, so the refusal below
    // is the link's doing and not an absence of work.
    expect(result.stdout).toContain(`${healedVerb} ${path.join(control, 'spec.md')}`);
    expect(fs.existsSync(missingTarget)).toBe(false);
    expect(fs.lstatSync(path.join(packet, 'spec.md')).isSymbolicLink()).toBe(true);
    expect(result.stdout).toContain(`${refusedVerb} ${path.join(packet, 'spec.md')}: symbolic link, not followed`);
  });
});

// A named packet folder is refused before any document is read when it is a link,
// when a component between the specs root and the folder is a link, or when its
// real path leaves the specs root. Each mode would otherwise write into the packet
// the link points at. Root membership is judged by filesystem identity, so a
// spelling that differs from the root's path text is still the same root.
describe('heal-spec-docs folder containment', () => {
  const modes: Array<[string, string[], () => string]> = [
    ['default run', [], provableSpec],
    ['--anchor-repair', ['--anchor-repair'], duplicateAnchorSpec],
    ['--lane-modes', ['--lane-modes'], provableSpec],
  ];

  it.each(modes)('%s --apply refuses a linked --folder and leaves the packet behind the link untouched', (_label, flags, spec) => {
    const root = makeRoot();
    const specs = path.join(root, 'specs');
    const outsidePacket = path.join(outsideDirectory(), '020-linked-packet');
    fs.mkdirSync(outsidePacket);
    const outsideSpec = path.join(outsidePacket, 'spec.md');
    fs.writeFileSync(outsideSpec, spec());
    const before = digest(outsideSpec);
    const linked = path.join(specs, 'staging', '020-linked-packet');
    fs.mkdirSync(path.dirname(linked), { recursive: true });
    fs.symlinkSync(outsidePacket, linked, 'dir');

    const result = spawnSync(process.execPath, [HEAL_SPEC_DOCS, ...flags, '--folder', linked, '--roots', specs, '--apply'], {
      encoding: 'utf8',
    });

    expect(digest(outsideSpec)).toBe(before);
    expect(result.status, result.stdout + result.stderr).toBe(2);
    expect(result.stdout).toContain(`refused ${linked}: symbolic link, not followed`);
    expect(fs.lstatSync(linked).isSymbolicLink()).toBe(true);
  });

  it.each(modes)('%s --apply refuses a dangling --folder and creates nothing at its target', (_label, flags) => {
    const root = makeRoot();
    const specs = path.join(root, 'specs');
    const missing = path.join(outsideDirectory(), '020-dangling-packet');
    const linked = path.join(specs, 'staging', '020-dangling-packet');
    fs.mkdirSync(path.dirname(linked), { recursive: true });
    fs.symlinkSync(missing, linked, 'dir');

    const result = spawnSync(process.execPath, [HEAL_SPEC_DOCS, ...flags, '--folder', linked, '--roots', specs, '--apply'], {
      encoding: 'utf8',
    });

    expect(result.status, result.stdout + result.stderr).toBe(2);
    // The reason names the folder itself as the link, the check that fires first
    // for a link at the end of the path.
    expect(result.stdout).toContain(`refused ${linked}: symbolic link, not followed (the folder itself is a link)`);
    expect(fs.existsSync(missing)).toBe(false);
    expect(fs.lstatSync(linked).isSymbolicLink()).toBe(true);
  });

  it('refuses a --folder reached through a linked component inside the specs root', () => {
    const root = makeRoot();
    const specs = path.join(root, 'specs');
    const real = path.join(specs, 'real-track', '020-packet');
    fs.mkdirSync(real, { recursive: true });
    const realSpec = path.join(real, 'spec.md');
    fs.writeFileSync(realSpec, provableSpec());
    const before = digest(realSpec);
    fs.symlinkSync(path.join(specs, 'real-track'), path.join(specs, 'alias-track'), 'dir');

    const aliased = spawnSync(process.execPath, [HEAL_SPEC_DOCS, '--folder', path.join(specs, 'alias-track', '020-packet'), '--roots', specs, '--apply'], {
      encoding: 'utf8',
    });

    expect(digest(realSpec)).toBe(before);
    expect(aliased.status, aliased.stdout + aliased.stderr).toBe(2);
    expect(aliased.stdout).toContain('symbolic link, not followed');

    // The same packet reached by its real path is healed, so the refusal above
    // is the link's doing and not an absence of work.
    const direct = spawnSync(process.execPath, [HEAL_SPEC_DOCS, '--folder', real, '--roots', specs, '--apply'], {
      encoding: 'utf8',
    });
    expect(direct.status, direct.stdout + direct.stderr).toBe(0);
    expect(direct.stdout).toContain(`healed ${realSpec}`);
  });

  it.each(modes)('%s --apply refuses a --folder spelled through an alias of the specs root when no --roots is given', (_label, flags, spec) => {
    const root = makeRoot();
    const specs = path.join(root, 'specs');
    fs.mkdirSync(specs);
    fs.symlinkSync(specs, path.join(root, 'alias'), 'dir');
    const outsideTrack = outsideDirectory();
    const outsidePacket = path.join(outsideTrack, '020-linked-packet');
    fs.mkdirSync(outsidePacket);
    const outsideSpec = path.join(outsidePacket, 'spec.md');
    fs.writeFileSync(outsideSpec, spec());
    const before = digest(outsideSpec);
    fs.symlinkSync(outsideTrack, path.join(specs, 'linked'), 'dir');
    const folder = path.join(root, 'alias', 'linked', '020-linked-packet');

    const result = spawnSync(process.execPath, [HEAL_SPEC_DOCS, ...flags, '--folder', folder, '--apply'], {
      cwd: root,
      encoding: 'utf8',
    });

    expect(digest(outsideSpec)).toBe(before);
    expect(result.status, result.stdout + result.stderr).toBe(2);
    expect(result.stdout).toContain(`refused ${folder}: symbolic link, not followed (alias is a link on the path to the folder)`);
  });

  it.each(modes)('%s --apply refuses a relative ../specs --folder run from a subdirectory when no --roots is given', (_label, flags, spec) => {
    const root = makeRoot();
    // A .git entry marks the repository top, so the specs directory beside it is
    // one the healer knows as a root even though no --roots names it.
    fs.mkdirSync(path.join(root, '.git'));
    const specs = path.join(root, 'specs');
    fs.mkdirSync(specs);
    const outsideTrack = outsideDirectory();
    const outsidePacket = path.join(outsideTrack, '020-linked-packet');
    fs.mkdirSync(outsidePacket);
    const outsideSpec = path.join(outsidePacket, 'spec.md');
    fs.writeFileSync(outsideSpec, spec());
    const before = digest(outsideSpec);
    fs.symlinkSync(outsideTrack, path.join(specs, 'linked'), 'dir');
    const sub = path.join(root, 'sub');
    fs.mkdirSync(sub);
    const folder = path.join('..', 'specs', 'linked', '020-linked-packet');

    const result = spawnSync(process.execPath, [HEAL_SPEC_DOCS, ...flags, '--folder', folder, '--apply'], {
      cwd: sub,
      encoding: 'utf8',
    });

    expect(digest(outsideSpec)).toBe(before);
    expect(result.status, result.stdout + result.stderr).toBe(2);
    expect(result.stdout).toContain(`refused ${folder}: symbolic link, not followed (specs/linked is a link on the path to the folder)`);
  });

  it('default run --apply refuses a --folder whose mid-path dot segment reaches a packet through a link', () => {
    const root = makeRoot();
    fs.mkdirSync(path.join(root, '.git'));
    const specs = path.join(root, 'specs');
    fs.mkdirSync(path.join(specs, 'track'), { recursive: true });
    const outsideTrack = outsideDirectory();
    const outsidePacket = path.join(outsideTrack, '020-linked-packet');
    fs.mkdirSync(outsidePacket);
    const outsideSpec = path.join(outsidePacket, 'spec.md');
    fs.writeFileSync(outsideSpec, provableSpec());
    const before = digest(outsideSpec);
    fs.symlinkSync(outsideTrack, path.join(specs, 'linked'), 'dir');
    // The dot segment steps back out of a real directory, so the path the healer
    // writes to runs through the link and the check must judge that same path.
    const folder = `${specs}/track/../linked/020-linked-packet`;

    const result = spawnSync(process.execPath, [HEAL_SPEC_DOCS, '--folder', folder, '--apply'], {
      cwd: root,
      encoding: 'utf8',
    });

    expect(digest(outsideSpec)).toBe(before);
    expect(result.status, result.stdout + result.stderr).toBe(2);
    expect(result.stdout).toContain(`refused ${folder}: symbolic link, not followed (specs/linked is a link on the path to the folder)`);
  });

  it('--roots run refuses a --folder whose linked parent resolves outside the given roots, and leaves that packet untouched', () => {
    const root = makeRoot();
    const specs = path.join(root, 'specs');
    fs.mkdirSync(specs);
    const outsideTrack = outsideDirectory();
    const outsidePacket = path.join(outsideTrack, '020-linked-packet');
    fs.mkdirSync(outsidePacket);
    const outsideSpec = path.join(outsidePacket, 'spec.md');
    fs.writeFileSync(outsideSpec, provableSpec());
    const before = digest(outsideSpec);
    const holder = outsideDirectory();
    fs.symlinkSync(outsideTrack, path.join(holder, 'linkparent'), 'dir');
    const folder = path.join(holder, 'linkparent', '020-linked-packet');

    const result = spawnSync(process.execPath, [HEAL_SPEC_DOCS, '--folder', folder, '--roots', specs, '--apply'], {
      encoding: 'utf8',
    });

    expect(digest(outsideSpec)).toBe(before);
    expect(result.status, result.stdout + result.stderr).toBe(2);
    expect(result.stdout).toContain(`refused ${folder}: symbolic link, not followed (it resolves outside the specs root)`);
    expect(fs.lstatSync(path.join(holder, 'linkparent')).isSymbolicLink()).toBe(true);
  });

  it('default run --apply refuses a case-variant SPECS --folder when no --roots is given', (ctx) => {
    const root = makeRoot();
    if (!filesystemIsCaseInsensitive(root)) {
      ctx.skip('the fixture filesystem is case-sensitive, so SPECS does not name the specs root');
    }
    const specs = path.join(root, 'specs');
    fs.mkdirSync(specs);
    const outsideTrack = outsideDirectory();
    const outsidePacket = path.join(outsideTrack, '020-linked-packet');
    fs.mkdirSync(outsidePacket);
    const outsideSpec = path.join(outsidePacket, 'spec.md');
    fs.writeFileSync(outsideSpec, provableSpec());
    const before = digest(outsideSpec);
    fs.symlinkSync(outsideTrack, path.join(specs, 'linked'), 'dir');
    const folder = path.join(root, 'SPECS', 'linked', '020-linked-packet');

    const result = spawnSync(process.execPath, [HEAL_SPEC_DOCS, '--folder', folder, '--apply'], {
      cwd: root,
      encoding: 'utf8',
    });

    expect(digest(outsideSpec)).toBe(before);
    expect(result.status, result.stdout + result.stderr).toBe(2);
    expect(result.stdout).toContain(`refused ${folder}: symbolic link, not followed (linked is a link on the path to the folder)`);
  });

  it('default run --apply refuses a --folder inside a repository, reached through a link from a cwd outside every repository', (ctx) => {
    const cwd = outsideDirectory();
    if (repositoryAbove(cwd)) {
      ctx.skip('a repository holds the temp directory, so the working directory is inside one');
    }
    const root = makeRoot();
    fs.mkdirSync(path.join(root, '.git'));
    const specs = path.join(root, 'specs');
    fs.mkdirSync(specs);
    const outsideTrack = outsideDirectory();
    const outsidePacket = path.join(outsideTrack, '020-linked-packet');
    fs.mkdirSync(outsidePacket);
    const outsideSpec = path.join(outsidePacket, 'spec.md');
    fs.writeFileSync(outsideSpec, provableSpec());
    const before = digest(outsideSpec);
    fs.symlinkSync(outsideTrack, path.join(specs, 'linked'), 'dir');
    // The repository is named only by the folder, so the cwd contributes no root.
    const folder = path.join(specs, 'linked', '020-linked-packet');

    const result = spawnSync(process.execPath, [HEAL_SPEC_DOCS, '--folder', folder, '--apply'], {
      cwd,
      encoding: 'utf8',
    });

    expect(digest(outsideSpec)).toBe(before);
    expect(result.status, result.stdout + result.stderr).toBe(2);
    expect(result.stdout).toContain(`refused ${folder}: symbolic link, not followed (specs/linked is a link on the path to the folder)`);
  });

  it('default run --apply refuses a --folder whose path enters a repository through an alias, from a cwd outside every repository', (ctx) => {
    const cwd = outsideDirectory();
    if (repositoryAbove(cwd)) {
      ctx.skip('a repository holds the temp directory, so the working directory is inside one');
    }
    const root = makeRoot();
    fs.mkdirSync(path.join(root, '.git'));
    const specs = path.join(root, 'specs');
    fs.mkdirSync(specs);
    const outsideTrack = outsideDirectory();
    const outsidePacket = path.join(outsideTrack, '020-linked-packet');
    fs.mkdirSync(outsidePacket);
    const outsideSpec = path.join(outsidePacket, 'spec.md');
    fs.writeFileSync(outsideSpec, provableSpec());
    const before = digest(outsideSpec);
    fs.symlinkSync(outsideTrack, path.join(specs, 'linked'), 'dir');
    // The alias lives outside the repository, so the repository is named only by
    // what the alias points at.
    fs.symlinkSync(specs, path.join(cwd, 'alias'), 'dir');
    const folder = path.join(cwd, 'alias', 'linked', '020-linked-packet');

    const result = spawnSync(process.execPath, [HEAL_SPEC_DOCS, '--folder', folder, '--apply'], {
      cwd,
      encoding: 'utf8',
    });

    expect(digest(outsideSpec)).toBe(before);
    expect(result.status, result.stdout + result.stderr).toBe(2);
    expect(result.stdout).toContain(`refused ${folder}: symbolic link, not followed (alias is a link on the path to the folder)`);
  });
});

// Each spelling reaches a repository's files only through an alias whose target is
// a directory that is not a root itself. The repository is named by what the alias
// points at, and nothing else on the path names it. The group skips when a
// repository holds the temp directory, since the working directory would then be
// inside one.
describe.skipIf(repositoryAbove(os.tmpdir()))('heal-spec-docs entry through a non-root directory', () => {
  it.each<[string, string, string]>([
    ['an alias to a non-root directory in the specs tree', 'alias', path.join('specs', 'sub')],
    ['an alias to a directory beside the specs tree', 'alias', 'docs'],
    ['an alias reached through a real directory outside every repository', path.join('mid', 'alias'), path.join('specs', 'sub')],
  ])('default run --apply refuses a --folder that enters a repository through %s, from a cwd outside every repository', (_label, aliasAt, inside) => {
    const cwd = outsideDirectory();
    const root = makeRoot();
    fs.mkdirSync(path.join(root, '.git'));
    const target = path.join(root, inside);
    fs.mkdirSync(target, { recursive: true });
    const outsideTrack = outsideDirectory();
    const outsidePacket = path.join(outsideTrack, '020-linked-packet');
    fs.mkdirSync(outsidePacket);
    const outsideSpec = path.join(outsidePacket, 'spec.md');
    fs.writeFileSync(outsideSpec, provableSpec());
    const before = digest(outsideSpec);
    fs.symlinkSync(outsideTrack, path.join(target, 'linked'), 'dir');
    fs.mkdirSync(path.dirname(path.join(cwd, aliasAt)), { recursive: true });
    fs.symlinkSync(target, path.join(cwd, aliasAt), 'dir');
    const folder = path.join(cwd, aliasAt, 'linked', '020-linked-packet');

    const result = spawnSync(process.execPath, [HEAL_SPEC_DOCS, '--folder', folder, '--apply'], {
      cwd,
      encoding: 'utf8',
    });

    expect(digest(outsideSpec)).toBe(before);
    expect(result.status, result.stdout + result.stderr).toBe(2);
    expect(result.stdout).toContain(`refused ${folder}: symbolic link, not followed (alias is a link on the path to the folder)`);
  });

  it('default run --apply refuses a --folder that enters a repository through an alias, with nothing linked below it', () => {
    const cwd = outsideDirectory();
    const root = makeRoot();
    fs.mkdirSync(path.join(root, '.git'));
    const specs = path.join(root, 'specs');
    const packet = path.join(specs, '020-plain');
    fs.mkdirSync(packet, { recursive: true });
    fs.writeFileSync(path.join(packet, 'spec.md'), provableSpec());
    const before = digest(path.join(packet, 'spec.md'));
    fs.symlinkSync(specs, path.join(cwd, 'alias'), 'dir');
    const folder = path.join(cwd, 'alias', '020-plain');

    const refused = spawnSync(process.execPath, [HEAL_SPEC_DOCS, '--folder', folder, '--apply'], {
      cwd,
      encoding: 'utf8',
    });

    expect(digest(path.join(packet, 'spec.md'))).toBe(before);
    expect(refused.status, refused.stdout + refused.stderr).toBe(2);
    expect(refused.stdout).toContain(`refused ${folder}: symbolic link, not followed (alias is a link on the path to the folder)`);

    // The same packet reached by its real path is healed, so the refusal above is
    // the entry link's doing and not an absence of work.
    const direct = spawnSync(process.execPath, [HEAL_SPEC_DOCS, '--folder', packet, '--apply'], {
      cwd,
      encoding: 'utf8',
    });
    expect(direct.status, direct.stdout + direct.stderr).toBe(0);
    expect(direct.stdout).toContain(`healed ${path.join(packet, 'spec.md')}`);
  });
});

describe('heal-spec-docs --folder argument value', () => {
  it.each<[string, string[]]>([
    ['--folder as the last argument', ['--folder']],
    ['--folder followed by another flag', ['--folder', '--apply']],
  ])('%s is a usage error with no stack trace, and writes nothing', (_label, tail) => {
    const root = makeRoot();
    const specs = path.join(root, 'specs');
    const packet = writeRegularPacket(root, '020-plain', provableSpec());
    const before = digest(path.join(packet, 'spec.md'));

    const result = spawnSync(process.execPath, [HEAL_SPEC_DOCS, '--roots', specs, '--apply', ...tail], {
      encoding: 'utf8',
    });

    expect(result.status, result.stdout + result.stderr).toBe(2);
    expect(result.stderr).toContain('--folder requires a value');
    expect(result.stderr).toContain('Usage:');
    expect(result.stderr).not.toContain('TypeError');
    expect(result.stderr).not.toMatch(/^\s+at /m);
    expect(result.stdout).not.toContain('healed');
    expect(digest(path.join(packet, 'spec.md'))).toBe(before);
  });

  it('--roots as the last argument is a usage error with no stack trace, and writes nothing', () => {
    const root = makeRoot();
    const packet = writeRegularPacket(root, '020-plain', provableSpec());
    const before = digest(path.join(packet, 'spec.md'));

    // A run that proceeds past the missing value finds no packets and exits 0, so
    // the exit status is the check that the usage error fires.
    const result = spawnSync(process.execPath, [HEAL_SPEC_DOCS, '--apply', '--roots'], {
      cwd: root,
      encoding: 'utf8',
    });

    expect(result.status, result.stdout + result.stderr).toBe(2);
    expect(result.stderr).toContain('--roots requires a value');
    expect(result.stderr).toContain('Usage:');
    expect(result.stderr).not.toContain('TypeError');
    expect(result.stderr).not.toMatch(/^\s+at /m);
    expect(result.stdout).not.toContain('healed');
    expect(digest(path.join(packet, 'spec.md'))).toBe(before);
  });
});
