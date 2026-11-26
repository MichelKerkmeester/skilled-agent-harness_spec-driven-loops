// ───────────────────────────────────────────────────────────────────
// MODULE: Compiled Routing Hub Registry (advisor side)
// ───────────────────────────────────────────────────────────────────

// The advisor's compiled-routing hub sets come from the same registry file the
// runtime engine reads, so a consumer that appends a hub there needs no advisor
// edit. A missing or malformed registry fails closed: the advisor then attaches no
// compiled route for any hub. The invalid cases are the fixture the runtime reader's
// node:test suite uses, so the two readers refuse exactly the same files.

import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import * as flag from '../lib/compiled-routing-flag.js';

const here = dirname(fileURLToPath(import.meta.url));
const skilledRoot = resolve(here, '..', '..', '..', '..');
const registryFile = join(skilledRoot, 'bin', 'lib', 'compiled-routing', 'hub-registry.json');
const casesFile = join(skilledRoot, 'bin', 'tests', 'fixtures', 'hub-registry', 'registry-cases.json');

interface RegistryCase { name: string; text?: string; registry?: unknown; error: string }
const cases = JSON.parse(readFileSync(casesFile, 'utf8')) as {
  valid: { registry: unknown; eligible: string[]; defaultOn: string[] };
  invalid: RegistryCase[];
};

const temps: string[] = [];
afterEach(() => {
  while (temps.length > 0) rmSync(temps.pop() as string, { recursive: true, force: true });
});

// A throwaway repository holding only a registry at the path the advisor looks for,
// plus a nested start folder standing in for the advisor module's own location.
function repoWithRegistry(text: string | null): string {
  const root = mkdtempSync(join(tmpdir(), 'advisor-hub-registry-'));
  temps.push(root);
  const start = join(root, '.skilled', 'skills', 'system-skill-advisor', 'runtime', 'dist', 'runtime', 'lib');
  mkdirSync(start, { recursive: true });
  if (text !== null) {
    const file = join(root, '.skilled', 'bin', 'lib', 'compiled-routing', 'hub-registry.json');
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text);
  }
  return start;
}

describe('advisor compiled-routing hub sets come from the registry', () => {
  it('the exported sets equal the live registry, in registry order', () => {
    const registry = JSON.parse(readFileSync(registryFile, 'utf8')) as {
      hubs: Array<{ id: string; defaultOn: boolean }>;
    };
    expect([...flag.COMPILED_ROUTING_HUBS]).toEqual(registry.hubs.map((h) => h.id));
    expect([...flag.DEFAULT_ON_HUBS]).toEqual(registry.hubs.filter((h) => h.defaultOn).map((h) => h.id));
    expect(flag.COMPILED_ROUTING_HUBS.size).toBe(9);
  });

  it('a registry found by walking up yields its eligible and default-on sets', () => {
    const start = repoWithRegistry(JSON.stringify(cases.valid.registry, null, 2));
    const sets = flag.compiledRoutingHubSetsFrom(start);
    expect([...sets.eligible]).toEqual(cases.valid.eligible);
    expect([...sets.defaultOn]).toEqual(cases.valid.defaultOn);
  });

  it('an appended consumer hub is eligible with no advisor edit', () => {
    const live = JSON.parse(readFileSync(registryFile, 'utf8')) as { hubs: unknown[] };
    live.hubs.push({ id: 'sk-git', rolloutChild: '009-parent-hub-rollout/011-sk-git', defaultOn: true });
    const sets = flag.compiledRoutingHubSetsFrom(repoWithRegistry(`${JSON.stringify(live, null, 2)}\n`));
    expect(sets.eligible.has('sk-git')).toBe(true);
    expect(sets.defaultOn.has('sk-git')).toBe(true);
    expect(sets.eligible.size).toBe(10);
  });

  it('fails closed to empty sets when no registry is found', () => {
    const sets = flag.compiledRoutingHubSetsFrom(repoWithRegistry(null));
    expect(sets.eligible.size).toBe(0);
    expect(sets.defaultOn.size).toBe(0);
  });

  for (const testCase of cases.invalid) {
    it(`refuses ${testCase.name}, naming the file, and fails closed`, () => {
      const text = testCase.text ?? JSON.stringify(testCase.registry);
      expect(() => flag.parseCompiledRoutingHubRegistry(text, 'named.json')).toThrow(testCase.error);
      expect(() => flag.parseCompiledRoutingHubRegistry(text, 'named.json')).toThrow('named.json');
      const sets = flag.compiledRoutingHubSetsFrom(repoWithRegistry(text));
      expect(sets.eligible.size).toBe(0);
      expect(sets.defaultOn.size).toBe(0);
    });
  }
});
