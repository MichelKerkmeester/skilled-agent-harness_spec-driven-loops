// ───────────────────────────────────────────────────────────────
// MODULE: Audit Log Rotation
// ───────────────────────────────────────────────────────────────

import { existsSync, readdirSync, renameSync, rmSync, statSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

// ───────────────────────────────────────────────────────────────
// 1. CORE LOGIC
// ───────────────────────────────────────────────────────────────

export function rotateIfNeeded(
  auditPath: string,
  maxBytes: number,
  maxFiles: number,
  now: Date = new Date(),
): boolean {
  const normalizedMaxBytes = normalizePositiveInteger(maxBytes, 'maxBytes');
  const normalizedMaxFiles = normalizePositiveInteger(maxFiles, 'maxFiles');

  if (!existsSync(auditPath)) {
    enforceRotationCap(auditPath, normalizedMaxFiles);
    return false;
  }

  const size = statSync(auditPath).size;
  if (size <= normalizedMaxBytes) {
    enforceRotationCap(auditPath, normalizedMaxFiles);
    return false;
  }

  const suffix = now.toISOString().replace(/[:.]/g, '-');
  renameSync(auditPath, `${auditPath}.${suffix}.rotated`);
  enforceRotationCap(auditPath, normalizedMaxFiles);
  return true;
}

export function listRotatedAuditFiles(auditPath: string): string[] {
  const dir = dirname(auditPath);
  if (!existsSync(dir)) return [];

  const prefix = `${basename(auditPath)}.`;
  return readdirSync(dir)
    .filter((name) => name.startsWith(prefix) && name.endsWith('.rotated'))
    .map((name) => join(dir, name))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
}

function enforceRotationCap(auditPath: string, maxFiles: number): void {
  const rotated = listRotatedAuditFiles(auditPath);
  for (const stale of rotated.slice(maxFiles)) {
    rmSync(stale, { force: true });
  }
}

function normalizePositiveInteger(value: number, name: string): number {
  if (!Number.isFinite(value) || value < 1) {
    throw new Error(`${name} must be a positive finite number, got ${value}`);
  }

  return Math.floor(value);
}
