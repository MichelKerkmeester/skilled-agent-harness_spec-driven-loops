// ───────────────────────────────────────────────────────────────────
// MODULE: Compatibility Doctor Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { runCompatibilityDoctor } from '../../src/doctor/index.js';
import {
  createOllamaModelRecord,
  createOpenCodeGoDeepSeekV4FlashRecord,
} from '../../src/providers/index.js';

import type {
  DoctorInput,
  DoctorReachabilityProbeResult,
} from '../../src/doctor/index.js';
import type { ProviderModelRecord } from '../../src/providers/index.js';

const NOW = '2026-08-12T00:00:00.000Z';

describe('compatibility doctor', () => {
  it('reports a healthy hosted configuration as ready', async () => {
    const report = await runCompatibilityDoctor(createHostedInput());

    expect(report).toMatchObject({
      overallDecision: 'ready',
      routeSelection: 'proposed',
      contentFree: true,
    });
    expect(report.findings).toHaveLength(6);
    expect(report.findings.every((finding) => finding.severity === 'ok')).toBe(true);
  });

  it('reports a provisional local configuration as degraded', async () => {
    const provider = createOllamaModelRecord({
      modelId: 'operator-model',
      privacyClass: 'local-offline',
      observedAt: '2026-08-11T00:00:00.000Z',
      capabilitiesExpireAt: '2026-08-20T00:00:00.000Z',
    });
    const report = await runCompatibilityDoctor(createInput(provider, []));

    expect(report).toMatchObject({
      overallDecision: 'degraded',
      routeSelection: 'proposed',
    });
    expect(report.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({
        checkId: 'capability-presence',
        severity: 'warn',
        reasonCode: 'model-support-provisional',
      }),
    ]));
    expect(report.findings.some((finding) => finding.severity === 'block')).toBe(false);
  });

  it('selects original-only whenever a critical check blocks', async () => {
    const input = createHostedInput();
    const runtime = firstRuntime(input);
    const report = await runCompatibilityDoctor({
      ...input,
      proposedRuntimes: [{
        ...runtime,
        protocolVersion: '4.0.0',
      }],
    });

    expect(report).toMatchObject({
      overallDecision: 'blocked',
      routeSelection: 'original-only',
    });
  });

  it('selects original-only for an unrecognized endpoint probe status', async () => {
    const report = await runCompatibilityDoctor({
      ...createHostedInput(),
      reachabilityProbe: async () => ({
        status: 'dns-failure',
        durationMs: 1,
      } as unknown as DoctorReachabilityProbeResult),
    });

    expect(report).toMatchObject({
      overallDecision: 'blocked',
      routeSelection: 'original-only',
    });
    expect(report.findings).toContainEqual(expect.objectContaining({
      checkId: 'endpoint-reachability',
      severity: 'block',
      reasonCode: 'endpoint-reachability-unknown',
    }));
  });

  it('never includes a credential value or raw content in its report', async () => {
    const credentialCanary = 'credential-value-CANARY-7f08';
    const contentCanary = 'raw-message-content-CANARY-b3bd';
    const baseProvider = createOpenCodeGoDeepSeekV4FlashRecord({
      credentialReference: `managed:${credentialCanary}`,
    });
    const provider = structuredClone({
      ...baseProvider,
      provider: {
        ...baseProvider.provider,
        endpoint: `https://doctor-canary.example.test/${contentCanary}`,
      },
    });
    const input = createInput(provider, [{
      providerId: provider.provider.providerId,
      present: false,
    }]);
    const report = await runCompatibilityDoctor({
      ...input,
      reachabilityProbe: async ({ endpoint }) => {
        expect(endpoint).toContain(contentCanary);
        return { status: 'unreachable' as const, durationMs: 1 };
      },
    });
    const serialized = JSON.stringify(report);

    expect(report.overallDecision).toBe('blocked');
    expect(serialized).not.toContain(credentialCanary);
    expect(serialized).not.toContain(contentCanary);
    expect(serialized).not.toContain(provider.provider.credentialReference);
    expect(serialized).not.toContain(provider.provider.endpoint);
    expect(Object.keys(report).sort()).toEqual([
      'contentFree',
      'findings',
      'overallDecision',
      'reportVersion',
      'routeSelection',
    ]);
  });

  it('returns a blocked content-free report for malformed input', async () => {
    const input = createHostedInput();
    const provider = structuredClone(input.proposedProviders[0]) as unknown as {
      provider: Record<string, unknown>;
    };
    delete provider.provider.capabilities;
    const malformedInput = {
      ...input,
      proposedProviders: [provider],
    } as unknown as DoctorInput;

    await expect(runCompatibilityDoctor(malformedInput)).resolves.toMatchObject({
      overallDecision: 'blocked',
      routeSelection: 'original-only',
      contentFree: true,
      findings: [{
        checkId: 'input-validation',
        severity: 'block',
        reasonCode: 'input-malformed',
      }],
    });
  });
});

function createHostedInput(): DoctorInput {
  const provider = createOpenCodeGoDeepSeekV4FlashRecord({
    credentialReference: 'managed:doctor-test',
  });
  return createInput(provider, [{
    providerId: provider.provider.providerId,
    present: true,
  }]);
}

function createInput(
  provider: ProviderModelRecord,
  credentialReferencePresence: DoctorInput['credentialReferencePresence'],
): DoctorInput {
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
    credentialReferencePresence,
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
