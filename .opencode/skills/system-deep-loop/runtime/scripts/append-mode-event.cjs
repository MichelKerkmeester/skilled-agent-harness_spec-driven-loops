#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Loop Runtime — Mode Event Append CLI                                ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Input:  CLI args (--mode, --run-directory, --event-json).                ║
// ║ Output: JSON to stdout.                                                  ║
// ║ Exit:   0=success, 1=script error, 2=append failed.                      ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. TSX BOOTSTRAP
// ─────────────────────────────────────────────────────────────────────────────

const TSX_LOADER = require.resolve('tsx');
const isTsxLoaded = process.env.DEEP_LOOP_TSX_LOADED === '1';

function runTsxBootstrap() {
  const { spawn } = require('node:child_process');
  const child = spawn(
    process.execPath,
    ['--import', TSX_LOADER, __filename, ...process.argv.slice(2)],
    {
      cwd: process.cwd(),
      env: require('./runtime-bootstrap.cjs').tsxChildEnv({ DEEP_LOOP_TSX_LOADED: '1' }),
      stdio: [process.stdin.isTTY ? 'ignore' : 'pipe', 'pipe', 'pipe'],
    },
  );

  if (!process.stdin.isTTY && child.stdin) {
    child.stdin.on('error', () => {});
    process.stdin.pipe(child.stdin);
  }

  child.stdout?.pipe(process.stdout);
  child.stderr?.pipe(process.stderr);

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => {
      child.kill(signal);
    });
  }

  child.on('close', (status, signal) => {
    if (status !== null) {
      process.exit(status);
    }
    process.exit(signal === 'SIGINT' ? 130 : signal === 'SIGTERM' ? 143 : 1);
  });
}

if (require.main === module && !isTsxLoaded) {
  runTsxBootstrap();
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. MAIN IMPLEMENTATION (under tsx)
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv = process.argv.slice(2)) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      throw new Error(`Unexpected positional argument: ${token}`);
    }
    const key = token.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      args[key] = true;
    } else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function requireString(args, ...keys) {
  for (const key of keys) {
    if (args[key] && typeof args[key] === 'string') {
      return args[key];
    }
  }
  throw new Error(`${keys[0]} is required`);
}

function jsonOut(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

function normalizeMode(mode) {
  if (!mode || typeof mode !== 'string') return '';
  const trimmed = mode.trim();
  if (trimmed === 'research' || trimmed === 'deep-research') return 'deep-research';
  if (trimmed === 'review' || trimmed === 'deep-review') return 'deep-review';
  if (trimmed === 'ai-council' || trimmed === 'council' || trimmed === 'deep-ai-council' || trimmed === 'deep-council') return 'deep-ai-council';
  if (trimmed === 'agent-improvement' || trimmed === 'deep-agent-improvement') return 'agent-improvement';
  if (trimmed === 'model-benchmark' || trimmed === 'deep-model-benchmark') return 'model-benchmark';
  if (trimmed === 'skill-benchmark' || trimmed === 'deep-skill-benchmark') return 'skill-benchmark';
  // The authority order is the canonical spelling; a private alias that
  // disagrees with it makes a real fleet mode unreachable.
  if (trimmed === 'improvement' || trimmed === 'deep-improvement' || trimmed === 'deep-improvement-common') return 'deep-improvement-common';
  return trimmed;
}

async function resolveModeAdapter(mode) {
  const normalized = normalizeMode(mode);
  switch (normalized) {
    case 'deep-research': {
      const mod = await import('../lib/deep-research-ledger-schema/index.ts');
      return {
        normalizedMode: 'deep-research',
        createRegistry: mod.createDeepResearchEventRegistry,
        prepareEvent: mod.prepareDeepResearchEvent,
        isEventStem: mod.isDeepResearchEventStem,
      };
    }
    case 'deep-review': {
      const mod = await import('../lib/deep-review-ledger-schema/index.ts');
      return {
        normalizedMode: 'deep-review',
        createRegistry: mod.createDeepReviewEventRegistry,
        prepareEvent: mod.prepareDeepReviewEvent,
        isEventStem: mod.isDeepReviewEventStem,
      };
    }
    case 'deep-ai-council': {
      const mod = await import('../lib/deep-ai-council-ledger-schema/index.ts');
      return {
        normalizedMode: 'deep-ai-council',
        createRegistry: mod.createDeepAiCouncilEventRegistry,
        prepareEvent: mod.prepareDeepAiCouncilEvent,
        isEventStem: mod.isDeepAiCouncilEventStem,
      };
    }
    case 'agent-improvement': {
      const mod = await import('../lib/agent-improvement-ledger-schema/index.ts');
      return {
        normalizedMode: 'agent-improvement',
        createRegistry: mod.createAgentImprovementEventRegistry,
        prepareEvent: mod.prepareAgentImprovementEvent,
        isEventStem: mod.isAgentImprovementEventStem,
      };
    }
    case 'model-benchmark': {
      const mod = await import('../lib/model-benchmark-ledger-schema/index.ts');
      return {
        normalizedMode: 'model-benchmark',
        createRegistry: mod.createModelBenchmarkEventRegistry,
        prepareEvent: mod.prepareModelBenchmarkEvent,
        isEventStem: mod.isModelBenchmarkEventStem,
      };
    }
    case 'skill-benchmark': {
      const mod = await import('../lib/skill-benchmark-ledger-schema/index.ts');
      return {
        normalizedMode: 'skill-benchmark',
        createRegistry: mod.createSkillBenchmarkEventRegistry,
        prepareEvent: mod.prepareSkillBenchmarkEvent,
        isEventStem: mod.isSkillBenchmarkEventStem,
      };
    }
    case 'deep-improvement-common': {
      const mod = await import('../lib/deep-improvement-common-ledger-schema/index.ts');
      return {
        normalizedMode: 'deep-improvement-common',
        createRegistry: mod.createDeepImprovementCommonEventRegistry,
        prepareEvent: mod.prepareDeepImprovementCommonEvent,
        isEventStem: mod.isDeepImprovementCommonEventStem,
      };
    }
    default:
      throw new Error(`Unsupported mode: ${mode}`);
  }
}

async function main() {
  const fs = require('node:fs');
  const crypto = require('node:crypto');

  const args = parseArgs();

  const modeRaw = requireString(args, 'mode');
  const runDirectory = requireString(args, 'runDirectory', 'runDir', 'specFolder');
  const eventJsonPath = requireString(args, 'eventJson', 'eventJsonPath');

  let rawEvent;
  try {
    const raw = fs.readFileSync(eventJsonPath, 'utf8');
    rawEvent = JSON.parse(raw);
  } catch (error) {
    jsonOut({
      ok: false,
      phase: 'input',
      reason: `Failed to read event JSON: ${error.message}`,
      code: 'INPUT_ERROR',
    });
    process.exit(1);
  }

  const { appendModeEvent } = await import('../lib/mode-append-gateway/index.ts');
  const {
    AppendOnlyLedger,
    TransitionAuthorizationGateway,
    TransitionPolicyRegistry,
    AuthorizationVerdicts,
    AuthorizationReasonCodes,
  } = await import('../lib/authorized-ledger/index.ts');
  const { prepareEventWrite } = await import('../lib/event-envelope/index.ts');
  const { resolveCutoverBinding } = await import('../lib/cutover-binding/index.ts');
  const { resolveAuthorityRoot } = await import('../lib/authority-root/index.ts');
  const { admitCanonicalWrite } = await import('../lib/deep-research-authority/index.ts');
  const { AUTHORITY_FLIP_MODE_ORDER } = await import('../lib/per-mode-authority-flip/index.ts');
  const { upcastLegacyDeepResearchRecord } = await import('../lib/deep-research-ledger-schema/index.ts');

  const adapter = await resolveModeAdapter(modeRaw);
  const normalizedMode = adapter.normalizedMode;
  const registry = adapter.createRegistry();

  // Read the durable authority record before anything is constructed. A CLI
  // that asserts its own authority is exactly the private write path the
  // gateway exists to remove, so a refusal here must happen before a ledger,
  // a policy registry, or a run directory is touched.
  const authorityRoot = resolveAuthorityRoot();
  // A mode outside the frozen flip order has no authority record to read, and
  // the selector reports that as a malformed record. Naming the real cause here
  // keeps an operator from hunting a corrupt file that does not exist.
  if (!AUTHORITY_FLIP_MODE_ORDER.includes(normalizedMode)) {
    jsonOut({
      ok: false,
      phase: 'authority',
      reason: `Mode '${normalizedMode}' is not in the frozen authority order: ${AUTHORITY_FLIP_MODE_ORDER.join(', ')}`,
      code: 'AUTHORITY_DENIED',
    });
    process.exit(2);
  }
  let admission;
  try {
    admission = admitCanonicalWrite(normalizedMode, { authorityRoot });
  } catch (error) {
    jsonOut({
      ok: false,
      phase: 'authority',
      reason: error instanceof Error ? error.message : String(error),
      code: 'AUTHORITY_DENIED',
    });
    process.exit(2);
  }
  if (admission.outcome === 'denied') {
    jsonOut({
      ok: false,
      phase: 'authority',
      reason: `Authority admission denied: ${admission.reasonCode}`,
      code: 'AUTHORITY_DENIED',
    });
    process.exit(2);
  }
  if (admission.admissionOpen === false) {
    jsonOut({ ok: false, phase: 'authority', reason: 'Authority admission closed', code: 'AUTHORITY_DENIED' });
    process.exit(2);
  }
  const authority = { state: admission.state, epoch: admission.epoch };
  const policyId = typeof args.policyId === 'string' ? args.policyId : `${normalizedMode}-append-policy`;
  const policyVersion = 1;
  const ruleId = 'mode-event-append';

  const policyRegistry = new TransitionPolicyRegistry([{
    policyId,
    policyVersion,
    evaluatorVersion: '1',
    ruleIds: [ruleId],
    capturedAuthorizationState: { state: authority.state, epoch: authority.epoch },
    evaluate: () => ({
      verdict: AuthorizationVerdicts.ALLOW,
      reasonCode: AuthorizationReasonCodes.ALLOWED,
      matchedRuleIds: [ruleId],
    }),
  }]);

  const resolvedPolicy = policyRegistry.resolve(policyId, policyVersion);

  const ledgerId = `${normalizedMode}-ledger`;
  const auditLedgerId = `${normalizedMode}-audit-ledger`;

  const ledger = new AppendOnlyLedger({
    rootDirectory: runDirectory,
    ledgerId,
    auditLedgerId,
    authorityProvider: () => authority,
  }, registry);

  const authorizationGateway = new TransitionAuthorizationGateway({
    rootDirectory: runDirectory,
    auditLedgerId,
    authorityProvider: () => authority,
    identityResolver: (context) => ({
      actorId: context.evaluationInput.actorId,
      capabilityId: context.evaluationInput.capabilityId,
      evidenceDigest: context.evaluationInput.evidenceDigest,
    }),
  }, ledger, policyRegistry);

  let binding;
  try {
    binding = resolveCutoverBinding({
      mode: normalizedMode,
      repositoryRoot: runDirectory,
    });
  } catch (primaryError) {
    try {
      binding = resolveCutoverBinding({
        mode: normalizedMode,
        repositoryRoot: process.cwd(),
      });
    } catch (fallbackError) {
      // An unattributable flip is worse than a blocked one: fabricating a
      // zero-SHA identity here would let the ledger carry a transition
      // nobody can be held to. Refuse instead of defaulting.
      const primaryMessage = primaryError instanceof Error ? primaryError.message : String(primaryError);
      const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
      jsonOut({
        ok: false,
        phase: 'binding',
        reason: `Cannot bind an authority flip: cutover binding could not be resolved from the run directory (${primaryMessage}) or the working directory (${fallbackMessage}).`,
        code: 'BINDING_FAILED',
      });
      process.exit(2);
    }
  }

  const currentHead = await ledger.getVerifiedHead();
  const nowIso = new Date().toISOString();

  // Shared builder for the envelope-metadata + payload-core input that
  // adapter.prepareEvent consumes. Both the explicit-stem path and the legacy
  // upcast path funnel through here so the envelope shape is defined once.
  function buildPreparedInput(core, meta) {
    return {
      stem: core.stem,
      scope: core.scope,
      data: core.data,
      prevEventHash: core.prevEventHash,
      replay: core.replay,
      eventId: meta.eventId || meta.event_id || `event-${crypto.randomUUID()}`,
      streamId: meta.streamId || meta.stream_id || ledgerId,
      streamSequence: meta.streamSequence ?? meta.stream_sequence ?? (currentHead.sequence + 1),
      occurredAt: meta.occurredAt || meta.occurred_at || nowIso,
      recordedAt: meta.recordedAt || meta.recorded_at || nowIso,
      producer: meta.producer || { name: 'deep-loop-cli', version: '1.0.0' },
      authorityEpoch: meta.authorityEpoch ?? meta.authority_epoch ?? authority.epoch,
      correlationId: meta.correlationId || meta.correlation_id || crypto.randomUUID(),
      causationId: meta.causationId !== undefined
        ? meta.causationId
        : (meta.causation_id !== undefined ? meta.causation_id : null),
      idempotencyKey: meta.idempotencyKey || meta.idempotency_key || crypto.randomUUID(),
    };
  }

  const defaultReplay = {
    fingerprint_version: 1,
    final_digest: '0'.repeat(64),
    replay_input_digests: {},
  };

  let eventRecord;
  let legacyWarnings;
  if (
    rawEvent
    && typeof rawEvent === 'object'
    && rawEvent.canonicalDigest
    && rawEvent.canonicalBytes
    && rawEvent.identity
    && rawEvent.envelope
  ) {
    eventRecord = rawEvent;
  } else if (rawEvent && typeof rawEvent === 'object' && rawEvent.stem) {
    const preparedInput = buildPreparedInput({
      stem: rawEvent.stem,
      scope: rawEvent.scope || { runId: 'run-cli', lineageId: 'lineage-cli' },
      data: rawEvent.data || {},
      prevEventHash: rawEvent.prevEventHash || rawEvent.prev_event_hash || currentHead.recordHash,
      replay: rawEvent.replay || defaultReplay,
    }, rawEvent);
    eventRecord = adapter.prepareEvent(preparedInput, registry);
  } else if (rawEvent && typeof rawEvent === 'object' && (rawEvent.event_type || rawEvent.eventType)) {
    const envelope = {
      envelope_version: rawEvent.envelope_version ?? rawEvent.envelopeVersion ?? 1,
      event_id: rawEvent.event_id || rawEvent.eventId || `event-${crypto.randomUUID()}`,
      event_type: rawEvent.event_type || rawEvent.eventType,
      event_version: rawEvent.event_version ?? rawEvent.eventVersion ?? 1,
      stream_id: rawEvent.stream_id || rawEvent.streamId || ledgerId,
      stream_sequence: rawEvent.stream_sequence ?? rawEvent.streamSequence ?? (currentHead.sequence + 1),
      occurred_at: rawEvent.occurred_at || rawEvent.occurredAt || nowIso,
      recorded_at: rawEvent.recorded_at || rawEvent.recordedAt || nowIso,
      producer: rawEvent.producer || { name: 'deep-loop-cli', version: '1.0.0' },
      authority_epoch: rawEvent.authority_epoch ?? rawEvent.authorityEpoch ?? authority.epoch,
      correlation_id: rawEvent.correlation_id || rawEvent.correlationId || crypto.randomUUID(),
      causation_id: rawEvent.causation_id !== undefined
        ? rawEvent.causation_id
        : (rawEvent.causationId !== undefined ? rawEvent.causationId : null),
      idempotency_key: rawEvent.idempotency_key || rawEvent.idempotencyKey || crypto.randomUUID(),
      payload: rawEvent.payload || {},
    };
    eventRecord = prepareEventWrite(envelope, registry);
  } else if (
    normalizedMode === 'deep-research'
    && rawEvent
    && typeof rawEvent === 'object'
  ) {
    // Legacy deep-research rows predate the canonical envelope and carry no
    // stem or event_type the current registry recognizes. This branch is tried
    // last so canonical envelopes and explicit stem/event_type rows keep their
    // fast paths untouched; only rows that would otherwise hit the final throw
    // reach the upcaster. Non-research modes never enter here, so they keep
    // the original unrecognized-format rejection.
    const legacyRunId = rawEvent.runId || rawEvent.sessionId || 'run-cli';
    const legacyLineageId = rawEvent.lineageId
      || rawEvent.parentSessionId
      || rawEvent.sessionId
      || 'lineage-cli';
    const legacyScope = { runId: legacyRunId, lineageId: legacyLineageId };
    const legacyIteration = rawEvent.iteration ?? rawEvent.run;
    if (Number.isSafeInteger(legacyIteration) && legacyIteration > 0) {
      legacyScope.iteration = legacyIteration;
    }
    const legacyContext = {
      scope: legacyScope,
      prevEventHash: currentHead.recordHash,
      replay: defaultReplay,
    };
    const upcast = upcastLegacyDeepResearchRecord(rawEvent, legacyContext);
    if (upcast.status === 'refused') {
      // A bare "refused" tells the operator nothing actionable. Carrying the
      // decision's own reasonCode lets them see whether the row was blocked,
      // pinned to the old runtime, or simply unrecognized, so they can fix the
      // input rather than guess. Nothing is written: this throws before any
      // append is attempted.
      throw new Error(
        `Legacy deep-research record refused: ${upcast.decision.reasonCode}`,
      );
    }
    const preparedInput = buildPreparedInput({
      stem: upcast.targetStem,
      scope: upcast.scope,
      data: upcast.data,
      prevEventHash: upcast.prevEventHash,
      replay: upcast.replay,
    }, rawEvent);
    eventRecord = adapter.prepareEvent(preparedInput, registry);
    legacyWarnings = upcast.warnings;
  } else {
    throw new Error('Unrecognized event format: expected object with stem or event_type');
  }

  const outcome = await appendModeEvent({
    mode: normalizedMode,
    runDirectory,
    eventRecord,
    authorityRoot,
    policy: {
      policyId: resolvedPolicy.policyId,
      policyVersion: resolvedPolicy.policyVersion,
      policyDigest: resolvedPolicy.digest,
    },
    policyRegistry,
    authorizationGateway,
    ledger,
    eventRegistry: registry,
    binding,
  });

  // Surface a lossy legacy migration instead of letting it pass silently. Only
  // the legacy upcast path sets legacyWarnings, so canonical/stem/event_type
  // outputs stay byte-identical to before.
  if (legacyWarnings && legacyWarnings.length > 0) {
    jsonOut({ ...outcome, warnings: [...legacyWarnings] });
  } else {
    jsonOut(outcome);
  }
  process.exit(outcome.ok ? 0 : 2);
}

if (require.main === module && isTsxLoaded) {
  main().catch((error) => {
    jsonOut({
      ok: false,
      phase: 'runtime',
      reason: error instanceof Error ? error.message : String(error),
      code: 'RUNTIME_ERROR',
    });
    process.exit(1);
  });
}

module.exports = {
  parseArgs,
  normalizeMode,
  resolveModeAdapter,
  main,
};
