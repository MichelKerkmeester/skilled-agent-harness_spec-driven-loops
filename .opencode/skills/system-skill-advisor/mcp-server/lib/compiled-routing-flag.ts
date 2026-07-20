// ───────────────────────────────────────────────────────────────
// MODULE: Compiled-routing flag (tri-state) + hub eligibility set
// ───────────────────────────────────────────────────────────────
//
// Single source for the advisor recommend path's view of the compiled-routing
// runtime flag and the hubs it may enrich. Kept dependency-free so the runtime
// and the cross-site truth-table test read exactly the same semantics, and so a
// cross-check test can assert this hub set never diverges from the runtime
// engine-dispatch map.

// Hubs the advisor may attach a compiled route for. Eligibility to actually
// serve compiled is decided downstream by manifest freshness in the resolver;
// this is only the set the advisor will probe.
export const COMPILED_ROUTING_HUBS: ReadonlySet<string> = new Set([
  'sk-code',
  'mcp-tooling',
  'system-deep-loop',
  'cli-external-orchestration',
  'sk-prompt',
  'sk-design',
  'sk-doc',
]);

// Per-hub default-on cohort. Ships empty and stays empty until the staged
// cutover adds hubs one at a time, so an unset flag resolves to legacy for every
// hub — byte-identical to the bi-state default this replaces.
export const DEFAULT_ON_HUBS: ReadonlySet<string> = new Set<string>();

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
