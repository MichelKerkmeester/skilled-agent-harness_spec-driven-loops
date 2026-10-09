// ───────────────────────────────────────────────────────────────────
// MODULE: Anchor Contract Tests
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scriptsRoot = path.resolve(__dirname, '..');
const validateScript = path.join(scriptsRoot, 'spec', 'validate.sh');
const fixturesRoot = path.join(scriptsRoot, 'test-fixtures');
const createdRoots = new Set<string>();

interface AnchorEntry {
  rule: string;
  status: string;
  message: string;
  details: string[];
}

function copyFixture(name: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'anchor-contract-'));
  createdRoots.add(root);
  const folder = path.join(root, 'packet');
  fs.cpSync(path.join(fixturesRoot, name), folder, { recursive: true });
  return folder;
}

function runAnchorRule(folder: string): { code: number; entry: AnchorEntry; passed: boolean } {
  const result = spawnSync(
    'bash',
    [validateScript, folder, '--no-recursive', '--strict', '--json'],
    { encoding: 'utf8', env: { ...process.env, SPECKIT_RULES: 'ANCHORS_VALID' } },
  );
  const report = JSON.parse(result.stdout) as { entries: AnchorEntry[]; passed: boolean };
  const matches = report.entries.filter((item) => item.rule === 'ANCHORS_VALID');
  if (matches.length !== 1) {
    throw new Error(`expected exactly one ANCHORS_VALID entry, found ${matches.length}`);
  }
  return { code: result.status ?? 1, entry: matches[0], passed: report.passed };
}

afterEach(() => {
  for (const root of createdRoots) fs.rmSync(root, { recursive: true, force: true });
  createdRoots.clear();
});

describe('ANCHORS_VALID anchor contract', () => {
  // Each case spawns a full validation, which is seconds of real work, so the
  // default per-test budget is too tight to be reliable.
  it('reports a name closed twice when it is opened once', { timeout: 30_000 }, () => {
    const folder = copyFixture('080-anchors-duplicate-closer');

    const { code, entry } = runAnchorRule(folder);

    expect(code).toBe(2);
    expect(entry.status).toBe('error');
    expect(entry.details).toContain(
      "spec.md: anchor 'questions' is closed more times than it is opened",
    );
  });

  it('passes a template-compliant packet', { timeout: 30_000 }, () => {
    const folder = copyFixture('053-template-compliant-level2');

    const { code, entry } = runAnchorRule(folder);

    expect(code).toBe(0);
    expect(entry.status).toBe('pass');
  });

  it('leaves a never-opened closer to the closed-but-never-opened finding', { timeout: 30_000 }, () => {
    const folder = copyFixture('053-template-compliant-level2');
    const spec = path.join(folder, 'spec.md');
    // The second closer belongs to a name that is never opened, so it has to
    // arrive without its opener for the case to exercise the intended branch.
    const text = fs
      .readFileSync(spec, 'utf8')
      .replace(
        '<!-- /ANCHOR:metadata -->',
        '<!-- /ANCHOR:metadata -->\n<!-- /ANCHOR:never-opened -->',
      );
    fs.writeFileSync(spec, text, 'utf8');

    const { entry } = runAnchorRule(folder);

    expect(entry.status).toBe('error');
    expect(entry.details).toContain("spec.md: anchor 'never-opened' is closed but never opened");
    expect(entry.details.some((detail) => detail.includes('closed more times'))).toBe(false);
  });

  it('errors when an anchor opens inside another one', { timeout: 30_000 }, () => {
    const folder = copyFixture('078-anchors-nested-questions');

    const { code, entry, passed } = runAnchorRule(folder);

    expect(code).toBe(2);
    expect(passed).toBe(false);
    expect(entry.status).toBe('error');
    expect(entry.details).toContain("spec.md: anchor 'nfr' is opened inside 'questions'");
  });

  it('accepts the decision-record per-ADR nesting', { timeout: 30_000 }, () => {
    const folder = copyFixture('079-anchors-adr-allowance');

    const { code, entry } = runAnchorRule(folder);

    expect(code).toBe(0);
    expect(entry.status).toBe('pass');
  });

  it('reports a non-ADR anchor opened inside a decision record', { timeout: 30_000 }, () => {
    const folder = copyFixture('079-anchors-adr-allowance');
    const record = path.join(folder, 'decision-record.md');
    const text = fs
      .readFileSync(record, 'utf8')
      .replace(
        '<!-- /ANCHOR:adr-001 -->',
        '<!-- ANCHOR:adr-002 -->\nx\n<!-- /ANCHOR:adr-002 -->\n<!-- /ANCHOR:adr-001 -->',
      );
    fs.writeFileSync(record, text, 'utf8');

    const { entry } = runAnchorRule(folder);

    expect(entry.details).toContain("decision-record.md: anchor 'adr-002' is opened inside 'adr-001'");
  });

  it('ignores anchors inside a fenced block', { timeout: 30_000 }, () => {
    const folder = copyFixture('053-template-compliant-level2');
    const spec = path.join(folder, 'spec.md');
    const text = fs
      .readFileSync(spec, 'utf8')
      .replace(
        '<!-- ANCHOR:scope -->',
        '<!-- ANCHOR:scope -->\n```\n<!-- ANCHOR:inner -->\n<!-- /ANCHOR:inner -->\n```',
      );
    fs.writeFileSync(spec, text, 'utf8');

    const { entry } = runAnchorRule(folder);

    expect(entry.status).toBe('pass');
  });

  it('ignores nested markers quoted inside inline code', { timeout: 30_000 }, () => {
    const folder = copyFixture('053-template-compliant-level2');
    const spec = path.join(folder, 'spec.md');
    const quoted = [
      '- Quoted example: `<!-- ANCHOR:outer -->...<!-- ANCHOR:inner -->...<!-- /ANCHOR:inner -->...<!-- /ANCHOR:outer -->`',
      '- Quoted with a longer run: ``<!-- ANCHOR:outer2 -->...<!-- ANCHOR:inner2 -->...<!-- /ANCHOR:inner2 -->...<!-- /ANCHOR:outer2 -->``',
    ].join('\n');
    const text = fs
      .readFileSync(spec, 'utf8')
      .replace('<!-- ANCHOR:scope -->', `<!-- ANCHOR:scope -->\n${quoted}`);
    fs.writeFileSync(spec, text, 'utf8');

    const { code, entry } = runAnchorRule(folder);

    expect(code).toBe(0);
    expect(entry.status).toBe('pass');
  });

  it('still reports a real nested pair sharing a line with inline code', { timeout: 30_000 }, () => {
    const folder = copyFixture('078-anchors-nested-questions');
    const spec = path.join(folder, 'spec.md');
    const text = fs
      .readFileSync(spec, 'utf8')
      .replace(
        '<!-- ANCHOR:nfr -->',
        'Quoted: `<!-- ANCHOR:example -->...<!-- /ANCHOR:example -->` <!-- ANCHOR:nfr -->',
      );
    fs.writeFileSync(spec, text, 'utf8');

    const { entry } = runAnchorRule(folder);

    expect(entry.status).toBe('error');
    expect(entry.details).toContain("spec.md: anchor 'nfr' is opened inside 'questions'");
    expect(entry.details.some((detail) => detail.includes("'example'"))).toBe(false);
  });

  it('reports a closer moved above its opener', { timeout: 30_000 }, () => {
    const folder = copyFixture('053-template-compliant-level2');
    const spec = path.join(folder, 'spec.md');
    const text = fs
      .readFileSync(spec, 'utf8')
      .replace('<!-- /ANCHOR:metadata -->\n', '')
      .replace('<!-- ANCHOR:metadata -->', '<!-- /ANCHOR:metadata -->\n<!-- ANCHOR:metadata -->');
    fs.writeFileSync(spec, text, 'utf8');

    const { entry } = runAnchorRule(folder);

    expect(entry.status).toBe('error');
    expect(entry.details).toContain("spec.md: anchor 'metadata' is closed before it is opened");
  });

  it('fails the nested fixture without --strict while the ADR allowance passes', { timeout: 30_000 }, () => {
    const runPlain = (folder: string) =>
      spawnSync('bash', [validateScript, folder, '--no-recursive'], {
        encoding: 'utf8',
        env: { ...process.env, SPECKIT_RULES: 'ANCHORS_VALID' },
      });

    const nested = runPlain(copyFixture('078-anchors-nested-questions'));
    expect(nested.status).toBe(2);
    expect(nested.stdout).toContain('RESULT: FAILED');

    const allowed = runPlain(copyFixture('079-anchors-adr-allowance'));
    expect(allowed.status).toBe(0);
    expect(allowed.stdout).toContain('RESULT: PASSED');
  });
});
