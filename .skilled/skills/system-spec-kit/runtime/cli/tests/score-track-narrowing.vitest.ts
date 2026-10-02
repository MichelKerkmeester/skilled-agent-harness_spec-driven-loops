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
  baselineLines,
  buildOptions,
  buildTestSet,
  classifyDescription,
  columnLine,
  headroomLines,
  isInsideFolder,
  loadProbes,
  lookupPick,
  main,
  modalPick,
  nearestRank,
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
  ) {
    const rows = tracks.map((track, index) => ({ id: `r${index}`, track }));
    const records = new Map<string, Array<string | null>>();
    answers.forEach((entry, index) => {
      if (entry !== undefined) records.set(`r${index}`, entry);
    });
    const baselinePicks = new Map<string, string | null>(
      baseline.map((pick, index): [string, string | null] => [`r${index}`, pick]),
    );
    return summarizeColumn('jev', rows, records, baselinePicks, 'model=stub-model');
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

  it('prints requalify when the stored jev model differs', async () => {
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

    expect(r.code).toBe(0);
    const verdictIndex = r.lines.findIndex((line) => line.startsWith('verdict jev:'));
    expect(verdictIndex).toBeGreaterThan(0);
    expect(r.lines[verdictIndex - 1]).toBe('requalify: model changed');
  });
});
