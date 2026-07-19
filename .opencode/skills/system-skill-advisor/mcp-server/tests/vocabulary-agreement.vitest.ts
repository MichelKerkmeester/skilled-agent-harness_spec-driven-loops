// ───────────────────────────────────────────────────────────────
// MODULE: Cross-language vocabulary agreement battery
// ───────────────────────────────────────────────────────────────
// The skill-graph vocabularies (skill family, edge type, advisor routing class, packet
// kind) are declared once conceptually but hand-transcribed into many consumer dialects —
// TS unions/consts, SQLite schema, Python sets, JSON-schema enums, a CJS checker, doctrine
// templates. A type-system-invisible site (the family SQLite CHECK) drifting is exactly what
// wedged the sk-hub scan. This battery reads every dialect from source and asserts the sets
// agree, so no future edit can drift a mirror silently. Adding a NEW declaration site means
// enrolling it here (one line in the site table) — not discovering it after an incident.
//
// Two sites are DELIBERATE read-only subsets in the operator-gated scorer track; they are
// asserted as SUBSETS of the canonical set, never equal, and never edited by this test.

import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

function repoRoot(): string {
  // Walk up to the git root — the only unambiguous repo-root marker. (A nested .opencode
  // can exist below the root, so .opencode is not a safe sentinel.)
  let dir = process.cwd();
  while (dir !== dirname(dir)) {
    if (existsSync(join(dir, '.git'))) return dir;
    dir = dirname(dir);
  }
  throw new Error('repo root not found from ' + process.cwd());
}
const R = repoRoot();
const read = (rel: string): string => readFileSync(join(R, rel), 'utf8');

// The region of `src` between `anchor` and the next occurrence of `close`.
function sliceAfter(src: string, anchor: string, close: string): string {
  const i = src.indexOf(anchor);
  if (i < 0) throw new Error(`vocab site anchor not found (did the declaration move?): ${anchor}`);
  const rest = src.slice(i + anchor.length);
  const j = rest.indexOf(close);
  return rest.slice(0, j < 0 ? 400 : j);
}
// Quoted lowercase tokens in a region (arrays, sets, tuples, unions).
function quoted(region: string): Set<string> {
  return new Set([...region.matchAll(/['"]([a-z][a-z0-9_-]*)['"]/g)].map((m) => m[1]));
}
// `identifier:` keys in a region (object-literal keys, e.g. WEIGHT_BANDS / EDGE_MULTIPLIER).
function identKeys(region: string): Set<string> {
  return new Set([...region.matchAll(/(?:^|[\s{,])([a-z][a-z0-9_]*)\s*:/g)].map((m) => m[1]));
}
// Pipe-separated placeholder inside a `"[a|b|c]"` doctrine string.
function pipePlaceholder(src: string, anchor: string): Set<string> {
  const region = sliceAfter(src, anchor, ']');
  return new Set(region.replace(/^\s*"?\[/, '').split('|').map((t) => t.trim()).filter(Boolean));
}

const SGDB = '.opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts';
const COMPILER = '.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py';
const TOOLS = '.opencode/skills/system-skill-advisor/mcp-server/tools/skill-graph-tools.ts';
const CLI_MANIFEST = '.opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli-manifest.ts';
const QUERY = '.opencode/skills/system-skill-advisor/mcp-server/handlers/skill-graph/query.ts';
const CHECKER = '.opencode/commands/doctor/scripts/parent-skill-check.cjs';
const TEMPLATE = '.opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-graph-metadata-template.json';
const DRIFT_GUARD = '.opencode/skills/system-skill-advisor/mcp-server/tests/routing-registry-drift-guard.vitest.ts';
// gated scorer-track read-only subsets — flagged, never asserted-equal
const ADVISOR_PY = '.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py';
const GRAPH_CAUSAL = '.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/graph-causal.ts';

const CANON_FAMILY = new Set(['cli', 'mcp', 'sk-code', 'sk-hub', 'deep-loop', 'sk-util', 'system']);
const CANON_EDGE = new Set(['depends_on', 'enhances', 'siblings', 'conflicts_with', 'prerequisite_for']);
const CANON_ROUTING = new Set(['lexical', 'alias-fold', 'metadata', 'command-bridge']);
const CANON_PACKETKIND = new Set(['workflow', 'surface', 'transport']);

// Each equality site: [label, extracted set]. If any drifts, the label names the mirror.
function familySites(): Array<[string, Set<string>]> {
  const sg = read(SGDB);
  return [
    ['TS SkillFamily type', quoted(sliceAfter(sg, 'export type SkillFamily =', ';'))],
    ['TS ALLOWED_FAMILIES const', quoted(sliceAfter(sg, 'ALLOWED_FAMILIES: readonly SkillFamily[] =', ']'))],
    ['Python ALLOWED_FAMILIES', quoted(sliceAfter(read(COMPILER), 'ALLOWED_FAMILIES =', '}'))],
    ['MCP tool family enum', quoted(sliceAfter(read(TOOLS), "family: { type: 'string', enum:", ']'))],
    ['CLI manifest family enum', quoted(sliceAfter(read(CLI_MANIFEST), "family: { type: 'string', enum:", ']'))],
    ['CJS checker ALLOWED_FAMILIES', quoted(sliceAfter(read(CHECKER), 'const ALLOWED_FAMILIES =', ']'))],
    ['query.ts SKILL_FAMILIES', quoted(sliceAfter(read(QUERY), 'new Set<SkillFamily>(', ']'))],
    ['doctrine graph-metadata template', pipePlaceholder(read(TEMPLATE), '"family":')],
  ];
}
function edgeSites(): Array<[string, Set<string>]> {
  const sg = read(SGDB);
  return [
    ['TS SkillEdgeType type', quoted(sliceAfter(sg, 'export type SkillEdgeType =', ';'))],
    ['TS EDGE_TYPES const', quoted(sliceAfter(sg, 'EDGE_TYPES: readonly SkillEdgeType[] =', ']'))],
    ['TS WEIGHT_BANDS keys', identKeys(sliceAfter(sg, 'WEIGHT_BANDS: Readonly<Record<SkillEdgeType', '}'))],
    ['Python EDGE_TYPES', quoted(sliceAfter(read(COMPILER), 'EDGE_TYPES =', '}'))],
  ];
}
function routingSites(): Array<[string, Set<string>]> {
  return [
    ['CJS checker VALID_ROUTING_CLASSES', quoted(sliceAfter(read(CHECKER), 'const VALID_ROUTING_CLASSES =', ']'))],
    ['drift-guard RoutingClass type', quoted(sliceAfter(read(DRIFT_GUARD), 'type RoutingClass =', ';'))],
  ];
}

function expectSet(actual: Set<string>, canon: Set<string>): void {
  expect([...actual].sort()).toEqual([...canon].sort());
}
function isSubset(sub: Set<string>, sup: Set<string>): boolean {
  return [...sub].every((x) => sup.has(x));
}

describe('cross-language vocabulary agreement', () => {
  it('every skill-family dialect agrees (8 sites: TS x2, Python, MCP+CLI enums, CJS, query, doctrine template)', () => {
    for (const [label, set] of familySites()) {
      expect(set.size, `${label} extracted an empty set`).toBeGreaterThan(0);
      expectSet(set, CANON_FAMILY);
    }
  });

  it('every edge-type dialect agrees (TS type + const + WEIGHT_BANDS keys + Python)', () => {
    for (const [label, set] of edgeSites()) {
      expect(set.size, `${label} extracted an empty set`).toBeGreaterThan(0);
      expectSet(set, CANON_EDGE);
    }
  });

  it('every routing-class dialect agrees (checker + drift-guard)', () => {
    for (const [, set] of routingSites()) expectSet(set, CANON_ROUTING);
  });

  it('the packetKind enum the checker enforces matches the canonical three', () => {
    // The checker gates packetKind inline (rule 3d): kind !== 'workflow' && !== 'surface' && !== 'transport'.
    const region = sliceAfter(read(CHECKER), "kind !== 'workflow'", ')');
    const kinds = new Set([...(`'workflow'` + region).matchAll(/'([a-z]+)'/g)].map((m) => m[1]));
    expectSet(kinds, CANON_PACKETKIND);
  });

  it('the two gated scorer edge-type sites are SUBSETS of canon (flagged, never asserted equal)', () => {
    const adjacency = quoted(sliceAfter(read(ADVISOR_PY), 'GRAPH_ADJACENCY_EDGE_TYPES =', ')'));
    const mult = identKeys(sliceAfter(read(GRAPH_CAUSAL), 'EDGE_MULTIPLIER', '}'));
    expect(adjacency.size).toBeGreaterThan(0);
    expect(mult.size).toBeGreaterThan(0);
    expect(isSubset(adjacency, CANON_EDGE), 'GRAPH_ADJACENCY_EDGE_TYPES ⊆ edge types').toBe(true);
    expect(isSubset(mult, CANON_EDGE), 'EDGE_MULTIPLIER keys ⊆ edge types').toBe(true);
    // These are deliberately NOT full sets — assert we did not accidentally require equality.
    expect(adjacency.size).toBeLessThan(CANON_EDGE.size); // adjacency excludes conflicts_with by design
  });
});
