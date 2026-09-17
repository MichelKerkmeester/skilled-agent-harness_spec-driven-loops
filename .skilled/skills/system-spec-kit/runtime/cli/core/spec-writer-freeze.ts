// ───────────────────────────────────────────────────────────────────
// MODULE: Spec Writer Freeze
// ───────────────────────────────────────────────────────────────────

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { randomUUID } from 'node:crypto';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

interface FreezeState {
  readonly isFrozen: boolean;
  readonly reason: string | null;
}

interface FreezeMarker {
  readonly version: 1;
  readonly reason: string;
  readonly pid: number;
  readonly createdAt: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS AND PROCESS STATE
// ───────────────────────────────────────────────────────────────────

const FREEZE_DIR_ENV = 'SPEC_KIT_WRITER_FREEZE_DIR';
const FREEZE_MARKER_PREFIX = 'spec-kit-writers';

let isFrozenInProcess = false;
let inProcessReason: string | null = null;
let inProcessMarkerPath: string | null = null;

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function getErrorCode(error: unknown): string | null {
  return typeof error === 'object' && error !== null && 'code' in error
    ? String((error as { code?: unknown }).code)
    : null;
}

function getRuntimeDirectory(): string {
  const configuredDirectory = process.env[FREEZE_DIR_ENV]?.trim();
  if (configuredDirectory) return path.resolve(configuredDirectory);

  const xdgRuntimeDirectory = process.env.XDG_RUNTIME_DIR?.trim();
  if (xdgRuntimeDirectory) return path.resolve(xdgRuntimeDirectory);

  return os.tmpdir();
}

function getFreezeMarkerPath(): string {
  const userId = typeof process.getuid === 'function' ? String(process.getuid()) : 'user';
  return path.join(getRuntimeDirectory(), `${FREEZE_MARKER_PREFIX}-${userId}.freeze`);
}

function readMarkerReason(markerPath: string): string | null {
  try {
    const marker = JSON.parse(fs.readFileSync(markerPath, 'utf8')) as Partial<FreezeMarker>;
    return marker.version === 1 && typeof marker.reason === 'string' && marker.reason.trim()
      ? marker.reason
      : null;
  } catch (_error: unknown) {
    return null;
  }
}

function inspectFreezeState(markerPath: string): FreezeState {
  if (isFrozenInProcess) {
    return { isFrozen: true, reason: inProcessReason };
  }

  try {
    if (!fs.statSync(path.dirname(markerPath)).isDirectory()) {
      return { isFrozen: true, reason: null };
    }
  } catch (_error: unknown) {
    return { isFrozen: true, reason: null };
  }

  try {
    fs.lstatSync(markerPath);
    return { isFrozen: true, reason: readMarkerReason(markerPath) };
  } catch (error: unknown) {
    return getErrorCode(error) === 'ENOENT'
      ? { isFrozen: false, reason: null }
      : { isFrozen: true, reason: null };
  }
}

function createFreezeMarker(markerPath: string, reason: string): void {
  const marker: FreezeMarker = {
    version: 1,
    reason,
    pid: process.pid,
    createdAt: new Date().toISOString(),
  };
  const fileDescriptor = fs.openSync(markerPath, 'wx', 0o600);

  try {
    fs.writeFileSync(fileDescriptor, `${JSON.stringify(marker)}\n`, 'utf8');
    fs.fsyncSync(fileDescriptor);
  } finally {
    fs.closeSync(fileDescriptor);
  }
}

function clearFreezeMarker(markerPath: string): void {
  const retiredPath = `${markerPath}.${process.pid}.${randomUUID()}.retired`;

  try {
    fs.renameSync(markerPath, retiredPath);
  } catch (error: unknown) {
    if (getErrorCode(error) === 'ENOENT') return;
    throw error;
  }

  fs.rmSync(retiredPath, { recursive: true, force: true });
}

// ───────────────────────────────────────────────────────────────────
// 4. PUBLIC API
// ───────────────────────────────────────────────────────────────────

/** Establish a process-independent freeze that remains active until explicitly cleared. */
export function freezeWriters(reason: string): void {
  const normalizedReason = reason.trim();
  if (!normalizedReason) {
    throw new TypeError('A non-empty reason is required to freeze spec packet writers.');
  }

  const markerPath = getFreezeMarkerPath();

  try {
    createFreezeMarker(markerPath, normalizedReason);
    inProcessReason = normalizedReason;
  } catch (error: unknown) {
    if (getErrorCode(error) === 'EEXIST') {
      inProcessReason = readMarkerReason(markerPath);
    } else {
      isFrozenInProcess = true;
      inProcessReason = null;
      inProcessMarkerPath = markerPath;
      const detail = error instanceof Error ? ` ${error.message}` : '';
      throw new Error(
        `Unable to establish the spec packet writer freeze; writers remain blocked in this process.${detail}`,
      );
    }
  }

  isFrozenInProcess = true;
  inProcessMarkerPath = markerPath;
}

/** Remove the durable marker and clear this process's freeze state. */
export function unfreezeWriters(): void {
  const markerPath = inProcessMarkerPath ?? getFreezeMarkerPath();

  try {
    clearFreezeMarker(markerPath);
  } catch (error: unknown) {
    isFrozenInProcess = true;
    inProcessReason = null;
    inProcessMarkerPath = markerPath;
    const detail = error instanceof Error ? ` ${error.message}` : '';
    throw new Error(
      `Unable to clear the spec packet writer freeze; writers remain blocked.${detail}`,
    );
  }

  isFrozenInProcess = false;
  inProcessReason = null;
  inProcessMarkerPath = null;
}

/** Return true whenever the durable or in-process freeze state blocks writers. */
export function isWritersFrozen(): boolean {
  return inspectFreezeState(getFreezeMarkerPath()).isFrozen;
}

/** Reject a packet write while the freeze is active or cannot be read safely. */
export function assertWritersUnfrozen(): void {
  const state = inspectFreezeState(getFreezeMarkerPath());
  if (!state.isFrozen) return;

  const reason = state.reason ? ` Reason: ${state.reason}` : '';
  throw new Error(
    `Spec packet writers are frozen.${reason} Writes are blocked until the freeze is cleared.`,
  );
}
