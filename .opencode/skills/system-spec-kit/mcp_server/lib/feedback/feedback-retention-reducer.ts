// ───────────────────────────────────────────────────────────────
// MODULE: Feedback Retention Reducer
// ───────────────────────────────────────────────────────────────
// Computes conservative retention decisions from batch feedback summaries.

import type Database from 'better-sqlite3';
import { ensureGovernanceRuntime } from '../governance/scope-governance.js';
import type { AggregatedSignal } from './batch-learning.js';

export type RetentionDecision = 'delete' | 'extend' | 'protect';
export type FeedbackRetentionMode = 'shadow' | 'active';

const TRUE_VALUES = new Set(['true', '1', 'yes', 'on', 'enabled']);
const PROTECTED_TIERS = new Set(['constitutional', 'critical']);
const EXTENDABLE_TIERS = new Set(['important']);
const DEFAULT_MIN_WEIGHTED_HITS = 2;
const DEFAULT_MIN_SESSION_COUNT = 2;
const DEFAULT_MIN_QUERY_COUNT = 1;
const DEFAULT_EXTEND_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface RetentionCandidateRow {
  id: number;
  specFolder: string | null;
  filePath: string | null;
  tenantId: string | null;
  userId: string | null;
  agentId: string | null;
  sessionId: string | null;
  deleteAfter: string;
  importanceTier: string | null;
  decayHalfLifeDays: number | null;
  isPinned: number | null;
  accessCount: number | null;
  lastAccessed: string | number | null;
}

export interface FeedbackRetentionReducerOptions {
  runAt?: number;
  extendDays?: number;
  minWeightedHitCount?: number;
  minSessionCount?: number;
  minQueryCount?: number;
}

export interface FeedbackRetentionDecisionResult {
  memoryId: number;
  decision: RetentionDecision;
  reason: string;
  originalDeleteAfter: string;
  nextDeleteAfter: string | null;
  importanceTier: string | null;
  weightedHitCount: number;
  queryCount: number;
  sessionCount: number;
  weightedScore: number;
}

export interface FeedbackRetentionEvaluation {
  runAt: number;
  decisions: FeedbackRetentionDecisionResult[];
  byDecision: Record<RetentionDecision, number>;
}

export interface FeedbackRetentionAuditOptions {
  mode: FeedbackRetentionMode;
  applied: boolean;
  activeGatePassed: boolean;
}

function normalizeTier(value: string | null): string | null {
  const normalized = value?.trim().toLowerCase();
  return normalized && normalized.length > 0 ? normalized : null;
}

function signalForMemory(signalsById: Map<string, AggregatedSignal>, memoryId: number): AggregatedSignal | null {
  return signalsById.get(String(memoryId)) ?? null;
}

function weightedHitCount(signal: AggregatedSignal | null): number {
  return Math.max(0, signal?.weightedHitCount ?? 0);
}

function queryCount(signal: AggregatedSignal | null): number {
  return Math.max(0, signal?.queryCount ?? 0);
}

function sessionCount(signal: AggregatedSignal | null): number {
  return Math.max(0, signal?.sessionCount ?? 0);
}

function weightedScore(signal: AggregatedSignal | null): number {
  return Math.max(0, signal?.weightedScore ?? 0);
}

function buildExtendedDeleteAfter(signal: AggregatedSignal | null, runAt: number, extendDays: number): string {
  const base = Math.max(runAt, signal?.lastSeen ?? 0);
  return new Date(base + (extendDays * MS_PER_DAY)).toISOString();
}

function shouldExtend(
  row: RetentionCandidateRow,
  signal: AggregatedSignal | null,
  options: Required<Pick<FeedbackRetentionReducerOptions, 'minWeightedHitCount' | 'minSessionCount' | 'minQueryCount'>>,
): boolean {
  const tier = normalizeTier(row.importanceTier);
  if (tier === null || !EXTENDABLE_TIERS.has(tier)) {
    return false;
  }

  return weightedHitCount(signal) >= options.minWeightedHitCount
    && sessionCount(signal) >= options.minSessionCount
    && queryCount(signal) >= options.minQueryCount;
}

export function isFeedbackRetentionLearningEnabled(
  env: Record<string, string | undefined> = process.env,
): boolean {
  const raw = env.SPECKIT_FEEDBACK_RETENTION_LEARNING?.trim().toLowerCase();
  return raw !== undefined && TRUE_VALUES.has(raw);
}

export function resolveFeedbackRetentionMode(
  env: Record<string, string | undefined> = process.env,
): FeedbackRetentionMode {
  return env.SPECKIT_FEEDBACK_RETENTION_MODE?.trim().toLowerCase() === 'active'
    ? 'active'
    : 'shadow';
}

export function evaluateFeedbackRetention(
  candidates: RetentionCandidateRow[],
  signals: AggregatedSignal[],
  options: FeedbackRetentionReducerOptions = {},
): FeedbackRetentionEvaluation {
  const runAt = options.runAt ?? Date.now();
  const extendDays = options.extendDays ?? DEFAULT_EXTEND_DAYS;
  const thresholds = {
    minWeightedHitCount: options.minWeightedHitCount ?? DEFAULT_MIN_WEIGHTED_HITS,
    minSessionCount: options.minSessionCount ?? DEFAULT_MIN_SESSION_COUNT,
    minQueryCount: options.minQueryCount ?? DEFAULT_MIN_QUERY_COUNT,
  };
  const signalsById = new Map(signals.map((signal) => [signal.memoryId, signal]));
  const byDecision: Record<RetentionDecision, number> = { delete: 0, extend: 0, protect: 0 };

  const decisions = candidates.map((candidate): FeedbackRetentionDecisionResult => {
    const tier = normalizeTier(candidate.importanceTier);
    const signal = signalForMemory(signalsById, candidate.id);
    let decision: RetentionDecision = 'delete';
    let reason = 'retention_expired';
    let nextDeleteAfter: string | null = null;

    if ((tier !== null && PROTECTED_TIERS.has(tier)) || Number(candidate.isPinned ?? 0) !== 0) {
      decision = 'protect';
      reason = 'protected_tier_or_pin';
    } else if (shouldExtend(candidate, signal, thresholds)) {
      decision = 'extend';
      reason = 'important_positive_feedback';
      nextDeleteAfter = buildExtendedDeleteAfter(signal, runAt, extendDays);
    } else if (tier === 'important' && weightedScore(signal) > 0) {
      reason = 'positive_signal_below_retention_threshold';
    }

    byDecision[decision] += 1;

    return {
      memoryId: candidate.id,
      decision,
      reason,
      originalDeleteAfter: candidate.deleteAfter,
      nextDeleteAfter,
      importanceTier: tier,
      weightedHitCount: weightedHitCount(signal),
      queryCount: queryCount(signal),
      sessionCount: sessionCount(signal),
      weightedScore: weightedScore(signal),
    };
  });

  return { runAt, decisions, byDecision };
}

export function recordFeedbackRetentionAudit(
  database: Database.Database,
  row: RetentionCandidateRow,
  result: FeedbackRetentionDecisionResult,
  options: FeedbackRetentionAuditOptions,
): void {
  ensureGovernanceRuntime(database);
  database.prepare(`
    INSERT INTO governance_audit (
      action, decision, memory_id, logical_key, tenant_id, user_id, agent_id, session_id,
      reason, metadata
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'feedback_retention_learning',
    result.decision,
    row.id,
    row.filePath,
    row.tenantId,
    row.userId,
    row.agentId,
    row.sessionId,
    result.reason,
    JSON.stringify({
      mode: options.mode,
      applied: options.applied,
      activeGatePassed: options.activeGatePassed,
      originalDeleteAfter: result.originalDeleteAfter,
      nextDeleteAfter: result.nextDeleteAfter,
      importanceTier: result.importanceTier,
      weightedHitCount: result.weightedHitCount,
      queryCount: result.queryCount,
      sessionCount: result.sessionCount,
      weightedScore: result.weightedScore,
      specFolder: row.specFolder,
      filePath: row.filePath,
    }),
  );
}
