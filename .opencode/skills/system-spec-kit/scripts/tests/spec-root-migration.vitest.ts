// ───────────────────────────────────────────────────────────────────
// MODULE: Spec Root Migration Tests
// ───────────────────────────────────────────────────────────────────

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  migrateLegacyOnlyToCanonical,
  restoreFromQuarantine,
} from '../core/spec-root-migration.js';

const tempDirectories: string[] = [];
const PACKET_ID = 'system-speckit/901-migration-fixture';

interface MigrationFixture {
  readonly tempDirectory: string;
  readonly workspacePath: string;
  readonly canonicalPacketPath: string;
  readonly legacyPacketPath: string;
  readonly quarantinePath: string;
  readonly quarantinePacketPath: string;
}

function createFixture(): MigrationFixture {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-root-migration-'));
  const workspacePath = path.join(tempDirectory, 'workspace');
  const relativePacketPath = path.join(...PACKET_ID.split('/'));
  const canonicalPacketPath = path.join(workspacePath, '.opencode', 'specs', relativePacketPath);
  const legacyPacketPath = path.join(workspacePath, 'specs', relativePacketPath);
  const quarantinePath = path.join(tempDirectory, 'quarantine');

  tempDirectories.push(tempDirectory);
  fs.mkdirSync(workspacePath, { recursive: true });

  return {
    tempDirectory,
    workspacePath,
    canonicalPacketPath,
    legacyPacketPath,
    quarantinePath,
    quarantinePacketPath: path.join(quarantinePath, relativePacketPath),
  };
}

function writePacket(packetPath: string, marker: string): Buffer {
  const originalBytes = Buffer.from([0x00, 0xff, 0x41, 0x0a, 0x7f]);
  fs.mkdirSync(path.join(packetPath, 'nested'), { recursive: true });
  fs.writeFileSync(path.join(packetPath, 'spec.md'), `# ${marker}\n`, 'utf8');
  fs.writeFileSync(path.join(packetPath, 'nested', 'payload.bin'), originalBytes);
  return originalBytes;
}

afterEach(() => {
  for (const tempDirectory of tempDirectories.splice(0)) {
    fs.rmSync(tempDirectory, { recursive: true, force: true });
  }
});

describe('spec root migration', () => {
  it('moves a legacy-only packet after quarantining its original bytes', () => {
    const fixture = createFixture();
    const originalBytes = writePacket(fixture.legacyPacketPath, 'Legacy packet');

    const result = migrateLegacyOnlyToCanonical(fixture.workspacePath, {
      quarantinePath: fixture.quarantinePath,
    });

    expect(result).toEqual({
      moved: [PACKET_ID],
      quarantined: [PACKET_ID],
      deferredDivergent: [],
    });
    expect(fs.existsSync(fixture.legacyPacketPath)).toBe(false);
    expect(
      fs.readFileSync(path.join(fixture.canonicalPacketPath, 'nested', 'payload.bin')),
    ).toEqual(originalBytes);
    expect(
      fs.readFileSync(path.join(fixture.quarantinePacketPath, 'nested', 'payload.bin')),
    ).toEqual(originalBytes);
  });

  it('restores the quarantined original byte-for-byte', () => {
    const fixture = createFixture();
    const originalBytes = writePacket(fixture.legacyPacketPath, 'Restorable packet');

    migrateLegacyOnlyToCanonical(fixture.workspacePath, {
      quarantinePath: fixture.quarantinePath,
    });
    restoreFromQuarantine(fixture.quarantinePath, fixture.workspacePath);

    expect(fs.readFileSync(path.join(fixture.legacyPacketPath, 'spec.md'))).toEqual(
      Buffer.from('# Restorable packet\n'),
    );
    expect(
      fs.readFileSync(path.join(fixture.legacyPacketPath, 'nested', 'payload.bin')),
    ).toEqual(originalBytes);
    expect(fs.existsSync(fixture.canonicalPacketPath)).toBe(false);
  });

  it('defers a divergent duplicate without moving either packet', () => {
    const fixture = createFixture();
    writePacket(fixture.canonicalPacketPath, 'Canonical packet');
    writePacket(fixture.legacyPacketPath, 'Legacy packet');

    const result = migrateLegacyOnlyToCanonical(fixture.workspacePath, {
      quarantinePath: fixture.quarantinePath,
    });

    expect(result).toEqual({
      moved: [],
      quarantined: [],
      deferredDivergent: [PACKET_ID],
    });
    expect(fs.readFileSync(path.join(fixture.canonicalPacketPath, 'spec.md'), 'utf8'))
      .toBe('# Canonical packet\n');
    expect(fs.readFileSync(path.join(fixture.legacyPacketPath, 'spec.md'), 'utf8'))
      .toBe('# Legacy packet\n');
    expect(fs.existsSync(fixture.quarantinePath)).toBe(false);
  });
});
