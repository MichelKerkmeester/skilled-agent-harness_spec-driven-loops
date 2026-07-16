import { describe, it, expect, afterEach } from 'vitest';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const SB = resolve(__dirname, '..');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { routeSkillResources, hasLeafManifest } = require(join(SB, 'router-replay.cjs'));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { dispatchScenario, cappedWorkflowModes, MAX_WORKFLOW_MODES } = require(join(SB, 'executor-dispatch.cjs'));

const DIRS: string[] = [];
afterEach(() => { for (const d of DIRS.splice(0)) rmSync(d, { recursive: true, force: true }); });

// A manifest-bearing synthetic hub: three workflow modes (alpha-mode,
// beta-mode, gamma-mode) whose intent keys equal their workflowMode (mirrors
// sk-doc's real hub-router.json, where the hub layer's selected intent IS the
// workflowMode). No inline INTENT_SIGNALS/RESOURCE_MAP in SKILL.md, so
// parseRouter() falls through to the hub-router.json projection, exactly like
// the real sk-doc hub. Each mode's `resources` mixes a packet-qualified legacy
// string, a shared-alias legacy string, an unregistered-leaf string, and a
// bare packet pointer (SKILL.md) that fails containment outright.
function makeManifestSkill(): string {
  const dir = mkdtempSync(join(tmpdir(), 'leaf-contract-'));
  DIRS.push(dir);
  writeFileSync(join(dir, 'SKILL.md'), '---\nname: leaf-contract-throwaway\n---\n# Leaf Contract Throwaway\nNo inline router; see hub-router.json.\n');

  writeFileSync(join(dir, 'hub-router.json'), JSON.stringify({
    routerSignals: {
      'alpha-mode': {
        weight: 5,
        keywords: ['alpha'],
        resources: ['alpha-mode/references/a.md', 'alpha-mode/references/not_in_manifest.md', '../shared/assets/shared_thing.md'],
      },
      'beta-mode': { weight: 5, keywords: ['beta'], resources: ['beta-mode/references/b.md'] },
      'gamma-mode': { weight: 5, keywords: ['gamma'], resources: ['gamma-mode/references/c.md', 'gamma-mode/SKILL.md'] },
    },
    vocabularyClasses: {},
  }, null, 2));

  writeFileSync(join(dir, 'mode-registry.json'), JSON.stringify({
    modes: [
      { workflowMode: 'alpha-mode', packet: 'alpha-mode' },
      { workflowMode: 'beta-mode', packet: 'beta-mode' },
      { workflowMode: 'gamma-mode', packet: 'gamma-mode' },
    ],
  }, null, 2));

  writeFileSync(join(dir, 'leaf-manifest.json'), JSON.stringify({
    resourceContractVersion: 1,
    modes: [
      { workflowMode: 'alpha-mode', packet: 'alpha-mode', leaves: ['references/a.md', 'assets/shared_thing.md'] },
      { workflowMode: 'beta-mode', packet: 'beta-mode', leaves: ['references/b.md'] },
      { workflowMode: 'gamma-mode', packet: 'gamma-mode', leaves: ['references/c.md'] },
    ],
  }, null, 2));

  writeFileSync(join(dir, 'leaf-aliases.json'), JSON.stringify([
    { workflowMode: 'alpha-mode', leafResourceId: 'assets/shared_thing.md', diskPath: 'shared/assets/shared_thing.md' },
  ], null, 2));

  return dir;
}

// A skill with no leaf-manifest.json at all — the no-regression control.
function makeNoManifestSkill(): string {
  const dir = mkdtempSync(join(tmpdir(), 'no-leaf-contract-'));
  DIRS.push(dir);
  mkdirSync(join(dir, 'references'), { recursive: true });
  writeFileSync(join(dir, 'references', 'a.md'), '# A\n');
  writeFileSync(join(dir, 'SKILL.md'), [
    '---',
    'name: no-contract-throwaway',
    '---',
    '```python',
    'INTENT_SIGNALS = {\n  "X": {"weight": 3, "keywords": ["x"]},\n}',
    'RESOURCE_MAP = {\n  "X": ["references/a.md"],\n}',
    '```',
    '',
  ].join('\n'));
  return dir;
}

describe('router-replay — canonical typed-pair emission (leaf-manifest gate)', () => {
  it('a manifest-bearing skill gets a resourceContract with dual-read pairs + unresolved raw strings', () => {
    const skillRoot = makeManifestSkill();
    expect(hasLeafManifest(skillRoot)).toBe(true);
    const res = routeSkillResources({ skillRoot, taskText: 'please handle alpha beta gamma request' });
    expect(res.parseable).toBe(true);
    expect(res.intents).toEqual(['alpha-mode', 'beta-mode', 'gamma-mode']);
    expect(res.resourceContract).toBeTruthy();
    expect(res.resourceContract.resourceContractVersion).toBe(1);

    // Dual-read of a packet-qualified legacy string resolves to the canonical pair.
    expect(res.resourceContract.pairs).toContainEqual({ workflowMode: 'alpha-mode', leafResourceId: 'references/a.md' });
    expect(res.resourceContract.pairs).toContainEqual({ workflowMode: 'beta-mode', leafResourceId: 'references/b.md' });
    expect(res.resourceContract.pairs).toContainEqual({ workflowMode: 'gamma-mode', leafResourceId: 'references/c.md' });

    // Dual-read of a shared-prefixed legacy string resolves via the authored alias.
    expect(res.resourceContract.pairs).toContainEqual({ workflowMode: 'alpha-mode', leafResourceId: 'assets/shared_thing.md' });

    // A resolvable-but-unregistered leaf and a bare SKILL.md pointer both fail
    // closed into unresolved — no unmapped leaves ever reach `pairs`.
    expect(res.resourceContract.unresolved).toContain('alpha-mode/references/not_in_manifest.md');
    expect(res.resourceContract.unresolved).toContain('gamma-mode/SKILL.md');
    expect(res.resourceContract.pairs.length).toBe(4);
  });

  it('a skill with no leaf-manifest.json carries no resourceContract field at all (byte-for-byte no-regression)', () => {
    const skillRoot = makeNoManifestSkill();
    expect(hasLeafManifest(skillRoot)).toBe(false);
    const res = routeSkillResources({ skillRoot, taskText: 'anything about x' });
    expect(res.parseable).toBe(true);
    expect(Object.prototype.hasOwnProperty.call(res, 'resourceContract')).toBe(false);
  });
});

describe('executor-dispatch — selected-map union cap', () => {
  it('caps the typed-pair bundle to the top maxWorkflowModes=2 selected modes by default', () => {
    const skillRoot = makeManifestSkill();
    const scenario = { scenarioId: 'T-1', classKind: 'routing', prompt: 'please handle alpha beta gamma request' };
    const obs = dispatchScenario({ scenario, skillRoot, traceMode: 'router' });

    expect(obs.mode).toBe('router');
    expect(obs.resourceContract).toBeTruthy();
    expect(obs.resourceContract.fullInventoryIntent).toBe(false);
    expect(obs.resourceContract.workflowModes).toEqual(['alpha-mode', 'beta-mode']);
    expect(obs.resourceContract.workflowModes.length).toBeLessThanOrEqual(MAX_WORKFLOW_MODES);

    // The third mode's pair (gamma-mode) is excluded by the cap even though it
    // was a valid, manifest-registered pair in the uncapped bundle.
    const modes = obs.resourceContract.pairs.map((p: { workflowMode: string }) => p.workflowMode);
    expect(new Set(modes)).toEqual(new Set(['alpha-mode', 'beta-mode']));
    expect(modes).not.toContain('gamma-mode');
  });

  it('bypasses the cap only via the explicit fullInventoryIntent flag, never inferred', () => {
    const skillRoot = makeManifestSkill();
    const scenario = { scenarioId: 'T-2', classKind: 'routing', prompt: 'please handle alpha beta gamma request', fullInventoryIntent: true };
    const obs = dispatchScenario({ scenario, skillRoot, traceMode: 'router' });

    expect(obs.resourceContract.fullInventoryIntent).toBe(true);
    expect(obs.resourceContract.workflowModes).toEqual(['alpha-mode', 'beta-mode', 'gamma-mode']);
    const modes = obs.resourceContract.pairs.map((p: { workflowMode: string }) => p.workflowMode);
    expect(new Set(modes)).toEqual(new Set(['alpha-mode', 'beta-mode', 'gamma-mode']));
  });

  it('cappedWorkflowModes is a pure slice honoring the explicit bypass flag', () => {
    expect(cappedWorkflowModes({ intents: ['a', 'b', 'c'], fullInventoryIntent: false })).toEqual(['a', 'b']);
    expect(cappedWorkflowModes({ intents: ['a', 'b', 'c'], fullInventoryIntent: true })).toEqual(['a', 'b', 'c']);
    expect(cappedWorkflowModes({ intents: [], fullInventoryIntent: false })).toEqual([]);
  });

  it('a skill with no leaf-manifest.json carries no resourceContract field in dispatch output either', () => {
    const skillRoot = makeNoManifestSkill();
    const scenario = { scenarioId: 'T-3', classKind: 'routing', prompt: 'anything about x' };
    const obs = dispatchScenario({ scenario, skillRoot, traceMode: 'router' });
    expect(Object.prototype.hasOwnProperty.call(obs, 'resourceContract')).toBe(false);
  });
});
