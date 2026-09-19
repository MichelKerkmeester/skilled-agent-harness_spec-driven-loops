// ───────────────────────────────────────────────────────────────
// MODULE: MCP Route Guard Plugin Tests
// ───────────────────────────────────────────────────────────────
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const BROAD_MODE_ENV = 'MCP_ROUTE_GUARD_BROAD_MODE';

// A project is a toolchain checkout when its source root carries this file, and
// the plugin writes its log under that root.
function temporaryDirectory(t, prefix, sourceRoot) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const sentinel = path.join(dir, sourceRoot, 'skills', 'system-spec-kit', 'SKILL.md');
  fs.mkdirSync(path.dirname(sentinel), { recursive: true });
  fs.writeFileSync(sentinel, '---\nname: system-spec-kit\n---\n');
  return dir;
}

// Broad mode makes the guard advise on any external MCP server, so one call
// always produces a logged warning.
async function callExternalMcpTool(t, projectDir) {
  const previous = process.env[BROAD_MODE_ENV];
  process.env[BROAD_MODE_ENV] = '1';
  t.after(() => {
    if (previous === undefined) delete process.env[BROAD_MODE_ENV];
    else process.env[BROAD_MODE_ENV] = previous;
  });
  const pluginUrl = pathToFileURL(path.join(__dirname, '..', 'mcp-route-guard.js')).href;
  const hooks = await (await import(pluginUrl)).default({ directory: projectDir });
  await hooks['tool.execute.before']({ tool: 'mcp__external-example__lookup' }, {});
}

test('logs under the .skilled source root', async (t) => {
  const projectDir = temporaryDirectory(t, 'mcp-route-guard-skilled-', '.skilled');
  await callExternalMcpTool(t, projectDir);

  assert.match(fs.readFileSync(path.join(projectDir, '.skilled', 'logs', 'mcp-route-guard.log'), 'utf8'), /WARN/);
});

test('logs under .opencode when that is the only source root', async (t) => {
  const projectDir = temporaryDirectory(t, 'mcp-route-guard-legacy-root-', '.opencode');
  await callExternalMcpTool(t, projectDir);

  assert.match(fs.readFileSync(path.join(projectDir, '.opencode', 'logs', 'mcp-route-guard.log'), 'utf8'), /WARN/);
  assert.equal(fs.existsSync(path.join(projectDir, '.skilled')), false);
});

test('logs under the checkout root when the project is a directory below it', async (t) => {
  const checkout = temporaryDirectory(t, 'mcp-route-guard-nested-', '.skilled');
  const projectDir = path.join(checkout, 'packages', 'app');
  fs.mkdirSync(projectDir, { recursive: true });
  await callExternalMcpTool(t, projectDir);

  assert.match(fs.readFileSync(path.join(checkout, '.skilled', 'logs', 'mcp-route-guard.log'), 'utf8'), /WARN/);
  assert.equal(fs.existsSync(path.join(projectDir, '.opencode')), false);
});
