// ───────────────────────────────────────────────────────────────────
// MODULE: Compatibility Doctor Check Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it, vi } from 'vitest';

import {
  checkCapabilityPresence,
  checkCredentialReferencePresence,
  checkEndpointReachability,
  checkPresentationTier,
  checkPrivacyFactFreshness,
  checkVersionCompatibility,
} from '../../src/doctor/index.js';
import { createOpenCodeGoDeepSeekV4FlashRecord } from '../../src/providers/index.js';
import { SupportMatrix } from '../../src/release/index.js';

import type { DoctorInput } from '../../src/doctor/index.js';

const NOW = '2026-08-12T00:00:00.000Z';

describe('compatibility doctor checks', () => {
  it('blocks an unsupported runtime major', () => {
    const input = createHealthyInput();
    const runtime = firstRuntime(input);
    const finding = checkVersionCompatibility({
      ...input,
      proposedRuntimes: [{
        ...runtime,
        runtimeVersion: '2.0.0',
      }],
    });

    expect(finding).toMatchObject({
      checkId: 'version-compatibility',
      severity: 'block',
      reasonCode: 'runtime-major-unsupported',
    });
  });

  it('blocks an unknown required model capability', () => {
    const input = createHealthyInput();
    const provider = firstProvider(input);
    const unknownProvider = structuredClone({
      ...provider,
      provider: {
        ...provider.provider,
        capabilities: provider.provider.capabilities.map((capability) =>
          capability.name === 'chat'
            ? { ...capability, state: 'unknown' as const, confidence: 'unknown' as const }
            : capability),
      },
    });

    expect(checkCapabilityPresence({
      ...input,
      proposedProviders: [unknownProvider],
    })).toMatchObject({
      checkId: 'capability-presence',
      severity: 'block',
      reasonCode: 'capability-unknown',
    });
  });

  it('blocks stale runtime support evidence', () => {
    const input = createHealthyInput();
    const runtime = firstRuntime(input);
    const supportMatrix = {
      ...SupportMatrix,
      rows: SupportMatrix.rows.map((row) =>
        row.dimension === 'runtime'
          && row.identifier.startsWith(`${runtime.runtime}:${runtime.pathId}@`)
          ? { ...row, expiryDate: '2026-08-11' }
          : row),
    };

    expect(checkVersionCompatibility({ ...input, supportMatrix })).toMatchObject({
      checkId: 'version-compatibility',
      severity: 'block',
      reasonCode: 'version-support-stale',
    });
  });

  it('blocks when the injected endpoint probe reaches its deadline', async () => {
    const reachabilityProbe = vi.fn(async () => ({
      status: 'deadline-exceeded' as const,
      durationMs: 20,
    }));
    const input = {
      ...createHealthyInput(),
      reachabilityProbe,
      perProbeDeadlineMs: 20,
      totalDeadlineMs: 50,
    };

    await expect(checkEndpointReachability(input)).resolves.toMatchObject({
      checkId: 'endpoint-reachability',
      severity: 'block',
      reasonCode: 'endpoint-probe-deadline-exceeded',
    });
    expect(reachabilityProbe).toHaveBeenCalledWith(expect.objectContaining({
      deadlineMs: 20,
      remainingTotalDeadlineMs: 50,
    }));
  });

  it('blocks before probing beyond the injected total deadline', async () => {
    const input = createHealthyInput();
    const first = firstProvider(input);
    const second = structuredClone({
      ...first,
      provider: {
        ...first.provider,
        providerId: 'second-doctor-provider',
        endpoint: 'https://second-provider.example.test/health',
      },
    });
    const reachabilityProbe = vi.fn(async () => ({
      status: 'reachable' as const,
      durationMs: 5,
    }));

    await expect(checkEndpointReachability({
      ...input,
      proposedProviders: [first, second],
      reachabilityProbe,
      perProbeDeadlineMs: 5,
      totalDeadlineMs: 5,
    })).resolves.toMatchObject({
      severity: 'block',
      reasonCode: 'endpoint-total-deadline-exceeded',
    });
    expect(reachabilityProbe).toHaveBeenCalledTimes(1);
  });

  it('blocks a missing credential-reference presence flag', () => {
    const input = createHealthyInput();
    const provider = firstProvider(input);

    expect(checkCredentialReferencePresence({
      ...input,
      credentialReferencePresence: [{
        providerId: provider.provider.providerId,
        present: false,
      }],
    })).toMatchObject({
      checkId: 'credential-reference-presence',
      severity: 'block',
      reasonCode: 'credential-reference-missing',
    });
  });

  it('blocks stale hosted privacy facts', () => {
    expect(checkPrivacyFactFreshness({
      ...createHealthyInput(),
      now: '2026-09-01T00:00:00.000Z',
    })).toMatchObject({
      checkId: 'privacy-fact-freshness',
      severity: 'block',
      reasonCode: 'privacy-fact-expired',
    });
  });

  it('blocks an unsupported presentation tier', () => {
    const input = createHealthyInput();
    const runtime = firstRuntime(input);

    expect(checkPresentationTier({
      ...input,
      proposedRuntimes: [{
        ...runtime,
        presentationTier: 'safe-native',
      }],
    })).toMatchObject({
      checkId: 'presentation-tier',
      severity: 'block',
      reasonCode: 'presentation-tier-unsupported',
    });
  });
});

function createHealthyInput(): DoctorInput {
  const provider = createOpenCodeGoDeepSeekV4FlashRecord({
    credentialReference: 'managed:doctor-test',
  });
  return {
    proposedRuntimes: [{
      runtime: 'opencode',
      pathId: 'opencode-server-sse-stable-client',
      runtimeVersion: '1.18.11',
      protocol: 'opencode-server-sse-stable-client',
      protocolVersion: '3.1.0',
      presentationTier: 'full-projection',
    }],
    proposedProviders: [provider],
    proposedModels: [{
      providerId: provider.provider.providerId,
      modelId: provider.provider.modelId,
      requiredCapabilities: ['chat'],
    }],
    credentialReferencePresence: [{
      providerId: provider.provider.providerId,
      present: true,
    }],
    reachabilityProbe: async () => ({ status: 'reachable', durationMs: 1 }),
    perProbeDeadlineMs: 50,
    totalDeadlineMs: 100,
    now: NOW,
  };
}

function firstRuntime(input: DoctorInput): DoctorInput['proposedRuntimes'][number] {
  const runtime = input.proposedRuntimes[0];
  if (runtime === undefined) {
    throw new Error('Expected a runtime proposal in the test fixture.');
  }
  return runtime;
}

function firstProvider(input: DoctorInput): DoctorInput['proposedProviders'][number] {
  const provider = input.proposedProviders[0];
  if (provider === undefined) {
    throw new Error('Expected a provider proposal in the test fixture.');
  }
  return provider;
}
