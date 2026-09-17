#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ skill-advisor-route-contract — pin the required advisor CLI command      ║
// ║ SUBSET against the live advisor registry (existence only, never          ║
// ║ full-registry equality)                                                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * The doctor route must declare the high-value advisor commands it actually
 * calls, and every declared command must exist in the live advisor registry —
 * but the registry may carry commands the route legitimately never needs (e.g.
 * skill_graph_propagate_enhances). A route-contract test therefore asserts
 * declared ⊆ live, never declared == live, so the route keeps its documented
 * gap instead of silently claiming the whole registry. The route reaches those
 * commands by invoking the advisor CLI, so the declaration under test is
 * `cli_commands`, and the tool frontmatter names the shell surface they run on.
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
const COMMANDS_DIR = path.join(REPO_ROOT, '.opencode', 'commands', 'doctor');
const ROUTES_PATH = path.join(COMMANDS_DIR, '_routes.yaml');
const ROUTER_MD_PATH = path.join(COMMANDS_DIR, 'speckit.md');
const SKILL_GRAPH_TOOLS_PATH = path.join(REPO_ROOT, '.opencode', 'skills', 'system-skill-advisor', 'runtime', 'tools', 'skill-graph-tools.ts');
const ADVISOR_SCHEMAS_PATH = path.join(REPO_ROOT, '.opencode', 'skills', 'system-skill-advisor', 'runtime', 'schemas', 'advisor-tool-schemas.ts');

// The invocation every cli_commands entry is expected to name.
const ADVISOR_CLI_RELATIVE_PATH = '.opencode/bin/skill-advisor.cjs';
// The router grants the shell surface the advisor CLI commands run through.
const REQUIRED_ROUTER_TOOL = 'Bash';

// Commands doctor's skill-advisor route must declare — the researched
// high-value subset, not the full nine-command registry.
const REQUIRED_ADVISOR_COMMANDS = [
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

// Statically extracts registered advisor command names from the two TS source
// files that define the live advisor registry, without spawning the advisor
// daemon — keeps this test runnable when the advisor IPC socket is cold (a
// reproducible state, where a live probe reports UNAVAILABLE (retryable)).
function liveAdvisorCommandNames() {
  const skillGraphSource = read(SKILL_GRAPH_TOOLS_PATH);
  const skillGraphNames = [...skillGraphSource.matchAll(/name:\s*'([a-z_]+)'/gu)].map((match) => match[1]);

  const schemasSource = read(ADVISOR_SCHEMAS_PATH);
  const advisorToolSchemasBlock = /AdvisorToolInputSchemas\s*=\s*\{([\s\S]*?)\}\s*as const/u.exec(schemasSource);
  assert.ok(advisorToolSchemasBlock, 'AdvisorToolInputSchemas block must be present in advisor-tool-schemas.ts');
  const advisorNames = [...advisorToolSchemasBlock[1].matchAll(/^\s*([a-z_]+):/gmu)].map((match) => match[1]);

  return new Set([...skillGraphNames, ...advisorNames]);
}

// The advisor command named by one cli_commands entry: the first non-flag token
// after the CLI shim path.
function cliCommandName(entry) {
  const tokens = String(entry).split(/\s+/u).filter(Boolean);
  const shimIndex = tokens.indexOf(ADVISOR_CLI_RELATIVE_PATH);
  assert.notStrictEqual(
    shimIndex,
    -1,
    `skill-advisor route cli_commands entry must invoke ${ADVISOR_CLI_RELATIVE_PATH}: ${entry}`,
  );
  const command = tokens.slice(shimIndex + 1).find((token) => !token.startsWith('-'));
  assert.ok(command, `skill-advisor route cli_commands entry must name an advisor command: ${entry}`);
  return command;
}

function skillAdvisorRouteCliCommands() {
  const routes = parseYaml(read(ROUTES_PATH));
  const route = routes.routes.find((entry) => entry.target === 'skill-advisor');
  assert.ok(route, '_routes.yaml must declare a skill-advisor route');
  assert.ok(Array.isArray(route.cli_commands), 'skill-advisor route must declare cli_commands as an array');
  assert.ok(route.cli_commands.length > 0, 'skill-advisor route must declare at least one advisor CLI command');
  return route.cli_commands;
}

function declaredAdvisorCommands() {
  return skillAdvisorRouteCliCommands().map(cliCommandName);
}

function doctorCommandDocs() {
  return fs.readdirSync(COMMANDS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => path.join(COMMANDS_DIR, entry.name));
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('every advisor command declared on the skill-advisor route exists in the live registry (subset, not equality)', () => {
  const liveNames = liveAdvisorCommandNames();
  assert.ok(liveNames.size >= 8, `expected at least 8 live advisor commands, found ${liveNames.size}: ${[...liveNames].join(', ')}`);

  const declaredCommands = declaredAdvisorCommands();

  for (const command of declaredCommands) {
    assert.ok(liveNames.has(command), `"${command}" is declared on the skill-advisor route but is not in the live advisor registry`);
  }
});

test('the researched high-value command subset is declared on the skill-advisor route, including skill_graph_validate', () => {
  const declaredCommands = new Set(declaredAdvisorCommands());

  for (const requiredCommand of REQUIRED_ADVISOR_COMMANDS) {
    assert.ok(declaredCommands.has(requiredCommand), `skill-advisor route cli_commands must declare ${requiredCommand}`);
  }
});

test('the doctor command docs reach the advisor through the CLI and name no advisor MCP tool id', () => {
  const docs = doctorCommandDocs();
  assert.ok(docs.length > 0, 'doctor command docs must exist');

  for (const docPath of docs) {
    assert.ok(
      !read(docPath).includes('mcp__system_skill_advisor__'),
      `${path.relative(REPO_ROOT, docPath)} must not name an advisor MCP tool id`,
    );
  }

  const frontmatterLine = read(ROUTER_MD_PATH).split(/\r?\n/u).find((line) => line.startsWith('allowed-tools:'));
  assert.ok(frontmatterLine, 'doctor/speckit.md must have an allowed-tools frontmatter line');
  const allowedTools = frontmatterLine.split(',').map((tool) => tool.trim());
  assert.ok(
    allowedTools.includes(REQUIRED_ROUTER_TOOL),
    `doctor/speckit.md allowed-tools must include ${REQUIRED_ROUTER_TOOL}, the surface its advisor CLI commands run through`,
  );
});

test('the route does not silently claim full-registry equality (ruled-out #11) — this stays a documented subset', () => {
  const liveNames = liveAdvisorCommandNames();
  const declaredCommands = new Set(declaredAdvisorCommands());

  // A live-only command such as skill_graph_propagate_enhances is legal to omit;
  // this test fails only if the declared set and live set were EXACTLY
  // equal-by-construction with no documented gap, which would silently
  // reintroduce the ruled-out full-equality assumption. Assert the live
  // registry legitimately contains at least one command the route does not
  // require today.
  const undeclaredLiveCommands = [...liveNames].filter((name) => !declaredCommands.has(name));
  assert.ok(
    undeclaredLiveCommands.length > 0,
    `expected the live registry to contain at least one command the doctor route legitimately does not require; found none (declared: ${[...declaredCommands].join(', ')})`,
  );
});
