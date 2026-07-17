// ───────────────────────────────────────────────────────────────────
// MODULE: Spec Root Write Guard Tests
// ───────────────────────────────────────────────────────────────────

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type WriteGuardModule = typeof import('../core/spec-root-write-guard.js');
type WriterFreezeModule = typeof import('../core/spec-writer-freeze.js');

const FREEZE_DIR_ENV = 'SPEC_KIT_WRITER_FREEZE_DIR';
const PACKET_ID = 'system-speckit/001-write-guard';

let tempDirectory: string;
let workspacePath: string;
let writeGuard: WriteGuardModule;
let writerFreeze: WriterFreezeModule;

function createPacket(rootPath: string, content: string): string {
  const packetPath = path.join(rootPath, PACKET_ID);
  fs.mkdirSync(packetPath, { recursive: true });
  fs.writeFileSync(path.join(packetPath, 'spec.md'), content, 'utf8');
  return packetPath;
}

describe('assertSpecWriteAllowed', () => {
  beforeEach(async () => {
    tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-root-write-guard-'));
    workspacePath = path.join(tempDirectory, 'workspace');
    const freezeDirectory = path.join(tempDirectory, 'freeze');
    fs.mkdirSync(workspacePath);
    fs.mkdirSync(freezeDirectory);
    vi.stubEnv(FREEZE_DIR_ENV, freezeDirectory);
    vi.resetModules();
    writeGuard = await import('../core/spec-root-write-guard.js');
    writerFreeze = await import('../core/spec-writer-freeze.js');
  });

  afterEach(() => {
    try {
      writerFreeze.unfreezeWriters();
    } catch (_error: unknown) {
      // Fixture cleanup removes only this test's isolated runtime directory.
    }
    fs.rmSync(tempDirectory, { recursive: true, force: true });
    vi.unstubAllEnvs();
  });

  it('allows a canonical-only packet while writers are unfrozen', () => {
    createPacket(path.join(workspacePath, '.opencode', 'specs'), 'canonical\n');

    expect(() => writeGuard.assertSpecWriteAllowed(PACKET_ID, workspacePath)).not.toThrow();
  });

  it('rejects a divergent duplicate and reports both roots', () => {
    const canonicalRoot = path.join(workspacePath, '.opencode', 'specs');
    const legacyRoot = path.join(workspacePath, 'specs');
    createPacket(canonicalRoot, 'canonical\n');
    createPacket(legacyRoot, 'legacy\n');

    expect(() => writeGuard.assertSpecWriteAllowed(PACKET_ID, workspacePath)).toThrow(
      new RegExp(
        `Spec packet write blocked.*${canonicalRoot.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')}`
          + `.*${legacyRoot.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')}`,
        'u',
      ),
    );
  });

  it('rejects writes while the global writer freeze is active', () => {
    createPacket(path.join(workspacePath, '.opencode', 'specs'), 'canonical\n');
    writerFreeze.freezeWriters('maintenance window');

    expect(() => writeGuard.assertSpecWriteAllowed(PACKET_ID, workspacePath)).toThrow(
      /Spec packet writers are frozen\. Reason: maintenance window/u,
    );
  });

  it('fails closed when no readable packet root can be established', () => {
    expect(() => writeGuard.assertSpecWriteAllowed(PACKET_ID, workspacePath)).toThrow(
      /collision class is divergent-duplicate \(no readable packet roots\)/u,
    );
  });
});
