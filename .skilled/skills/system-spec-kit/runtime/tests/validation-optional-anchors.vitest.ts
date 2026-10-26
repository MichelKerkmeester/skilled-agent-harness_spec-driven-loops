// ───────────────────────────────────────────────────────────────────
// MODULE: Optional Template Anchor Validation Tests
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const THIS_DIR = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_ROOT = path.resolve(THIS_DIR, '../cli/test-fixtures');
const VALIDATE_SCRIPT = path.resolve(THIS_DIR, '../cli/spec/validate.sh');

const TEMP_DIRS: string[] = [];

function copyFixture(name: string): string {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), `speckit-${name}-`));
  TEMP_DIRS.push(tempDir);
  const sourceDir = path.join(FIXTURE_ROOT, name);
  for (const entry of fs.readdirSync(sourceDir)) {
    fs.cpSync(path.join(sourceDir, entry), path.join(tempDir, entry), { recursive: true });
  }
  return tempDir;
}

function removeAnchorBlock(filePath: string, anchorId: string): void {
  const content = fs.readFileSync(filePath, 'utf8');
  const pattern = new RegExp(`\\n?---\\n\\n<!-- ANCHOR:${anchorId} -->[\\s\\S]*?<!-- /ANCHOR:${anchorId} -->\\n?`, 'u');
  const updated = content.replace(pattern, '\n');
  if (updated === content) throw new Error(`Anchor block not found: ${anchorId}`);
  fs.writeFileSync(filePath, updated, 'utf8');
}

afterEach(() => {
  for (const dir of TEMP_DIRS.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe('Level 2 optional template anchors', () => {
  it('does not require optional L2 spec and plan anchors for ANCHORS_VALID', () => {
    const folder = copyFixture('053-template-compliant-level2');
    const specPath = path.join(folder, 'spec.md');
    const planPath = path.join(folder, 'plan.md');

    for (const anchorId of ['nfr', 'edge-cases', 'complexity']) {
      removeAnchorBlock(specPath, anchorId);
    }
    for (const anchorId of ['phase-deps', 'effort', 'enhanced-rollback']) {
      removeAnchorBlock(planPath, anchorId);
    }
    removeAnchorBlock(specPath, 'related-docs');
    removeAnchorBlock(path.join(folder, 'implementation-summary.md'), 'nfr-verify');
    removeAnchorBlock(path.join(folder, 'implementation-summary.md'), 'deviations');

    const result = spawnSync(VALIDATE_SCRIPT, [folder], {
      encoding: 'utf8',
      env: {
        ...process.env,
        SPECKIT_RULES: 'ANCHORS_VALID',
      },
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('ANCHORS_VALID: Anchors well formed');
    expect(result.stdout).toContain('RESULT: PASSED');
  });

  // A doc stamped v2.3 or later must keep every section its template requires,
  // so the fixture's tasks.md is restamped to put it under that check. Fix
  // Completeness sits under a FIX ADDENDUM header, which makes it optional:
  // a packet that fixes no reported finding deletes the whole section.
  it('does not require the fix-completeness section in a current tasks.md', () => {
    const folder = copyFixture('053-template-compliant-level2');
    const tasksPath = path.join(folder, 'tasks.md');
    const stamped = fs.readFileSync(tasksPath, 'utf8').replace(/\| v2\.2 -->/u, '| v2.4 -->');
    if (!stamped.includes('| v2.4 -->')) throw new Error('tasks.md stamp not found');
    fs.writeFileSync(tasksPath, stamped, 'utf8');
    removeAnchorBlock(tasksPath, 'fix-completeness');

    const result = spawnSync(VALIDATE_SCRIPT, [folder], {
      encoding: 'utf8',
      env: {
        ...process.env,
        SPECKIT_RULES: 'ANCHORS_VALID',
      },
    });

    expect(result.stdout).not.toContain("required anchor 'fix-completeness' is missing");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('ANCHORS_VALID: Anchors well formed');
    expect(result.stdout).toContain('RESULT: PASSED');
  });
});
