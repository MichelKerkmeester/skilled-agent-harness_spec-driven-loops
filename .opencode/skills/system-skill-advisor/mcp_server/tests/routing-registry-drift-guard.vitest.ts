// ───────────────────────────────────────────────────────────────────
// MODULE: Registry ↔ Advisor Routing Drift Guard
// ───────────────────────────────────────────────────────────────────
//
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { findAdvisorWorkspaceRoot } from '../lib/utils/workspace-root.js';
import {
  DEEP_MODE_BY_CANONICAL,
  DEEP_ROUTING_PROJECTION_HASH,
  SKILL_ALIAS_GROUPS,
} from '../lib/scorer/aliases.js';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = findAdvisorWorkspaceRoot(here);
const advisorScript = resolve(
  repoRoot,
  '.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py',
);
const registryPath = resolve(repoRoot, '.opencode/skills/deep-loop-workflows/mode-registry.json');

type RoutingClass = 'lexical' | 'alias-fold' | 'metadata' | 'command-bridge';

interface AdvisorRouting {
  readonly routingClass: RoutingClass;
  readonly legacyAdvisorId?: string;
  readonly advisorDefaultMode?: boolean;
  readonly legacyAliases?: readonly string[];
  readonly packetSkillName: string;
}
interface Mode {
  readonly workflowMode: string;
  readonly packet: string;
  readonly advisorRouting: AdvisorRouting;
}
interface ProjectionEntry {
  readonly legacyAdvisorId: string;
  readonly workflowMode: string;
  readonly routingClass: 'lexical' | 'alias-fold';
  readonly advisorDefaultMode: boolean;
  readonly legacyAliases: readonly string[];
}
interface RoutingDump {
  readonly DEEP_ROUTING_PROJECTION_HASH: string;
  readonly DEEP_ROUTING_SKILLS: string[];
  readonly DEEP_ROUTING_MODE_BY_KEY: Record<string, string>;
  readonly PY_ALIAS_GROUP_KEYS: string[];
}
const registry = JSON.parse(readFileSync(registryPath, 'utf8')) as { modes: readonly Mode[] };

function registryProjectionEntries(classes: readonly RoutingClass[]): ProjectionEntry[] {
  const entries: ProjectionEntry[] = [];
  for (const mode of registry.modes) {
    const ar = mode.advisorRouting;
    if ((ar.routingClass === 'lexical' || ar.routingClass === 'alias-fold') && classes.includes(ar.routingClass)) {
      entries.push({
        legacyAdvisorId: ar.legacyAdvisorId as string,
        workflowMode: mode.workflowMode,
        routingClass: ar.routingClass,
        advisorDefaultMode: ar.advisorDefaultMode === true,
        legacyAliases: [...(ar.legacyAliases ?? [])],
      });
    }
  }
  return entries.sort((left, right) => left.legacyAdvisorId.localeCompare(right.legacyAdvisorId));
}

function projectionHash(entries: readonly ProjectionEntry[]): string {
  const canonical = JSON.stringify({
    skill: 'deep-loop-workflows',
    entries: entries.map((entry) => ({
      legacyAdvisorId: entry.legacyAdvisorId,
      workflowMode: entry.workflowMode,
      routingClass: entry.routingClass,
      advisorDefaultMode: entry.advisorDefaultMode,
      legacyAliases: [...entry.legacyAliases],
    })),
  });
  return `sha256:${createHash('sha256').update(canonical).digest('hex')}`;
}

function generatedTypeScriptProjectionEntries(): ProjectionEntry[] {
  const registryById = new Map(
    registryProjectionEntries(['lexical', 'alias-fold'])
      .map((entry) => [entry.legacyAdvisorId, entry] as const),
  );
  return Object.entries(DEEP_MODE_BY_CANONICAL)
    .map(([legacyAdvisorId, workflowMode]) => {
      const registryEntry = registryById.get(legacyAdvisorId);
      expect(registryEntry, `registry entry missing for ${legacyAdvisorId}`).toBeDefined();
      return {
        legacyAdvisorId,
        workflowMode,
        routingClass: registryEntry!.routingClass,
        advisorDefaultMode: registryEntry!.advisorDefaultMode,
        legacyAliases: [...(SKILL_ALIAS_GROUPS[legacyAdvisorId] ?? [])],
      };
    })
    .sort((left, right) => left.legacyAdvisorId.localeCompare(right.legacyAdvisorId));
}

function generatedPythonProjectionEntries(dump: RoutingDump): ProjectionEntry[] {
  const registryById = new Map(
    registryProjectionEntries(['lexical'])
      .map((entry) => [entry.legacyAdvisorId, entry] as const),
  );
  return Object.entries(dump.DEEP_ROUTING_MODE_BY_KEY)
    .map(([legacyAdvisorId, workflowMode]) => {
      const registryEntry = registryById.get(legacyAdvisorId);
      expect(registryEntry, `registry lexical entry missing for ${legacyAdvisorId}`).toBeDefined();
      return {
        legacyAdvisorId,
        workflowMode,
        routingClass: registryEntry!.routingClass,
        advisorDefaultMode: registryEntry!.advisorDefaultMode,
        legacyAliases: [...registryEntry!.legacyAliases],
      };
    })
    .sort((left, right) => left.legacyAdvisorId.localeCompare(right.legacyAdvisorId));
}

function dumpPythonMaps(): RoutingDump {
  const stdout = execFileSync('python3', [advisorScript, '--dump-routing-maps'], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(stdout) as RoutingDump;
}

function checkProjectionGenerator(): { readonly status: string; readonly projectionHash: string; readonly changed: readonly string[] } {
  const stdout = execFileSync('python3', [advisorScript, '--check-routing-projection'], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(stdout) as { readonly status: string; readonly projectionHash: string; readonly changed: readonly string[] };
}

describe('routing-registry-drift-guard', () => {
  it('every mode carries an advisorRouting block with a valid routingClass + packetSkillName', () => {
    const valid = new Set(['lexical', 'alias-fold', 'metadata', 'command-bridge']);
    for (const mode of registry.modes) {
      expect(mode.advisorRouting, `mode ${mode.workflowMode} missing advisorRouting`).toBeDefined();
      expect(valid.has(mode.advisorRouting.routingClass), `mode ${mode.workflowMode} bad routingClass`).toBe(true);
      expect(mode.advisorRouting.packetSkillName, `mode ${mode.workflowMode} missing packetSkillName`).toBeTruthy();
      expect(mode.advisorRouting.packetSkillName, `mode ${mode.workflowMode} packetSkillName drift`).toBe(mode.packet);
      // lexical + alias-fold modes must name a legacyAdvisorId (the projection-map key)
      if (mode.advisorRouting.routingClass === 'lexical' || mode.advisorRouting.routingClass === 'alias-fold') {
        expect(mode.advisorRouting.legacyAdvisorId, `mode ${mode.workflowMode} missing legacyAdvisorId`).toBeTruthy();
      }
    }
  });

  it('generated projection hash matches the registry projection', () => {
    const registryHash = projectionHash(registryProjectionEntries(['lexical', 'alias-fold']));
    const py = dumpPythonMaps();

    expect(DEEP_ROUTING_PROJECTION_HASH).toBe(registryHash);
    expect(py.DEEP_ROUTING_PROJECTION_HASH).toBe(registryHash);
  });

  it('projection generator reports fresh generated blocks', () => {
    const registryHash = projectionHash(registryProjectionEntries(['lexical', 'alias-fold']));
    const generator = checkProjectionGenerator();

    expect(generator.status).toBe('fresh');
    expect(generator.changed).toEqual([]);
    expect(generator.projectionHash).toBe(registryHash);
  });

  it('TypeScript generated projection stays hash-fresh', () => {
    const registryHash = projectionHash(registryProjectionEntries(['lexical', 'alias-fold']));
    const generatedHash = projectionHash(generatedTypeScriptProjectionEntries());

    expect(generatedHash).toBe(registryHash);
  });

  it('Python lexical projection stays hash-fresh', () => {
    const py = dumpPythonMaps();
    const registryHash = projectionHash(registryProjectionEntries(['lexical']));
    const generatedHash = projectionHash(generatedPythonProjectionEntries(py));

    expect(generatedHash).toBe(registryHash);
    expect(new Set(py.DEEP_ROUTING_SKILLS)).toEqual(new Set(Object.keys(py.DEEP_ROUTING_MODE_BY_KEY)));
  });

  it('exactly one mode is flagged advisorDefaultMode, and it is agent-improvement', () => {
    const defaults = registry.modes.filter((m) => m.advisorRouting.advisorDefaultMode === true);
    expect(defaults.map((m) => m.workflowMode)).toEqual(['agent-improvement']);
  });

  it('legacyAdvisorId keys exist on both TS and Python alias surfaces', () => {
    const pyKeys = new Set(dumpPythonMaps().PY_ALIAS_GROUP_KEYS);
    for (const mode of registry.modes) {
      const ar = mode.advisorRouting;
      if (ar.routingClass === 'lexical' || ar.routingClass === 'alias-fold') {
        const id = ar.legacyAdvisorId as string;
        expect(SKILL_ALIAS_GROUPS[id], `no TS SKILL_ALIAS_GROUPS entry for ${id}`).toBeDefined();
        expect(pyKeys.has(id), `legacyAdvisorId ${id} missing from Python SKILL_ALIAS_GROUPS`).toBe(true);
      }
    }
  });
});
