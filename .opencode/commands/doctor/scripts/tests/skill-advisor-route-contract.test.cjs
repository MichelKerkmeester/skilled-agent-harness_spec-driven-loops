#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ skill-advisor-route-contract — pin the required tool SUBSET against the  ║
// ║ live advisor registry (existence only, never full-registry equality)     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * research.md Theme D4/D5 (035-create-doctor-skill-advisor-alignment/001-research):
 * the doctor route must declare the high-value advisor tools it actually
 * calls, and every declared name must exist in the live tool registry — but
 * the registry may carry tools the route legitimately never needs (e.g.
 * skill_graph_propagate_enhances). A route-contract test therefore asserts
 * declared ⊆ live, never declared == live (ruled-out #11 in research.md § 5).
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND PATHS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { parse: parseYaml } = require('yaml');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const ROUTES_PATH = path.join(REPO_ROOT, '.opencode', 'commands', 'doctor', '_routes.yaml');
const ROUTER_MD_PATH = path.join(REPO_ROOT, '.opencode', 'commands', 'doctor', 'speckit.md');
const SKILL_GRAPH_TOOLS_PATH = path.join(REPO_ROOT, '.opencode', 'skills', 'system-skill-advisor', 'mcp-server', 'tools', 'skill-graph-tools.ts');
const ADVISOR_SCHEMAS_PATH = path.join(REPO_ROOT, '.opencode', 'skills', 'system-skill-advisor', 'mcp-server', 'schemas', 'advisor-tool-schemas.ts');

// Tools doctor's skill-advisor route must declare — the researched high-value
// subset (Theme D4), not the full nine-tool registry.
const REQUIRED_ADVISOR_TOOLS = [
  'advisor_recommend',
  'advisor_status',
  'advisor_validate',
  'advisor_rebuild',
  'skill_graph_scan',
  'skill_graph_validate',
  'skill_graph_query',
  'skill_graph_status',
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function read(absolutePath) {
  return fs.readFileSync(absolutePath, 'utf8');
}

// Statically extracts registered tool names from the two TS source files that
// define the live advisor tool registry, without spawning the MCP daemon —
// keeps this test runnable when the advisor IPC socket is cold (a
// reproducible state per research.md Theme I / "UNAVAILABLE (retryable)").
function liveAdvisorToolNames() {
  const skillGraphSource = read(SKILL_GRAPH_TOOLS_PATH);
  const skillGraphNames = [...skillGraphSource.matchAll(/name:\s*'([a-z_]+)'/gu)].map((match) => match[1]);

  const schemasSource = read(ADVISOR_SCHEMAS_PATH);
  const advisorToolSchemasBlock = /AdvisorToolInputSchemas\s*=\s*\{([\s\S]*?)\}\s*as const/u.exec(schemasSource);
  assert.ok(advisorToolSchemasBlock, 'AdvisorToolInputSchemas block must be present in advisor-tool-schemas.ts');
  const advisorNames = [...advisorToolSchemasBlock[1].matchAll(/^\s*([a-z_]+):/gmu)].map((match) => match[1]);

  return new Set([...skillGraphNames, ...advisorNames]);
}

function skillAdvisorRouteMcpTools() {
  const routes = parseYaml(read(ROUTES_PATH));
  const route = routes.routes.find((entry) => entry.target === 'skill-advisor');
  assert.ok(route, '_routes.yaml must declare a skill-advisor route');
  assert.ok(Array.isArray(route.mcp_tools), 'skill-advisor route must declare mcp_tools as an array');
  return route.mcp_tools;
}

function bareName(qualifiedToolName) {
  // mcp__mk_skill_advisor__skill_graph_validate -> skill_graph_validate
  const parts = qualifiedToolName.split('__');
  return parts[parts.length - 1];
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('every advisor tool declared on the skill-advisor route exists in the live registry (subset, not equality)', () => {
  const liveNames = liveAdvisorToolNames();
  assert.ok(liveNames.size >= 8, `expected at least 8 live advisor tools, found ${liveNames.size}: ${[...liveNames].join(', ')}`);

  const declaredMcpTools = skillAdvisorRouteMcpTools().filter((name) => name.startsWith('mcp__mk_skill_advisor__'));
  assert.ok(declaredMcpTools.length > 0, 'skill-advisor route must declare at least one mk_skill_advisor tool');

  for (const qualifiedName of declaredMcpTools) {
    const bare = bareName(qualifiedName);
    assert.ok(liveNames.has(bare), `${qualifiedName} is declared on the skill-advisor route but "${bare}" is not in the live advisor tool registry`);
  }
});

test('the researched high-value tool subset is declared on the skill-advisor route, including skill_graph_validate (Theme D)', () => {
  const declaredMcpTools = skillAdvisorRouteMcpTools();
  const declaredBareNames = new Set(declaredMcpTools.map(bareName));

  for (const requiredTool of REQUIRED_ADVISOR_TOOLS) {
    assert.ok(declaredBareNames.has(requiredTool), `skill-advisor route mcp_tools must declare ${requiredTool}`);
  }
});

test('the doctor router frontmatter allowed-tools also exposes skill_graph_validate (Theme D1/D4)', () => {
  const frontmatterLine = read(ROUTER_MD_PATH).split(/\r?\n/u).find((line) => line.startsWith('allowed-tools:'));
  assert.ok(frontmatterLine, 'doctor/speckit.md must have an allowed-tools frontmatter line');
  assert.ok(
    frontmatterLine.includes('mcp__mk_skill_advisor__skill_graph_validate'),
    'doctor/speckit.md allowed-tools must include mcp__mk_skill_advisor__skill_graph_validate',
  );
});

test('the route does not silently claim full-registry equality (ruled-out #11) — this stays a documented subset', () => {
  const liveNames = liveAdvisorToolNames();
  const declaredBareNames = new Set(skillAdvisorRouteMcpTools().filter((n) => n.startsWith('mcp__mk_skill_advisor__')).map(bareName));

  // A live-only tool such as skill_graph_propagate_enhances is legal to omit;
  // this test fails only if the declared set and live set were EXACTLY
  // equal-by-construction with no documented gap, which would silently
  // reintroduce the ruled-out full-equality assumption. Assert the live
  // registry legitimately contains at least one tool the route does not
  // require today.
  const undeclaredLiveTools = [...liveNames].filter((name) => !declaredBareNames.has(name));
  assert.ok(
    undeclaredLiveTools.length > 0,
    `expected the live registry to contain at least one tool the doctor route legitimately does not require; found none (declared: ${[...declaredBareNames].join(', ')})`,
  );
});
