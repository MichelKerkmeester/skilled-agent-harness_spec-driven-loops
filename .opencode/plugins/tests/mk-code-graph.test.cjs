// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-code-graph Regression Tests                               ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Exercise transport validation, cache lifecycle, output guards, ║
// ║          and bounded bridge behavior without a live daemon.              ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const ROOT = path.resolve(__dirname, '../../..');
const PLUGIN_PATH = path.join(ROOT, '.opencode', 'plugins', 'mk-code-graph.js');
const BRIDGE_PATH = path.join(
  ROOT,
  '.opencode',
  'skills',
  'system-code-graph',
  'mcp_server',
  'plugin_bridges',
  'mk-code-graph-bridge.mjs',
);
const TRANSPORT_PATH = path.join(
  ROOT,
  '.opencode',
  'skills',
  'system-code-graph',
  'mcp_server',
  'plugin_bridges',
  'mk-code-graph-transport.mjs',
);

function transportPlan() {
  return {
    interfaceVersion: '1.0',
    transportOnly: true,
    retrievalPolicyOwner: 'runtime',
    event: {
      hook: 'event',
      trackedPayloadKinds: ['code_graph_status'],
      summary: 'Track code graph readiness hints',
    },
    systemTransform: {
      hook: 'experimental.chat.system.transform',
      title: 'System digest',
      payloadKind: 'code_graph_status',
      dedupeKey: 'system:status',
      content: 'Graph is ready',
    },
    messagesTransform: [{
      hook: 'experimental.chat.messages.transform',
      title: 'Message digest',
      payloadKind: 'code_graph_status',
      dedupeKey: 'messages:status',
      content: 'Graph is ready',
    }],
    compaction: {
      hook: 'experimental.session.compacting',
      title: 'Compaction digest',
      payloadKind: 'code_graph_status',
      dedupeKey: 'compaction:status',
      content: 'Graph is ready',
    },
  };
}

function bridgeResponse(plan = transportPlan()) {
  return JSON.stringify({ status: 'ok', data: { opencodeTransport: plan } });
}

async function importPlugin(execFile, tag = 'plugin') {
  globalThis.__mkCodeGraphExecFile = execFile;
  const source = fs.readFileSync(PLUGIN_PATH, 'utf8')
    .replace(
      "import { execFile } from 'node:child_process';",
      'const execFile = (...args) => globalThis.__mkCodeGraphExecFile(...args);',
    )
    .replace("import { tool } from '@opencode-ai/plugin/tool';", 'const tool = (definition) => definition;')
    .replace(
      /import \{\n  createSyntheticTextPart,[\s\S]*?from '\.\.\/skills\/system-spec-kit\/mcp_server\/plugin_bridges\/spec-kit-opencode-message-schema\.mjs';/,
      `const createSyntheticTextPart = (input) => ({
  id: input.id,
  sessionID: input.sessionID,
  messageID: input.messageID,
  type: 'text',
  text: input.text,
  synthetic: true,
  metadata: input.metadata,
});
const hasUnsafeMessageTransformParts = () => false;
const hasSyntheticTextPartMarker = (parts, key, value) => parts.some(
  (part) => part && part.metadata && part.metadata[key] === value,
);
const isMessageAnchorLike = (anchor) => Boolean(
  anchor && anchor.info && typeof anchor.info.id === 'string'
    && typeof anchor.info.sessionID === 'string' && Array.isArray(anchor.parts),
);`,
    )
    .replace(
      /from '\.\.\/skills\/system-code-graph\/mcp_server\/plugin_bridges\/mk-code-graph-transport\.mjs';/,
      `from ${JSON.stringify(pathToFileURL(TRANSPORT_PATH).href)};`,
    )
    .replace(/const BRIDGE_PATH = .*?;/, "const BRIDGE_PATH = '/test/mk-code-graph-bridge.mjs';");
  const instrumented = `${source}\n// Test module identity: ${tag}-${Date.now()}-${Math.random()}\n`;
  return import(`data:text/javascript;base64,${Buffer.from(instrumented).toString('base64')}`);
}

async function makePlugin(execFile, options = {}, tag = 'plugin') {
  const plugin = await importPlugin(execFile, tag);
  const hooks = await plugin.default({ directory: ROOT }, options);
  return { plugin, hooks };
}

function immediateExec(stdout = bridgeResponse()) {
  let calls = 0;
  return {
    execFile(_file, _args, _options, callback) {
      calls += 1;
      callback(null, stdout, '');
    },
    calls: () => calls,
  };
}

function fakeBridgeChild(payload, options = {}) {
  const child = new EventEmitter();
  child.stdout = new EventEmitter();
  child.stderr = new EventEmitter();
  child.stdout.setEncoding = () => undefined;
  child.stderr.setEncoding = () => undefined;
  child.kills = [];
  child.kill = (signal) => {
    child.kills.push(signal);
    return true;
  };
  if (!options.hang) {
    queueMicrotask(() => {
      child.stdout.emit('data', JSON.stringify(payload));
      child.emit('close', 0);
    });
  }
  return child;
}

async function importBridge(spawn, tag = 'bridge') {
  globalThis.__mkCodeGraphSpawn = spawn;
  const source = fs.readFileSync(BRIDGE_PATH, 'utf8')
    .replace(
      "import { spawn } from 'node:child_process';",
      'const spawn = (...args) => globalThis.__mkCodeGraphSpawn(...args);',
    )
    .replace(/const CLI_SHIM = .*?;/, "const CLI_SHIM = '/test/code-index.cjs';")
    .replace(/const BRIDGE_PATH = .*?;/, "const BRIDGE_PATH = '/test/launcher-ipc-bridge.cjs';")
    .replace(/const DB_DIR = .*?;/, "const DB_DIR = '/test/database';")
    .replace(/const REPO_ROOT = .*?;/, "const REPO_ROOT = '/test/workspace';")
    .replace(
      /async function warmProbe\(timeoutMs\) \{[\s\S]*?\n\}\n\nfunction renderCodeGraphBrief/,
      "async function warmProbe() { return { warm: true, reason: 'test' }; }\n\nfunction renderCodeGraphBrief",
    )
    .replace(
      'if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {',
      'if (false) {',
    );
  const instrumented = `${source}\nexport { parseArgs };\n// Test module identity: ${tag}-${Date.now()}-${Math.random()}\n`;
  return import(`data:text/javascript;base64,${Buffer.from(instrumented).toString('base64')}`);
}

test('malformed configuration remains observable through plugin status', async (t) => {
  const originalHome = process.env.HOME;
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'mk-code-graph-config-'));
  const configPath = path.join(home, '.config', 'opencode', 'plugin', 'mk-code-graph.json');
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, '{broken', 'utf8');
  process.env.HOME = home;
  t.after(() => {
    fs.rmSync(home, { recursive: true, force: true });
    if (originalHome === undefined) delete process.env.HOME;
    else process.env.HOME = originalHome;
  });

  const { hooks } = await makePlugin(() => {}, {}, 'malformed-config');
  const status = await hooks.tool.mk_code_graph_status.execute();

  assert.match(status, /^config_error=.+JSON.+$/mi);
  assert.doesNotMatch(status, /^config_error=none$/m);
});

test('slow successful bridge responses retain a full live cache TTL', async () => {
  let calls = 0;
  const execFile = (_file, _args, _options, callback) => {
    calls += 1;
    setTimeout(() => callback(null, bridgeResponse(), ''), 50);
  };
  const { hooks } = await makePlugin(execFile, { cacheTtlMs: 20 }, 'slow-cache');

  await hooks['experimental.chat.system.transform'](
    { sessionID: 'slow-session' },
    { system: [] },
  );
  await hooks['experimental.chat.system.transform'](
    { sessionID: 'slow-session' },
    { system: [] },
  );

  assert.equal(calls, 1);
});

test('concurrent cold-cache transforms share one bridge subprocess', async () => {
  let calls = 0;
  let complete;
  const execFile = (_file, _args, _options, callback) => {
    calls += 1;
    complete = () => callback(null, bridgeResponse(), '');
  };
  const { hooks } = await makePlugin(execFile, { cacheTtlMs: 5000 }, 'single-flight');
  const outputs = Array.from({ length: 3 }, () => ({ system: [] }));
  const pending = outputs.map((output) => hooks['experimental.chat.system.transform'](
    { sessionID: 'shared-session' },
    output,
  ));

  assert.equal(calls, 1);
  complete();
  await Promise.all(pending);
  assert.ok(outputs.every((output) => output.system.length === 1));
});

test('transport validation rejects malformed blocks and keeps the plugin default-export-only', async () => {
  const bridge = immediateExec();
  const { plugin } = await makePlugin(bridge.execFile, {}, 'validation');
  const malformed = transportPlan();
  malformed.messagesTransform = [null];

  const { parseTransportPlan } = await import(pathToFileURL(TRANSPORT_PATH).href);
  assert.equal(parseTransportPlan(bridgeResponse(malformed)), null);
  assert.equal(parseTransportPlan({ directory: ROOT }), null);
  assert.deepEqual(Object.keys(plugin).sort(), ['default']);
});

test('messages transform rejects invalid output containers before bridge work', async () => {
  const bridge = immediateExec();
  const { hooks } = await makePlugin(bridge.execFile, {}, 'message-output');
  const transform = hooks['experimental.chat.messages.transform'];

  await assert.doesNotReject(transform({}, undefined));
  await assert.doesNotReject(transform({}, {}));
  await assert.doesNotReject(transform({}, { messages: 'invalid' }));
  assert.equal(bridge.calls(), 0);
});

test('system and compaction dedup scans tolerate non-string entries', async () => {
  const bridge = immediateExec();
  const { hooks } = await makePlugin(bridge.execFile, {}, 'mixed-output');
  const system = [null, {}, 7];
  const context = [null, {}, 7];

  await assert.doesNotReject(hooks['experimental.chat.system.transform'](
    { sessionID: 'mixed-session' },
    { system },
  ));
  await assert.doesNotReject(hooks['experimental.session.compacting'](
    { sessionID: 'mixed-session' },
    { context },
  ));
  assert.equal(system.at(-1), 'System digest\nGraph is ready');
  assert.equal(context.at(-1), 'Compaction digest\nGraph is ready');

  await hooks['experimental.chat.system.transform'](
    { sessionID: 'mixed-session' },
    { system },
  );
  await hooks['experimental.session.compacting'](
    { sessionID: 'mixed-session' },
    { context },
  );
  assert.equal(system.length, 4);
  assert.equal(context.length, 4);
});

test('routine events keep warm cache entries while scoped lifecycle events invalidate', async () => {
  const bridge = immediateExec();
  const { hooks } = await makePlugin(bridge.execFile, { cacheTtlMs: 5000 }, 'invalidation');
  const run = () => hooks['experimental.chat.system.transform'](
    { sessionID: 'event-session' },
    { system: [] },
  );

  await run();
  await hooks.event({ event: { type: 'message.updated', sessionID: 'event-session' } });
  await hooks.event({ event: { type: 'session.updated', sessionID: 'event-session' } });
  await run();
  assert.equal(bridge.calls(), 1);

  await hooks.event({ event: { type: 'session.deleted', sessionID: 'event-session' } });
  await run();
  assert.equal(bridge.calls(), 2);
});

test('bridge --minimal omits raw payload and no longer advertises a spec-folder scope', async () => {
  const payload = {
    status: 'ok',
    data: { freshness: 'live', totalFiles: 2, totalNodes: 3, totalEdges: 4 },
  };
  const children = [];
  const bridge = await importBridge(() => {
    const child = fakeBridgeChild(payload);
    children.push(child);
    return child;
  }, 'minimal');
  const parsed = bridge.parseArgs(['--minimal', '--spec-folder', 'specs/example']);
  assert.equal(parsed.minimal, true);
  assert.equal(Object.hasOwn(parsed, 'specFolder'), false);

  const minimal = await bridge.runCli({ ...parsed, timeoutMs: 500, probeTimeoutMs: 10 });
  assert.equal(minimal.status, 'ok');
  assert.equal(Object.hasOwn(minimal.data, 'codeGraphStatus'), false);
  assert.equal(Object.hasOwn(minimal.metadata, 'specFolder'), false);
  assert.ok(minimal.data.opencodeTransport);

  const full = await bridge.runCli({
    ...bridge.parseArgs([]),
    timeoutMs: 500,
    probeTimeoutMs: 10,
  });
  assert.deepEqual(full.data.codeGraphStatus, payload);
  assert.equal(children.length, 2);
});

test('bridge timeout settles even when no process lifecycle event arrives', async () => {
  let child;
  const bridge = await importBridge(() => {
    child = fakeBridgeChild(null, { hang: true });
    return child;
  }, 'timeout');
  const startedAt = Date.now();
  const keepAlive = setTimeout(() => undefined, 500);

  const result = await bridge.runCli({ timeoutMs: 15, probeTimeoutMs: 1, minimal: true });
  clearTimeout(keepAlive);
  const durationMs = Date.now() - startedAt;

  assert.equal(result.status, 'skipped');
  assert.equal(result.error, 'TIMEOUT');
  assert.deepEqual(child.kills, ['SIGTERM', 'SIGKILL']);
  assert.ok(durationMs < 300, `expected bounded timeout, got ${durationMs}ms`);
});
