// ───────────────────────────────────────────────────────────────────
// MODULE: Source Tag Rule Tests
// ───────────────────────────────────────────────────────────────────
// Runs the SOURCE_TAGS helper and its shell rule against a throwaway git
// repository. Resolution comes from sk-doc's citation scanner and its shipped
// redirect table, so the moved case relies on the real .opencode/ to .skilled/ rule.

import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { CUTOFF_DEFAULT, cutoffDate, sourceTagCitations } from '../rules/check-source-tags-helper.mjs';

const RULES = path.resolve(import.meta.dirname, '..', 'rules');
const HELPER = path.join(RULES, 'check-source-tags-helper.mjs');
const RULE = path.join(RULES, 'check-source-tags.sh');
const PACKET = 'specs/demo/001-fresh';
const TEN_LINES = Array.from({ length: 10 }, (_, i) => `line ${i + 1}`).join('\n') + '\n';

const roots: string[] = [];

function git(root: string, ...args: string[]): void {
  execFileSync('git', ['-C', root, ...args], { stdio: 'ignore' });
}

function write(root: string, files: Record<string, string>): void {
  for (const [rel, text] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    writeFileSync(path.join(root, rel), text);
  }
}

/** A repository with two committed targets and a packet created after the cutoff. */
function makeRepo(created = '2026-10-10'): string {
  const root = mkdtempSync(path.join(tmpdir(), 'source-tags-'));
  roots.push(root);
  git(root, 'init', '-q');
  git(root, 'config', 'user.email', 'test@example.com');
  git(root, 'config', 'user.name', 'Test');
  // A machine-wide excludes file can ignore specs/ in a fresh repository, which
  // would hide the packet's uncommitted files from the resolver.
  git(root, 'config', 'core.excludesFile', '/dev/null');
  write(root, {
    'src/real.ts': TEN_LINES,
    '.skilled/tool/moved.ts': TEN_LINES,
    [`${PACKET}/spec.md`]: `# Spec\n\n| Field | Value |\n|---|---|\n| **Created** | ${created} |\n`,
  });
  git(root, 'add', '-A');
  git(root, 'commit', '-q', '-m', 'fixture');
  return root;
}

function helper(root: string, env: Record<string, string> = {}): string[] {
  const out = execFileSync('node', [HELPER, path.join(root, PACKET)], {
    encoding: 'utf8',
    env: { ...process.env, SPECKIT_SOURCE_TAG_CUTOFF: '', ...env },
  });
  return out.split('\n').filter((line) => line !== '');
}

const warnings = (lines: string[]) => lines.filter((line) => line.startsWith('WARN\t'));

afterEach(() => {
  while (roots.length > 0) rmSync(roots.pop() as string, { recursive: true, force: true });
});

describe('SOURCE_TAGS helper', () => {
  it('passes clean tags and ignores URLs, prose, fences and prompts', () => {
    const root = makeRepo();
    write(root, {
      [`${PACKET}/research/research.md`]: [
        'Claim one [SOURCE: src/real.ts:3].',
        'Claim two [SOURCE: https://example.com/page] and [SOURCE: live run].',
        '```',
        'Example only [SOURCE: src/real.ts:999].',
        '```',
      ].join('\n'),
      [`${PACKET}/research/prompts/iteration-001.md`]: 'Write tags like [SOURCE: invented.ts:1].\n',
    });
    const lines = helper(root);
    expect(warnings(lines)).toEqual([]);
    expect(lines).toContain('CHECKED\t1');
  });

  it('stays green on a packet with no tags', () => {
    const root = makeRepo();
    write(root, { [`${PACKET}/research/research.md`]: 'No tags here.\n' });
    expect(helper(root)).toEqual(['CHECKED\t0']);
  });

  it('gives a fresh research lineage with one invented tag exactly one warning', () => {
    const root = makeRepo();
    write(root, {
      [`${PACKET}/research/research.md`]: 'Synthesis [SOURCE: src/real.ts:2-4].\n',
      [`${PACKET}/research/lineages/lane-a/iterations/iteration-001.md`]: [
        'Finding A [SOURCE: src/real.ts:5].',
        'Finding B [SOURCE: src/real.ts:999].',
        'Finding C [SOURCE: src/real.ts:1, src/real.ts:10].',
      ].join('\n'),
    });
    const found = warnings(helper(root));
    expect(found).toHaveLength(1);
    expect(found[0]).toContain('iteration-001.md:2');
    expect(found[0]).toContain('src/real.ts:999');
    expect(found[0]).toContain('\tpast end\t');
  });

  it('names the new path of a moved tag and flags a gone one', () => {
    const root = makeRepo();
    write(root, {
      [`${PACKET}/review/review-report.md`]: [
        'Moved [SOURCE: .opencode/tool/moved.ts:3].',
        'Gone [SOURCE: nothing/here.ts:1].',
      ].join('\n'),
    });
    const found = warnings(helper(root));
    expect(found).toHaveLength(2);
    expect(found[0]).toContain('\tmoved\tnow at .skilled/tool/moved.ts');
    expect(found[1]).toContain('\tgone\t');
  });

  it('resolves packet-root citations and uncommitted packet files', () => {
    const root = makeRepo();
    write(root, {
      [`${PACKET}/scratch/notes.md`]: 'one\ntwo\nthree\n',
      [`${PACKET}/research/lineages/lane-a/iterations/iteration-001.md`]: [
        'From the packet root [SOURCE: scratch/notes.md:2].',
        'Past the end of an uncommitted file [SOURCE: scratch/notes.md:40].',
      ].join('\n'),
    });
    const found = warnings(helper(root));
    expect(found).toHaveLength(1);
    expect(found[0]).toContain('scratch/notes.md:40');
  });

  it('counts a tag under a gitignored folder once, with or without the file on disk', () => {
    const root = makeRepo();
    write(root, {
      '.gitignore': 'external/\n',
      [`${PACKET}/research/research.md`]: 'Ignored material [SOURCE: external/notes.md:3].\n',
    });
    const absent = helper(root);
    expect(warnings(absent)).toEqual([]);
    expect(absent).toEqual(['IGNORED\t1', 'CHECKED\t1']);
    write(root, { 'external/notes.md': 'one\ntwo\nthree\nfour\nfive\n' });
    expect(helper(root)).toEqual(absent);
  });

  it('counts a citation under a symlinked directory as not ignored, without a fatal check-ignore', () => {
    const root = makeRepo();
    write(root, {
      'real/file.md': 'one\ntwo\nthree\n',
      '.gitignore': 'external/\n',
      [`${PACKET}/research/research.md`]: [
        'Cited through the link [SOURCE: link/missing.md:1].',
        'Cited under the ignored folder [SOURCE: external/notes.md:3].',
      ].join('\n'),
    });
    symlinkSync('real', path.join(root, 'link'));
    const result = spawnSync('node', [HELPER, path.join(root, PACKET)], {
      encoding: 'utf8',
      env: { ...process.env, SPECKIT_SOURCE_TAG_CUTOFF: '' },
    });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    const lines = result.stdout.split('\n').filter((line) => line !== '');
    const found = warnings(lines);
    expect(found).toHaveLength(1);
    expect(found[0]).toContain('link/missing.md:1');
    expect(lines).toContain('IGNORED\t1');
  });

  it('still warns as gone for a path outside every ignored folder', () => {
    const root = makeRepo();
    write(root, {
      '.gitignore': 'external/\n',
      [`${PACKET}/research/research.md`]: 'Invented [SOURCE: nothing/here.ts:1].\n',
    });
    const lines = helper(root);
    const found = warnings(lines);
    expect(found).toHaveLength(1);
    expect(found[0]).toContain('nothing/here.ts:1');
    expect(found[0]).toContain('\tgone\t');
    expect(lines).toContain('IGNORED\t0');
  });

  it('skips packets created on or before the cutoff', () => {
    const root = makeRepo('2026-10-04');
    write(root, { [`${PACKET}/research/research.md`]: 'Old [SOURCE: src/real.ts:999].\n' });
    expect(helper(root)).toEqual(['SKIP\tcreated 2026-10-04, on or before the cutoff 2026-10-04']);
    expect(warnings(helper(root, { SPECKIT_SOURCE_TAG_CUTOFF: '2000-01-01' }))).toHaveLength(1);
  });

  it('falls back to the default cutoff on a malformed override', () => {
    const root = makeRepo('2026-10-04');
    write(root, { [`${PACKET}/research/research.md`]: 'Old [SOURCE: src/real.ts:999].\n' });
    expect(helper(root, { SPECKIT_SOURCE_TAG_CUTOFF: 'soon' })[0]).toMatch(/^SKIP\t/);
  });

  it('falls back to the default cutoff on a date-shaped day that does not exist', () => {
    for (const impossible of ['9999-99-99', '2026-02-30']) {
      const { cutoff, note } = cutoffDate({ SPECKIT_SOURCE_TAG_CUTOFF: impossible });
      expect(cutoff).toBe(CUTOFF_DEFAULT);
      expect(note).toContain(impossible);
    }
    expect(cutoffDate({ SPECKIT_SOURCE_TAG_CUTOFF: '2028-02-29' })).toEqual({ cutoff: '2028-02-29', note: null });
  });

  it('resolves a tracked file whose name has a space, end to end', () => {
    const root = makeRepo();
    write(root, {
      'REPO RULES.md': Array.from({ length: 100 }, (_, i) => `rule ${i + 1}`).join('\n') + '\n',
      'README.md': 'one\ntwo\nthree\n',
    });
    git(root, 'add', '-A');
    git(root, 'commit', '-q', '-m', 'rules');
    write(root, {
      [`${PACKET}/research/research.md`]: [
        'Whole path [SOURCE: REPO RULES.md:88].',
        'Split pieces [SOURCE: `README.md:1`; `REPO RULES.md:90`].',
      ].join('\n'),
    });
    const lines = helper(root);
    expect(warnings(lines)).toEqual([]);
    expect(lines).toContain('IGNORED\t0');
    expect(lines).toContain('CHECKED\t3');
  });

  it('reads a spaced path whole by lending the match its lead words', () => {
    const found = sourceTagCitations('[SOURCE: REPO RULES.md:88]', 'd.md');
    expect(found).toHaveLength(1);
    expect(found[0].target).toBe('RULES.md');
    expect(found[0].lead).toBe('REPO');
    expect(found[0].targetLine).toBe(88);
  });

  it('splits a tag on commas and keeps each citation its own lead', () => {
    const found = sourceTagCitations('[SOURCE: a.md:1, REPO RULES.md:88]', 'd.md');
    expect(found).toHaveLength(2);
    expect(found[0].target).toBe('a.md');
    expect(found[0].lead).toBe('');
    expect(found[1].target).toBe('RULES.md');
    expect(found[1].lead).toBe('REPO');
  });

  it('splits a tag on semicolons and strips a backtick from each lead', () => {
    const found = sourceTagCitations('[SOURCE: `README.md:20-30`; `REPO RULES.md:36-50`]', 'd.md');
    expect(found).toHaveLength(2);
    expect(found[1].target).toBe('RULES.md');
    expect(found[1].lead).toBe('REPO');
  });

  it('yields nothing when a tag holds a URL or prose but no path:line', () => {
    expect(sourceTagCitations('[SOURCE: https://example.com/page]', 'd.md')).toEqual([]);
    expect(sourceTagCitations('[SOURCE: live run]', 'd.md')).toEqual([]);
  });
});

describe('SOURCE_TAGS shell rule', () => {
  const runRule = (root: string): string => execFileSync('bash', ['-c',
    'source "$1"; run_check "$2" 2; printf "%s\\n%s\\n" "$RULE_STATUS" "$RULE_MESSAGE"; printf "%s\\n" ${RULE_DETAILS[@]+"${RULE_DETAILS[@]}"}',
    '_', RULE, path.join(root, PACKET)], { encoding: 'utf8', env: { ...process.env, SPECKIT_SOURCE_TAG_CUTOFF: '' } });

  it('warns, never fails, and says a pass proves existence only', () => {
    const root = makeRepo();
    write(root, { [`${PACKET}/research/research.md`]: 'Bad [SOURCE: src/real.ts:999].\n' });
    const [status, message, detail] = runRule(root).split('\n');
    expect(status).toBe('warn');
    expect(message).toBe('1 of 1 [SOURCE:] citation(s) do not resolve to an existing path and line');
    expect(detail).toContain('[SOURCE: src/real.ts:999] past end');
  });

  it('passes with a message that it checks existence, not support', () => {
    const root = makeRepo();
    write(root, { [`${PACKET}/research/research.md`]: 'Good [SOURCE: src/real.ts:3].\n' });
    const [status, message] = runRule(root).split('\n');
    expect(status).toBe('pass');
    expect(message).toContain('says nothing about whether the lines support the claim');
  });
});
