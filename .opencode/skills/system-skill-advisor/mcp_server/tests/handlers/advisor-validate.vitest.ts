// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Validate Tests
// ───────────────────────────────────────────────────────────────

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { advisorHookOutcomesPath } from '../../lib/metrics.js';
import { findAdvisorWorkspaceRoot } from '../../lib/utils/workspace-root.js';
import { AdvisorValidateInputSchema, AdvisorValidateOutputSchema } from '../../schemas/advisor-tool-schemas.js';
import { CorpusRowSchema, handleAdvisorValidate } from '../../handlers/advisor-validate.js';

const REPO_ROOT = findAdvisorWorkspaceRoot(dirname(fileURLToPath(import.meta.url)));

describe('advisor_validate handler', () => {
  it('returns the required slice bundle schema for a skill subset', async () => {
    const response = await handleAdvisorValidate({ confirmHeavyRun: true, skillSlug: 'system-spec-kit' });
    const parsed = JSON.parse(response.content[0].text) as { status: string; data: unknown };

    expect(parsed.status).toBe('ok');
    expect(() => AdvisorValidateOutputSchema.parse(parsed.data)).not.toThrow();
    expect(parsed.data).toEqual(expect.objectContaining({
      skillSlug: 'system-spec-kit',
      slices: expect.objectContaining({
        corpus: expect.any(Object),
        holdout: expect.any(Object),
        parity: expect.any(Object),
        safety: expect.any(Object),
        latency: expect.any(Object),
        buckets: expect.any(Object),
      }),
    }));
  });

  it('surfaces named intent buckets with minN floors', async () => {
    const response = await handleAdvisorValidate({ confirmHeavyRun: true, skillSlug: null });
    const parsed = JSON.parse(response.content[0].text) as { data: unknown };
    const data = AdvisorValidateOutputSchema.parse(parsed.data);
    const { review, memory_save: memorySave, delegation } = data.slices.buckets;

    for (const slice of [review, memorySave, delegation]) {
      expect(slice.top1).toBeGreaterThanOrEqual(0);
      expect(slice.top1).toBeLessThanOrEqual(1);
      expect(slice.count.total).toBeGreaterThanOrEqual(slice.minN);
      expect(typeof slice.passed).toBe('boolean');
    }
    expect(review.minN).toBe(32);
    expect(memorySave.minN).toBe(32);
    expect(delegation.minN).toBe(11);
    expect(delegation.count.total).toBe(11);
  });

  it('computes buckets over the full corpus regardless of skillSlug scope', async () => {
    // A skillSlug filter narrows the aggregate corpus but must not shrink the
    // named buckets — they are a global diagnostic, so their totals stay fixed.
    const scoped = AdvisorValidateOutputSchema.parse(
      JSON.parse((await handleAdvisorValidate({ confirmHeavyRun: true, skillSlug: 'system-spec-kit' })).content[0].text).data,
    );
    expect(scoped.slices.buckets.review.count.total).toBe(32);
    expect(scoped.slices.buckets.memory_save.count.total).toBe(32);
    expect(scoped.slices.buckets.delegation.count.total).toBe(11);
  });

  it('CorpusRowSchema enforces bucket and source_type enums', () => {
    const valid = {
      id: 'row-1',
      prompt: 'create a pull request',
      skill_top_1: 'sk-git',
      bucket: 'true_read_only',
      source_type: 'synthetic-realistic',
    };
    expect(CorpusRowSchema.safeParse(valid).success).toBe(true);
    expect(CorpusRowSchema.safeParse({ ...valid, bucket: 'not_a_bucket' }).success).toBe(false);
    expect(CorpusRowSchema.safeParse({ ...valid, source_type: 'not_a_source' }).success).toBe(false);
    const { bucket: _bucket, ...missingBucket } = valid;
    expect(CorpusRowSchema.safeParse(missingBucket).success).toBe(false);
  });

  it('preserves privacy by excluding raw prompts and PII-shaped content', async () => {
    const raw = (await handleAdvisorValidate({ confirmHeavyRun: true, skillSlug: null })).content[0].text;

    expect(raw).not.toContain('"prompt"');
    expect(raw).not.toMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  });

  it('drops malformed durable outcome telemetry instead of crashing validation', async () => {
    const workspaceRoot = REPO_ROOT;
    const outcomesPath = advisorHookOutcomesPath(workspaceRoot);
    const previousExists = existsSync(outcomesPath);
    const previousContent = previousExists ? readFileSync(outcomesPath, 'utf8') : null;

    mkdirSync(dirname(outcomesPath), { recursive: true });
    writeFileSync(
      outcomesPath,
      [
        '{"timestamp":"2026-04-24T10:08:00.000Z","runtime":"opencode","outcome":"accepted","skillLabel":"system-spec-kit"}',
        '{"timestamp":"2026-04-24T10:08:01.000Z","runtime":"opencode","outcome"',
        '{"timestamp":"2026-04-24T10:08:02.000Z","runtime":"opencode","outcome":"corrected","skillLabel":"system-spec-kit","correctedSkillLabel":"sk-code"}',
        '{"timestamp":"2026-04-24T10:08:03.000Z","runtime":"opencode","outcome":"mystery","skillLabel":"system-spec-kit"}',
      ].join('\n'),
      'utf8',
    );

    try {
      const response = await handleAdvisorValidate({ confirmHeavyRun: true, workspaceRoot });
      const parsed = JSON.parse(response.content[0].text) as { status: string; data: unknown };
      const data = AdvisorValidateOutputSchema.parse(parsed.data);

      expect(parsed.status).toBe('ok');
      expect(data.telemetry.outcomes.totals).toEqual({
        accepted: 1,
        corrected: 1,
        ignored: 0,
      });
    } finally {
      if (previousExists && previousContent !== null) {
        writeFileSync(outcomesPath, previousContent, 'utf8');
      } else {
        rmSync(outcomesPath, { force: true });
      }
    }
  });

  it('records shadow calibration reports from validate outcomes when explicitly enabled', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'advisor-validate-calibration-'));
    const calibrationPath = join(tempDir, 'calibration.jsonl');
    const previousFlag = process.env.SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_SHADOW;
    const previousPath = process.env.SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_PATH;
    process.env.SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_SHADOW = 'true';
    process.env.SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_PATH = calibrationPath;

    try {
      await handleAdvisorValidate({
        confirmHeavyRun: true,
        workspaceRoot: REPO_ROOT,
        skillSlug: 'system-spec-kit',
        outcomeEvents: Array.from({ length: 8 }, (_, index) => ({
          runtime: 'opencode',
          outcome: index < 6 ? 'accepted' : 'ignored',
          skillId: 'system-spec-kit',
          timestamp: `2026-06-10T00:00:0${index}.000Z`,
        })),
      });

      const lines = readFileSync(calibrationPath, 'utf8').trim().split('\n');
      expect(lines).toHaveLength(1);
      expect(JSON.parse(lines[0])).toMatchObject({
        model: 'advisor-feedback-calibration-shadow-v1',
        scope: { kind: 'skill', skillSlug: 'system-spec-kit' },
        guardrails: {
          defaultOff: true,
          shadowOnly: true,
          liveWeightsFrozen: true,
          autoPromotion: false,
          heldOutValidationRequired: true,
        },
      });
    } finally {
      if (previousFlag === undefined) delete process.env.SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_SHADOW;
      else process.env.SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_SHADOW = previousFlag;
      if (previousPath === undefined) delete process.env.SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_PATH;
      else process.env.SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_PATH = previousPath;
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('includes newly recorded outcome events in telemetry totals', async () => {
    const workspaceRoot = REPO_ROOT;
    const outcomesPath = advisorHookOutcomesPath(workspaceRoot);
    const previousExists = existsSync(outcomesPath);
    const previousContent = previousExists ? readFileSync(outcomesPath, 'utf8') : null;

    mkdirSync(dirname(outcomesPath), { recursive: true });
    writeFileSync(outcomesPath, '', 'utf8');

    try {
      const response = await handleAdvisorValidate({
        confirmHeavyRun: true,
        workspaceRoot,
        skillSlug: 'system-spec-kit',
        outcomeEvents: [
          {
            runtime: 'opencode',
            outcome: 'accepted',
            skillId: 'system-spec-kit',
            timestamp: '2026-06-10T00:00:00.000Z',
          },
          {
            runtime: 'opencode',
            outcome: 'corrected',
            skillId: 'sk-code',
            correctedSkillId: 'system-spec-kit',
            timestamp: '2026-06-10T00:00:01.000Z',
          },
        ],
      });
      const parsed = JSON.parse(response.content[0].text) as { status: string; data: unknown };
      const data = AdvisorValidateOutputSchema.parse(parsed.data);

      expect(parsed.status).toBe('ok');
      expect(data.telemetry.outcomes.recordedThisRun).toBe(2);
      expect(data.telemetry.outcomes.totals).toEqual({
        accepted: 1,
        corrected: 1,
        ignored: 0,
      });
    } finally {
      if (previousExists && previousContent !== null) {
        writeFileSync(outcomesPath, previousContent, 'utf8');
      } else {
        rmSync(outcomesPath, { force: true });
      }
    }
  });

  it('rejects invalid strict input clearly', () => {
    expect(() => AdvisorValidateInputSchema.parse({
      skillSlug: 'system-spec-kit',
    })).toThrow();
    expect(() => AdvisorValidateInputSchema.parse({
      confirmHeavyRun: true,
      skillSlug: 12,
    })).toThrow();
    expect(() => AdvisorValidateInputSchema.parse({
      confirmHeavyRun: true,
      skillSlug: null,
      prompt: 'not allowed',
    })).toThrow(/Unrecognized key/);
  });
});
