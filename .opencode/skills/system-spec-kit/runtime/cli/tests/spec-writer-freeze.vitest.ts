// ───────────────────────────────────────────────────────────────────
// MODULE: Spec Writer Freeze Tests
// ───────────────────────────────────────────────────────────────────

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type WriterFreezeModule = typeof import('../core/spec-writer-freeze.js');

const FREEZE_DIR_ENV = 'SPEC_KIT_WRITER_FREEZE_DIR';

let freezeDirectory: string;
let freezeMarkerPath: string;
let writerFreeze: WriterFreezeModule;

async function loadWriterFreeze(): Promise<WriterFreezeModule> {
  vi.resetModules();
  return import('../core/spec-writer-freeze.js');
}

describe('spec packet writer freeze', () => {
  beforeEach(async () => {
    freezeDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-writer-freeze-'));
    const userId = typeof process.getuid === 'function' ? String(process.getuid()) : 'user';
    freezeMarkerPath = path.join(freezeDirectory, `spec-kit-writers-${userId}.freeze`);
    vi.stubEnv(FREEZE_DIR_ENV, freezeDirectory);
    writerFreeze = await loadWriterFreeze();
  });

  afterEach(() => {
    try {
      writerFreeze.unfreezeWriters();
    } catch (_error: unknown) {
      // Fixture cleanup below removes only this test's isolated runtime directory.
    }
    fs.rmSync(freezeDirectory, { recursive: true, force: true });
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('allows writes when no marker or process freeze exists', () => {
    expect(writerFreeze.isWritersFrozen()).toBe(false);
    expect(() => writerFreeze.assertWritersUnfrozen()).not.toThrow();
  });

  it('creates a durable marker and reports the freeze reason', () => {
    writerFreeze.freezeWriters('canonicalization in progress');

    expect(writerFreeze.isWritersFrozen()).toBe(true);
    expect(fs.existsSync(freezeMarkerPath)).toBe(true);
    expect(JSON.parse(fs.readFileSync(freezeMarkerPath, 'utf8'))).toMatchObject({
      version: 1,
      reason: 'canonicalization in progress',
      pid: process.pid,
    });
    expect(() => writerFreeze.assertWritersUnfrozen()).toThrow(
      /Spec packet writers are frozen\. Reason: canonicalization in progress/u,
    );
  });

  it('observes the marker from a fresh module instance without overwriting it', async () => {
    writerFreeze.freezeWriters('first owner');
    const markerBefore = fs.readFileSync(freezeMarkerPath, 'utf8');
    const secondInstance = await loadWriterFreeze();

    secondInstance.freezeWriters('second owner');

    expect(secondInstance.isWritersFrozen()).toBe(true);
    expect(fs.readFileSync(freezeMarkerPath, 'utf8')).toBe(markerBefore);
    expect(() => secondInstance.assertWritersUnfrozen()).toThrow(/Reason: first owner/u);
    secondInstance.unfreezeWriters();
    writerFreeze = secondInstance;
  });

  it('atomically clears the marker and process state', () => {
    writerFreeze.freezeWriters('temporary migration window');

    writerFreeze.unfreezeWriters();

    expect(fs.existsSync(freezeMarkerPath)).toBe(false);
    expect(writerFreeze.isWritersFrozen()).toBe(false);
    expect(() => writerFreeze.assertWritersUnfrozen()).not.toThrow();
  });

  it('fails closed for an ambiguous marker', () => {
    fs.mkdirSync(freezeMarkerPath);

    expect(writerFreeze.isWritersFrozen()).toBe(true);
    expect(() => writerFreeze.assertWritersUnfrozen()).toThrow(
      /Spec packet writers are frozen/u,
    );
  });

  it('fails closed when the runtime marker directory cannot be inspected', () => {
    fs.rmSync(freezeDirectory, { recursive: true, force: true });

    expect(writerFreeze.isWritersFrozen()).toBe(true);
    expect(() => writerFreeze.assertWritersUnfrozen()).toThrow(
      /Spec packet writers are frozen/u,
    );
  });

  it('rejects an empty freeze reason without creating a marker', () => {
    expect(() => writerFreeze.freezeWriters('   ')).toThrow(/non-empty reason/u);
    expect(fs.existsSync(freezeMarkerPath)).toBe(false);
    expect(writerFreeze.isWritersFrozen()).toBe(false);
  });
});
