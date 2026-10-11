// ───────────────────────────────────────────────────────────────
// MODULE: Heal Arguments
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

// Temporary roots, removed after each test.
const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

function makeRoot(): string {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'heal-arguments-')));
  roots.push(root);
  return root;
}

function digest(file: string): string {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function levelTwoSpecAnchors(): string[] {
  const contract = loadTemplateContractForDocument('2', 'spec.md', 'spec.md');
  if (!contract.supported) throw new Error('Level 2 spec.md contract did not resolve');
  return [...contract.requiredAnchors, ...(contract.optionalAnchors || [])];
}

// A spec.md the default healer stamps with a template-source header, so a run that
// ignores its arguments and writes visibly changes the file.
function provableSpec(): string {
  return [
    '---',
    'title: "Argument probe"',
    'description: "Argument fixture."',
    '---',
    '# Argument probe',
    '<!-- SPECKIT_LEVEL: 2 -->',
    '',
    ...levelTwoSpecAnchors().map((anchor) => `<!-- ANCHOR:${anchor} -->`),
    '',
  ].join('\n');
}

// Two anchors share one name, so the anchor repair has a change to make.
function duplicateAnchorSpec(): string {
  return [
    '---',
    'title: "Argument probe"',
    'description: "Argument fixture."',
    '---',
    '# Argument probe',
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

function writePacket(root: string, name: string, spec: string): string {
  const packet = path.join(root, 'specs', name);
  fs.mkdirSync(packet, { recursive: true });
  fs.writeFileSync(path.join(packet, 'spec.md'), spec);
  return packet;
}

// Each entrypoint, with the spec its control packet needs and the verb a healed
// control prints for it.
const MODES: Array<[string, string[], () => string, string]> = [
  ['default run', [], provableSpec, 'healed'],
  ['--anchor-repair', ['--anchor-repair'], duplicateAnchorSpec, 'repaired'],
  ['--lane-modes', ['--lane-modes'], provableSpec, 'applied header-add'],
];

const REMOVED_ARGUMENTS: Array<[string, string]> = [
  ['--mode', 'heal-spec-docs: --mode was removed in v4.0.0.4. Without it, --lane-modes runs all five modes. Drop --mode.'],
  ['--json', 'heal-spec-docs: --json was removed in v4.0.0.4. Lane modes print "would apply", "applied" and "refused" lines. Drop --json.'],
];

describe('heal-spec-docs argument checks', () => {
  for (const [mode, flags, spec] of MODES) {
    for (const [argument, expectedMessage] of REMOVED_ARGUMENTS) {
      it(`${mode} rejects ${argument} and writes nothing`, () => {
        const root = makeRoot();
        const specs = path.join(root, 'specs');
        const packet = writePacket(root, '020-probe', spec());
        const before = digest(path.join(packet, 'spec.md'));

        const result = spawnSync(process.execPath, [HEAL_SPEC_DOCS, ...flags, '--roots', specs, '--folder', packet, argument, '--apply'], {
          encoding: 'utf8',
        });

        expect(result.status, result.stdout + result.stderr).toBe(2);
        expect(result.stderr.split('\n')[0]).toBe(expectedMessage);
        expect(result.stderr).not.toContain('unknown argument:');
        expect(result.stdout).toBe('');
        expect(digest(path.join(packet, 'spec.md'))).toBe(before);
      });
    }
  }

  it('--lane-modes with --mode <name> --apply exits 2 and writes nothing', () => {
    const root = makeRoot();
    const specs = path.join(root, 'specs');
    const packet = writePacket(root, '020-probe', provableSpec());
    const before = digest(path.join(packet, 'spec.md'));

    const result = spawnSync(process.execPath, [HEAL_SPEC_DOCS, '--lane-modes', '--mode', 'header-add', '--apply', '--roots', specs, '--folder', packet], {
      encoding: 'utf8',
    });

    expect(result.status, result.stdout + result.stderr).toBe(2);
    expect(result.stderr.split('\n')[0]).toBe(REMOVED_ARGUMENTS[0][1]);
    expect(result.stdout).toBe('');
    expect(digest(path.join(packet, 'spec.md'))).toBe(before);
  });

  it.each(MODES)('%s exits 2 and names an unknown flag, and writes nothing', (_label, flags, spec) => {
    const root = makeRoot();
    const specs = path.join(root, 'specs');
    const packet = writePacket(root, '020-probe', spec());
    const before = digest(path.join(packet, 'spec.md'));

    const result = spawnSync(process.execPath, [HEAL_SPEC_DOCS, ...flags, '--roots', specs, '--bogus-flag', '--apply'], {
      encoding: 'utf8',
    });

    expect(result.status, result.stdout + result.stderr).toBe(2);
    expect(result.stderr).toContain('heal-spec-docs: unknown argument: --bogus-flag');
    expect(digest(path.join(packet, 'spec.md'))).toBe(before);
  });

  it.each(MODES)('%s exits 2 and names a --folder that does not exist, and writes nothing', (_label, flags, spec) => {
    const root = makeRoot();
    const specs = path.join(root, 'specs');
    const packet = writePacket(root, '020-probe', spec());
    const before = digest(path.join(packet, 'spec.md'));
    const missing = path.join(specs, '020-missing');

    const result = spawnSync(process.execPath, [HEAL_SPEC_DOCS, ...flags, '--roots', specs, '--folder', missing, '--apply'], {
      encoding: 'utf8',
    });

    expect(result.status, result.stdout + result.stderr).toBe(2);
    expect(result.stderr).toContain(`heal-spec-docs: no such folder: ${missing}`);
    expect(result.stdout).not.toContain('packets=');
    expect(digest(path.join(packet, 'spec.md'))).toBe(before);
  });

  it.each(MODES)('%s exits 2 and names a --roots that does not exist', (_label, flags) => {
    const root = makeRoot();
    const missing = path.join(root, 'no-specs');

    const result = spawnSync(process.execPath, [HEAL_SPEC_DOCS, ...flags, '--roots', missing, '--apply'], {
      encoding: 'utf8',
    });

    expect(result.status, result.stdout + result.stderr).toBe(2);
    expect(result.stderr).toContain(`heal-spec-docs: no such root: ${missing}`);
    expect(result.stdout).not.toContain('packets=');
  });

  it.each(MODES)('%s accepts its known flags and heals the packet they name', (_label, flags, spec, verb) => {
    const root = makeRoot();
    const specs = path.join(root, 'specs');
    const packet = writePacket(root, '020-probe', spec());
    const file = path.join(packet, 'spec.md');

    const result = spawnSync(process.execPath, [HEAL_SPEC_DOCS, ...flags, '--roots', specs, '--folder', packet, '--apply'], {
      encoding: 'utf8',
    });

    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toContain(`${verb} ${file}`);
  });
});
