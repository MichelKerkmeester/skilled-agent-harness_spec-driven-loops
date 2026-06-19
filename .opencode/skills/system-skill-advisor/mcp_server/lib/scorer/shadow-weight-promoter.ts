// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Shadow-Weight Promoter (C4 estimator→registry seam)
// ───────────────────────────────────────────────────────────────
// The estimator writes calibration proposals to an append-only JSONL that no
// consumer ever reads back, so the shadow learning loop never closes. This is
// the missing seam: an out-of-process promoter that reads those proposals, folds
// them into a flood-immune Beta posterior, applies a conservative two-gate +
// held-out + decay policy, and writes the resolved *shadow* weight channel.
//
// It runs on a cron/maintenance cadence ONLY — never on the prompt-time recommend
// path (so it adds zero recommend latency). It can only ever write the SHADOW
// channel: the live channel is frozen and is never a write target here. Wiring
// the warm daemon to reload the new shadow weights is intentionally left to the
// operator/restart for now (the registry resolves the env once at module load);
// this promoter produces the artifact an operator or a restart picks up.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

import {
  type AdvisorFeedbackCalibrationReport,
  advisorFeedbackCalibrationRecordsPath,
} from './feedback-calibration.js';
import {
  type BetaPrior,
  NEUTRAL_PRIOR,
  type ShadowAuditTag,
  type TwoGateReason,
  applyDecayUnpromotion,
  contentAddressEvent,
  evaluateTwoGate,
  laneReliabilityPosterior,
  posteriorToWeightDelta,
} from './beta-reliability.js';
import {
  DEFAULT_SHADOW_SCORER_LANE_WEIGHTS,
  LIVE_SCORER_LANE_IDS,
  type ScorerLaneId,
  SHADOW_LANE_WEIGHTS_ENV_KEY,
} from './lane-registry.js';

// ───────────────────────────────────────────────────────────────
// 1. POLICY + RESULT TYPES
// ───────────────────────────────────────────────────────────────

export interface ShadowPromotionPolicy {
  /** Distinct attesting snapshots required (the k-floor). */
  readonly kMin: number;
  /** Posterior at/above this (re-)promotes a lane. */
  readonly stopThreshold: number;
  /** Posterior below this reverts a lane to its frozen default. */
  readonly decayThreshold: number;
  /** Bound on the proposed shadow-weight move. */
  readonly maxWeightDelta: number;
  /** Below this many folded observations a lane stays neutral (promotes nothing). */
  readonly countFloor: number;
  /** Theoretical ceiling on distinct attesting snapshots the substrate can ever
   * collect — the calibration ring capacity. This is the policy's intrinsic
   * ceiling for the reachability check; it is NOT the current snapshot count
   * ("not enough data yet" is the k-floor, a separate, transient condition). */
  readonly maxDistinctSources: number;
  readonly prior: BetaPrior;
}

export const DEFAULT_SHADOW_PROMOTION_POLICY: ShadowPromotionPolicy = {
  kMin: 2,
  stopThreshold: 0.6,
  decayThreshold: 0.5,
  maxWeightDelta: 0.03,
  countFloor: 8,
  // Mirrors the calibration ring's MAX_RECORDS=50: at most 50 distinct snapshots
  // can corroborate, so a policy is reachable only if 50 all-positive snapshots
  // could clear its stop threshold.
  maxDistinctSources: 50,
  prior: NEUTRAL_PRIOR,
};

export interface ShadowLaneAudit {
  readonly lane: ScorerLaneId;
  readonly posterior: number;
  readonly distinctAttesters: number;
  readonly successes: number;
  readonly failures: number;
  readonly twoGate: TwoGateReason;
  readonly auditTag: ShadowAuditTag;
  readonly shadowWeight: number;
}

export interface ShadowWeightProposal {
  readonly model: 'advisor-shadow-weight-promoter-v1';
  readonly generatedAt: string;
  /** ALWAYS the shadow channel key — the promoter cannot target the live channel. */
  readonly envKey: typeof SHADOW_LANE_WEIGHTS_ENV_KEY;
  readonly liveWeightsFrozen: true;
  readonly autoPromotion: false;
  readonly shadowWeights: Readonly<Record<ScorerLaneId, number>>;
  /** The exact value an operator would assign to the shadow env var. */
  readonly shadowWeightsJson: string;
  readonly audits: readonly ShadowLaneAudit[];
  readonly distinctReports: number;
}

export interface ShadowPromotionTickResult {
  /** false when the proposal is byte-identical to the prior artifact (no-op). */
  readonly changed: boolean;
  readonly proposal: ShadowWeightProposal;
  readonly artifactPath: string;
}

// ───────────────────────────────────────────────────────────────
// 2. PURE PIPELINE: reports → shadow-weight proposal
// ───────────────────────────────────────────────────────────────

function round4(value: number): number {
  return Number(value.toFixed(4));
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

interface LaneSignalSlice {
  readonly accepted: number;
  readonly corrected: number;
  readonly proposedDelta: number;
}

function laneSignalFor(report: AdvisorFeedbackCalibrationReport, lane: ScorerLaneId): LaneSignalSlice | null {
  const signal = report.laneSignals.find((entry) => entry.lane === lane);
  if (!signal) return null;
  return { accepted: signal.accepted, corrected: signal.corrected, proposedDelta: signal.proposedDelta };
}

/** Outcome-determining identity of a report, excluding wall-clock so a replayed
 * snapshot folds exactly once. */
function reportContentId(report: AdvisorFeedbackCalibrationReport): string {
  return contentAddressEvent({
    sample: report.sample,
    laneSignals: report.laneSignals.map((signal) => ({
      lane: signal.lane,
      accepted: signal.accepted,
      corrected: signal.corrected,
      ignored: signal.ignored,
      proposedDelta: signal.proposedDelta,
    })),
    thresholdSignals: report.thresholdSignals,
  });
}

/**
 * Fold the calibration reports into a conservative, shadow-only weight proposal.
 * Reports are content-addressed first, so replays/double-deliveries fold once.
 * Each distinct snapshot that proposed a non-zero move for a lane counts as one
 * attester; acceptances are Beta successes and corrections are Beta failures.
 */
export function computeShadowWeightProposal(
  reports: readonly AdvisorFeedbackCalibrationReport[],
  options: { readonly policy?: Partial<ShadowPromotionPolicy>; readonly generatedAt?: string } = {},
): ShadowWeightProposal {
  const policy: ShadowPromotionPolicy = { ...DEFAULT_SHADOW_PROMOTION_POLICY, ...options.policy };

  // Content-address + dedupe reports (replay-safe, order-independent).
  const distinctReports = new Map<string, AdvisorFeedbackCalibrationReport>();
  for (const report of reports) {
    const id = reportContentId(report);
    if (!distinctReports.has(id)) distinctReports.set(id, report);
  }
  const folded = [...distinctReports.values()];

  const shadowWeights: Record<ScorerLaneId, number> = { ...DEFAULT_SHADOW_SCORER_LANE_WEIGHTS };
  const audits: ShadowLaneAudit[] = [];

  for (const lane of LIVE_SCORER_LANE_IDS) {
    let successes = 0;
    let failures = 0;
    let distinctAttesters = 0;
    for (const report of folded) {
      const slice = laneSignalFor(report, lane);
      if (!slice) continue;
      successes += slice.accepted;
      failures += slice.corrected;
      if (slice.proposedDelta !== 0) distinctAttesters += 1;
    }

    const posterior = laneReliabilityPosterior(
      { successes, failures },
      { countFloor: policy.countFloor, prior: policy.prior },
    );
    const defaultShadowWeight = DEFAULT_SHADOW_SCORER_LANE_WEIGHTS[lane];
    const promotedShadowWeight = round4(clamp01(
      defaultShadowWeight + posteriorToWeightDelta(posterior, { maxAbs: policy.maxWeightDelta }),
    ));

    const gate = evaluateTwoGate(
      { posterior, distinctAttesters },
      {
        kMin: policy.kMin,
        stopThreshold: policy.stopThreshold,
        prior: policy.prior,
        maxDistinctSources: policy.maxDistinctSources,
      },
    );

    let shadowWeight: number;
    let auditTag: ShadowAuditTag;
    if (gate.promote) {
      shadowWeight = promotedShadowWeight;
      auditTag = 'promoted';
    } else {
      // Gate refused — keep the frozen default, but classify why support is
      // absent so an operator can tell decay from a never-promoted lane.
      const decay = applyDecayUnpromotion({
        lane,
        defaultShadowWeight,
        promotedShadowWeight,
        posterior,
        hasEvidence: successes + failures > 0,
        promoteThreshold: policy.stopThreshold,
        decayThreshold: policy.decayThreshold,
      });
      shadowWeight = defaultShadowWeight;
      auditTag = decay.auditTag === 'promoted' ? 'frozen_default' : decay.auditTag;
    }

    shadowWeights[lane] = shadowWeight;
    audits.push({
      lane,
      posterior,
      distinctAttesters,
      successes,
      failures,
      twoGate: gate.reason,
      auditTag,
      shadowWeight,
    });
  }

  return {
    model: 'advisor-shadow-weight-promoter-v1',
    generatedAt: options.generatedAt ?? new Date().toISOString(),
    envKey: SHADOW_LANE_WEIGHTS_ENV_KEY,
    liveWeightsFrozen: true,
    autoPromotion: false,
    shadowWeights,
    shadowWeightsJson: JSON.stringify(shadowWeights),
    audits,
    distinctReports: folded.length,
  };
}

// ───────────────────────────────────────────────────────────────
// 3. I/O SEAM: read calibration JSONL → write shadow-weight artifact
// ───────────────────────────────────────────────────────────────

const STORE_DIR_ENV = 'SPECKIT_ADVISOR_OUTCOME_STORE_DIR';
const DEFAULT_STORE_ROOT = join(tmpdir(), 'speckit-skill-advisor-outcomes');

function storeRoot(): string {
  const override = process.env[STORE_DIR_ENV]?.trim();
  return override && override.length > 0 ? override : DEFAULT_STORE_ROOT;
}

function workspaceHash(workspaceRoot: string): string {
  return createHash('sha256').update(resolve(workspaceRoot)).digest('hex').slice(0, 16);
}

export function shadowWeightArtifactPath(workspaceRoot: string): string {
  return join(storeRoot(), `${workspaceHash(workspaceRoot)}-shadow-weights.json`);
}

function tryParseJson(line: string): unknown {
  try {
    return JSON.parse(line) as unknown;
  } catch {
    return null;
  }
}

function isCalibrationReport(value: unknown): value is AdvisorFeedbackCalibrationReport {
  if (value === null || typeof value !== 'object') return false;
  const candidate = value as Partial<AdvisorFeedbackCalibrationReport>;
  return candidate.model === 'advisor-feedback-calibration-shadow-v1'
    && Array.isArray(candidate.laneSignals)
    && typeof candidate.sample === 'object'
    && candidate.sample !== null;
}

/** Read the estimator's calibration proposals from the append-only JSONL. Poison
 * lines are skipped defensively so one bad row cannot break the whole fold. */
export function readCalibrationReports(workspaceRoot: string): AdvisorFeedbackCalibrationReport[] {
  const path = advisorFeedbackCalibrationRecordsPath(workspaceRoot);
  if (!existsSync(path)) return [];
  return readFileSync(path, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map(tryParseJson)
    .filter(isCalibrationReport);
}

function proposalDataSignature(proposal: ShadowWeightProposal): string {
  // generatedAt excluded so two ticks over identical data are a recognized no-op.
  return JSON.stringify({ shadowWeights: proposal.shadowWeights, audits: proposal.audits });
}

function readArtifactSignature(path: string): string | null {
  if (!existsSync(path)) return null;
  const parsed = tryParseJson(readFileSync(path, 'utf8'));
  if (parsed === null || typeof parsed !== 'object') return null;
  const proposal = parsed as ShadowWeightProposal;
  if (typeof proposal.shadowWeights !== 'object' || proposal.shadowWeights === null) return null;
  return proposalDataSignature(proposal);
}

/**
 * Cron/maintenance tick: read the calibration JSONL, compute the shadow-weight
 * proposal, and persist it atomically. A tick over unchanged data writes nothing
 * (changed:false). NEVER invoked on the prompt-time recommend path.
 */
export function promoteShadowWeights(
  workspaceRoot: string,
  options: { readonly policy?: Partial<ShadowPromotionPolicy>; readonly generatedAt?: string } = {},
): ShadowPromotionTickResult {
  const reports = readCalibrationReports(workspaceRoot);
  const proposal = computeShadowWeightProposal(reports, options);
  const artifactPath = shadowWeightArtifactPath(workspaceRoot);

  if (readArtifactSignature(artifactPath) === proposalDataSignature(proposal)) {
    return { changed: false, proposal, artifactPath };
  }

  mkdirSync(dirname(artifactPath), { recursive: true });
  const tmpPath = `${artifactPath}.${process.pid}.tmp`;
  writeFileSync(tmpPath, JSON.stringify(proposal, null, 2), 'utf8');
  renameSync(tmpPath, artifactPath);
  return { changed: true, proposal, artifactPath };
}
