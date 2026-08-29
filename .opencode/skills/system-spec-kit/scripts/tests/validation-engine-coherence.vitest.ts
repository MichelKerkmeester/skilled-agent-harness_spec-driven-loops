import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scriptsRoot = path.resolve(__dirname, '..');
const validateScript = path.join(scriptsRoot, 'spec', 'validate.sh');
const fixtureRoot = path.join(scriptsRoot, 'test-fixtures', '053-template-compliant-level2');
const createdRoots = new Set<string>();

function copyFixture(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'engine-coherence-'));
  createdRoots.add(root);
  const folder = path.join(root, 'packet');
  fs.cpSync(fixtureRoot, folder, { recursive: true });
  return folder;
}

function runValidate(folder: string, env: Record<string, string> = {}, args: string[] = []) {
  const result = spawnSync('bash', [validateScript, folder, '--no-recursive', ...args], {
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
  return { code: result.status ?? 1, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

afterEach(() => {
  for (const root of createdRoots) fs.rmSync(root, { recursive: true, force: true });
  createdRoots.clear();
});

describe('validation engine coherence', () => {
  // Every test here spawns at least one full validation, which is seconds of
  // real work, so the default per-test budget is too tight to be reliable.
  // A track is where packets are filed, not a packet. It carries metadata so
  // tracks are searchable, which is enough to make it look like a phase parent.
  it('treats a track directory as a track, not a packet', () => {
    const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'engine-coherence-track-'));
    createdRoots.add(repoRoot);
    const track = path.join(repoRoot, 'specs', 'some-track');
    fs.mkdirSync(track, { recursive: true });
    fs.writeFileSync(path.join(track, 'description.json'), '{"specFolder":"some-track"}', 'utf8');
    fs.cpSync(fixtureRoot, path.join(track, '001-a-packet'), { recursive: true });

    const result = spawnSync('bash', [validateScript, track, '--strict', '--no-recursive', '--quiet'], {
      encoding: 'utf8', env: { ...process.env },
    });
    expect(result.status).toBe(0);
  });

  // The exemption is by name and location, so a real packet must never take it.
  it('still grades a numbered packet that sits directly under specs', () => {
    const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'engine-coherence-pkt-'));
    createdRoots.add(repoRoot);
    const pkt = path.join(repoRoot, 'specs', '001-a-real-packet');
    fs.cpSync(fixtureRoot, pkt, { recursive: true });
    fs.rmSync(path.join(pkt, 'plan.md'), { force: true });

    const result = spawnSync('bash', [validateScript, pkt, '--strict', '--no-recursive', '--quiet'], {
      encoding: 'utf8', env: { ...process.env },
    });
    expect(result.status).toBe(2);
  });

  it('names the engine that produced the verdict', () => {
    const result = runValidate(copyFixture());
    expect(result.stdout).toContain('Engine: orchestrator');
  });

  it('reports the engine in JSON output too', () => {
    const result = runValidate(copyFixture(), {}, ['--json']);
    const report = JSON.parse(result.stdout) as { engine: string; entries: unknown[] };
    expect(report.engine).toBe('orchestrator');
  });

  it('narrows the run to a named subset without changing how a rule decides', { timeout: 30_000 }, () => {
    const folder = copyFixture();
    const full = JSON.parse(runValidate(folder, {}, ['--json']).stdout) as { entries: Array<{ rule: string }> };
    const narrowed = JSON.parse(
      runValidate(folder, { SPECKIT_RULES: 'LEVEL_DECLARED,ANCHORS_VALID' }, ['--json']).stdout,
    ) as { entries: Array<{ rule: string; status: string }> };

    expect(narrowed.entries.map((item) => item.rule).sort()).toEqual(['ANCHORS_VALID', 'LEVEL_DECLARED']);
    expect(narrowed.entries.length).toBeLessThan(full.entries.length);
    for (const item of narrowed.entries) {
      const same = full.entries.find((candidate) => candidate.rule === item.rule) as { status: string };
      expect(item.status).toBe(same.status);
    }
  });

  it('canonicalises rule aliases and hyphenated spellings', () => {
    const report = JSON.parse(
      runValidate(copyFixture(), { SPECKIT_RULES: 'ANCHOR,FILE-EXISTS' }, ['--json']).stdout,
    ) as { entries: Array<{ rule: string }> };
    expect(report.entries.map((item) => item.rule).sort()).toEqual(['ANCHORS_VALID', 'FILE_EXISTS']);
  });

  // A subset that matches nothing would otherwise report a clean pass for a
  // packet no rule ever looked at, which is the one way a gate must not fail.
  it('refuses a subset naming a rule that does not exist', () => {
    const result = runValidate(copyFixture(), { SPECKIT_RULES: 'NOT_A_REAL_RULE' });
    expect(result.code).toBe(1);
    expect(`${result.stdout}${result.stderr}`).toContain('NOT_A_REAL_RULE');
    expect(result.stdout).not.toContain('RESULT: PASSED');
  });

  it('refuses even when only one name in the subset is wrong', () => {
    const result = runValidate(copyFixture(), { SPECKIT_RULES: 'LEVEL_DECLARED,NOT_A_REAL_RULE' });
    expect(result.code).toBe(1);
  });

  it('prints the detail lines that say what a finding actually found', () => {
    const folder = copyFixture();
    const checklist = path.join(folder, 'checklist.md');
    const text = fs.readFileSync(checklist, 'utf8').replace(/^# .*$/mu, '# Checklist: wrong title shape');
    fs.writeFileSync(checklist, text, 'utf8');

    const result = runValidate(folder, { SPECKIT_RULES: 'TEMPLATE_HEADERS' });
    expect(result.stdout).toContain('H1 should start with');
  });

  // The auto-recursion notice is suppressed in JSON mode, so reading the mode
  // after printing it puts prose in front of the JSON and breaks every parser.
  it('emits parseable JSON for a phase parent when the mode comes from the environment', { timeout: 30_000 }, () => {
    const parent = fs.mkdtempSync(path.join(os.tmpdir(), 'engine-coherence-parent-'));
    createdRoots.add(parent);
    fs.cpSync(fixtureRoot, path.join(parent, '001-first-child'), { recursive: true });
    fs.copyFileSync(path.join(fixtureRoot, 'spec.md'), path.join(parent, 'spec.md'));

    const result = spawnSync('bash', [validateScript, parent], {
      encoding: 'utf8',
      env: { ...process.env, SPECKIT_JSON: 'true' },
    });
    const first = (result.stdout ?? '').split('\n').find((line) => line.trim() !== '') ?? '';
    expect(() => JSON.parse(first)).not.toThrow();
  });

  // A '#' line inside frontmatter is a YAML comment. Reading one as the title
  // lets a genuinely wrong heading pass on the strength of a comment above it.
  it('does not accept a frontmatter comment as the checklist title', () => {
    const folder = copyFixture();
    const checklist = path.join(folder, 'checklist.md');
    fs.writeFileSync(
      checklist,
      [
        '---',
        'title: "Fixture"',
        '# Verification Checklist: looks right but is a comment',
        'contextType: "general"',
        '---',
        '',
        '# Checklist: the real title, which is wrong',
        '',
      ].join('\n'),
      'utf8',
    );

    const result = runValidate(folder, { SPECKIT_RULES: 'TEMPLATE_HEADERS' });
    expect(result.stdout).toContain('H1 should start with');
    expect(result.stdout).toContain('the real title, which is wrong');
  });

  it('reports an opened but unterminated frontmatter block as its own fault', () => {
    const folder = copyFixture();
    const spec = path.join(folder, 'spec.md');
    // A body separator would satisfy a naive "is there another ---" test, so the
    // fixture has to carry none for this to exercise the real condition.
    fs.writeFileSync(spec, '---\ntitle: "Unclosed"\ndescription: "no closing delimiter"\n\n# Spec\n\nBody.\n', 'utf8');

    const result = runValidate(folder, { SPECKIT_RULES: 'FRONTMATTER_VALID' });
    expect(result.stdout).toContain('Unclosed YAML frontmatter (missing closing ---)');
    expect(result.stdout).not.toContain('Empty required frontmatter field');
  });

  it('reports a declared-but-empty required frontmatter field', () => {
    const folder = copyFixture();
    const spec = path.join(folder, 'spec.md');
    const text = fs.readFileSync(spec, 'utf8').replace(/^trigger_phrases:\n(?:[ \t]+-.*\n)*/mu, 'trigger_phrases: []\n');
    fs.writeFileSync(spec, text, 'utf8');

    const result = runValidate(folder, { SPECKIT_RULES: 'FRONTMATTER_VALID' });
    expect(result.code).toBe(2);
    expect(result.stdout).toContain('Empty required frontmatter field: trigger_phrases');
  });

  it('leaves a document with no frontmatter to the rules that own document shape', () => {
    const folder = copyFixture();
    const spec = path.join(folder, 'spec.md');
    const text = fs.readFileSync(spec, 'utf8').replace(/^---\n[\s\S]*?\n---\n/u, '');
    fs.writeFileSync(spec, text, 'utf8');

    const result = runValidate(folder, { SPECKIT_RULES: 'FRONTMATTER_VALID' });
    expect(result.stdout).not.toContain('Empty required frontmatter field');
  });

  // validateFolder is exported, so a long-lived process can call it more than
  // once. The subset is read per validation rather than memoized for the life
  // of the process, or the first call would pin every later one.
  it('re-reads the rule subset on every in-process validation', async () => {
    const { validateFolder } = await import(
      '../../mcp-server/dist/lib/validation/orchestrator.js'
    ) as { validateFolder: (f: string, o?: Record<string, unknown>) => { entries: Array<{ rule: string }> } };
    const folder = copyFixture();
    const previous = process.env.SPECKIT_RULES;
    try {
      process.env.SPECKIT_RULES = 'LEVEL_DECLARED';
      const first = validateFolder(folder).entries.map((e) => e.rule);
      process.env.SPECKIT_RULES = 'ANCHORS_VALID';
      const second = validateFolder(folder).entries.map((e) => e.rule);
      expect(first).toEqual(['LEVEL_DECLARED']);
      expect(second).toEqual(['ANCHORS_VALID']);
    } finally {
      if (previous === undefined) delete process.env.SPECKIT_RULES;
      else process.env.SPECKIT_RULES = previous;
    }
  }, 30_000);

  it('skips the freshness rule unless it has been opted into', { timeout: 30_000 }, () => {
    const folder = copyFixture();
    const off = runValidate(folder, { SPECKIT_RULES: 'CONTINUITY_FRESHNESS' }, ['--strict']);
    expect(off.stdout).toContain('SPECKIT_COMPLETION_FRESHNESS is not enabled');

    const on = runValidate(
      folder,
      { SPECKIT_RULES: 'CONTINUITY_FRESHNESS', SPECKIT_COMPLETION_FRESHNESS: '1' },
      ['--strict'],
    );
    expect(on.stdout).not.toContain('SPECKIT_COMPLETION_FRESHNESS is not enabled');
  });
});
