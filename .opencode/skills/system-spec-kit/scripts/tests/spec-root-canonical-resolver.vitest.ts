// ───────────────────────────────────────────────────────────────────
// MODULE: Spec Root Canonical Resolver Tests
// ───────────────────────────────────────────────────────────────────

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { resolveSpecFolderCanonical } from '../core/spec-root-canonical-resolver.js';

const PACKET_ID = 'system-speckit/001-canonical-resolver';

let tempDirectory: string;
let workspacePath: string;

function createPacket(rootPath: string): string {
  const packetPath = path.join(rootPath, PACKET_ID);
  fs.mkdirSync(packetPath, { recursive: true });
  return packetPath;
}

describe('resolveSpecFolderCanonical', () => {
  beforeEach(() => {
    tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-root-resolver-'));
    workspacePath = path.join(tempDirectory, 'workspace');
    fs.mkdirSync(workspacePath);
  });

  afterEach(() => {
    fs.rmSync(tempDirectory, { recursive: true, force: true });
  });

  it('prefers the canonical packet for an ambiguous unqualified identity', () => {
    const canonicalPacket = createPacket(path.join(workspacePath, '.opencode', 'specs'));
    createPacket(path.join(workspacePath, 'specs'));

    expect(resolveSpecFolderCanonical(PACKET_ID, workspacePath)).toBe(canonicalPacket);
  });

  it('returns the canonical candidate for a new unqualified packet', () => {
    expect(resolveSpecFolderCanonical(PACKET_ID, workspacePath)).toBe(
      path.join(workspacePath, '.opencode', 'specs', PACKET_ID),
    );
  });

  it('falls back to a unique legacy-only packet for reads', () => {
    const legacyPacket = createPacket(path.join(workspacePath, 'specs'));

    expect(resolveSpecFolderCanonical(PACKET_ID, workspacePath)).toBe(legacyPacket);
  });

  it('preserves an explicit legacy-qualified path when canonical also exists', () => {
    createPacket(path.join(workspacePath, '.opencode', 'specs'));
    const legacyPacket = createPacket(path.join(workspacePath, 'specs'));

    expect(resolveSpecFolderCanonical(`specs/${PACKET_ID}`, workspacePath)).toBe(legacyPacket);
  });

  it('preserves an explicit canonical-qualified path when only legacy exists', () => {
    createPacket(path.join(workspacePath, 'specs'));
    const canonicalPacket = path.join(workspacePath, '.opencode', 'specs', PACKET_ID);

    expect(
      resolveSpecFolderCanonical(`./.opencode/specs/${PACKET_ID}`, workspacePath),
    ).toBe(canonicalPacket);
  });

  it('preserves an absolute path without re-pointing it', () => {
    const explicitPath = path.join(tempDirectory, 'external', 'explicit-packet');

    expect(resolveSpecFolderCanonical(explicitPath, workspacePath)).toBe(explicitPath);
  });

  it('rejects unqualified traversal outside the canonical root', () => {
    expect(() => resolveSpecFolderCanonical('../../../outside', workspacePath)).toThrow(
      /escapes the canonical root/u,
    );
  });
});
