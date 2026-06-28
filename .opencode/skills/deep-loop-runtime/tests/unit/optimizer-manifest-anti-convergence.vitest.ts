// ───────────────────────────────────────────────────────────────────
// MODULE: Optimizer Manifest Anti-Convergence Contract
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// ───────────────────────────────────────────────────────────────────
// 2. TYPES
// ───────────────────────────────────────────────────────────────────

type ManifestField = {
  name: string;
};

type InvariantConstraint = {
  name: string;
  type: string;
  left: string;
  right: string;
  message: string;
};

type InvariantGroup = {
  key: string;
  rejectBeforeScoring: boolean;
  lockedFields: string[];
  fieldAliases: Record<string, string[]>;
  constraints: InvariantConstraint[];
};

type OptimizerManifest = {
  tunableFields: ManifestField[];
  lockedFields: ManifestField[];
  invariantGroups: InvariantGroup[];
};

// ───────────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const testDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(testDir, '..', '..', '..', '..');
const manifestPath = resolve(
  repoRoot,
  'skills',
  'system-spec-kit',
  'scripts',
  'optimizer',
  'optimizer-manifest.json',
);

// ───────────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────────

function readManifest(): OptimizerManifest {
  return JSON.parse(readFileSync(manifestPath, 'utf8')) as OptimizerManifest;
}

function readPath(source: Record<string, unknown>, dottedPath: string): unknown {
  return dottedPath.split('.').reduce<unknown>((current, key) => {
    if (!current || typeof current !== 'object' || Array.isArray(current)) return undefined;
    return (current as Record<string, unknown>)[key];
  }, source);
}

function readAlias(source: Record<string, unknown>, group: InvariantGroup, alias: string): unknown {
  for (const path of group.fieldAliases[alias] || []) {
    const value = readPath(source, path);
    if (value !== undefined) return value;
  }
  return undefined;
}

function evaluateConstraint(
  source: Record<string, unknown>,
  group: InvariantGroup,
  constraint: InvariantConstraint,
): { valid: boolean; reason: string | null } {
  const left = readAlias(source, group, constraint.left);
  const right = readAlias(source, group, constraint.right);

  if (constraint.type !== 'lessThanOrEqual') {
    return { valid: false, reason: `Unsupported constraint: ${constraint.type}` };
  }
  if (typeof left !== 'number' || typeof right !== 'number') {
    return { valid: false, reason: constraint.message };
  }
  if (left > right) {
    return { valid: false, reason: constraint.message };
  }
  return { valid: true, reason: null };
}

function antiConvergenceGroup(manifest: OptimizerManifest): InvariantGroup {
  const group = manifest.invariantGroups.find((entry) => entry.key === 'anti-convergence-floor');
  if (!group) throw new Error('Missing anti-convergence invariant group');
  return group;
}

// ───────────────────────────────────────────────────────────────────
// 5. CONTRACT TESTS
// ───────────────────────────────────────────────────────────────────

describe('optimizer manifest anti-convergence contract', () => {
  it('keeps convergence mode locked out of the tunable field registry', () => {
    const manifest = readManifest();
    const tunableNames = manifest.tunableFields.map((field) => field.name);
    const lockedNames = manifest.lockedFields.map((field) => field.name);
    const group = antiConvergenceGroup(manifest);

    expect(tunableNames).not.toContain('convergenceMode');
    expect(tunableNames).not.toContain('antiConvergence.convergenceMode');
    expect(lockedNames).toContain('convergenceMode');
    expect(lockedNames).toContain('antiConvergence.convergenceMode');
    expect(group.lockedFields).toEqual(expect.arrayContaining(['convergenceMode', 'antiConvergence.convergenceMode']));
  });

  it('declares the iteration-floor invariant as a pre-scoring rejection gate', () => {
    const group = antiConvergenceGroup(readManifest());

    expect(group.rejectBeforeScoring).toBe(true);
    expect(group.constraints).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'minIterations<=maxIterations',
          type: 'lessThanOrEqual',
          left: 'minIterations',
          right: 'maxIterations',
        }),
      ]),
    );
  });

  it('rejects a candidate whose iteration floor exceeds the hard cap', () => {
    const group = antiConvergenceGroup(readManifest());
    const [constraint] = group.constraints;

    expect(evaluateConstraint({ minIterations: 5, maxIterations: 3 }, group, constraint)).toEqual({
      valid: false,
      reason: 'minIterations must be less than or equal to maxIterations',
    });
    expect(evaluateConstraint({ antiConvergence: { minIterations: 3 }, maxIterations: 5 }, group, constraint)).toEqual({
      valid: true,
      reason: null,
    });
  });
});
