import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const THIS_DIR = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_ROOT = path.resolve(THIS_DIR, '../../scripts/test-fixtures');
const VALIDATE_SCRIPT = path.resolve(THIS_DIR, '../../scripts/spec/validate.sh');

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
    expect(result.stdout).toContain('ANCHORS_VALID: All anchor pairs valid');
    expect(result.stdout).toContain('RESULT: PASSED');
  });
});
