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
  'plugin-bridges',
  'mk-skill-advisor-bridge.mjs',
);
const MESSAGE_IDENTITY_PATH = path.join(
  WORKSPACE_ROOT,
  '.opencode',
  'plugins',
  'lib',
  'opencode-message-identity.js',
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
const GOVERNOR_DIRECTIVE = 'Governor:';

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

function bridgeEnvelope(
  brief = 'Advisor: live; use sk-code 0.91/0.23 pass.',
  metadata = { freshness: 'live' },
) {
  return JSON.stringify({
    brief: brief || null,
    status: brief ? 'ok' : 'skipped',
    metadata,
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

function compiledRouteSummary(targets, overrides = {}) {
  return {
    outcome: 'route',
    hubId: 'sk-code',
    targets,
    servingAuthority: 'compiled',
    ...overrides,
  };
}

function legacyCompiledRouteSummaryLine(summary) {
  if (!summary || typeof summary !== 'object') return null;
  const outcome = typeof summary.outcome === 'string' ? summary.outcome : null;
  if (!outcome) return null;
  const hub = typeof summary.hubId === 'string' && summary.hubId ? summary.hubId : 'unknown';
  const authority = typeof summary.servingAuthority === 'string' && summary.servingAuthority
    ? summary.servingAuthority
    : 'compiled';
  const targets = Array.isArray(summary.targets) && summary.targets.length
    ? summary.targets.join(',')
    : 'none';
  return `Compiled routing (served=${authority}): hub=${hub} outcome=${outcome} targets=${targets}`;
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
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test('bounded route rendering caps targets and exposes a complete reveal path', async () => {
  const pluginModule = await loadPlugin();
  const summary = compiledRouteSummary(['quality', 'review', 'opencode', 'webflow', 'typescript']);
  const unbounded = pluginModule.renderCompiledRouteSummaryLine(summary);
  const bounded = pluginModule.renderCompiledRouteSummaryLine(summary, { bounded: true });
  const revealed = pluginModule.revealCompiledRouteSummaryTargets(summary);

  assert.equal(unbounded, legacyCompiledRouteSummaryLine(summary));
  assert.match(bounded, /targets=quality,review,opencode,\+2 more/);
  assert.match(bounded, /digest=[0-9a-f]{12}/);
  assert.equal(bounded.split(' targets=')[0], unbounded.split(' targets=')[0]);
  assert.deepEqual(revealed, summary.targets);
  for (const target of summary.targets) {
    assert.ok(bounded.includes(target) || revealed.includes(target), `target ${target} must be visible or revealable`);
  }
  assert.equal(
    pluginModule.renderCompiledRouteSummaryLine(summary, { reveal: true }),
    unbounded,
  );
});

test('flag-off route rendering and plugin delivery remain byte-identical to the baseline', async () => {
  const pluginModule = await loadPlugin();
  const summary = compiledRouteSummary(['quality', 'review', 'opencode', 'webflow', 'typescript']);
  const baseline = legacyCompiledRouteSummaryLine(summary);

  assert.equal(pluginModule.renderCompiledRouteSummaryLine(summary), baseline);
  assert.equal(pluginModule.renderCompiledRouteSummaryLine(summary, { bounded: false }), baseline);

  const child = fakeChild({
    stdout: bridgeEnvelope(undefined, { freshness: 'live', compiledRouteSummary: summary }),
  });
  const hooks = await makePlugin({
    boundedCompiledRouteSummary: false,
    spawnOverride: spawnSequence([child]),
  });
  const output = await runPrompt(hooks);

  assert.equal(output.system[1], baseline);
  assert.match(await status(hooks), /bounded_compiled_route_summary=false/);
});

test('bounded flag selects the bounded line in the OpenCode transform', async () => {
  const pluginModule = await loadPlugin();
  const summary = compiledRouteSummary(['quality', 'review', 'opencode', 'webflow', 'typescript']);
  const child = fakeChild({
    stdout: bridgeEnvelope(undefined, { freshness: 'live', compiledRouteSummary: summary }),
  });
  const hooks = await makePlugin({
    boundedCompiledRouteSummary: true,
    spawnOverride: spawnSequence([child]),
  });
  const output = await runPrompt(hooks);

  assert.equal(
    output.system[1],
    pluginModule.renderCompiledRouteSummaryLine(summary, { bounded: true }),
  );
  assert.match(output.system[1], /\+2 more/);
});

test('target digest is stable for the same membership and changes for a changed omitted set', async () => {
  const pluginModule = await loadPlugin();
  const summary = compiledRouteSummary(['alpha', 'beta', 'gamma', 'delta', 'epsilon']);
  const reordered = compiledRouteSummary(['epsilon', 'delta', 'gamma', 'beta', 'alpha']);
  const changedOmitted = compiledRouteSummary(['alpha', 'beta', 'gamma', 'delta', 'zeta']);

  const digest = pluginModule.compiledRouteSummaryTargetDigest(summary);
  assert.equal(pluginModule.compiledRouteSummaryTargetDigest(reordered), digest);
  assert.notEqual(pluginModule.compiledRouteSummaryTargetDigest(changedOmitted), digest);
  assert.match(
    pluginModule.renderCompiledRouteSummaryLine(summary, { bounded: true }),
    new RegExp(`digest=${digest}`),
  );
});

test('bounded rendering preserves the cap boundary and handles empty or malformed summaries', async () => {
  const pluginModule = await loadPlugin();
  const exact = ['alpha', 'beta', 'gamma'];
  const exactLine = pluginModule.renderCompiledRouteSummaryLine(
    compiledRouteSummary(exact),
    { bounded: true },
  );

  assert.doesNotMatch(exactLine, /\+\d+ more/);
  assert.equal(
    pluginModule.renderCompiledRouteSummaryLine(compiledRouteSummary([]), { bounded: true }),
    'Compiled routing (served=compiled): hub=sk-code outcome=route targets=none',
  );
  assert.equal(pluginModule.renderCompiledRouteSummaryLine(null, { bounded: true }), null);
  assert.deepEqual(pluginModule.revealCompiledRouteSummaryTargets({ targets: ['alpha', 42] }), ['alpha']);
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
  assert.match(missing.system[0], /Governor:/);

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
  assert.match(output.system[0], /Governor:/);
  assert.match(await status(hooks), /last_error_code=TIMEOUT/);

  const defaultHooks = await makePlugin({ enabled: false });
  assert.match(await status(defaultHooks), /bridge_timeout_ms=2500/);
});

test('multi-file freshness invalidates cache and ignores WAL-only mtime changes', async () => {
  const { root, advisorRoot } = makeAdvisorFixture();
  try {
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
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
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
  assert.match(rendered, /Governor:/);
  assert.match(source, /compat\.renderAdvisorBrief/);
  assert.match(source, /loadCanonicalRenderer/);
});

test('Claude source clamps prompts, keeps fallback parity, and flushes fail-open output', () => {
  const hookSource = fs.readFileSync(CLAUDE_HOOK_PATH, 'utf8');
  const rendererSource = fs.readFileSync(RENDERER_PATH, 'utf8');

  assert.match(hookSource, /DEFAULT_CLAUDE_HOOK_TIMEOUT_MS = 2500/);
  assert.match(hookSource, /MAX_PROMPT_BYTES = 64 \* 1024/);
  assert.match(hookSource, /Buffer\.byteLength\(value\.slice/);
  assert.match(hookSource, /brief \?\? renderAdvisorFallbackDirective\(renderOptions\)/);
  assert.match(hookSource, /const output: ClaudeUserPromptSubmitOutput = \{[\s\S]*observeEmittedAdvisorPolicy\((?:effectiveEmitted|emitted)/);
  assert.match(hookSource, /await writeHookOutput\(\{\}\)/);
  assert.match(rendererSource, /export function renderAdvisorFallbackDirective/);
});

test('status exposes prompt-safe configuration health', async () => {
  const hooks = await makePlugin({ enabled: false });
  const pluginStatus = await status(hooks);

  assert.match(pluginStatus, /^config_status=(loaded|absent|error)$/m);
  assert.match(pluginStatus, /^config_error_code=(none|CONFIG_PARSE_ERROR|CONFIG_READ_ERROR)$/m);
});

test('same-message advisor contributions are suppressed only after the first delivery', async () => {
  const child = fakeChild({ stdout: bridgeEnvelope('Advisor: same-message block') });
  const hooks = await makePlugin({
    deduplicateTransforms: true,
    spawnOverride: spawnSequence([child]),
  });
  const input = {
    sessionID: 'advisor-dedup-session',
    messageID: 'advisor-message-1',
    transformCallOrdinal: 0,
    prompt: 'repeat this exact text',
  };
  const first = await runPrompt(hooks, input, { system: [] });
  const second = await runPrompt(hooks, input, { system: [] });

  assert.equal(first.system.length, 1);
  assert.deepEqual(second.system, []);

  const identityModule = await import(pathToFileURL(MESSAGE_IDENTITY_PATH).href);
  const identity = identityModule.resolveMessageIdentity(input);
  const receipt = identityModule.getMultiTransformReceipt(identity);
  assert.deepEqual(receipt.transforms.map((entry) => ({
    transform: entry.transform,
    outcome: entry.outcome,
  })), [
    { transform: 'mk-skill-advisor', outcome: 'delivered' },
    { transform: 'mk-skill-advisor', outcome: 'suppressed_duplicate' },
  ]);
});

test('distinct advisor messages with identical text both receive full delivery', async () => {
  const child = fakeChild({ stdout: bridgeEnvelope('Advisor: identical text block') });
  const hooks = await makePlugin({
    deduplicateTransforms: true,
    spawnOverride: spawnSequence([child]),
  });
  const first = await runPrompt(hooks, {
    sessionID: 'advisor-distinct-session',
    messageID: 'advisor-message-a',
    transformCallOrdinal: 0,
    prompt: 'same user text',
  }, { system: [] });
  const second = await runPrompt(hooks, {
    sessionID: 'advisor-distinct-session',
    messageID: 'advisor-message-b',
    transformCallOrdinal: 0,
    prompt: 'same user text',
  }, { system: [] });

  assert.deepEqual(second.system, first.system);
  assert.equal(first.system.length, 1);
});

test('flag-off advisor delivery preserves repeated output byte-for-byte', async () => {
  const child = fakeChild({ stdout: bridgeEnvelope('Advisor: flag-off baseline') });
  const hooks = await makePlugin({
    deduplicateTransforms: false,
    spawnOverride: spawnSequence([child]),
  });
  const input = {
    sessionID: 'advisor-flag-off-session',
    messageID: 'advisor-message-flag-off',
    transformCallOrdinal: 0,
    prompt: 'same user text',
  };
  const first = await runPrompt(hooks, input, { system: [] });
  const second = await runPrompt(hooks, input, { system: [] });

  assert.equal(JSON.stringify(second.system), JSON.stringify(first.system));
  assert.equal(second.system.length, 1);
});

test('unresolvable advisor identity fails open with full delivery', async () => {
  const child = fakeChild({ stdout: bridgeEnvelope('Advisor: unresolved identity') });
  const hooks = await makePlugin({
    deduplicateTransforms: true,
    spawnOverride: spawnSequence([child]),
  });
  const input = {
    sessionID: 'advisor-unresolved-session',
    prompt: 'same user text',
  };
  const first = await runPrompt(hooks, input, { system: [] });
  const second = await runPrompt(hooks, input, { system: [] });

  assert.deepEqual(second.system, first.system);
  assert.equal(first.system.length, 1);
});

test('malformed advisor identity fields resolve to no identity without throwing', async () => {
  const identityModule = await import(pathToFileURL(MESSAGE_IDENTITY_PATH).href);
  const malformedInput = {
    sessionID: {},
    messageID: [],
    transformCallOrdinal: 'not-an-ordinal',
    prompt: 'same user text',
  };

  assert.doesNotThrow(() => identityModule.resolveMessageIdentity(malformedInput));
  assert.equal(identityModule.resolveMessageIdentity(malformedInput), null);
});

test('identity parts carrying the key separator resolve to no identity (no ambiguous-key collision)', async () => {
  const identityModule = await import(pathToFileURL(MESSAGE_IDENTITY_PATH).href);
  const SEP = '\u001f';

  // A part carrying the join separator is unresolvable, so the caller falls open to full delivery.
  assert.equal(identityModule.resolveMessageIdentity({
    sessionID: `sess${SEP}injected`,
    messageID: 'msg',
    transformCallOrdinal: 0,
  }), null);

  // The classic pair that would collide on a naive join must never share a live key:
  // at least one side is null, so neither identity can alias the other's delivery state.
  const a = identityModule.resolveMessageIdentity({ sessionID: `a${SEP}b`, messageID: 'c', transformCallOrdinal: 0 });
  const b = identityModule.resolveMessageIdentity({ sessionID: 'a', messageID: `b${SEP}c`, transformCallOrdinal: 0 });
  assert.ok(a === null || b === null || a.key !== b.key);
});

test('multi-transform receipts record both transform fires and their outcomes', async () => {
  const identityModule = await import(pathToFileURL(MESSAGE_IDENTITY_PATH).href);
  const state = identityModule.createTransformDedupState();
  const identity = identityModule.resolveMessageIdentity({
    sessionID: 'receipt-session',
    messageID: 'receipt-message',
    transformCallOrdinal: 0,
  });
  const blockId = identityModule.POLICY_BLOCK_IDS.ADVISOR_ROUTE;
  const contentHash = identityModule.hashPolicyBlockContent(blockId, 'shared block', 0);

  assert.equal(identityModule.recordTransformContribution({
    identity,
    blockId,
    contentHash,
    transform: 'mk-skill-advisor',
    state,
  }).shouldDeliver, true);
  identityModule.commitTransformDelivery(identity, blockId, contentHash, {
    transform: 'mk-skill-advisor',
    state,
  });
  assert.equal(identityModule.recordTransformContribution({
    identity,
    blockId,
    contentHash,
    transform: 'mk-spec-memory',
    state,
  }).shouldDeliver, false);
  identityModule.commitTransformDelivery(identity, blockId, contentHash, {
    transform: 'mk-spec-memory',
    state,
  });

  const receipt = identityModule.getMultiTransformReceipt(identity, state);
  assert.deepEqual(receipt.transforms.map((entry) => ({
    transform: entry.transform,
    blockId: entry.blockId,
    outcome: entry.outcome,
  })), [
    { transform: 'mk-skill-advisor', blockId, outcome: 'delivered' },
    { transform: 'mk-spec-memory', blockId, outcome: 'suppressed_duplicate' },
  ]);
});

test('a hostile pre-populated shared dedup state cannot falsely suppress a fresh identity', async () => {
  const identityModule = await import(pathToFileURL(MESSAGE_IDENTITY_PATH).href);
  const shared = identityModule.getSharedTransformDedupState();
  identityModule.clearTransformDedupState(shared);
  try {
    const blockId = identityModule.POLICY_BLOCK_IDS.ADVISOR_ROUTE;
    const contentHash = identityModule.hashPolicyBlockContent(blockId, 'shared block', 0);

    // Pollute the process-global dedup state with a delivered block for one identity.
    const polluter = identityModule.resolveMessageIdentity({ sessionID: 'polluter', messageID: 'm', transformCallOrdinal: 0 });
    identityModule.recordTransformContribution({ identity: polluter, blockId, contentHash, transform: 't', state: shared });
    identityModule.commitTransformDelivery(polluter, blockId, contentHash, { transform: 't', state: shared });

    // A distinct fresh identity's first contribution must still deliver — the polluted global cannot leak across identities.
    const fresh = identityModule.resolveMessageIdentity({ sessionID: 'fresh', messageID: 'm', transformCallOrdinal: 0 });
    assert.equal(identityModule.recordTransformContribution({
      identity: fresh,
      blockId,
      contentHash,
      transform: 't',
      state: shared,
    }).shouldDeliver, true);
  } finally {
    identityModule.clearTransformDedupState(shared);
  }
});

test('concurrent transforms reserve delivery before commit so only one may deliver', async () => {
  const identityModule = await import(pathToFileURL(MESSAGE_IDENTITY_PATH).href);
  const state = identityModule.createTransformDedupState();
  const identity = identityModule.resolveMessageIdentity({
    sessionID: 'concurrent-session',
    messageID: 'concurrent-message',
    transformCallOrdinal: 0,
  });
  const blockId = identityModule.POLICY_BLOCK_IDS.ADVISOR_ROUTE;
  const contentHash = identityModule.hashPolicyBlockContent(blockId, 'shared block', 0);

  const first = identityModule.recordTransformContribution({
    identity,
    blockId,
    contentHash,
    transform: 'mk-skill-advisor',
    state,
  });
  const second = identityModule.recordTransformContribution({
    identity,
    blockId,
    contentHash,
    transform: 'mk-spec-memory',
    state,
  });
  assert.equal(first.shouldDeliver, true);
  assert.equal(second.shouldDeliver, false);
  assert.equal(second.contended, true);

  identityModule.commitTransformDelivery(identity, blockId, contentHash, {
    transform: 'mk-skill-advisor',
    state,
  });
  const third = identityModule.recordTransformContribution({
    identity,
    blockId,
    contentHash,
    transform: 'mk-spec-memory',
    state,
  });
  assert.equal(third.shouldDeliver, false);
  assert.equal(third.duplicate, true);
});
