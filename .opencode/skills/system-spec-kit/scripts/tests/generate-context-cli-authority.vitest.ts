// TEST: Generate Context CLI Authority
// Ensures main() preserves explicit CLI targets into runWorkflow
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { buildSessionScopedSaveContextPath } from '../core/save-context-path';

const harness = vi.hoisted(() => ({
  runWorkflow: vi.fn(async () => undefined),
  loadCollectedData: vi.fn(async () => ({ _source: 'file' })),
  collectSessionData: vi.fn(async () => undefined),
}));

vi.mock('../core/workflow', () => ({
  runWorkflow: harness.runWorkflow,
}));

vi.mock('../loaders', () => ({
  loadCollectedData: harness.loadCollectedData,
}));

vi.mock('../extractors/collect-session-data', () => ({
  collectSessionData: harness.collectSessionData,
}));

const ORIGINAL_ARGV = [...process.argv];
const FIXTURE_PACKET = 'specs/system-spec-kit/022-hybrid-rag-fusion';

// main() acquires a lock directory and rewrites parent pointers inside the
// packet it resolves, so the fixture packet lives in a throwaway workspace
// instead of the real specs tree.
let tempRoot = '';

function trackGraphMetadata(track: string): Record<string, unknown> {
  const now = new Date().toISOString();
  return {
    schema_version: 1,
    packet_id: track,
    spec_folder: track,
    parent_id: null,
    children_ids: [],
    manual: { depends_on: [], supersedes: [], related_to: [] },
    derived: {
      trigger_phrases: [],
      key_topics: [track],
      importance_tier: 'normal',
      status: 'in_progress',
      key_files: [],
      entities: [],
      causal_summary: '',
      created_at: now,
      last_save_at: now,
      last_accessed_at: null,
      source_docs: [],
    },
  };
}

function createTempWorkspace(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'generate-context-cli-authority-'));
  const packetDir = path.join(root, FIXTURE_PACKET);
  fs.mkdirSync(packetDir, { recursive: true });
  fs.writeFileSync(path.join(packetDir, 'spec.md'), '# Fixture packet\n', 'utf8');
  // The save path treats a track folder holding NNN- children as a phase parent
  // and rewrites its pointers, so the throwaway track needs the same metadata
  // file a real one carries.
  const trackDir = path.dirname(packetDir);
  fs.writeFileSync(
    path.join(trackDir, 'graph-metadata.json'),
    `${JSON.stringify(trackGraphMetadata(path.basename(trackDir)), null, 2)}\n`,
    'utf8',
  );
  return root;
}

async function resetGenerateContextConfig(): Promise<void> {
  const { CONFIG } = await import('../core');
  CONFIG.DATA_FILE = null;
  CONFIG.SPEC_FOLDER_ARG = null;
}

function mockProcessExit(): ReturnType<typeof vi.spyOn> {
  return vi.spyOn(process, 'exit').mockImplementation(((code?: string | number | null) => {
    throw new Error(`EXIT:${code ?? 0}`);
  }) as never);
}

describe('generate-context CLI authority', () => {
  beforeEach(async () => {
    vi.resetModules();
    harness.runWorkflow.mockClear();
    harness.loadCollectedData.mockClear();
    harness.collectSessionData.mockClear();
    process.argv = [...ORIGINAL_ARGV];
    tempRoot = createTempWorkspace();
    await resetGenerateContextConfig();
  });

  afterEach(async () => {
    process.argv = [...ORIGINAL_ARGV];
    fs.rmSync(tempRoot, { recursive: true, force: true });
    tempRoot = '';
    await resetGenerateContextConfig();
  });

  it('passes JSON-mode data and explicit CLI spec-folder override through main()', async () => {
    const dataFile = buildSessionScopedSaveContextPath('cli-authority-main');
    const explicitSpecFolder = FIXTURE_PACKET;
    process.argv = ['node', path.join('scripts', 'dist', 'memory', 'generate-context.js'), dataFile, explicitSpecFolder];

    const { main } = await import('../memory/generate-context');
    await main(undefined, undefined, tempRoot);

    expect(harness.runWorkflow).toHaveBeenCalledTimes(1);
    const workflowCall = harness.runWorkflow.mock.calls[0]?.[0];
    expect(workflowCall).toMatchObject({
      dataFile,
      specFolderArg: explicitSpecFolder,
      plannerMode: 'plan-only',
      loadDataFn: expect.any(Function),
      collectSessionDataFn: harness.collectSessionData,
      collectedData: undefined,
    });
    await workflowCall?.loadDataFn?.();
    expect(harness.loadCollectedData).toHaveBeenCalledWith({});
  });

  it('forwards explicit --session-id to workflow', async () => {
    const dataFile = buildSessionScopedSaveContextPath('test-session-123');
    const explicitSpecFolder = FIXTURE_PACKET;
    const sessionId = 'test-session-123';
    process.argv = [
      'node',
      path.join('scripts', 'dist', 'memory', 'generate-context.js'),
      '--session-id',
      sessionId,
      dataFile,
      explicitSpecFolder,
    ];

    const { main } = await import('../memory/generate-context');
    await main(undefined, undefined, tempRoot);

    expect(harness.runWorkflow).toHaveBeenCalledTimes(1);
    const workflowCall = harness.runWorkflow.mock.calls[0]?.[0];
    expect(workflowCall).toMatchObject({
      dataFile,
      specFolderArg: explicitSpecFolder,
      sessionId,
      plannerMode: 'plan-only',
      loadDataFn: expect.any(Function),
      collectSessionDataFn: harness.collectSessionData,
      collectedData: undefined,
    });
    await workflowCall?.loadDataFn?.();
    expect(harness.loadCollectedData).toHaveBeenCalledWith({ });
  });

  it('passes stdin JSON as preloaded collectedData and preserves an explicit CLI spec-folder override', async () => {
    const explicitSpecFolder = FIXTURE_PACKET;
    const resolvedSpecFolder = path.resolve(tempRoot, explicitSpecFolder);
    const payload = JSON.stringify({
      specFolder: '.opencode/specs/00--anobel.com/036-hero-contact-success',
      sessionSummary: 'Structured stdin payload should not override an explicit CLI target.',
    });

    const { main } = await import('../memory/generate-context');
    await main(['--stdin', explicitSpecFolder], async () => payload, tempRoot);

    expect(harness.runWorkflow).toHaveBeenCalledTimes(1);
    expect(harness.runWorkflow).toHaveBeenCalledWith(expect.objectContaining({
      dataFile: undefined,
      specFolderArg: resolvedSpecFolder,
      plannerMode: 'plan-only',
      collectedData: expect.objectContaining({
        specFolder: '.opencode/specs/00--anobel.com/036-hero-contact-success',
        sessionSummary: 'Structured stdin payload should not override an explicit CLI target.',
        _source: 'file',
      }),
      loadDataFn: undefined,
      collectSessionDataFn: harness.collectSessionData,
    }));
    expect(harness.loadCollectedData).not.toHaveBeenCalled();
  });

  it('passes inline JSON as preloaded collectedData using the payload spec folder when no explicit override is present', async () => {
    const payloadSpecFolder = FIXTURE_PACKET;
    const resolvedSpecFolder = path.resolve(tempRoot, payloadSpecFolder);
    const payload = JSON.stringify({
      specFolder: payloadSpecFolder,
      sessionSummary: 'Inline JSON should resolve its own spec folder when no override exists.',
    });

    const { main } = await import('../memory/generate-context');
    await main(['--json', payload], undefined, tempRoot);

    expect(harness.runWorkflow).toHaveBeenCalledTimes(1);
    expect(harness.runWorkflow).toHaveBeenCalledWith(expect.objectContaining({
      dataFile: undefined,
      specFolderArg: resolvedSpecFolder,
      plannerMode: 'plan-only',
      collectedData: expect.objectContaining({
        specFolder: payloadSpecFolder,
        sessionSummary: 'Inline JSON should resolve its own spec folder when no override exists.',
        _source: 'file',
      }),
      loadDataFn: undefined,
      collectSessionDataFn: harness.collectSessionData,
    }));
    expect(harness.loadCollectedData).not.toHaveBeenCalled();
  });

  it('keeps target resolution and collectedData shape identical between --stdin and --json for the same payload', async () => {
    const payloadSpecFolder = FIXTURE_PACKET;
    const resolvedSpecFolder = path.resolve(tempRoot, payloadSpecFolder);
    const payload = JSON.stringify({
      specFolder: payloadSpecFolder,
      sessionSummary: 'Equivalent structured payloads should resolve identically across stdin and inline JSON modes.',
      triggerPhrases: ['structured parity', 'stdin json parity'],
    });

    const { main } = await import('../memory/generate-context');

    await main(['--stdin'], async () => payload, tempRoot);
    const stdinCall = harness.runWorkflow.mock.calls.at(-1)?.[0];

    harness.runWorkflow.mockClear();

    await main(['--json', payload], undefined, tempRoot);
    const jsonCall = harness.runWorkflow.mock.calls.at(-1)?.[0];

    expect(stdinCall).toMatchObject({
      dataFile: undefined,
      specFolderArg: resolvedSpecFolder,
      plannerMode: 'plan-only',
      collectedData: expect.objectContaining({
        specFolder: payloadSpecFolder,
        sessionSummary: 'Equivalent structured payloads should resolve identically across stdin and inline JSON modes.',
        _source: 'file',
      }),
    });
    expect(jsonCall).toMatchObject({
      dataFile: undefined,
      specFolderArg: resolvedSpecFolder,
      plannerMode: 'plan-only',
      collectedData: expect.objectContaining({
        specFolder: payloadSpecFolder,
        sessionSummary: 'Equivalent structured payloads should resolve identically across stdin and inline JSON modes.',
        _source: 'file',
      }),
    });
    expect(stdinCall?.specFolderArg).toBe(jsonCall?.specFolderArg);
    expect(stdinCall?.collectedData).toEqual(jsonCall?.collectedData);
  });

  it('allows an empty JSON object through to workflow when an explicit CLI target is present', async () => {
    const explicitSpecFolder = FIXTURE_PACKET;
    const resolvedSpecFolder = path.resolve(tempRoot, explicitSpecFolder);

    const { main } = await import('../memory/generate-context');
    await main(['--json', '{}', explicitSpecFolder], undefined, tempRoot);

    expect(harness.runWorkflow).toHaveBeenCalledTimes(1);
    expect(harness.runWorkflow).toHaveBeenCalledWith(expect.objectContaining({
      dataFile: undefined,
      specFolderArg: resolvedSpecFolder,
      plannerMode: 'plan-only',
      collectedData: { _source: 'file' },
      loadDataFn: undefined,
      collectSessionDataFn: harness.collectSessionData,
    }));
  });

  it('forwards explicit --full-auto to workflow without weakening CLI target authority', async () => {
    const dataFile = buildSessionScopedSaveContextPath('cli-authority-full-auto');
    const explicitSpecFolder = FIXTURE_PACKET;
    process.argv = [
      'node',
      path.join('scripts', 'dist', 'memory', 'generate-context.js'),
      '--full-auto',
      dataFile,
      explicitSpecFolder,
    ];

    const { main } = await import('../memory/generate-context');
    await main(undefined, undefined, tempRoot);

    expect(harness.runWorkflow).toHaveBeenCalledTimes(1);
    const workflowCall = harness.runWorkflow.mock.calls[0]?.[0];
    expect(workflowCall).toMatchObject({
      dataFile,
      specFolderArg: explicitSpecFolder,
      plannerMode: 'full-auto',
      loadDataFn: expect.any(Function),
      collectSessionDataFn: harness.collectSessionData,
      collectedData: undefined,
    });
  });

  it('exits non-zero on malformed inline JSON before calling runWorkflow', async () => {
    const exitSpy = mockProcessExit();

    const { main } = await import('../memory/generate-context');

    await expect(main(['--json', '{'], undefined, tempRoot)).rejects.toThrow('EXIT:1');
    expect(harness.runWorkflow).not.toHaveBeenCalled();
    expect(harness.loadCollectedData).not.toHaveBeenCalled();

    exitSpy.mockRestore();
  });

  it('exits non-zero when stdin/json mode has no explicit or payload target spec folder', async () => {
    const exitSpy = mockProcessExit();
    const payload = JSON.stringify({
      sessionSummary: 'Missing target should fail before workflow execution.',
    });

    const { main } = await import('../memory/generate-context');

    await expect(main(['--stdin'], async () => payload, tempRoot)).rejects.toThrow('EXIT:1');
    expect(harness.runWorkflow).not.toHaveBeenCalled();
    expect(harness.loadCollectedData).not.toHaveBeenCalled();

    exitSpy.mockRestore();
  });

  it('exits non-zero when stdin/json mode resolves an invalid explicit target spec folder', async () => {
    const exitSpy = mockProcessExit();
    const payload = JSON.stringify({
      sessionSummary: 'Invalid target should fail validation before workflow execution.',
    });

    const { main } = await import('../memory/generate-context');

    await expect(main(['--json', payload, 'not-a-spec-folder'], undefined, tempRoot)).rejects.toThrow('EXIT:1');
    expect(harness.runWorkflow).not.toHaveBeenCalled();
    expect(harness.loadCollectedData).not.toHaveBeenCalled();

    exitSpy.mockRestore();
  });

  it('does not accumulate SIGINT or SIGTERM handlers across repeated module imports', async () => {
    const baselineSigintListeners = process.listeners('SIGINT');
    const baselineSigtermListeners = process.listeners('SIGTERM');

    for (let attempt = 0; attempt < 3; attempt++) {
      vi.resetModules();
      await import('../memory/generate-context');
    }

    expect(process.listeners('SIGINT')).toHaveLength(baselineSigintListeners.length);
    expect(process.listeners('SIGTERM')).toHaveLength(baselineSigtermListeners.length);
  });
});
