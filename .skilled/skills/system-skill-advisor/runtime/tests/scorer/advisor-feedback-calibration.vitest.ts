// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Feedback Calibration Tests
// ───────────────────────────────────────────────────────────────

import {
  chmodSync,
  existsSync,
  linkSync,
  lstatSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

const openFailure = vi.hoisted(() => ({ path: null as string | null }));

vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs')>();
  return {
    ...actual,
    openSync: (...args: Parameters<typeof actual.openSync>) => {
      if (args[0] === openFailure.path) {
        const error = new Error('too many links') as NodeJS.ErrnoException;
        error.code = 'EMLINK';
        throw error;
      }
      return actual.openSync(...args);
    },
  };
});

import type { AdvisorHookOutcomeRecord } from '../../lib/metrics.js';
import {
  advisorFeedbackCalibrationRecordsPath,
  isAdvisorFeedbackCalibrationEnabled,
  recordAdvisorFeedbackCalibrationIfEnabled,
  reduceAdvisorFeedbackCalibration,
} from '../../lib/scorer/feedback-calibration.js';
import { scoreAdvisorPrompt } from '../../lib/scorer/fusion.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';
import {
  DEFAULT_SCORER_WEIGHTS,
  buildReadOnlyScorerCalibrationProposal,
} from '../../lib/scorer/weights-config.js';
import type { AdvisorScoringResult, SkillProjection } from '../../lib/scorer/types.js';

const CURRENT_THRESHOLDS = {
  confidenceThreshold: 0.8,
  uncertaintyThreshold: 0.35,
} as const;

const temporaryDirectories: string[] = [];

function makeTemporaryDirectory(): string {
  const directory = mkdtempSync(join(tmpdir(), 'advisor-calibration-'));
  temporaryDirectories.push(directory);
  return directory;
}

function stubCalibrationStore(path: string): void {
  vi.stubEnv('SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_PATH', path);
  vi.stubEnv('SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_SHADOW', 'true');
}

function recordCalibration(): ReturnType<typeof recordAdvisorFeedbackCalibrationIfEnabled> {
  return recordAdvisorFeedbackCalibrationIfEnabled({
    workspaceRoot: process.cwd(),
    records: [outcome('alpha', 'accepted')],
    options: { currentThresholds: CURRENT_THRESHOLDS },
  });
}

function outcome(skillLabel: string, kind: AdvisorHookOutcomeRecord['outcome']): AdvisorHookOutcomeRecord {
  return {
    timestamp: '2026-06-10T00:00:00.000Z',
    runtime: 'opencode',
    outcome: kind,
    skillLabel,
  };
}

function skill(overrides: Partial<SkillProjection> & Pick<SkillProjection, 'id'>): SkillProjection {
  return {
    id: overrides.id,
    kind: 'skill',
    family: 'system',
    category: 'test',
    name: overrides.id,
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: `.skilled/skills/${overrides.id}/graph-metadata.json`,
    lifecycleStatus: 'active',
    ...Object.fromEntries(Object.entries(overrides).filter(([key]) => key !== 'id')),
  };
}

function recommendationSnapshot(result: AdvisorScoringResult): string {
  return JSON.stringify({
    topSkill: result.topSkill,
    unknown: result.unknown,
    ambiguous: result.ambiguous,
    metrics: result.metrics,
    recommendations: result.recommendations.map((recommendation) => ({
      skill: recommendation.skill,
      confidence: recommendation.confidence,
      uncertainty: recommendation.uncertainty,
      passes_threshold: recommendation.passes_threshold,
      score: recommendation.score,
      dominantLane: recommendation.dominantLane,
      laneContributions: recommendation.laneContributions.map((contribution) => ({
        lane: contribution.lane,
        rawScore: contribution.rawScore,
        weightedScore: contribution.weightedScore,
        weight: contribution.weight,
        shadowOnly: contribution.shadowOnly,
      })),
    })),
  });
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  openFailure.path = null;
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe('advisor feedback calibration reducer', () => {
  it('is default-off and produces read-only proposals only', () => {
    expect(isAdvisorFeedbackCalibrationEnabled({})).toBe(false);
    const proposal = buildReadOnlyScorerCalibrationProposal({
      currentThresholds: CURRENT_THRESHOLDS,
      proposedWeightDeltas: { lexical: 0.02 },
      proposedThresholdDeltas: { confidenceThreshold: 0.01 },
    });

    expect(proposal.liveWeightsFrozen).toBe(true);
    expect(proposal.autoPromotion).toBe(false);
    expect(proposal.heldOutValidationRequired).toBe(true);
    expect(DEFAULT_SCORER_WEIGHTS.lexical).toBe(0.28);
  });

  it('excludes low-sample outcome sets instead of proposing noisy deltas', () => {
    const report = reduceAdvisorFeedbackCalibration([
      outcome('system-spec-kit', 'accepted'),
      outcome('system-spec-kit', 'corrected'),
    ], {
      currentThresholds: CURRENT_THRESHOLDS,
    });

    expect(report.sample.total).toBe(2);
    expect(report.guardrails).toMatchObject({
      defaultOff: true,
      shadowOnly: true,
      autoPromotion: false,
      heldOutValidationRequired: true,
    });
    expect(report.laneSignals.every((signal) => signal.status === 'excluded')).toBe(true);
    expect(report.laneSignals.every((signal) => signal.reason === 'low_sample_excluded')).toBe(true);
    expect(report.proposal.proposedWeights).toEqual(report.proposal.currentWeights);
    expect(report.proposal.proposedThresholds).toEqual(report.proposal.currentThresholds);
  });

  it('caps attributed lane deltas and threshold signals', () => {
    const records = [
      outcome('alpha', 'accepted'),
      outcome('alpha', 'accepted'),
      outcome('alpha', 'accepted'),
      outcome('alpha', 'accepted'),
      outcome('beta', 'corrected'),
      outcome('beta', 'corrected'),
      outcome('beta', 'corrected'),
      outcome('beta', 'corrected'),
    ];
    const report = reduceAdvisorFeedbackCalibration(records, {
      currentThresholds: CURRENT_THRESHOLDS,
      minSamples: 4,
      laneAttributionBySkill: {
        alpha: 'explicit_author',
        beta: 'lexical',
      },
    });

    const explicit = report.laneSignals.find((signal) => signal.lane === 'explicit_author');
    const lexical = report.laneSignals.find((signal) => signal.lane === 'lexical');
    expect(explicit).toMatchObject({ status: 'candidate', proposedDelta: 0.03 });
    expect(lexical).toMatchObject({ status: 'candidate', proposedDelta: -0.03 });
    expect(report.thresholdSignals).toMatchObject({
      confidenceThresholdDelta: 0.025,
      uncertaintyThresholdDelta: 0,
      reason: 'supported_shadow_candidate',
    });
    expect(report.proposal.proposedWeights.explicit_author).toBe(0.45);
    expect(report.proposal.proposedWeights.lexical).toBe(0.25);
    expect(DEFAULT_SCORER_WEIGHTS.explicit_author).toBe(0.42);
    expect(DEFAULT_SCORER_WEIGHTS.lexical).toBe(0.28);
  });

  it('blocks concentrated samples as poisoning-prone evidence', () => {
    const records = Array.from({ length: 10 }, () => outcome('single-skill', 'corrected'));
    const report = reduceAdvisorFeedbackCalibration(records, {
      currentThresholds: CURRENT_THRESHOLDS,
      minSamples: 4,
      maxSkillShare: 0.6,
      laneAttributionBySkill: { 'single-skill': 'lexical' },
    });

    expect(report.sample.maxSkillShare).toBe(1);
    expect(report.laneSignals.every((signal) => signal.status === 'excluded')).toBe(true);
    expect(report.thresholdSignals.reason).toBe('sample_concentration_excluded');
    expect(report.proposal.proposedWeights).toEqual(report.proposal.currentWeights);
  });

  it('records advisory calibration output only when the flag is enabled', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'advisor-calibration-'));
    const calibrationPath = join(tempDir, 'records.jsonl');
    vi.stubEnv('SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_PATH', calibrationPath);

    const disabled = recordAdvisorFeedbackCalibrationIfEnabled({
      workspaceRoot: process.cwd(),
      records: [outcome('alpha', 'accepted')],
      options: { currentThresholds: CURRENT_THRESHOLDS },
      env: {},
    });
    expect(disabled).toBeNull();
    expect(existsSync(calibrationPath)).toBe(false);

    vi.stubEnv('SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_SHADOW', 'true');
    const enabled = recordAdvisorFeedbackCalibrationIfEnabled({
      workspaceRoot: process.cwd(),
      records: Array.from({ length: 8 }, () => outcome('alpha', 'accepted')),
      options: { currentThresholds: CURRENT_THRESHOLDS },
    });

    expect(enabled?.guardrails.autoPromotion).toBe(false);
    expect(advisorFeedbackCalibrationRecordsPath(process.cwd())).toBe(calibrationPath);
    const lines = readFileSync(calibrationPath, 'utf8').trim().split('\n');
    expect(lines).toHaveLength(1);
    expect(JSON.parse(lines[0])).toMatchObject({
      model: 'advisor-feedback-calibration-shadow-v1',
      guardrails: { shadowOnly: true, autoPromotion: false },
    });
    rmSync(tempDir, { recursive: true, force: true });
  });

  it.skipIf(process.platform === 'win32')('leaves a symlinked calibration file target unchanged', () => {
    const tempDir = makeTemporaryDirectory();
    const calibrationPath = join(tempDir, 'records.jsonl');
    const victimPath = join(tempDir, 'victim.txt');
    writeFileSync(victimPath, 'original\n', { mode: 0o644 });
    chmodSync(victimPath, 0o644);
    symlinkSync(victimPath, calibrationPath);
    stubCalibrationStore(calibrationPath);

    expect(recordCalibration()).not.toBeNull();
    expect(readFileSync(victimPath, 'utf8')).toBe('original\n');
    expect(statSync(victimPath).mode & 0o777).toBe(0o644);
    expect(lstatSync(calibrationPath).isSymbolicLink()).toBe(true);
    expect(readdirSync(tempDir).filter((entry) => entry.endsWith('.tmp'))).toEqual([]);
  });

  it.skipIf(typeof process.getuid !== 'function')('skips a calibration folder owned by another user', () => {
    const tempDir = makeTemporaryDirectory();
    const calibrationPath = join(tempDir, 'records.jsonl');
    stubCalibrationStore(calibrationPath);
    const uid = process.getuid();
    vi.spyOn(process, 'getuid').mockReturnValue(uid + 1);

    expect(recordCalibration()).not.toBeNull();
    expect(existsSync(calibrationPath)).toBe(false);
  });

  it.skipIf(process.platform === 'win32')('tightens a calibration folder created with a 0775 mode', () => {
    const tempDir = makeTemporaryDirectory();
    const calibrationPath = join(tempDir, 'records.jsonl');
    chmodSync(tempDir, 0o775);
    stubCalibrationStore(calibrationPath);

    expect(recordCalibration()).not.toBeNull();
    expect(statSync(tempDir).mode & 0o777).toBe(0o700);
    expect(existsSync(calibrationPath)).toBe(true);
  });

  it.skipIf(process.platform === 'win32')('replaces a permissive calibration file with a private file', () => {
    const tempDir = makeTemporaryDirectory();
    const calibrationPath = join(tempDir, 'records.jsonl');
    writeFileSync(calibrationPath, `${JSON.stringify({ prior: true })}\n`, { mode: 0o644 });
    chmodSync(calibrationPath, 0o644);
    stubCalibrationStore(calibrationPath);

    expect(recordCalibration()).not.toBeNull();
    expect(statSync(calibrationPath).mode & 0o777).toBe(0o600);
    expect(readFileSync(calibrationPath, 'utf8').trim().split('\n')).toHaveLength(2);
  });

  it.skipIf(process.platform === 'win32')('skips a planted dangling calibration folder without throwing', () => {
    const tempDir = makeTemporaryDirectory();
    const calibrationDir = join(tempDir, 'calibration');
    const missingTarget = join(tempDir, 'missing');
    symlinkSync(missingTarget, calibrationDir);
    stubCalibrationStore(join(calibrationDir, 'records.jsonl'));
    let report: ReturnType<typeof recordAdvisorFeedbackCalibrationIfEnabled> | undefined;

    expect(() => {
      report = recordCalibration();
    }).not.toThrow();
    expect(report).not.toBeNull();
    expect(lstatSync(calibrationDir).isSymbolicLink()).toBe(true);
    expect(existsSync(missingTarget)).toBe(false);
  });

  it.skipIf(process.platform === 'win32')('does not write through a hard-linked calibration file', () => {
    const tempDir = makeTemporaryDirectory();
    const calibrationPath = join(tempDir, 'records.jsonl');
    const victimPath = join(tempDir, 'victim.txt');
    writeFileSync(victimPath, 'original\n', { mode: 0o600 });
    linkSync(victimPath, calibrationPath);
    stubCalibrationStore(calibrationPath);

    expect(recordCalibration()).not.toBeNull();
    expect(readFileSync(victimPath, 'utf8')).toBe('original\n');
    expect(statSync(calibrationPath).nlink).toBe(2);
  });

  it('skips a calibration record when a no-follow open returns EMLINK', () => {
    const tempDir = makeTemporaryDirectory();
    const calibrationPath = join(tempDir, 'records.jsonl');
    const original = `${JSON.stringify({ prior: true })}\n`;
    writeFileSync(calibrationPath, original, { mode: 0o600 });
    stubCalibrationStore(calibrationPath);
    openFailure.path = calibrationPath;

    expect(recordCalibration()).not.toBeNull();
    expect(readFileSync(calibrationPath, 'utf8')).toBe(original);
  });
});

describe('advisor feedback calibration live scorer isolation', () => {
  it('keeps recommendation order, scores, and weights byte-identical with the shadow flag on', () => {
    const projection = createFixtureProjection([
      skill({ id: 'system-spec-kit', intentSignals: ['spec folder workflow'], description: 'Spec folder workflow' }),
      skill({ id: 'sk-code', intentSignals: ['typescript implementation'], description: 'TypeScript implementation' }),
      skill({ id: 'sk-doc', intentSignals: ['markdown documentation'], description: 'Markdown documentation' }),
    ]);
    const prompts = [
      'Implement a spec folder workflow',
      'Fix the TypeScript implementation',
      'Write markdown documentation',
    ];
    const score = (prompt: string) => recommendationSnapshot(scoreAdvisorPrompt(prompt, {
      workspaceRoot: process.cwd(),
      projection,
      includeAllCandidates: true,
    }));

    vi.stubEnv('SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_SHADOW', undefined);
    const off = prompts.map(score);
    vi.stubEnv('SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_SHADOW', 'true');
    const on = prompts.map(score);

    expect(on).toEqual(off);
    expect(JSON.stringify(on)).toBe(JSON.stringify(off));
  });
});
