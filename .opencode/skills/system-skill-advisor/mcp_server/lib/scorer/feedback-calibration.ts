// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Feedback Calibration Reducer
// ───────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

import type { AdvisorHookOutcomeRecord } from '../metrics.js';
import { isLiveScorerLane } from './lane-registry.js';
import type { ScorerLane } from './types.js';
import {
  SCORER_LANES,
  buildReadOnlyScorerCalibrationProposal,
  type ReadOnlyScorerCalibrationProposal,
  type ScorerCalibrationThresholds,
} from './weights-config.js';

const TRUE_VALUES = new Set(['true', '1', 'yes', 'on', 'enabled']);
const DEFAULT_MIN_SAMPLES = 8;
const DEFAULT_MAX_SKILL_SHARE = 0.6;
const MAX_WEIGHT_DELTA = 0.03;
const MAX_THRESHOLD_DELTA = 0.05;
const MAX_RECORDS = 50;
const RECORD_ROOT = join(tmpdir(), 'speckit-skill-advisor-calibration');

export type AdvisorFeedbackCalibrationLaneStatus = 'candidate' | 'excluded';

export interface AdvisorFeedbackCalibrationLaneSignal {
  readonly lane: ScorerLane;
  readonly status: AdvisorFeedbackCalibrationLaneStatus;
  readonly sampleCount: number;
  readonly accepted: number;
  readonly corrected: number;
  readonly ignored: number;
  readonly proposedDelta: number;
  readonly reason: string;
}

export interface AdvisorFeedbackCalibrationReport {
  readonly model: 'advisor-feedback-calibration-shadow-v1';
  readonly generatedAt: string;
  readonly scope: {
    readonly kind: 'workspace' | 'skill';
    readonly skillSlug: string | null;
  };
  readonly sample: {
    readonly total: number;
    readonly accepted: number;
    readonly corrected: number;
    readonly ignored: number;
    readonly distinctSkills: number;
    readonly maxSkillShare: number;
  };
  readonly laneSignals: readonly AdvisorFeedbackCalibrationLaneSignal[];
  readonly thresholdSignals: {
    readonly confidenceThresholdDelta: number;
    readonly uncertaintyThresholdDelta: number;
    readonly reason: string;
  };
  readonly proposal: ReadOnlyScorerCalibrationProposal;
  readonly guardrails: {
    readonly defaultOff: true;
    readonly shadowOnly: true;
    readonly liveWeightsFrozen: true;
    readonly autoPromotion: false;
    readonly heldOutValidationRequired: true;
    readonly noLaneAttributionFallback: boolean;
  };
}

export interface AdvisorFeedbackCalibrationOptions {
  readonly generatedAt?: string;
  readonly skillSlug?: string | null;
  readonly currentThresholds: ScorerCalibrationThresholds;
  readonly minSamples?: number;
  readonly maxSkillShare?: number;
  readonly laneAttributionBySkill?: Readonly<Record<string, ScorerLane>>;
}

function round4(value: number): number {
  return Number(value.toFixed(4));
}

function clamp(value: number, maxAbs: number): number {
  return Math.max(-maxAbs, Math.min(maxAbs, value));
}

function workspaceHash(workspaceRoot: string): string {
  return createHash('sha256')
    .update(resolve(workspaceRoot))
    .digest('hex')
    .slice(0, 16);
}

function countOutcomes(records: readonly AdvisorHookOutcomeRecord[]): {
  accepted: number;
  corrected: number;
  ignored: number;
} {
  return {
    accepted: records.filter((record) => record.outcome === 'accepted').length,
    corrected: records.filter((record) => record.outcome === 'corrected').length,
    ignored: records.filter((record) => record.outcome === 'ignored').length,
  };
}

function maxSkillShare(records: readonly AdvisorHookOutcomeRecord[]): number {
  if (records.length === 0) return 0;
  const counts = new Map<string, number>();
  for (const record of records) {
    counts.set(record.skillLabel, (counts.get(record.skillLabel) ?? 0) + 1);
  }
  return Math.max(...counts.values()) / records.length;
}

function distinctSkillCount(records: readonly AdvisorHookOutcomeRecord[]): number {
  return new Set(records.map((record) => record.skillLabel)).size;
}

function signalReason(args: {
  readonly sampleCount: number;
  readonly minSamples: number;
  readonly concentrated: boolean;
  readonly attributed: boolean;
}): string {
  if (args.sampleCount < args.minSamples) return 'low_sample_excluded';
  if (args.concentrated) return 'sample_concentration_excluded';
  if (!args.attributed) return 'no_lane_attribution_excluded';
  return 'supported_shadow_candidate';
}

function laneRecords(
  lane: ScorerLane,
  records: readonly AdvisorHookOutcomeRecord[],
  laneAttributionBySkill: Readonly<Record<string, ScorerLane>>,
): AdvisorHookOutcomeRecord[] {
  return records.filter((record) => laneAttributionBySkill[record.skillLabel] === lane);
}

export function isAdvisorFeedbackCalibrationEnabled(
  env: Record<string, string | undefined> = process.env,
): boolean {
  const raw = env.SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_SHADOW?.trim().toLowerCase();
  return raw !== undefined && TRUE_VALUES.has(raw);
}

export function advisorFeedbackCalibrationRecordsPath(workspaceRoot: string): string {
  return process.env.SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_PATH
    ?? join(RECORD_ROOT, `${workspaceHash(workspaceRoot)}-feedback-calibration.jsonl`);
}

export function reduceAdvisorFeedbackCalibration(
  records: readonly AdvisorHookOutcomeRecord[],
  options: AdvisorFeedbackCalibrationOptions,
): AdvisorFeedbackCalibrationReport {
  const minSamples = options.minSamples ?? DEFAULT_MIN_SAMPLES;
  const maxShare = options.maxSkillShare ?? DEFAULT_MAX_SKILL_SHARE;
  const totals = countOutcomes(records);
  const skillShare = round4(maxSkillShare(records));
  const concentrated = records.length > 0 && skillShare > maxShare;
  const laneAttributionBySkill = options.laneAttributionBySkill ?? {};
  const hasAttribution = Object.keys(laneAttributionBySkill).length > 0;
  const weightDeltas: Partial<Record<ScorerLane, number>> = {};

  const laneSignals = SCORER_LANES.map((lane): AdvisorFeedbackCalibrationLaneSignal => {
    const attributedRecords = laneRecords(lane, records, laneAttributionBySkill);
    const laneTotals = hasAttribution ? countOutcomes(attributedRecords) : totals;
    const sampleCount = hasAttribution ? attributedRecords.length : records.length;
    const reason = signalReason({ sampleCount, minSamples, concentrated, attributed: hasAttribution });
    const status: AdvisorFeedbackCalibrationLaneStatus = reason === 'supported_shadow_candidate' ? 'candidate' : 'excluded';
    const correctionPressure = sampleCount > 0 ? laneTotals.corrected / sampleCount : 0;
    const acceptancePressure = sampleCount > 0 ? laneTotals.accepted / sampleCount : 0;
    const proposedDelta = status === 'candidate' && isLiveScorerLane(lane)
      ? round4(clamp((acceptancePressure - correctionPressure) * MAX_WEIGHT_DELTA, MAX_WEIGHT_DELTA))
      : 0;
    if (proposedDelta !== 0) weightDeltas[lane] = proposedDelta;
    return {
      lane,
      status,
      sampleCount,
      accepted: laneTotals.accepted,
      corrected: laneTotals.corrected,
      ignored: laneTotals.ignored,
      proposedDelta,
      reason,
    };
  });

  const correctionRate = records.length > 0 ? totals.corrected / records.length : 0;
  const ignoredRate = records.length > 0 ? totals.ignored / records.length : 0;
  const thresholdSignals = records.length < minSamples || concentrated
    ? {
      confidenceThresholdDelta: 0,
      uncertaintyThresholdDelta: 0,
      reason: records.length < minSamples ? 'low_sample_excluded' : 'sample_concentration_excluded',
    }
    : {
      confidenceThresholdDelta: round4(clamp(correctionRate * MAX_THRESHOLD_DELTA, MAX_THRESHOLD_DELTA)),
      uncertaintyThresholdDelta: round4(clamp(-ignoredRate * MAX_THRESHOLD_DELTA, MAX_THRESHOLD_DELTA)),
      reason: 'supported_shadow_candidate',
    };

  return {
    model: 'advisor-feedback-calibration-shadow-v1',
    generatedAt: options.generatedAt ?? new Date().toISOString(),
    scope: {
      kind: options.skillSlug === null || options.skillSlug === undefined ? 'workspace' : 'skill',
      skillSlug: options.skillSlug ?? null,
    },
    sample: {
      total: records.length,
      accepted: totals.accepted,
      corrected: totals.corrected,
      ignored: totals.ignored,
      distinctSkills: distinctSkillCount(records),
      maxSkillShare: skillShare,
    },
    laneSignals,
    thresholdSignals,
    proposal: buildReadOnlyScorerCalibrationProposal({
      proposedWeightDeltas: weightDeltas,
      currentThresholds: options.currentThresholds,
      proposedThresholdDeltas: {
        confidenceThreshold: thresholdSignals.confidenceThresholdDelta,
        uncertaintyThreshold: thresholdSignals.uncertaintyThresholdDelta,
      },
    }),
    guardrails: {
      defaultOff: true,
      shadowOnly: true,
      liveWeightsFrozen: true,
      autoPromotion: false,
      heldOutValidationRequired: true,
      noLaneAttributionFallback: !hasAttribution,
    },
  };
}

export function persistAdvisorFeedbackCalibrationRecord(
  workspaceRoot: string,
  report: AdvisorFeedbackCalibrationReport,
): string {
  const path = advisorFeedbackCalibrationRecordsPath(workspaceRoot);
  mkdirSync(dirname(path), { recursive: true });
  const existing = existsSync(path)
    ? readFileSync(path, 'utf8').split('\n').map((line) => line.trim()).filter(Boolean)
    : [];
  existing.push(JSON.stringify(report));
  writeFileSync(path, `${existing.slice(-MAX_RECORDS).join('\n')}\n`, 'utf8');
  return path;
}

export function recordAdvisorFeedbackCalibrationIfEnabled(input: {
  readonly workspaceRoot: string;
  readonly records: readonly AdvisorHookOutcomeRecord[];
  readonly options: AdvisorFeedbackCalibrationOptions;
  readonly env?: Record<string, string | undefined>;
}): AdvisorFeedbackCalibrationReport | null {
  if (!isAdvisorFeedbackCalibrationEnabled(input.env)) return null;
  const report = reduceAdvisorFeedbackCalibration(input.records, input.options);
  persistAdvisorFeedbackCalibrationRecord(input.workspaceRoot, report);
  return report;
}
