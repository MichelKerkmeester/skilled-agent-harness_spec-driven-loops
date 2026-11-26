// ───────────────────────────────────────────────────────────────
// MODULE: Compiled-routing flag (tri-state) + hub eligibility set
// ───────────────────────────────────────────────────────────────
//
// Single source for the advisor recommend path's view of the compiled-routing
// runtime flag and the hubs it may enrich. Kept dependency-free so the runtime
// and the cross-site truth-table test read exactly the same semantics, and so a
// cross-check test can assert this hub set never diverges from the runtime
// engine-dispatch map.

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// The hub set is read from the compiled-routing hub registry, the same file the
// runtime engine and resolver read, so a hub added there needs no edit here. The
// rules below are the runtime reader's, held to the same shared fixture; change
// them together.
const HUB_REGISTRY_PATH = join('.skilled', 'bin', 'lib', 'compiled-routing', 'hub-registry.json');
const HUB_ID_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const ROLLOUT_PARENT = '009-parent-hub-rollout';

export interface CompiledRoutingHubEntry {
  readonly id: string;
  readonly rolloutChild: string;
  readonly defaultOn: boolean;
}

export interface CompiledRoutingHubSets {
  readonly eligible: ReadonlySet<string>;
  readonly defaultOn: ReadonlySet<string>;
}

function refuse(file: string, reason: string): Error {
  return new Error(`invalid compiled-route hub registry ${file}: ${reason}`);
}

// Parse and validate registry text; throws an error naming `file` on any defect.
export function parseCompiledRoutingHubRegistry(text: string, file: string): CompiledRoutingHubEntry[] {
  let registry: unknown;
  try {
    registry = JSON.parse(text);
  } catch {
    throw refuse(file, 'the file is not valid JSON');
  }
  if (!registry || typeof registry !== 'object' || Array.isArray(registry)) {
    throw refuse(file, 'the registry must be a JSON object');
  }
  const { schemaVersion, hubs } = registry as { schemaVersion?: unknown; hubs?: unknown };
  if (schemaVersion !== 'V1') throw refuse(file, 'schemaVersion must be "V1"');
  if (!Array.isArray(hubs)) throw refuse(file, 'hubs must be an array');
  const seen = new Set<string>();
  return hubs.map((entry: unknown, index: number) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      throw refuse(file, `hub entry ${index} must be an object`);
    }
    const { id, rolloutChild, defaultOn } = entry as Record<string, unknown>;
    if (typeof id !== 'string' || !HUB_ID_PATTERN.test(id)) {
      throw refuse(file, `hub id ${JSON.stringify(id)} is not canonical hyphen-case`);
    }
    if (seen.has(id)) throw refuse(file, `duplicate hub id "${id}"`);
    seen.add(id);
    if (typeof rolloutChild !== 'string'
      || !new RegExp(`^${ROLLOUT_PARENT}/\\d{3}-${id}$`).test(rolloutChild)) {
      throw refuse(file, `rolloutChild for "${id}" must be ${ROLLOUT_PARENT}/<NNN>-${id}`);
    }
    if (typeof defaultOn !== 'boolean') throw refuse(file, `defaultOn for "${id}" must be a boolean`);
    return { id, rolloutChild, defaultOn };
  });
}

// Walk up from `startDir` to the first folder holding the registry and return its
// eligible and default-on sets in registry order. The module runs from source and
// from dist, so it searches rather than assuming a depth. A registry that is
// missing or refused yields empty sets: the advisor then attaches no compiled
// route, which is the legacy shape.
export function compiledRoutingHubSetsFrom(startDir: string): CompiledRoutingHubSets {
  const empty: CompiledRoutingHubSets = { eligible: new Set(), defaultOn: new Set() };
  let dir = startDir;
  for (;;) {
    const file = join(dir, HUB_REGISTRY_PATH);
    if (existsSync(file)) {
      try {
        const hubs = parseCompiledRoutingHubRegistry(readFileSync(file, 'utf8'), file);
        return {
          eligible: new Set(hubs.map((hub) => hub.id)),
          defaultOn: new Set(hubs.filter((hub) => hub.defaultOn).map((hub) => hub.id)),
        };
      } catch {
        return empty;
      }
    }
    const parent = dirname(dir);
    if (parent === dir) return empty;
    dir = parent;
  }
}

const HUB_SETS = compiledRoutingHubSetsFrom(dirname(fileURLToPath(import.meta.url)));

// Hubs the advisor may attach a compiled route for: every registered hub.
// Eligibility to actually serve compiled is decided downstream by manifest
// freshness in the resolver; this is only the set the advisor will probe.
export const COMPILED_ROUTING_HUBS: ReadonlySet<string> = HUB_SETS.eligible;

// Per-hub default-on cohort: the registry entries marked defaultOn, the same
// cohort the runtime resolver reads. This enrichment shells out to the public
// front door (`.skilled/bin/compiled-route.cjs`), which delegates to that
// resolver, so surfacing it here attaches only additive metadata and never
// changes which skill is recommended. An unset flag attaches `compiledRoute` for
// these hubs; SPECKIT_COMPILED_ROUTING=0 remains the explicit fleet-wide
// kill-switch (no field attached, legacy shape).
export const DEFAULT_ON_HUBS: ReadonlySet<string> = HUB_SETS.defaultOn;

export type CompiledRoutingFlagMode = 'force-on' | 'force-legacy' | 'default' | 'invalid';

// Tri-state parse of SPECKIT_COMPILED_ROUTING:
//   'force-on'     '1'                    serve compiled where a hub is eligible
//   'force-legacy' '0' | 'false' | 'off'  explicit fleet-wide kill-switch
//   'default'      unset                  per-hub cohort decides (empty => legacy)
//   'invalid'      anything else          fail closed to legacy
export function parseCompiledRoutingFlagMode(raw: string | undefined): CompiledRoutingFlagMode {
  if (raw === undefined || raw === '') return 'default';
  if (raw === '1') return 'force-on';
  if (raw === '0' || raw === 'false' || raw === 'off') return 'force-legacy';
  return 'invalid';
}

// Whether the flag permits the advisor to attach a compiled route for this hub.
export function compiledRoutingEnabledForHub(
  hubId: string,
  raw: string | undefined = process.env.SPECKIT_COMPILED_ROUTING,
): boolean {
  const mode = parseCompiledRoutingFlagMode(raw);
  if (mode === 'force-on') return true;
  if (mode === 'default') return DEFAULT_ON_HUBS.has(hubId);
  return false; // force-legacy | invalid
}
