// ───────────────────────────────────────────────────────────────────
// MODULE: Spec Root Fault Injection Tests
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { buildMigrationManifest } from '../core/spec-root-migration-manifest.js';
import {
  migrateLegacyOnlyToCanonical,
  restoreFromQuarantine,
} from '../core/spec-root-migration.js';

type WriteGuardModule = typeof import('../core/spec-root-write-guard.js');
type WriterFreezeModule = typeof import('../core/spec-writer-freeze.js');

const FREEZE_DIR_ENV = 'SPEC_KIT_WRITER_FREEZE_DIR';
const PACKET_ID = 'system-speckit/901-fault-fixture';

interface Fixture {
  readonly tempDirectory: string;
  readonly workspacePath: string;
  readonly canonicalPacketPath: string;
  readonly legacyPacketPath: string;
  readonly quarantinePath: string;
  readonly quarantinePacketPath: string;
}

let fixture: Fixture;
let originalRenameSync: typeof fs.renameSync | null = null;
let writeGuard: WriteGuardModule;
let writerFreeze: WriterFreezeModule;

function createFixture(): Fixture {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-root-fault-'));
  const workspacePath = path.join(tempDirectory, 'workspace');
  const relativePacketPath = path.join(...PACKET_ID.split('/'));
  const quarantinePath = path.join(tempDirectory, 'quarantine');

  fs.mkdirSync(workspacePath);
  fs.mkdirSync(path.join(tempDirectory, 'freeze'));

  return {
    tempDirectory,
    workspacePath,
    canonicalPacketPath: path.join(
      workspacePath,
      '.opencode',
      'specs',
      relativePacketPath,
    ),
    legacyPacketPath: path.join(workspacePath, 'specs', relativePacketPath),
    quarantinePath,
    quarantinePacketPath: path.join(quarantinePath, relativePacketPath),
  };
}

function writePacket(packetPath: string, heading: string): void {
  fs.mkdirSync(path.join(packetPath, 'nested'), { recursive: true });
  fs.writeFileSync(path.join(packetPath, 'spec.md'), Buffer.from(`# ${heading}\n`));
  fs.writeFileSync(
    path.join(packetPath, 'nested', 'payload.bin'),
    Buffer.from([0x00, 0xff, 0x41, 0x0a, 0x7f]),
  );
}

function snapshotPacket(packetPath: string): Map<string, Buffer> {
  const snapshot = new Map<string, Buffer>();

  const visit = (directoryPath: string): void => {
    for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
      const entryPath = path.join(directoryPath, entry.name);
      if (entry.isDirectory()) {
        visit(entryPath);
      } else {
        snapshot.set(path.relative(packetPath, entryPath), fs.readFileSync(entryPath));
      }
    }
  };

  visit(packetPath);
  return snapshot;
}

function guardedCanonicalWrite(content: string): void {
  writeGuard.assertSpecWriteAllowed(PACKET_ID, fixture.workspacePath);
  fs.writeFileSync(path.join(fixture.canonicalPacketPath, 'spec.md'), content, 'utf8');
}

function applyRollbackPolicy(input: {
  readonly canonicalWriteCommittedAfterUnfreeze: boolean;
  readonly rollbackBehavior: () => void;
}): { behaviorRollback: 'applied'; dataRollback: 'restored' | 'refused' } {
  input.rollbackBehavior();
  if (input.canonicalWriteCommittedAfterUnfreeze) {
    return { behaviorRollback: 'applied', dataRollback: 'refused' };
  }

  restoreFromQuarantine(fixture.quarantinePath, fixture.workspacePath);
  return { behaviorRollback: 'applied', dataRollback: 'restored' };
}

function createFilesystemError(code: string, message: string): NodeJS.ErrnoException {
  const error = new Error(message) as NodeJS.ErrnoException;
  error.code = code;
  return error;
}

function injectCrossDeviceMoveAndCanonicalRenameFailure(): void {
  originalRenameSync = fs.renameSync;
  const realRenameSync = originalRenameSync;

  fs.renameSync = ((sourcePath, destinationPath) => {
    const source = path.resolve(sourcePath.toString());
    const destination = path.resolve(destinationPath.toString());

    if (source === fixture.legacyPacketPath && destination === fixture.canonicalPacketPath) {
      throw createFilesystemError('EXDEV', 'injected cross-device move');
    }
    if (destination === fixture.canonicalPacketPath) {
      throw createFilesystemError('EIO', 'injected canonical rename failure');
    }

    realRenameSync(sourcePath, destinationPath);
  }) as typeof fs.renameSync;
  syncBuiltinESMExports();
}

function restoreRenameSync(): void {
  if (originalRenameSync === null) return;
  fs.renameSync = originalRenameSync;
  originalRenameSync = null;
  syncBuiltinESMExports();
}

describe('spec root migration fault injection', () => {
  beforeEach(async () => {
    fixture = createFixture();
    vi.stubEnv(FREEZE_DIR_ENV, path.join(fixture.tempDirectory, 'freeze'));
    vi.resetModules();
    writeGuard = await import('../core/spec-root-write-guard.js');
    writerFreeze = await import('../core/spec-writer-freeze.js');
  });

  afterEach(() => {
    restoreRenameSync();
    try {
      writerFreeze.unfreezeWriters();
    } catch (_error: unknown) {
      // The isolated fixture cleanup also clears an intentionally damaged marker.
    }
    fs.rmSync(fixture.tempDirectory, { recursive: true, force: true });
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('rejects a guarded write during the freeze and allows it after unfreeze', () => {
    writePacket(fixture.canonicalPacketPath, 'Original canonical packet');
    const originalSpec = fs.readFileSync(path.join(fixture.canonicalPacketPath, 'spec.md'));
    writerFreeze.freezeWriters('migration transaction');

    expect(() => guardedCanonicalWrite('# Blocked write\n')).toThrow(
      /Spec packet writers are frozen\. Reason: migration transaction/u,
    );
    expect(fs.readFileSync(path.join(fixture.canonicalPacketPath, 'spec.md'))).toEqual(
      originalSpec,
    );

    writerFreeze.unfreezeWriters();
    expect(() => guardedCanonicalWrite('# Accepted write\n')).not.toThrow();
    expect(fs.readFileSync(path.join(fixture.canonicalPacketPath, 'spec.md'), 'utf8'))
      .toBe('# Accepted write\n');
  });

  it('restores the original packet byte-for-byte before writer unfreeze', () => {
    writePacket(fixture.legacyPacketPath, 'Original legacy packet');
    const originalPacket = snapshotPacket(fixture.legacyPacketPath);
    writerFreeze.freezeWriters('migration transaction');

    migrateLegacyOnlyToCanonical(fixture.workspacePath, {
      quarantinePath: fixture.quarantinePath,
    });
    expect(writerFreeze.isWritersFrozen()).toBe(true);

    const rollback = applyRollbackPolicy({
      canonicalWriteCommittedAfterUnfreeze: false,
      rollbackBehavior: () => undefined,
    });

    expect(rollback).toEqual({ behaviorRollback: 'applied', dataRollback: 'restored' });
    expect(snapshotPacket(fixture.legacyPacketPath)).toEqual(originalPacket);
    expect(fs.existsSync(fixture.canonicalPacketPath)).toBe(false);
    expect(writerFreeze.isWritersFrozen()).toBe(true);
  });

  it('refuses destructive data rollback after a newer canonical write', () => {
    writePacket(fixture.legacyPacketPath, 'Original legacy packet');
    writerFreeze.freezeWriters('migration transaction');
    migrateLegacyOnlyToCanonical(fixture.workspacePath, {
      quarantinePath: fixture.quarantinePath,
    });
    writerFreeze.unfreezeWriters();

    guardedCanonicalWrite('# Newer canonical write\n');
    let behaviorRolledBack = false;
    const rollback = applyRollbackPolicy({
      canonicalWriteCommittedAfterUnfreeze: true,
      rollbackBehavior: () => {
        behaviorRolledBack = true;
      },
    });

    expect(rollback).toEqual({ behaviorRollback: 'applied', dataRollback: 'refused' });
    expect(behaviorRolledBack).toBe(true);
    expect(fs.readFileSync(path.join(fixture.canonicalPacketPath, 'spec.md'), 'utf8'))
      .toBe('# Newer canonical write\n');
    expect(fs.existsSync(fixture.legacyPacketPath)).toBe(false);
    expect(fs.readFileSync(path.join(fixture.quarantinePacketPath, 'spec.md'), 'utf8'))
      .toBe('# Original legacy packet\n');
  });

  it('fails closed when cross-device fallback cannot publish its verified copy', () => {
    writePacket(fixture.legacyPacketPath, 'Original legacy packet');
    const originalPacket = snapshotPacket(fixture.legacyPacketPath);
    writerFreeze.freezeWriters('migration transaction');
    injectCrossDeviceMoveAndCanonicalRenameFailure();

    try {
      expect(() => migrateLegacyOnlyToCanonical(fixture.workspacePath, {
        quarantinePath: fixture.quarantinePath,
      })).toThrow(/injected canonical rename failure/u);
    } finally {
      restoreRenameSync();
    }

    expect(snapshotPacket(fixture.legacyPacketPath)).toEqual(originalPacket);
    expect(snapshotPacket(fixture.quarantinePacketPath)).toEqual(originalPacket);
    expect(fs.existsSync(fixture.canonicalPacketPath)).toBe(false);
    expect(fs.readdirSync(path.dirname(fixture.canonicalPacketPath))).toEqual([]);
    expect(buildMigrationManifest(fixture.workspacePath).entries).toMatchObject([
      { relativePacketId: PACKET_ID, klass: 'legacy-only', decision: 'allow' },
    ]);
  });
});
