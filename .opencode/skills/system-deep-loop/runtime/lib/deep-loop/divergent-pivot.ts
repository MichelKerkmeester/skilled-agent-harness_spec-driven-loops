// ───────────────────────────────────────────────────────────────────
// MODULE: Divergent Pivot Transaction
// ───────────────────────────────────────────────────────────────────

import { AsyncLocalStorage } from 'node:async_hooks';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, relative, resolve, sep } from 'node:path';

import {
  appendJsonlIfChangedAtomic,
  writeStateIfChangedAtomic,
  writeTextAtomic,
} from './atomic-state.js';
import {
  DEFAULT_CANDIDATE_SIMILARITY_THRESHOLD,
  deduplicatePivotCandidates,
  validatePivotCandidate,
} from './pivot-candidates.js';

import type {
  PivotCandidate,
  RejectedPivotCandidateDeduplication,
} from './pivot-candidates.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

export interface PivotIdentityInput {
  readonly sessionId: string;
  readonly generation: string | number;
  readonly loopType: string;
  readonly sourceIteration: number;
  readonly normalizedTrigger: string;
  readonly ordinal: number;
}

export interface PivotCouncilPaths {
  readonly artifactRoot: string;
  readonly pivotRoot: string;
  readonly councilRoot: string;
  readonly configPath: string;
  readonly statePath: string;
  readonly seatsRoot: string;
  readonly seatPaths: readonly [string, string, string];
  readonly deliberationPath: string;
  readonly reportPath: string;
}

export interface PivotSeatMandate {
  readonly id: string;
  readonly mandate: string;
}

export type PivotBlockerSeverity = 'low' | 'medium' | 'high';

export interface PivotSeatBlocker {
  readonly severity: PivotBlockerSeverity;
  readonly message: string;
  readonly candidateId?: string;
}

/** Parse-valid output contract returned by each injected native seat dispatcher. */
export interface PivotSeatReport {
  readonly seatId: string;
  readonly selectedCandidateId: string | null;
  readonly materialEndorsement: boolean;
  readonly rationale: string;
  readonly blockers: readonly PivotSeatBlocker[];
}

export type PivotSeatReportParseResult =
  | { readonly valid: true; readonly report: PivotSeatReport }
  | { readonly valid: false; readonly reason: string };

export interface PivotAgreementTally {
  readonly candidateId: string;
  readonly endorsementCount: number;
  readonly endorsingSeatIds: readonly string[];
}

export interface PivotAgreementResult {
  readonly converged: boolean;
  readonly selectedCandidateId: string | null;
  readonly endorsementCount: number;
  readonly endorsingSeatIds: readonly string[];
  readonly tallies: readonly PivotAgreementTally[];
  readonly highSeverityBlockers: readonly PivotSeatBlocker[];
  readonly reason: 'agreed' | 'insufficient_endorsement' | 'high_severity_blocker';
}

export interface DivergentConfigInput {
  readonly maxPivots?: number;
  readonly maxCouncilSeatOutputs?: number;
  readonly minRemainingIterations?: number;
  readonly candidateSimilarityThreshold?: number;
}

export interface DivergentAntiConvergenceInput {
  readonly divergent?: DivergentConfigInput;
}

export interface PivotConfigInput {
  readonly antiConvergence?: DivergentAntiConvergenceInput;
}

export interface PivotUsage {
  readonly completedPivots: number;
  readonly councilSeatOutputs: number;
  readonly remainingIterations: number;
  readonly insidePivot?: boolean;
}

export interface PivotDispatchContext {
  readonly pivotId: string;
  readonly round: 1;
  readonly depth: 1;
  readonly insidePivot: true;
  readonly recursionAllowed: false;
  readonly candidates: readonly PivotCandidate[];
  readonly previousFocus: string;
  readonly normalizedTrigger: string;
}

export interface PivotSeatDispatchContext {
  readonly roundId: string;
  readonly seatIndex: number;
  readonly context: PivotDispatchContext;
}

export type PivotSeatDispatcher = (
  seat: PivotSeatMandate,
  context: PivotSeatDispatchContext,
) => Promise<unknown>;

export type PivotLifecycleState =
  | 'LEGAL_STOP'
  | 'PIVOT_PENDING'
  | 'COUNCIL_RUNNING'
  | 'PIVOT_SELECTED'
  | 'PIVOT_COMPLETED'
  | 'CONTINUE';

export type PivotEventName =
  | 'pivot_started'
  | 'pivot_candidate_rejected'
  | 'pivot_seat_returned'
  | 'pivot_deliberation_completed'
  | 'pivot_selected'
  | 'pivot_completed'
  | 'pivot_failed';

export interface PivotLifecycleTransition {
  readonly from: PivotLifecycleState;
  readonly to: PivotLifecycleState;
  readonly next?: PivotLifecycleState;
}

export interface PivotEvent {
  readonly schemaVersion: 1;
  readonly eventId: string;
  readonly event: PivotEventName;
  readonly pivotId: string;
  readonly occurredAtIso: string;
  readonly lifecycle: PivotLifecycleTransition;
  readonly [field: string]: unknown;
}

export interface PivotEventObserver {
  (event: PivotEvent): void;
}

export interface RunDivergentPivotOptions {
  readonly artifactRoot: string;
  readonly identity: PivotIdentityInput;
  readonly config?: PivotConfigInput;
  readonly usage: PivotUsage;
  readonly seats: readonly PivotSeatMandate[];
  readonly candidates: readonly unknown[];
  readonly priorCandidates?: readonly unknown[];
  readonly previousFocus: string;
  readonly saturatedDirections?: readonly string[];
  readonly dispatchSeat: PivotSeatDispatcher;
  readonly now?: () => Date | string;
  readonly afterEventPersisted?: PivotEventObserver;
}

export type PivotFailureReason =
  | 'recursion_guard'
  | 'max_pivots_exceeded'
  | 'max_council_seat_outputs_exceeded'
  | 'insufficient_remaining_iterations'
  | 'no_valid_candidates'
  | 'council_all_seats_rejected'
  | 'council_return_quorum_failed'
  | 'council_parse_quorum_failed'
  | 'council_agreement_failed';

export interface PivotCompletedResult {
  readonly status: 'completed';
  readonly pivotId: string;
  readonly paths: PivotCouncilPaths;
  readonly resumed: boolean;
  readonly selectedCandidate: PivotCandidate;
  readonly restoredFocus: string;
  readonly agreement: PivotAgreementResult;
  readonly completedEvent: PivotEvent;
}

export interface PivotFailedResult {
  readonly status: 'failed';
  readonly pivotId: string;
  readonly paths: PivotCouncilPaths;
  readonly resumed: boolean;
  readonly failureReason: PivotFailureReason;
  readonly durable: boolean;
  readonly quorum?: PivotQuorumResult;
  readonly agreement?: PivotAgreementResult;
  readonly failedEvent?: PivotEvent;
}

export type PivotTransactionResult = PivotCompletedResult | PivotFailedResult;

interface NormalizedDivergentConfig {
  readonly maxPivots: number;
  readonly maxCouncilSeatOutputs: number;
  readonly minRemainingIterations: number;
  readonly candidateSimilarityThreshold: number;
}

interface DispatchSeatResult {
  readonly seat_id: string;
  readonly status: 'fulfilled' | 'rejected';
  readonly started_at_iso: string;
  readonly completed_at_iso: string;
  readonly duration_ms: number;
  readonly output?: unknown;
  readonly error?: { readonly name: string; readonly message: string };
}

interface DispatchRoundResult {
  readonly round_id: string;
  readonly results: readonly DispatchSeatResult[];
  readonly summary: {
    readonly total: number;
    readonly succeeded: number;
    readonly failed: number;
    readonly all_failed: boolean;
  };
}

export interface PivotQuorumResult {
  readonly required: 3;
  readonly returned: number;
  readonly fulfilled: number;
  readonly parseValid: number;
  readonly allFailed: boolean;
  readonly passed: boolean;
}

interface EventStore {
  readonly events: PivotEvent[];
  readonly byId: Map<string, PivotEvent>;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const require = createRequire(import.meta.url);
const { dispatchCouncilSeats } = require('../council/multi-seat-dispatch.cjs') as {
  dispatchCouncilSeats: (options: {
    roundId: string;
    seats: readonly PivotSeatMandate[];
    dispatchSeat: PivotSeatDispatcher;
    context: PivotDispatchContext;
    now: () => Date | string;
  }) => Promise<DispatchRoundResult>;
};

const REQUIRED_SEAT_IDS = ['seat-001', 'seat-002', 'seat-003'] as const;
const DEFAULT_DIVERGENT_CONFIG: NormalizedDivergentConfig = {
  maxPivots: 3,
  maxCouncilSeatOutputs: 9,
  minRemainingIterations: 1,
  candidateSimilarityThreshold: DEFAULT_CANDIDATE_SIMILARITY_THRESHOLD,
};
const PIVOT_EVENT_NAMES = new Set<string>([
  'pivot_started',
  'pivot_candidate_rejected',
  'pivot_seat_returned',
  'pivot_deliberation_completed',
  'pivot_selected',
  'pivot_completed',
  'pivot_failed',
]);
const PIVOT_LIFECYCLE_STATES = new Set<string>([
  'LEGAL_STOP',
  'PIVOT_PENDING',
  'COUNCIL_RUNNING',
  'PIVOT_SELECTED',
  'PIVOT_COMPLETED',
  'CONTINUE',
]);
const PIVOT_FAILURE_REASONS = new Set<string>([
  'max_pivots_exceeded',
  'max_council_seat_outputs_exceeded',
  'insufficient_remaining_iterations',
  'no_valid_candidates',
  'council_all_seats_rejected',
  'council_return_quorum_failed',
  'council_parse_quorum_failed',
  'council_agreement_failed',
]);
const pivotExecutionContext = new AsyncLocalStorage<boolean>();

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function nonEmptyString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`${field} must be a non-empty string.`);
  }
  return value.trim();
}

function nonNegativeInteger(value: unknown, field: string): number {
  if (!Number.isInteger(value) || Number(value) < 0) {
    throw new TypeError(`${field} must be a non-negative integer.`);
  }
  return Number(value);
}

function positiveInteger(value: unknown, field: string): number {
  if (!Number.isInteger(value) || Number(value) < 1) {
    throw new TypeError(`${field} must be a positive integer.`);
  }
  return Number(value);
}

function finiteRatio(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) {
    throw new TypeError(`${field} must be a finite number from 0 through 1.`);
  }
  return value;
}

function normalizeTrigger(value: string): string {
  return value.normalize('NFKC').toLowerCase().replace(/\s+/gu, ' ').trim();
}

function isoTimestamp(now: () => Date | string): string {
  const value = now();
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'string' && value.trim() !== '') {
    return value;
  }
  throw new TypeError('now must return a Date or non-empty ISO timestamp string.');
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }
  if (!isRecord(value)) {
    return value;
  }
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(value).sort()) {
    result[key] = canonicalize(value[key]);
  }
  return result;
}

function stableJson(value: unknown): string {
  return JSON.stringify(canonicalize(value));
}

function isLifecycleTransition(value: unknown): value is PivotLifecycleTransition {
  if (!isRecord(value)
    || typeof value.from !== 'string'
    || typeof value.to !== 'string'
    || !PIVOT_LIFECYCLE_STATES.has(value.from)
    || !PIVOT_LIFECYCLE_STATES.has(value.to)) {
    return false;
  }
  return value.next === undefined
    || (typeof value.next === 'string' && PIVOT_LIFECYCLE_STATES.has(value.next));
}

function resolveProspectiveRealPath(path: string): string {
  let current = resolve(path);
  const missingSegments: string[] = [];
  while (!existsSync(current)) {
    const parent = dirname(current);
    if (parent === current) {
      throw new TypeError(`Unable to resolve artifact path "${path}".`);
    }
    missingSegments.unshift(current.slice(parent.length + (parent.endsWith(sep) ? 0 : 1)));
    current = parent;
  }
  return join(realpathSync.native(current), ...missingSegments);
}

function pathContainsAiCouncil(path: string): boolean {
  return resolve(path).split(sep).some((segment) => segment.toLowerCase() === 'ai-council');
}

function normalizeConfig(input: PivotConfigInput | undefined): NormalizedDivergentConfig {
  const divergent = input?.antiConvergence?.divergent ?? {};
  return {
    maxPivots: positiveInteger(
      divergent.maxPivots ?? DEFAULT_DIVERGENT_CONFIG.maxPivots,
      'antiConvergence.divergent.maxPivots',
    ),
    maxCouncilSeatOutputs: positiveInteger(
      divergent.maxCouncilSeatOutputs ?? DEFAULT_DIVERGENT_CONFIG.maxCouncilSeatOutputs,
      'antiConvergence.divergent.maxCouncilSeatOutputs',
    ),
    minRemainingIterations: nonNegativeInteger(
      divergent.minRemainingIterations ?? DEFAULT_DIVERGENT_CONFIG.minRemainingIterations,
      'antiConvergence.divergent.minRemainingIterations',
    ),
    candidateSimilarityThreshold: finiteRatio(
      divergent.candidateSimilarityThreshold
        ?? DEFAULT_DIVERGENT_CONFIG.candidateSimilarityThreshold,
      'antiConvergence.divergent.candidateSimilarityThreshold',
    ),
  };
}

function normalizeUsage(usage: PivotUsage): PivotUsage {
  return {
    completedPivots: nonNegativeInteger(usage.completedPivots, 'usage.completedPivots'),
    councilSeatOutputs: nonNegativeInteger(
      usage.councilSeatOutputs,
      'usage.councilSeatOutputs',
    ),
    remainingIterations: nonNegativeInteger(
      usage.remainingIterations,
      'usage.remainingIterations',
    ),
    insidePivot: usage.insidePivot === true,
  };
}

function normalizeSeats(seats: readonly PivotSeatMandate[]): readonly PivotSeatMandate[] {
  if (!Array.isArray(seats) || seats.length !== 3) {
    throw new TypeError('Exactly three Council seat mandates are required.');
  }
  const normalized = seats.map((seat, index) => {
    if (!isRecord(seat)) {
      throw new TypeError(`Seat at index ${index} must be an object.`);
    }
    const id = nonEmptyString(seat.id, `seats[${index}].id`);
    const mandate = nonEmptyString(seat.mandate, `seats[${index}].mandate`);
    if (id !== REQUIRED_SEAT_IDS[index]) {
      throw new TypeError(`Seat at index ${index} must use id "${REQUIRED_SEAT_IDS[index]}".`);
    }
    return { id, mandate };
  });
  const mandateKeys = new Set(normalized.map((seat) => normalizeTrigger(seat.mandate)));
  if (mandateKeys.size !== 3) {
    throw new TypeError('Council seat mandates must be distinct.');
  }
  return normalized;
}

function validateIdentity(identity: PivotIdentityInput): PivotIdentityInput {
  const generation = typeof identity.generation === 'number'
    ? String(nonNegativeInteger(identity.generation, 'identity.generation'))
    : nonEmptyString(identity.generation, 'identity.generation');
  return {
    sessionId: nonEmptyString(identity.sessionId, 'identity.sessionId'),
    generation,
    loopType: nonEmptyString(identity.loopType, 'identity.loopType'),
    sourceIteration: nonNegativeInteger(identity.sourceIteration, 'identity.sourceIteration'),
    normalizedTrigger: normalizeTrigger(
      nonEmptyString(identity.normalizedTrigger, 'identity.normalizedTrigger'),
    ),
    ordinal: positiveInteger(identity.ordinal, 'identity.ordinal'),
  };
}

function eventSemanticPayload(event: PivotEvent): Record<string, unknown> {
  const { occurredAtIso: _occurredAtIso, event_hash: _eventHash, ...semantic } = event;
  return semantic;
}

function readEventStore(statePath: string, pivotId: string): EventStore {
  const events: PivotEvent[] = [];
  const byId = new Map<string, PivotEvent>();
  if (!existsSync(statePath)) {
    return { events, byId };
  }

  const lines = readFileSync(statePath, 'utf8').split(/\r?\n/u).filter((line) => line.trim() !== '');
  lines.forEach((line, index) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(line);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Pivot state line ${index + 1} is invalid JSON: ${message}`);
    }
    if (!isRecord(parsed)
      || parsed.schemaVersion !== 1
      || typeof parsed.eventId !== 'string'
      || parsed.eventId.trim() === ''
      || typeof parsed.event !== 'string'
      || !PIVOT_EVENT_NAMES.has(parsed.event)
      || parsed.pivotId !== pivotId
      || typeof parsed.occurredAtIso !== 'string'
      || !isLifecycleTransition(parsed.lifecycle)
      || (parsed.event === 'pivot_failed'
        && (typeof parsed.reason !== 'string' || !PIVOT_FAILURE_REASONS.has(parsed.reason)))) {
      throw new Error(`Pivot state line ${index + 1} does not match the pivot event contract.`);
    }
    const event = parsed as unknown as PivotEvent;
    const existing = byId.get(event.eventId);
    if (existing) {
      if (stableJson(eventSemanticPayload(existing)) !== stableJson(eventSemanticPayload(event))) {
        throw new Error(`Conflicting durable pivot event "${event.eventId}".`);
      }
      return;
    }
    events.push(event);
    byId.set(event.eventId, event);
  });
  return { events, byId };
}

function appendEvent(
  store: EventStore,
  statePath: string,
  pivotId: string,
  now: () => Date | string,
  observer: PivotEventObserver | undefined,
  event: Pick<PivotEvent, 'eventId' | 'event' | 'lifecycle'> & Record<string, unknown>,
): PivotEvent {
  const candidate: PivotEvent = {
    schemaVersion: 1,
    ...event,
    pivotId,
    occurredAtIso: isoTimestamp(now),
  };
  const existing = store.byId.get(candidate.eventId);
  if (existing) {
    if (stableJson(eventSemanticPayload(existing)) !== stableJson(eventSemanticPayload(candidate))) {
      throw new Error(`Conflicting replay for pivot event "${candidate.eventId}".`);
    }
    return existing;
  }

  appendJsonlIfChangedAtomic(statePath, candidate, {
    cache: new Map<string, string>(),
    diffField: 'event_hash',
    diffData: eventSemanticPayload(candidate),
  });
  store.events.push(candidate);
  store.byId.set(candidate.eventId, candidate);
  observer?.(candidate);
  return candidate;
}

function eventByName(store: EventStore, name: PivotEventName): PivotEvent | undefined {
  return store.events.find((event) => event.event === name);
}

function seatEventId(pivotId: string, seatId: string): string {
  return `${pivotId}:pivot_seat_returned:${seatId}`;
}

function candidateRejectionEventId(
  pivotId: string,
  result: RejectedPivotCandidateDeduplication,
  index: number,
): string {
  const subject = result.candidate?.id ?? `invalid-${index + 1}`;
  return `${pivotId}:pivot_candidate_rejected:${index + 1}:${subject}`;
}

function persistConfig(path: string, config: Record<string, unknown>): void {
  if (existsSync(path)) {
    const existing = JSON.parse(readFileSync(path, 'utf8')) as unknown;
    if (stableJson(existing) !== stableJson(config)) {
      throw new Error('Existing pivot config conflicts with the resumed transaction.');
    }
    return;
  }
  writeStateIfChangedAtomic(path, config, new Map<string, string>());
}

function writeMarkdownIfConsistent(path: string, content: string): void {
  if (existsSync(path)) {
    if (readFileSync(path, 'utf8') !== content) {
      throw new Error(`Existing pivot artifact conflicts with durable state: ${path}`);
    }
    return;
  }
  writeTextAtomic(path, content);
}

function parseBlocker(value: unknown, candidateIds: ReadonlySet<string>): PivotSeatBlocker | null {
  if (!isRecord(value)) {
    return null;
  }
  if (value.severity !== 'low' && value.severity !== 'medium' && value.severity !== 'high') {
    return null;
  }
  if (typeof value.message !== 'string' || value.message.trim() === '') {
    return null;
  }
  if (value.candidateId !== undefined
    && (typeof value.candidateId !== 'string' || !candidateIds.has(value.candidateId))) {
    return null;
  }
  return {
    severity: value.severity,
    message: value.message.trim(),
    ...(typeof value.candidateId === 'string' ? { candidateId: value.candidateId } : {}),
  };
}

function renderSeatArtifact(event: PivotEvent): string {
  const status = String(event.status);
  const body = event.parseValid === true
    ? JSON.stringify(event.report, null, 2)
    : JSON.stringify({ error: event.error ?? event.parseError ?? 'Unknown seat failure' }, null, 2);
  return [
    `# ${String(event.seatId)}`,
    '',
    `- Status: ${status}`,
    `- Parse valid: ${String(event.parseValid === true)}`,
    `- Mandate: ${String(event.mandate)}`,
    '',
    '## Durable Result',
    '',
    '```json',
    body,
    '```',
    '',
  ].join('\n');
}

function renderDeliberationArtifact(event: PivotEvent): string {
  return [
    '# Pivot Council Deliberation',
    '',
    '```json',
    JSON.stringify({ quorum: event.quorum, agreement: event.agreement }, null, 2),
    '```',
    '',
  ].join('\n');
}

function renderReportArtifact(event: PivotEvent): string {
  const { event_hash: _eventHash, ...reportEvent } = event;
  return [
    '# Pivot Council Report',
    '',
    `- Status: ${event.event === 'pivot_completed' ? 'completed' : 'failed'}`,
    `- Pivot: ${event.pivotId}`,
    ...(event.event === 'pivot_failed' ? [`- Failure reason: ${String(event.reason)}`] : []),
    ...(event.event === 'pivot_completed'
      ? [`- Selected candidate: ${String((event.selectedCandidate as PivotCandidate).id)}`]
      : []),
    '',
    '```json',
    JSON.stringify(reportEvent, null, 2),
    '```',
    '',
  ].join('\n');
}

function quorumFromSeatEvents(events: readonly PivotEvent[]): PivotQuorumResult {
  const fulfilled = events.filter((event) => event.status === 'fulfilled').length;
  const parseValid = events.filter((event) => event.parseValid === true).length;
  return {
    required: 3,
    returned: events.length,
    fulfilled,
    parseValid,
    allFailed: events.length === 3 && fulfilled === 0,
    passed: events.length === 3 && fulfilled === 3 && parseValid === 3,
  };
}

function failureReasonForQuorum(quorum: PivotQuorumResult): PivotFailureReason {
  if (quorum.allFailed) {
    return 'council_all_seats_rejected';
  }
  if (quorum.fulfilled < 3) {
    return 'council_return_quorum_failed';
  }
  return 'council_parse_quorum_failed';
}

function preflightFailure(
  config: NormalizedDivergentConfig,
  usage: PivotUsage,
): PivotFailureReason | null {
  if (usage.completedPivots >= config.maxPivots) {
    return 'max_pivots_exceeded';
  }
  if (usage.councilSeatOutputs + 3 > config.maxCouncilSeatOutputs) {
    return 'max_council_seat_outputs_exceeded';
  }
  if (usage.remainingIterations < config.minRemainingIterations) {
    return 'insufficient_remaining_iterations';
  }
  return null;
}

function completedResultFromEvent(
  event: PivotEvent,
  paths: PivotCouncilPaths,
  resumed: boolean,
): PivotCompletedResult {
  const validation = validatePivotCandidate(event.selectedCandidate);
  if (!validation.valid
    || event.currentFocus !== validation.candidate.focus
    || !isRecord(event.agreement)) {
    throw new Error('Durable pivot_completed event is missing restoration data.');
  }
  return {
    status: 'completed',
    pivotId: event.pivotId,
    paths,
    resumed,
    selectedCandidate: validation.candidate,
    restoredFocus: event.currentFocus,
    agreement: event.agreement as unknown as PivotAgreementResult,
    completedEvent: event,
  };
}

function failedResultFromEvent(
  event: PivotEvent,
  paths: PivotCouncilPaths,
  resumed: boolean,
): PivotFailedResult {
  return {
    status: 'failed',
    pivotId: event.pivotId,
    paths,
    resumed,
    failureReason: event.reason as PivotFailureReason,
    durable: true,
    ...(isRecord(event.quorum) ? { quorum: event.quorum as unknown as PivotQuorumResult } : {}),
    ...(isRecord(event.agreement)
      ? { agreement: event.agreement as unknown as PivotAgreementResult }
      : {}),
    failedEvent: event,
  };
}

// ───────────────────────────────────────────────────────────────────
// 4. EXPORTED PURE MECHANICS
// ───────────────────────────────────────────────────────────────────

/** Derive the deterministic pivot id from immutable lineage and normalized trigger data. */
export function derivePivotId(input: PivotIdentityInput): string {
  const identity = validateIdentity(input);
  const digestInput = [
    identity.sessionId,
    identity.generation,
    identity.loopType,
    identity.sourceIteration,
    identity.normalizedTrigger,
  ].join('|');
  const digest = createHash('sha256').update(digestInput).digest('hex').slice(0, 12);
  return `pivot-${identity.ordinal}-${digest}`;
}

/** Build and validate the isolated artifact paths for one pivot Council transaction. */
export function buildPivotCouncilPaths(artifactRoot: string, pivotId: string): PivotCouncilPaths {
  const rootInput = nonEmptyString(artifactRoot, 'artifactRoot');
  if (!/^pivot-[1-9][0-9]*-[a-f0-9]{12}$/u.test(pivotId)) {
    throw new TypeError('pivotId must match pivot-<ordinal>-<12 lowercase hex characters>.');
  }
  const canonicalRoot = resolveProspectiveRealPath(rootInput);
  if (pathContainsAiCouncil(canonicalRoot)) {
    throw new TypeError('artifactRoot must not be inside an ai-council artifact tree.');
  }
  const pivotRoot = join(canonicalRoot, 'divergent', 'pivots', pivotId);
  const councilRoot = join(pivotRoot, 'council');
  const seatsRoot = join(councilRoot, 'seats');
  return {
    artifactRoot: canonicalRoot,
    pivotRoot,
    councilRoot,
    configPath: join(councilRoot, 'config.json'),
    statePath: join(councilRoot, 'state.jsonl'),
    seatsRoot,
    seatPaths: [
      join(seatsRoot, 'seat-001.md'),
      join(seatsRoot, 'seat-002.md'),
      join(seatsRoot, 'seat-003.md'),
    ],
    deliberationPath: join(councilRoot, 'deliberation.md'),
    reportPath: join(councilRoot, 'report.md'),
  };
}

/** Parse and validate an injected seat output without accepting partial reports. */
export function parsePivotSeatReport(
  output: unknown,
  expectedSeatId: string,
  candidateIds: ReadonlySet<string>,
): PivotSeatReportParseResult {
  let parsed = output;
  if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return { valid: false, reason: 'Seat output must be a JSON object or JSON object string.' };
    }
  }
  if (!isRecord(parsed)) {
    return { valid: false, reason: 'Seat output must be an object.' };
  }
  if (parsed.seatId !== expectedSeatId) {
    return { valid: false, reason: `Seat report must identify itself as "${expectedSeatId}".` };
  }
  const selectedCandidateId = parsed.selectedCandidateId;
  if (selectedCandidateId !== null
    && (typeof selectedCandidateId !== 'string' || !candidateIds.has(selectedCandidateId))) {
    return { valid: false, reason: 'selectedCandidateId must be null or identify a valid candidate.' };
  }
  if (typeof parsed.materialEndorsement !== 'boolean') {
    return { valid: false, reason: 'materialEndorsement must be a boolean.' };
  }
  if (parsed.materialEndorsement && selectedCandidateId === null) {
    return { valid: false, reason: 'A material endorsement must identify a selected candidate.' };
  }
  if (typeof parsed.rationale !== 'string' || parsed.rationale.trim() === '') {
    return { valid: false, reason: 'Seat rationale must be a non-empty string.' };
  }
  if (!Array.isArray(parsed.blockers)) {
    return { valid: false, reason: 'Seat blockers must be an array.' };
  }
  const blockers = parsed.blockers.map((blocker) => parseBlocker(blocker, candidateIds));
  if (blockers.some((blocker) => blocker === null)) {
    return { valid: false, reason: 'Every seat blocker must match the blocker contract.' };
  }
  return {
    valid: true,
    report: {
      seatId: expectedSeatId,
      selectedCandidateId: selectedCandidateId as string | null,
      materialEndorsement: parsed.materialEndorsement,
      rationale: parsed.rationale.trim(),
      blockers: blockers as PivotSeatBlocker[],
    },
  };
}

/** Evaluate two-of-three material endorsement and the global high-blocker veto. */
export function evaluatePivotAgreement(
  reports: readonly PivotSeatReport[],
  candidateOrder: readonly string[],
): PivotAgreementResult {
  const highSeverityBlockers = reports.flatMap((report) =>
    report.blockers.filter((blocker) => blocker.severity === 'high'));
  const tallies = candidateOrder.map((candidateId) => {
    const endorsingSeatIds = reports
      .filter((report) => report.materialEndorsement && report.selectedCandidateId === candidateId)
      .map((report) => report.seatId);
    return { candidateId, endorsementCount: endorsingSeatIds.length, endorsingSeatIds };
  });
  const selected = tallies.find((tally) => tally.endorsementCount >= 2) ?? null;
  const converged = reports.length === 3 && selected !== null && highSeverityBlockers.length === 0;
  return {
    converged,
    selectedCandidateId: selected?.candidateId ?? null,
    endorsementCount: selected?.endorsementCount ?? 0,
    endorsingSeatIds: selected?.endorsingSeatIds ?? [],
    tallies,
    highSeverityBlockers,
    reason: highSeverityBlockers.length > 0
      ? 'high_severity_blocker'
      : selected === null
        ? 'insufficient_endorsement'
        : 'agreed',
  };
}

// ───────────────────────────────────────────────────────────────────
// 5. TRANSACTION — PREPARE / RECORD / FINALIZE
// ───────────────────────────────────────────────────────────────────
//
// runDivergentPivot works only when the caller can hand it a synchronous,
// in-process dispatchSeat callback. A YAML-interpreted workflow cannot:
// only the running agent can natively dispatch a Council seat, and a
// single script invocation cannot pause mid-run for that and resume with
// the result. The three functions below split the same transaction across
// process boundaries — prepare persists everything up through "which seats
// are still missing" and returns; recordPivotSeatResult durably records
// one externally-obtained seat result per call (one per native dispatch
// step); finalize re-derives all context from disk (via the durable
// config.json prepare already wrote) and completes the transaction.
// runDivergentPivot composes all three for callers that do have a working
// synchronous dispatchSeat, so its observable behavior is unchanged.

export interface PivotPendingResult {
  readonly status: 'pending';
  readonly pivotId: string;
  readonly paths: PivotCouncilPaths;
  readonly resumed: boolean;
  readonly missingSeats: readonly PivotSeatMandate[];
  readonly dispatchContext: PivotDispatchContext;
}

export type PivotPrepareResult = PivotCompletedResult | PivotFailedResult | PivotPendingResult;

export interface PreparePivotTransactionOptions {
  readonly artifactRoot: string;
  readonly identity: PivotIdentityInput;
  readonly config?: PivotConfigInput;
  readonly usage: PivotUsage;
  readonly seats: readonly PivotSeatMandate[];
  readonly candidates: readonly unknown[];
  readonly priorCandidates?: readonly unknown[];
  readonly previousFocus: string;
  readonly saturatedDirections?: readonly string[];
  readonly now?: () => Date | string;
  readonly afterEventPersisted?: PivotEventObserver;
}

export type PivotSeatDispatchOutcome =
  | {
    readonly status: 'fulfilled';
    readonly output: unknown;
    readonly startedAtIso: string;
    readonly completedAtIso: string;
    readonly durationMs: number;
  }
  | {
    readonly status: 'rejected';
    readonly error?: { readonly name: string; readonly message: string };
    readonly startedAtIso: string;
    readonly completedAtIso: string;
    readonly durationMs: number;
  };

export interface RecordPivotSeatResultOptions {
  readonly paths: PivotCouncilPaths;
  readonly pivotId: string;
  readonly seat: PivotSeatMandate;
  readonly outcome: PivotSeatDispatchOutcome;
  readonly now?: () => Date | string;
  readonly afterEventPersisted?: PivotEventObserver;
}

export interface FinalizePivotTransactionOptions {
  readonly paths: PivotCouncilPaths;
  readonly pivotId: string;
  readonly resumed?: boolean;
  readonly now?: () => Date | string;
  readonly afterEventPersisted?: PivotEventObserver;
}

interface PersistedPivotConfig {
  readonly schemaVersion: 1;
  readonly pivotId: string;
  readonly identity: PivotIdentityInput;
  readonly invariants: { readonly rounds: 1; readonly seats: 3; readonly depth: 1; readonly recursionAllowed: false };
  readonly limits: NormalizedDivergentConfig;
  readonly usageAtStart: PivotUsage;
  readonly seats: readonly PivotSeatMandate[];
  readonly acceptedCandidates: readonly PivotCandidate[];
  readonly rejectedCandidates: readonly RejectedPivotCandidateDeduplication[];
  readonly previousFocus: string;
  readonly saturatedDirections: readonly string[];
}

function readPersistedConfig(configPath: string, pivotId: string): PersistedPivotConfig {
  if (!existsSync(configPath)) {
    throw new Error(`Pivot config not found for "${pivotId}"; run preparePivotTransaction first.`);
  }
  const parsed = JSON.parse(readFileSync(configPath, 'utf8')) as unknown;
  if (!isRecord(parsed) || parsed.pivotId !== pivotId || !Array.isArray(parsed.acceptedCandidates)) {
    throw new Error(`Pivot config at "${configPath}" does not match the expected contract.`);
  }
  return parsed as unknown as PersistedPivotConfig;
}

/** Validate, dedupe, and persist through "which seats remain to dispatch" — no seat dispatch here. */
export async function preparePivotTransaction(
  options: PreparePivotTransactionOptions,
): Promise<PivotPrepareResult> {
  if (!isRecord(options)) {
    throw new TypeError('preparePivotTransaction options must be an object.');
  }

  const identity = validateIdentity(options.identity);
  const pivotId = derivePivotId(identity);
  const paths = buildPivotCouncilPaths(options.artifactRoot, pivotId);
  const usage = normalizeUsage(options.usage);
  const config = normalizeConfig(options.config);
  const seats = normalizeSeats(options.seats);
  const previousFocus = nonEmptyString(options.previousFocus, 'previousFocus');
  const saturatedDirections = (options.saturatedDirections ?? []).map((direction, index) =>
    nonEmptyString(direction, `saturatedDirections[${index}]`));
  const now = options.now ?? (() => new Date());

  if (usage.insidePivot || pivotExecutionContext.getStore() === true) {
    return {
      status: 'failed',
      pivotId,
      paths,
      resumed: false,
      failureReason: 'recursion_guard',
      durable: false,
    };
  }

  const store = readEventStore(paths.statePath, pivotId);
  const completedEvent = eventByName(store, 'pivot_completed');
  const failedEvent = eventByName(store, 'pivot_failed');
  if (completedEvent && failedEvent) {
    throw new Error('Pivot state contains both completed and failed outcomes.');
  }
  if (completedEvent) {
    writeMarkdownIfConsistent(paths.reportPath, renderReportArtifact(completedEvent));
    return completedResultFromEvent(completedEvent, paths, true);
  }
  if (failedEvent) {
    writeMarkdownIfConsistent(paths.reportPath, renderReportArtifact(failedEvent));
    return failedResultFromEvent(failedEvent, paths, true);
  }

  const candidateSet = deduplicatePivotCandidates(
    options.candidates,
    options.priorCandidates ?? [],
    { candidateSimilarityThreshold: config.candidateSimilarityThreshold },
  );
  const configRecord: PersistedPivotConfig = {
    schemaVersion: 1,
    pivotId,
    identity,
    invariants: { rounds: 1, seats: 3, depth: 1, recursionAllowed: false },
    limits: config,
    usageAtStart: usage,
    seats,
    acceptedCandidates: candidateSet.accepted,
    rejectedCandidates: candidateSet.rejected,
    previousFocus,
    saturatedDirections,
  };
  mkdirSync(paths.councilRoot, { recursive: true });
  persistConfig(paths.configPath, configRecord as unknown as Record<string, unknown>);

  const resumed = eventByName(store, 'pivot_started') !== undefined;
  appendEvent(
    store,
    paths.statePath,
    pivotId,
    now,
    options.afterEventPersisted,
    {
      eventId: `${pivotId}:pivot_started`,
      event: 'pivot_started',
      lifecycle: { from: 'LEGAL_STOP', to: 'PIVOT_PENDING', next: 'COUNCIL_RUNNING' },
      ordinal: identity.ordinal,
      source: identity,
      previousFocus,
      saturatedDirections,
      priorPivotCount: usage.completedPivots,
      priorCouncilSeatOutputs: usage.councilSeatOutputs,
      remainingIterations: usage.remainingIterations,
      acceptedCandidateIds: candidateSet.accepted.map((candidate) => candidate.id),
    },
  );

  candidateSet.rejected.forEach((rejection, index) => {
    appendEvent(
      store,
      paths.statePath,
      pivotId,
      now,
      options.afterEventPersisted,
      {
        eventId: candidateRejectionEventId(pivotId, rejection, index),
        event: 'pivot_candidate_rejected',
        lifecycle: { from: 'PIVOT_PENDING', to: 'PIVOT_PENDING' },
        candidate: rejection.candidate ?? null,
        normalizedFingerprint: rejection.normalizedFingerprint ?? null,
        reasons: rejection.rejections,
      },
    );
  });

  const preflightReason = preflightFailure(config, usage);
  const earlyFailureReason = preflightReason
    ?? (candidateSet.accepted.length === 0 ? 'no_valid_candidates' : null);
  if (earlyFailureReason) {
    const failed = appendEvent(
      store,
      paths.statePath,
      pivotId,
      now,
      options.afterEventPersisted,
      {
        eventId: `${pivotId}:pivot_failed`,
        event: 'pivot_failed',
        lifecycle: { from: 'PIVOT_PENDING', to: 'PIVOT_PENDING' },
        reason: earlyFailureReason,
        recoverableByOverride: false,
      },
    );
    writeMarkdownIfConsistent(paths.reportPath, renderReportArtifact(failed));
    return failedResultFromEvent(failed, paths, resumed);
  }

  const durableSeatEvents = new Map<string, PivotEvent>();
  for (const seat of seats) {
    const event = store.byId.get(seatEventId(pivotId, seat.id));
    if (event) {
      durableSeatEvents.set(seat.id, event);
    }
  }
  if (durableSeatEvents.size > 0) {
    mkdirSync(paths.seatsRoot, { recursive: true });
    seats.forEach((seat, index) => {
      const event = durableSeatEvents.get(seat.id);
      if (event) {
        writeMarkdownIfConsistent(paths.seatPaths[index], renderSeatArtifact(event));
      }
    });
  }

  const missingSeats = seats.filter((seat) => !durableSeatEvents.has(seat.id));
  return {
    status: 'pending',
    pivotId,
    paths,
    resumed,
    missingSeats,
    dispatchContext: {
      pivotId,
      round: 1,
      depth: 1,
      insidePivot: true,
      recursionAllowed: false,
      candidates: candidateSet.accepted,
      previousFocus,
      normalizedTrigger: identity.normalizedTrigger,
    },
  };
}

/** Durably record one externally-obtained seat result. Call once per native dispatch step. */
export function recordPivotSeatResult(options: RecordPivotSeatResultOptions): PivotEvent {
  const { paths, pivotId, seat, outcome } = options;
  const now = options.now ?? (() => new Date());
  const persistedConfig = readPersistedConfig(paths.configPath, pivotId);
  const seatIndex = persistedConfig.seats.findIndex((entry) => entry.id === seat.id);
  if (seatIndex < 0) {
    throw new Error(`Seat "${seat.id}" is not part of pivot "${pivotId}".`);
  }
  const candidateIds = new Set(persistedConfig.acceptedCandidates.map((candidate) => candidate.id));
  const store = readEventStore(paths.statePath, pivotId);

  const parsed = outcome.status === 'fulfilled'
    ? parsePivotSeatReport(outcome.output, seat.id, candidateIds)
    : { valid: false as const, reason: outcome.error?.message ?? 'Seat dispatch rejected.' };

  const event = appendEvent(
    store,
    paths.statePath,
    pivotId,
    now,
    options.afterEventPersisted,
    {
      eventId: seatEventId(pivotId, seat.id),
      event: 'pivot_seat_returned',
      lifecycle: { from: 'COUNCIL_RUNNING', to: 'COUNCIL_RUNNING' },
      seatId: seat.id,
      mandate: seat.mandate,
      status: outcome.status,
      parseValid: parsed.valid,
      ...(parsed.valid ? { report: parsed.report } : { parseError: parsed.reason }),
      ...(outcome.status === 'rejected' && outcome.error ? { error: outcome.error } : {}),
      startedAtIso: outcome.startedAtIso,
      completedAtIso: outcome.completedAtIso,
      durationMs: outcome.durationMs,
    },
  );

  mkdirSync(paths.seatsRoot, { recursive: true });
  writeMarkdownIfConsistent(paths.seatPaths[seatIndex], renderSeatArtifact(event));
  return event;
}

/** Re-derive durable state from disk and complete (or fail) the pivot transaction. */
export function finalizePivotTransaction(options: FinalizePivotTransactionOptions): PivotTransactionResult {
  const { paths, pivotId } = options;
  const resumed = options.resumed ?? true;
  const now = options.now ?? (() => new Date());
  const persistedConfig = readPersistedConfig(paths.configPath, pivotId);
  const store = readEventStore(paths.statePath, pivotId);

  const completedEvent = eventByName(store, 'pivot_completed');
  const failedEvent = eventByName(store, 'pivot_failed');
  if (completedEvent) {
    writeMarkdownIfConsistent(paths.reportPath, renderReportArtifact(completedEvent));
    return completedResultFromEvent(completedEvent, paths, true);
  }
  if (failedEvent) {
    writeMarkdownIfConsistent(paths.reportPath, renderReportArtifact(failedEvent));
    return failedResultFromEvent(failedEvent, paths, true);
  }

  const orderedSeatEvents = persistedConfig.seats
    .map((seat) => store.byId.get(seatEventId(pivotId, seat.id)))
    .filter((event): event is PivotEvent => event !== undefined);
  const quorum = quorumFromSeatEvents(orderedSeatEvents);
  const reports = orderedSeatEvents
    .filter((event) => event.parseValid === true && isRecord(event.report))
    .map((event) => event.report as unknown as PivotSeatReport);
  const agreement = evaluatePivotAgreement(
    reports,
    persistedConfig.acceptedCandidates.map((candidate) => candidate.id),
  );
  const deliberation = appendEvent(
    store,
    paths.statePath,
    pivotId,
    now,
    options.afterEventPersisted,
    {
      eventId: `${pivotId}:pivot_deliberation_completed`,
      event: 'pivot_deliberation_completed',
      lifecycle: { from: 'COUNCIL_RUNNING', to: 'COUNCIL_RUNNING' },
      quorum,
      agreement,
    },
  );
  writeMarkdownIfConsistent(paths.deliberationPath, renderDeliberationArtifact(deliberation));

  if (!quorum.passed || !agreement.converged || agreement.selectedCandidateId === null) {
    const reason = quorum.passed ? 'council_agreement_failed' : failureReasonForQuorum(quorum);
    const failed = appendEvent(
      store,
      paths.statePath,
      pivotId,
      now,
      options.afterEventPersisted,
      {
        eventId: `${pivotId}:pivot_failed`,
        event: 'pivot_failed',
        lifecycle: { from: 'COUNCIL_RUNNING', to: 'COUNCIL_RUNNING' },
        reason,
        quorum,
        agreement,
        recoverableByOverride: quorum.passed && agreement.reason === 'insufficient_endorsement',
      },
    );
    writeMarkdownIfConsistent(paths.reportPath, renderReportArtifact(failed));
    return failedResultFromEvent(failed, paths, resumed);
  }

  const selectedCandidate = persistedConfig.acceptedCandidates.find(
    (candidate) => candidate.id === agreement.selectedCandidateId,
  );
  if (!selectedCandidate) {
    throw new Error('Agreement selected a candidate that is not in the accepted frontier.');
  }
  appendEvent(
    store,
    paths.statePath,
    pivotId,
    now,
    options.afterEventPersisted,
    {
      eventId: `${pivotId}:pivot_selected`,
      event: 'pivot_selected',
      lifecycle: { from: 'COUNCIL_RUNNING', to: 'PIVOT_SELECTED' },
      selectedCandidate,
      selectedFrontier: persistedConfig.acceptedCandidates,
      agreement,
    },
  );
  const completed = appendEvent(
    store,
    paths.statePath,
    pivotId,
    now,
    options.afterEventPersisted,
    {
      eventId: `${pivotId}:pivot_completed`,
      event: 'pivot_completed',
      lifecycle: { from: 'PIVOT_SELECTED', to: 'PIVOT_COMPLETED', next: 'CONTINUE' },
      pivotCount: persistedConfig.usageAtStart.completedPivots + 1,
      councilSeatOutputs: persistedConfig.usageAtStart.councilSeatOutputs + 3,
      saturatedDirections: persistedConfig.saturatedDirections,
      selectedFrontier: persistedConfig.acceptedCandidates,
      selectedCandidate,
      previousFocus: persistedConfig.previousFocus,
      currentFocus: selectedCandidate.focus,
      agreement,
      artifactRefs: {
        config: relative(paths.artifactRoot, paths.configPath),
        state: relative(paths.artifactRoot, paths.statePath),
        seats: paths.seatPaths.map((path) => relative(paths.artifactRoot, path)),
        deliberation: relative(paths.artifactRoot, paths.deliberationPath),
        report: relative(paths.artifactRoot, paths.reportPath),
      },
    },
  );
  writeMarkdownIfConsistent(paths.reportPath, renderReportArtifact(completed));
  return completedResultFromEvent(completed, paths, resumed);
}

/** Execute or resume one mechanics-only, single-round divergent pivot transaction in one call. */
export async function runDivergentPivot(
  options: RunDivergentPivotOptions,
): Promise<PivotTransactionResult> {
  if (!isRecord(options)) {
    throw new TypeError('runDivergentPivot options must be an object.');
  }
  if (typeof options.dispatchSeat !== 'function') {
    throw new TypeError('dispatchSeat must be a function.');
  }

  const prepared = await preparePivotTransaction(options);
  if (prepared.status !== 'pending') {
    return prepared;
  }

  const now = options.now ?? (() => new Date());
  if (prepared.missingSeats.length > 0) {
    const dispatchResult = await pivotExecutionContext.run(true, () => dispatchCouncilSeats({
      roundId: `${prepared.pivotId}-round-001`,
      seats: prepared.missingSeats,
      dispatchSeat: options.dispatchSeat,
      context: prepared.dispatchContext,
      now,
    }));

    dispatchResult.results.forEach((result) => {
      const seatIndex = prepared.missingSeats.findIndex((seat) => seat.id === result.seat_id);
      if (seatIndex < 0) {
        throw new Error(`Council dispatcher returned unknown seat "${result.seat_id}".`);
      }
      const seat = prepared.missingSeats[seatIndex];
      const outcome: PivotSeatDispatchOutcome = result.status === 'fulfilled'
        ? {
          status: 'fulfilled',
          output: result.output,
          startedAtIso: result.started_at_iso,
          completedAtIso: result.completed_at_iso,
          durationMs: result.duration_ms,
        }
        : {
          status: 'rejected',
          error: result.error,
          startedAtIso: result.started_at_iso,
          completedAtIso: result.completed_at_iso,
          durationMs: result.duration_ms,
        };
      recordPivotSeatResult({
        paths: prepared.paths,
        pivotId: prepared.pivotId,
        seat,
        outcome,
        now,
        afterEventPersisted: options.afterEventPersisted,
      });
    });
  }

  return finalizePivotTransaction({
    paths: prepared.paths,
    pivotId: prepared.pivotId,
    resumed: prepared.resumed,
    now,
    afterEventPersisted: options.afterEventPersisted,
  });
}
