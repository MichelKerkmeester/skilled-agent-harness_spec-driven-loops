// ───────────────────────────────────────────────────────────────────
// MODULE: Projection Runtime Entrypoint Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  decodeExactOriginal,
  projectMessage,
} from '../../src/index.js';
import { PROJECTION_ENABLE_ENV } from '../../src/config/enablement.js';
import { ollamaResponse, openAiResponse } from '../providers/helpers.js';
import {
  RUNTIME_NOW,
  createCompletedGeneration,
  createContextInput,
  createHostedPolicy,
  createHostedProviderRecord,
  createLocalPolicy,
  createLocalProviderRecord,
  createReadyDoctorInput,
  createRuntimePrompt,
} from './helpers.js';

import type {
  PrivacyRoutePolicy,
  ProjectMessageInput,
  ProviderTransport,
  RenderCapabilities,
} from '../../src/index.js';
import type { ReleaseGateDecision } from '../../src/evaluation/index.js';
import type { DatedReleaseEvidence } from '../../src/release/index.js';

const SOURCE = 'deploy the `release` build now.';
const EXPECTED_PROJECTION = 'ship the `release` build today.';
const CAPABILITIES: RenderCapabilities = {
  atomicReplace: true,
  appendAfterOriginal: true,
  sidecar: true,
};

const priorEnv = process.env[PROJECTION_ENABLE_ENV];
afterEach(() => {
  if (priorEnv === undefined) {
    delete process.env[PROJECTION_ENABLE_ENV];
  } else {
    process.env[PROJECTION_ENABLE_ENV] = priorEnv;
  }
});

function localFixture(
  overrides: Partial<ProjectMessageInput> = {},
  sourceText: string = SOURCE,
) {
  const record = createLocalProviderRecord();
  const completed = createCompletedGeneration(sourceText);
  const input: ProjectMessageInput = {
    generation: completed.generation,
    events: completed.events,
    context: createContextInput(),
    prompt: createRuntimePrompt(record),
    records: [record],
    candidateProviderIds: [record.provider.providerId],
    policy: createLocalPolicy(),
    judgeMode: 'disabled',
    capabilities: CAPABILITIES,
    now: RUNTIME_NOW,
    ...overrides,
  };
  return { input, original: completed.original, record };
}

function hostedFixture(overrides: Partial<ProjectMessageInput> = {}) {
  const record = createHostedProviderRecord();
  const completed = createCompletedGeneration(SOURCE);
  const input: ProjectMessageInput = {
    generation: completed.generation,
    events: completed.events,
    context: createContextInput(),
    prompt: createRuntimePrompt(record),
    records: [record],
    candidateProviderIds: [record.provider.providerId],
    policy: createHostedPolicy(),
    judgeMode: 'disabled',
    capabilities: CAPABILITIES,
    now: RUNTIME_NOW,
    ...overrides,
  };
  return { input, original: completed.original };
}

function userContent(request: Parameters<ProviderTransport>[0]): string {
  const messages = (request.body as {
    messages: readonly { role: string; content: string }[];
  }).messages;
  return messages.find((entry) => entry.role === 'user')?.content ?? '';
}

describe('projectMessage', () => {
  it('returns the exact original without a provider call when projection is disabled', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '0';
    const transport = vi.fn<ProviderTransport>();
    const { input } = localFixture({ transport });

    const result = await projectMessage(input);

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'projection-disabled' });
    expect(result.text).toBe(SOURCE);
    expect(transport).not.toHaveBeenCalled();
  });

  it('projects a message end-to-end through a stub local transport', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const transport = vi.fn<ProviderTransport>(async (request) =>
      ollamaResponse(userContent(request).replace('deploy', 'ship').replace(' now', ' today')));
    const { input } = localFixture({ transport });

    const result = await projectMessage(input);

    expect(result.status).toBe('projection');
    if (result.status !== 'projection') {
      throw new Error('Expected a projection.');
    }
    expect(result.text).toBe(EXPECTED_PROJECTION);
    expect(result.mode).toBe('atomic-replace');
    expect(transport).toHaveBeenCalledTimes(1);
  });

  it('projects through a hosted provider with an injected credential status', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const transport = vi.fn<ProviderTransport>(async (request) =>
      openAiResponse(userContent(request).replace('deploy', 'ship').replace(' now', ' today')));
    const { input } = hostedFixture({ transport, credentialStatus: async () => 'available' });

    const result = await projectMessage(input);

    expect(result.status).toBe('projection');
    if (result.status !== 'projection') {
      throw new Error('Expected a projection.');
    }
    expect(result.text).toBe(EXPECTED_PROJECTION);
  });

  it('resolves judgeMode required with the default judge instead of JUDGE_UNAVAILABLE', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const transport = vi.fn<ProviderTransport>(async (request) =>
      ollamaResponse(userContent(request)));
    const { input } = localFixture({ transport, judgeMode: 'required' });

    const result = await projectMessage(input);

    expect(result.status).toBe('projection');
  });

  it('rejects meaning loss with the default judge under judgeMode required', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const degradedSource = 'deploy the service to production and notify the team immediately';
    const transport = vi.fn<ProviderTransport>(async () =>
      ollamaResponse('deploy production notify'));
    const { input } = localFixture({ transport, judgeMode: 'required' }, degradedSource);

    const result = await projectMessage(input);

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'judge-rejected' });
    expect(result.text).toBe(degradedSource);
  });

  it('honors an injected judge rejection with the exact original', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const transport = vi.fn<ProviderTransport>(async (request) =>
      ollamaResponse(userContent(request)));
    const { input } = localFixture({
      transport,
      judgeMode: 'required',
      judge: async () => 'reject',
    });

    const result = await projectMessage(input);

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'judge-rejected' });
    expect(result.text).toBe(SOURCE);
  });

  it('returns the exact original with no egress when the privacy route is denied', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const transport = vi.fn<ProviderTransport>();
    const deniedPolicy: PrivacyRoutePolicy = {
      allowedPrivacyClasses: ['hosted-zdr'],
      egressConsent: false,
      requiredKnownFacts: [],
    };
    const { input } = hostedFixture({ transport, policy: deniedPolicy });

    const result = await projectMessage(input);

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'egress-not-consented' });
    expect(result.text).toBe(SOURCE);
    expect(transport).not.toHaveBeenCalled();
  });

  it('returns the exact original when the provider transport fails', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const transport = vi.fn<ProviderTransport>(async () => ({ status: 503, body: {} }));
    const { input } = localFixture({ transport });

    const result = await projectMessage(input);

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'provider-error' });
    expect(result.text).toBe(SOURCE);
  });

  it('returns the exact original when no terminal event is ingested', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const transport = vi.fn<ProviderTransport>();
    const { input } = localFixture({ transport, events: [] });

    const result = await projectMessage(input);

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'incomplete-assembly' });
    expect(transport).not.toHaveBeenCalled();
  });

  it('leaves the canonical original bytes unchanged across the pipeline', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const transport = vi.fn<ProviderTransport>(async () => ollamaResponse('deploy production notify'));
    const { input, original } = localFixture({ transport });

    const before = Buffer.from(decodeExactOriginal(original)).toString('utf8');
    await projectMessage(input);
    const after = Buffer.from(decodeExactOriginal(original)).toString('utf8');

    expect(before).toBe(SOURCE);
    expect(after).toBe(SOURCE);
  });

  it('fails closed to the exact original when the pre-projection gate blocks', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const transport = vi.fn<ProviderTransport>();
    const { input } = localFixture({
      transport,
      gate: createReadyDoctorInput(createLocalProviderRecord(), RUNTIME_NOW, {
        proposedRuntimes: [],
      }),
    });

    const result = await projectMessage(input);

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'version-unsupported' });
    expect(result.text).toBe(SOURCE);
    expect(transport).not.toHaveBeenCalled();
  });

  it('projects when the pre-projection gate approves a fresh capable combination', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const record = createLocalProviderRecord();
    const completed = createCompletedGeneration(SOURCE);
    const transport = vi.fn<ProviderTransport>(async (request) =>
      ollamaResponse(userContent(request).replace('deploy', 'ship').replace(' now', ' today')));
    const input: ProjectMessageInput = {
      generation: completed.generation,
      events: completed.events,
      context: createContextInput(),
      prompt: createRuntimePrompt(record),
      records: [record],
      candidateProviderIds: [record.provider.providerId],
      policy: createLocalPolicy(),
      judgeMode: 'disabled',
      capabilities: CAPABILITIES,
      now: RUNTIME_NOW,
      transport,
      gate: createReadyDoctorInput(record),
    };

    const result = await projectMessage(input);

    expect(result.status).toBe('projection');
    expect(transport).toHaveBeenCalledTimes(1);
  });

  it('returns the exact original when the evaluation offer consult rejects', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const transport = vi.fn<ProviderTransport>();
    const rejectedEvaluation: DatedReleaseEvidence<ReleaseGateDecision> = {
      result: {
        gateVersion: 'evaluation-release-gate/1.0.0',
        claimTier: 'full-projection',
        evidenceClass: 'human',
        isProvisional: false,
        status: 'fail',
        reasonCode: 'noninferiority-fail',
        releaseApproved: false,
        diagnosticMetricCount: 0,
        strata: [],
      },
      evidenceRef: 'evaluation/failing.json',
      observedAt: '2026-08-11T08:00:00.000Z',
      expiresAt: '2026-08-20T00:00:00.000Z',
    };
    const { input } = localFixture({ transport, evaluation: rejectedEvaluation });

    const result = await projectMessage(input);

    expect(result).toMatchObject({
      status: 'exact-original',
      reasonCode: 'evaluation-verdict-rejected',
    });
    expect(result.text).toBe(SOURCE);
    expect(transport).not.toHaveBeenCalled();
  });
});
