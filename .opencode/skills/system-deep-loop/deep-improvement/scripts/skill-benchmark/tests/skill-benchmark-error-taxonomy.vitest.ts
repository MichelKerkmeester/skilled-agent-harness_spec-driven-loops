import { describe, it, expect, afterEach } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const SB = resolve(__dirname, '..');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { scoreScenario } = require(join(SB, 'score-skill-benchmark.cjs'));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { dispatchScenario } = require(join(SB, 'executor-dispatch.cjs'));

const DIRS: string[] = [];
afterEach(() => { for (const d of DIRS.splice(0)) rmSync(d, { recursive: true, force: true }); });

// A clean, three-mode manifest-bearing hub for the taxonomy tests. Each mode's
// keyword is unique so a prompt can trigger exactly the mode(s) a given test
// needs. mode-a and mode-b resolve cleanly; mode-c carries one resolvable leaf
// plus one unregistered leaf, so it is the only mode that ever produces an
// `unresolved` entry (isolating the contract-violation case from the others).
function makeTaxonomySkill(): string {
  const dir = mkdtempSync(join(tmpdir(), 'taxonomy-skill-'));
  DIRS.push(dir);
  writeFileSync(join(dir, 'SKILL.md'), '---\nname: taxonomy-throwaway\n---\n# Taxonomy Throwaway\nNo inline router; see hub-router.json.\n');

  writeFileSync(join(dir, 'hub-router.json'), JSON.stringify({
    routerSignals: {
      'mode-a': { weight: 5, keywords: ['alpha'], resources: ['mode-a/references/a.md'] },
      'mode-b': { weight: 5, keywords: ['beta'], resources: ['mode-b/references/b.md'] },
      'mode-c': { weight: 5, keywords: ['gamma'], resources: ['mode-c/references/c.md', 'mode-c/references/missing.md'] },
    },
    vocabularyClasses: {},
  }, null, 2));

  writeFileSync(join(dir, 'mode-registry.json'), JSON.stringify({
    modes: [
      { workflowMode: 'mode-a', packet: 'mode-a' },
      { workflowMode: 'mode-b', packet: 'mode-b' },
      { workflowMode: 'mode-c', packet: 'mode-c' },
    ],
  }, null, 2));

  writeFileSync(join(dir, 'leaf-manifest.json'), JSON.stringify({
    resourceContractVersion: 1,
    modes: [
      { workflowMode: 'mode-a', packet: 'mode-a', leaves: ['references/a.md'] },
      { workflowMode: 'mode-b', packet: 'mode-b', leaves: ['references/b.md'] },
      { workflowMode: 'mode-c', packet: 'mode-c', leaves: ['references/c.md'] },
    ],
  }, null, 2));

  return dir;
}

describe('score-skill-benchmark — 5-class error taxonomy (gated, additive)', () => {
  it('class 1 — fixture_schema_error: typed gold present but expected_workflow_mode is missing', () => {
    const skillRoot = makeTaxonomySkill();
    const row = scoreScenario({
      scenarioId: 'TAX-SCHEMA',
      tier: 'T1',
      skillRoot,
      routerResult: { parseable: true, intents: [], resources: [], missingResources: [], scores: [] },
      expected: {},
      scenario: {
        scenarioId: 'TAX-SCHEMA',
        // expected.workflowMode intentionally omitted below.
        expected_leaf_resources: [{ workflowMode: 'mode-a', leafResourceId: 'references/a.md' }],
      },
    });
    expect(row.excluded).toBe(true);
    expect(row.errorClass).toBe('fixture_schema_error');
    expect(row.dims).toBeUndefined();
    expect(row.modeAScore).toBeUndefined();
  });

  it('class 2 — fixture_topology_error: typed gold references a leaf the manifest does not have', () => {
    const skillRoot = makeTaxonomySkill();
    const row = scoreScenario({
      scenarioId: 'TAX-TOPOLOGY',
      tier: 'T1',
      skillRoot,
      routerResult: { parseable: true, intents: [], resources: [], missingResources: [], scores: [] },
      expected: {},
      scenario: {
        scenarioId: 'TAX-TOPOLOGY',
        expected: { workflowMode: 'mode-a' },
        expected_leaf_resources: [{ workflowMode: 'mode-a', leafResourceId: 'references/does-not-exist.md' }],
      },
    });
    expect(row.excluded).toBe(true);
    expect(row.errorClass).toBe('fixture_topology_error');
  });

  it('class 3 — fixture_selection_error: typed gold mode is not in the fixture\'s own declared set', () => {
    const skillRoot = makeTaxonomySkill();
    const row = scoreScenario({
      scenarioId: 'TAX-SELECTION',
      tier: 'T1',
      skillRoot,
      routerResult: { parseable: true, intents: [], resources: [], missingResources: [], scores: [] },
      expected: {},
      scenario: {
        scenarioId: 'TAX-SELECTION',
        expected: { workflowMode: 'mode-a' }, // declared set = {mode-a}
        expected_leaf_resources: [{ workflowMode: 'mode-b', leafResourceId: 'references/b.md' }], // pair's mode is outside it
      },
    });
    expect(row.excluded).toBe(true);
    expect(row.errorClass).toBe('fixture_selection_error');
  });

  it('class 4 — routing_contract_error: the router leaves a raw resource unresolved against the manifest', () => {
    const skillRoot = makeTaxonomySkill();
    const scenario = {
      scenarioId: 'TAX-CONTRACT',
      classKind: 'routing',
      prompt: 'please handle a gamma request',
      expected: { workflowMode: 'mode-c' },
      expected_leaf_resources: [{ workflowMode: 'mode-c', leafResourceId: 'references/c.md' }],
    };
    const observed = dispatchScenario({ scenario, skillRoot, traceMode: 'router' });
    const row = scoreScenario({ scenario, observed, skillId: 'taxonomy-throwaway', skillRoot });

    expect(row.excluded).toBeUndefined();
    expect(row.dims.typedPairRecall.unresolvedCount).toBeGreaterThan(0);
    // Full recall on the gold pair itself, but the contract violation still wins.
    expect(row.dims.typedPairRecall.score).toBe(1);
    expect(row.errorClass).toBe('routing_contract_error');
  });

  it('class 5 — routing_miss: a valid, selected, manifest-registered pair is simply never observed', () => {
    const skillRoot = makeTaxonomySkill();
    const scenario = {
      scenarioId: 'TAX-MISS',
      classKind: 'routing',
      prompt: 'please handle an alpha request', // triggers mode-a only, not mode-b
      expected: { workflowMode: 'mode-a+mode-b' },
      expected_leaf_resources: [
        { workflowMode: 'mode-a', leafResourceId: 'references/a.md' },
        { workflowMode: 'mode-b', leafResourceId: 'references/b.md' },
      ],
    };
    const observed = dispatchScenario({ scenario, skillRoot, traceMode: 'router' });
    const row = scoreScenario({ scenario, observed, skillId: 'taxonomy-throwaway', skillRoot });

    expect(row.excluded).toBeUndefined();
    expect(row.dims.typedPairRecall.unresolvedCount).toBe(0);
    expect(row.dims.typedPairRecall.score).toBe(0.5);
    expect(row.errorClass).toBe('routing_miss');
  });

  it('a fully-recalled, contract-clean gated row carries errorClass:null (no spurious flag)', () => {
    const skillRoot = makeTaxonomySkill();
    const scenario = {
      scenarioId: 'TAX-CLEAN',
      classKind: 'routing',
      prompt: 'please handle an alpha and beta request',
      expected: { workflowMode: 'mode-a+mode-b' },
      expected_leaf_resources: [
        { workflowMode: 'mode-a', leafResourceId: 'references/a.md' },
        { workflowMode: 'mode-b', leafResourceId: 'references/b.md' },
      ],
    };
    const observed = dispatchScenario({ scenario, skillRoot, traceMode: 'router' });
    const row = scoreScenario({ scenario, observed, skillId: 'taxonomy-throwaway', skillRoot });

    expect(row.excluded).toBeUndefined();
    expect(row.dims.typedPairRecall.score).toBe(1);
    expect(row.errorClass).toBeNull();
  });

  it('no-regression: a scenario with no typed gold carries no taxonomy fields at all, even on a manifest-bearing skill', () => {
    const skillRoot = makeTaxonomySkill();
    const scenario = {
      scenarioId: 'TAX-UNGATED',
      classKind: 'routing',
      prompt: 'please handle an alpha request',
      expectedResources: ['mode-a/references/a.md'],
    };
    const observed = dispatchScenario({ scenario, skillRoot, traceMode: 'router' });
    const row = scoreScenario({ scenario, observed, skillId: 'taxonomy-throwaway', skillRoot });

    expect(row.excluded).toBeUndefined();
    expect(Object.prototype.hasOwnProperty.call(row, 'errorClass')).toBe(false);
    expect(row.dims.typedPairRecall).toBeUndefined();
    expect(typeof row.modeAScore).toBe('number');
  });

  it('no-regression: a skill with no leaf-manifest.json never engages the gate even if a scenario names typed gold', () => {
    const dir = mkdtempSync(join(tmpdir(), 'no-manifest-skill-'));
    DIRS.push(dir);
    writeFileSync(join(dir, 'SKILL.md'), [
      '---',
      'name: no-manifest-throwaway',
      '---',
      '```python',
      'INTENT_SIGNALS = {\n  "X": {"weight": 3, "keywords": ["x"]},\n}',
      'RESOURCE_MAP = {\n  "X": ["references/a.md"],\n}',
      '```',
      '',
    ].join('\n'));

    const routerResult = { parseable: true, intents: ['X'], resources: ['references/a.md'], missingResources: [], scores: [] };
    const row = scoreScenario({
      scenarioId: 'TAX-NO-MANIFEST',
      tier: 'T1',
      skillRoot: dir,
      routerResult,
      expected: { intentKeys: ['X'], resources: ['references/a.md'] },
      scenario: {
        scenarioId: 'TAX-NO-MANIFEST',
        expected: { workflowMode: 'X' },
        expected_leaf_resources: [{ workflowMode: 'X', leafResourceId: 'references/nonexistent.md' }],
      },
    });

    expect(row.excluded).toBeUndefined();
    expect(Object.prototype.hasOwnProperty.call(row, 'errorClass')).toBe(false);
  });
});
