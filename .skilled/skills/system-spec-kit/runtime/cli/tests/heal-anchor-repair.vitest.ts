// ───────────────────────────────────────────────────────────────────
// MODULE: Heal Anchor Repair
// ───────────────────────────────────────────────────────────────────

import crypto from 'node:crypto';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it, vi } from 'vitest';

const require = createRequire(path.join(__dirname, 'heal-anchor-repair.vitest.ts'));
const {
  repairAnchorFile,
  repairAnchors,
  unnestQuestionsAnchors,
} = require('../spec/heal-spec-docs.cjs') as {
  repairAnchorFile: (
    file: string,
    options?: { apply?: boolean },
  ) => AnchorRepairResult & { file: string; applied: boolean };
  repairAnchors: (text: string) => AnchorRepairResult;
  unnestQuestionsAnchors: (text: string) => AnchorRepairResult;
};

type AnchorRepairResult = {
  text: string;
  changed: boolean;
  actions: string[];
  refusals: string[];
};

const CLI_DIR = path.resolve(__dirname, '..');
const HEAL_SPEC_DOCS = path.join(CLI_DIR, 'spec', 'heal-spec-docs.cjs');
const roots: string[] = [];

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

function makeRoot(): string {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'heal-anchor-repair-')));
  roots.push(root);
  return root;
}

function writeSpec(root: string, content: string): { packet: string; file: string } {
  const packet = path.join(root, 'specs', 'anchor-repair', '001-probe');
  fs.mkdirSync(packet, { recursive: true });
  const file = path.join(packet, 'spec.md');
  fs.writeFileSync(file, content);
  return { packet, file };
}

function manifest(root: string): string {
  const entries: string[] = [];
  const walk = (directory: string): void => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(file);
      } else {
        const digest = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
        entries.push(`${path.relative(root, file).split(path.sep).join('/')} ${digest}`);
      }
    }
  };
  walk(root);
  return crypto.createHash('sha256').update(entries.sort().join('\n')).digest('hex');
}

function runRepair(packet: string, apply = false) {
  return spawnSync(
    process.execPath,
    [HEAL_SPEC_DOCS, '--anchor-repair', '--folder', packet, ...(apply ? ['--apply'] : [])],
    { encoding: 'utf8' },
  );
}

function withoutAnchorLines(text: string): string {
  return text.replace(/^[ \t]*<!--\s*\/?ANCHOR:[a-z0-9-]+\s*-->[ \t]*(?:\r?\n|$)/gm, '');
}

// The adversarial table pins the parser's grammar boundary and its refusals:
// which marker spellings count as markers, what joined input and fences do to
// pairing, and that a document the mode cannot repair marker-only is refused
// instead of written.
type AdversarialCase = {
  name: string;
  document: string;
  run: (text: string) => AnchorRepairResult;
  changed: boolean;
  /** Exact text the entry point must return; absent means the document is unchanged. */
  expected?: string;
  action?: string;
  refusal?: string;
  /** The entry point must report no action and no refusal. */
  silent?: boolean;
  /** Replay the case through the file and CLI paths and require byte-identity. */
  byteIdentical?: boolean;
};

const adversarialCases: AdversarialCase[] = [
  {
    name: 'extra spaces inside a marker comment are still a marker',
    document: [
      '# Probe',
      '',
      '<!--   ANCHOR:questions   -->',
      '## L2: NON-FUNCTIONAL REQUIREMENTS',
      'Performance notes.',
      '',
      '## 10. OPEN QUESTIONS',
      '- None open.',
      '<!--   /ANCHOR:questions   -->',
      '',
    ].join('\n'),
    run: repairAnchors,
    changed: true,
    action: 'moved questions opener',
    expected: [
      '# Probe',
      '',
      '## L2: NON-FUNCTIONAL REQUIREMENTS',
      'Performance notes.',
      '',
      '<!--   ANCHOR:questions   -->',
      '## 10. OPEN QUESTIONS',
      '- None open.',
      '<!--   /ANCHOR:questions   -->',
      '',
    ].join('\n'),
  },
  {
    // ANCHOR is the token: the canonical pair repairs and the lower-case
    // lookalike stays prose.
    name: 'the anchor token is case-sensitive: the upper-case pair repairs, the lower-case pair stays prose',
    document: [
      '# Probe',
      '',
      '<!-- anchor:questions -->',
      '## 11. OPEN QUESTIONS',
      '- None open.',
      '<!-- /anchor:questions -->',
      '',
      '<!-- ANCHOR:questions -->',
      '## L2: NON-FUNCTIONAL REQUIREMENTS',
      'Performance notes.',
      '',
      '## 10. OPEN QUESTIONS',
      '- None open.',
      '<!-- /ANCHOR:questions -->',
      '',
    ].join('\n'),
    run: repairAnchors,
    changed: true,
    action: 'moved questions opener',
    expected: [
      '# Probe',
      '',
      '<!-- anchor:questions -->',
      '## 11. OPEN QUESTIONS',
      '- None open.',
      '<!-- /anchor:questions -->',
      '',
      '## L2: NON-FUNCTIONAL REQUIREMENTS',
      'Performance notes.',
      '',
      '<!-- ANCHOR:questions -->',
      '## 10. OPEN QUESTIONS',
      '- None open.',
      '<!-- /ANCHOR:questions -->',
      '',
    ].join('\n'),
  },
  {
    // Fenced duplicates are pinned by 'ignores duplicate marker examples in
    // backtick and tilde fences' and a fence between a pair by 'does not pair
    // an anchor across a fence'; this row covers the questions path.
    name: 'marker lookalikes inside ``` and ~~~ fences stay prose in the questions path',
    document: [
      '# Probe',
      '',
      '```md',
      '<!-- ANCHOR:questions -->',
      '## 10. OPEN QUESTIONS',
      '<!-- /ANCHOR:questions -->',
      '```',
      '',
      '~~~md',
      '<!-- ANCHOR:questions -->',
      '<!-- /ANCHOR:questions -->',
      '~~~',
      '',
      '<!-- ANCHOR:questions -->',
      '## L2: NON-FUNCTIONAL REQUIREMENTS',
      'Performance notes.',
      '',
      '## 10. OPEN QUESTIONS',
      '- None open.',
      '<!-- /ANCHOR:questions -->',
      '',
    ].join('\n'),
    run: repairAnchors,
    changed: true,
    action: 'moved questions opener',
    expected: [
      '# Probe',
      '',
      '```md',
      '<!-- ANCHOR:questions -->',
      '## 10. OPEN QUESTIONS',
      '<!-- /ANCHOR:questions -->',
      '```',
      '',
      '~~~md',
      '<!-- ANCHOR:questions -->',
      '<!-- /ANCHOR:questions -->',
      '~~~',
      '',
      '## L2: NON-FUNCTIONAL REQUIREMENTS',
      'Performance notes.',
      '',
      '<!-- ANCHOR:questions -->',
      '## 10. OPEN QUESTIONS',
      '- None open.',
      '<!-- /ANCHOR:questions -->',
      '',
    ].join('\n'),
  },
  {
    // Whole-line markers are the contract, so an opener and closer joined on
    // one line is prose and never a pair.
    name: 'an opener and closer joined on one line are prose, not a pair',
    document: [
      '# Probe',
      '',
      '<!-- ANCHOR:questions --><!-- /ANCHOR:questions -->',
      '',
      '<!-- ANCHOR:questions -->',
      '## L2: NON-FUNCTIONAL REQUIREMENTS',
      'Performance notes.',
      '',
      '## 10. OPEN QUESTIONS',
      '- None open.',
      '<!-- /ANCHOR:questions -->',
      '',
    ].join('\n'),
    run: repairAnchors,
    changed: true,
    action: 'moved questions opener',
    expected: [
      '# Probe',
      '',
      '<!-- ANCHOR:questions --><!-- /ANCHOR:questions -->',
      '',
      '## L2: NON-FUNCTIONAL REQUIREMENTS',
      'Performance notes.',
      '',
      '<!-- ANCHOR:questions -->',
      '## 10. OPEN QUESTIONS',
      '- None open.',
      '<!-- /ANCHOR:questions -->',
      '',
    ].join('\n'),
  },
  {
    // Joined openers are prose too, so the lone closer is unmatched; the
    // opening side of this guard is pinned by 'does not pair an anchor across
    // a fence'.
    name: 'two openers joined on one line leave the lone closer unmatched',
    document: [
      '# Probe',
      '',
      '<!-- ANCHOR:questions --><!-- ANCHOR:questions -->',
      '## 10. OPEN QUESTIONS',
      '- None open.',
      '<!-- /ANCHOR:questions -->',
      '',
    ].join('\n'),
    run: repairAnchors,
    changed: false,
    refusal: 'unmatched closing anchor questions',
  },
  {
    // An unclosed fence marks every later line as fence interior, so the
    // anchor is invisible and the mode stays silent.
    name: 'an unclosed fence before the questions anchor hides it, so nothing is written',
    document: [
      '# Probe',
      '',
      '```md',
      '<!-- ANCHOR:questions -->',
      '## L2: NON-FUNCTIONAL REQUIREMENTS',
      'Performance notes.',
      '',
      '## 10. OPEN QUESTIONS',
      '- None open.',
      '<!-- /ANCHOR:questions -->',
      '',
    ].join('\n'),
    run: repairAnchors,
    changed: false,
    silent: true,
    byteIdentical: true,
  },
  {
    // repairAnchors renames duplicates before the un-nesting runs, so the
    // ambiguity guard is pinned through the un-nesting entry point.
    name: 'a nested and a flat questions anchor together are ambiguous to the un-nesting',
    document: [
      '# Probe',
      '',
      '<!-- ANCHOR:questions -->',
      '## L2: NON-FUNCTIONAL REQUIREMENTS',
      'Performance notes.',
      '',
      '## 10. OPEN QUESTIONS',
      '- None open.',
      '<!-- /ANCHOR:questions -->',
      '',
      '<!-- ANCHOR:questions -->',
      '## 11. OPEN QUESTIONS',
      '- Still none.',
      '<!-- /ANCHOR:questions -->',
      '',
    ].join('\n'),
    run: unnestQuestionsAnchors,
    changed: false,
    refusal: 'questions anchors are ambiguous; left unchanged',
  },
  {
    // The in-memory no-op is pinned by 'treats a flat questions anchor with a
    // deeper Open Questions subheading as needing nothing'; this row adds the
    // file and CLI byte-identity proof.
    name: 'an already flat document is byte-identical after repair',
    document: [
      '# Probe',
      '',
      '<!-- ANCHOR:metadata -->',
      '| Field | Value |',
      '<!-- /ANCHOR:metadata -->',
      '',
      '<!-- ANCHOR:questions -->',
      '## 10. OPEN QUESTIONS',
      '- None open.',
      '<!-- /ANCHOR:questions -->',
      '',
    ].join('\n'),
    run: repairAnchors,
    changed: false,
    silent: true,
    byteIdentical: true,
  },
  {
    // Wrapper overlaps are pinned by 'refuses the un-nesting when the OPEN
    // QUESTIONS heading is already wrapped'; this row pins the other
    // marker-only dead end.
    name: 'a questions pair with no OPEN QUESTIONS heading is refused and left byte-identical',
    document: [
      '# Probe',
      '',
      '<!-- ANCHOR:questions -->',
      '## L2: NON-FUNCTIONAL REQUIREMENTS',
      'Performance notes.',
      '',
      '## 10. RISKS',
      '- None.',
      '<!-- /ANCHOR:questions -->',
      '',
    ].join('\n'),
    run: repairAnchors,
    changed: false,
    refusal: 'questions anchor does not contain exactly one OPEN QUESTIONS heading; left unchanged',
    byteIdentical: true,
  },
];

describe('heal-spec-docs anchor repair mode', () => {
  it('dry-runs and removes a glued overlapping duplicate pair on apply', () => {
    const root = makeRoot();
    const original = [
      '# Probe',
      '',
      '<!-- ANCHOR:metadata -->',
      '<!-- ANCHOR:metadata -->',
      '| Field | Value |',
      '<!-- /ANCHOR:metadata -->',
      '<!-- /ANCHOR:metadata -->',
      '',
      'End.',
      '',
    ].join('\n');
    const { packet, file } = writeSpec(root, original);
    const before = manifest(root);

    const dryRun = runRepair(packet);

    expect(dryRun.status, dryRun.stdout + dryRun.stderr).toBe(0);
    expect(dryRun.stdout).toContain('would repair');
    expect(dryRun.stdout).toContain('removed glued overlapping duplicate pair metadata');
    expect(manifest(root)).toBe(before);
    expect(fs.readdirSync(packet)).toEqual(['spec.md']);

    const applied = runRepair(packet, true);

    expect(applied.status, applied.stdout + applied.stderr).toBe(0);
    expect(applied.stdout).toContain('repaired');
    expect(fs.readFileSync(file, 'utf8')).toBe([
      '# Probe',
      '',
      '<!-- ANCHOR:metadata -->',
      '| Field | Value |',
      '<!-- /ANCHOR:metadata -->',
      '',
      'End.',
      '',
    ].join('\n'));
  });

  it('ignores duplicate marker examples in backtick and tilde fences', () => {
    const root = makeRoot();
    const original = [
      '# Probe',
      '',
      '<!-- ANCHOR:examples -->',
      'First section contains code samples.',
      '',
      '```md',
      '<!-- /ANCHOR:examples -->',
      '<!-- ANCHOR:examples -->',
      '```',
      '',
      '~~~md',
      '<!-- ANCHOR:examples -->',
      '<!-- /ANCHOR:examples -->',
      '~~~',
      '',
      'Still in the first section.',
      '<!-- /ANCHOR:examples -->',
      '',
      '<!-- ANCHOR:examples -->',
      'Second section.',
      '<!-- /ANCHOR:examples -->',
      '',
    ].join('\n');
    const { packet, file } = writeSpec(root, original);
    const before = manifest(root);

    const dryRun = runRepair(packet);

    expect(dryRun.status, dryRun.stdout + dryRun.stderr).toBe(0);
    expect(dryRun.stdout).toContain('renamed isolated duplicate pair examples to examples-2');
    expect(manifest(root)).toBe(before);

    const applied = runRepair(packet, true);
    const expected = original.replace(
      '\n<!-- ANCHOR:examples -->\nSecond section.\n<!-- /ANCHOR:examples -->',
      '\n<!-- ANCHOR:examples-2 -->\nSecond section.\n<!-- /ANCHOR:examples-2 -->',
    );

    expect(applied.status, applied.stdout + applied.stderr).toBe(0);
    expect(fs.readFileSync(file, 'utf8')).toBe(expected);
  });

  it('dry-runs and moves the nested questions opener on apply', () => {
    const root = makeRoot();
    const original = [
      '# Probe',
      '',
      '<!-- ANCHOR:questions -->',
      '## L2: NON-FUNCTIONAL REQUIREMENTS',
      'Performance notes.',
      '',
      '## L2: EDGE CASES',
      'Boundary notes.',
      '',
      '## 10. OPEN QUESTIONS',
      '- None open.',
      '<!-- /ANCHOR:questions -->',
      '',
    ].join('\n');
    const expected = [
      '# Probe',
      '',
      '## L2: NON-FUNCTIONAL REQUIREMENTS',
      'Performance notes.',
      '',
      '## L2: EDGE CASES',
      'Boundary notes.',
      '',
      '<!-- ANCHOR:questions -->',
      '## 10. OPEN QUESTIONS',
      '- None open.',
      '<!-- /ANCHOR:questions -->',
      '',
    ].join('\n');
    const { packet, file } = writeSpec(root, original);
    const before = manifest(root);

    const dryRun = runRepair(packet);

    expect(dryRun.status, dryRun.stdout + dryRun.stderr).toBe(0);
    expect(dryRun.stdout).toContain('moved questions opener');
    expect(manifest(root)).toBe(before);

    const applied = runRepair(packet, true);

    expect(applied.status, applied.stdout + applied.stderr).toBe(0);
    expect(fs.readFileSync(file, 'utf8')).toBe(expected);
  });

  it.each(['```', '~~~'])('does not pair an anchor across a %s fence', (fence) => {
    const text = [
      '<!-- ANCHOR:example -->',
      `${fence}md`,
      '<!-- /ANCHOR:example -->',
      `${fence}`,
      '',
    ].join('\n');

    const result = repairAnchors(text);

    expect(result.text).toBe(text);
    expect(result.changed).toBe(false);
    expect(result.refusals.join('\n')).toContain('unmatched opening anchor example');
  });

  it('reports a suffix collision without renaming the duplicate pair', () => {
    const root = makeRoot();
    const text = [
      '<!-- ANCHOR:section -->',
      'First section.',
      '<!-- /ANCHOR:section -->',
      '<!-- ANCHOR:section-2 -->',
      'Existing numbered section.',
      '<!-- /ANCHOR:section-2 -->',
      '<!-- ANCHOR:section -->',
      'Second section.',
      '<!-- /ANCHOR:section -->',
    ].join('\n');
    const { packet, file } = writeSpec(root, text);
    const before = manifest(root);

    const result = repairAnchors(text);
    const dryRun = runRepair(packet);

    expect(result.text).toBe(text);
    expect(result.changed).toBe(false);
    expect(result.refusals.join('\n')).toContain('collision: section');
    expect(result.refusals.join('\n')).toContain('section-2');
    expect(dryRun.status, dryRun.stdout + dryRun.stderr).toBe(0);
    expect(dryRun.stdout).toContain('collision: section');
    expect(manifest(root)).toBe(before);
    expect(fs.readFileSync(file, 'utf8')).toBe(text);

    const applied = runRepair(packet, true);

    expect(applied.status, applied.stdout + applied.stderr).toBe(0);
    expect(applied.stdout).toContain('collision: section');
    expect(fs.readFileSync(file, 'utf8')).toBe(text);
  });

  it('leaves overlapping duplicate pairs unchanged when they are not glued', () => {
    const text = [
      '<!-- ANCHOR:section -->',
      'Outer section start.',
      '<!-- ANCHOR:section -->',
      'Nested section.',
      '<!-- /ANCHOR:section -->',
      'Outer section end.',
      '<!-- /ANCHOR:section -->',
    ].join('\n');

    const result = repairAnchors(text);

    expect(result.text).toBe(text);
    expect(result.changed).toBe(false);
    expect(result.refusals.join('\n')).toContain('is ambiguous; left unchanged');
  });

  it('moves only marker lines when un-nesting questions', () => {
    const original = [
      '# Probe',
      '',
      '<!-- ANCHOR:questions -->',
      '## L2: NON-FUNCTIONAL REQUIREMENTS',
      'Performance notes.',
      '',
      '## 10. OPEN QUESTIONS',
      '- None open.',
      '<!-- /ANCHOR:questions -->',
      '',
    ].join('\r\n') + '\r\n';

    const result = unnestQuestionsAnchors(original);

    expect(result.changed).toBe(true);
    expect(result.text).toContain('<!-- ANCHOR:questions -->\r\n## 10. OPEN QUESTIONS');
    expect(withoutAnchorLines(result.text)).toBe(withoutAnchorLines(original));
  });

  it('treats a flat questions anchor with a deeper Open Questions subheading as needing nothing', () => {
    const text = [
      '# Probe',
      '',
      '<!-- ANCHOR:questions -->',
      '## 7. OPEN QUESTIONS',
      '',
      '### Answered Questions',
      '',
      '- The tool is gone.',
      '',
      '### Open Questions',
      '',
      'None.',
      '<!-- /ANCHOR:questions -->',
      '',
    ].join('\n');

    const unnest = unnestQuestionsAnchors(text);

    expect(unnest.changed).toBe(false);
    expect(unnest.text).toBe(text);
    expect(unnest.refusals).toEqual([]);

    const document = repairAnchors(text);

    expect(document.changed).toBe(false);
    expect(document.text).toBe(text);
    expect(document.refusals).toEqual([]);
  });

  it('refuses the un-nesting when the OPEN QUESTIONS heading is already wrapped', () => {
    const shapes = [
      {
        wrapper: 'open-questions',
        document: [
          '# Probe',
          '',
          '<!-- ANCHOR:questions -->',
          '',
          '<!-- ANCHOR:open-questions -->',
          '## 10. OPEN QUESTIONS',
          '',
          '- None open.',
          '<!-- /ANCHOR:open-questions -->',
          '<!-- /ANCHOR:questions -->',
          '',
        ].join('\n'),
      },
      {
        wrapper: 'questions-2',
        document: [
          '# Probe',
          '',
          '<!-- ANCHOR:questions -->',
          '',
          '<!-- ANCHOR:questions-2 -->',
          '## 10. OPEN QUESTIONS',
          '',
          '- None open.',
          '<!-- /ANCHOR:questions-2 -->',
          '<!-- /ANCHOR:questions -->',
          '',
        ].join('\n'),
      },
    ];

    for (const shape of shapes) {
      const root = makeRoot();
      const { packet, file } = writeSpec(root, shape.document);
      const before = manifest(root);

      const unnest = unnestQuestionsAnchors(shape.document);
      expect(unnest.changed, shape.wrapper).toBe(false);
      expect(unnest.text, shape.wrapper).toBe(shape.document);
      expect(unnest.refusals.join('\n'), shape.wrapper).toContain('overlap');
      expect(unnest.refusals.join('\n'), shape.wrapper).toContain(shape.wrapper);

      const result = repairAnchors(shape.document);
      expect(result.changed, shape.wrapper).toBe(false);
      expect(result.text, shape.wrapper).toBe(shape.document);
      expect(result.refusals.join('\n'), shape.wrapper).toContain(shape.wrapper);

      const dryRun = runRepair(packet);
      expect(dryRun.status, dryRun.stdout + dryRun.stderr).toBe(0);
      expect(dryRun.stdout, shape.wrapper).toContain('left unchanged');
      expect(dryRun.stdout, shape.wrapper).toContain(shape.wrapper);
      expect(manifest(root), shape.wrapper).toBe(before);
      expect(fs.readFileSync(file, 'utf8'), shape.wrapper).toBe(shape.document);

      const applied = runRepair(packet, true);
      expect(applied.status, applied.stdout + applied.stderr).toBe(0);
      expect(applied.stdout, shape.wrapper).toContain('left unchanged');
      expect(fs.readFileSync(file, 'utf8'), shape.wrapper).toBe(shape.document);
      expect(manifest(root), shape.wrapper).toBe(before);
    }
  });

  it('preserves file mode and leaves the original intact when rename fails', () => {
    const root = makeRoot();
    const original = [
      '<!-- ANCHOR:section -->',
      'First section.',
      '<!-- /ANCHOR:section -->',
      '<!-- ANCHOR:section -->',
      'Second section.',
      '<!-- /ANCHOR:section -->',
      '',
    ].join('\n');
    const { file, packet } = writeSpec(root, original);
    fs.chmodSync(file, 0o640);
    const successfulRename = vi.spyOn(fs, 'renameSync');

    const applied = repairAnchorFile(file, { apply: true });

    expect(applied.applied).toBe(true);
    expect(successfulRename).toHaveBeenCalledTimes(1);
    const [temporary, destination] = successfulRename.mock.calls[0];
    expect(path.dirname(String(temporary))).toBe(packet);
    expect(String(destination)).toBe(file);
    expect(fs.statSync(file).mode & 0o777).toBe(0o640);
    expect(fs.readdirSync(packet)).toEqual(['spec.md']);
    successfulRename.mockRestore();

    const beforeFailure = fs.readFileSync(file, 'utf8');
    const failedRename = vi.spyOn(fs, 'renameSync').mockImplementation(() => {
      throw new Error('simulated rename failure');
    });
    const duplicated = [
      '<!-- ANCHOR:other -->',
      'First section.',
      '<!-- /ANCHOR:other -->',
      '<!-- ANCHOR:other -->',
      'Second section.',
      '<!-- /ANCHOR:other -->',
      '',
    ].join('\n');
    fs.writeFileSync(file, duplicated);

    expect(() => repairAnchorFile(file, { apply: true })).toThrow('simulated rename failure');
    expect(failedRename).toHaveBeenCalledTimes(1);
    expect(fs.readFileSync(file, 'utf8')).toBe(duplicated);
    expect(fs.readdirSync(packet)).toEqual(['spec.md']);
    expect(beforeFailure).not.toBe(duplicated);
  });

  it.each(adversarialCases)('adversarial: $name', (adversarial) => {
    const result = adversarial.run(adversarial.document);

    expect(result.changed, adversarial.name).toBe(adversarial.changed);
    expect(result.text, adversarial.name).toBe(adversarial.expected ?? adversarial.document);
    if (adversarial.action !== undefined) {
      expect(result.actions.join('\n'), adversarial.name).toContain(adversarial.action);
      expect(result.refusals, adversarial.name).toEqual([]);
    }
    if (adversarial.refusal !== undefined) {
      expect(result.refusals.join('\n'), adversarial.name).toContain(adversarial.refusal);
      expect(result.actions, adversarial.name).toEqual([]);
    }
    if (adversarial.silent === true) {
      expect(result.actions, adversarial.name).toEqual([]);
      expect(result.refusals, adversarial.name).toEqual([]);
    }
    if (adversarial.byteIdentical !== true) return;

    const root = makeRoot();
    const { packet, file } = writeSpec(root, adversarial.document);
    const before = manifest(root);
    const findings = result.actions.length + result.refusals.length;

    const fileResult = repairAnchorFile(file, { apply: true });

    expect(fileResult.applied, adversarial.name).toBe(false);
    expect(fs.readFileSync(file).equals(Buffer.from(adversarial.document)), adversarial.name).toBe(true);

    const dryRun = runRepair(packet);

    expect(dryRun.status, dryRun.stdout + dryRun.stderr).toBe(0);
    expect(dryRun.stdout, adversarial.name).not.toContain('would repair');
    expect(dryRun.stdout, adversarial.name).toContain(
      `anchor repair: documents=1 repairable=0 findings=${findings}`,
    );
    if (adversarial.refusal !== undefined) {
      expect(dryRun.stdout, adversarial.name).toContain(`left unchanged ${file}: ${adversarial.refusal}`);
    } else {
      expect(dryRun.stdout, adversarial.name).not.toContain('left unchanged');
    }

    const applied = runRepair(packet, true);

    expect(applied.status, applied.stdout + applied.stderr).toBe(0);
    expect(applied.stdout, adversarial.name).toContain(
      `anchor repair: documents=1 repaired=0 findings=${findings}`,
    );
    expect(fs.readFileSync(file).equals(Buffer.from(adversarial.document)), adversarial.name).toBe(true);
    expect(fs.readdirSync(packet), adversarial.name).toEqual(['spec.md']);
    expect(manifest(root), adversarial.name).toBe(before);
  });
});
