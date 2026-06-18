// ───────────────────────────────────────────────────────────────────
// MODULE: Registry ↔ Advisor Routing Drift Guard
// ───────────────────────────────────────────────────────────────────
//
// deep-loop-workflows/mode-registry.json is the declarative source of truth
// for how each mode routes. The advisor keeps its hardcoded projection maps
// (Python DEEP_ROUTING_MODE_BY_KEY, TypeScript DEEP_MODE_BY_CANONICAL) for
// speed and to avoid reading a foreign skill's file on the hot path — so this
// test asserts those maps stay equal to the registry projection. If the two
// drift (a mode added to one side only, an alias set changed), this fails.
//
// Projection rule:
//   Python map  = { legacyAdvisorId -> workflowMode } for routingClass 'lexical'
//   TypeScript  = same, plus routingClass 'alias-fold' (the deep-improvement fold)

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { findAdvisorWorkspaceRoot } from '../lib/utils/workspace-root.js';
import { DEEP_MODE_BY_CANONICAL, SKILL_ALIAS_GROUPS } from '../lib/scorer/aliases.js';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = findAdvisorWorkspaceRoot(here);
const advisorScript = resolve(
  repoRoot,
  '.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py',
);
const registryPath = resolve(repoRoot, '.opencode/skills/deep-loop-workflows/mode-registry.json');

interface AdvisorRouting {
  readonly routingClass: 'lexical' | 'alias-fold' | 'metadata' | 'command-bridge';
  readonly legacyAdvisorId?: string;
  readonly advisorDefaultMode?: boolean;
  readonly legacyAliases?: readonly string[];
  readonly packetSkillName: string;
}
interface Mode {
  readonly workflowMode: string;
  readonly advisorRouting: AdvisorRouting;
}
const registry = JSON.parse(readFileSync(registryPath, 'utf8')) as { modes: readonly Mode[] };

function registryProjection(classes: readonly string[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const mode of registry.modes) {
    const ar = mode.advisorRouting;
    if (classes.includes(ar.routingClass)) {
      map[ar.legacyAdvisorId as string] = mode.workflowMode;
    }
  }
  return map;
}

function dumpPythonMaps(): { DEEP_ROUTING_SKILLS: string[]; DEEP_ROUTING_MODE_BY_KEY: Record<string, string>; PY_ALIAS_GROUP_KEYS: string[] } {
  const stdout = execFileSync('python3', [advisorScript, '--dump-routing-maps'], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(stdout);
}

describe('routing-registry-drift-guard', () => {
  it('every mode carries an advisorRouting block with a valid routingClass + packetSkillName', () => {
    const valid = new Set(['lexical', 'alias-fold', 'metadata', 'command-bridge']);
    for (const mode of registry.modes) {
      expect(mode.advisorRouting, `mode ${mode.workflowMode} missing advisorRouting`).toBeDefined();
      expect(valid.has(mode.advisorRouting.routingClass), `mode ${mode.workflowMode} bad routingClass`).toBe(true);
      expect(mode.advisorRouting.packetSkillName, `mode ${mode.workflowMode} missing packetSkillName`).toBeTruthy();
      // lexical + alias-fold modes must name a legacyAdvisorId (the projection-map key)
      if (mode.advisorRouting.routingClass === 'lexical' || mode.advisorRouting.routingClass === 'alias-fold') {
        expect(mode.advisorRouting.legacyAdvisorId, `mode ${mode.workflowMode} missing legacyAdvisorId`).toBeTruthy();
      }
    }
  });

  it('Python DEEP_ROUTING_MODE_BY_KEY equals the registry lexical projection', () => {
    const py = dumpPythonMaps();
    expect(py.DEEP_ROUTING_MODE_BY_KEY).toEqual(registryProjection(['lexical']));
    expect(new Set(py.DEEP_ROUTING_SKILLS)).toEqual(new Set(Object.keys(registryProjection(['lexical']))));
  });

  it('TypeScript DEEP_MODE_BY_CANONICAL equals the registry lexical+alias-fold projection', () => {
    expect({ ...DEEP_MODE_BY_CANONICAL }).toEqual(registryProjection(['lexical', 'alias-fold']));
  });

  it('exactly one mode is flagged advisorDefaultMode, and it is agent-improvement', () => {
    const defaults = registry.modes.filter((m) => m.advisorRouting.advisorDefaultMode === true);
    expect(defaults.map((m) => m.workflowMode)).toEqual(['agent-improvement']);
  });

  it('registry legacyAliases match the TS scorer aliases; legacyAdvisorId keys exist on both TS and Python', () => {
    const pyKeys = new Set(dumpPythonMaps().PY_ALIAS_GROUP_KEYS);
    for (const mode of registry.modes) {
      const ar = mode.advisorRouting;
      if (ar.routingClass === 'lexical' || ar.routingClass === 'alias-fold') {
        const id = ar.legacyAdvisorId as string;
        // legacyAliases mirrors the TypeScript scorer set (the merged-identity layer keys on it).
        const expected = SKILL_ALIAS_GROUPS[id];
        expect(expected, `no TS SKILL_ALIAS_GROUPS entry for ${id}`).toBeDefined();
        expect(new Set(ar.legacyAliases ?? [])).toEqual(new Set(expected));
        // The Python deep-router has its own alias values by design; cross-check only that the key exists.
        expect(pyKeys.has(id), `legacyAdvisorId ${id} missing from Python SKILL_ALIAS_GROUPS`).toBe(true);
      }
    }
  });
});
