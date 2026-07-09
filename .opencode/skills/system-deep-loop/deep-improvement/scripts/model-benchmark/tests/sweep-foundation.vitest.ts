import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../../');
const LIB = path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib',
);
const REGISTRY_PATH = path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/sk-prompt/assets/framework-registry.json',
);
const FIXTURE_DIR = path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures',
);
const PROFILE_DIR = path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles',
);

// The foundation modules are CommonJS; load them through a require bridge so the
// .cjs contracts are exercised exactly as the runtime sweep will consume them.
const require = createRequire(import.meta.url);
const renderer = require(path.join(LIB, 'framework-renderer.cjs'));
const validator = require(path.join(LIB, 'profile-validator.cjs'));
const stats = require(path.join(LIB, 'sweep-stats.cjs'));

function readJson(p: string): any {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

const ALL_FRAMEWORK_IDS = ['rcaf', 'race', 'cidi', 'tidd-ec', 'costar'];

describe('framework-renderer: slot interpolation', () => {
  const registry = renderer.loadRegistry(REGISTRY_PATH);
  const fixture = readJson(path.join(FIXTURE_DIR, 't3_bugfix_in_context.json'));

  it('loads the registry with all five frameworks', () => {
    const ids = registry.frameworks.map((f: any) => f.id);
    expect(ids).toEqual(ALL_FRAMEWORK_IDS);
  });

  it('renders every framework to a prompt with no unresolved slots', () => {
    for (const id of ALL_FRAMEWORK_IDS) {
      const def = renderer.getFramework(registry, id);
      expect(def).toBeDefined();
      const prompt = renderer.renderFramework(def, fixture, {});
      expect(typeof prompt).toBe('string');
      expect(prompt.length).toBeGreaterThan(0);
      // No literal mustache placeholders survived interpolation.
      expect(prompt).not.toMatch(/\{\{/);
      // The computed output_contract resolved its own fixture slots.
      expect(prompt).toContain(fixture.fn_name);
      expect(prompt).toContain(fixture.signature);
    }
  });

  it('looks up frameworks case-insensitively and misses cleanly', () => {
    expect(renderer.getFramework(registry, 'RCAF')).toBeDefined();
    expect(renderer.getFramework(registry, 'TIDD-EC')).toBeDefined();
    expect(renderer.getFramework(registry, 'does-not-exist')).toBeUndefined();
  });

  it('throws when a declared required slot has no value', () => {
    const broken = {
      id: 'broken-missing-slot',
      template: '## Task\n{{task}}\n## Extra\n{{nonexistent_slot}}',
      required_slots: ['task', 'nonexistent_slot'],
    };
    expect(() => renderer.renderFramework(broken, fixture, {})).toThrow(
      /nonexistent_slot/,
    );
  });

  it('throws when the fixture cannot supply a referenced slot value', () => {
    const def = renderer.getFramework(registry, 'rcaf');
    const noTask = { fn_name: 'x', signature: 'function x()' };
    expect(() => renderer.renderFramework(def, noTask, {})).toThrow(/task/);
  });

  it('honors a caller-supplied output_contract override', () => {
    const def = renderer.getFramework(registry, 'rcaf');
    const prompt = renderer.renderFramework(def, fixture, {
      output_contract: 'CUSTOM-CONTRACT-MARKER for {{fn_name}}',
    });
    expect(prompt).toContain('CUSTOM-CONTRACT-MARKER');
    expect(prompt).toContain(fixture.fn_name);
  });
});

describe('profile-validator: additive sweep-key validation', () => {
  it('accepts the framework-bakeoff example profile', () => {
    const profile = readJson(path.join(PROFILE_DIR, 'framework_bakeoff.json'));
    expect(validator.validateProfile(profile)).toEqual({
      valid: true,
      errors: [],
    });
  });

  it('accepts the model-vs-model example profile', () => {
    const profile = readJson(path.join(PROFILE_DIR, 'model_vs_model.json'));
    expect(validator.validateProfile(profile)).toEqual({
      valid: true,
      errors: [],
    });
  });

  it('treats a legacy profile with no mode as valid and untouched', () => {
    const result = validator.validateProfile({
      profileId: 'legacy',
      fixtureDir: '.',
      fixtures: ['a'],
    });
    expect(result).toEqual({ valid: true, errors: [] });
  });

  it('rejects an unknown executor', () => {
    const result = validator.validateProfile({
      mode: 'model-vs-model',
      models: [{ executor: 'cli-bogus' }],
    });
    expect(result.valid).toBe(false);
    expect(result.errors.join(' ')).toMatch(/cli-bogus/);
  });

  it('rejects dimension weights that do not sum to 1.0', () => {
    const result = validator.validateProfile({
      mode: 'framework-bakeoff',
      scoring: {
        dimensions: [
          { id: 'a', weight: 0.5 },
          { id: 'b', weight: 0.2 },
        ],
      },
    });
    expect(result.valid).toBe(false);
    expect(result.errors.join(' ')).toMatch(/sum to 1\.0/);
  });

  it('rejects an unknown mode', () => {
    const result = validator.validateProfile({ mode: 'nonsense-mode' });
    expect(result.valid).toBe(false);
    expect(result.errors.join(' ')).toMatch(/mode/);
  });

  it('rejects a correctness-gate threshold outside [0,1]', () => {
    const result = validator.validateProfile({
      mode: 'framework-bakeoff',
      scoring: { correctnessGate: { threshold: 1.5 } },
    });
    expect(result.valid).toBe(false);
    expect(result.errors.join(' ')).toMatch(/threshold/);
  });

  it('rejects a non-positive samplesPerCell', () => {
    const result = validator.validateProfile({
      mode: 'framework-bakeoff',
      sampling: { samplesPerCell: 0 },
    });
    expect(result.valid).toBe(false);
    expect(result.errors.join(' ')).toMatch(/samplesPerCell/);
  });

  it('accepts a well-formed dimension weight set (0.3 + 0.7)', () => {
    const result = validator.validateProfile({
      mode: 'framework-bakeoff',
      scoring: {
        dimensions: [
          { id: 'a', weight: 0.3 },
          { id: 'b', weight: 0.7 },
        ],
      },
    });
    expect(result).toEqual({ valid: true, errors: [] });
  });
});

describe('sweep-stats: central tendency and spread', () => {
  it('computes mean over known inputs', () => {
    expect(stats.mean([1, 2, 3, 4])).toBe(2.5);
    expect(stats.mean([2, 4, 6])).toBe(4);
  });

  it('computes median for even and odd length', () => {
    expect(stats.median([1, 2, 3, 4])).toBe(2.5);
    expect(stats.median([1, 2, 3])).toBe(2);
    expect(stats.median([7])).toBe(7);
  });

  it('computes mad as the median absolute deviation', () => {
    // data median = 3, abs deviations [2,1,0,1,2], their median = 1
    expect(stats.mad([1, 2, 3, 4, 5])).toBe(1);
    // a single sample has no observed spread
    expect(stats.mad([9])).toBe(0);
    expect(stats.mad([1, 1, 1, 100, 100, 100])).toBe(49.5);
  });

  it('computes quantiles by linear interpolation', () => {
    expect(stats.quantile([1, 2, 3, 4], 0)).toBe(1);
    expect(stats.quantile([1, 2, 3, 4], 1)).toBe(4);
    expect(stats.quantile([1, 2, 3, 4], 0.25)).toBe(1.75);
  });

  it('returns NaN for empty input without throwing', () => {
    expect(Number.isNaN(stats.mean([]))).toBe(true);
    expect(Number.isNaN(stats.median([]))).toBe(true);
    expect(Number.isNaN(stats.mad([]))).toBe(true);
  });

  it('seededRandom is deterministic and bounded', () => {
    const a = stats.seededRandom(42);
    const b = stats.seededRandom(42);
    const seqA = [a(), a(), a()];
    const seqB = [b(), b(), b()];
    expect(seqA).toEqual(seqB);
    for (const x of seqA) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
    }
    // String seeds are stable too.
    const c = stats.seededRandom('hello');
    const d = stats.seededRandom('hello');
    expect(c()).toBe(d());
  });
});

describe('sweep-stats: trustVerdict gate', () => {
  it('is INCONCLUSIVE for insufficient samples (n=1)', () => {
    expect(
      stats.trustVerdict({ nSamples: 1, margin: 5, noiseFloor: 0.1 }),
    ).toEqual({ verdict: 'INCONCLUSIVE', reason: 'insufficient_n' });
  });

  it('is a TIE when the margin is inside the noise floor', () => {
    expect(
      stats.trustVerdict({ nSamples: 5, margin: 0.05, noiseFloor: 0.1 }),
    ).toEqual({ verdict: 'TIE', reason: 'inside_noise_floor' });
  });

  it('is a TIE when the margin exactly equals the noise floor', () => {
    expect(
      stats.trustVerdict({ nSamples: 5, margin: 0.1, noiseFloor: 0.1 }),
    ).toEqual({ verdict: 'TIE', reason: 'inside_noise_floor' });
  });

  it('is a WINNER for a clear margin above the noise floor', () => {
    expect(
      stats.trustVerdict({ nSamples: 5, margin: 0.5, noiseFloor: 0.1 }),
    ).toEqual({ verdict: 'WINNER', reason: 'trusted_margin' });
  });

  it('respects a custom minSamplesForWinner', () => {
    expect(
      stats.trustVerdict({
        nSamples: 2,
        margin: 0.5,
        noiseFloor: 0.1,
        minSamplesForWinner: 5,
      }),
    ).toEqual({ verdict: 'INCONCLUSIVE', reason: 'insufficient_n' });
  });
});
