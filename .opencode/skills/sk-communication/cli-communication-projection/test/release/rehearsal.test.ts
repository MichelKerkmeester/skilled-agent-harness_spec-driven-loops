// ───────────────────────────────────────────────────────────────────
// MODULE: Deterministic Release Rehearsal Tests
// ───────────────────────────────────────────────────────────────────

import { execFileSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { beforeAll, describe, expect, it, vi } from 'vitest';

import { selectPrivacyRoute } from '../../src/privacy/index.js';
import { executeProviderRoute } from '../../src/providers/index.js';
import {
  OriginalOnlyEmergencyMode,
  planRollback,
} from '../../src/release/index.js';
import {
  NOW,
  createPromptProfile,
  createProviderDocument,
  createProviderMatrix,
  ollamaResponse,
} from '../providers/helpers.js';
import {
  createAcceptedRenderDecision,
  createCanonicalState,
  createRejectedRenderDecision,
} from '../runtimes/helpers.js';
import { RUNTIME_PATH_HARNESSES } from '../runtimes/replay-helpers.js';

import type { ProviderTransport } from '../../src/providers/index.js';
import type {
  RuntimeAdapterResult,
  RuntimePresentationResult,
} from '../../src/runtimes/index.js';

interface PackageExportTarget {
  readonly types: string;
  readonly import: string;
}

interface PackageManifest {
  readonly name: string;
  readonly version: string;
  readonly files: readonly string[];
  readonly bin: Readonly<Record<string, string>>;
  readonly scripts: Readonly<Record<string, string>>;
  readonly exports: Readonly<Record<string, PackageExportTarget>>;
}

interface PackedFile {
  readonly path: string;
}

interface PackResult {
  readonly filename: string;
  readonly files: readonly PackedFile[];
}

interface InstalledReleaseState {
  readonly version: string;
  readonly emergencyMode: typeof OriginalOnlyEmergencyMode;
}

type RuntimeTransportOutcome = RuntimeAdapterResult | RuntimePresentationResult;

interface InjectedRuntimeRequest {
  readonly runtime: string;
  readonly scenario: 'accepted' | 'degraded' | 'rejected';
  execute(): RuntimeTransportOutcome;
}

type InjectedRuntimeTransport = (request: InjectedRuntimeRequest) => RuntimeTransportOutcome;

const PACKAGE_ROOT = fileURLToPath(new URL('../..', import.meta.url));
const RUNTIMES = ['claude', 'codex', 'cursor', 'devin', 'opencode', 'pi'] as const;
const available = async (): Promise<'available'> => 'available';

beforeAll(() => {
  execFileSync('npm', ['run', 'build'], {
    cwd: PACKAGE_ROOT,
    encoding: 'utf8',
    stdio: 'pipe',
  });
});

describe('release rehearsals', () => {
  it('clean-installs the packed artifact and imports every public subpath', async () => {
    await withTemporaryDirectory(async (temporaryDirectory) => {
      const manifest = await readPackageManifest(PACKAGE_ROOT);
      const tarball = packPackage(PACKAGE_ROOT, temporaryDirectory);
      const packedPaths = tarball.files.map((file) => file.path);

      expect(manifest.files).toEqual([
        'dist',
        'docs',
        'bin',
        'enablement.local.json.example',
      ]);
      expect(manifest.bin).toEqual({
        'cli-output-wrapper': './bin/cli-output-wrapper.mjs',
      });
      expect(manifest.scripts.prepare).toBe('npm run build');
      expect(packedPaths).toContain('bin/cli-output-wrapper.mjs');
      expect(packedPaths).toContain('enablement.local.json.example');
      expect(packedPaths.some((path) => path.startsWith('src/'))).toBe(false);
      expect(packedPaths.some((path) => path.startsWith('test/'))).toBe(false);
      expect(packedPaths.some((path) => path.startsWith('node_modules/'))).toBe(false);

      const consumerDirectory = join(temporaryDirectory, 'clean-consumer');
      await initializeConsumer(consumerDirectory);
      installTarball(consumerDirectory, join(temporaryDirectory, tarball.filename));

      const specifiers = Object.keys(manifest.exports).map((subpath) =>
        subpath === '.' ? manifest.name : `${manifest.name}${subpath.slice(1)}`);
      const result = execFileSync(process.execPath, [
        '--input-type=module',
        '--eval',
        `const paths=${JSON.stringify(specifiers)};const loaded=[];for(const path of paths){const module=await import(path);loaded.push([path,Object.keys(module).length]);}console.log(JSON.stringify(loaded));`,
      ], {
        cwd: consumerDirectory,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      const imports = JSON.parse(result) as readonly (readonly [string, number])[];

      expect(imports.map(([specifier]) => specifier)).toEqual(specifiers);
      expect(imports.every(([, exportCount]) => exportCount > 0)).toBe(true);
    });
  });

  it('rehearses six runtimes with injected transports while live credentialed smoke remains operator-run', async () => {
    const acceptedDecision = await createAcceptedRenderDecision('Accepted rehearsal projection.');
    const rejectedDecision = await createRejectedRenderDecision('Rejected rehearsal projection.');
    const degradationDecision = await createAcceptedRenderDecision(
      'Degradation rehearsal projection.',
      { atomicReplace: false, appendAfterOriginal: true, sidecar: true },
    );
    const decisionSnapshot = JSON.stringify({
      acceptedDecision,
      rejectedDecision,
      degradationDecision,
    });
    const transport = vi.fn<InjectedRuntimeTransport>((request) => request.execute());

    for (const runtime of RUNTIMES) {
      const candidates = RUNTIME_PATH_HARNESSES.filter((harness) =>
        harness.record.runtime === runtime);
      const harness = candidates.find((candidate) =>
        candidate.record.presentationTier === 'safe-native') ?? candidates[0];
      if (harness === undefined) {
        throw new Error(`Missing runtime rehearsal harness for '${runtime}'.`);
      }
      const canonical = createCanonicalState(`${runtime} canonical rehearsal state.`);
      const canonicalSnapshot = structuredClone(canonical);

      const accepted = transport({
        runtime,
        scenario: 'accepted',
        execute: () => harness.adaptFinal({ canonical }),
      });
      const rejected = transport({
        runtime,
        scenario: 'rejected',
        execute: () => harness.adaptTerminal('error', { canonical }),
      });
      const degraded = transport({
        runtime,
        scenario: 'degraded',
        execute: () => harness.present(degradationDecision, {
          preferredDegradationModes: ['append', 'sidecar', 'original-only'],
        }),
      });

      expect(accepted).toMatchObject({
        status: 'mapped',
        reasonCode: 'none',
        telemetry: { telemetryVersion: 'runtime-telemetry/1.0.0', runtime },
      });
      expect(rejected).toMatchObject({
        status: 'exact-original',
        reasonCode: 'runtime-failure',
        telemetry: { telemetryVersion: 'runtime-telemetry/1.0.0', runtime },
      });
      expect(['degraded', 'exact-original']).toContain(degraded.status);
      expect(degraded.telemetry).toMatchObject({
        telemetryVersion: 'runtime-telemetry/1.0.0',
        runtime,
      });
      if (degraded.status === 'degraded') {
        expect(degraded).toMatchObject({
          reasonCode: 'atomic-replace-unavailable',
          originalSuppressed: false,
        });
      } else {
        expect(degraded).toMatchObject({
          reasonCode: 'unsupported-presentation',
          originalSuppressed: false,
        });
      }
      expect(canonical).toEqual(canonicalSnapshot);
    }

    expect(transport).toHaveBeenCalledTimes(RUNTIMES.length * 3);
    expect(JSON.stringify({ acceptedDecision, rejectedDecision, degradationDecision }))
      .toBe(decisionSnapshot);
  });

  it('proves local-only configuration makes zero hosted calls with no hidden fallback', async () => {
    const matrix = createProviderMatrix();
    const hosted = matrix.find((record) => record.provider.deploymentMode === 'hosted');
    const local = matrix.find((record) => record.provider.deploymentMode === 'local');
    if (hosted === undefined || local === undefined) {
      throw new Error('Expected local and hosted provider fixtures.');
    }
    const route = selectPrivacyRoute({
      records: [hosted, local],
      candidateProviderIds: [hosted.provider.providerId, local.provider.providerId],
      policy: {
        allowedPrivacyClasses: ['local-offline', 'local-networked'],
        egressConsent: false,
        requiredKnownFacts: [],
      },
      now: NOW,
    });
    const hostedCall = vi.fn();
    const transport = vi.fn<ProviderTransport>(async (request) => {
      if (request.providerId === hosted.provider.providerId) {
        hostedCall();
      }
      return ollamaResponse('Local-only injected result.');
    });

    const result = await executeProviderRoute({
      route,
      prompt: createPromptProfile(local),
      document: createProviderDocument('Local-only deterministic source.'),
      transport,
      credentialStatus: available,
      now: NOW,
    });

    expect(route.status).toBe('approved');
    expect(route.status === 'approved' && route.attempts.map((record) =>
      record.provider.providerId)).toEqual([local.provider.providerId]);
    expect(result).toMatchObject({
      status: 'candidate',
      providerId: local.provider.providerId,
      attemptCount: 1,
    });
    expect(transport).toHaveBeenCalledOnce();
    expect(hostedCall).not.toHaveBeenCalled();
  });

  it('upgrades and downgrades local tarballs while original-only remains available', async () => {
    await withTemporaryDirectory(async (temporaryDirectory) => {
      const previousTarball = await createVersionedTarball(temporaryDirectory, '0.0.9');
      const nextTarball = await createVersionedTarball(temporaryDirectory, '0.1.0');
      const consumerDirectory = join(temporaryDirectory, 'version-consumer');
      await initializeConsumer(consumerDirectory);

      installTarball(consumerDirectory, previousTarball);
      const beforeUpgrade = await inspectInstalledRelease(consumerDirectory);
      installTarball(consumerDirectory, nextTarball);
      const afterUpgrade = await inspectInstalledRelease(consumerDirectory);
      installTarball(consumerDirectory, previousTarball);
      const afterDowngrade = await inspectInstalledRelease(consumerDirectory);

      expect([beforeUpgrade.version, afterUpgrade.version, afterDowngrade.version])
        .toEqual(['0.0.9', '0.1.0', '0.0.9']);
      for (const state of [beforeUpgrade, afterUpgrade, afterDowngrade]) {
        expect(state.emergencyMode).toEqual(OriginalOnlyEmergencyMode);
      }
    });
  });

  it('restores original-only from a local rollback artifact without network', () => {
    const network = vi.fn();
    const plan = planRollback({
      previousPackageVersion: '0.0.9',
      canonicalTranscriptDigest: `sha256:${'a'.repeat(64)}`,
      trigger: 'operator-request',
    });
    const restoredVersions: string[] = [];

    for (const step of plan.steps) {
      if (step.action === 'restore-previous-package') {
        restoredVersions.push(step.packageVersion);
      }
      if (step.action === 'select-original-only' && step.networkRequired) {
        network();
      }
    }

    expect(plan.emergencyMode).toBe(OriginalOnlyEmergencyMode);
    expect(plan.mutatesCanonicalTranscript).toBe(false);
    expect(restoredVersions).toEqual(['0.0.9']);
    expect(network).not.toHaveBeenCalled();
  });
});

async function withTemporaryDirectory<TResult>(
  operation: (temporaryDirectory: string) => Promise<TResult>,
): Promise<TResult> {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), 'communication-projection-release-'));
  try {
    return await operation(temporaryDirectory);
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
}

async function initializeConsumer(consumerDirectory: string): Promise<void> {
  await mkdir(consumerDirectory, { recursive: true });
  await writeFile(join(consumerDirectory, 'package.json'), JSON.stringify({
    name: 'release-rehearsal-consumer',
    private: true,
    type: 'module',
  }), 'utf8');
}

function installTarball(consumerDirectory: string, tarballPath: string): void {
  execFileSync('npm', [
    'install',
    '--offline',
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
    '--save-exact',
    tarballPath,
  ], {
    cwd: consumerDirectory,
    encoding: 'utf8',
    env: {
      ...process.env,
      npm_config_cache: join(consumerDirectory, '.npm-cache'),
    },
    stdio: 'pipe',
  });
}

function packPackage(
  packageDirectory: string,
  destination: string,
  ignoreScripts = false,
): PackResult {
  const args = [
    'pack',
    '--json',
    '--pack-destination',
    destination,
    ...(ignoreScripts ? ['--ignore-scripts'] : []),
  ];
  const output = execFileSync('npm', args, {
    cwd: packageDirectory,
    encoding: 'utf8',
    env: {
      ...process.env,
      npm_config_cache: join(destination, '.npm-cache'),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const results = JSON.parse(output) as readonly PackResult[];
  const result = results[0];
  if (result === undefined) {
    throw new Error('npm pack did not return an artifact.');
  }
  return result;
}

async function createVersionedTarball(
  temporaryDirectory: string,
  version: string,
): Promise<string> {
  const stagingDirectory = join(temporaryDirectory, `package-${version}`);
  const artifactDirectory = join(temporaryDirectory, 'artifacts');
  await mkdir(stagingDirectory, { recursive: true });
  await mkdir(artifactDirectory, { recursive: true });
  await cp(join(PACKAGE_ROOT, 'dist'), join(stagingDirectory, 'dist'), { recursive: true });
  await cp(join(PACKAGE_ROOT, 'docs'), join(stagingDirectory, 'docs'), { recursive: true });
  const manifest = await readPackageManifest(PACKAGE_ROOT);
  await writeFile(join(stagingDirectory, 'package.json'), JSON.stringify({
    ...manifest,
    version,
  }, null, 2), 'utf8');
  const packed = packPackage(stagingDirectory, artifactDirectory, true);
  return join(artifactDirectory, packed.filename);
}

async function inspectInstalledRelease(
  consumerDirectory: string,
): Promise<InstalledReleaseState> {
  const packageDirectory = resolve(
    consumerDirectory,
    'node_modules/@portable-cli/communication-projection',
  );
  const manifest = await readPackageManifest(packageDirectory);
  const output = execFileSync(process.execPath, [
    '--input-type=module',
    '--eval',
    "const module=await import('@portable-cli/communication-projection/release');console.log(JSON.stringify(module.OriginalOnlyEmergencyMode));",
  ], {
    cwd: consumerDirectory,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return {
    version: manifest.version,
    emergencyMode: JSON.parse(output) as typeof OriginalOnlyEmergencyMode,
  };
}

async function readPackageManifest(packageDirectory: string): Promise<PackageManifest> {
  const serialized = await readFile(join(packageDirectory, 'package.json'), 'utf8');
  return JSON.parse(serialized) as PackageManifest;
}
