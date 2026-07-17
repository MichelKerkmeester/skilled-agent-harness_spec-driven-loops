// ───────────────────────────────────────────────────────────────────
// MODULE: Spec Root Writer Autosave Tests
// ───────────────────────────────────────────────────────────────────

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const harness = vi.hoisted(() => ({
  runWorkflow: vi.fn(async () => undefined),
  releaseFilesystemLock: vi.fn(),
  loadCollectedData: vi.fn(async () => ({ _source: 'file' })),
  collectSessionData: vi.fn(async () => undefined),
}));

vi.mock('@spec-kit/mcp-server/api', () => ({
  graphMetadataSchema: { parse: vi.fn((value: unknown) => value) },
}));

vi.mock('../core/workflow', () => ({
  runWorkflow: harness.runWorkflow,
  releaseFilesystemLock: harness.releaseFilesystemLock,
}));

vi.mock('../loaders', () => ({
  loadCollectedData: harness.loadCollectedData,
}));

vi.mock('../extractors/collect-session-data', () => ({
  collectSessionData: harness.collectSessionData,
}));

vi.mock('../spec/is-phase-parent', () => ({
  isPhaseParent: () => false,
}));

const FREEZE_DIR_ENV = 'SPEC_KIT_WRITER_FREEZE_DIR';
const PACKET_ID = '123-bare-save';
const SCRIPTS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKILL_ROOT = path.resolve(SCRIPTS_DIR, '..');

let tempRoot: string;

describe('spec-root autosave writer', () => {
  beforeEach(() => {
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-root-writer-'));
    const freezeDirectory = path.join(tempRoot, 'freeze');
    fs.mkdirSync(freezeDirectory);
    vi.stubEnv(FREEZE_DIR_ENV, freezeDirectory);
    harness.runWorkflow.mockClear();
  });

  afterEach(() => {
    fs.rmSync(tempRoot, { recursive: true, force: true });
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('resolves a bare packet identity to the canonical packet before saving', async () => {
    const workspacePath = path.join(tempRoot, 'workspace');
    const canonicalPacket = path.join(workspacePath, '.opencode', 'specs', PACKET_ID);
    fs.mkdirSync(canonicalPacket, { recursive: true });
    fs.writeFileSync(path.join(canonicalPacket, 'spec.md'), '# Bare save\n', 'utf8');

    const { CONFIG } = await import('../core');
    CONFIG.PROJECT_ROOT = workspacePath;
    CONFIG.DATA_FILE = null;
    CONFIG.SPEC_FOLDER_ARG = null;

    const { main } = await import('../memory/generate-context');
    await main(['--json', JSON.stringify({ specFolder: PACKET_ID })]);

    expect(harness.runWorkflow).toHaveBeenCalledWith(expect.objectContaining({
      specFolderArg: canonicalPacket,
    }));
    expect(fs.existsSync(path.join(workspacePath, 'specs'))).toBe(false);
  });

  it('creates untracked packets under the canonical root', () => {
    const workspacePath = path.join(tempRoot, 'create-workspace');
    const fixtureScripts = path.join(
      workspacePath,
      '.opencode',
      'skills',
      'system-spec-kit',
      'scripts',
    );
    fs.mkdirSync(path.join(workspacePath, '.specify'), { recursive: true });
    fs.mkdirSync(path.join(fixtureScripts, 'spec'), { recursive: true });
    fs.mkdirSync(path.join(fixtureScripts, 'lib'), { recursive: true });
    fs.mkdirSync(path.join(fixtureScripts, 'templates'), { recursive: true });
    fs.cpSync(
      path.join(SCRIPTS_DIR, 'spec', 'create.sh'),
      path.join(fixtureScripts, 'spec', 'create.sh'),
    );
    for (const library of ['shell-common.sh', 'git-branch.sh', 'template-utils.sh']) {
      fs.cpSync(
        path.join(SCRIPTS_DIR, 'lib', library),
        path.join(fixtureScripts, 'lib', library),
      );
    }
    fs.cpSync(
      path.join(SCRIPTS_DIR, 'templates', 'inline-gate-renderer.sh'),
      path.join(fixtureScripts, 'templates', 'inline-gate-renderer.sh'),
    );
    fs.cpSync(
      path.join(SKILL_ROOT, 'templates'),
      path.join(workspacePath, '.opencode', 'skills', 'system-spec-kit', 'templates'),
      { recursive: true },
    );

    const rawOutput = execFileSync(
      'bash',
      [
        path.join(fixtureScripts, 'spec', 'create.sh'),
        '--json',
        '--skip-branch',
        '--number',
        '123',
        'Canonical create',
      ],
      { cwd: workspacePath, encoding: 'utf8', stdio: 'pipe' },
    );
    const result = JSON.parse(rawOutput) as { SPEC_FILE: string };

    expect(result.SPEC_FILE.startsWith(path.join(
      workspacePath,
      '.opencode',
      'specs',
    ))).toBe(true);
    expect(fs.existsSync(path.dirname(result.SPEC_FILE))).toBe(true);
    expect(fs.existsSync(path.join(workspacePath, 'specs'))).toBe(false);
  });
});
