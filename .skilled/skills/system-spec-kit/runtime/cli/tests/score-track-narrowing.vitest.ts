// ───────────────────────────────────────────────────────────────────
// MODULE: Track Narrowing Measurement Tests
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { generate } from '../retrieval/generate-trigger-index.mjs';
import { loadIndex } from '../retrieval/lookup-trigger-index.mjs';
import {
  CHOICE_INSTRUCTION,
  DEFAULT_PROBES_PATH,
  KEEP_RULE_LINE,
  MARGIN_LINE,
  NONE_DESCRIPTION,
  NONE_KEY,
  ORDERS,
  SHORTLIST_SIZE,
  baselineLines,
  buildOptions,
  buildTestSet,
  clusterBootstrapInterval,
  classifyDescription,
  columnLine,
  decideVerdict,
  headroomLines,
  isInsideFolder,
  loadProbes,
  lookupPick,
  main,
  modalPick,
  nearestRank,
  pinRowSet,
  probeGold,
  probeHits,
  probeLine,
  ripgrepPick,
  ripgrepTokens,
  rotateOptions,
  ruleLines,
  signTestP,
  summarizeBaselines,
  summarizeColumn,
  testSetLines,
  trackOf,
} from '../retrieval/score-track-narrowing.mjs';

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

const tempDirs: string[] = [];

function tempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) fs.rmSync(dir, { recursive: true, force: true });
  }
});

function write(root: string, rel: string, text: string): void {
  const abs = path.join(root, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, text);
}

function track(root: string, name: string, description: string): void {
  write(root, path.join('specs', name, 'description.json'), JSON.stringify({ description }));
}

function packet(root: string, folder: string, description: string): void {
  write(root, path.join(folder, 'description.json'), JSON.stringify({ description }));
}

function sha256(folder: string): string {
  return createHash('sha256').update(folder).digest('hex');
}

function doc(root: string, rel: string, phrases: string[]): void {
  write(root, rel, [
    '---',
    'title: "Doc"',
    'trigger_phrases:',
    ...phrases.map((p) => `  - "${p}"`),
    '---',
    '',
    '# Doc',
    '',
  ].join('\n'));
}

function indexFor(root: string): ReturnType<typeof loadIndex> {
  const indexPath = path.join(root, 'out', 'idx.json');
  const report = generate({
    repoRoot: root,
    roots: ['specs'],
    ignoredPaths: [],
    indexPath,
  });
  expect(report.published).toBe(true);
  return loadIndex(indexPath, { hashIndex: false });
}

function smallCorpus(root: string): { indexPath: string; probesPath: string } {
  track(root, 'alpha-track', 'Alpha fixture track for the measurement');
  track(root, 'beta', 'Beta fixture track for the measurement');
  packet(root, 'specs/alpha-track/001-a', 'run the quartz lantern calibration now please');
  packet(root, 'specs/alpha-track/002-b', 'check the glowing crystal output again');
  packet(root, 'specs/beta/001-c', 'please run the ember harbor sweep today');
  packet(root, 'specs/beta/002-d', 'measure the tidal stone drift again');
  doc(root, 'specs/alpha-track/100-docs/spec.md', ['quartz lantern calibration']);
  doc(root, 'specs/beta/100-docs/spec.md', ['ember harbor sweep']);
  write(root, 'probes.json', JSON.stringify({
    paraphrase: {
      rows: [
        { caseId: 'c1', locale: 'latin', variant: 'exact', query: 'quartz lantern calibration' },
        { caseId: 'c1', locale: 'latin', variant: 'paraphrase', query: 'tune the glowing crystal lamp' },
      ],
    },
  }));
  indexFor(root);
  return {
    indexPath: path.join(root, 'out', 'idx.json'),
    probesPath: path.join(root, 'probes.json'),
  };
}

function stubDir(bodies: Record<string, string>): string {
  const dir = tempDir('score-track-narrowing-stub-');
  for (const [name, body] of Object.entries(bodies)) {
    fs.writeFileSync(
      path.join(dir, name),
      `#!/bin/sh\nD=$(dirname "$0")\necho "$*" >> "$D/${name}.log"\n${body}\n`,
      { mode: 0o755 },
    );
  }
  return dir;
}

async function runMain(
  argv: string[],
  deps: {
    repoRoot: string;
    indexPath: string;
    probesPath: string;
    hubNames?: string[];
    env?: NodeJS.ProcessEnv;
  },
): Promise<{ code: number; lines: string[]; errs: string[] }> {
  const lines: string[] = [];
  const errs: string[] = [];
  const code = await main(argv, {
    ...deps,
    env: { ...(deps.env ?? process.env), JEV_TRANSPORT: 'jev' },
    out: (line: string) => { lines.push(line); },
    err: (line: string) => { errs.push(line); },
  });
  return { code, lines, errs };
}

function listFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(abs));
    else if (entry.isFile()) files.push(abs);
  }
  return files.sort();
}

// ───────────────────────────────────────────────────────────────────
// 3. TEST SET
// ───────────────────────────────────────────────────────────────────

describe('score-track-narrowing test set', () => {
  it('keeps at most 20 rows per track, first by SHA-256 of the folder path', () => {
    const root = tempDir('score-track-narrowing-');
    track(root, 'alpha-track', 'Owned sample questions live at this root');
    track(root, 'beta', 'Owned sample questions live at this root');

    const folders: string[] = [];
    for (let number = 1; number <= 22; number += 1) {
      const nn = String(number).padStart(2, '0');
      const folder = `specs/alpha-track/0${nn}-p`;
      folders.push(folder);
      packet(root, folder, `quartz lantern sample number ${nn} here`);
    }
    packet(root, 'specs/beta/001-x', 'ember harbor lamp stone river');

    const set = buildTestSet(root, { hubNames: [] });
    const expectedIds = folders
      .slice()
      .sort((left, right) => {
        const leftDigest = sha256(left);
        const rightDigest = sha256(right);
        if (leftDigest < rightDigest) return -1;
        if (leftDigest > rightDigest) return 1;
        return 0;
      })
      .slice(0, 20);

    expect(set.counts['alpha-track']).toEqual({
      kept: 20,
      usable: 22,
      placeholder: 0,
      leak: 0,
      residual: 0,
    });
    const alphaIds = set.rows
      .filter((row) => row.track === 'alpha-track')
      .map((row) => row.id);
    expect(alphaIds).toEqual(expectedIds);
    expect(set.rows).toHaveLength(21);
    expect(testSetLines(set)[0]).toBe(
      'test set: tracks=2 kept=21 usable=23 placeholder=0 leak=0 residual=0',
    );
  });

  it('drops a description that names a track or a hub and counts it', () => {
    const root = tempDir('score-track-narrowing-');
    track(root, 'alpha-track', 'Owned sample questions live at this root');
    track(root, 'beta', 'Owned sample questions live at this root');
    packet(root, 'specs/beta/001-a', 'this one fixes the alpha track loader cache');
    packet(root, 'specs/beta/002-b', 'moves the demo hub router into place');
    packet(root, 'specs/beta/003-c', 'beta lantern quartz ember harbor stone');

    const set = buildTestSet(root, { hubNames: ['demo-hub'] });
    expect(set.counts.beta).toEqual({
      kept: 1,
      usable: 1,
      placeholder: 0,
      leak: 2,
      residual: 1,
    });
  });

  it('counts placeholders by each rule', () => {
    expect(classifyDescription('', 'x', [])).toBe('placeholder');
    expect(classifyDescription('[TODO] fill this in later', 'x', [])).toBe('placeholder');
    expect(classifyDescription('Phase 3: build the thing now', 'x', [])).toBe('placeholder');
    expect(classifyDescription(
      'Placeholder description equals folder build',
      '017-placeholder-description-equals-folder-build',
      [],
    )).toBe('placeholder');
    expect(classifyDescription('four tokens only here', 'x', [])).toBe('placeholder');
    expect(classifyDescription('five clean tokens are here', 'x', [])).toBe('kept');

    const root = tempDir('score-track-narrowing-');
    track(root, 'beta', 'Owned sample questions live at this root');
    packet(root, 'specs/beta/001-x', 'ember harbor lamp stone river');
    packet(root, 'specs/beta/001-x/scratch/sub', 'clean quartz lantern sample here');

    const set = buildTestSet(root, { hubNames: [] });
    expect(set.counts.beta.usable).toBe(1);
  });
});

// ───────────────────────────────────────────────────────────────────
// 4. LOOKUP BASELINE
// ───────────────────────────────────────────────────────────────────

describe('score-track-narrowing lookup baseline', () => {
  function loadedIndex() {
    const root = tempDir('score-track-narrowing-');
    track(root, 'alpha-track', 'Owned sample questions live at this root');
    track(root, 'beta', 'Owned sample questions live at this root');
    doc(root, 'specs/alpha-track/001-a/spec.md', ['quartz lantern calibration']);
    doc(root, 'specs/beta/002-c/spec.md', ['quartz lantern']);
    doc(root, 'specs/beta/003-d/spec.md', ['ember harbor sweep']);
    return indexFor(root);
  }

  it('picks the track of the first scoring specs row', () => {
    const loaded = loadedIndex();
    expect(lookupPick(loaded, 'run the quartz lantern calibration now please', null)).toBe('alpha-track');
    expect(lookupPick(loaded, 'please run the ember harbor sweep today', null)).toBe('beta');
    expect(lookupPick(loaded, 'nothing here matches any phrase at all', null)).toBeNull();
    expect(trackOf('specs/x/a.md')).toBe('x');
    expect(trackOf('specs/readme.md')).toBeNull();
    expect(trackOf('.skilled/skills/a.md')).toBeNull();
  });

  it('ignores every row inside the question\'s own folder', () => {
    const loaded = loadedIndex();
    expect(lookupPick(
      loaded,
      'run the quartz lantern calibration now please',
      'specs/alpha-track/001-a',
    )).toBe('beta');
    expect(isInsideFolder('specs/a/b/c.md', 'specs/a/b')).toBe(true);
    expect(isInsideFolder('specs/a/bc/d.md', 'specs/a/b')).toBe(false);
  });
});

// ───────────────────────────────────────────────────────────────────
// 5. RIPGREP BASELINE
// ───────────────────────────────────────────────────────────────────

describe('score-track-narrowing ripgrep baseline', () => {
  it('picks the track of the file matching the most distinct tokens', () => {
    const root = tempDir('score-track-narrowing-');
    track(root, 'alpha-track', 'Owned sample questions live at this root');
    track(root, 'beta', 'Owned sample questions live at this root');
    track(root, 'gamma', 'Owned sample questions live at this root');
    write(root, 'specs/alpha-track/001-a/spec.md', 'quartz lantern ember');
    write(root, 'specs/beta/002-b/spec.md', 'quartz lantern');
    write(root, 'specs/beta/003-c/notes.md', 'quartz');
    write(root, 'specs/gamma/004-d/spec.md', 'ember');

    const context = { repoRoot: root, cache: new Map<string, string[]>() };
    expect(ripgrepPick('quartz lantern ember', null, context)).toBe('alpha-track');
    expect(ripgrepPick('quartz lantern ember', 'specs/alpha-track/001-a', context)).toBe('beta');
    expect([...context.cache.keys()]).toEqual(['quartz', 'lantern', 'ember']);
    expect([...(context.cache.get('ember') ?? [])].sort()).toEqual([
      'specs/alpha-track/001-a/spec.md',
      'specs/gamma/004-d/spec.md',
    ]);
    expect(ripgrepTokens('an ox quartz quartz Lantern')).toEqual(['quartz', 'lantern']);
  });

  it('breaks a tie by file count, then by track name, and abstains on no match', () => {
    const root = tempDir('score-track-narrowing-');
    track(root, 'alpha-track', 'Owned sample questions live at this root');
    track(root, 'beta', 'Owned sample questions live at this root');
    track(root, 'gamma', 'Owned sample questions live at this root');
    write(root, 'specs/beta/010-x/a.md', 'harbor');
    write(root, 'specs/gamma/011-y/a.md', 'harbor');
    write(root, 'specs/gamma/012-z/a.md', 'stone');
    write(root, 'specs/gamma/013-w/a.md', 'willow');
    write(root, 'specs/beta/014-w/a.md', 'willow');

    const context = { repoRoot: root, cache: new Map<string, string[]>() };
    expect(ripgrepPick('harbor stone', null, context)).toBe('gamma');
    expect(ripgrepPick('willow', null, context)).toBe('beta');
    expect(ripgrepPick('zzqxv wwkqz', null, context)).toBeNull();
  });
});

// ───────────────────────────────────────────────────────────────────
// 6. OPTIONS AND SUMMARY
// ───────────────────────────────────────────────────────────────────

describe('score-track-narrowing options and summary', () => {
  it('builds the option set with none last and rotates it left', () => {
    const o = buildOptions([
      { track: 'a', description: 'A' },
      { track: 'b', description: 'B' },
    ]);
    expect(o.pairs).toEqual([
      ['a', 'A'],
      ['b', 'B'],
      [NONE_KEY, NONE_DESCRIPTION],
    ]);
    expect(o.pairs[2]).toEqual(['none', 'None of these tracks']);
    expect(o.keys).toEqual(['a', 'b', 'none']);
    expect(o.sha256).toBe(createHash('sha256').update(JSON.stringify(o.pairs)).digest('hex'));
    expect(o.sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(rotateOptions(o.pairs, 1)).toEqual([
      ['b', 'B'],
      ['none', 'None of these tracks'],
      ['a', 'A'],
    ]);
    expect(rotateOptions(o.pairs, 2)).toEqual([
      ['none', 'None of these tracks'],
      ['a', 'A'],
      ['b', 'B'],
    ]);
    expect(ruleLines(o)[0]).toBe('margin: 0.10');
    expect(ruleLines(o)[0]).toBe(MARGIN_LINE);
    expect(ruleLines(o)[1]).toBe(KEEP_RULE_LINE);
    expect(ruleLines(o)[2]).toBe('instruction: -q "Which spec track is this text about?"');
    expect(ruleLines(o)[2]).toBe(`instruction: -q "${CHOICE_INSTRUCTION}"`);
    expect(ORDERS).toBe(3);
  });

  it('scores both baselines on the same rows, lets the lookup win a tie and flags no headroom above 0.90', () => {
    const rows = [
      { track: 'a' },
      { track: 'a' },
      { track: 'b' },
      { track: 'b' },
    ];
    const picks = [
      { lookup: 'a', ripgrep: 'b' },
      { lookup: null, ripgrep: 'a' },
      { lookup: 'b', ripgrep: 'b' },
      { lookup: 'a', ripgrep: null },
    ];
    const s = summarizeBaselines(rows, picks);
    expect(s).toEqual({
      K: 4,
      lookupRight: 2,
      ripgrepRight: 2,
      method: 'lookup',
      right: 2,
      headroom: true,
    });
    expect(baselineLines(s)).toEqual([
      'baseline lookup: 2/4 right (0.5000)',
      'baseline ripgrep: 2/4 right (0.5000)',
      'baseline method: lookup 2/4 right',
    ]);
    expect(headroomLines(s, 1)).toEqual([
      'headroom: a 10-point gain fits above 2/4',
      'planned calls: 15 per arm, 4 rows and 1 probes in 3 orders each',
    ]);

    const tenRows = Array.from({ length: 10 }, () => ({ track: 'a' }));
    const tenPicks = Array.from({ length: 10 }, () => ({
      lookup: null,
      ripgrep: 'a' as string | null,
    }));
    const full = summarizeBaselines(tenRows, tenPicks);
    expect(full.method).toBe('ripgrep');
    expect(full.right).toBe(10);
    expect(full.headroom).toBe(false);
    expect(headroomLines(full, 0)).toEqual([
      'no headroom: the baseline method is right on 10/10, above 0.90',
    ]);

    const ninePicks = tenPicks.slice();
    ninePicks[9] = { lookup: null, ripgrep: null };
    expect(summarizeBaselines(tenRows, ninePicks).headroom).toBe(true);
  });
});

// ───────────────────────────────────────────────────────────────────
// 7. PARAPHRASE PROBES
// ───────────────────────────────────────────────────────────────────

describe('score-track-narrowing paraphrase probes', () => {
  it('derives gold from the exact query and counts hits only inside it', () => {
    const root = tempDir('score-track-narrowing-');
    const file = path.join(root, 'probes.json');
    write(root, 'probes.json', JSON.stringify({
      paraphrase: {
        rows: [
          { caseId: 'c1', locale: 'latin', variant: 'exact', query: 'quartz lantern calibration' },
          { caseId: 'c1', locale: 'latin', variant: 'paraphrase', query: 'tune the glowing crystal lamp' },
          { caseId: 'c1', locale: 'latin', variant: 'distractor', query: 'open the billing page' },
          { caseId: 'c1', locale: 'cjk', variant: 'paraphrase', query: 'cjk text' },
          { caseId: 'c2', locale: 'latin', variant: 'exact', query: 'no phrase matches this text' },
          { caseId: 'c2', locale: 'latin', variant: 'paraphrase', query: 'something else entirely here' },
        ],
      },
    }));
    track(root, 'alpha-track', 'Owned sample questions live at this root');
    track(root, 'beta', 'Owned sample questions live at this root');
    doc(root, 'specs/alpha-track/001-a/spec.md', ['quartz lantern calibration']);
    doc(root, 'specs/beta/002-c/spec.md', ['quartz lantern']);
    const loaded = indexFor(root);

    expect(loadProbes(file)).toEqual([
      {
        id: 'probe:c1',
        caseId: 'c1',
        question: 'tune the glowing crystal lamp',
        exactQuery: 'quartz lantern calibration',
      },
      {
        id: 'probe:c2',
        caseId: 'c2',
        question: 'something else entirely here',
        exactQuery: 'no phrase matches this text',
      },
    ]);

    const withGold = probeGold(loaded, loadProbes(file));
    expect(withGold[0].gold).toEqual(['alpha-track', 'beta']);
    expect(withGold[1].gold).toEqual([]);
    expect(probeHits(withGold, new Map([
      ['probe:c1', 'beta'],
      ['probe:c2', 'alpha-track'],
    ]))).toBe(1);
    expect(probeHits(withGold, new Map([['probe:c1', null]]))).toBe(0);
    expect(probeLine(withGold, [['lookup', 0], ['ripgrep', 1], ['jev', 1]])).toBe(
      'paraphrase probes: total=2 gold-less=1 lookup=0/1 ripgrep=1/1 jev=1/1',
    );

    const shipped = loadProbes(DEFAULT_PROBES_PATH);
    expect(shipped).toHaveLength(20);
    for (const entry of shipped) {
      expect(typeof entry.exactQuery).toBe('string');
    }
  });
});

// ───────────────────────────────────────────────────────────────────
// 8. VERDICT
// ───────────────────────────────────────────────────────────────────

describe('score-track-narrowing verdict', () => {
  function col(
    tracks: string[],
    answers: Array<Array<string | null> | undefined>,
    baseline: Array<string | null>,
    picks?: Array<{ lookup: string | null, ripgrep: string | null }>,
  ) {
    const rows = tracks.map((track, index) => ({ id: `r${index}`, track }));
    const records = new Map<string, Array<string | null>>();
    answers.forEach((entry, index) => {
      if (entry !== undefined) records.set(`r${index}`, entry);
    });
    const baselinePicks = new Map<string, string | null>(
      baseline.map((pick, index): [string, string | null] => [`r${index}`, pick]),
    );
    const rowPicks = picks === undefined ? undefined : new Map(
      picks.map((pick, index): [string, { lookup: string | null, ripgrep: string | null }] => [`r${index}`, pick]),
    );
    return summarizeColumn('jev', rows, records, baselinePicks, 'model=stub-model', rowPicks);
  }

  it('prints keep on stub answers that clear all four conditions', () => {
    const summary = col(
      ['a', 'a', 'a', 'a', 'a', 'a'],
      Array.from({ length: 6 }, () => ['a', 'a', 'a']),
      ['b', 'b', 'b', 'b', 'b', 'b'],
    );
    expect(summary.K).toBe(6);
    expect(summary.M).toBe(6);
    expect(summary.A).toBe(6);
    expect(summary.B).toBe(0);
    expect(summary.W).toBe(6);
    expect(summary.L).toBe(0);
    expect(summary.F).toBe(0);
    expect(summary.outcome).toBe('keep');
    expect(summary.p).toBe(0.015625);
    expect(summary.line).toBe(
      'verdict jev: keep K=6 M=6 A=6 B=0 W=6 L=0 F=0 p=0.01563 model=stub-model',
    );
  });

  it('prints stop (margin) on a gain under ten points', () => {
    const summary = col(
      Array.from({ length: 20 }, () => 'a'),
      [
        ...Array.from({ length: 11 }, () => ['a', 'a', 'a']),
        ...Array.from({ length: 9 }, () => ['b', 'b', 'b']),
      ],
      [
        ...Array.from({ length: 10 }, () => 'a'),
        ...Array.from({ length: 10 }, () => 'b'),
      ],
    );
    expect(summary.A).toBe(11);
    expect(summary.B).toBe(10);
    expect(summary.W).toBe(1);
    expect(summary.L).toBe(0);
    expect(summary.reason).toBe('margin');
    expect(summary.line.startsWith(
      'verdict jev: stop (margin) K=20 M=20 A=11 B=10 W=1 L=0 F=0 p=',
    )).toBe(true);
  });

  it('prints stop (coverage) with 2 of 10 kept rows unmeasured and every measured pick right', () => {
    const summary = col(
      Array.from({ length: 10 }, () => 'a'),
      [
        ...Array.from({ length: 8 }, () => ['a', 'a', 'a']),
        ['a', null, 'a'],
        undefined,
      ],
      Array.from({ length: 10 }, () => null),
    );
    expect(summary.M).toBe(8);
    expect(summary.unmeasured).toBe(2);
    expect(summary.A).toBe(8);
    expect(summary.reason).toBe('coverage');
    expect(summary.line.startsWith('verdict jev: stop (coverage) K=10 M=8')).toBe(true);
  });

  it('stops on the sign test and on flips, and counts unstable and none as wrong', () => {
    const thin = col(
      ['a', 'a', 'a', 'a'],
      Array.from({ length: 4 }, () => ['a', 'a', 'a']),
      [null, null, null, null],
    );
    expect(thin.reason).toBe('sign test');
    expect(thin.p).toBe(0.0625);

    const flipHeavy = col(
      Array.from({ length: 25 }, () => 'a'),
      [
        ...Array.from({ length: 20 }, () => ['a', 'a', 'a']),
        ...Array.from({ length: 5 }, () => ['a', 'b', 'c']),
      ],
      Array.from({ length: 25 }, () => null),
    );
    expect(flipHeavy.unstable).toBe(5);
    expect(flipHeavy.F).toBe(10);
    expect(flipHeavy.A).toBe(20);
    expect(flipHeavy.reason).toBe('flips');

    const noneHeavy = col(['a'], [['none', 'none', 'a']], [null]);
    expect(noneHeavy.abstained).toBe(1);
    expect(noneHeavy.A).toBe(0);

    expect(signTestP(0, 0)).toEqual({ p: 1, below: false });
    expect(signTestP(5, 0)).toEqual({ p: 0.03125, below: true });
    expect(modalPick(['a', 'b', 'c'])).toEqual({ pick: null, top: 1 });
    expect(modalPick(['a', 'a', 'b'])).toEqual({ pick: 'a', top: 2 });
  });

  it('kills a six-loss tail and spares a four-loss tail', () => {
    const killed = decideVerdict({ K: 6, M: 6, A: 0, B: 6, W: 0, L: 6, F: 0 });
    expect(killed).toEqual({ outcome: 'kill', reason: null, p: 1 });

    // The four-loss tail is 0.0625, above the five-percent guard, so margin decides.
    const spared = decideVerdict({ K: 4, M: 4, A: 0, B: 4, W: 0, L: 4, F: 0 });
    expect(spared.outcome).toBe('stop');
    expect(spared.reason).toBe('margin');
  });

  it('stops on the strongest policy, on the class floor, and on the stronger of the two', () => {
    const counts = { K: 20, M: 20, A: 15, B: 5, W: 10, L: 1, F: 0 };
    const strongestPass = { pass: true, name: 'lookup', right: 14 };
    const strongestFail = { pass: false, name: 'lookup', right: 15 };
    const floorPass = { pass: true, classes: [], failing: [] };
    const floorFail = { pass: false, classes: [], failing: ['beta'] };

    const strongestStop = decideVerdict({ ...counts, strongest: strongestFail, floor: floorPass });
    expect(strongestStop.outcome).toBe('stop');
    expect(strongestStop.reason).toBe('strongest policy');

    const floorStop = decideVerdict({ ...counts, strongest: strongestPass, floor: floorFail });
    expect(floorStop.outcome).toBe('stop');
    expect(floorStop.reason).toBe('class floor');

    const bothFail = decideVerdict({ ...counts, strongest: strongestFail, floor: floorFail });
    expect(bothFail.reason).toBe('strongest policy');

    const kept = decideVerdict({ ...counts, strongest: strongestPass, floor: floorPass });
    expect(kept.outcome).toBe('keep');
    expect(kept.reason).toBeNull();
  });

  it('reports nearest-rank latency and the column line', () => {
    expect(nearestRank([10, 30, 20, 40], 0.5)).toBe(20);
    expect(nearestRank([10, 20, 30, 40], 0.95)).toBe(40);
    expect(nearestRank([], 0.5)).toBeNull();

    const summary = col(
      ['a', 'a', 'a', 'a', 'a', 'a'],
      Array.from({ length: 6 }, () => ['a', 'a', 'a']),
      ['b', 'b', 'b', 'b', 'b', 'b'],
    );
    expect(columnLine(summary, { p50: 12, p95: null })).toBe(
      'column jev: rows=6 measured=6 unmeasured=0 unstable=0 abstained=0 '
      + 'flip_rate=0.0000 latency_p50_ms=12 latency_p95_ms=none',
    );
  });

  it('counts the strongest policy on the measured rows of a column', () => {
    const tracks = [
      ...Array.from({ length: 10 }, () => 'a'),
      ...Array.from({ length: 10 }, () => 'b'),
      'a',
    ];
    const answers: Array<Array<string | null> | undefined> = [
      ...Array.from({ length: 20 }, (): string[] => ['a', 'a', 'a']),
      undefined,
    ];
    // The unmeasured row's own picks are right, so counting it would raise the
    // lookup bar to 21; only the 20 measured rows may set the bar.
    const picks: Array<{ lookup: string | null, ripgrep: string | null }> = [
      ...tracks.slice(0, 20).map((track) => ({ lookup: track, ripgrep: track })),
      { lookup: 'a', ripgrep: 'a' },
    ];
    const summary = col(tracks, answers, Array.from({ length: 21 }, () => null), picks);

    expect(summary.M).toBe(20);
    expect(summary.unmeasured).toBe(1);
    expect(summary.strongest).toEqual({ pass: false, name: 'lookup', right: 20 });
    expect(summary.reason).toBe('strongest policy');
    expect(summary.line.startsWith(
      'verdict jev: stop (strongest policy) K=21 M=20 A=10 B=0 W=10 L=0 F=0 p=',
    )).toBe(true);
  });

  it('stops on the strongest policy when the model ties the majority bar', () => {
    const tracks = [
      ...Array.from({ length: 12 }, () => 'a'),
      ...Array.from({ length: 8 }, () => 'b'),
    ];
    const picks = Array.from(
      { length: 20 },
      (): { lookup: string | null, ripgrep: string | null } => ({ lookup: null, ripgrep: null }),
    );
    const summary = col(
      tracks,
      Array.from({ length: 20 }, (): string[] => ['a', 'a', 'a']),
      Array.from({ length: 20 }, () => null),
      picks,
    );

    expect(summary.A).toBe(12);
    expect(summary.B).toBe(0);
    expect(summary.strongest).toEqual({ pass: false, name: 'majority', right: 12 });
    expect(summary.reason).toBe('strongest policy');
    expect(summary.line).toBe(
      'verdict jev: stop (strongest policy) K=20 M=20 A=12 B=0 W=12 L=0 F=0 p=0.0002441 model=stub-model',
    );
  });
});

describe('score-track-narrowing cluster bootstrap', () => {
  it('resamples whole tracks deterministically and handles an empty measured set', () => {
    const rows = [
      { id: 'a1', track: 'alpha' },
      { id: 'a2', track: 'alpha' },
      { id: 'b1', track: 'beta' },
      { id: 'b2', track: 'beta' },
      { id: 'g1', track: 'gamma' },
    ];
    const picks = new Map([
      ['a1', 'alpha'], ['a2', 'alpha'], ['b1', 'alpha'], ['b2', 'alpha'], ['g1', 'gamma'],
    ]);
    const baselinePicks = new Map([
      ['a1', 'beta'], ['a2', 'beta'], ['b1', 'beta'], ['b2', 'beta'], ['g1', 'gamma'],
    ]);

    const first = clusterBootstrapInterval(rows, picks, baselinePicks);
    const repeated = clusterBootstrapInterval(rows, picks, baselinePicks);
    const empty = clusterBootstrapInterval(rows, new Map(), baselinePicks);

    expect(first.clusterCount).toBe(3);
    expect(first.replicates).toBe(1000);
    expect(first.estimate).toBe(0);
    expect(first.lower).toBeLessThanOrEqual(first.upper ?? Infinity);
    expect(repeated).toEqual(first);
    expect(empty).toMatchObject({ clusterCount: 0, estimate: null, lower: null, upper: null });
  });
});

// ───────────────────────────────────────────────────────────────────
// 9. ENTRY POINT
// ───────────────────────────────────────────────────────────────────

describe('score-track-narrowing entry point', () => {
  it('default run prints the zero-call report, spawns no model binary and writes no file', async () => {
    const root = tempDir('score-track-narrowing-');
    const { indexPath, probesPath } = smallCorpus(root);
    const stubs = stubDir({ jev: 'exit 0' });
    const before = listFiles(root);

    const r = await runMain([], {
      repoRoot: root,
      indexPath,
      probesPath,
      hubNames: [],
      env: { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` },
    });

    expect(r.code).toBe(0);
    expect(r.lines[0]).toMatch(/^index manifestHash: [0-9a-f]{64}$/);
    expect(r.lines).toContain('test set: tracks=2 kept=4 usable=4 placeholder=0 leak=0 residual=0');
    expect(r.lines).toContain('baseline lookup: 2/4 right (0.5000)');
    expect(r.lines).toContain('baseline ripgrep: 2/4 right (0.5000)');
    expect(r.lines).toContain('baseline method: lookup 2/4 right');
    expect(r.lines).toContain('margin: 0.10');
    expect(r.lines).toContain(KEEP_RULE_LINE);
    expect(r.lines).toContain('planned calls: 15 per arm, 4 rows and 1 probes in 3 orders each');
    expect(r.lines.indexOf('margin: 0.10')).toBeLessThan(
      r.lines.indexOf('planned calls: 15 per arm, 4 rows and 1 probes in 3 orders each'),
    );
    expect(r.lines[r.lines.length - 1]).toBe(
      'paraphrase probes: total=1 gold-less=0 lookup=0/1 ripgrep=0/1',
    );
    expect(r.errs).toHaveLength(1);
    expect(r.errs[0].startsWith('wall time: ')).toBe(true);
    expect(listFiles(stubs).filter((file) => file.endsWith('.log'))).toEqual([]);
    expect(listFiles(root)).toEqual(before);
  });

  it('prints no headroom when the baseline is right on more than 90 percent', async () => {
    const root = tempDir('score-track-narrowing-');
    track(root, 'alpha-track', 'Alpha fixture track for the measurement');
    track(root, 'beta', 'Beta fixture track for the measurement');
    for (let number = 1; number <= 5; number += 1) {
      const nn = String(number).padStart(2, '0');
      packet(root, `specs/alpha-track/0${nn}-p`, 'please run the quartz lantern calibration today');
      packet(root, `specs/beta/0${nn}-q`, 'please run the ember harbor sweep today');
    }
    doc(root, 'specs/alpha-track/100-docs/spec.md', ['quartz lantern calibration']);
    doc(root, 'specs/beta/100-docs/spec.md', ['ember harbor sweep']);
    write(root, 'probes.json', JSON.stringify({ paraphrase: { rows: [] } }));
    indexFor(root);

    const r = await runMain([], {
      repoRoot: root,
      indexPath: path.join(root, 'out', 'idx.json'),
      probesPath: path.join(root, 'probes.json'),
      hubNames: [],
    });

    expect(r.code).toBe(0);
    expect(r.lines).toContain('no headroom: the baseline method is right on 10/10, above 0.90');
    expect(r.lines.some((line) => line.startsWith('planned calls:'))).toBe(false);
    expect(r.lines[r.lines.length - 1]).toBe(
      'paraphrase probes: total=0 gold-less=0 lookup=0/0 ripgrep=0/0',
    );
  });

  it('returns 2 on an unknown flag and on an unreadable probe file', async () => {
    const root = tempDir('score-track-narrowing-');
    const { indexPath, probesPath } = smallCorpus(root);
    const stubs = stubDir({ jev: 'exit 0' });
    const deps = {
      repoRoot: root,
      indexPath,
      probesPath,
      hubNames: [],
      env: { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` },
    };

    const badFlag = await runMain(['--bogus'], deps);
    expect(badFlag.code).toBe(2);

    const missing = await runMain([], { ...deps, probesPath: path.join(root, 'missing.json') });
    expect(missing.code).toBe(2);
    expect(missing.errs).toHaveLength(1);
  });
});

function keepCorpus(root: string, marker = ''): { indexPath: string; probesPath: string } {
  track(root, 'alpha-track', 'Alpha fixture track for the measurement');
  track(root, 'beta', 'Beta fixture track for the measurement');
  const words = ['one', 'two', 'three'];
  for (let number = 1; number <= 3; number += 1) {
    const nn = String(number).padStart(2, '0');
    const word = words[number - 1];
    const alpha = marker !== '' && number === 2
      ? `quartz lantern ${marker} two glows`
      : `quartz lantern number ${word} glows`;
    packet(root, `specs/alpha-track/0${nn}-a`, alpha);
    packet(root, `specs/beta/0${nn}-b`, `ember harbor number ${word} drifts`);
  }
  doc(root, 'specs/beta/100-docs/spec.md', ['unrelated phrase words']);
  write(root, 'probes.json', JSON.stringify({ paraphrase: { rows: [] } }));
  indexFor(root);
  return {
    indexPath: path.join(root, 'out', 'idx.json'),
    probesPath: path.join(root, 'probes.json'),
  };
}

function writeRecordedCalls(root: string): { path: string; records: Record<string, unknown>[] } {
  for (let number = 4; number <= 10; number += 1) {
    const nn = String(number).padStart(3, '0');
    packet(root, `specs/alpha-track/${nn}-extra`, `quartz lantern extra sample ${number} glows`);
    packet(root, `specs/beta/${nn}-extra`, `ember harbor extra sample ${number} drifts`);
  }
  const rows = buildTestSet(root, { hubNames: [] }).rows;
  const records: Record<string, unknown>[] = [{
    backend: 'jev',
    kind: 'auth_test',
    rowId: null,
    order: null,
    attempt: 1,
    wallMs: 20,
    exitCode: 0,
    pick: null,
    pickProb: null,
    noneProb: null,
    status: 'measured',
    jevVersion: 'jev 0.6.2',
    provider: 'official',
    model: 'replay-model',
  }];
  const alphaFirst = rows.find((row) => row.track === 'alpha-track' && row.question.includes('number one'));
  const betaFirst = rows.find((row) => row.track === 'beta' && row.question.includes('number one'));

  for (const row of rows) {
    for (let order = 0; order < ORDERS; order += 1) {
      let pick = row.track;
      let pickProb = 0.8;
      let noneProb = 0.05;
      if (row.id === alphaFirst?.id) {
        const choices = ['beta', 'beta', 'alpha-track'];
        const confidences = [0.4, 0.4, 0.85];
        pick = choices[order];
        pickProb = confidences[order];
        noneProb = [0.1, 0.1, 0.05][order];
      } else if (row.id === betaFirst?.id) {
        const choices = [NONE_KEY, NONE_KEY, 'beta'];
        const confidences = [0.6, 0.6, 0.45];
        pick = choices[order];
        pickProb = confidences[order];
        noneProb = [0.6, 0.6, 0.2][order];
      }
      records.push({
        backend: 'jev',
        kind: 'test',
        rowId: row.id,
        order,
        attempt: 1,
        wallMs: 30 + order,
        exitCode: 0,
        pick,
        pickProb,
        noneProb,
        status: 'measured',
        jevVersion: 'jev 0.6.2',
        provider: 'official',
        model: 'replay-model',
      });
    }
  }
  const filePath = path.join(root, 'calls.jsonl');
  fs.writeFileSync(filePath, `${records.map((record) => JSON.stringify(record)).join('\n')}\n`);
  write(root, 'report.json', JSON.stringify({ testSet: { K: rows.length } }));
  return { path: filePath, records };
}

function fakePiBin(): string {
  const root = tempDir('fakepi-');
  fs.mkdirSync(path.join(root, 'bin'));
  fs.mkdirSync(path.join(root, 'dist'));
  fs.writeFileSync(path.join(root, 'bin', 'pi'), '#!/bin/sh\nexit 0\n', { mode: 0o755 });
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ name: '@earendil-works/pi-coding-agent', version: '0.99.2', type: 'module' }));
  fs.writeFileSync(path.join(root, 'dist', 'index.js'), `
export class ModelRuntime {
  static create() {
    return {
      getModelOfType: (type, provider, id) => ({ type, provider, id }),
      getAvailableOfType: async () => [{ id: 'jev-latest' }, { id: 'typesafe/jev-1.13' }],
      classify: async (model, context) => {
        const text = String(Object.values(context.state)[0] ?? '');
        const keys = Object.keys(context.questions.answer.criteria);
        const choice = text.includes('quartz') ? 'alpha-track' : text.includes('ember') ? 'beta' : 'none';
        const probabilities = Object.fromEntries(keys.map((key) => [key, key === choice ? 0.8 : 0.05]));
        return { api: 'typesafe-system-one', provider: model.provider, model: model.id,
          answers: { answer: { type: 'choice', choice, probabilities, confidence: 0.9 } }, stopReason: 'stop', timestamp: 0,
          usage: { input: 100, output: 10, cacheRead: 0, cacheWrite: 0, totalTokens: 110, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } } };
      },
    };
  }
}
`);
  return path.join(root, 'bin');
}

describe('score-track-narrowing recorded replay', () => {
  it('pins the run and reports measured arms without invoking Jev', async () => {
    const root = tempDir('score-track-narrowing-');
    const { indexPath, probesPath } = keepCorpus(root);
    const recorded = writeRecordedCalls(root);
    const out = tempDir('stn-replay-out-');
    const deps = {
      repoRoot: root,
      indexPath,
      probesPath,
      hubNames: [],
      env: { ...process.env, PATH: '/no-executable' },
    };

    const run = await runMain(['--replay', recorded.path, '--out', out], deps);
    const reportText = fs.readFileSync(path.join(out, 'report.json'), 'utf8');
    const report = JSON.parse(reportText);

    expect(run.code).toBe(0);
    expect(run.lines).toContain(
      'verdict jev: keep K=20 M=20 A=18 B=0 W=18 L=0 F=2 p=0.000003815 jev_version=0.6.2 provider=official model=replay-model',
    );
    expect(run.lines).toContain(
      'verdict probability-aware: keep K=20 M=20 A=19 B=0 W=19 L=0 F=2 p=0.000001907',
    );
    expect(run.lines).toContain('decided-subset probability-aware: 19/19 accuracy=1.0000');
    expect(run.lines).toContain('margin slack probability-aware: 17.0 rows');
    expect(run.lines).toContain(
      'verdict one-call: keep K=20 M=20 A=18 B=0 W=18 L=0 F=0 p=0.000003815',
    );
    expect(run.lines).toContain(
      'shortlist arm: candidates=2 calls_per_row=1 accuracy=not-measured reason=the replay contains no responses to a five-track option list',
    );
    expect(run.lines).toContain(
      'per-track jev: gold=beta rows=10 measured=10 correct=9 wrong=0 abstained=1 confusion={"beta":9,"none":1}',
    );
    expect(run.lines.some((line) => line.startsWith('bootstrap probability-aware vs baseline: accuracy_delta_95_ci=['))).toBe(true);
    expect(report.dataPin.rowCount).toBe(20);
    expect(report.dataPin.optionSetSha256).toBe(report.optionSetSha256);
    expect(report.dataPin.rowSetSha256).toMatch(/^[0-9a-f]{64}$/);
    expect(report.dataPin.rows).toHaveLength(20);
    expect(report.dataPin.rows.every((row: { questionSha256: string }) => /^[0-9a-f]{64}$/.test(row.questionSha256))).toBe(true);
    expect(report.modelTuple).toEqual({
      jevVersion: 'jev 0.6.2',
      provider: 'official',
      model: 'replay-model',
    });
    expect(report.analysis.shortlist.candidateTracks).toBe(Math.min(SHORTLIST_SIZE, 2));
    expect(fs.readFileSync(path.join(out, 'calls.jsonl'), 'utf8'))
      .toBe(fs.readFileSync(recorded.path, 'utf8'));

    const reportBefore = fs.readFileSync(path.join(out, 'report.json'), 'utf8');
    const callsBefore = fs.readFileSync(path.join(out, 'calls.jsonl'), 'utf8');
    const second = await runMain(['--replay', recorded.path, '--out', out], deps);
    const missing = await runMain(['--replay', path.join(root, 'missing.jsonl')], deps);
    write(root, 'report.json', JSON.stringify({ testSet: { K: 21 } }));
    const inconsistent = await runMain(['--replay', recorded.path], deps);

    expect(second.code).toBe(2);
    expect(second.errs).toEqual(['--out directory already holds a run']);
    expect(fs.readFileSync(path.join(out, 'report.json'), 'utf8')).toBe(reportBefore);
    expect(fs.readFileSync(path.join(out, 'calls.jsonl'), 'utf8')).toBe(callsBefore);
    expect(missing.code).toBe(2);
    expect(inconsistent.code).toBe(2);
    expect(inconsistent.errs).toEqual([
      'sibling report records 21 rows but the call log identifies 20',
    ]);
  });

  it('scores the recorded row set when the corpus grows and reports rows that no longer match', async () => {
    const root = tempDir('score-track-narrowing-');
    const { indexPath, probesPath } = keepCorpus(root);
    const recorded = writeRecordedCalls(root);
    const recordedTestSet = buildTestSet(root, { hubNames: [] });
    const recordedOptions = buildOptions(recordedTestSet.tracks);
    write(root, 'report.json', JSON.stringify({
      dataPin: pinRowSet(recordedTestSet, recordedOptions),
    }));
    const recordedK = recordedTestSet.rows.length;
    const recordedM = new Set(recorded.records
      .filter((record) => record.backend === 'jev' && record.kind === 'test' && record.status === 'measured')
      .map((record) => record.rowId)).size;
    for (let number = 11; number <= 22; number += 1) {
      const folder = String(number).padStart(3, '0');
      packet(root, `specs/alpha-track/${folder}-extra`, `quartz lantern unrecorded sample ${number} glows`);
      packet(root, `specs/beta/${folder}-extra`, `ember harbor unrecorded sample ${number} drifts`);
    }
    const liveTestSet = buildTestSet(root, { hubNames: [] });
    expect(liveTestSet.counts['alpha-track'].usable).toBe(22);
    expect(liveTestSet.counts.beta.usable).toBe(22);
    const deps = {
      repoRoot: root,
      indexPath,
      probesPath,
      hubNames: [],
      env: { ...process.env, PATH: '/no-executable' },
    };

    const replay = await runMain(['--replay', recorded.path], deps);
    const verdict = replay.lines.find((line) => line.startsWith('verdict jev:'));

    expect(replay.code).toBe(0);
    expect(verdict).toContain(`K=${recordedK} M=${recordedM}`);

    const changedRow = recordedTestSet.rows[0];
    expect(changedRow).toBeDefined();
    if (!changedRow) throw new Error('recorded fixture must contain a row');
    packet(root, changedRow.folder, 'replacement quiet harbor calibrates drifting night signals');
    const out = tempDir('stn-replay-drop-out-');
    const changedReplay = await runMain(['--replay', recorded.path, '--out', out], deps);
    const changedReport = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));

    expect(changedReplay.code).toBe(0);
    expect(changedReplay.lines.some((line) => line.includes(`replay row dropped: ${changedRow.id}`))).toBe(true);
    expect(changedReport.replay.droppedRows).toEqual([
      { id: changedRow.id, reason: 'question changed' },
    ]);
    expect(changedReport.testSet.K).toBe(recordedK - 1);
    expect(changedReport.columns.jev.M).toBe(recordedM - 1);
  });

  it('replays a log whose auth record and judgment records name different models', async () => {
    const root = tempDir('score-track-narrowing-replay-mixed-');
    const { indexPath, probesPath } = keepCorpus(root);
    const recorded = writeRecordedCalls(root);
    const mixedPath = path.join(root, 'calls-mixed.jsonl');
    fs.writeFileSync(mixedPath, `${recorded.records.map((record) => (
      JSON.stringify(record.kind === 'test' ? { ...record, model: 'typesafe/jev-latest' } : record)
    )).join('\n')}\n`);
    const deps = {
      repoRoot: root,
      indexPath,
      probesPath,
      hubNames: [],
      env: { ...process.env, PATH: '/no-executable' },
    };

    const run = await runMain(['--replay', mixedPath], deps);

    expect(run.code).toBe(0);
    const verdictLine = run.lines.find((line) => line.startsWith('verdict jev:'));
    expect(verdictLine ?? '').toMatch(/provider=official model=typesafe\/jev-latest$/);
  });

  it('stops at the class floor when the model wins overall but loses one track', async () => {
    const root = tempDir('score-track-narrowing-floor-');
    track(root, 'alpha-track', 'Alpha fixture track for the measurement');
    track(root, 'beta', 'Beta fixture track for the measurement');
    for (let number = 1; number <= 10; number += 1) {
      const nn = String(number).padStart(2, '0');
      packet(root, `specs/alpha-track/${nn}-a`, `quartz lantern sample number ${number} glows`);
      packet(root, `specs/beta/${nn}-b`, `ember harbor sample number ${number} drifts`);
    }
    doc(root, 'specs/beta/100-docs/spec.md', ['ember harbor sweep']);
    write(root, 'probes.json', JSON.stringify({ paraphrase: { rows: [] } }));
    indexFor(root);

    const rows = buildTestSet(root, { hubNames: [] }).rows;
    const lostBeta = rows.find((row) => row.track === 'beta');
    if (!lostBeta) throw new Error('floor fixture must hold a beta row');
    const records: Record<string, unknown>[] = [];
    for (const row of rows) {
      for (let order = 0; order < ORDERS; order += 1) {
        records.push({
          backend: 'jev',
          kind: 'test',
          rowId: row.id,
          order,
          attempt: 1,
          wallMs: 10,
          exitCode: 0,
          pick: row.id === lostBeta.id ? 'alpha-track' : row.track,
          pickProb: 0.8,
          noneProb: 0.05,
          status: 'measured',
          jevVersion: 'jev 0.6.2',
          provider: 'official',
          model: 'floor-model',
        });
      }
    }
    const callsPath = path.join(root, 'calls.jsonl');
    fs.writeFileSync(callsPath, `${records.map((record) => JSON.stringify(record)).join('\n')}\n`);

    const run = await runMain(['--replay', callsPath], {
      repoRoot: root,
      indexPath: path.join(root, 'out', 'idx.json'),
      probesPath: path.join(root, 'probes.json'),
      hubNames: [],
      env: { ...process.env, PATH: '/no-executable' },
    });

    expect(run.code).toBe(0);
    expect(run.lines).toContain(
      'verdict jev: stop (class floor) K=20 M=20 A=19 B=10 W=10 L=1 F=0 p=0.005859 jev_version=0.6.2 provider=official model=floor-model',
    );
    expect(run.lines).toContain('class floor jev beta: n=10 jev=9 baseline=10');
    expect(run.lines).toContain('class floor jev: failing=beta');
    expect(run.lines).toContain('strongest policy jev: policy=majority right=10 jev=19 pass=yes');
    expect(run.lines.some((line) => line.startsWith('power jev: pairs=11 win_rate=0.9091'))).toBe(true);
  });
});

// ───────────────────────────────────────────────────────────────────
// 10. JEV GATE
// ───────────────────────────────────────────────────────────────────

describe('score-track-narrowing jev gate', () => {
  it('prints the jev path and provider official first, then skips with no credential', async () => {
    const root = tempDir('score-track-narrowing-');
    const { indexPath, probesPath } = smallCorpus(root);
    const stubs = stubDir({ jev: `case "$1" in --version) echo 'jev 0.6.2';; auth) exit 3;; esac` });
    const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
    delete env.JEV_PROVIDER;
    const deps = { repoRoot: root, indexPath, probesPath, hubNames: [], env };
    const out = tempDir('stn-out-');

    const base = await runMain([], deps);
    const run = await runMain(['--jev', '--out', out], deps);
    const logs = fs.readFileSync(path.join(stubs, 'jev.log'), 'utf8').split('\n').filter(Boolean);

    expect(run.code).toBe(0);
    expect(run.lines.filter((line) => !base.lines.includes(line))).toEqual([
      `jev: path=${path.join(stubs, 'jev')} provider=official`,
      'jev arm skipped: no credential',
    ]);
    expect(logs).toEqual(['--version', 'auth status --provider official']);
    const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
    expect(report.skipped.jev).toBe('jev arm skipped: no credential');
  });

  it('skips a jev that is missing or reports another version', async () => {
    const root = tempDir('score-track-narrowing-');
    const { indexPath, probesPath } = smallCorpus(root);

    const bareEnv: NodeJS.ProcessEnv = { ...process.env, PATH: '/usr/bin:/bin' };
    delete bareEnv.JEV_PROVIDER;
    const bareDeps = { repoRoot: root, indexPath, probesPath, hubNames: [], env: bareEnv };
    const bareBase = await runMain([], bareDeps);
    const missing = await runMain(['--jev', '--out', tempDir('stn-out-')], bareDeps);

    expect(missing.code).toBe(0);
    expect(missing.lines.filter((line) => !bareBase.lines.includes(line))).toEqual([
      'jev: path=none provider=official',
      'jev arm skipped: jev not on PATH',
    ]);

    const stubs = stubDir({ jev: `case "$1" in --version) echo '0.2.3';; esac` });
    const stubEnv: NodeJS.ProcessEnv = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
    delete stubEnv.JEV_PROVIDER;
    const stubDeps = { repoRoot: root, indexPath, probesPath, hubNames: [], env: stubEnv };
    const stubBase = await runMain([], stubDeps);
    const wrong = await runMain(['--jev', '--out', tempDir('stn-out-')], stubDeps);
    const logs = fs.readFileSync(path.join(stubs, 'jev.log'), 'utf8').split('\n').filter(Boolean);

    expect(wrong.code).toBe(0);
    expect(wrong.lines.filter((line) => !stubBase.lines.includes(line))).toEqual([
      `jev: path=${path.join(stubs, 'jev')} provider=official`,
      'jev arm skipped: version',
      `jev: found="0.2.3" path=${path.join(stubs, 'jev')}`,
    ]);
    expect(logs).toEqual(['--version']);
  });

  it('refuses --jev without --out before any output or call', async () => {
    const root = tempDir('score-track-narrowing-');
    const { indexPath, probesPath } = smallCorpus(root);
    const stubs = stubDir({ jev: `case "$1" in --version) echo 'jev 0.6.2';; auth) exit 0;; esac` });
    const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
    env.JEV_PROVIDER = 'openrouter';
    const deps = { repoRoot: root, indexPath, probesPath, hubNames: [], env };

    const run = await runMain(['--jev'], deps);

    expect(run.code).toBe(2);
    expect(run.errs).toEqual(['--jev needs --out <dir> so every call is recorded']);
    expect(run.lines).toEqual([]);
    expect(fs.existsSync(path.join(stubs, 'jev.log'))).toBe(false);
  });
});

// ───────────────────────────────────────────────────────────────────
// 11. JEV ARM
// ───────────────────────────────────────────────────────────────────

const JEV = `case "$1" in --version) echo 'jev 0.6.2'; exit 0;; auth) [ "$2" = test ] && echo '{"ok":true,"valid":true,"model":"stub-model"}'; exit 0;; esac
p=$(cat); case "$p" in *exit1*) exit 1;; *exit3*) exit 3;; *exit4*) exit 4;; *quartz*) k=alpha-track;; *ember*) k=beta;; *) k=none;; esac
echo "{\\"model\\":\\"stub-model\\",\\"answers\\":{\\"answer\\":{\\"choice\\":\\"$k\\",\\"probabilities\\":{\\"$k\\":0.8,\\"none\\":0.05}}}}"`;

const JEV_ANSWER_MODEL = `case "$1" in --version) echo 'jev 0.6.2'; exit 0;; auth) [ "$2" = test ] && echo '{"ok":true,"valid":true,"model":"stub-model"}'; exit 0;; esac
p=$(cat); case "$p" in *exit1*) exit 1;; *exit3*) exit 3;; *exit4*) exit 4;; *quartz*) k=alpha-track;; *ember*) k=beta;; *) k=none;; esac
echo "{\\"model\\":\\"stub-answer-model\\",\\"answers\\":{\\"answer\\":{\\"choice\\":\\"$k\\",\\"probabilities\\":{\\"$k\\":0.8,\\"none\\":0.05}}}}"`;

describe('score-track-narrowing jev arm', () => {
  it('runs every jev call under one provider and prints keep on stub answers', async () => {
    const root = tempDir('score-track-narrowing-');
    const { indexPath, probesPath } = keepCorpus(root);
    const stubs = stubDir({ jev: JEV });
    const out = tempDir('stn-out-');
    const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
    delete env.JEV_PROVIDER;

    const r = await runMain(['--jev', '--out', out], {
      repoRoot: root,
      indexPath,
      probesPath,
      hubNames: [],
      env,
    });

    expect(r.code).toBe(0);
    expect(r.lines).toContain(`jev: path=${path.join(stubs, 'jev')} provider=official`);
    expect(r.lines).toContain('jev: auth test provider=official model=stub-model');
    const payloadLine = r.lines.find((line) => line.startsWith('jev: payload: committed packet descriptions, fixture probe text and track descriptions; planned calls: 19; estimated input tokens: '));
    expect(payloadLine).toBeDefined();
    expect(payloadLine ?? '').not.toContain('$');
    expect(r.lines).toContain('verdict jev: keep K=6 M=6 A=6 B=0 W=6 L=0 F=0 p=0.01563 jev_version=0.6.2 provider=official model=stub-model');

    const logs = fs.readFileSync(path.join(stubs, 'jev.log'), 'utf8').split('\n').filter(Boolean);
    expect(logs[0]).toBe('--version');
    for (const line of logs) {
      if (line === '--version') continue;
      const providers = line.match(/--provider \S+/g) ?? [];
      expect(providers.length).toBeGreaterThan(0);
      expect(providers.every((entry) => entry === '--provider official')).toBe(true);
    }
    const choiceLines = logs.filter((line) => line.startsWith('choice --provider official -q Which spec track is this text about? -o '));
    expect(choiceLines).toHaveLength(18);
    for (const line of choiceLines) {
      expect(line.split(' -o ')).toHaveLength(4);
    }

    const records = fs.readFileSync(path.join(out, 'calls.jsonl'), 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line));
    expect(records).toHaveLength(19);
    for (const record of records) {
      expect(typeof record.wallMs).toBe('number');
      expect(typeof record.exitCode).toBe('number');
      expect(record.jevVersion).toBe('jev 0.6.2');
      expect(record.provider).toBe('official');
      expect(record.model).toBe('stub-model');
    }
  });

  it('records the answering model on judgment calls while the auth test keeps its own model', async () => {
    const root = tempDir('score-track-narrowing-answer-');
    const { indexPath, probesPath } = keepCorpus(root);
    const stubs = stubDir({ jev: JEV_ANSWER_MODEL });
    const out = tempDir('stn-answer-out-');
    const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
    delete env.JEV_PROVIDER;

    const r = await runMain(['--jev', '--out', out], {
      repoRoot: root,
      indexPath,
      probesPath,
      hubNames: [],
      env,
    });

    expect(r.code).toBe(0);
    expect(r.lines).toContain('jev: auth test provider=official model=stub-model');
    const verdictLine = r.lines.find((line) => line.startsWith('verdict jev:'));
    expect(verdictLine ?? '').toMatch(/model=stub-answer-model$/);

    const records = fs.readFileSync(path.join(out, 'calls.jsonl'), 'utf8')
      .split('\n').filter(Boolean).map((line) => JSON.parse(line));
    const authRecord = records.find((record) => record.kind === 'auth_test');
    const judgmentRecords = records.filter((record) => record.rowId !== null);
    expect(authRecord?.model).toBe('stub-model');
    expect(judgmentRecords.length).toBeGreaterThan(0);
    expect(judgmentRecords.every((record) => record.model === 'stub-answer-model')).toBe(true);

    const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
    expect(report.modelTuple).toEqual({
      jevVersion: 'jev 0.6.2',
      provider: 'official',
      model: 'stub-answer-model',
    });
  });

  it('records the Pi model on Pi judgments while the auth test keeps the CLI model', async () => {
    const root = tempDir('score-track-narrowing-pi-');
    const { indexPath, probesPath } = keepCorpus(root);
    const stubs = stubDir({ jev: JEV });
    const out = tempDir('stn-pi-out-');
    const piBin = fakePiBin();
    const env: NodeJS.ProcessEnv = {
      ...process.env,
      PATH: `${piBin}${path.delimiter}${stubs}${path.delimiter}${process.env.PATH}`,
    };
    delete env.JEV_PROVIDER;
    const lines: string[] = [];
    const errs: string[] = [];

    const code = await main(['--jev', '--out', out], {
      repoRoot: root,
      indexPath,
      probesPath,
      hubNames: [],
      env: { ...env, JEV_TRANSPORT: 'pi' },
      out: (line: string) => { lines.push(line); },
      err: (line: string) => { errs.push(line); },
    });

    expect(code).toBe(0);
    expect(errs).toHaveLength(1);
    expect(errs[0]?.startsWith('wall time: ')).toBe(true);
    const verdictLine = lines.find((line) => line.startsWith('verdict jev:'));
    expect(verdictLine ?? '').toMatch(/model=typesafe\/jev-latest$/);

    const records = fs.readFileSync(path.join(out, 'calls.jsonl'), 'utf8')
      .split('\n').filter(Boolean).map((line) => JSON.parse(line));
    const authRecord = records.find((record) => record.kind === 'auth_test');
    const judgmentRecords = records.filter((record) => record.rowId !== null);
    expect(authRecord?.model).toBe('stub-model');
    expect(judgmentRecords.length).toBeGreaterThan(0);
    for (const record of judgmentRecords) {
      expect(record.transport).toBe('pi');
      expect(record.model).toBe('typesafe/jev-latest');
    }
  });

  it('records the selected transport on judgment calls', async () => {
    const root = tempDir('score-track-narrowing-transport-');
    const { indexPath, probesPath } = keepCorpus(root);
    const stubs = stubDir({ jev: JEV });
    const out = tempDir('stn-transport-out-');
    const env: NodeJS.ProcessEnv = {
      ...process.env,
      PATH: `${stubs}${path.delimiter}${process.env.PATH}`,
      JEV_TRANSPORT: 'jev',
    };
    delete env.JEV_PROVIDER;

    const run = await runMain(['--jev', '--out', out], {
      repoRoot: root,
      indexPath,
      probesPath,
      hubNames: [],
      env,
    });

    expect(run.code).toBe(0);
    const calls = fs.readFileSync(path.join(out, 'calls.jsonl'), 'utf8')
      .split('\n').filter(Boolean).map((line) => JSON.parse(line));
    const judgmentCalls = calls.filter((call) => call.rowId !== null);
    expect(judgmentCalls.length).toBeGreaterThan(0);
    expect(judgmentCalls.every((call) => call.transport === 'jev')).toBe(true);
  });

  it('marks Jev exit-1 calls unmeasured and stops on coverage', async () => {
    const root = tempDir('score-track-narrowing-');
    const { indexPath, probesPath } = keepCorpus(root, 'exit1');
    const stubs = stubDir({ jev: JEV });
    const out = tempDir('stn-out-');
    const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
    delete env.JEV_PROVIDER;

    const r = await runMain(['--jev', '--out', out], {
      repoRoot: root,
      indexPath,
      probesPath,
      hubNames: [],
      env,
    });

    expect(r.code).toBe(0);
    expect(r.lines.some((line) => line.startsWith('column jev: rows=6 measured=5 unmeasured=1 '))).toBe(true);
    expect(r.lines.some((line) => line.startsWith('verdict jev: stop (coverage) K=6 M=5 '))).toBe(true);
    const records = fs.readFileSync(path.join(out, 'calls.jsonl'), 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line));
    const failed = records.filter((record) => record.exitCode === 1);
    expect(failed).toHaveLength(3);
    for (const record of failed) {
      expect(record).toMatchObject({ backend: 'jev', status: 'unmeasured', pick: null });
    }
  });

  it('writes report.json whose Jev column matches the stdout verdict', async () => {
    const root = tempDir('score-track-narrowing-');
    const { indexPath, probesPath } = keepCorpus(root);
    const stubs = stubDir({ jev: JEV });
    const out = tempDir('stn-out-');
    const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
    delete env.JEV_PROVIDER;

    const r = await runMain(['--jev', '--out', out], {
      repoRoot: root,
      indexPath,
      probesPath,
      hubNames: [],
      env,
    });

    expect(r.code).toBe(0);
    const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
    const verdictLine = r.lines.find((line) => line.startsWith('verdict jev:'));
    expect(verdictLine).toBeDefined();
    expect(report.columns.jev.line).toBe(verdictLine);
    expect(report.columns.jev.verdict).toBe('keep');
  });

  it('stops with key rejected when a judgment exits 3 after the gate', async () => {
    const root = tempDir('score-track-narrowing-');
    const { indexPath, probesPath } = keepCorpus(root, 'exit3');
    const stubs = stubDir({ jev: JEV });
    const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
    delete env.JEV_PROVIDER;

    const r = await runMain(['--jev', '--out', tempDir('stn-out-')], {
      repoRoot: root,
      indexPath,
      probesPath,
      hubNames: [],
      env,
    });
    const index = buildTestSet(root, { hubNames: [] }).rows
      .findIndex((row) => row.question.includes('exit3'));

    expect(r.lines).toContain('jev arm stopped: key rejected');
    expect(r.lines).toContain(`jev: partial rows=${index}`);
    expect(r.lines.some((line) => line.startsWith('verdict jev:'))).toBe(false);
  });

  it('refuses an output directory containing a prior report before calling Jev', async () => {
    const root = tempDir('score-track-narrowing-');
    const { indexPath, probesPath } = keepCorpus(root);
    const stubs = stubDir({ jev: JEV });
    const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
    delete env.JEV_PROVIDER;
    const out = tempDir('stn-out-');
    write(out, 'report.json', JSON.stringify({
      columns: { jev: { provider: 'official', model: 'old-model' } },
    }));

    const r = await runMain(['--jev', '--out', out], {
      repoRoot: root,
      indexPath,
      probesPath,
      hubNames: [],
      env,
    });

    expect(r.code).toBe(2);
    expect(r.errs).toEqual(['--out directory already holds a run']);
    expect(fs.existsSync(path.join(stubs, 'jev.log'))).toBe(false);
    expect(JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8')))
      .toEqual({ columns: { jev: { provider: 'official', model: 'old-model' } } });
  });
});
