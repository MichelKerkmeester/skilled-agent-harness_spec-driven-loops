#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Skill Advisor Route Contract Tests
// ───────────────────────────────────────────────────────────────────
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
const COMMANDS_DIR = path.join(REPO_ROOT, '.skilled', 'commands', 'doctor');
const ASSETS_DIR = path.join(COMMANDS_DIR, 'assets');
const ROUTES_PATH = path.join(COMMANDS_DIR, '_routes.yaml');
const ROUTER_MD_PATH = path.join(COMMANDS_DIR, 'speckit.md');
const ADVISOR_RUNTIME = path.join(
  REPO_ROOT, '.skilled', 'skills', 'system-skill-advisor', 'runtime',
);
const SKILL_GRAPH_TOOLS_PATH = path.join(ADVISOR_RUNTIME, 'tools', 'skill-graph-tools.ts');
const ADVISOR_SCHEMAS_PATH = path.join(ADVISOR_RUNTIME, 'schemas', 'advisor-tool-schemas.ts');

// The invocation every cli_commands entry is expected to name.
const ADVISOR_CLI_RELATIVE_PATH = '.skilled/bin/skill-advisor.cjs';
// The router grants the shell surface the advisor CLI commands run through.
const REQUIRED_ROUTER_TOOL = 'Bash';
// The advisor registry ships nine commands: five skill-graph tools and four
// advisor tools. A change here is a registry change and should be deliberate.
const LIVE_REGISTRY_SIZE = 9;

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

// Flags a declared invocation cannot drop without changing what it does. The
// advisor CLI refuses advisor_rebuild and skill_graph_scan without --trusted,
// rejects advisor_validate without the heavy-run acknowledgement, and the
// read-only probes rely on --warm-only to never start a daemon.
const REQUIRED_COMMAND_FLAGS = {
  advisor_recommend: ['--warm-only'],
  advisor_status: ['--warm-only'],
  advisor_validate: ['--confirm-heavy-run'],
  advisor_rebuild: ['--trusted'],
  skill_graph_scan: ['--trusted'],
  skill_graph_validate: ['--warm-only'],
  skill_graph_status: ['--warm-only'],
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function read(absolutePath) {
  return fs.readFileSync(absolutePath, 'utf8');
}

// Skill-graph command names, read only from the tool definitions the exported
// registry array lists. Scanning every `name: '...'` in the file would let an
// unrelated object literal pad the live set and hide a missing command.
function registeredSkillGraphNames(source) {
  const registryRe = /skillGraphToolDefinitions\s*:\s*ToolDefinition\[\]\s*=\s*\[([\s\S]*?)\]/u;
  const registry = registryRe.exec(source);
  assert.ok(registry, 'skillGraphToolDefinitions array must be present in skill-graph-tools.ts');
  const members = registry[1].split(',').map((member) => member.trim()).filter(Boolean);
  return members.map((member) => {
    const definitionRe = new RegExp(
      `const\\s+${member}\\s*:\\s*ToolDefinition\\s*=\\s*\\{\\s*name:\\s*'([a-z_]+)'`,
      'u',
    );
    const definition = definitionRe.exec(source);
    assert.ok(
      definition,
      `registry member ${member} must be a ToolDefinition whose first field is name`,
    );
    return definition[1];
  });
}

// Statically extracts registered advisor command names from the two TS source
// files that define the live advisor registry, without spawning the advisor
// daemon — keeps this test runnable when the advisor IPC socket is cold (a
// reproducible state, where a live probe reports UNAVAILABLE (retryable)).
function liveAdvisorCommandNames() {
  const skillGraphNames = registeredSkillGraphNames(read(SKILL_GRAPH_TOOLS_PATH));

  const schemasSource = read(ADVISOR_SCHEMAS_PATH);
  const schemasBlockRe = /AdvisorToolInputSchemas\s*=\s*\{([\s\S]*?)\}\s*as const/u;
  const advisorToolSchemasBlock = schemasBlockRe.exec(schemasSource);
  assert.ok(
    advisorToolSchemasBlock,
    'AdvisorToolInputSchemas block must be present in advisor-tool-schemas.ts',
  );
  const advisorNames = [...advisorToolSchemasBlock[1].matchAll(/^\s*([a-z_]+):/gmu)]
    .map((match) => match[1]);

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
  assert.ok(
    command,
    `skill-advisor route cli_commands entry must name an advisor command: ${entry}`,
  );
  return command;
}

function skillAdvisorRouteCliCommands() {
  const routes = parseYaml(read(ROUTES_PATH));
  const route = routes.routes.find((entry) => entry.target === 'skill-advisor');
  assert.ok(route, '_routes.yaml must declare a skill-advisor route');
  assert.ok(
    Array.isArray(route.cli_commands),
    'skill-advisor route must declare cli_commands as an array',
  );
  assert.ok(
    route.cli_commands.length > 0,
    'skill-advisor route must declare at least one advisor CLI command',
  );
  return route.cli_commands;
}

function declaredAdvisorCommands() {
  return skillAdvisorRouteCliCommands().map(cliCommandName);
}

function filesIn(dir, extension) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .map((entry) => path.join(dir, entry.name));
}

// The tools a command grants, from its YAML frontmatter, whether written as a
// comma-separated string or as a YAML list.
function allowedTools(markdown) {
  const block = /^---\r?\n([\s\S]*?)\r?\n---/u.exec(markdown);
  assert.ok(block, 'command doc must open with a frontmatter block');
  const value = parseYaml(block[1])['allowed-tools'];
  if (Array.isArray(value)) return value.map((tool) => String(tool).trim());
  if (typeof value === 'string') return value.split(',').map((tool) => tool.trim()).filter(Boolean);
  return [];
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('every advisor command declared on the skill-advisor route exists in the live registry (subset, not equality)', () => {
  const liveNames = liveAdvisorCommandNames();
  assert.equal(
    liveNames.size,
    LIVE_REGISTRY_SIZE,
    `expected ${LIVE_REGISTRY_SIZE} live advisor commands, found ${liveNames.size}: `
      + [...liveNames].join(', '),
  );

  for (const command of declaredAdvisorCommands()) {
    assert.ok(
      liveNames.has(command),
      `"${command}" is declared on the skill-advisor route but is not in the live advisor registry`,
    );
  }
});

test('the registry reader ignores name fields outside the exported tool list', () => {
  const source = [
    "export const aTool: ToolDefinition = {\n  name: 'skill_graph_a',\n};",
    "const unrelated = { name: 'not_a_command' };",
    'export const skillGraphToolDefinitions: ToolDefinition[] = [\n  aTool,\n];',
  ].join('\n');
  assert.deepEqual(registeredSkillGraphNames(source), ['skill_graph_a']);
});

test('the researched high-value command subset is declared on the skill-advisor route, including skill_graph_validate', () => {
  const declaredCommands = new Set(declaredAdvisorCommands());

  for (const requiredCommand of REQUIRED_ADVISOR_COMMANDS) {
    assert.ok(
      declaredCommands.has(requiredCommand),
      `skill-advisor route cli_commands must declare ${requiredCommand}`,
    );
  }
});

test('each declared invocation keeps the flags its command needs', () => {
  for (const entry of skillAdvisorRouteCliCommands()) {
    const command = cliCommandName(entry);
    const tokens = String(entry).split(/\s+/u);
    for (const flag of REQUIRED_COMMAND_FLAGS[command] || []) {
      assert.ok(
        tokens.includes(flag),
        `skill-advisor route invocation of ${command} must pass ${flag}: ${entry}`,
      );
    }
  }
});

test('the doctor command docs and workflow assets reach the advisor through the CLI and name no advisor MCP tool id', () => {
  const docs = [...filesIn(COMMANDS_DIR, '.md'), ...filesIn(ASSETS_DIR, '.yaml')];
  assert.ok(docs.some((doc) => doc.endsWith('.md')), 'doctor command docs must exist');
  assert.ok(docs.some((doc) => doc.endsWith('.yaml')), 'doctor workflow assets must exist');

  for (const docPath of docs) {
    assert.ok(
      !read(docPath).includes('mcp__system_skill_advisor__'),
      `${path.relative(REPO_ROOT, docPath)} must not name an advisor MCP tool id`,
    );
  }

  assert.ok(
    allowedTools(read(ROUTER_MD_PATH)).includes(REQUIRED_ROUTER_TOOL),
    `doctor/speckit.md allowed-tools must include ${REQUIRED_ROUTER_TOOL}, `
      + 'the surface its advisor CLI commands run through',
  );
});

test('the allowed-tools reader finds the first listed tool and the YAML list form', () => {
  assert.deepEqual(allowedTools('---\nallowed-tools: Bash, Read\n---\n'), ['Bash', 'Read']);
  assert.deepEqual(allowedTools('---\nallowed-tools: [Read, Bash]\n---\n'), ['Read', 'Bash']);
});

test('the route does not silently claim full-registry equality — this stays a documented subset', () => {
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
    'expected the live registry to contain at least one command the doctor route '
      + `legitimately does not require; found none (declared: ${[...declaredCommands].join(', ')})`,
  );
});
