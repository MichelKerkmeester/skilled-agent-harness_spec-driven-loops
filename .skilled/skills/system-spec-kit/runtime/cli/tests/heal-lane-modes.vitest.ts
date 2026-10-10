// ───────────────────────────────────────────────────────────────────
// MODULE: Heal Lane Modes
// ───────────────────────────────────────────────────────────────────

import crypto from 'node:crypto';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import yaml from 'js-yaml';
import { afterEach, describe, expect, it } from 'vitest';

import { renderInlineGates } from '../templates/inline-gate-renderer';
import { loadTemplateContractForDocument } from '../utils/template-structure.js';

const require = createRequire(path.join(__dirname, 'heal-lane-modes.vitest.ts'));
const { LANE_MODES, anchorWrap, continuityPlaceholders, headerAdd, runLaneModes } = require('../spec/heal-spec-docs.cjs') as {
  LANE_MODES: Array<{ name: string }>;
  anchorWrap: (text: string, file: string) => LaneResult;
  continuityPlaceholders: (text: string, file: string) => LaneResult;
  headerAdd: (text: string, file: string) => LaneResult;
  runLaneModes: (
    packet: string,
    options?: { apply?: boolean; modes?: string[]; repoRoot?: string },
  ) => LaneRunResult;
};

type LaneResult = {
  text: string;
  changed: boolean;
  actions: string[];
  refusals: string[];
};

type LaneRunResult = {
  packet: string;
  changedFiles: string[];
  actions: Array<{ mode: string; document: string; action: string }>;
  refusals: Array<{ mode: string; document: string; reason: string }>;
};

const CLI_DIR = path.resolve(__dirname, '..');
const HEAL_SPEC_DOCS = path.join(CLI_DIR, 'spec', 'heal-spec-docs.cjs');
const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

function makeRoot(): string {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'heal-lane-modes-')));
  roots.push(root);
  return root;
}

// Relative path plus content digest for every file under the root, sorted, so
// any write — created, changed or deleted — shows up as a different digest.
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

function withoutAnchorLines(text: string): string {
  return text.replace(/^[ \t]*<!--\s*\/?ANCHOR:[a-z0-9-]+\s*-->[ \t]*(?:\r?\n|$)/gm, '');
}

// The two healed continuity lines are the only difference; stripping the field
// lines out proves no other line changed, independent of the exact fixture.
function withoutContinuityFields(text: string): string {
  return text.split('\n').filter((line) => !/^\s*(recent_action|next_safe_action):/.test(line)).join('\n');
}

// The level lives in spec.md because that is where every document reads it,
// so testing plan.md alone still needs the packet's own declaration on disk.
// The template-source header keeps header-add silent here, leaving plan.md the
// only document a header test has to account for.
function writePacket(root: string, plan: string): { packet: string; planFile: string } {
  const packet = path.join(root, 'specs', 'lane-modes', '001-probe');
  fs.mkdirSync(packet, { recursive: true });
  fs.writeFileSync(
    path.join(packet, 'spec.md'),
    '# Lane probe\n\n<!-- SPECKIT_LEVEL: 2 -->\n\n<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->\n',
  );
  const planFile = path.join(packet, 'plan.md');
  fs.writeFileSync(planFile, plan);
  return { packet, planFile };
}

function runLaneCli(packet: string) {
  return spawnSync(
    process.execPath,
    [HEAL_SPEC_DOCS, '--lane-modes', '--folder', packet],
    { encoding: 'utf8' },
  );
}

function writeLinkPacket(root: string, document: string): { packet: string; file: string } {
  const packet = path.join(root, 'specs', 't', '001-a');
  fs.mkdirSync(packet, { recursive: true });
  const file = path.join(packet, 'spec.md');
  fs.writeFileSync(file, document);
  return { packet, file };
}

// The full lane runs header-add over every packet document, and it leaves a
// document that already names its template alone, so the link fixtures carry
// the stamp and their refusals stay the ones under test.
const LINK_SPEC_STAMP = '<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->';

// The level probe writes spec.md per test, because the marker's value and its
// presence are the variables under test.
function writeLevelPacket(root: string, spec: string, plan: string): { packet: string; planFile: string } {
  const packet = path.join(root, 'specs', 'lane-modes', '002-level');
  fs.mkdirSync(packet, { recursive: true });
  fs.writeFileSync(path.join(packet, 'spec.md'), spec);
  const planFile = path.join(packet, 'plan.md');
  fs.writeFileSync(planFile, plan);
  return { packet, planFile };
}

function writeFileAt(root: string, relative: string, content: string): string {
  const file = path.join(root, ...relative.split('/'));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  return file;
}

// The anchor set and the marker come from the contract the healer itself
// reads, so the fixtures cannot drift from the template by restating either.
function levelTwoPlanContract() {
  const contract = loadTemplateContractForDocument('2', 'plan.md', 'plan.md');
  if (!contract.supported) throw new Error('Level 2 plan.md contract did not resolve');
  return contract;
}

function levelTwoPlanAnchors(): string[] {
  const contract = levelTwoPlanContract();
  return [...contract.requiredAnchors, ...(contract.optionalAnchors || [])];
}

function levelTwoPlanMarker(): string {
  const rendered = renderInlineGates(fs.readFileSync(levelTwoPlanContract().templatePath, 'utf8'), '2');
  const marker = rendered.match(/<!--\s*SPECKIT_TEMPLATE_SOURCE:\s*([^>]*?)\s*-->/);
  if (!marker) throw new Error('Level 2 plan.md render declares no template-source marker');
  return marker[1].trim();
}

// Frontmatter plus every rendered anchor and no template-source header, so the
// stamp has to be derived from the anchors alone.
function headerPlanFixture(): string {
  return [
    '---',
    'title: "Header probe plan"',
    '---',
    '',
    ...levelTwoPlanAnchors().map((anchor) => `<!-- ANCHOR:${anchor} -->`),
    '',
  ].join('\n');
}

// Every rendered anchor as a matched pair except architecture, whose section
// stands unwrapped: the wrap and the stamp can only meet in one run if the lane
// order is right.
function sequencePlanFixture(): string {
  const present = levelTwoPlanAnchors().filter((anchor) => anchor !== 'architecture');
  return [
    '---',
    'title: "Sequence probe plan"',
    '---',
    '',
    ...present.flatMap((anchor) => [
      `<!-- ANCHOR:${anchor} -->`,
      `Placeholder body for ${anchor}.`,
      `<!-- /ANCHOR:${anchor} -->`,
      '',
    ]),
    '---',
    '',
    '## 3. ARCHITECTURE',
    '',
    'Architecture body.',
    '',
    '---',
    '',
  ].join('\n');
}

// The summary anchor appears only inside a fenced example, so the anchors the
// document really states fall short of the rendered set by one.
function fencedOnlyAnchorPlanFixture(): string {
  const present = levelTwoPlanAnchors().filter((anchor) => anchor !== 'summary');
  return [
    '---',
    'title: "Fenced anchor probe plan"',
    '---',
    '',
    ...present.map((anchor) => `<!-- ANCHOR:${anchor} -->`),
    '```markdown',
    '<!-- ANCHOR:summary -->',
    '```',
    '',
  ].join('\n');
}

// The rendered set exactly, plus one anchor name that appears only as a fenced
// example: nothing proves a defect, so the stamp has to go through.
function fencedExtraAnchorPlanFixture(): string {
  return [
    headerPlanFixture(),
    '```markdown',
    '<!-- ANCHOR:invented-extra -->',
    '```',
    '',
  ].join('\n');
}

// The summary anchor appears only as a double-backtick span, which is prose about
// the format, so the document states one anchor fewer than the render carries.
function doubleBacktickAnchorPlanFixture(): string {
  const present = levelTwoPlanAnchors().filter((anchor) => anchor !== 'summary');
  return [
    '---',
    'title: "Double backtick anchor probe plan"',
    '---',
    '',
    ...present.map((anchor) => `<!-- ANCHOR:${anchor} -->`),
    'Prose names ``<!-- ANCHOR:summary -->`` as an example.',
    '',
  ].join('\n');
}

// The summary anchor appears only inside an indented fence in a list item, which
// is an example, so the document states one anchor fewer than the render carries.
function listIndentedAnchorPlanFixture(): string {
  const present = levelTwoPlanAnchors().filter((anchor) => anchor !== 'summary');
  return [
    '---',
    'title: "List indented anchor probe plan"',
    '---',
    '',
    ...present.map((anchor) => `<!-- ANCHOR:${anchor} -->`),
    '- Example item:',
    '',
    '    ```markdown',
    '    <!-- ANCHOR:summary -->',
    '    ```',
    '',
  ].join('\n');
}

// The closing line carries text after its dashes, so it is not a delimiter and
// the document has no frontmatter block to place a header after.
function trailingCloserPlanFixture(): string {
  return [
    '---',
    'title: "Trailing closer probe plan"',
    '---trailing',
    '',
    ...levelTwoPlanAnchors().map((anchor) => `<!-- ANCHOR:${anchor} -->`),
    '',
  ].join('\n');
}

// Every rendered anchor as a matched pair except summary, whose heading stands
// unwrapped. The summary marker appears only as an example inside an indented
// fence in a list item, which is prose about the format rather than a pair.
function listExampleAnchorPlanFixture(): string {
  const present = levelTwoPlanAnchors().filter((anchor) => anchor !== 'summary');
  return [
    '---',
    'title: "List example anchor probe plan"',
    '---',
    '',
    '- Example of the marker format:',
    '',
    '    ```md',
    '    <!-- ANCHOR:summary -->',
    '    ```',
    '',
    ...present.flatMap((anchor) => [
      `<!-- ANCHOR:${anchor} -->`,
      `Placeholder body for ${anchor}.`,
      `<!-- /ANCHOR:${anchor} -->`,
      '',
    ]),
    '## 1. SUMMARY',
    '',
    'Summary body.',
    '',
  ].join('\n');
}

const PLAN_ORIGINAL = [
  '---',
  'title: "Lane probe plan"',
  '---',
  '<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->',
  '',
  '<!-- ANCHOR:summary -->',
  '## 1. SUMMARY',
  '',
  'Summary body.',
  '<!-- /ANCHOR:summary -->',
  '',
  '---',
  '',
  '## 3. ARCHITECTURE',
  '',
  '### Pattern',
  'Clean Architecture.',
  '',
  '### Key Components',
  '- Component one.',
  '',
  '---',
  '',
  '## 9. AUTHORED NOTES',
  '',
  'Kept as authored.',
  '',
].join('\n');

const PLAN_WRAPPED = [
  '---',
  'title: "Lane probe plan"',
  '---',
  '<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->',
  '',
  '<!-- ANCHOR:summary -->',
  '## 1. SUMMARY',
  '',
  'Summary body.',
  '<!-- /ANCHOR:summary -->',
  '',
  '---',
  '',
  '<!-- ANCHOR:architecture -->',
  '## 3. ARCHITECTURE',
  '',
  '### Pattern',
  'Clean Architecture.',
  '',
  '### Key Components',
  '- Component one.',
  '<!-- /ANCHOR:architecture -->',
  '',
  '---',
  '',
  '## 9. AUTHORED NOTES',
  '',
  'Kept as authored.',
  '',
].join('\n');

// The architecture section ends in a fence, so the closer has to land after
// the closing fence; the heading lookalike inside it must not end the section.
const PLAN_TRAILING_FENCE_ORIGINAL = [
  '---',
  'title: "Lane probe plan"',
  '---',
  '<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->',
  '',
  '<!-- ANCHOR:summary -->',
  '## 1. SUMMARY',
  '',
  'Summary body.',
  '<!-- /ANCHOR:summary -->',
  '',
  '---',
  '',
  '## 3. ARCHITECTURE',
  '',
  '### Pattern',
  'Clean Architecture.',
  '',
  '```markdown',
  '## 9. FENCED LOOKALIKE',
  '```',
  '',
  '---',
  '',
  '## 9. AUTHORED NOTES',
  '',
  'Kept as authored.',
  '',
].join('\n');

const PLAN_TRAILING_FENCE_WRAPPED = [
  '---',
  'title: "Lane probe plan"',
  '---',
  '<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->',
  '',
  '<!-- ANCHOR:summary -->',
  '## 1. SUMMARY',
  '',
  'Summary body.',
  '<!-- /ANCHOR:summary -->',
  '',
  '---',
  '',
  '<!-- ANCHOR:architecture -->',
  '## 3. ARCHITECTURE',
  '',
  '### Pattern',
  'Clean Architecture.',
  '',
  '```markdown',
  '## 9. FENCED LOOKALIKE',
  '```',
  '<!-- /ANCHOR:architecture -->',
  '',
  '---',
  '',
  '## 9. AUTHORED NOTES',
  '',
  'Kept as authored.',
  '',
].join('\n');

// The architecture section is the last thing in the file and the file carries
// no final newline, so the closer has to open a line of its own: the ending the
// prose lacks goes between them, and the missing final newline stays missing.
const PLAN_NO_FINAL_NEWLINE = [
  '---',
  'title: "Lane probe plan"',
  '---',
  '<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->',
  '',
  '<!-- ANCHOR:summary -->',
  '## 1. SUMMARY',
  '',
  'Summary body.',
  '<!-- /ANCHOR:summary -->',
  '',
  '---',
  '',
  '## 3. ARCHITECTURE',
  '',
  'Architecture text.',
].join('\n');

const PLAN_NO_FINAL_NEWLINE_WRAPPED = [
  '---',
  'title: "Lane probe plan"',
  '---',
  '<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->',
  '',
  '<!-- ANCHOR:summary -->',
  '## 1. SUMMARY',
  '',
  'Summary body.',
  '<!-- /ANCHOR:summary -->',
  '',
  '---',
  '',
  '<!-- ANCHOR:architecture -->',
  '## 3. ARCHITECTURE',
  '',
  'Architecture text.',
  '<!-- /ANCHOR:architecture -->',
].join('\n');

const PLAN_NO_ANCHORS = [
  '# Lane probe plan',
  '',
  '## 3. ARCHITECTURE',
  '',
  'Authored body.',
  '',
  '## 4. IMPLEMENTATION PHASES',
  '',
  'Phase notes.',
  '',
].join('\n');

const SUMMARY_ORIGINAL = [
  '---',
  'title: "Lane probe summary"',
  '_memory:',
  '  continuity:',
  '    recent_action: "Initialized Level 2 template"',
  '    next_safe_action: "Replace continuity placeholders"',
  '---',
  '<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->',
  '# Lane probe summary',
  '',
  'Authored body stays exactly as written.',
  '',
].join('\n');

// Only the two continuity values differ; building the expected text by
// replacement keeps fixture and expectation from drifting apart.
const SUMMARY_HEALED = SUMMARY_ORIGINAL
  .replace('recent_action: "Initialized Level 2 template"', 'recent_action: "No continuity update was recorded"')
  .replace('next_safe_action: "Replace continuity placeholders"', 'next_safe_action: "None recorded"');

// A document whose frontmatter carries a title but no level, so the only
// source for one is the packet's spec.md.
const LEVEL_PLAN_ORIGINAL = [
  '---',
  'title: "Level probe plan"',
  '---',
  '# Level probe plan',
  '',
  'Authored body stays exactly as written.',
  '',
].join('\n');

const LEVEL_PLAN_HEALED = LEVEL_PLAN_ORIGINAL.replace(
  'title: "Level probe plan"\n---',
  'title: "Level probe plan"\nlevel: 2\n---',
);

describe('heal-spec-docs lane modes', () => {
  it('anchor-wrap-positive', () => {
    const root = makeRoot();
    const { packet, planFile } = writePacket(root, PLAN_ORIGINAL);

    const predicted = anchorWrap(PLAN_ORIGINAL, planFile);
    expect(predicted.changed).toBe(true);

    const result = runLaneModes(packet, { apply: true, modes: ['anchor-wrap'] });

    expect(result.actions).toEqual([
      { mode: 'anchor-wrap', document: 'plan.md', action: 'wrapped "3. ARCHITECTURE" with anchor architecture' },
    ]);
    expect(result.refusals).toEqual([]);
    expect(result.changedFiles).toEqual(['plan.md']);

    const after = fs.readFileSync(planFile, 'utf8');
    expect(after).toBe(PLAN_WRAPPED);
    expect(after).toBe(predicted.text);
    // The typed section gains markers while every original line keeps its text
    // and its place, which the strip-and-compare proves independently of the
    // exact fixture text above.
    expect(withoutAnchorLines(after)).toBe(withoutAnchorLines(PLAN_ORIGINAL));
  });

  it('anchor-wrap-refuses-no-anchors', () => {
    const root = makeRoot();
    const { packet, planFile } = writePacket(root, PLAN_NO_ANCHORS);
    const before = manifest(root);

    const result = runLaneModes(packet, { modes: ['anchor-wrap'] });

    expect(result.actions).toEqual([]);
    expect(result.refusals).toHaveLength(1);
    expect(result.refusals[0]).toMatchObject({ mode: 'anchor-wrap', document: 'plan.md' });
    expect(result.refusals.map((entry) => entry.reason).join('\n')).toContain('not proven');
    expect(manifest(root)).toBe(before);
    expect(fs.readFileSync(planFile, 'utf8')).toBe(PLAN_NO_ANCHORS);
  });

  it('anchor-wrap-wraps-a-real-heading-past-an-example-marker-in-a-fence', () => {
    const root = makeRoot();
    const original = listExampleAnchorPlanFixture();
    const { packet, planFile } = writePacket(root, original);

    const result = runLaneModes(packet, { apply: true, modes: ['anchor-wrap'] });

    expect(result.refusals).toEqual([]);
    expect(result.actions).toEqual([
      { mode: 'anchor-wrap', document: 'plan.md', action: 'wrapped "1. SUMMARY" with anchor summary' },
    ]);
    expect(result.changedFiles).toEqual(['plan.md']);

    const after = fs.readFileSync(planFile, 'utf8');
    // The example stays exactly as written, so the fenced marker is still prose.
    expect(after).toContain('- Example of the marker format:\n\n    ```md\n    <!-- ANCHOR:summary -->\n    ```\n');
    expect(after).toContain('<!-- ANCHOR:summary -->\n## 1. SUMMARY\n');
    // Only anchor marker lines changed, which stripping them from both sides proves.
    expect(withoutAnchorLines(after)).toBe(withoutAnchorLines(original));
  });

  it('anchor-wrap-idempotence', () => {
    const root = makeRoot();
    const { packet } = writePacket(root, PLAN_ORIGINAL);

    const first = runLaneModes(packet, { apply: true });
    expect(first.actions.length).toBeGreaterThan(0);
    const afterFirst = manifest(root);

    const second = runLaneModes(packet, { apply: true });

    expect(second.actions).toEqual([]);
    expect(second.refusals).toEqual([]);
    expect(second.changedFiles).toEqual([]);
    expect(manifest(root)).toBe(afterFirst);
  });

  it('anchor-wrap-ends-after-trailing-fence', () => {
    const root = makeRoot();
    const { packet, planFile } = writePacket(root, PLAN_TRAILING_FENCE_ORIGINAL);

    const predicted = anchorWrap(PLAN_TRAILING_FENCE_ORIGINAL, planFile);
    expect(predicted.changed).toBe(true);

    const result = runLaneModes(packet, { apply: true, modes: ['anchor-wrap'] });

    expect(result.actions).toEqual([
      { mode: 'anchor-wrap', document: 'plan.md', action: 'wrapped "3. ARCHITECTURE" with anchor architecture' },
    ]);
    expect(result.refusals).toEqual([]);
    expect(result.changedFiles).toEqual(['plan.md']);

    const after = fs.readFileSync(planFile, 'utf8');
    expect(after).toBe(PLAN_TRAILING_FENCE_WRAPPED);
    expect(after).toBe(predicted.text);
    // The closer lands after the closing fence, and stripping the markers
    // proves every original line, the fenced heading lookalike included,
    // keeps its text and its place.
    expect(withoutAnchorLines(after)).toBe(withoutAnchorLines(PLAN_TRAILING_FENCE_ORIGINAL));
  });

  it('anchor-wrap-ends-without-final-newline', () => {
    const root = makeRoot();
    const { packet, planFile } = writePacket(root, PLAN_NO_FINAL_NEWLINE);

    const predicted = anchorWrap(PLAN_NO_FINAL_NEWLINE, planFile);
    expect(predicted.changed).toBe(true);

    const result = runLaneModes(packet, { apply: true, modes: ['anchor-wrap'] });

    expect(result.actions).toEqual([
      { mode: 'anchor-wrap', document: 'plan.md', action: 'wrapped "3. ARCHITECTURE" with anchor architecture' },
    ]);
    expect(result.refusals).toEqual([]);
    expect(result.changedFiles).toEqual(['plan.md']);

    const after = fs.readFileSync(planFile, 'utf8');
    expect(after).toBe(PLAN_NO_FINAL_NEWLINE_WRAPPED);
    expect(after).toBe(predicted.text);
    // The closer is a line of its own, the prose keeps its bytes, and the file
    // keeps the missing final newline it came with.
    expect(after).toContain('Architecture text.\n<!-- /ANCHOR:architecture -->');
    expect(after.endsWith('\n')).toBe(false);
    // Removing the two inserted marker lines and the ending that terminates
    // the prose restores the fixture byte for byte, so no prose line was
    // edited to make room for the closer.
    expect(after
      .replace('\n<!-- ANCHOR:architecture -->', '')
      .replace('\n<!-- /ANCHOR:architecture -->', '')).toBe(PLAN_NO_FINAL_NEWLINE);

    const afterFirst = manifest(root);
    const second = runLaneModes(packet, { apply: true, modes: ['anchor-wrap'] });

    expect(second.changedFiles).toEqual([]);
    expect(manifest(root)).toBe(afterFirst);
  });

  it('lane-modes-cli-dry-run', () => {
    const root = makeRoot();
    const { packet } = writePacket(root, PLAN_ORIGINAL);
    const before = manifest(root);

    const dryRun = runLaneCli(packet);

    expect(dryRun.status, dryRun.stdout + dryRun.stderr).toBe(0);
    expect(dryRun.stdout).toContain('would apply anchor-wrap');
    expect(manifest(root)).toBe(before);
  });

  it('link-repoint-positive', () => {
    const root = makeRoot();
    const document = [
      '# 001-a',
      '',
      LINK_SPEC_STAMP,
      '',
      'See [the moved spec](../002-moved/spec.md#scope) before editing.',
      '',
      'Authored prose stays exactly as written.',
      '',
    ].join('\n');
    const { packet, file } = writeLinkPacket(root, document);
    writeFileAt(root, 'specs/t/z_archive/002-moved/spec.md', '# Moved spec\n');

    const result = runLaneModes(packet, { apply: true, repoRoot: root });

    expect(result.actions).toEqual([
      {
        mode: 'link-repoint',
        document: 'spec.md',
        action: 'repointed ../002-moved/spec.md to ../z_archive/002-moved/spec.md',
      },
    ]);
    expect(result.refusals).toEqual([]);
    expect(result.changedFiles).toEqual(['spec.md']);

    const after = fs.readFileSync(file, 'utf8');
    // Only the target inside the link changes, so the replace-based expected
    // text proves every other line keeps its bytes.
    expect(after).toBe(document.replace(
      '../002-moved/spec.md#scope',
      '../z_archive/002-moved/spec.md#scope',
    ));
    // The rewritten target resolves from the document's own directory.
    expect(fs.existsSync(path.resolve(path.dirname(file), '../z_archive/002-moved/spec.md'))).toBe(true);
  });

  it('link-repoint-refuses-multiple-matches', () => {
    const root = makeRoot();
    const document = ['# 001-a', '', LINK_SPEC_STAMP, '', 'See [the moved spec](../002-moved/spec.md).', ''].join('\n');
    const { packet, file } = writeLinkPacket(root, document);
    writeFileAt(root, 'specs/t/a/002-moved/spec.md', '# Copy A\n');
    writeFileAt(root, 'specs/t/b/002-moved/spec.md', '# Copy B\n');
    const before = manifest(root);

    const result = runLaneModes(packet, { apply: true, repoRoot: root });

    expect(result.actions).toEqual([]);
    expect(result.refusals).toHaveLength(1);
    expect(result.refusals[0]).toMatchObject({ mode: 'link-repoint', document: 'spec.md' });
    expect(result.refusals[0].reason).toContain('2 files end with 002-moved/spec.md');
    expect(manifest(root)).toBe(before);
    expect(fs.readFileSync(file, 'utf8')).toBe(document);
  });

  it('link-repoint-refuses-no-target', () => {
    const root = makeRoot();
    const document = ['# 001-a', '', LINK_SPEC_STAMP, '', 'See [the missing spec](./does-not-exist.md).', ''].join('\n');
    const { packet, file } = writeLinkPacket(root, document);

    const result = runLaneModes(packet, { apply: true, repoRoot: root });

    expect(result.actions).toEqual([]);
    expect(result.refusals).toHaveLength(1);
    expect(result.refusals[0]).toMatchObject({ mode: 'link-repoint', document: 'spec.md' });
    expect(result.refusals[0].reason).toContain('no file ends with does-not-exist.md');
    expect(fs.readFileSync(file, 'utf8')).toBe(document);
  });

  it('link-repoint-idempotence', () => {
    const root = makeRoot();
    const document = [
      '# 001-a',
      '',
      LINK_SPEC_STAMP,
      '',
      'See [the moved spec](../002-moved/spec.md#scope).',
      '',
    ].join('\n');
    const { packet } = writeLinkPacket(root, document);
    writeFileAt(root, 'specs/t/z_archive/002-moved/spec.md', '# Moved spec\n');

    const first = runLaneModes(packet, { apply: true, repoRoot: root });
    expect(first.actions.length).toBeGreaterThan(0);
    const afterFirst = manifest(root);

    const second = runLaneModes(packet, { apply: true, repoRoot: root });

    expect(second.actions).toEqual([]);
    expect(second.refusals).toEqual([]);
    expect(second.changedFiles).toEqual([]);
    expect(manifest(root)).toBe(afterFirst);
  });

  it('link-repoint-ignores-fenced-links', () => {
    const root = makeRoot();
    const document = [
      '# 001-a',
      '',
      LINK_SPEC_STAMP,
      '',
      '```md',
      'See [the moved spec](../002-moved/spec.md#scope).',
      '```',
      '',
      'Outside the fence nothing changes.',
      '',
    ].join('\n');
    const { packet, file } = writeLinkPacket(root, document);
    const before = manifest(root);

    const result = runLaneModes(packet, { apply: true, repoRoot: root });

    expect(result.actions).toEqual([]);
    expect(result.refusals).toEqual([]);
    expect(result.changedFiles).toEqual([]);
    expect(manifest(root)).toBe(before);
    expect(fs.readFileSync(file, 'utf8')).toBe(document);
  });

  it('link-repoint-skips-links-in-a-longer-outer-fence', () => {
    const root = makeRoot();
    const document = [
      '# 001-a',
      '',
      LINK_SPEC_STAMP,
      '',
      '````md',
      '```',
      'See [the moved spec](../002-moved/spec.md).',
      '```',
      '````',
      '',
    ].join('\n');
    const { packet, file } = writeLinkPacket(root, document);
    writeFileAt(root, 'specs/t/z_archive/002-moved/spec.md', '# Moved spec\n');

    const result = runLaneModes(packet, { apply: true, modes: ['link-repoint'], repoRoot: root });

    expect(result.actions).toEqual([]);
    expect(result.changedFiles).toEqual([]);
    expect(fs.readFileSync(file, 'utf8')).toBe(document);
  });

  it('link-repoint-skips-links-after-a-tilde-line-inside-a-backtick-fence', () => {
    const root = makeRoot();
    const document = [
      '# 001-a',
      '',
      LINK_SPEC_STAMP,
      '',
      '```md',
      '~~~',
      'See [the moved spec](../002-moved/spec.md).',
      '~~~',
      '```',
      '',
    ].join('\n');
    const { packet, file } = writeLinkPacket(root, document);
    writeFileAt(root, 'specs/t/z_archive/002-moved/spec.md', '# Moved spec\n');

    const result = runLaneModes(packet, { apply: true, modes: ['link-repoint'], repoRoot: root });

    expect(result.actions).toEqual([]);
    expect(result.changedFiles).toEqual([]);
    expect(fs.readFileSync(file, 'utf8')).toBe(document);
  });

  it('link-repoint-repoints-outside-a-normal-fence-only', () => {
    const root = makeRoot();
    const document = [
      '# 001-a',
      '',
      LINK_SPEC_STAMP,
      '',
      '```md',
      'See [the moved spec](../002-moved/spec.md).',
      '```',
      '',
      'Outside the fence [the moved spec](../002-moved/spec.md) is repointed.',
      '',
    ].join('\n');
    const { packet, file } = writeLinkPacket(root, document);
    writeFileAt(root, 'specs/t/z_archive/002-moved/spec.md', '# Moved spec\n');

    const result = runLaneModes(packet, { apply: true, modes: ['link-repoint'], repoRoot: root });

    expect(result.actions).toEqual([
      {
        mode: 'link-repoint',
        document: 'spec.md',
        action: 'repointed ../002-moved/spec.md to ../z_archive/002-moved/spec.md',
      },
    ]);
    expect(fs.readFileSync(file, 'utf8')).toBe(document.replace(
      'Outside the fence [the moved spec](../002-moved/spec.md)',
      'Outside the fence [the moved spec](../z_archive/002-moved/spec.md)',
    ));
  });

  it('link-repoint-skips-links-inside-inline-code-spans', () => {
    const root = makeRoot();
    const document = [
      '# 001-a',
      '',
      LINK_SPEC_STAMP,
      '',
      'Single `[the moved spec](../002-moved/spec.md)` stays literal.',
      'Double ``See [the moved spec](../002-moved/spec.md) and `x` here`` stays literal.',
      'A stray ` before [the moved spec](../002-moved/spec.md) is repointed.',
      '',
    ].join('\n');
    const { packet, file } = writeLinkPacket(root, document);
    writeFileAt(root, 'specs/t/z_archive/002-moved/spec.md', '# Moved spec\n');

    const result = runLaneModes(packet, { apply: true, modes: ['link-repoint'], repoRoot: root });

    expect(result.actions).toEqual([
      {
        mode: 'link-repoint',
        document: 'spec.md',
        action: 'repointed ../002-moved/spec.md to ../z_archive/002-moved/spec.md',
      },
    ]);
    expect(fs.readFileSync(file, 'utf8')).toBe(document.replace(
      'A stray ` before [the moved spec](../002-moved/spec.md)',
      'A stray ` before [the moved spec](../z_archive/002-moved/spec.md)',
    ));
  });

  it('link-repoint-skips-links-in-a-list-indented-fence', () => {
    const root = makeRoot();
    const document = [
      '# 001-a',
      '',
      LINK_SPEC_STAMP,
      '',
      '- Example item:',
      '',
      '    ```md',
      '    See [the moved spec](../002-moved/spec.md).',
      '    ```',
      '',
      'Outside the list [the moved spec](../002-moved/spec.md) is repointed.',
      '',
    ].join('\n');
    const { packet, file } = writeLinkPacket(root, document);
    writeFileAt(root, 'specs/t/z_archive/002-moved/spec.md', '# Moved spec\n');

    const result = runLaneModes(packet, { apply: true, modes: ['link-repoint'], repoRoot: root });

    expect(result.actions).toEqual([
      {
        mode: 'link-repoint',
        document: 'spec.md',
        action: 'repointed ../002-moved/spec.md to ../z_archive/002-moved/spec.md',
      },
    ]);
    expect(fs.readFileSync(file, 'utf8')).toBe(document.replace(
      'Outside the list [the moved spec](../002-moved/spec.md)',
      'Outside the list [the moved spec](../z_archive/002-moved/spec.md)',
    ));
  });

  it('link-repoint-preserves-angle-brackets-and-fragments', () => {
    const root = makeRoot();
    const document = [
      '# 001-a',
      '',
      LINK_SPEC_STAMP,
      '',
      'See [the moved spec](<../002-moved/spec.md#scope>).',
      '',
    ].join('\n');
    const { packet, file } = writeLinkPacket(root, document);
    writeFileAt(root, 'specs/t/z_archive/002-moved/spec.md', '# Moved spec\n');

    const result = runLaneModes(packet, { apply: true, repoRoot: root });

    expect(result.refusals).toEqual([]);
    expect(result.changedFiles).toEqual(['spec.md']);
    expect(fs.readFileSync(file, 'utf8')).toBe(document.replace(
      '(<../002-moved/spec.md#scope>)',
      '(<../z_archive/002-moved/spec.md#scope>)',
    ));
  });

  it('link-repoint-refuses-reference-definitions', () => {
    const root = makeRoot();
    const document = ['# 001-a', '', LINK_SPEC_STAMP, '', '[the missing spec]: ./does-not-exist.md', ''].join('\n');
    const { packet, file } = writeLinkPacket(root, document);
    const before = manifest(root);

    const result = runLaneModes(packet, { apply: true, repoRoot: root });

    expect(result.actions).toEqual([]);
    expect(result.refusals).toHaveLength(1);
    expect(result.refusals[0]).toMatchObject({ mode: 'link-repoint', document: 'spec.md' });
    expect(result.refusals[0].reason).toContain('reference definition');
    expect(manifest(root)).toBe(before);
    expect(fs.readFileSync(file, 'utf8')).toBe(document);
  });

  it('link-repoint-ignores-scratch-and-memory-candidates', () => {
    const root = makeRoot();
    const document = [
      '# 001-a',
      '',
      LINK_SPEC_STAMP,
      '',
      'See [the scratch note](./scratch-note.md) and [the memory note](./memory-note.md).',
      '',
    ].join('\n');
    const { packet, file } = writeLinkPacket(root, document);
    writeFileAt(root, 'specs/t/001-a/scratch/scratch-note.md', '# Scratch note\n');
    writeFileAt(root, 'specs/t/001-a/memory/memory-note.md', '# Memory note\n');
    const before = manifest(root);

    const result = runLaneModes(packet, { apply: true, repoRoot: root });

    expect(result.actions).toEqual([]);
    expect(result.refusals).toHaveLength(2);
    expect(result.refusals[0]).toMatchObject({ mode: 'link-repoint', document: 'spec.md' });
    expect(result.refusals[0].reason).toContain('no file ends with scratch-note.md');
    expect(result.refusals[1]).toMatchObject({ mode: 'link-repoint', document: 'spec.md' });
    expect(result.refusals[1].reason).toContain('no file ends with memory-note.md');
    expect(result.changedFiles).toEqual([]);
    expect(manifest(root)).toBe(before);
    expect(fs.readFileSync(file, 'utf8')).toBe(document);
  });

  it('link-repoint-hostile-working-directory', () => {
    const root = makeRoot();
    const document = [
      '# 001-a',
      '',
      LINK_SPEC_STAMP,
      '',
      'See [the moved spec](../002-moved/spec.md).',
      '',
    ].join('\n');
    const { packet, file } = writeLinkPacket(root, document);
    // The packet's root holds exactly one file whose trailing path segments
    // match the broken link, so a lookup against it can only repoint.
    const movedFile = writeFileAt(root, 'specs/t/z_archive/002-moved/spec.md', '# Moved spec\n');
    // The hostile directory holds a markdown near-miss, so the fallback walk
    // is non-empty and still finds no file whose key matches the broken link.
    const unrelated = makeRoot();
    writeFileAt(unrelated, '002-moved/notes.md', '# Unrelated note\n');
    const beforeRoot = manifest(root);
    const beforeUnrelated = manifest(unrelated);

    // A packet outside git resolves its repository root from process.cwd(), so
    // the working directory picks the corpus a broken link is resolved against.
    // Each root must give its own outcome: repoint under the packet's root,
    // refusal under the hostile directory.
    const runFrom = (cwd: string): LaneRunResult => {
      const original = process.cwd();
      process.chdir(cwd);
      try {
        return runLaneModes(packet, { apply: true, modes: ['link-repoint'] });
      } finally {
        process.chdir(original);
      }
    };

    // The hostile run comes first so it sees the original broken link and the
    // refusal it must produce; the repointing run then rewrites the document.
    const hostile = runFrom(unrelated);

    expect(hostile.actions).toEqual([]);
    expect(hostile.refusals).toHaveLength(1);
    expect(hostile.refusals[0]).toMatchObject({ mode: 'link-repoint', document: 'spec.md' });
    expect(hostile.refusals[0].reason).toContain('no file ends with 002-moved/spec.md');
    expect(hostile.changedFiles).toEqual([]);
    expect(manifest(root)).toBe(beforeRoot);
    expect(manifest(unrelated)).toBe(beforeUnrelated);

    const expected = runFrom(root);

    expect(expected.actions).toEqual([
      {
        mode: 'link-repoint',
        document: 'spec.md',
        action: 'repointed ../002-moved/spec.md to ../z_archive/002-moved/spec.md',
      },
    ]);
    expect(expected.refusals).toEqual([]);
    expect(expected.changedFiles).toEqual(['spec.md']);
    // The rewrite lands in the packet document alone; nothing beside it moves.
    expect(manifest(unrelated)).toBe(beforeUnrelated);
    expect(fs.readFileSync(movedFile, 'utf8')).toBe('# Moved spec\n');
    expect(fs.readFileSync(file, 'utf8')).toBe(document.replace(
      '../002-moved/spec.md',
      '../z_archive/002-moved/spec.md',
    ));
  });

  it('continuity-placeholders-positive', () => {
    const root = makeRoot();
    const { packet } = writePacket(root, PLAN_ORIGINAL);
    const summaryFile = writeFileAt(root, 'specs/lane-modes/001-probe/implementation-summary.md', SUMMARY_ORIGINAL);

    const result = runLaneModes(packet, { apply: true, modes: ['continuity-placeholders'] });

    expect(result.actions).toEqual([
      {
        mode: 'continuity-placeholders',
        document: 'implementation-summary.md',
        action: 'set recent_action to "No continuity update was recorded"',
      },
      {
        mode: 'continuity-placeholders',
        document: 'implementation-summary.md',
        action: 'set next_safe_action to "None recorded"',
      },
    ]);
    expect(result.refusals).toEqual([]);
    expect(result.changedFiles).toEqual(['implementation-summary.md']);

    const after = fs.readFileSync(summaryFile, 'utf8');
    expect(after).toBe(SUMMARY_HEALED);
    // The two healed lines are the only difference, which stripping them out
    // proves independently of the exact fixture text above.
    expect(withoutContinuityFields(after)).toBe(withoutContinuityFields(SUMMARY_ORIGINAL));
  });

  it('continuity-placeholders-archived', () => {
    const root = makeRoot();
    const file = writeFileAt(root, 'specs/t/z_archive/001-x/implementation-summary.md', SUMMARY_ORIGINAL);

    const result = continuityPlaceholders(SUMMARY_ORIGINAL, file);

    expect(result.changed).toBe(true);
    expect(result.refusals).toEqual([]);
    expect(result.actions).toEqual([
      'set recent_action to "No continuity update was recorded"',
      'set next_safe_action to "None, the packet is archived"',
    ]);
    expect(result.text).toContain('next_safe_action: "None, the packet is archived"');
  });

  it('continuity-placeholders-archive-status-from-specs-root', () => {
    const root = makeRoot();
    // The ancestor shares the archive name but sits above the specs tree, so
    // it says nothing about the packet's place; only segments below specs do.
    const liveFile = writeFileAt(root, 'z_archive/checkout/specs/t/001-live/implementation-summary.md', SUMMARY_ORIGINAL);
    const archivedFile = writeFileAt(root, 'specs/t/z_archive/001-gone/implementation-summary.md', SUMMARY_ORIGINAL);

    const live = continuityPlaceholders(SUMMARY_ORIGINAL, liveFile);
    const archived = continuityPlaceholders(SUMMARY_ORIGINAL, archivedFile);

    expect(live.changed).toBe(true);
    expect(live.actions).toEqual([
      'set recent_action to "No continuity update was recorded"',
      'set next_safe_action to "None recorded"',
    ]);
    expect(live.text).toContain('next_safe_action: "None recorded"');

    expect(archived.changed).toBe(true);
    expect(archived.actions).toEqual([
      'set recent_action to "No continuity update was recorded"',
      'set next_safe_action to "None, the packet is archived"',
    ]);
    expect(archived.text).toContain('next_safe_action: "None, the packet is archived"');
  });

  // The archived-status check resolves a document's location before reading
  // its segments, so each row spells a path and states the placement the
  // spelling must resolve to. `z_archive` above the specs root is already
  // held by continuity-placeholders-archive-status-from-specs-root.
  it.each([
    // A delimiter look-alike is not the exact segment, so a prefix, suffix
    // or containment match would misread these placements as archived.
    {
      name: 'z_archived look-alike stays live',
      relative: 'specs/t/z_archived/001-x/implementation-summary.md',
      archived: false,
    },
    {
      name: 'z_archive-notes look-alike stays live',
      relative: 'specs/t/z_archive-notes/001-x/implementation-summary.md',
      archived: false,
    },
    {
      name: 'my_z_archive look-alike stays live',
      relative: 'specs/t/my_z_archive/001-x/implementation-summary.md',
      archived: false,
    },
    // `..` segments and doubled separators are judged by where they resolve,
    // not by the segments the spelling happens to carry.
    {
      name: '.. segments resolving into z_archive read as archived',
      relative: 'specs/t/001-x/../z_archive/001-x/implementation-summary.md',
      archived: true,
    },
    {
      name: '.. segments resolving out of z_archive read as live',
      relative: 'specs/t/z_archive/001-x/../../001-live/implementation-summary.md',
      archived: false,
    },
    {
      name: 'a doubled separator resolving into z_archive reads as archived',
      relative: 'specs/t/z_archive//001-x/implementation-summary.md',
      archived: true,
    },
    // The no-op row: an ordinary active packet keeps the default wording.
    {
      name: 'an ordinary active packet stays live',
      relative: 'specs/t/001-live/implementation-summary.md',
      archived: false,
    },
    // A path with no `specs` segment is below no tree, so the documented
    // fallback proves no archive placement.
    {
      name: 'a document below no specs root falls back to live',
      relative: 'outside/implementation-summary.md',
      archived: false,
    },
  ])('continuity-placeholders-archive-placement: $name', ({ relative, archived }) => {
    const root = makeRoot();
    // path.join normalizes the spelling to where the file really lands, while
    // the separator-joined string keeps every `..` and doubled separator for
    // the mode to resolve itself.
    const file = writeFileAt(root, relative, SUMMARY_ORIGINAL);
    const spelling = [root, ...relative.split('/')].join(path.sep);
    const next = archived ? 'None, the packet is archived' : 'None recorded';

    const result = continuityPlaceholders(SUMMARY_ORIGINAL, spelling);

    expect(file).toBe(path.resolve(spelling));
    expect(result.changed).toBe(true);
    expect(result.refusals).toEqual([]);
    expect(result.actions).toEqual([
      'set recent_action to "No continuity update was recorded"',
      `set next_safe_action to "${next}"`,
    ]);
    expect(result.text).toContain(`next_safe_action: "${next}"`);
    // Only the continuity pair changes, so the placement judgment picks
    // wording and never edits the rest of the document.
    expect(withoutContinuityFields(result.text)).toBe(withoutContinuityFields(SUMMARY_ORIGINAL));
  });

  it('continuity-placeholders-refuses-a-value-continued-on-the-next-line', () => {
    const root = makeRoot();
    const original = [
      '---',
      'title: "Continuity continued probe"',
      '_memory:',
      '  continuity:',
      '    recent_action:',
      '      Initialized the parser before the split',
      '    next_safe_action: "Replace continuity placeholders"',
      '---',
      '<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->',
      '# Continuity continued probe',
      '',
    ].join('\n');
    const { packet } = writePacket(root, PLAN_ORIGINAL);
    const summaryFile = writeFileAt(root, 'specs/lane-modes/001-probe/implementation-summary.md', original);

    const result = runLaneModes(packet, { apply: true, modes: ['continuity-placeholders'] });

    expect(result.actions).toEqual([]);
    expect(result.changedFiles).toEqual([]);
    expect(result.refusals).toEqual([
      {
        mode: 'continuity-placeholders',
        document: 'implementation-summary.md',
        reason: 'continuity value continues on the next line; left unchanged',
      },
    ]);
    const after = fs.readFileSync(summaryFile, 'utf8');
    expect(after).toBe(original);
    // The authored value is the frontmatter's only continuity evidence, so it
    // must still parse as the author wrote it.
    const frontmatter = after.split('\n').slice(1, 7).join('\n');
    const parsed = yaml.load(frontmatter) as { _memory: { continuity: Record<string, string> } };
    expect(parsed._memory.continuity.recent_action).toBe('Initialized the parser before the split');
  });

  it('continuity-placeholders-refuses-authored', () => {
    const root = makeRoot();
    const { packet } = writePacket(root, PLAN_ORIGINAL);
    const document = SUMMARY_ORIGINAL.replace(
      'recent_action: "Initialized Level 2 template"',
      'recent_action: "Wrote the task list"',
    );
    const summaryFile = writeFileAt(root, 'specs/lane-modes/001-probe/implementation-summary.md', document);
    const before = manifest(root);

    const result = runLaneModes(packet, { apply: true, modes: ['continuity-placeholders'] });

    expect(result.actions).toEqual([]);
    expect(result.refusals).toHaveLength(1);
    expect(result.refusals[0]).toMatchObject({ mode: 'continuity-placeholders', document: 'implementation-summary.md' });
    expect(result.refusals[0].reason).toContain('edit in progress');
    expect(result.changedFiles).toEqual([]);
    expect(manifest(root)).toBe(before);
    expect(fs.readFileSync(summaryFile, 'utf8')).toBe(document);
  });

  it('continuity-idempotence', () => {
    const root = makeRoot();
    const { packet } = writePacket(root, PLAN_ORIGINAL);
    writeFileAt(root, 'specs/lane-modes/001-probe/implementation-summary.md', SUMMARY_ORIGINAL);

    const first = runLaneModes(packet, { apply: true, modes: ['continuity-placeholders'] });
    expect(first.actions.length).toBeGreaterThan(0);
    const afterFirst = manifest(root);

    const second = runLaneModes(packet, { apply: true, modes: ['continuity-placeholders'] });

    expect(second.actions).toEqual([]);
    expect(second.refusals).toEqual([]);
    expect(second.changedFiles).toEqual([]);
    expect(manifest(root)).toBe(afterFirst);
  });

  it('continuity-placeholders-ignores-authored-replace', () => {
    const root = makeRoot();
    const document = SUMMARY_ORIGINAL
      .replace('recent_action: "Initialized Level 2 template"', 'recent_action: "Wrote the task list"')
      .replace('next_safe_action: "Replace continuity placeholders"', 'next_safe_action: "Replace the parser"');
    const file = writeFileAt(root, 'specs/t/001-a/implementation-summary.md', document);

    const result = continuityPlaceholders(fs.readFileSync(file, 'utf8'), file);

    expect(result.changed).toBe(false);
    expect(result.actions).toEqual([]);
    expect(result.refusals).toEqual([]);
  });

  it('level-from-spec-positive', () => {
    const root = makeRoot();
    const { packet, planFile } = writeLevelPacket(
      root,
      '# Level probe\n\n<!-- SPECKIT_LEVEL: 2 -->\n',
      LEVEL_PLAN_ORIGINAL,
    );

    const result = runLaneModes(packet, { apply: true, modes: ['level-from-spec'] });

    expect(result.actions).toEqual([
      { mode: 'level-from-spec', document: 'plan.md', action: 'added level: 2 to the frontmatter' },
    ]);
    expect(result.refusals).toEqual([]);
    expect(result.changedFiles).toEqual(['plan.md']);

    const after = fs.readFileSync(planFile, 'utf8');
    expect(after).toBe(LEVEL_PLAN_HEALED);
    // The inserted line is the only difference; removing it restores the
    // fixture byte for byte.
    expect(after.replace('\nlevel: 2', '')).toBe(LEVEL_PLAN_ORIGINAL);
  });

  it('level-from-spec-keeps-inline-declaration', () => {
    const root = makeRoot();
    // The document states its level in the anchored inline form the validator
    // reads, so the mode must add no second declaration to its frontmatter.
    const document = [
      '---',
      'title: "Inline level probe plan"',
      '---',
      '# Inline level probe plan',
      '',
      'Level: 3',
      '',
      'Authored body stays exactly as written.',
      '',
    ].join('\n');
    const { packet, planFile } = writeLevelPacket(
      root,
      '# Level probe\n\n<!-- SPECKIT_LEVEL: 2 -->\n',
      document,
    );
    const before = manifest(root);

    const result = runLaneModes(packet, { apply: true, modes: ['level-from-spec'] });

    expect(result.actions).toEqual([]);
    expect(result.refusals).toEqual([]);
    expect(result.changedFiles).toEqual([]);
    expect(manifest(root)).toBe(before);
    expect(fs.readFileSync(planFile, 'utf8')).toBe(document);
  });

  it('level-from-spec-refuses-a-closing-line-with-trailing-text', () => {
    const root = makeRoot();
    const plan = ['---', 'title: "Level probe plan"', '---trailing', '# Level probe plan', ''].join('\n');
    const { packet, planFile } = writeLevelPacket(root, '# Level probe\n\n<!-- SPECKIT_LEVEL: 2 -->\n', plan);

    const result = runLaneModes(packet, { apply: true, modes: ['level-from-spec'] });

    expect(result.actions).toEqual([]);
    expect(result.changedFiles).toEqual([]);
    expect(result.refusals).toEqual([
      {
        mode: 'level-from-spec',
        document: 'plan.md',
        reason: 'no frontmatter block to write the level into; left unchanged',
      },
    ]);
    expect(fs.readFileSync(planFile, 'utf8')).toBe(plan);
  });

  it('level-from-spec-accepts-a-closing-line-with-trailing-spaces-and-crlf', () => {
    const root = makeRoot();
    const plan = '---\r\ntitle: "Level probe plan"\r\n---   \r\n# Level probe plan\r\n';
    const { packet, planFile } = writeLevelPacket(root, '# Level probe\n\n<!-- SPECKIT_LEVEL: 2 -->\n', plan);

    const result = runLaneModes(packet, { apply: true, modes: ['level-from-spec'] });

    expect(result.actions).toEqual([
      { mode: 'level-from-spec', document: 'plan.md', action: 'added level: 2 to the frontmatter' },
    ]);
    expect(result.refusals).toEqual([]);
    expect(fs.readFileSync(planFile, 'utf8')).toBe(
      '---\r\ntitle: "Level probe plan"\r\nlevel: 2\r\n---   \r\n# Level probe plan\r\n',
    );
  });

  it('level-from-spec-refuses-missing-header', () => {
    const root = makeRoot();
    const spec = [
      '# Level probe',
      '',
      '| Field | Value |',
      '| --- | --- |',
      '| **Level** | 2 |',
      '',
    ].join('\n');
    const { packet, planFile } = writeLevelPacket(root, spec, LEVEL_PLAN_ORIGINAL);
    const before = manifest(root);

    const result = runLaneModes(packet, { apply: true, modes: ['level-from-spec'] });

    expect(result.actions).toEqual([]);
    expect(result.refusals).toHaveLength(1);
    expect(result.refusals[0]).toMatchObject({ mode: 'level-from-spec', document: 'plan.md' });
    expect(result.refusals[0].reason).toContain('no SPECKIT_LEVEL marker');
    expect(result.changedFiles).toEqual([]);
    expect(manifest(root)).toBe(before);
    expect(fs.readFileSync(planFile, 'utf8')).toBe(LEVEL_PLAN_ORIGINAL);
  });

  it('level-from-spec-refuses-malformed', () => {
    const root = makeRoot();
    const { packet, planFile } = writeLevelPacket(
      root,
      '# Level probe\n\n<!-- SPECKIT_LEVEL: 4 -->\n',
      LEVEL_PLAN_ORIGINAL,
    );
    const before = manifest(root);

    const result = runLaneModes(packet, { apply: true, modes: ['level-from-spec'] });

    expect(result.actions).toEqual([]);
    expect(result.refusals).toHaveLength(1);
    expect(result.refusals[0]).toMatchObject({ mode: 'level-from-spec', document: 'plan.md' });
    expect(result.refusals[0].reason).toContain('malformed');
    expect(result.changedFiles).toEqual([]);
    expect(manifest(root)).toBe(before);
    expect(fs.readFileSync(planFile, 'utf8')).toBe(LEVEL_PLAN_ORIGINAL);
  });

  it('level-from-spec-idempotence', () => {
    const root = makeRoot();
    const { packet } = writeLevelPacket(
      root,
      '# Level probe\n\n<!-- SPECKIT_LEVEL: 2 -->\n',
      LEVEL_PLAN_ORIGINAL,
    );

    const first = runLaneModes(packet, { apply: true, modes: ['level-from-spec'] });
    expect(first.actions.length).toBeGreaterThan(0);
    const afterFirst = manifest(root);

    const second = runLaneModes(packet, { apply: true, modes: ['level-from-spec'] });

    expect(second.actions).toEqual([]);
    expect(second.refusals).toEqual([]);
    expect(second.changedFiles).toEqual([]);
    expect(manifest(root)).toBe(afterFirst);
  });

  it('header-add-positive', () => {
    const root = makeRoot();
    const original = headerPlanFixture();
    const { packet, planFile } = writePacket(root, original);

    const predicted = headerAdd(original, planFile);
    expect(predicted.changed).toBe(true);

    const result = runLaneModes(packet, { apply: true, modes: ['header-add'] });

    expect(result.refusals).toEqual([]);
    expect(result.changedFiles).toEqual(['plan.md']);
    expect(result.actions).toEqual([
      {
        mode: 'header-add',
        document: 'plan.md',
        action: `named the template as ${levelTwoPlanMarker()}, proven by its exact anchors`,
      },
    ]);

    const after = fs.readFileSync(planFile, 'utf8');
    const frontmatterEnd = original.split('\n').indexOf('---', 1);
    const stamp = after.split('\n')[frontmatterEnd + 1];
    // The stamp lands directly after the frontmatter, and removing it restores
    // the fixture byte for byte, so it is the only line the mode touched.
    expect(stamp).toBe(`<!-- SPECKIT_TEMPLATE_SOURCE: ${levelTwoPlanMarker()} -->`);
    expect(after.replace(`${stamp}\n`, '')).toBe(original);
    expect(after).toBe(predicted.text);
  });

  it('header-add-keeps-crlf', () => {
    const root = makeRoot();
    const original = headerPlanFixture().replace(/\n/g, '\r\n');
    const { packet, planFile } = writePacket(root, original);

    const result = runLaneModes(packet, { apply: true, modes: ['header-add'] });

    expect(result.refusals).toEqual([]);
    expect(result.changedFiles).toEqual(['plan.md']);

    const after = fs.readFileSync(planFile, 'utf8');
    const stamp = `<!-- SPECKIT_TEMPLATE_SOURCE: ${levelTwoPlanMarker()} -->`;
    // The stamp takes the document's own CRLF, so a CRLF document stays
    // single-ending instead of growing one lone LF.
    expect(after).toContain(`${stamp}\r\n`);
    expect(after.replace(/\r\n/g, '')).not.toContain('\n');
    expect(after.replace(`${stamp}\r\n`, '')).toBe(original);
  });

  it('header-add-refuses-no-match', () => {
    const root = makeRoot();
    const original = `${headerPlanFixture()}<!-- ANCHOR:invented-extra -->\n<!-- /ANCHOR:invented-extra -->\n`;
    const { packet, planFile } = writePacket(root, original);
    const before = manifest(root);

    const result = runLaneModes(packet, { apply: true, modes: ['header-add'] });

    expect(result.actions).toEqual([]);
    expect(result.refusals).toHaveLength(1);
    expect(result.refusals[0]).toMatchObject({ mode: 'header-add', document: 'plan.md' });
    expect(result.refusals[0].reason).toContain('beyond the anchors rendered for Level 2');
    expect(result.changedFiles).toEqual([]);
    expect(manifest(root)).toBe(before);
    expect(fs.readFileSync(planFile, 'utf8')).toBe(original);
  });

  it('header-add-refuses-fenced-only-anchor', () => {
    const root = makeRoot();
    const original = fencedOnlyAnchorPlanFixture();
    const { packet, planFile } = writePacket(root, original);
    const before = manifest(root);

    const result = runLaneModes(packet, { apply: true, modes: ['header-add'] });

    expect(result.actions).toEqual([]);
    expect(result.refusals).toHaveLength(1);
    expect(result.refusals[0]).toMatchObject({ mode: 'header-add', document: 'plan.md' });
    expect(result.refusals[0].reason).toContain('does not carry summary');
    expect(result.changedFiles).toEqual([]);
    expect(manifest(root)).toBe(before);
    expect(fs.readFileSync(planFile, 'utf8')).toBe(original);
  });

  it('header-add-refuses-an-anchor-named-only-in-a-double-backtick-span', () => {
    const root = makeRoot();
    const original = doubleBacktickAnchorPlanFixture();
    const { packet, planFile } = writePacket(root, original);
    const before = manifest(root);

    const result = runLaneModes(packet, { apply: true, modes: ['header-add'] });

    expect(result.actions).toEqual([]);
    expect(result.refusals).toHaveLength(1);
    expect(result.refusals[0]).toMatchObject({ mode: 'header-add', document: 'plan.md' });
    expect(result.refusals[0].reason).toContain('does not carry summary');
    expect(manifest(root)).toBe(before);
    expect(fs.readFileSync(planFile, 'utf8')).toBe(original);
  });

  it('header-add-refuses-an-anchor-named-only-in-a-list-indented-fence', () => {
    const root = makeRoot();
    const original = listIndentedAnchorPlanFixture();
    const { packet, planFile } = writePacket(root, original);
    const before = manifest(root);

    const result = runLaneModes(packet, { apply: true, modes: ['header-add'] });

    expect(result.actions).toEqual([]);
    expect(result.refusals).toHaveLength(1);
    expect(result.refusals[0]).toMatchObject({ mode: 'header-add', document: 'plan.md' });
    expect(result.refusals[0].reason).toContain('does not carry summary');
    expect(manifest(root)).toBe(before);
    expect(fs.readFileSync(planFile, 'utf8')).toBe(original);
  });

  it('header-add-refuses-a-closing-line-with-trailing-text', () => {
    const root = makeRoot();
    const original = trailingCloserPlanFixture();
    const { packet, planFile } = writePacket(root, original);
    const before = manifest(root);

    const result = runLaneModes(packet, { apply: true, modes: ['header-add'] });

    expect(result.actions).toEqual([]);
    expect(result.refusals).toHaveLength(1);
    expect(result.refusals[0]).toMatchObject({ mode: 'header-add', document: 'plan.md' });
    expect(result.refusals[0].reason).toContain('there is no frontmatter to place the header after');
    expect(manifest(root)).toBe(before);
    expect(fs.readFileSync(planFile, 'utf8')).toBe(original);
  });

  it('header-add-stamps-after-a-closing-line-with-trailing-spaces-and-crlf', () => {
    const root = makeRoot();
    const marker = levelTwoPlanMarker();
    const original = [
      '---',
      'title: "Header probe plan"',
      '---   ',
      '',
      ...levelTwoPlanAnchors().map((anchor) => `<!-- ANCHOR:${anchor} -->`),
      '',
    ].join('\r\n');
    const { packet, planFile } = writePacket(root, original);

    const result = runLaneModes(packet, { apply: true, modes: ['header-add'] });

    expect(result.refusals).toEqual([]);
    expect(result.changedFiles).toEqual(['plan.md']);
    // The stamp follows the whole closing line, trailing spaces included, so the
    // delimiter the document wrote stays on its own line.
    expect(fs.readFileSync(planFile, 'utf8')).toBe(
      original.replace('---   \r\n', `---   \r\n<!-- SPECKIT_TEMPLATE_SOURCE: ${marker} -->\r\n`),
    );
  });

  it('header-add-stamps-past-fenced-extra', () => {
    const root = makeRoot();
    const original = fencedExtraAnchorPlanFixture();
    const { packet, planFile } = writePacket(root, original);

    const result = runLaneModes(packet, { apply: true, modes: ['header-add'] });

    expect(result.refusals).toEqual([]);
    expect(result.changedFiles).toEqual(['plan.md']);
    expect(result.actions).toHaveLength(1);
    expect(result.actions[0].action).toContain('proven by its exact anchors');

    const after = fs.readFileSync(planFile, 'utf8');
    const frontmatterEnd = original.split('\n').indexOf('---', 1);
    const stamp = after.split('\n')[frontmatterEnd + 1];
    // The stamp lands directly after the frontmatter, and removing it restores
    // the fixture byte for byte, so the fenced example stays untouched.
    expect(stamp).toBe(`<!-- SPECKIT_TEMPLATE_SOURCE: ${levelTwoPlanMarker()} -->`);
    expect(after.replace(`${stamp}\n`, '')).toBe(original);
  });

  it('header-add-idempotence', () => {
    const root = makeRoot();
    const { packet } = writePacket(root, headerPlanFixture());

    const first = runLaneModes(packet, { apply: true, modes: ['header-add'] });
    expect(first.actions).toHaveLength(1);
    const afterFirst = manifest(root);

    const second = runLaneModes(packet, { apply: true, modes: ['header-add'] });

    expect(second.actions).toEqual([]);
    expect(second.refusals).toEqual([]);
    expect(second.changedFiles).toEqual([]);
    expect(manifest(root)).toBe(afterFirst);
  });

  it('lane-modes-order', () => {
    // The exact list guards against a reconstruction or status mode: both
    // change what a document asserts, so they stay reported, never automated.
    expect(LANE_MODES.map((mode) => mode.name)).toEqual([
      'anchor-wrap',
      'link-repoint',
      'continuity-placeholders',
      'level-from-spec',
      'header-add',
    ]);
  });

  it('lane-modes-sequence', () => {
    const root = makeRoot();
    const { packet, planFile } = writePacket(root, sequencePlanFixture());

    const result = runLaneModes(packet, { apply: true });

    expect(result.refusals).toEqual([]);
    expect(result.actions).toEqual([
      { mode: 'anchor-wrap', document: 'plan.md', action: 'wrapped "3. ARCHITECTURE" with anchor architecture' },
      { mode: 'level-from-spec', document: 'plan.md', action: 'added level: 2 to the frontmatter' },
      {
        mode: 'header-add',
        document: 'plan.md',
        action: `named the template as ${levelTwoPlanMarker()}, proven by its exact anchors`,
      },
    ]);

    const after = fs.readFileSync(planFile, 'utf8');
    expect(after).toContain('<!-- ANCHOR:architecture -->');
    expect(after).toContain(`<!-- SPECKIT_TEMPLATE_SOURCE: ${levelTwoPlanMarker()} -->`);

    const afterFirst = manifest(root);
    const second = runLaneModes(packet, { apply: true });

    expect(second.actions).toEqual([]);
    expect(second.refusals).toEqual([]);
    expect(second.changedFiles).toEqual([]);
    expect(manifest(root)).toBe(afterFirst);
  });
});
