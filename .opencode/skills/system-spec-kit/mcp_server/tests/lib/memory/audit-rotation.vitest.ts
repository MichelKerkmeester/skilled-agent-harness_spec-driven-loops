// ───────────────────────────────────────────────────────────────
// TEST: Audit Log Rotation
// ───────────────────────────────────────────────────────────────

import { mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { listRotatedAuditFiles, rotateIfNeeded } from '../../../lib/memory/audit-rotation.js';

describe('audit-rotation', () => {
  let tmpDir: string;
  let auditPath: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join('/private/tmp', 'audit-rotation-'));
    auditPath = join(tmpDir, 'search-decisions.jsonl');
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('rotates at the size threshold and caps retained rotated files', () => {
    writeFileSync(auditPath, 'x'.repeat(20), 'utf8');
    expect(rotateIfNeeded(auditPath, 10, 1, new Date('2026-05-22T00:00:00Z'))).toBe(true);

    writeFileSync(auditPath, 'y'.repeat(20), 'utf8');
    expect(rotateIfNeeded(auditPath, 10, 1, new Date('2026-05-22T00:00:01Z'))).toBe(true);

    expect(listRotatedAuditFiles(auditPath)).toHaveLength(1);
    expect(readdirSync(tmpDir).filter((name) => name.endsWith('.rotated'))).toHaveLength(1);
  });
});
