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
  it('names the engine that produced the verdict', () => {
    const result = runValidate(copyFixture());
    expect(result.stdout).toContain('Engine: orchestrator');
  });

  it('reports the engine in JSON output too', () => {
    const result = runValidate(copyFixture(), {}, ['--json']);
    const report = JSON.parse(result.stdout) as { engine: string; entries: unknown[] };
    expect(report.engine).toBe('orchestrator');
  });

  it('narrows the run to a named subset without changing how a rule decides', () => {
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

  it('skips the freshness rule unless it has been opted into', () => {
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
