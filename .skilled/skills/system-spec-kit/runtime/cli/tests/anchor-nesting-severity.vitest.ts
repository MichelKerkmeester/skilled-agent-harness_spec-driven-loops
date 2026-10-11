// ───────────────────────────────────────────────────────────────────
// MODULE: Anchor Nesting Severity
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
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'anchor-nesting-severity-'));
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

describe('ANCHORS_VALID nesting severity', () => {
  // A nested anchor hides the inner section from retrieval, so the rule reports
  // the layout at error severity. That severity once moved in two steps and the
  // warning step is gone, so this case pins what remains: a document that nests
  // fails strict validation.
  it('reports a nested anchor at error severity', { timeout: 30_000 }, () => {
    const folder = copyFixture('053-template-compliant-level2');
    const spec = path.join(folder, 'spec.md');
    const text = fs
      .readFileSync(spec, 'utf8')
      .replace(
        '<!-- ANCHOR:scope -->',
        '<!-- ANCHOR:scope -->\n<!-- ANCHOR:inner -->\nx\n<!-- /ANCHOR:inner -->',
      );
    fs.writeFileSync(spec, text, 'utf8');

    const { code, entry, passed } = runAnchorRule(folder);

    expect(code).toBe(2);
    expect(passed).toBe(false);
    expect(entry.status).toBe('error');
    expect(entry.details).toContain("spec.md: anchor 'inner' is opened inside 'scope'");
  });
});
