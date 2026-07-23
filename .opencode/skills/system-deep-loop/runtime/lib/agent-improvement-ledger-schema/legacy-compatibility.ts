// ───────────────────────────────────────────────────────────────────
// MODULE: Agent Improvement Legacy Compatibility
// ───────────────────────────────────────────────────────────────────

import {
  decideDeepImprovementCommonCompatibility,
  upcastLegacyDeepImprovementCommonRecord,
} from '../deep-improvement-common-ledger-schema/index.js';
import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  AgentImprovementEventStems,
} from './agent-improvement-ledger-types.js';

import type {
  DeepImprovementCommonCompatibilityDecision,
  LegacyUpcastContext as CommonLegacyUpcastContext,
} from '../deep-improvement-common-ledger-schema/index.js';
import type { JsonObject } from '../event-envelope/index.js';
import type {
  AgentImprovementCompatibilityDecision,
  AgentImprovementEventStem,
  AgentImprovementExtensionEventStem,
  LegacyUpcastContext,
  LegacyUpcastResult,
} from './agent-improvement-ledger-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. COMPATIBILITY TABLES
// ───────────────────────────────────────────────────────────────────

const CURRENT_EVENT_VERSION = 1 as const;
const LEGACY_UPCASTER_FINGERPRINT = sha256Bytes(canonicalBytes(
  'agent-improvement.legacy-jsonl.upcaster@1',
));
const SYSTEM_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,255}$/;

const LEGACY_EXTENSION_STEMS = Object.freeze({
  agent_definition_snapshot:
    'agent_improvement.definition_snapshot_sealed',
  definition_snapshot_sealed:
    'agent_improvement.definition_snapshot_sealed',
} as const satisfies Readonly<
  Record<string, AgentImprovementExtensionEventStem>
>);

const PINNED_AGENT_EVENTS = new Set([
  'agent_ir_updated',
  'behavioral_verdict',
  'candidate_promoted',
  'definition_rewritten',
  'mutation_applied',
  'score_overridden',
]);

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function isToken(value: unknown): value is string {
  return typeof value === 'string' && SYSTEM_TOKEN_PATTERN.test(value);
}

function sourceVersion(record: Record<string, unknown>): number | null {
  const candidate = record.eventVersion ?? record.schemaVersion ?? 1;
  return Number.isSafeInteger(candidate) ? candidate as number : null;
}

function eventName(record: Record<string, unknown>): string | null {
  const candidate = record.eventType ?? record.event;
  return typeof candidate === 'string' ? candidate : null;
}

function decision(
  status: AgentImprovementCompatibilityDecision['status'],
  reasonCode: string,
  targetStem: AgentImprovementEventStem | null,
  version: number | null,
): AgentImprovementCompatibilityDecision {
  return Object.freeze({
    status,
    reasonCode,
    targetStem,
    sourceVersion: version,
    targetVersion: CURRENT_EVENT_VERSION,
  });
}

function fromCommonDecision(
  common: DeepImprovementCommonCompatibilityDecision,
): AgentImprovementCompatibilityDecision {
  return decision(
    common.status,
    common.reasonCode,
    common.targetStem,
    common.sourceVersion,
  );
}

function currentStem(value: unknown): AgentImprovementEventStem | null {
  return typeof value === 'string'
    && (AgentImprovementEventStems as readonly string[]).includes(value)
    ? value as AgentImprovementEventStem
    : null;
}

function extensionTarget(
  record: Record<string, unknown>,
): AgentImprovementExtensionEventStem | null {
  const name = eventName(record);
  return name
    ? LEGACY_EXTENSION_STEMS[
      name as keyof typeof LEGACY_EXTENSION_STEMS
    ] ?? null
    : null;
}

function hasStableDefinitionIdentity(
  record: Record<string, unknown>,
): boolean {
  return isToken(record.runId ?? record.sessionId)
    && isToken(record.lineageId ?? record.parentSessionId ?? record.sessionId)
    && isToken(record.agentDefinitionId ?? record.definitionId);
}

function digestRecord(record: Record<string, unknown>): string {
  return sha256Bytes(canonicalBytes(record as JsonObject));
}

function tokenValue(value: unknown, fallback: string): string {
  return isToken(value) ? value : fallback;
}

// ───────────────────────────────────────────────────────────────────
// 3. PUBLIC COMPATIBILITY HOOKS
// ───────────────────────────────────────────────────────────────────

export function decideAgentImprovementCompatibility(
  input: unknown,
): AgentImprovementCompatibilityDecision {
  if (!isObject(input)) return decision('blocked', 'invalid-record', null, null);
  const version = sourceVersion(input);
  if (version === null || version <= 0 || version > CURRENT_EVENT_VERSION) {
    return decision('blocked', 'unknown-event-version', null, version);
  }

  if (input.format === 'agent-improvement-ledger') {
    const stem = currentStem(input.stem);
    return stem
      ? decision('exact', 'current-ledger-event', stem, version)
      : decision('blocked', 'unknown-event-stem', null, version);
  }

  const extensionStem = extensionTarget(input);
  if (extensionStem) {
    return hasStableDefinitionIdentity(input)
      ? decision('migrate', 'registered-pure-upcaster', extensionStem, version)
      : decision('pin-old-runtime', 'stable-definition-identity-missing', extensionStem, version);
  }

  const name = eventName(input);
  if (name && PINNED_AGENT_EVENTS.has(name)) {
    return decision(
      'pin-old-runtime',
      'legacy-event-has-no-lossless-agent-event',
      null,
      version,
    );
  }

  return fromCommonDecision(
    decideDeepImprovementCommonCompatibility(input),
  );
}

export function upcastLegacyAgentImprovementRecord(
  input: unknown,
  context: LegacyUpcastContext,
): LegacyUpcastResult {
  const compatibility = decideAgentImprovementCompatibility(input);
  if (compatibility.status !== 'migrate'
    || !compatibility.targetStem
    || !isObject(input)) {
    return Object.freeze({ status: 'refused', decision: compatibility });
  }

  if (!compatibility.targetStem.startsWith('agent_improvement.')) {
    return upcastLegacyDeepImprovementCommonRecord(
      input,
      context as CommonLegacyUpcastContext,
    ) as LegacyUpcastResult;
  }

  if (compatibility.targetStem
    !== 'agent_improvement.definition_snapshot_sealed') {
    return Object.freeze({
      status: 'refused',
      decision: decision(
        'blocked',
        'upcaster-not-registered',
        compatibility.targetStem,
        compatibility.sourceVersion,
      ),
    });
  }

  const recordDigest = digestRecord(input);
  const definitionRef = tokenValue(
    input.definitionRef,
    `legacy-jsonl:${recordDigest}:definition`,
  );
  const policyRef = `legacy-jsonl:${recordDigest}:policy`;
  const data: JsonObject = {
    definitionRef,
    definitionDigest: recordDigest,
    definitionSchemaVersion: tokenValue(
      input.definitionSchemaVersion,
      'legacy-agent-definition@1',
    ),
    capabilityPolicyRef: `${policyRef}:capability`,
    capabilityPolicyDigest: recordDigest,
    verifierPolicyRef: `${policyRef}:verifier`,
    verifierPolicyDigest: recordDigest,
    toolPolicyRef: `${policyRef}:tool`,
    toolPolicyDigest: recordDigest,
    routingPolicyRef: `${policyRef}:routing`,
    routingPolicyDigest: recordDigest,
    memoryPolicyRef: `${policyRef}:memory`,
    memoryPolicyDigest: recordDigest,
    sealingReceiptRef: `legacy-jsonl:${recordDigest}:seal`,
  };

  return Object.freeze({
    status: 'migrated',
    targetStem: compatibility.targetStem,
    eventVersion: CURRENT_EVENT_VERSION,
    originalRecordDigest: recordDigest,
    upcasterFingerprint: LEGACY_UPCASTER_FINGERPRINT,
    warnings: Object.freeze([
      'Legacy policy surfaces share the source record digest because they were not independently addressable.',
    ]),
    scope: context.scope,
    prevEventHash: context.prevEventHash,
    replay: context.replay,
    data,
  });
}
