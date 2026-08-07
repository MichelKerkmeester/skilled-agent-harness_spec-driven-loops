// ───────────────────────────────────────────────────────────────────
// MODULE: Spec Root Migration Tests
// ───────────────────────────────────────────────────────────────────

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  flipToTopLevelCanonical,
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
  const canonicalPacketPath = path.join(workspacePath, 'specs', relativePacketPath);
  const legacyPacketPath = path.join(workspacePath, '.opencode', 'specs', relativePacketPath);
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

describe('flipToTopLevelCanonical', () => {
  interface FlipFixture {
    readonly tempDirectory: string;
    readonly workspacePath: string;
    readonly canonicalRoot: string;
    readonly legacyRoot: string;
    readonly quarantinePath: string;
  }

  function createFlipFixture(): FlipFixture {
    const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-root-flip-'));
    const workspacePath = path.join(tempDirectory, 'workspace');
    const canonicalRoot = path.join(workspacePath, '.opencode', 'specs');
    const legacyRoot = path.join(workspacePath, 'specs');
    const quarantinePath = path.join(tempDirectory, 'quarantine');

    tempDirectories.push(tempDirectory);
    fs.mkdirSync(canonicalRoot, { recursive: true });

    return { tempDirectory, workspacePath, canonicalRoot, legacyRoot, quarantinePath };
  }

  it('flips specs/ to a real directory and .opencode/specs to a relative symlink', () => {
    const fixture = createFlipFixture();
    const relativePacketPath = path.join(...PACKET_ID.split('/'));
    const canonicalPacketPath = path.join(fixture.canonicalRoot, relativePacketPath);
    const originalBytes = writePacket(canonicalPacketPath, 'Pre-flip packet');
    fs.symlinkSync(path.join('.opencode', 'specs'), fixture.legacyRoot);

    flipToTopLevelCanonical(fixture.workspacePath, { quarantinePath: fixture.quarantinePath });

    expect(fs.lstatSync(fixture.legacyRoot).isSymbolicLink()).toBe(false);
    expect(fs.lstatSync(fixture.legacyRoot).isDirectory()).toBe(true);
    expect(
      fs.readFileSync(path.join(fixture.legacyRoot, relativePacketPath, 'nested', 'payload.bin')),
    ).toEqual(originalBytes);

    expect(fs.lstatSync(fixture.canonicalRoot).isSymbolicLink()).toBe(true);
    expect(fs.readlinkSync(fixture.canonicalRoot)).toBe(path.join('..', 'specs'));

    const quarantinePacketPath = path.join(fixture.quarantinePath, relativePacketPath);
    expect(
      fs.readFileSync(path.join(quarantinePacketPath, 'nested', 'payload.bin')),
    ).toEqual(originalBytes);
  });

  it('refuses to run when a divergent-duplicate packet exists, and mutates nothing', () => {
    const fixture = createFlipFixture();
    const relativePacketPath = path.join(...PACKET_ID.split('/'));
    const canonicalPacketPath = path.join(fixture.canonicalRoot, relativePacketPath);
    writePacket(canonicalPacketPath, 'Canonical packet');
    // `specs` is deliberately a real, divergent directory here (not a symlink) to exercise the
    // manifest's divergent-duplicate guard, which must fire before the symlink-shape check.
    const legacyPacketPath = path.join(fixture.legacyRoot, relativePacketPath);
    writePacket(legacyPacketPath, 'Divergent legacy packet');

    expect(() => flipToTopLevelCanonical(fixture.workspacePath, {
      quarantinePath: fixture.quarantinePath,
    })).toThrow(/divergent-duplicate/);

    expect(fs.existsSync(fixture.canonicalRoot)).toBe(true);
    expect(fs.readFileSync(path.join(canonicalPacketPath, 'spec.md'), 'utf8'))
      .toBe('# Canonical packet\n');
    expect(fs.lstatSync(fixture.legacyRoot).isSymbolicLink()).toBe(false);
    expect(fs.readFileSync(path.join(legacyPacketPath, 'spec.md'), 'utf8'))
      .toBe('# Divergent legacy packet\n');
    expect(fs.existsSync(fixture.quarantinePath)).toBe(false);
  });
});
