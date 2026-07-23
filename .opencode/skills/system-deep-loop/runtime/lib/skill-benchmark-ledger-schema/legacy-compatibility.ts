// ───────────────────────────────────────────────────────────────────
// MODULE: Skill Benchmark Legacy Compatibility
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  SkillBenchmarkEventStems,
} from './skill-benchmark-ledger-types.js';

import type { JsonObject } from '../event-envelope/index.js';
import type {
  LegacySkillBenchmarkUpcastContext,
  LegacySkillBenchmarkUpcastResult,
  SkillBenchmarkCompatibilityDecision,
  SkillBenchmarkEventStem,
  SkillBenchmarkSpecificEventStem,
} from './skill-benchmark-ledger-types.js';

const CURRENT_EVENT_VERSION = 1 as const;
const LEGACY_UPCASTER_FINGERPRINT = sha256Bytes(canonicalBytes(
  'skill-benchmark.legacy-jsonl.upcaster@1',
));
const SYSTEM_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,255}$/;

const LEGACY_EVENT_STEMS = Object.freeze({
  benchmark_run_planned: 'skill_benchmark.run_planned',
} as const satisfies Readonly<Record<string, SkillBenchmarkSpecificEventStem>>);

const PINNED_LEGACY_EVENTS = new Set([
  'benchmark_completed',
  'certificate_promoted',
  'leaderboard_updated',
  'ranking_published',
  'result_promoted',
  'score_aggregated',
]);

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

function decision(
  status: SkillBenchmarkCompatibilityDecision['status'],
  reasonCode: string,
  targetStem: SkillBenchmarkEventStem | null,
  version: number | null,
): SkillBenchmarkCompatibilityDecision {
  return Object.freeze({
    status,
    reasonCode,
    targetStem,
    sourceVersion: version,
    targetVersion: CURRENT_EVENT_VERSION,
  });
}

function eventName(record: Record<string, unknown>): string | null {
  const candidate = record.eventType ?? record.event;
  return typeof candidate === 'string' ? candidate : null;
}

function currentStem(value: unknown): SkillBenchmarkEventStem | null {
  return typeof value === 'string'
    && (SkillBenchmarkEventStems as readonly string[]).includes(value)
    ? value as SkillBenchmarkEventStem
    : null;
}

function recordTarget(
  record: Record<string, unknown>,
): SkillBenchmarkSpecificEventStem | null {
  const name = eventName(record);
  return name
    ? LEGACY_EVENT_STEMS[name as keyof typeof LEGACY_EVENT_STEMS] ?? null
    : null;
}

function hasStableDesignIdentity(record: Record<string, unknown>): boolean {
  return isToken(record.runId ?? record.sessionId)
    && isToken(record.lineageId ?? record.parentSessionId ?? record.sessionId)
    && isToken(record.benchmarkDesignId ?? record.designId);
}

function digestRecord(record: Record<string, unknown>): string {
  return sha256Bytes(canonicalBytes(record as JsonObject));
}

function tokenValue(value: unknown, fallback: string): string {
  return isToken(value) ? value : fallback;
}

function uint32Value(value: unknown, fallback: number): number {
  return Number.isSafeInteger(value)
    && (value as number) >= 0
    && (value as number) <= 0xffff_ffff
    ? value as number
    : fallback;
}

export function decideSkillBenchmarkCompatibility(
  input: unknown,
): SkillBenchmarkCompatibilityDecision {
  if (!isObject(input)) return decision('blocked', 'invalid-record', null, null);
  const version = sourceVersion(input);
  if (version === null || version <= 0 || version > CURRENT_EVENT_VERSION) {
    return decision('blocked', 'unknown-event-version', null, version);
  }

  if (input.format === 'skill-benchmark-ledger') {
    const stem = currentStem(input.stem);
    return stem
      ? decision('exact', 'current-ledger-event', stem, version)
      : decision('blocked', 'unknown-event-stem', null, version);
  }

  if (input.type === 'progress') {
    return decision(
      'compatible',
      'legacy-liveness-record-is-non-authoritative',
      null,
      version,
    );
  }

  const name = eventName(input);
  if (name && PINNED_LEGACY_EVENTS.has(name)) {
    return decision(
      'pin-old-runtime',
      'legacy-derived-verdict-has-no-lossless-schema-event',
      null,
      version,
    );
  }

  const targetStem = recordTarget(input);
  if (!targetStem) {
    return decision('blocked', 'unknown-legacy-record', null, version);
  }
  if (!hasStableDesignIdentity(input)) {
    return decision(
      'pin-old-runtime',
      'stable-design-identity-missing',
      targetStem,
      version,
    );
  }
  return decision('migrate', 'registered-pure-upcaster', targetStem, version);
}

export function upcastLegacySkillBenchmarkRecord(
  input: unknown,
  context: LegacySkillBenchmarkUpcastContext,
): LegacySkillBenchmarkUpcastResult {
  const compatibility = decideSkillBenchmarkCompatibility(input);
  if (compatibility.status !== 'migrate'
    || compatibility.targetStem !== 'skill_benchmark.run_planned'
    || !isObject(input)) {
    return Object.freeze({ status: 'refused', decision: compatibility });
  }

  const recordDigest = digestRecord(input);
  const data: JsonObject = {
    designRef: `legacy-jsonl:${recordDigest}:design`,
    designDigest: recordDigest,
    taskSetRef: `legacy-jsonl:${recordDigest}:task-set`,
    taskSetDigest: recordDigest,
    skillBundleRef: `legacy-jsonl:${recordDigest}:skill-bundle`,
    skillBundleDigest: recordDigest,
    registryDigest: recordDigest,
    executorDescriptorRef: `legacy-jsonl:${recordDigest}:executor`,
    executorDescriptorDigest: recordDigest,
    environmentDigest: recordDigest,
    dependencyDigest: recordDigest,
    workloadDigest: recordDigest,
    randomizationSeed: uint32Value(input.randomizationSeed, 0),
    replicateCount: Math.max(1, uint32Value(input.replicateCount, 1)),
    designPolicyVersion: tokenValue(
      input.designPolicyVersion,
      'legacy-skill-benchmark@1',
    ),
  };

  return Object.freeze({
    status: 'migrated',
    targetStem: compatibility.targetStem,
    eventVersion: CURRENT_EVENT_VERSION,
    originalRecordDigest: recordDigest,
    upcasterFingerprint: LEGACY_UPCASTER_FINGERPRINT,
    warnings: Object.freeze([
      'Legacy benchmark planning inputs are retained by source-record digest.',
    ]),
    scope: context.scope,
    prevEventHash: context.prevEventHash,
    replay: context.replay,
    data,
  });
}
