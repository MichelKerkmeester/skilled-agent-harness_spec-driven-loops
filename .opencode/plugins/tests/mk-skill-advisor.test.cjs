// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-skill-advisor Regression Tests                            ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Exercise cache freshness, bounded subprocess behavior,          ║
// ║          lifecycle races, and cross-runtime directive parity.            ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const fs = require('node:fs');
const { registerHooks } = require('node:module');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const WORKSPACE_ROOT = path.resolve(__dirname, '..', '..', '..');
const PLUGIN_PATH = path.join(WORKSPACE_ROOT, '.opencode', 'plugins', 'mk-skill-advisor.js');
const BRIDGE_PATH = path.join(
  WORKSPACE_ROOT,
  '.opencode',
  'skills',
  'system-skill-advisor',
  'mcp-server',
  'plugin_bridges',
  'mk-skill-advisor-bridge.mjs',
);
const RENDERER_PATH = path.join(
  WORKSPACE_ROOT,
  '.opencode',
  'skills',
  'system-skill-advisor',
  'mcp-server',
  'lib',
  'render.ts',
);
const CLAUDE_HOOK_PATH = path.join(
  WORKSPACE_ROOT,
  '.opencode',
  'skills',
  'system-skill-advisor',
  'hooks',
  'claude',
  'user-prompt-submit.ts',
);
const HYGIENE_DIRECTIVE = 'Comment hygiene [HARD BLOCK]:';
const GOVERNOR_DIRECTIVE = 'Fable-5 governor:';

const MODULE_STUBS = new Map([
  ['@opencode-ai/plugin/tool', 'export const tool = (definition) => definition;'],
  ['@modelcontextprotocol/sdk/client/index.js', 'export class Client {}'],
  ['@modelcontextprotocol/sdk/client/stdio.js', 'export class StdioClientTransport {}'],
]);

registerHooks({
  resolve(specifier, context, nextResolve) {
    const source = MODULE_STUBS.get(specifier);
    if (source !== undefined) {
      return {
        url: `data:text/javascript,${encodeURIComponent(source)}`,
        shortCircuit: true,
      };
    }
    return nextResolve(specifier, context);
  },
});

let pluginModulePromise;

function loadPlugin() {
  pluginModulePromise ??= import(pathToFileURL(PLUGIN_PATH).href);
  return pluginModulePromise;
}

function bridgeEnvelope(brief = 'Advisor: live; use sk-code 0.91/0.23 pass.') {
  return JSON.stringify({
    brief: brief || null,
    status: brief ? 'ok' : 'skipped',
    metadata: { freshness: 'live' },
  });
}

function fakeChild(options = {}) {
  const child = new EventEmitter();
  child.stdout = new EventEmitter();
  child.stdout.setEncoding = () => undefined;
  child.stdinPayload = null;
  child.stdin = {
    end(payload) {
      child.stdinPayload = String(payload ?? '');
      if (!options.manual) {
        const emitResult = () => {
          if (options.stdout !== undefined) {
            child.stdout.emit('data', options.stdout);
          }
          if (options.close !== false) {
            child.emit('close', options.code ?? 0);
          }
        };
        if (options.delayMs) {
          setTimeout(emitResult, options.delayMs);
        } else {
          queueMicrotask(emitResult);
        }
      }
    },
  };
  child.kills = [];
  child.kill = (signal) => {
    child.kills.push(signal);
    return true;
  };
  return child;
}

function spawnSequence(children, calls = []) {
  return (binary, args, options) => {
    const child = children[Math.min(calls.length, children.length - 1)];
    calls.push({ binary, args, options, child });
    return child;
  };
}

async function makePlugin(options = {}, directory = WORKSPACE_ROOT) {
  const pluginModule = await loadPlugin();
  return pluginModule.default({ directory }, {
    sourceSignatureProvider: () => 'stable-test-signature',
    ...options,
  });
}

async function runPrompt(hooks, input = {}, output = { system: [] }) {
  await hooks['experimental.chat.system.transform']({
    sessionID: 'session-test',
    prompt: 'implement the plugin fix',
    ...input,
  }, output);
  return output;
}

async function status(hooks) {
  return hooks.tool.spec_kit_skill_advisor_status.execute({});
}

function writeFixtureFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function makeAdvisorFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mk-skill-advisor-signature-'));
  writeFixtureFile(path.join(root, '.opencode', 'skills', 'demo', 'SKILL.md'), '# Demo\n');
  writeFixtureFile(path.join(root, '.opencode', 'skills', 'demo', 'graph-metadata.json'), '{"name":"demo"}\n');
  const advisorRoot = path.join(root, '.opencode', 'skills', 'system-skill-advisor', 'mcp-server');
  writeFixtureFile(path.join(advisorRoot, 'scripts', 'skill_advisor.py'), 'print("advisor")\n');
  writeFixtureFile(path.join(advisorRoot, 'scripts', 'skill_advisor_runtime.py'), 'RUNTIME = 1\n');
  writeFixtureFile(path.join(advisorRoot, 'scripts', 'skill_graph_compiler.py'), 'COMPILER = 1\n');
  writeFixtureFile(path.join(advisorRoot, 'scripts', 'skill-graph.json'), '{"skills":[]}\n');
  writeFixtureFile(path.join(advisorRoot, 'database', 'skill-graph.sqlite'), 'sqlite-v1');
  return { root, advisorRoot };
}

test('malformed optional configuration is reported with a prompt-safe code', async () => {
  const originalHome = process.env.HOME;
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'mk-skill-advisor-home-'));
  writeFixtureFile(
    path.join(home, '.config', 'opencode', 'plugin', 'mk-skill-advisor.json'),
    '{not-json',
  );
  process.env.HOME = home;
  try {
    const hooks = await makePlugin({ enabled: false });
    const pluginStatus = await status(hooks);
    assert.match(pluginStatus, /^config_status=error$/m);
    assert.match(pluginStatus, /^config_error_code=CONFIG_PARSE_ERROR$/m);
    assert.doesNotMatch(pluginStatus, /not-json/);
  } finally {
    if (originalHome === undefined) {
      delete process.env.HOME;
    } else {
      process.env.HOME = originalHome;
    }
  }
});

test('no-brief turns retain hygiene and governor context with OpenCode runtime metadata', async () => {
  const child = fakeChild({ stdout: bridgeEnvelope('') });
  const calls = [];
  const hooks = await makePlugin({ spawnOverride: spawnSequence([child], calls) });

  const output = await runPrompt(hooks);

  assert.equal(output.system.length, 1);
  assert.match(output.system[0], new RegExp(HYGIENE_DIRECTIVE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(output.system[0], new RegExp(GOVERNOR_DIRECTIVE));
  assert.equal(JSON.parse(child.stdinPayload).runtime, 'opencode');
  assert.deepEqual(calls[0].options.stdio, ['pipe', 'pipe', 'ignore']);
});

test('missing prompts retain constitutional context while disabled mode stays silent', async () => {
  const child = fakeChild({ stdout: bridgeEnvelope() });
  const hooks = await makePlugin({ spawnOverride: spawnSequence([child]) });
  const missing = await runPrompt(hooks, { prompt: undefined, sessionID: '__global__' });
  assert.match(missing.system[0], /Comment hygiene \[HARD BLOCK\]:/);
  assert.match(missing.system[0], /Fable-5 governor:/);

  const disabledHooks = await makePlugin({ enabled: false, spawnOverride: spawnSequence([child]) });
  const disabled = await runPrompt(disabledHooks);
  assert.deepEqual(disabled.system, []);
});

test('bridge output is bounded and overflow terminates immediately', async () => {
  const child = fakeChild({ stdout: 'x'.repeat(256 * 1024 + 1), close: false });
  const hooks = await makePlugin({ spawnOverride: spawnSequence([child]) });

  const output = await runPrompt(hooks);

  assert.match(output.system[0], /Comment hygiene \[HARD BLOCK\]:/);
  assert.deepEqual(child.kills, ['SIGKILL']);
  assert.match(await status(hooks), /last_error_code=BRIDGE_OUTPUT_LIMIT/);
});

test('termination grace stays inside the configured timeout budget', async () => {
  const child = fakeChild({ manual: true });
  const hooks = await makePlugin({ bridgeTimeoutMs: 40, spawnOverride: spawnSequence([child]) });
  const startedAt = Date.now();
  const keepAlive = setTimeout(() => undefined, 200);

  const output = await runPrompt(hooks);
  clearTimeout(keepAlive);
  const elapsedMs = Date.now() - startedAt;

  assert.ok(elapsedMs < 200, `expected bounded timeout, got ${elapsedMs}ms`);
  assert.deepEqual(child.kills, ['SIGTERM', 'SIGKILL']);
  assert.match(output.system[0], /Fable-5 governor:/);
  assert.match(await status(hooks), /last_error_code=TIMEOUT/);

  const defaultHooks = await makePlugin({ enabled: false });
  assert.match(await status(defaultHooks), /bridge_timeout_ms=2500/);
});

test('multi-file freshness invalidates cache and ignores WAL-only mtime changes', async () => {
  const { root, advisorRoot } = makeAdvisorFixture();
  const children = Array.from({ length: 8 }, () => fakeChild({ stdout: bridgeEnvelope() }));
  const calls = [];
  const pluginModule = await loadPlugin();
  const hooks = await pluginModule.default({ directory: root }, {
    cacheTTLMs: 60_000,
    spawnOverride: spawnSequence(children, calls),
  });
  const prompt = { prompt: 'same prompt', sessionID: 'signature-session' };

  await runPrompt(hooks, prompt);
  await runPrompt(hooks, prompt);
  assert.equal(calls.length, 1, 'warm identical prompt should hit cache');

  writeFixtureFile(path.join(root, '.opencode', 'skills', 'demo', 'SKILL.md'), '# Demo changed\n');
  await runPrompt(hooks, prompt);
  writeFixtureFile(path.join(root, '.opencode', 'skills', 'demo', 'graph-metadata.json'), '{"name":"changed"}\n');
  await runPrompt(hooks, prompt);
  writeFixtureFile(path.join(advisorRoot, 'scripts', 'skill-graph.json'), '{"skills":["demo"]}\n');
  await runPrompt(hooks, prompt);
  writeFixtureFile(path.join(advisorRoot, 'database', 'skill-graph.sqlite'), 'sqlite-v2');
  await runPrompt(hooks, prompt);
  assert.equal(calls.length, 5, 'each canonical source change should invalidate cache');

  writeFixtureFile(path.join(advisorRoot, 'database', 'skill-graph.sqlite-wal'), 'pending-wal-change');
  await runPrompt(hooks, prompt);
  assert.equal(calls.length, 5, 'WAL-only changes remain bounded by cache TTL until checkpoint');

  writeFixtureFile(path.join(advisorRoot, 'database', 'skill-graph.sqlite'), 'sqlite-v3-checkpointed');
  await runPrompt(hooks, prompt);
  assert.equal(calls.length, 6, 'checkpointed main database changes invalidate cache');
});

test('unavailable freshness bypasses completed cache entries', async () => {
  const calls = [];
  const children = [fakeChild({ stdout: bridgeEnvelope() }), fakeChild({ stdout: bridgeEnvelope() })];
  const hooks = await makePlugin({
    sourceSignatureProvider: () => { throw new Error('freshness unavailable'); },
    spawnOverride: spawnSequence(children, calls),
  });

  await runPrompt(hooks);
  await runPrompt(hooks);

  assert.equal(calls.length, 2);
  assert.match(await status(hooks), /cache_entries=0/);
});

test('session deletion prevents an in-flight completion from repopulating cache', async () => {
  const child = fakeChild({ manual: true });
  const hooks = await makePlugin({ spawnOverride: spawnSequence([child]) });
  const pending = runPrompt(hooks, { sessionID: 'race-session' });
  await new Promise((resolve) => setImmediate(resolve));

  await hooks.event({
    event: { type: 'session.deleted', properties: { info: { id: 'race-session' } } },
  });
  child.stdout.emit('data', bridgeEnvelope());
  child.emit('close', 0);
  await pending;

  assert.match(await status(hooks), /cache_entries=0/);
});

test('cache TTL starts when bridge work completes', async () => {
  const calls = [];
  const children = [
    fakeChild({ stdout: bridgeEnvelope(), delayMs: 40 }),
    fakeChild({ stdout: bridgeEnvelope() }),
  ];
  const hooks = await makePlugin({
    cacheTTLMs: 60,
    spawnOverride: spawnSequence(children, calls),
  });

  await runPrompt(hooks);
  await new Promise((resolve) => setTimeout(resolve, 30));
  await runPrompt(hooks);

  assert.equal(calls.length, 1, 'entry should retain the full TTL after completion');
});

test('unexpected spawn failures fail open without escaping the transform', async () => {
  const hooks = await makePlugin({
    spawnOverride: () => { throw new Error('spawn exploded'); },
  });
  const output = { system: [] };

  await assert.doesNotReject(() => runPrompt(hooks, {}, output));

  assert.match(output.system[0], /Comment hygiene \[HARD BLOCK\]:/);
  assert.match(await status(hooks), /last_error_code=SPAWN_ERROR/);
});

test('hostile output containers cannot make the transform fail closed', async () => {
  const hooks = await makePlugin({ enabled: true });
  const output = new Proxy({}, {
    set() {
      throw new Error('output is immutable');
    },
  });

  await assert.doesNotReject(() => runPrompt(hooks, {}, output));

  assert.match(await status(hooks), /last_error_code=UNEXPECTED_HOOK_ERROR/);
});

test('bridge rendering includes governor context and retains canonical renderer loading', async () => {
  const bridge = await import(pathToFileURL(BRIDGE_PATH).href);
  const rendered = bridge.renderAdvisorBrief({
    status: 'ok',
    freshness: 'live',
    recommendations: [{
      skill: 'sk-code',
      confidence: 0.91,
      uncertainty: 0.2,
      passes_threshold: true,
    }],
    metrics: { tokenCap: 80 },
    sharedPayload: { metadata: { skillLabel: 'sk-code' } },
  });
  const source = fs.readFileSync(BRIDGE_PATH, 'utf8');

  assert.match(rendered, /Comment hygiene \[HARD BLOCK\]:/);
  assert.match(rendered, /Fable-5 governor:/);
  assert.match(source, /compat\.renderAdvisorBrief/);
  assert.match(source, /loadCanonicalRenderer/);
});

test('Claude source clamps prompts, keeps fallback parity, and flushes fail-open output', () => {
  const hookSource = fs.readFileSync(CLAUDE_HOOK_PATH, 'utf8');
  const rendererSource = fs.readFileSync(RENDERER_PATH, 'utf8');

  assert.match(hookSource, /DEFAULT_CLAUDE_HOOK_TIMEOUT_MS = 2500/);
  assert.match(hookSource, /MAX_PROMPT_BYTES = 64 \* 1024/);
  assert.match(hookSource, /Buffer\.byteLength\(value\.slice/);
  assert.match(hookSource, /brief \?\? renderAdvisorFallbackDirective\(\)/);
  assert.match(hookSource, /await writeHookOutput\(\{\}\)/);
  assert.match(rendererSource, /export function renderAdvisorFallbackDirective/);
});

test('status exposes prompt-safe configuration health', async () => {
  const hooks = await makePlugin({ enabled: false });
  const pluginStatus = await status(hooks);

  assert.match(pluginStatus, /^config_status=(loaded|absent|error)$/m);
  assert.match(pluginStatus, /^config_error_code=(none|CONFIG_PARSE_ERROR|CONFIG_READ_ERROR)$/m);
});
