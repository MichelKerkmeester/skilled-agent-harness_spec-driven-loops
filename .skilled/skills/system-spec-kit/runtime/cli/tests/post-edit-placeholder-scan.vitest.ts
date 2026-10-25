// ───────────────────────────────────────────────────────────────────
// MODULE: Post-Edit Placeholder Scan
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

// The post-edit hook runs this scan on the folder of every spec doc an author
// edits and shows a failure as a warning. It is useful only while it reports
// what strict validation would flag: a marker strict validation reads must be
// counted, and bracketed prose strict validation ignores must not be.
const here = path.dirname(fileURLToPath(import.meta.url));
const cliRoot = path.resolve(here, '..');
const scanScript = path.join(cliRoot, 'spec', 'check-placeholders.sh');
const fixturesRoot = path.join(cliRoot, 'test-fixtures');
const createdRoots = new Set<string>();

const V23_STAMP = '<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.3 -->';
const V22_STAMP = '<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->';

function folderWith(lines: string[]): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'post-edit-placeholder-scan-'));
  createdRoots.add(root);
  fs.writeFileSync(path.join(root, 'spec.md'), `${lines.join('\n')}\n`, 'utf8');
  return root;
}

function scan(folder: string): { count: number; status: string; exit: number | null } {
  const result = spawnSync('bash', [scanScript, folder, '--json'], { encoding: 'utf8' });
  const report = JSON.parse(result.stdout) as { status: string; placeholders: number; folder: string };
  return { count: report.placeholders, status: report.status, exit: result.status };
}

afterEach(() => {
  for (const root of createdRoots) fs.rmSync(root, { recursive: true, force: true });
  createdRoots.clear();
});

describe('post-edit placeholder scan', () => {
  it('counts the v2.3 value token with its colon', () => {
    const result = scan(folderWith(['# Spec', '', 'Owner: [YOUR_VALUE_HERE: owner name]']));
    expect(result).toEqual({ count: 1, status: 'FAIL', exit: 1 });
  });

  it('counts the other markers strict validation reads', () => {
    const result = scan(folderWith([
      '# Spec',
      'Owner: <YOUR_VALUE_HERE: owner name>',
      'Scope: [NEEDS CLARIFICATION: which module?]',
      'Target: [NEEDS_CLARIFICATION: which release?]',
    ]));
    expect(result.count).toBe(3);
  });

  it('ignores bracketed prose that strict validation never flags', () => {
    const result = scan(folderWith(['# Spec', '', 'Owner: [Owner name]', 'Target: [Response time target]']));
    expect(result).toEqual({ count: 0, status: 'PASS', exit: 0 });
  });

  it('passes a template-compliant Level 3 packet', () => {
    expect(scan(path.join(fixturesRoot, '063-template-compliant-level3')).count).toBe(0);
  });

  it('reads a v2.3 doc with the code-span, fence and all-markers rules', () => {
    const result = scan(folderWith([
      V23_STAMP,
      'Example `[YOUR_VALUE_HERE: example]` then Owner: [YOUR_VALUE_HERE: owner name]',
      'Run `create.sh --owner [YOUR_VALUE_HERE: owner name] --force` first',
      '~~~text',
      'Owner: [YOUR_VALUE_HERE: owner name]',
      '~~~',
      '   ```text',
      'Owner: [YOUR_VALUE_HERE: owner name]',
      '   ```',
    ]));
    expect(result.count).toBe(1);
  });

  it('reads an older doc the way strict validation always has', () => {
    const result = scan(folderWith([
      V22_STAMP,
      'Example `[YOUR_VALUE_HERE: example]` then Owner: [YOUR_VALUE_HERE: owner name]',
      '~~~text',
      'Owner: [YOUR_VALUE_HERE: owner name]',
      '~~~',
    ]));
    expect(result.count).toBe(1);
  });

  it('keeps its usage exit code for a missing folder', () => {
    const result = spawnSync('bash', [scanScript, path.join(os.tmpdir(), 'no-such-placeholder-folder'), '--json'], { encoding: 'utf8' });
    expect(result.status).toBe(2);
  });
});
