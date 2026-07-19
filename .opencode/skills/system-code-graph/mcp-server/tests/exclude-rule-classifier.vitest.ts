// ───────────────────────────────────────────────────────────────
// TEST: Exclude Rule Classifier
// ───────────────────────────────────────────────────────────────
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  classifyExcludeRule,
  classifyExcludeRules,
  loadExcludeRuleConfidence,
  type ExcludeRuleConfidenceArtifact,
} from '../lib/exclude-rule-classifier.js';

const validArtifact: ExcludeRuleConfidenceArtifact = {
  schema_version: 1,
  tiers: {
    high: {
      definition: 'Files that must never be parsed',
      default_action: 'exclude',
      patterns: [
        { pattern: 'node_modules/', rationale: 'Third-party dependencies' },
        { pattern: '.venv/', rationale: 'Python virtual environment' },
      ],
    },
    medium: {
      definition: 'Files that are likely noise',
      default_action: 'exclude',
      patterns: [
        { pattern: '__pycache__/', rationale: 'Python bytecode cache' },
        { pattern: '.pytest_cache/', rationale: 'Pytest cache', false_positive_examples: ['tests/'] },
      ],
    },
    low: {
      definition: 'Low-confidence noise candidates',
      default_action: 'exclude',
      patterns: [
        { pattern: '*.log', rationale: 'Log files' },
      ],
    },
  },
};

describe('exclude-rule-classifier / classifyExcludeRule', () => {
  it('classifies a known pattern under its correct tier', () => {
    const result = classifyExcludeRule(validArtifact, 'node_modules/');
    expect(result).toEqual({
      pattern: 'node_modules/',
      tier: 'high',
      rationale: 'Third-party dependencies',
      defaultAction: 'exclude',
    });
  });

  it('trims whitespace from the input pattern', () => {
    const result = classifyExcludeRule(validArtifact, '  .venv/  ');
    expect(result.tier).toBe('high');
    expect(result.pattern).toBe('.venv/');
  });

  it('returns unknown tier for unmatched patterns', () => {
    const result = classifyExcludeRule(validArtifact, 'non_existent_pattern');
    expect(result).toEqual({
      pattern: 'non_existent_pattern',
      tier: 'unknown',
    });
  });

  it('classifies a medium-tier pattern', () => {
    const result = classifyExcludeRule(validArtifact, '__pycache__/');
    expect(result.tier).toBe('medium');
    expect(result.defaultAction).toBe('exclude');
  });

  it('classifies a low-tier pattern', () => {
    const result = classifyExcludeRule(validArtifact, '*.log');
    expect(result.tier).toBe('low');
  });
});

describe('exclude-rule-classifier / classifyExcludeRules', () => {
  it('classifies multiple patterns in a batch', () => {
    const results = classifyExcludeRules(validArtifact, [
      'node_modules/',
      'non_existent',
      '.venv/',
    ]);
    expect(results).toHaveLength(3);
    expect(results[0].tier).toBe('high');
    expect(results[1].tier).toBe('unknown');
    expect(results[2].tier).toBe('high');
  });

  it('returns empty array for empty input', () => {
    const results = classifyExcludeRules(validArtifact, []);
    expect(results).toEqual([]);
  });
});

describe('exclude-rule-classifier / loadExcludeRuleConfidence', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  function writeTempArtifact(content: unknown): string {
    const dir = mkdtempSync(join(tmpdir(), 'exclude-rule-test-'));
    tempDirs.push(dir);
    const path = join(dir, 'exclude-rules.json');
    writeFileSync(path, JSON.stringify(content), 'utf-8');
    return path;
  }

  it('loads a valid artifact successfully', () => {
    const path = writeTempArtifact(validArtifact);
    const loaded = loadExcludeRuleConfidence(path);
    expect(loaded.schema_version).toBe(1);
    expect(loaded.tiers.high.patterns).toHaveLength(2);
  });

  it('throws when the file is not an object', () => {
    const path = writeTempArtifact('not an object');
    expect(() => loadExcludeRuleConfidence(path)).toThrow('must be an object');
  });

  it('throws when schema_version is not 1', () => {
    const path = writeTempArtifact({ ...validArtifact, schema_version: 2 });
    expect(() => loadExcludeRuleConfidence(path)).toThrow('schema_version === 1');
  });

  it('throws when tiers is missing', () => {
    const path = writeTempArtifact({ schema_version: 1 });
    expect(() => loadExcludeRuleConfidence(path)).toThrow('must include tiers');
  });

  it('throws when a required tier key is missing', () => {
    const path = writeTempArtifact({
      schema_version: 1,
      tiers: { high: validArtifact.tiers.high },
    });
    expect(() => loadExcludeRuleConfidence(path)).toThrow('missing medium tier');
  });

  it('throws when a tier.patterns is not an array', () => {
    const path = writeTempArtifact({
      schema_version: 1,
      tiers: {
        high: { definition: 'x', default_action: 'exclude', patterns: 'not-array' },
        medium: validArtifact.tiers.medium,
        low: validArtifact.tiers.low,
      },
    });
    expect(() => loadExcludeRuleConfidence(path)).toThrow('invalid high.patterns');
  });
});
