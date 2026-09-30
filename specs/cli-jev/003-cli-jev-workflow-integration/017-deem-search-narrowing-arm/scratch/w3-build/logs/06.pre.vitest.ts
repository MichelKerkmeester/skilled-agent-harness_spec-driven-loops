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
  headroomLines,
  isInsideFolder,
  loadProbes,
  lookupPick,
  probeGold,
  probeHits,
  probeLine,
  ripgrepPick,
  ripgrepTokens,
  rotateOptions,
  ruleLines,
  summarizeBaselines,
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
      'Deem search narrowing arm build',
      '017-deem-search-narrowing-arm-build',
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
    expect(probeLine(withGold, [['lookup', 0], ['ripgrep', 1], ['deem', 1]])).toBe(
      'paraphrase probes: total=2 gold-less=1 lookup=0/1 ripgrep=1/1 deem=1/1',
    );

    const shipped = loadProbes(DEFAULT_PROBES_PATH);
    expect(shipped).toHaveLength(20);
    for (const entry of shipped) {
      expect(typeof entry.exactQuery).toBe('string');
    }
  });
});
