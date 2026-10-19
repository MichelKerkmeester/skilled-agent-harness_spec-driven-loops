// ───────────────────────────────────────────────────────────────────
// MODULE: Doctor Command Bridges
// ───────────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';
import { parse as parseYaml } from 'yaml';

import { GENERATED_COMMAND_BRIDGES } from '../lib/scorer/projection.js';
import { findAdvisorWorkspaceRoot } from '../lib/utils/workspace-root.js';

const REPO_ROOT = findAdvisorWorkspaceRoot(import.meta.dirname);
const DOCTOR_ROUTES_PATH = join(REPO_ROOT, '.skilled', 'commands', 'doctor', '_routes.yaml');
const RENDER_PATH = join(
  REPO_ROOT,
  '.skilled',
  'skills',
  'system-skill-advisor',
  'runtime',
  'lib',
  'render.ts',
);
const GENERATED_PATH = join(
  REPO_ROOT,
  '.skilled',
  'skills',
  'system-skill-advisor',
  'runtime',
  'scripts',
  'command-bridges',
  'command-bridges.generated.json',
);
const DOCTOR_PREFIX = 'command-doctor-';
const DOCTOR_MCP_COMMAND = '/doctor:mcp';

interface DoctorBridgeExpectation {
  readonly runnable: string;
  readonly phrases: readonly string[];
  readonly leadPhrases?: readonly string[];
}

interface DoctorManifest {
  readonly routes: readonly {
    readonly command: string;
    readonly target: string;
    readonly trigger_phrases: readonly string[];
    readonly lead_phrases?: readonly string[];
  }[];
  readonly standalone?: readonly {
    readonly command?: string;
    readonly runnable?: string;
    readonly trigger_phrases?: readonly string[];
    readonly lead_phrases?: readonly string[];
  }[];
  readonly mcp_subroutes?: readonly {
    readonly sub_action: string;
    readonly trigger_phrases: readonly string[];
    readonly lead_phrases?: readonly string[];
  }[];
}

interface GeneratedDoctorBridge {
  readonly id: string;
  readonly runtime: {
    readonly python: {
      readonly enabled: boolean;
      readonly slashMarkers?: readonly string[];
    };
  };
}

function doctorName(command: string): string {
  const match = /^\/doctor:([a-z0-9-]+)$/.exec(command);
  if (!match) throw new Error(`Unrecognized doctor command: ${command}`);
  return match[1] as string;
}

// Expectations are recomputed from the route manifest rather than read back from
// the generated artifacts, so a generator defect cannot hide behind its own output.
function manifestDoctorBridges(): Map<string, DoctorBridgeExpectation> {
  const manifest = parseYaml(readFileSync(DOCTOR_ROUTES_PATH, 'utf8')) as DoctorManifest;
  const routeCounts = new Map<string, number>();
  for (const route of manifest.routes) {
    const name = doctorName(route.command);
    routeCounts.set(name, (routeCounts.get(name) ?? 0) + 1);
  }

  const bridges = new Map<string, DoctorBridgeExpectation>();
  for (const route of manifest.routes) {
    const name = doctorName(route.command);
    const multiTarget = (routeCounts.get(name) ?? 0) > 1;
    bridges.set(multiTarget ? `${DOCTOR_PREFIX}${name}-${route.target}` : `${DOCTOR_PREFIX}${name}`, {
      runnable: multiTarget ? `${route.command} ${route.target}` : route.command,
      phrases: route.trigger_phrases,
      leadPhrases: route.lead_phrases?.length ? route.lead_phrases : undefined,
    });
  }

  for (const item of manifest.standalone ?? []) {
    if (typeof item.command !== 'string') continue;
    const name = doctorName(item.command);
    const runnable = typeof item.runnable === 'string' && item.runnable ? item.runnable : item.command;
    bridges.set(`${DOCTOR_PREFIX}${name}`, {
      runnable,
      phrases: Array.isArray(item.trigger_phrases) ? item.trigger_phrases : [],
      leadPhrases: item.lead_phrases?.length ? item.lead_phrases : undefined,
    });
  }

  for (const item of manifest.mcp_subroutes ?? []) {
    const id = `${DOCTOR_PREFIX}${doctorName(DOCTOR_MCP_COMMAND)}-${item.sub_action}`;
    bridges.set(id, {
      runnable: `${DOCTOR_MCP_COMMAND} ${item.sub_action}`,
      phrases: item.trigger_phrases,
      leadPhrases: item.lead_phrases?.length ? item.lead_phrases : undefined,
    });
  }

  return bridges;
}

function renderedDoctorStrings(): Map<string, string> {
  const render = readFileSync(RENDER_PATH, 'utf8');
  const startMarker = '// BEGIN GENERATED DOCTOR COMMANDS';
  const endMarker = '// END GENERATED DOCTOR COMMANDS';
  const start = render.indexOf(startMarker);
  const end = render.indexOf(endMarker);
  if (start < 0 || end < start) {
    throw new Error(`Missing generated doctor markers in ${RENDER_PATH}`);
  }

  const strings = new Map<string, string>();
  for (const line of render.slice(start + startMarker.length, end).split('\n')) {
    const match = /^\s*'([^']+)': '([^']+)',$/.exec(line);
    if (match) strings.set(match[1] as string, match[2] as string);
  }
  return strings;
}

function sortedPairs(entries: Iterable<readonly [string, string]>): [string, string][] {
  return [...entries]
    .map(([key, value]) => [key, value] as [string, string])
    .sort(([left], [right]) => left.localeCompare(right));
}

describe('doctor command bridges', () => {
  it('the renderer lookup holds the runnable string of every doctor bridge in the manifest', () => {
    const rendered = renderedDoctorStrings();
    const expected = sortedPairs(
      [...manifestDoctorBridges()].map(([id, { runnable }]) => [id, runnable] as const),
    );

    expect(rendered.size).toBeGreaterThan(10);
    expect(sortedPairs(rendered)).toEqual(expected);
  });

  it('every active TypeScript doctor bridge carries its manifest phrases and runnable string', () => {
    const manifest = manifestDoctorBridges();
    const failures: string[] = [];

    for (const entry of GENERATED_COMMAND_BRIDGES) {
      if (entry.routingEnabled === false || !entry.id.startsWith(DOCTOR_PREFIX)) continue;
      const expected = manifest.get(entry.id);
      if (!expected) {
        failures.push(`${entry.id}: no bridge in the doctor route manifest`);
        continue;
      }

      if (entry.name !== expected.runnable) {
        failures.push(`${entry.id}: name ${entry.name} !== runnable ${expected.runnable}`);
      }

      const keywords = [...entry.keywords].sort();
      const phrases = [...expected.phrases].sort();
      if (JSON.stringify(keywords) !== JSON.stringify(phrases)) {
        failures.push(
          `${entry.id}: keywords ${JSON.stringify(keywords)} !== phrases ${JSON.stringify(phrases)}`,
        );
      }

      if (JSON.stringify(entry.intentSignals) !== JSON.stringify([expected.runnable])) {
        failures.push(
          `${entry.id}: intentSignals ${JSON.stringify(entry.intentSignals)} !== ${JSON.stringify([expected.runnable])}`,
        );
      }
    }

    expect(failures).toEqual([]);
  });

  it('every active TypeScript doctor bridge carries its manifest lead phrases', () => {
    const manifest = manifestDoctorBridges();
    const failures: string[] = [];

    for (const entry of GENERATED_COMMAND_BRIDGES) {
      if (entry.routingEnabled === false || !entry.id.startsWith(DOCTOR_PREFIX)) continue;
      const expected = manifest.get(entry.id);
      if (!expected) {
        failures.push(`${entry.id}: no bridge in the doctor route manifest`);
        continue;
      }

      if (JSON.stringify(entry.leadPhrases) !== JSON.stringify(expected.leadPhrases)) {
        failures.push(
          `${entry.id}: leadPhrases ${JSON.stringify(entry.leadPhrases)} !== ${JSON.stringify(expected.leadPhrases)}`,
        );
      }
    }

    expect(failures).toEqual([]);
    const envBridge = GENERATED_COMMAND_BRIDGES.find((entry) => entry.id === 'command-doctor-env');
    expect(envBridge?.leadPhrases).toEqual(['check my environment variables']);
  });

  it('every active Python doctor bridge matches only on its runnable slash string', () => {
    const generated = JSON.parse(readFileSync(GENERATED_PATH, 'utf8')) as {
      readonly entries: readonly GeneratedDoctorBridge[];
    };
    const manifest = manifestDoctorBridges();
    const failures: string[] = [];

    for (const entry of generated.entries) {
      if (!entry.id.startsWith(DOCTOR_PREFIX) || entry.runtime.python.enabled !== true) continue;
      const expected = manifest.get(entry.id);
      if (!expected) {
        failures.push(`${entry.id}: no bridge in the doctor route manifest`);
        continue;
      }

      const markers = entry.runtime.python.slashMarkers ?? [];
      if (JSON.stringify(markers) !== JSON.stringify([expected.runnable])) {
        failures.push(
          `${entry.id}: slashMarkers ${JSON.stringify(markers)} !== ${JSON.stringify([expected.runnable])}`,
        );
      }
      for (const marker of markers) {
        if (!marker.startsWith('/doctor:')) {
          failures.push(`${entry.id}: slash marker ${marker} does not start with /doctor:`);
        }
      }
    }

    expect(failures).toEqual([]);
  });
});
