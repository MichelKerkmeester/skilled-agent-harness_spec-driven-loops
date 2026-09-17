import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const SHARED = path.resolve(TEST_DIR, '..');

const mf = require(path.join(SHARED, 'model-family.cjs'));
const ed = require(path.join(SHARED, 'extract-deliverable.cjs'));
const rg = require(path.join(SHARED, 'rubric-guard.cjs'));

describe('model-family (T1/T3: different-family grader enforcement)', () => {
  it('extracts canonical families across provider/slug shapes', () => {
    expect(mf.extractFamily('deepseek/deepseek-v4-pro')).toBe('deepseek');
    expect(mf.extractFamily('xiaomi/mimo-v2-pro')).toBe('xiaomi');
    expect(mf.extractFamily('minimax-cn-coding-plan/MiniMax-M2.7')).toBe('minimax');
    expect(mf.extractFamily('claude-sonnet-4-5')).toBe('anthropic');
    expect(mf.extractFamily('openai/gpt-5.4')).toBe('openai');
  });

  it('the pilot pairing (deepseek proposer, mimo grader) does not collide', () => {
    expect(mf.familiesCollide('deepseek/deepseek-v4-pro', 'xiaomi/mimo-v2-pro')).toBe(false);
  });

  it('refuses a grader sharing a family with any generator model', () => {
    const generators = [{ provider: 'minimax-coding-plan', model_slug: 'MiniMax-M3' }, 'deepseek/deepseek-v4-pro'];
    const verdict = mf.assertGraderIndependence(generators, 'deepseek/deepseek-v4-flash', false);
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) expect(verdict.collisions).toEqual(['deepseek/deepseek-v4-pro']);
  });

  it('explicit override allows but flags the collision', () => {
    const verdict = mf.assertGraderIndependence(['deepseek/deepseek-v4-pro'], 'deepseek/deepseek-v4-pro', true);
    expect(verdict).toEqual({ ok: true, overridden: true });
  });

  it('independent pairings pass without override', () => {
    const verdict = mf.assertGraderIndependence(
      [{ provider: 'minimax-coding-plan', model_slug: 'MiniMax-M2.7' }],
      'claude-sonnet-4-5',
      false,
    );
    expect(verdict).toEqual({ ok: true, overridden: false });
  });
});

describe('extract-deliverable (T5: output contract)', () => {
  it('prefers explicit DELIVERABLE tags (high confidence)', () => {
    const out = ed.extractDeliverable('reasoning — influencers quoted here\n<DELIVERABLE>Real copy.</DELIVERABLE>\nMEQT: 24/25');
    expect(out).toEqual({ text: 'Real copy.', confidence: 'high' });
  });

  it('joins multiple tag regions', () => {
    const out = ed.extractDeliverable('<DELIVERABLE>A</DELIVERABLE> mid <DELIVERABLE>B</DELIVERABLE>');
    expect(out.text).toBe('A\nB');
    expect(out.confidence).toBe('high');
  });

  it('falls back to fenced blocks (medium), then raw (low)', () => {
    expect(ed.extractDeliverable('pre\n```md\nfenced copy\n```\npost').confidence).toBe('medium');
    expect(ed.extractDeliverable('just raw reasoning and copy mixed').confidence).toBe('low');
  });
});

describe('rubric-guard (T2: the optimizer must not write its own ruler)', () => {
  const target = [
    '# Agent',
    'Intro prose.',
    '## Technique Guidance',
    'Write strong copy.',
    '## Scoring Rubric',
    'M floor is 3. E floor is 6.',
    '## Delivery',
    'Ship it.',
  ].join('\n');

  it('finds rubric-bearing regions by heading', () => {
    const regions = rg.findRubricRegions(target);
    expect(regions.map((r: { heading: string }) => r.heading)).toEqual(['Scoring Rubric']);
    expect(regions[0].body).toContain('E floor is 6');
  });

  it('accepts a candidate that only edits technique guidance', () => {
    const cand = target.replace('Write strong copy.', 'Write strong copy with one concrete proof point and a clear CTA.');
    expect(rg.rubricMutated(target, cand).mutated).toBe(false);
  });

  it('rejects a candidate that softens its own floor', () => {
    const cand = target.replace('E floor is 6', 'E floor is 5');
    expect(rg.rubricMutated(target, cand).mutated).toBe(true);
  });

  it('rejects a candidate that ADDS a new rubric-looking section (conservative)', () => {
    const cand = target + '\n## Quality Gate Exceptions\nShort copy may ship at 18.';
    const verdict = rg.rubricMutated(target, cand);
    expect(verdict.mutated).toBe(true);
    expect(verdict.candidateRegions).toContain('Quality Gate Exceptions');
  });
});
