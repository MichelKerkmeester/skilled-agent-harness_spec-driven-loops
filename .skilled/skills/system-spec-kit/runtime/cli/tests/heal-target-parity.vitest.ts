// ───────────────────────────────────────────────────────────────
// MODULE: Heal Target Parity
// ───────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it } from 'vitest';

const CLI_DIR = path.resolve(__dirname, '..');
const HEAL_SPEC_DOCS = path.join(CLI_DIR, 'spec', 'heal-spec-docs.cjs');
const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

// The three entrypoints that select packets: the default healer, --anchor-repair
// and --lane-modes. Each takes the same --folder and --roots inputs. Each also
// declares the line it prints for a packet document: a fixed lead-in, then the
// document path up to the document name.
const ENTRYPOINTS = [
  {
    name: 'default',
    flags: [] as string[],
    line: /^(?:would heal|healed|refused) (.+?)\/(?:spec|plan|tasks|implementation-summary)\.md(?=:|$)/,
  },
  {
    name: 'anchor-repair',
    flags: ['--anchor-repair'],
    line: /^(?:would repair|repaired|left unchanged) (.+?)\/spec\.md(?=:|$)/,
  },
  {
    name: 'lane-modes',
    flags: ['--lane-modes'],
    // A lane mode name sits between the lead-in and the path, and it has no spaces.
    line: /^(?:would apply|applied|refused) \S+ (.+?)\/(?:spec|plan|tasks|implementation-summary)\.md(?=:|$)/,
  },
];

// Each packet document a healthy-looking fixture carries produces a line in
// every entrypoint, so the packets an entrypoint names are the packets it covers.
const DUPLICATE_ANCHORS = [
  '---',
  'title: "Parity probe"',
  'description: "Target parity fixture."',
  '---',
  '# Parity probe',
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

function makeFixture(): { root: string; specs: string; packetA: string; packetB: string } {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'heal-target-parity-')));
  roots.push(root);
  const specs = path.join(root, 'specs');

  const packetA = path.join(specs, 'alpha', '001-one');
  const packetB = path.join(specs, 'beta', '002-two');
  for (const packet of [packetA, packetB]) {
    fs.mkdirSync(packet, { recursive: true });
    fs.writeFileSync(path.join(packet, 'spec.md'), DUPLICATE_ANCHORS);
    fs.writeFileSync(path.join(packet, 'plan.md'), '# Plan\n');
    fs.writeFileSync(path.join(packet, 'tasks.md'), '---\ntitle: "Tasks"\ntrigger_phrases:\n---\n# Tasks\n');
  }

  // Each of these is excluded from discovery by a different rule: no spec.md,
  // a scratch folder, and a name that is not a numbered packet.
  const noSpec = path.join(specs, 'alpha', '004-no-spec');
  fs.mkdirSync(noSpec, { recursive: true });
  fs.writeFileSync(path.join(noSpec, 'plan.md'), '# Plan\n');
  const scratch = path.join(specs, 'alpha', 'scratch', '005-scratch');
  fs.mkdirSync(scratch, { recursive: true });
  fs.writeFileSync(path.join(scratch, 'spec.md'), DUPLICATE_ANCHORS);
  const unnumbered = path.join(specs, 'beta', 'notes');
  fs.mkdirSync(unnumbered, { recursive: true });
  fs.writeFileSync(path.join(unnumbered, 'spec.md'), DUPLICATE_ANCHORS);

  return { root, specs, packetA, packetB };
}

function runEntrypoint(entry: { flags: string[] }, args: string[], cwd?: string) {
  return spawnSync(process.execPath, [HEAL_SPEC_DOCS, ...entry.flags, ...args], {
    encoding: 'utf8',
    cwd,
  });
}

// The packet folders named in an entrypoint's output, taken from the document
// paths it prints. Each line is matched from its fixed lead-in to the document
// name, so a path keeps its spaces and non-ASCII characters whole.
function packetsNamed(output: string, line: RegExp): string[] {
  const found = new Set<string>();
  for (const text of output.split('\n')) {
    const match = line.exec(text);
    if (match) found.add(match[1]);
  }
  return [...found].sort();
}

describe('heal-spec-docs target selection parity', () => {
  it('each entrypoint discovers the same packets under --roots', () => {
    const { specs, packetA, packetB } = makeFixture();
    const expected = [packetA, packetB].sort();

    for (const entry of ENTRYPOINTS) {
      const result = runEntrypoint(entry, ['--roots', specs]);
      expect(result.status, `${entry.name}: ${result.stdout}${result.stderr}`).toBe(0);
      expect(packetsNamed(result.stdout, entry.line), entry.name).toEqual(expected);
    }
  });

  it('each entrypoint defaults the specs root to the working directory', () => {
    const { root } = makeFixture();
    // With no --roots the specs root is relative, so the printed packets are too.
    const expected = [path.join('specs', 'alpha', '001-one'), path.join('specs', 'beta', '002-two')].sort();

    for (const entry of ENTRYPOINTS) {
      const result = runEntrypoint(entry, [], root);
      expect(result.status, `${entry.name}: ${result.stdout}${result.stderr}`).toBe(0);
      expect(packetsNamed(result.stdout, entry.line), entry.name).toEqual(expected);
    }
  });

  it('each entrypoint narrows to the one packet named by --folder, with or without --roots', () => {
    const { specs, packetA } = makeFixture();

    for (const entry of ENTRYPOINTS) {
      const alone = runEntrypoint(entry, ['--folder', packetA]);
      expect(alone.status, `${entry.name} alone: ${alone.stdout}${alone.stderr}`).toBe(0);
      expect(packetsNamed(alone.stdout, entry.line), `${entry.name} alone`).toEqual([packetA]);

      const withRoots = runEntrypoint(entry, ['--folder', packetA, '--roots', specs]);
      expect(withRoots.status, `${entry.name} with roots: ${withRoots.stdout}${withRoots.stderr}`).toBe(0);
      expect(packetsNamed(withRoots.stdout, entry.line), `${entry.name} with roots`).toEqual([packetA]);
    }
  });

  it('the default and anchor-repair summaries count the same packets', () => {
    const { specs } = makeFixture();

    const defaults = runEntrypoint(ENTRYPOINTS[0], ['--roots', specs]);
    const anchors = runEntrypoint(ENTRYPOINTS[1], ['--roots', specs]);

    expect(defaults.stdout).toMatch(/packets=2 documents/);
    expect(anchors.stdout).toMatch(/anchor repair: documents=2 /);
  });
});
