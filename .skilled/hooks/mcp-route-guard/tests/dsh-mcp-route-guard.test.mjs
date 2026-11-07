// ───────────────────────────────────────────────────────────────────
// MODULE: DSH Adapter Tests - MCP Route Guard (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Covers the Code Mode mount allowlist, the core kill switch, the fail-closed
// throw policy and deny-reason parity with the Pi extension.

import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import guardCore from '../lib/mcp-route-guard.cjs';

import { ERROR_POLICY, registerMcpRouteGuard } from '../dsh/mcp-route-guard.mjs';

const enabled = () => true;
const allow = async () => ({ kind: 'allow' });

function harness() {
  const handlers = new Map();
  const logs = [];
  return {
    handlers,
    logs,
    ctx: {
      on(name, handler) {
        handlers.set(name, handler);
      },
      logger: {
        warn(message) { logs.push({ level: 'warn', message }); },
        error(message) { logs.push({ level: 'error', message }); },
      },
    },
  };
}

// Mirrors the Pi extension's tool_call verdict: a core warning becomes the block reason.
function piReason(toolName, projectDir, env = {}) {
  if (typeof toolName !== 'string' || !toolName.startsWith('mcp_')) return undefined;
  const result = guardCore.evaluateNativeMcpCall({ toolName, projectDir, env });
  return result.warnings.length > 0 ? result.warnings.join('\n') : undefined;
}

function manifestDir(manualName) {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'dsh-mcp-route-guard-'));
  writeFileSync(path.join(directory, '.utcp_config.json'), JSON.stringify({
    manual_call_templates: [{ name: manualName }],
  }));
  return directory;
}

test('allow: an allowlisted code_mode tool reaches the next pre-execute handler', async () => {
  const toolName = 'mcp__code_mode__call_tool_chain';
  const expected = guardCore.evaluateNativeMcpCall({ toolName, projectDir: process.cwd(), env: {} });
  assert.equal(expected.decision, 'allow');

  const { ctx, handlers } = harness();
  registerMcpRouteGuard(ctx, { core: guardCore, isEnabled: enabled, env: {}, repoRoot: process.cwd() });
  const result = await handlers.get('tools/pre-execute')({ name: toolName, arguments: {} }, allow);
  assert.equal(result.kind, 'allow');
});

test('deny: a code_mode tool outside the allowlist is denied', async () => {
  const toolName = 'mcp__code_mode__register_manual';
  // The shared core exempts the whole code_mode server, so the mount allowlist is the stricter gate.
  const shared = guardCore.evaluateNativeMcpCall({ toolName, projectDir: process.cwd(), env: {} });
  assert.equal(shared.decision, 'allow');

  const { ctx, handlers } = harness();
  registerMcpRouteGuard(ctx, { core: guardCore, isEnabled: enabled, env: {}, repoRoot: process.cwd() });
  let delegated = false;
  const result = await handlers.get('tools/pre-execute')({ name: toolName, arguments: {} }, async () => {
    delegated = true;
    return { kind: 'allow' };
  });
  assert.equal(result.kind, 'deny');
  assert.equal(delegated, false);
  assert.match(result.reason, /mcp__code_mode__register_manual/);
  assert.match(result.reason, /call_tool_chain/);
});

test('kill switch: the core disable flag turns the mount allowlist into a no-op', async () => {
  const { ctx, handlers } = harness();
  registerMcpRouteGuard(ctx, {
    core: guardCore,
    isEnabled: enabled,
    env: { [guardCore.DISABLED_ENV]: '1' },
    repoRoot: process.cwd(),
  });
  const result = await handlers.get('tools/pre-execute')(
    { name: 'mcp__code_mode__register_manual', arguments: {} },
    allow,
  );
  assert.equal(result.kind, 'allow');
});

test('ignore: a non-MCP tool is not evaluated', async () => {
  const { ctx, handlers } = harness();
  registerMcpRouteGuard(ctx, {
    core: {
      evaluateNativeMcpCall() { assert.fail('a non-MCP tool must not reach the core'); },
    },
    isEnabled: enabled,
  });
  const result = await handlers.get('tools/pre-execute')(
    { name: 'bash', arguments: { command: 'echo ready' } },
    allow,
  );
  assert.equal(result.kind, 'allow');
});

test('throw policy: fails closed and logs when the core throws', async () => {
  assert.equal(ERROR_POLICY, 'fail-closed');
  const { ctx, handlers, logs } = harness();
  registerMcpRouteGuard(ctx, {
    core: { evaluateNativeMcpCall() { throw new Error('fixture failure'); } },
    isEnabled: enabled,
  });
  const result = await handlers.get('tools/pre-execute')(
    { name: 'mcp__code_mode__call_tool_chain', arguments: {} },
    allow,
  );
  assert.equal(result.kind, 'deny');
  assert.match(result.reason, /could not evaluate/);
  assert.equal(logs.length, 1);
  assert.match(logs[0].message, /mcp-route-guard.*fixture failure/);
});

test('parity: a routable external tool is denied with the Pi extension reason text', async () => {
  const directory = manifestDir('clickup_official');
  try {
    const toolName = 'mcp__claude_ai_ClickUp__clickup_create_task';
    const expectedReason = piReason(toolName, directory);
    assert.ok(expectedReason, 'the Pi extension blocks a routable external tool');

    const { ctx, handlers } = harness();
    registerMcpRouteGuard(ctx, { core: guardCore, isEnabled: enabled, env: {}, repoRoot: directory });
    const result = await handlers.get('tools/pre-execute')(
      { name: toolName, arguments: {}, agent: { session: { header: { cwd: directory } } } },
      allow,
    );
    assert.equal(result.kind, 'deny');
    assert.equal(result.reason, expectedReason);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
