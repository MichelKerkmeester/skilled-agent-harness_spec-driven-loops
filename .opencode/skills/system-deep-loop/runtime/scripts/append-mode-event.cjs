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
      env: { ...process.env, DEEP_LOOP_TSX_LOADED: '1' },
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

function shortDigest(value) {
  const crypto = require('node:crypto');
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex').slice(0, 16);
}

function normalizeMode(mode) {
  if (!mode || typeof mode !== 'string') return '';
  const trimmed = mode.trim();
  if (trimmed === 'research' || trimmed === 'deep-research') return 'deep-research';
  if (trimmed === 'review' || trimmed === 'deep-review') return 'deep-review';
  if (trimmed === 'alignment' || trimmed === 'deep-alignment') return 'deep-alignment';
  if (trimmed === 'ai-council' || trimmed === 'council' || trimmed === 'deep-ai-council' || trimmed === 'deep-council') return 'deep-ai-council';
  if (trimmed === 'agent-improvement' || trimmed === 'deep-agent-improvement') return 'agent-improvement';
  if (trimmed === 'model-benchmark' || trimmed === 'deep-model-benchmark') return 'model-benchmark';
  if (trimmed === 'skill-benchmark' || trimmed === 'deep-skill-benchmark') return 'skill-benchmark';
  if (trimmed === 'improvement' || trimmed === 'deep-improvement') return 'deep-improvement';
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
    case 'deep-alignment': {
      const mod = await import('../lib/deep-alignment-ledger-schema/index.ts');
      return {
        normalizedMode: 'deep-alignment',
        createRegistry: mod.createDeepAlignmentEventRegistry,
        prepareEvent: mod.prepareDeepAlignmentEvent,
        isEventStem: mod.isDeepAlignmentEventStem,
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
    case 'deep-improvement': {
      const mod = await import('../lib/deep-improvement-common-ledger-schema/index.ts');
      return {
        normalizedMode: 'deep-improvement',
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
  const os = require('node:os');
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

  const adapter = await resolveModeAdapter(modeRaw);
  const normalizedMode = adapter.normalizedMode;
  const registry = adapter.createRegistry();

  // Read the durable authority record before anything is constructed. A CLI
  // that asserts its own authority is exactly the private write path the
  // gateway exists to remove, so a refusal here must happen before a ledger,
  // a policy registry, or a run directory is touched.
  const authorityRoot = resolveAuthorityRoot();
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

  let binding = undefined;
  try {
    binding = resolveCutoverBinding({
      mode: normalizedMode,
      repositoryRoot: runDirectory,
    });
  } catch {
    try {
      binding = resolveCutoverBinding({
        mode: normalizedMode,
        repositoryRoot: process.cwd(),
      });
    } catch {
      const user = (() => {
        try { return os.userInfo().username || 'operator'; } catch { return 'operator'; }
      })();
      const host = os.hostname() || 'localhost';
      const actorId = `operator:${user}`;
      binding = Object.freeze({
        actorId,
        capabilityId: `capability:authority-flip:${shortDigest(`${actorId}@${host}`)}`,
        candidateSha: '0'.repeat(40),
        baseSha: '0'.repeat(40),
        requestId: crypto.randomUUID(),
        correlationId: crypto.randomUUID(),
        streamId: `authority-flip:${normalizedMode}`,
        decidedAt: new Date().toISOString(),
      });
    }
  }

  const currentHead = await ledger.getVerifiedHead();
  const nowIso = new Date().toISOString();

  let eventRecord;
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
    const preparedInput = {
      stem: rawEvent.stem,
      scope: rawEvent.scope || { runId: 'run-cli', lineageId: 'lineage-cli' },
      data: rawEvent.data || {},
      prevEventHash: rawEvent.prevEventHash || rawEvent.prev_event_hash || currentHead.recordHash,
      replay: rawEvent.replay || {
        fingerprint_version: 1,
        final_digest: '0'.repeat(64),
        replay_input_digests: {},
      },
      eventId: rawEvent.eventId || rawEvent.event_id || `event-${crypto.randomUUID()}`,
      streamId: rawEvent.streamId || rawEvent.stream_id || ledgerId,
      streamSequence: rawEvent.streamSequence ?? rawEvent.stream_sequence ?? (currentHead.sequence + 1),
      occurredAt: rawEvent.occurredAt || rawEvent.occurred_at || nowIso,
      recordedAt: rawEvent.recordedAt || rawEvent.recorded_at || nowIso,
      producer: rawEvent.producer || { name: 'deep-loop-cli', version: '1.0.0' },
      authorityEpoch: rawEvent.authorityEpoch ?? rawEvent.authority_epoch ?? authority.epoch,
      correlationId: rawEvent.correlationId || rawEvent.correlation_id || crypto.randomUUID(),
      causationId: rawEvent.causationId !== undefined
        ? rawEvent.causationId
        : (rawEvent.causation_id !== undefined ? rawEvent.causation_id : null),
      idempotencyKey: rawEvent.idempotencyKey || rawEvent.idempotency_key || crypto.randomUUID(),
    };
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

  jsonOut(outcome);
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
