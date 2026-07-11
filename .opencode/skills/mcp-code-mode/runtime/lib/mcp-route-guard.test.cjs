// Tests for the mcp-route-guard core and its Claude PreToolUse hook adapter.
//
// (a) Table-driven evaluateNativeMcpCall: warn on a routable connector match,
//     manifest-strict allow on an unrouteable family, internal-server
//     exemption, non-MCP tools, and the warn-only decision-enum invariant.
// (b) Name-normalization bridges manifest and connector spellings onto the
//     same family token -- the guard silently never fires without this.
// (c) Fail-open on a missing manifest, an unparsable manifest, and a
//     malformed tool name.
// (d) The manifest mtime cache expands the warn-set with no code change.
// (e) The broad-mode env flag and the kill-switch env flag.
// (f) Claude-hook integration: piping a PreToolUse payload for a routable
//     connector call yields additionalContext, exit 0, and no
//     permissionDecision anywhere in the output.

'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { mkdtempSync, mkdirSync, writeFileSync, rmSync, utimesSync, statSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');

const guardCore = require('./mcp-route-guard.cjs');

const CLAUDE_HOOK_PATH = join(__dirname, '..', 'hooks', 'claude', 'mcp-route-guard.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// Fixtures
// ─────────────────────────────────────────────────────────────────────────────

function makeProjectDir(manualNames) {
  const dir = mkdtempSync(join(tmpdir(), 'mcp-route-guard-test-'));
  const manifest = {
    manual_call_templates: manualNames.map((name) => ({
      name,
      call_template_type: 'mcp',
      config: { mcpServers: { [name]: { transport: 'stdio', command: 'true', args: [] } } },
    })),
  };
  writeFileSync(join(dir, '.utcp_config.json'), JSON.stringify(manifest, null, 2), 'utf8');
  return dir;
}

function makeEmptyProjectDir() {
  return mkdtempSync(join(tmpdir(), 'mcp-route-guard-test-empty-'));
}

const cleanupDirs = [];
function trackedProjectDir(manualNames) {
  const dir = makeProjectDir(manualNames);
  cleanupDirs.push(dir);
  return dir;
}
function trackedEmptyProjectDir() {
  const dir = makeEmptyProjectDir();
  cleanupDirs.push(dir);
  return dir;
}

// ─────────────────────────────────────────────────────────────────────────────
// (a) Table-driven evaluateNativeMcpCall
// ─────────────────────────────────────────────────────────────────────────────

function testWarnOnRoutableClickUpConnector() {
  const projectDir = trackedProjectDir(['clickup_official', 'figma']);
  const result = guardCore.evaluateNativeMcpCall({
    toolName: 'mcp__claude_ai_ClickUp__clickup_create_task',
    projectDir,
  });
  assert.equal(result.decision, 'warn', 'ClickUp connector call warns');
  assert.equal(result.warnings.length, 1, 'exactly one warning');
  assert.ok(result.warnings[0].includes('clickup_official'), 'advisory carries the manifest manual name');
}

function testManifestStrictAllowOnUnrouteableWebflow() {
  const projectDir = trackedProjectDir(['clickup_official']); // no webflow family
  const result = guardCore.evaluateNativeMcpCall({
    toolName: 'mcp__claude_ai_Webflow__data_cms_tool',
    projectDir,
  });
  assert.equal(result.decision, 'allow', 'unrouteable family stays silent under manifest-strict');
  assert.equal(result.warnings.length, 0, 'no warning emitted');
}

function testInternalServersExempt() {
  const projectDir = trackedProjectDir(['clickup_official']);
  const codeModeResult = guardCore.evaluateNativeMcpCall({
    toolName: 'mcp__code_mode__call_tool_chain',
    projectDir,
  });
  const codeIndexResult = guardCore.evaluateNativeMcpCall({
    toolName: 'mcp__mk_code_index__code_graph_query',
    projectDir,
  });
  const sequentialResult = guardCore.evaluateNativeMcpCall({
    toolName: 'mcp__sequential_thinking__sequentialthinking',
    projectDir,
  });
  assert.equal(codeModeResult.decision, 'allow', 'code_mode is exempt');
  assert.equal(codeIndexResult.decision, 'allow', 'mk_code_index is exempt');
  assert.equal(sequentialResult.decision, 'allow', 'sequential_thinking is exempt');
  assert.equal(codeModeResult.warnings.length, 0, 'no warning for code_mode');
  assert.equal(codeIndexResult.warnings.length, 0, 'no warning for mk_code_index');
}

function testNonMcpToolsAllow() {
  const projectDir = trackedProjectDir(['clickup_official']);
  for (const toolName of ['Bash', 'Read', 'Write', 'Task']) {
    const result = guardCore.evaluateNativeMcpCall({ toolName, projectDir });
    assert.equal(result.decision, 'allow', `${toolName} is not an MCP call`);
    assert.equal(result.warnings.length, 0, `${toolName} emits no warning`);
  }
}

function testDecisionEnumIsWarnOnly() {
  const projectDir = trackedProjectDir(['clickup_official']);
  const toolNames = [
    'mcp__claude_ai_ClickUp__clickup_create_task',
    'mcp__claude_ai_Webflow__data_cms_tool',
    'mcp__code_mode__call_tool_chain',
    'mcp__mk_code_index__code_graph_query',
    'Bash',
    'Read',
    '',
    'mcp__onlyoneseg',
  ];
  for (const toolName of toolNames) {
    const result = guardCore.evaluateNativeMcpCall({ toolName, projectDir });
    assert.ok(
      result.decision === 'allow' || result.decision === 'warn',
      `decision for "${toolName}" is allow or warn, got "${result.decision}"`,
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// (b) Name normalization bridges manifest and connector spellings
// ─────────────────────────────────────────────────────────────────────────────

function testNormalizationBridgesOfficialAndConnectorSpellings() {
  assert.equal(guardCore.normalizeServerToken('clickup_official'), 'clickup');
  assert.equal(guardCore.normalizeServerToken('claude_ai_ClickUp'), 'clickup');
  assert.equal(guardCore.normalizeServerToken('chrome_devtools_1'), 'chrome_devtools');
  assert.equal(guardCore.normalizeServerToken('chrome_devtools_2'), 'chrome_devtools');
}

function testInternalServerTokenPrefixDetection() {
  assert.ok(guardCore.isInternalServerToken('mk_code_index'), 'mk_ prefix is internal');
  assert.ok(guardCore.isInternalServerToken('mk_spec_memory'), 'mk_ prefix is internal');
  assert.ok(guardCore.isInternalServerToken('code_mode'), 'code_mode is internal');
  assert.ok(guardCore.isInternalServerToken('sequential_thinking'), 'sequential_thinking is internal');
  assert.ok(!guardCore.isInternalServerToken('clickup'), 'clickup is not internal');
}

// ─────────────────────────────────────────────────────────────────────────────
// (c) Fail-open: missing manifest, unparsable manifest, malformed tool name
// ─────────────────────────────────────────────────────────────────────────────

function testAllowOnMissingManifest() {
  const projectDir = trackedEmptyProjectDir(); // no .utcp_config.json at all
  const result = guardCore.evaluateNativeMcpCall({
    toolName: 'mcp__claude_ai_ClickUp__clickup_create_task',
    projectDir,
  });
  assert.equal(result.decision, 'allow', 'missing manifest fails open to allow');
}

function testAllowOnUnparsableManifest() {
  const projectDir = trackedEmptyProjectDir();
  writeFileSync(join(projectDir, '.utcp_config.json'), '{ this is not valid json', 'utf8');
  const result = guardCore.evaluateNativeMcpCall({
    toolName: 'mcp__claude_ai_ClickUp__clickup_create_task',
    projectDir,
  });
  assert.equal(result.decision, 'allow', 'unparsable manifest fails open to allow');
}

function testAllowOnMalformedToolName() {
  const projectDir = trackedProjectDir(['clickup_official']);
  for (const toolName of ['', 'mcp__onlyoneseg', 'mcp__', null, undefined, 42]) {
    const result = guardCore.evaluateNativeMcpCall({ toolName, projectDir });
    assert.equal(result.decision, 'allow', `malformed tool name "${toolName}" fails open`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// (d) Manifest mtime cache expands the warn-set with no code change
// ─────────────────────────────────────────────────────────────────────────────

function testMtimeCacheExpandsWarnSetOnManifestEdit() {
  const projectDir = trackedProjectDir(['clickup_official']);
  const before = guardCore.evaluateNativeMcpCall({
    toolName: 'mcp__claude_ai_Notion__search',
    projectDir,
  });
  assert.equal(before.decision, 'allow', 'notion not yet in manifest -> allow');

  const manifestPath = join(projectDir, '.utcp_config.json');
  const expanded = {
    manual_call_templates: [
      { name: 'clickup_official', call_template_type: 'mcp', config: {} },
      { name: 'notion', call_template_type: 'mcp', config: {} },
    ],
  };
  writeFileSync(manifestPath, JSON.stringify(expanded, null, 2), 'utf8');
  // Force a distinct mtime: some filesystems have coarse mtime resolution and
  // a same-millisecond rewrite would look unchanged to the cache.
  const bumped = new Date(statSync(manifestPath).mtimeMs + 2000);
  utimesSync(manifestPath, bumped, bumped);

  const after = guardCore.evaluateNativeMcpCall({
    toolName: 'mcp__claude_ai_Notion__search',
    projectDir,
  });
  assert.equal(after.decision, 'warn', 'registering notion + touching mtime expands the warn-set');
}

// ─────────────────────────────────────────────────────────────────────────────
// (e) Broad-mode env flag and the kill-switch env flag
// ─────────────────────────────────────────────────────────────────────────────

function testBroadModeEnvFlagWarnsOnUnrouteableFamily() {
  const projectDir = trackedProjectDir(['clickup_official']);
  const defaultResult = guardCore.evaluateNativeMcpCall({
    toolName: 'mcp__claude_ai_Webflow__data_cms_tool',
    projectDir,
    env: {},
  });
  assert.equal(defaultResult.decision, 'allow', 'default manifest-strict stays silent');

  const broadResult = guardCore.evaluateNativeMcpCall({
    toolName: 'mcp__claude_ai_Webflow__data_cms_tool',
    projectDir,
    env: { [guardCore.BROAD_MODE_ENV]: '1' },
  });
  assert.equal(broadResult.decision, 'warn', 'broad mode nudges registration for an unrouteable family');
}

function testKillSwitchDisablesEveryDecision() {
  const projectDir = trackedProjectDir(['clickup_official']);
  const result = guardCore.evaluateNativeMcpCall({
    toolName: 'mcp__claude_ai_ClickUp__clickup_create_task',
    projectDir,
    env: { [guardCore.DISABLED_ENV]: '1' },
  });
  assert.equal(result.decision, 'allow', 'kill-switch forces allow even for a routable match');
  assert.equal(result.warnings.length, 0, 'kill-switch suppresses every warning');
}

// ─────────────────────────────────────────────────────────────────────────────
// (f) Claude-hook integration: additionalContext, exit 0, no permissionDecision
// ─────────────────────────────────────────────────────────────────────────────

function runClaudeHook(payload, extraEnv) {
  return spawnSync(process.execPath, [CLAUDE_HOOK_PATH], {
    input: typeof payload === 'string' ? payload : JSON.stringify(payload),
    encoding: 'utf8',
    env: { ...process.env, ...extraEnv },
  });
}

function testClaudeHookEmitsAdditionalContextForRoutableConnector() {
  const projectDir = trackedProjectDir(['clickup_official']);
  const proc = runClaudeHook({
    tool_name: 'mcp__claude_ai_ClickUp__clickup_create_task',
    tool_input: {},
    cwd: projectDir,
  });

  assert.equal(proc.status, 0, 'hook exits 0');
  assert.ok(proc.stdout && proc.stdout.length > 0, 'hook writes stdout');
  const parsed = JSON.parse(proc.stdout);
  assert.ok(parsed.hookSpecificOutput, 'output carries hookSpecificOutput');
  assert.equal(parsed.hookSpecificOutput.hookEventName, 'PreToolUse');
  assert.ok(
    typeof parsed.hookSpecificOutput.additionalContext === 'string'
      && parsed.hookSpecificOutput.additionalContext.includes('clickup_official'),
    'additionalContext carries the routing advisory',
  );
  assert.ok(
    !Object.prototype.hasOwnProperty.call(parsed.hookSpecificOutput, 'permissionDecision'),
    'no permissionDecision anywhere in the output',
  );
  assert.ok(!proc.stdout.includes('permissionDecision'), 'no permissionDecision string in raw stdout');
}

function testClaudeHookSilentForUnrouteableFamily() {
  const projectDir = trackedProjectDir(['clickup_official']);
  const proc = runClaudeHook({
    tool_name: 'mcp__claude_ai_Webflow__data_cms_tool',
    tool_input: {},
    cwd: projectDir,
  });
  assert.equal(proc.status, 0, 'hook exits 0');
  assert.equal(proc.stdout, '', 'hook emits nothing for an unrouteable family');
}

function testClaudeHookFailsOpenOnMalformedStdin() {
  const proc = runClaudeHook('{ not valid json');
  assert.equal(proc.status, 0, 'malformed stdin still exits 0');
  assert.equal(proc.stdout, '', 'malformed stdin emits no output');
}

// ─────────────────────────────────────────────────────────────────────────────
// Run
// ─────────────────────────────────────────────────────────────────────────────

const tests = [
  ['warn on routable ClickUp connector', testWarnOnRoutableClickUpConnector],
  ['manifest-strict allow on unrouteable Webflow', testManifestStrictAllowOnUnrouteableWebflow],
  ['internal servers exempt', testInternalServersExempt],
  ['non-MCP tools allow', testNonMcpToolsAllow],
  ['decision enum is allow/warn only', testDecisionEnumIsWarnOnly],
  ['normalization bridges official/connector spellings', testNormalizationBridgesOfficialAndConnectorSpellings],
  ['internal server token prefix detection', testInternalServerTokenPrefixDetection],
  ['allow on missing manifest', testAllowOnMissingManifest],
  ['allow on unparsable manifest', testAllowOnUnparsableManifest],
  ['allow on malformed tool name', testAllowOnMalformedToolName],
  ['mtime cache expands warn-set on manifest edit', testMtimeCacheExpandsWarnSetOnManifestEdit],
  ['broad-mode env flag warns on unrouteable family', testBroadModeEnvFlagWarnsOnUnrouteableFamily],
  ['kill-switch disables every decision', testKillSwitchDisablesEveryDecision],
  ['Claude hook emits additionalContext for routable connector', testClaudeHookEmitsAdditionalContextForRoutableConnector],
  ['Claude hook silent for unrouteable family', testClaudeHookSilentForUnrouteableFamily],
  ['Claude hook fails open on malformed stdin', testClaudeHookFailsOpenOnMalformedStdin],
];

let passed = 0;
try {
  for (const [name, fn] of tests) {
    fn();
    passed += 1;
  }
} finally {
  for (const dir of cleanupDirs) {
    try { rmSync(dir, { recursive: true, force: true }); } catch (_) { /* best-effort cleanup */ }
  }
}

process.stdout.write(`[mcp-route-guard] ${passed}/${tests.length} assertions passed\n`);
