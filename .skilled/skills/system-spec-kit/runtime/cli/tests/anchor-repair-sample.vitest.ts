// ───────────────────────────────────────────────────────────────────
// MODULE: Anchor Repair Corpus Sample
// ───────────────────────────────────────────────────────────────────
//
// A batch proof that the anchor repair is safe on a frozen corpus sample:
// seeded copies of real spec.md documents that carry the nested questions
// layout, plus the wrapper-hybrid layouts the un-nesting refuses, copied into
// a sandbox, dry-run to prove nothing is written, applied, and checked
// marker-by-marker. The sample is frozen into fixtures because the repair
// itself un-nests the live corpus, after which the live tree can no longer
// seed this run; nothing here reads the live tree.

import crypto from 'node:crypto';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { parseAnchoredSections } from '../utils/template-structure.js';

const require = createRequire(path.join(__dirname, 'anchor-repair-sample.vitest.ts'));
const { repairAnchors, unnestQuestionsAnchors } = require('../spec/heal-spec-docs.cjs') as {
  repairAnchors: (text: string) => AnchorRepairResult;
  unnestQuestionsAnchors: (text: string) => AnchorRepairResult;
};

type AnchorRepairResult = {
  text: string;
  changed: boolean;
  actions: string[];
  refusals: string[];
};

type AnchoredSection = {
  id: string;
  content: string;
  startLine: number;
  endLine: number;
};

type WrapperShape = 'open-questions' | 'questions-2';

type FixtureEntry =
  | { source: string; kind: 'repairable' }
  | { source: string; kind: 'refused'; shape: WrapperShape };

type FixtureIndex = {
  seed: number;
  nameMaxLength: number;
  drawnFromCommit: string;
  documents: Record<string, FixtureEntry>;
};

type Fixture = FixtureEntry & {
  /** Fixture file name: the source path with its slashes replaced. */
  name: string;
  /** Frozen bytes, kept so the run can prove the fixtures are never written. */
  bytes: Buffer;
};

type RepairableFixture = Fixture & { kind: 'repairable' };
type RefusedFixture = Fixture & { kind: 'refused'; shape: WrapperShape };

const FIXTURES_DIR = path.join(__dirname, 'fixtures', 'anchor-repair-sample');
const HEAL_SPEC_DOCS = path.resolve(__dirname, '..', 'spec', 'heal-spec-docs.cjs');
const REPAIRABLE_COUNT = 50;
const REFUSED_COUNT = 10;
const DRY_RUN_BUDGET_MS = 60_000;

const OPEN_QUESTIONS_RE = /^\s*#{1,6}\s+(?:\d+(?:\.\d+)*[.)]?\s+)?OPEN QUESTIONS\b/i;
const MARKER_LINE_RE = /^\s*<!--\s*\/?ANCHOR:[a-z0-9-]+\s*-->\s*$/;
const ANCHOR_OPENER_RE = /<!--\s*ANCHOR:/g;
const ANCHOR_OPENER_CAPTURE_RE = /<!--\s*ANCHOR:([a-z0-9-]+)\s*-->/g;
const ANCHOR_CLOSER_CAPTURE_RE = /<!--\s*\/ANCHOR:([a-z0-9-]+)\s*-->/g;

let tmpRoot = '';

beforeAll(() => {
  expect(fs.existsSync(path.join(FIXTURES_DIR, 'index.json')), 'the frozen fixture index exists').toBe(true);
  tmpRoot = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'anchor-repair-sample-')));
});

afterAll(() => {
  if (tmpRoot) fs.rmSync(tmpRoot, { recursive: true, force: true });
});

function loadFixtures(): Fixture[] {
  const index = JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, 'index.json'), 'utf8')) as FixtureIndex;
  return Object.entries(index.documents).map(([name, entry]) => ({
    ...entry,
    name,
    bytes: fs.readFileSync(path.join(FIXTURES_DIR, name)),
  }));
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

function leftoverTempFiles(root: string): string[] {
  const leftovers: string[] = [];
  const walk = (directory: string): void => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(file);
      } else if (entry.name.endsWith('.tmp')) {
        leftovers.push(file);
      }
    }
  };
  walk(root);
  return leftovers;
}

function stripMarkerLines(text: string): { prose: string; markers: string[] } {
  const lines = text.split(/\r?\n/);
  return {
    prose: lines.filter((line) => !MARKER_LINE_RE.test(line)).join('\n'),
    markers: lines.filter((line) => MARKER_LINE_RE.test(line)),
  };
}

// Mirror of the validator's anchor pairing: fence interiors are examples, so a
// marker lookalike there is prose and cannot open or close an anchor.
function anchorIntegrityFindings(text: string): string[] {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const body: string[] = [];
  let inFence = false;
  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (!inFence) body.push(line);
  }

  const bodyText = body.join('\n');
  const openers = [...bodyText.matchAll(ANCHOR_OPENER_CAPTURE_RE)].map((match) => match[1]);
  const closers = [...bodyText.matchAll(ANCHOR_CLOSER_CAPTURE_RE)].map((match) => match[1]);

  const findings: string[] = [];
  const seen = new Set<string>();
  for (const id of openers) {
    if (seen.has(id)) findings.push(`anchor ${id} opens more than once`);
    seen.add(id);
  }
  for (const id of openers) {
    if (!closers.includes(id)) findings.push(`anchor ${id} is never closed`);
  }
  for (const id of closers) {
    if (!openers.includes(id)) findings.push(`anchor ${id} is closed but never opened`);
  }
  return findings;
}

function questionsSection(text: string): AnchoredSection | undefined {
  return parseAnchoredSections(text).find((section) => section.id === 'questions');
}

function refusalLine(stdout: string, file: string): string | undefined {
  return stdout.split('\n').find((line) => line.startsWith(`left unchanged ${file}:`));
}

function copyInto<T extends Fixture>(fixture: T, folder: string): T & { file: string } {
  fs.mkdirSync(folder, { recursive: true });
  const file = path.join(folder, 'spec.md');
  fs.writeFileSync(file, fixture.bytes);
  return { ...fixture, file };
}

describe('anchor repair corpus sample', () => {
  it('dry-runs and applies the repair on the frozen corpus sample of nested questions layouts', { timeout: 120_000 }, () => {
    const fixtures = loadFixtures();
    const repairable = fixtures.filter(
      (fixture): fixture is RepairableFixture => fixture.kind === 'repairable',
    );
    const refused = fixtures.filter(
      (fixture): fixture is RefusedFixture => fixture.kind === 'refused',
    );

    expect(repairable.length, 'the fixture carries the seeded repairable sample').toBe(REPAIRABLE_COUNT);
    expect(refused.length, 'the fixture carries the seeded refused sample').toBe(REFUSED_COUNT);
    expect(new Set(refused.map((fixture) => fixture.shape)), 'both wrapper-hybrid shapes are represented').toEqual(
      new Set(['open-questions', 'questions-2']),
    );
    const stray = fs.readdirSync(FIXTURES_DIR).filter(
      (name) => name !== 'index.json' && !fixtures.some((fixture) => fixture.name === name),
    );
    expect(stray, 'every file in the fixture directory is indexed').toEqual([]);
    for (const fixture of fixtures) {
      expect(fixture.name, `fixture ${fixture.name} is named after its source path`).toBe(fixture.source.split('/').join('_'));
    }

    console.log(`anchor sample: fixtures=${fixtures.length} repairable=${repairable.length} refused=${refused.length}`);

    const specsRoot = path.join(tmpRoot, 'specs');
    const copies = repairable.map((fixture, order) =>
      copyInto(fixture, path.join(specsRoot, 'sample', `${String(order + 1).padStart(3, '0')}-sample`)));
    const refusedCopies = refused.map((fixture, order) =>
      copyInto(fixture, path.join(specsRoot, 'refused', `${String(order + 1).padStart(3, '0')}-refused`)));
    const documents = [...copies, ...refusedCopies];

    const digestBefore = manifest(tmpRoot);
    const fixturesBefore = manifest(FIXTURES_DIR);
    const dryStarted = Date.now();
    const dryRun = spawnSync(process.execPath, [HEAL_SPEC_DOCS, '--anchor-repair', '--roots', specsRoot], {
      encoding: 'utf8',
    });
    const dryElapsed = Date.now() - dryStarted;

    expect(dryRun.status, `anchor repair dry run exited ${dryRun.status}: ${dryRun.stderr}`).toBe(0);
    expect(manifest(tmpRoot), 'dry run leaves the sandbox byte-identical').toBe(digestBefore);
    expect(dryElapsed, `dry run completed in ${dryElapsed}ms`).toBeLessThan(DRY_RUN_BUDGET_MS);

    for (const copy of refusedCopies) {
      expect(dryRun.stdout, `dry run reports refused ${copy.source}`).toContain(`left unchanged ${copy.file}:`);
      expect(refusalLine(dryRun.stdout, copy.file), `dry run names the ${copy.shape} wrapper for ${copy.source}`).toContain(
        `would overlap ${copy.shape}`,
      );
    }
    const dryRefusals = dryRun.stdout.split('\n').filter((line) => line.startsWith('left unchanged '));
    expect(dryRefusals.length, 'dry run refuses exactly the documents the un-nesting cannot move').toBe(
      refusedCopies.length,
    );
    for (const copy of copies) {
      expect(dryRun.stdout, `dry run names ${copy.source}`).toContain(
        `would repair ${copy.file}: moved questions opener`,
      );
    }
    const wouldRepair = dryRun.stdout.split('\n').filter((line) => line.startsWith('would repair '));
    expect(wouldRepair.length, 'dry run reports exactly one move per copy').toBe(copies.length);
    expect(dryRun.stdout, 'dry run summary counts every document').toContain(
      `anchor repair: documents=${documents.length} repairable=${copies.length} findings=${documents.length}`,
    );

    const applyRun = spawnSync(process.execPath, [HEAL_SPEC_DOCS, '--anchor-repair', '--roots', specsRoot, '--apply'], {
      encoding: 'utf8',
    });
    expect(applyRun.status, `anchor repair apply exited ${applyRun.status}: ${applyRun.stderr}`).toBe(0);
    for (const copy of refusedCopies) {
      expect(applyRun.stdout, `apply reports refused ${copy.source}`).toContain(`left unchanged ${copy.file}:`);
    }
    const applyRefusals = applyRun.stdout.split('\n').filter((line) => line.startsWith('left unchanged '));
    expect(applyRefusals.length, 'apply refuses exactly the documents the un-nesting cannot move').toBe(
      refusedCopies.length,
    );
    expect(applyRun.stdout, 'apply summary counts every repaired copy').toContain(
      `anchor repair: documents=${documents.length} repaired=${copies.length} findings=${documents.length}`,
    );
    expect(leftoverTempFiles(tmpRoot), 'apply leaves no temporary file behind').toEqual([]);
    expect(manifest(FIXTURES_DIR), 'the repair never touches the frozen fixtures').toBe(fixturesBefore);

    for (const copy of refusedCopies) {
      const context = `refused copy of ${copy.source}`;

      expect(fs.readFileSync(copy.file).equals(copy.bytes), `${context}: apply leaves the document byte-identical`).toBe(true);
      const result = repairAnchors(copy.bytes.toString('utf8'));
      expect(result.changed, `${context}: the repair refuses the move`).toBe(false);
      expect(result.refusals.length, `${context}: the refusal is reported`).toBeGreaterThan(0);
      expect(result.refusals.join('\n'), `${context}: the refusal names the ${copy.shape} wrapper`).toContain(copy.shape);
    }

    for (const copy of copies) {
      const context = `copy of ${copy.source}`;
      const before = copy.bytes.toString('utf8');
      const after = fs.readFileSync(copy.file, 'utf8');

      const section = questionsSection(after);
      expect(section, `${context}: questions section is discoverable`).toBeDefined();
      const sectionContent = section?.content ?? '';
      expect((sectionContent.match(ANCHOR_OPENER_RE) ?? []).length, `${context}: questions section holds only its own opener`).toBe(1);
      expect(OPEN_QUESTIONS_RE.test(sectionContent.split('\n')[1] ?? ''), `${context}: second line is the OPEN QUESTIONS heading`).toBe(true);
      expect(unnestQuestionsAnchors(after).changed, `${context}: un-nesting is complete`).toBe(false);

      const beforeStripped = stripMarkerLines(before);
      const afterStripped = stripMarkerLines(after);
      expect(afterStripped.prose, `${context}: prose is identical after the move`).toBe(beforeStripped.prose);
      expect([...afterStripped.markers].sort(), `${context}: the marker lines are identical after the move`).toEqual(
        [...beforeStripped.markers].sort(),
      );
      expect(anchorIntegrityFindings(after), `${context}: every anchor pairs one-to-one`).toEqual([]);
    }
  });
});
