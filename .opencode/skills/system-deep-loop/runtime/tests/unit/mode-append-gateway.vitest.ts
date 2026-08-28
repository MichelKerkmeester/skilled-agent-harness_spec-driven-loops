// ───────────────────────────────────────────────────────────────────
// MODULE: Mode Append Gateway Tests
// ───────────────────────────────────────────────────────────────────
//
// Tests the deep-loop mode append gateway, which provides the code-level
// write path for mode state. The gateway validates, authorizes, fences,
// and projects each event.

import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { AppendOnlyLedger } from '../../lib/authorized-ledger/index.js';
import { TransitionAuthorizationGateway } from '../../lib/authorized-ledger/index.js';
import { TransitionPolicyRegistry } from '../../lib/authorized-ledger/index.js';
import { AuthorizationVerdicts, AuthorizationReasonCodes } from '../../lib/authorized-ledger/index.js';
import { appendModeEvent, ModeAppendGatewayErrorCodes } from '../../lib/mode-append-gateway/index.js';
import { resolveAuthorityRoot } from '../../lib/authority-root/index.js';
import { createFixtureEventRegistry, createFixturePolicyRegistry } from '../fixtures/authorized-ledger-fixtures.js';
import { prepareEventWrite } from '../../lib/event-envelope/index.js';
import {
  createDeepResearchEventRegistry,
  prepareDeepResearchEvent,
} from '../../lib/deep-research-ledger-schema/index.js';

import type { EventWritePreflight } from '../../lib/event-envelope/index.js';
import type { EventTypeRegistry } from '../../lib/event-envelope/index.js';
import type { ResolvedCutoverBinding } from '../../lib/cutover-binding/index.js';
import type { LegacyProjectionEngine } from '../../lib/legacy-projections/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURE HELPERS
// ───────────────────────────────────────────────────────────────────

const FIXTURE_LEDGER_ID = 'test-mode-ledger';
const FIXTURE_AUDIT_LEDGER_ID = 'test-audit-ledger';
const FIXTURE_AUTHORITY = { state: 'legacy_authoritative' as const, epoch: 1 };

const temporaryRoots: string[] = [];

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `mode-append-gateway-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function createTestHarness(rootDirectory: string) {
  const registry = createFixtureEventRegistry();
  const policies = createFixturePolicyRegistry();
  const authorityProvider = () => FIXTURE_AUTHORITY;

  const ledger = new AppendOnlyLedger(
    {
      rootDirectory,
      ledgerId: FIXTURE_LEDGER_ID,
      auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
      authorityProvider,
    },
    registry,
  );

  const gateway = new TransitionAuthorizationGateway(
    {
      rootDirectory,
      auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
      authorityProvider,
      identityResolver: (context) => ({
        actorId: context.evaluationInput.actorId,
        capabilityId: 'write', // Map to the fixture policy's expected capabilityId
        evidenceDigest: context.evaluationInput.evidenceDigest,
      }),
    },
    ledger,
    policies,
  );

  // Get the real policy digest from the fixture registry
  const policy = policies.resolve('fixture-capability-policy', 1);

  return { rootDirectory, registry, policies, ledger, gateway, policyDigest: policy.digest };
}

function createTestEvent(registry: EventTypeRegistry, iteration: number): EventWritePreflight {
  return prepareEventWrite({
    envelope_version: 1,
    event_id: `test-event-${iteration}`,
    event_type: 'deep-loop.fixture.state-recorded',
    event_version: 1,
    stream_id: FIXTURE_LEDGER_ID,
    stream_sequence: iteration,
    occurred_at: new Date().toISOString(),
    recorded_at: new Date().toISOString(),
    producer: { name: 'test', version: '1' },
    authority_epoch: 1,
    correlation_id: `test-correlation-${iteration}`,
    causation_id: null,
    idempotency_key: `test-key-${iteration}`,
    payload: { label: `event-${iteration}`, value: iteration },
  }, registry);
}

function createTestBinding(): ResolvedCutoverBinding {
  return {
    actorId: 'test@example.com',
    capabilityId: 'write', // Match the fixture policy's expectation
    candidateSha: 'abc123def456',
    baseSha: '000000000000',
    requestId: 'test-request-id',
    correlationId: 'test-correlation-id',
    streamId: 'test-stream-id',
    decidedAt: new Date().toISOString(),
  };
}

// ───────────────────────────────────────────────────────────────────
// 2. CLEANUP
// ───────────────────────────────────────────────────────────────────

afterEach(() => {
  for (const root of temporaryRoots) {
    try {
      rmSync(root, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  }
  temporaryRoots.length = 0;
});

// ───────────────────────────────────────────────────────────────────
// 3. TESTS
// ───────────────────────────────────────────────────────────────────

describe('mode append gateway', () => {
  it('happy path: append and read the event back through the ledger', async () => {
    const rootDirectory = temporaryRoot('happy-path');
    const authorityRoot = temporaryRoot('happy-path-auth');
    const { ledger, gateway, policies, registry } = createTestHarness(rootDirectory);

    const event = createTestEvent(registry, 1);
    const result = await appendModeEvent({
      mode: 'deep-research',
      runDirectory: rootDirectory,
      eventRecord: event,
      authorityRoot,
      policy: {
        policyId: 'fixture-capability-policy',
        policyVersion: 1,
        policyDigest: '0'.repeat(64),
      },
      policyRegistry: policies,
      authorizationGateway: gateway,
      ledger,
      binding: createTestBinding(),
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.receipt.ledgerId).toBe(FIXTURE_LEDGER_ID);
      expect(result.receipt.sequence).toBe(1);

      // Read the event back through the ledger's own read path
      const events = await ledger.readVerifiedEvents();
      expect(events).toHaveLength(1);
      expect(events[0].event.effective.envelope.event_id).toBe('test-event-1');
      expect(events[0].event.effective.envelope.payload).toEqual({
        label: 'event-1',
        value: 1,
      });
    }
  });

  it('refusal: malformed envelope is rejected by authorization', async () => {
    const rootDirectory = temporaryRoot('malformed-envelope');
    const authorityRoot = temporaryRoot('malformed-auth');
    const { ledger, gateway, policies } = createTestHarness(rootDirectory);

    // Create an event with invalid structure - we'll manually construct
    // a malformed EventWritePreflight since the registry would validate it
    const malformedEvent = {
      envelope: {
        event_id: '', // Invalid: empty
        event_type: 'test.event',
        event_version: 1,
        stream_id: FIXTURE_LEDGER_ID,
        stream_sequence: 1,
        occurred_at: new Date().toISOString(),
        recorded_at: new Date().toISOString(),
        producer: { name: 'test', version: '1' },
        authority_epoch: 1,
        correlation_id: 'test-correlation',
        causation_id: null,
        idempotency_key: 'test-key',
      },
      identity: {
        eventId: '',
        eventType: 'test.event',
        eventVersion: 1,
        streamId: FIXTURE_LEDGER_ID,
        streamSequence: 1,
        authorityEpoch: 1,
        idempotencyKey: 'test-key',
      },
      canonicalDigest: '',
      canonicalBytes: [],
      registryDigest: '',
    } as EventWritePreflight;

    const result = await appendModeEvent({
      mode: 'deep-research',
      runDirectory: rootDirectory,
      eventRecord: malformedEvent,
      authorityRoot,
      policy: {
        policyId: 'fixture-capability-policy',
        policyVersion: 1,
        policyDigest: '0'.repeat(64),
      },
      policyRegistry: policies,
      authorizationGateway: gateway,
      ledger,
      binding: createTestBinding(),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.phase).toBe('authorization');
      expect(result.code).toBe(ModeAppendGatewayErrorCodes.AUTHORIZATION_DENIED);
    }
  });

  it('refusal: authorization denied returns named reason', async () => {
    const rootDirectory = temporaryRoot('auth-denied');
    const authorityRoot = temporaryRoot('auth-denied-auth');
    const { ledger, gateway, policies, registry } = createTestHarness(rootDirectory);

    // Create a policy that denies
    const denyPolicy = {
      policyId: 'deny-policy',
      policyVersion: 1,
      evaluatorVersion: '1',
      ruleIds: ['deny-all'],
      evaluate: () => ({
        verdict: AuthorizationVerdicts.DENY,
        reasonCode: AuthorizationReasonCodes.POLICY_DENIED,
        matchedRuleIds: ['deny-all'],
      }),
    };

    const denyPolicies = new TransitionPolicyRegistry([denyPolicy]);

    const event = createTestEvent(registry, 1);
    const result = await appendModeEvent({
      mode: 'deep-research',
      runDirectory: rootDirectory,
      eventRecord: event,
      authorityRoot,
      policy: {
        policyId: 'deny-policy',
        policyVersion: 1,
        policyDigest: '0'.repeat(64),
      },
      policyRegistry: denyPolicies,
      authorizationGateway: gateway,
      ledger,
      binding: createTestBinding(),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.phase).toBe('authorization');
      expect(result.code).toBe(ModeAppendGatewayErrorCodes.AUTHORIZATION_DENIED);
      expect(result.reason).toContain('Authorization denied');
    }
  });

  it('concurrency: two racing appends both succeed with total order', async () => {
    const rootDirectory = temporaryRoot('concurrency');
    const authorityRoot = temporaryRoot('concurrency-auth');
    const { ledger, gateway, policies, registry } = createTestHarness(rootDirectory);

    const event1 = createTestEvent(registry, 1);
    const event2 = createTestEvent(registry, 2);

    // Launch both appends concurrently
    const [result1, result2] = await Promise.all([
      appendModeEvent({
        mode: 'deep-research',
        runDirectory: rootDirectory,
        eventRecord: event1,
        authorityRoot,
        policy: {
          policyId: 'fixture-capability-policy',
          policyVersion: 1,
          policyDigest: '0'.repeat(64),
        },
        policyRegistry: policies,
        authorizationGateway: gateway,
        ledger,
        binding: createTestBinding(),
      }),
      appendModeEvent({
        mode: 'deep-research',
        runDirectory: rootDirectory,
        eventRecord: event2,
        authorityRoot,
        policy: {
          policyId: 'fixture-capability-policy',
          policyVersion: 1,
          policyDigest: '0'.repeat(64),
        },
        policyRegistry: policies,
        authorizationGateway: gateway,
        ledger,
        binding: createTestBinding(),
      }),
    ]);

    // Both should succeed
    expect(result1.ok).toBe(true);
    expect(result2.ok).toBe(true);

    if (result1.ok && result2.ok) {
      // Sequences should be different and sequential
      expect(result1.receipt.sequence).not.toBe(result2.receipt.sequence);
      const minSeq = Math.min(result1.receipt.sequence, result2.receipt.sequence);
      const maxSeq = Math.max(result1.receipt.sequence, result2.receipt.sequence);
      expect(minSeq).toBe(1);
      expect(maxSeq).toBe(2);

      // Read the ledger and verify total order
      const events = await ledger.readVerifiedEvents();
      expect(events).toHaveLength(2);

      // Verify the events are in sequence order
      expect(events[0].frame.sequence).toBe(1);
      expect(events[1].frame.sequence).toBe(2);

      // Verify no lost writes: both events should be present
      const eventIds = new Set(
        events.map((e) => e.event.effective.envelope.event_id),
      );
      expect(eventIds).toContain('test-event-1');
      expect(eventIds).toContain('test-event-2');
    }
  });

  it('projection not attempted (pre-flight config gap): append succeeds with the reason surfaced', async () => {
    const rootDirectory = temporaryRoot('projection-config-gap');
    const authorityRoot = temporaryRoot('proj-config-gap-auth');
    const { ledger, gateway, policies, registry } = createTestHarness(rootDirectory);

    const event = createTestEvent(registry, 1);
    const result = await appendModeEvent({
      mode: 'deep-research',
      runDirectory: rootDirectory,
      eventRecord: event,
      authorityRoot,
      policy: {
        policyId: 'fixture-capability-policy',
        policyVersion: 1,
        policyDigest: '0'.repeat(64),
      },
      policyRegistry: policies,
      authorizationGateway: gateway,
      ledger,
      binding: createTestBinding(),
    });

    // The fixture registry digest cannot match the default projection registry,
    // so the refresh is never attempted at the engine. That is a config gap, not
    // a runtime ledger-vs-shadow divergence: the append stays durable and the
    // reason is surfaced on the success outcome rather than silently lost.
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.projectionRefreshed).toBe(false);
      expect(result.projectionError).toBe('Event registry digest mismatch for mode deep-research');
      expect(result.receipt.ledgerId).toBe(FIXTURE_LEDGER_ID);
      expect(result.receipt.sequence).toBe(1);
    }

    const events = await ledger.readVerifiedEvents();
    expect(events).toHaveLength(1);
  });

  it('projection engine failure: an explicit ok:false from the engine fails the outcome closed', async () => {
    const rootDirectory = temporaryRoot('projection-engine-failure');
    const authorityRoot = temporaryRoot('proj-engine-failure-auth');
    const registry = createDeepResearchEventRegistry();
    const authorityProvider = () => FIXTURE_AUTHORITY;

    const ledger = new AppendOnlyLedger(
      {
        rootDirectory,
        ledgerId: 'deep-research-ledger',
        auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
        authorityProvider,
      },
      registry,
    );

    const policies = new TransitionPolicyRegistry([{
      policyId: 'deep-research-policy',
      policyVersion: 1,
      evaluatorVersion: '1',
      ruleIds: ['allow-all'],
      capturedAuthorizationState: { state: FIXTURE_AUTHORITY.state, epoch: FIXTURE_AUTHORITY.epoch },
      evaluate: () => ({
        verdict: AuthorizationVerdicts.ALLOW,
        reasonCode: AuthorizationReasonCodes.ALLOWED,
        matchedRuleIds: ['allow-all'],
      }),
    }]);

    const gateway = new TransitionAuthorizationGateway(
      {
        rootDirectory,
        auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
        authorityProvider,
        identityResolver: (context) => ({
          actorId: context.evaluationInput.actorId,
          capabilityId: 'write',
          evidenceDigest: context.evaluationInput.evidenceDigest,
        }),
      },
      ledger,
      policies,
    );

    const eventInput = {
      stem: 'deep_research.run_initialized' as const,
      scope: { runId: 'test-run-002', lineageId: 'test-lineage-002' },
      prevEventHash: '0'.repeat(64),
      replay: {
        fingerprint_version: 1,
        final_digest: '0'.repeat(64),
        replay_input_digests: {},
      },
      data: {
        generation: 1,
        charterDigest: '0'.repeat(64),
        configDigest: '0'.repeat(64),
        executorFingerprint: '0'.repeat(64),
        replayFingerprint: '0'.repeat(64),
        maxIterations: 5,
        convergencePolicyVersion: '1.0.0',
      },
      eventId: 'event-002',
      streamId: 'deep-research-ledger',
      streamSequence: 1,
      occurredAt: '2026-08-19T00:00:00.000Z',
      recordedAt: '2026-08-19T00:00:00.000Z',
      producer: { name: 'test', version: '1' },
      authorityEpoch: 1,
      correlationId: 'test-correlation-2',
      causationId: null,
      idempotencyKey: 'test-key-002',
    };

    const eventRecord = prepareDeepResearchEvent(eventInput, registry);

    // A test double for the engine seam: the contract and registry match, so
    // the refresh reaches the engine call, and only the engine's own result
    // decides the outcome.
    const failingProjectionEngine = {
      project: async () => Object.freeze({
        ok: false,
        error: { message: 'synthetic projection engine failure' },
      }),
    } as unknown as LegacyProjectionEngine;

    const result = await appendModeEvent({
      mode: 'deep-research',
      runDirectory: rootDirectory,
      eventRecord,
      authorityRoot,
      policy: {
        policyId: 'deep-research-policy',
        policyVersion: 1,
        policyDigest: policies.resolve('deep-research-policy', 1).digest,
      },
      policyRegistry: policies,
      authorizationGateway: gateway,
      ledger,
      eventRegistry: registry,
      binding: createTestBinding(),
      projectionEngine: failingProjectionEngine,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.phase).toBe('projection');
      expect(result.code).toBe(ModeAppendGatewayErrorCodes.PROJECTION_FAILED);
      expect(result.projectionError).toBe('synthetic projection engine failure');
      expect(result.receipt?.sequence).toBe(1);
    }

    // The append itself is durable even though the outcome fails closed.
    const events = await ledger.readVerifiedEvents();
    expect(events).toHaveLength(1);
  });

  it('projection success: projects legacy JSONL state file when appending deep-research event', async () => {
    const rootDirectory = temporaryRoot('projection-success');
    const authorityRoot = temporaryRoot('proj-success-auth');
    const registry = createDeepResearchEventRegistry();
    const authorityProvider = () => FIXTURE_AUTHORITY;

    const ledger = new AppendOnlyLedger(
      {
        rootDirectory,
        ledgerId: 'deep-research-ledger',
        auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
        authorityProvider,
      },
      registry,
    );

    const policies = new TransitionPolicyRegistry([{
      policyId: 'deep-research-policy',
      policyVersion: 1,
      evaluatorVersion: '1',
      ruleIds: ['allow-all'],
      capturedAuthorizationState: { state: FIXTURE_AUTHORITY.state, epoch: FIXTURE_AUTHORITY.epoch },
      evaluate: () => ({
        verdict: AuthorizationVerdicts.ALLOW,
        reasonCode: AuthorizationReasonCodes.ALLOWED,
        matchedRuleIds: ['allow-all'],
      }),
    }]);

    const gateway = new TransitionAuthorizationGateway(
      {
        rootDirectory,
        auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
        authorityProvider,
        identityResolver: (context) => ({
          actorId: context.evaluationInput.actorId,
          capabilityId: 'write',
          evidenceDigest: context.evaluationInput.evidenceDigest,
        }),
      },
      ledger,
      policies,
    );

    const eventInput = {
      stem: 'deep_research.run_initialized' as const,
      scope: { runId: 'test-run-001', lineageId: 'test-lineage-001' },
      prevEventHash: '0'.repeat(64),
      replay: {
        fingerprint_version: 1,
        final_digest: '0'.repeat(64),
        replay_input_digests: {},
      },
      data: {
        generation: 1,
        charterDigest: '0'.repeat(64),
        configDigest: '0'.repeat(64),
        executorFingerprint: '0'.repeat(64),
        replayFingerprint: '0'.repeat(64),
        maxIterations: 5,
        convergencePolicyVersion: '1.0.0',
      },
      eventId: 'event-001',
      streamId: 'deep-research-ledger',
      streamSequence: 1,
      occurredAt: '2026-08-19T00:00:00.000Z',
      recordedAt: '2026-08-19T00:00:00.000Z',
      producer: { name: 'test', version: '1' },
      authorityEpoch: 1,
      correlationId: 'test-correlation',
      causationId: null,
      idempotencyKey: 'test-key-001',
    };

    const eventRecord = prepareDeepResearchEvent(eventInput, registry);

    const result = await appendModeEvent({
      mode: 'deep-research',
      runDirectory: rootDirectory,
      eventRecord,
      authorityRoot,
      policy: {
        policyId: 'deep-research-policy',
        policyVersion: 1,
        policyDigest: policies.resolve('deep-research-policy', 1).digest,
      },
      policyRegistry: policies,
      authorizationGateway: gateway,
      ledger,
      eventRegistry: registry,
      binding: createTestBinding(),
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.projectionRefreshed).toBe(true);
      expect(result.projectionError).toBeNull();

      const legacyStatePath = join(rootDirectory, 'research', 'deep-research-state.jsonl');
      expect(existsSync(legacyStatePath)).toBe(true);
      const content = readFileSync(legacyStatePath, 'utf8').trim();
      const row = JSON.parse(content);
      expect(row.type).toBe('config');
      expect(row.topic).toBe('test-run-001');
      expect(row.maxIterations).toBe(5);
      expect(row.generation).toBe(1);
    }
  });

  it('binding failure: returns named phase and reason', async () => {
    const rootDirectory = temporaryRoot('binding-failure');
    const authorityRoot = temporaryRoot('binding-failure-auth');
    const { ledger, gateway, policies, registry } = createTestHarness(rootDirectory);

    // Use a non-existent directory to trigger binding failure
    const result = await appendModeEvent({
      mode: 'deep-research',
      runDirectory: '/nonexistent/path/that/does/not/exist',
      eventRecord: createTestEvent(registry, 1),
      authorityRoot,
      policy: {
        policyId: 'fixture-capability-policy',
        policyVersion: 1,
        policyDigest: '0'.repeat(64),
      },
      policyRegistry: policies,
      authorizationGateway: gateway,
      ledger,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.phase).toBe('binding');
      expect(result.code).toBe(ModeAppendGatewayErrorCodes.BINDING_FAILED);
      expect(result.reason).toBeTruthy();
    }
  });

  it('admission: fresh empty authority root succeeds and produces receipt', async () => {
    const rootDirectory = temporaryRoot('empty-authority-root');
    const authorityRoot = temporaryRoot('fresh-authority-root');
    const { ledger, gateway, policies, registry } = createTestHarness(rootDirectory);

    const event = createTestEvent(registry, 1);
    const result = await appendModeEvent({
      mode: 'deep-research',
      runDirectory: rootDirectory,
      eventRecord: event,
      authorityRoot,
      policy: {
        policyId: 'fixture-capability-policy',
        policyVersion: 1,
        policyDigest: '0'.repeat(64),
      },
      policyRegistry: policies,
      authorizationGateway: gateway,
      ledger,
      binding: createTestBinding(),
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.receipt.ledgerId).toBe(FIXTURE_LEDGER_ID);
      expect(result.receipt.sequence).toBe(1);
    }
  });

  it('admission: malformed authority record fails with AUTHORITY_DENIED and leaves ledger unchanged', async () => {
    const rootDirectory = temporaryRoot('malformed-authority-run');
    const authorityRoot = temporaryRoot('malformed-authority-root');
    const { ledger, gateway, policies, registry } = createTestHarness(rootDirectory);

    writeFileSync(join(authorityRoot, 'authority-deep-research.json'), '{ not valid json');
    const initialHead = await ledger.getVerifiedHead();

    const event = createTestEvent(registry, 1);
    const result = await appendModeEvent({
      mode: 'deep-research',
      runDirectory: rootDirectory,
      eventRecord: event,
      authorityRoot,
      policy: {
        policyId: 'fixture-capability-policy',
        policyVersion: 1,
        policyDigest: '0'.repeat(64),
      },
      policyRegistry: policies,
      authorizationGateway: gateway,
      ledger,
      binding: createTestBinding(),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.phase).toBe('authority');
      expect(result.code).toBe(ModeAppendGatewayErrorCodes.AUTHORITY_DENIED);
    }

    const currentHead = await ledger.getVerifiedHead();
    expect(currentHead).toEqual(initialHead);
  });

  it('admission: mode name not in AUTHORITY_FLIP_MODE_ORDER fails with AUTHORITY_DENIED', async () => {
    const rootDirectory = temporaryRoot('unknown-mode-run');
    const authorityRoot = temporaryRoot('unknown-mode-authority');
    const { ledger, gateway, policies, registry } = createTestHarness(rootDirectory);

    const event = createTestEvent(registry, 1);
    const result = await appendModeEvent({
      mode: 'unsupported-unknown-mode',
      runDirectory: rootDirectory,
      eventRecord: event,
      authorityRoot,
      policy: {
        policyId: 'fixture-capability-policy',
        policyVersion: 1,
        policyDigest: '0'.repeat(64),
      },
      policyRegistry: policies,
      authorizationGateway: gateway,
      ledger,
      binding: createTestBinding(),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.phase).toBe('authority');
      expect(result.code).toBe(ModeAppendGatewayErrorCodes.AUTHORITY_DENIED);
    }
  });

  it('resolveAuthorityRoot honours DEEP_LOOP_AUTHORITY_ROOT and falls back to default', () => {
    const explicitPath = resolve(tmpdir(), 'explicit-authority-state');
    expect(resolveAuthorityRoot({
      environment: { DEEP_LOOP_AUTHORITY_ROOT: explicitPath },
    })).toBe(explicitPath);

    const customRepo = resolve(tmpdir(), 'custom-repo-root');
    expect(resolveAuthorityRoot({
      repositoryRoot: customRepo,
      environment: { DEEP_LOOP_AUTHORITY_ROOT: 'relative-state' },
    })).toBe(join(customRepo, 'relative-state'));

    expect(resolveAuthorityRoot({
      repositoryRoot: customRepo,
      environment: {},
    })).toBe(join(customRepo, '.opencode/skills/.state/authority'));

    // With no repository root supplied the resolver must DISCOVER the
    // checkout rather than trust the working directory, because callers near
    // the write boundary hold per-run paths.
    const discovered = resolve(tmpdir(), 'discovered-repo-root');
    expect(resolveAuthorityRoot({
      environment: {},
      discoverRepositoryRoot: () => discovered,
    })).toBe(join(discovered, '.opencode/skills/.state/authority'));

    // Discovery failing is the only case that may fall back to the working
    // directory; it must still return an absolute root rather than throw at a
    // write boundary.
    expect(resolveAuthorityRoot({
      environment: {},
      discoverRepositoryRoot: () => null,
    })).toBe(join(process.cwd(), '.opencode/skills/.state/authority'));
  });
});
