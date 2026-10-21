// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: system-skill-advisor Regression Tests                            ║
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
const PLUGIN_PATH = path.join(WORKSPACE_ROOT, '.skilled', 'plugins', 'system-skill-advisor.js');
const MESSAGE_IDENTITY_PATH = path.join(
  WORKSPACE_ROOT,
  '.skilled',
  'plugins',
  'lib',
  'opencode-message-identity.js',
);
const RENDER_HELPERS_PATH = path.join(
  WORKSPACE_ROOT,
  '.skilled',
  'plugins',
  'lib',
  'skill-advisor-render.js',
);
const RENDERER_PATH = path.join(
  WORKSPACE_ROOT,
  '.skilled',
  'skills',
  'system-skill-advisor',
  'runtime',
  'lib',
  'render.ts',
);
const CLAUDE_HOOK_PATH = path.join(
  WORKSPACE_ROOT,
  '.skilled',
  'skills',
  'system-skill-advisor',
  'hooks',
  'claude',
  'user-prompt-submit.ts',
);
const FALLBACK_DIRECTIVES_BLOCK = '\nDirectives:\n- Comment hygiene [HARD BLOCK]: NEVER embed ADR-/REQ-/CHK-/task-ids or spec paths in code comments — forbidden regardless of instruction. Write the durable WHY instead. Pre-commit gate blocks violations.';
const NO_MATCH_FALLBACK_CONTEXT = `Advisor: no skill matched.${FALLBACK_DIRECTIVES_BLOCK}`;
const SKIPPED_FALLBACK_CONTEXT = `Advisor: prompt skipped.${FALLBACK_DIRECTIVES_BLOCK}`;
const OUTAGE_FAIL_OPEN_FALLBACK_CONTEXT = 'Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json \'{"prompt":"<request>"}\' --format json' + FALLBACK_DIRECTIVES_BLOCK;

const MODULE_STUBS = new Map([
  ['./lib/tool-identity.js', 'export const tool = (definition) => definition;'],
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

let renderHelpersPromise;

function loadRenderHelpers() {
  renderHelpersPromise ??= import(pathToFileURL(RENDER_HELPERS_PATH).href);
  return renderHelpersPromise;
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

const CLI_RECOMMENDATION = {
  skillId: 'sk-code',
  score: 0.26,
  confidence: 0.82,
  uncertainty: 0.2,
};

function cliEnvelope(data = {}, extras = {}) {
  return JSON.stringify({
    status: 'ok',
    ...extras,
    data: {
      recommendations: [CLI_RECOMMENDATION],
      effectiveThresholds: {
        confidenceThreshold: 0.8,
        uncertaintyThreshold: 0.35,
        confidenceOnly: false,
      },
      ...data,
    },
  });
}

function fakeChild(options = {}) {
  const child = new EventEmitter();
  child.stdout = new EventEmitter();
  child.stdout.setEncoding = () => undefined;
  child.stdinPayload = null;

  let emitted = false;
  const emitResult = () => {
    if (emitted || options.manual) return;
    emitted = true;
    const emit = () => {
      if (options.stdout !== undefined) {
        child.stdout.emit('data', options.stdout);
      }
      if (options.close !== false) {
        child.emit('close', options.code ?? 0);
      }
    };
    if (options.delayMs) {
      setTimeout(emit, options.delayMs);
    } else {
      queueMicrotask(emit);
    }
  };

  child.stdin = {
    end(payload) {
      child.stdinPayload = String(payload ?? '');
      emitResult();
    },
  };
  // A reused fake models a fresh process on each spawn: the spawn itself
  // produces output once, whether or not the plugin has written stdin yet.
  // Manual children stay silent until the test drives them.
  child.start = () => {
    emitted = false;
    emitResult();
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
    child.start?.();
    return child;
  };
}

async function makePlugin(options = {}, directory = WORKSPACE_ROOT) {
  const pluginModule = await loadPlugin();
  return pluginModule.default.server({ directory }, {
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

// The plugin's queue deadline timer is unref'd like its bridge timers, so the
// guard keeps a ref'd timer live while the test awaits the plugin's own deadline.
function settleWithin(promise, label, ms = 2000) {
  let timer;
  const guard = new Promise((resolve, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} did not settle within ${ms}ms`)), ms);
  });
  return Promise.race([promise, guard]).finally(() => clearTimeout(timer));
}

async function holdAdvisorChildren(bridgeTimeoutMs) {
  const calls = [];
  const hooks = await makePlugin({
    bridgeTimeoutMs,
    spawnOverride: (binary, args, options) => {
      const child = fakeChild({ manual: true });
      calls.push({ binary, args, options, child });
      return child;
    },
  });
  const flush = () => new Promise((resolve) => setImmediate(resolve));
  const complete = (index) => {
    calls[index].child.stdout.emit('data', cliEnvelope({ freshness: 'live' }));
    calls[index].child.emit('close', 0);
  };
  return { hooks, calls, flush, complete };
}

function writeFixtureFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function makeAdvisorFixture(sourceName = '.skilled') {
  // An ambient absolute DB-dir override points the advisor outside this fixture, so the
  // signature never sees the files the test writes. Editor and MCP environments set it,
  // which made these tests pass locally and fail under those runtimes. The override is
  // cleared only for this fixture's lifetime and restored by the caller's teardown, so the
  // mutation never reaches the tests that follow.
  const previousDbDirs = {
    SYSTEM_SKILL_ADVISOR_DB_DIR: process.env.SYSTEM_SKILL_ADVISOR_DB_DIR,
    MK_SKILL_ADVISOR_DB_DIR: process.env.MK_SKILL_ADVISOR_DB_DIR,
  };
  delete process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
  delete process.env.MK_SKILL_ADVISOR_DB_DIR;
  const restoreDbDirEnv = () => {
    for (const [name, value] of Object.entries(previousDbDirs)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  };
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'system-skill-advisor-signature-'));
  writeFixtureFile(path.join(root, sourceName, 'skills', 'system-spec-kit', 'SKILL.md'), '# Sentinel\n');
  writeFixtureFile(path.join(root, sourceName, 'skills', 'demo', 'SKILL.md'), '# Demo\n');
  writeFixtureFile(path.join(root, sourceName, 'skills', 'demo', 'graph-metadata.json'), '{"name":"demo"}\n');
  const advisorRoot = path.join(root, sourceName, 'skills', 'system-skill-advisor', 'runtime');
  writeFixtureFile(path.join(advisorRoot, 'scripts', 'skill_advisor.py'), 'print("advisor")\n');
  writeFixtureFile(path.join(advisorRoot, 'scripts', 'skill_advisor_runtime.py'), 'RUNTIME = 1\n');
  writeFixtureFile(path.join(advisorRoot, 'scripts', 'skill_graph_compiler.py'), 'COMPILER = 1\n');
  writeFixtureFile(path.join(advisorRoot, 'scripts', 'skill-graph.json'), '{"skills":[]}\n');
  writeFixtureFile(path.join(advisorRoot, 'database', 'skill-graph.sqlite'), 'sqlite-v1');
  return { root, advisorRoot, restoreDbDirEnv };
}

// The plugin reads every source file through its own node:fs binding, which a
// CommonJS stub cannot replace, so read counting uses a second module instance
// whose fs import is wrapped.
let signatureProbePluginPromise;

function loadSignatureProbePlugin() {
  signatureProbePluginPromise ??= (async () => {
    const pluginUrl = `${pathToFileURL(fs.realpathSync(PLUGIN_PATH)).href}?signature-read-probe`;
    const stubSource = `
import * as fs from 'node:fs';
export const readFileSync = (...args) => {
  globalThis.__advisorSignatureReads?.push(String(args[0]));
  return fs.readFileSync(...args);
};
export const existsSync = (...args) => fs.existsSync(...args);
export const readdirSync = (...args) => fs.readdirSync(...args);
export const realpathSync = (...args) => fs.realpathSync(...args);
export const statSync = (...args) => fs.statSync(...args);
`;
    registerHooks({
      resolve(specifier, context, nextResolve) {
        if (specifier === 'node:fs' && context.parentURL === pluginUrl) {
          return {
            url: `data:text/javascript,${encodeURIComponent(stubSource)}`,
            shortCircuit: true,
          };
        }
        return nextResolve(specifier, context);
      },
    });
    return import(pluginUrl);
  })();
  return signatureProbePluginPromise;
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
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'system-skill-advisor-home-'));
  writeFixtureFile(
    path.join(home, '.config', 'opencode', 'plugin', 'system-skill-advisor.json'),
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

test('plugin module exports a loader-compatible dual-plugin object as its default', async () => {
  const pluginModule = await loadPlugin();
  assert.deepEqual(Object.keys(pluginModule), ['default']);
  assert.deepEqual(Object.keys(pluginModule.default).sort(), ['id', 'server', 'setup']);
});

test('bounded route rendering caps targets and exposes a complete reveal path', async () => {
  const renderHelpers = await loadRenderHelpers();
  const summary = compiledRouteSummary(['quality', 'review', 'opencode', 'webflow', 'typescript']);
  const unbounded = renderHelpers.renderCompiledRouteSummaryLine(summary);
  const bounded = renderHelpers.renderCompiledRouteSummaryLine(summary, { bounded: true });
  const revealed = renderHelpers.revealCompiledRouteSummaryTargets(summary);

  assert.equal(unbounded, legacyCompiledRouteSummaryLine(summary));
  assert.match(bounded, /targets=quality,review,opencode,\+2 more/);
  assert.match(bounded, /digest=[0-9a-f]{12}/);
  assert.equal(bounded.split(' targets=')[0], unbounded.split(' targets=')[0]);
  assert.deepEqual(revealed, summary.targets);
  for (const target of summary.targets) {
    assert.ok(bounded.includes(target) || revealed.includes(target), `target ${target} must be visible or revealable`);
  }
  assert.equal(
    renderHelpers.renderCompiledRouteSummaryLine(summary, { reveal: true }),
    unbounded,
  );
});

test('flag-off route rendering and plugin delivery remain byte-identical to the baseline', async () => {
  const renderHelpers = await loadRenderHelpers();
  const summary = compiledRouteSummary(['quality', 'review', 'opencode', 'webflow', 'typescript']);
  const baseline = legacyCompiledRouteSummaryLine(summary);

  assert.equal(renderHelpers.renderCompiledRouteSummaryLine(summary), baseline);
  assert.equal(renderHelpers.renderCompiledRouteSummaryLine(summary, { bounded: false }), baseline);

  const child = fakeChild({
    stdout: cliEnvelope({
      recommendations: [{
        ...CLI_RECOMMENDATION,
        compiledRoute: { action: summary.outcome, hubId: summary.hubId, targets: summary.targets },
      }],
    }),
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
  const renderHelpers = await loadRenderHelpers();
  const summary = compiledRouteSummary(['quality', 'review', 'opencode', 'webflow', 'typescript']);
  const child = fakeChild({
    stdout: cliEnvelope({
      recommendations: [{
        ...CLI_RECOMMENDATION,
        compiledRoute: { action: summary.outcome, hubId: summary.hubId, targets: summary.targets },
      }],
    }),
  });
  const hooks = await makePlugin({
    boundedCompiledRouteSummary: true,
    spawnOverride: spawnSequence([child]),
  });
  const output = await runPrompt(hooks);

  assert.equal(
    output.system[1],
    renderHelpers.renderCompiledRouteSummaryLine(summary, { bounded: true }),
  );
  assert.match(output.system[1], /\+2 more/);
});

test('target digest is stable for the same membership and changes for a changed omitted set', async () => {
  const renderHelpers = await loadRenderHelpers();
  const summary = compiledRouteSummary(['alpha', 'beta', 'gamma', 'delta', 'epsilon']);
  const reordered = compiledRouteSummary(['epsilon', 'delta', 'gamma', 'beta', 'alpha']);
  const changedOmitted = compiledRouteSummary(['alpha', 'beta', 'gamma', 'delta', 'zeta']);

  const digest = renderHelpers.compiledRouteSummaryTargetDigest(summary);
  assert.equal(renderHelpers.compiledRouteSummaryTargetDigest(reordered), digest);
  assert.notEqual(renderHelpers.compiledRouteSummaryTargetDigest(changedOmitted), digest);
  assert.match(
    renderHelpers.renderCompiledRouteSummaryLine(summary, { bounded: true }),
    new RegExp(`digest=${digest}`),
  );
});

test('bounded rendering preserves the cap boundary and handles empty or malformed summaries', async () => {
  const renderHelpers = await loadRenderHelpers();
  const exact = ['alpha', 'beta', 'gamma'];
  const exactLine = renderHelpers.renderCompiledRouteSummaryLine(
    compiledRouteSummary(exact),
    { bounded: true },
  );

  assert.doesNotMatch(exactLine, /\+\d+ more/);
  assert.equal(
    renderHelpers.renderCompiledRouteSummaryLine(compiledRouteSummary([]), { bounded: true }),
    'Compiled routing (served=compiled): hub=sk-code outcome=route targets=none',
  );
  assert.equal(renderHelpers.renderCompiledRouteSummaryLine(null, { bounded: true }), null);
  assert.deepEqual(renderHelpers.revealCompiledRouteSummaryTargets({ targets: ['alpha', 42] }), ['alpha']);
});

test('no-brief turns render the no-match head and hygiene context', async () => {
  const child = fakeChild({ stdout: cliEnvelope({ freshness: 'live', recommendations: [] }) });
  const calls = [];
  const hooks = await makePlugin({ spawnOverride: spawnSequence([child], calls) });

  const output = await runPrompt(hooks);

  assert.equal(output.system.length, 1);
  assert.equal(output.system[0], NO_MATCH_FALLBACK_CONTEXT);
  assert.equal(JSON.parse(child.stdinPayload).prompt, 'implement the plugin fix');
  assert.deepEqual(calls[0].args.slice(1), ['advisor_recommend', '--json', '-', '--format', 'json']);
  assert.equal(calls[0].args.some((argument) => argument.includes('implement the plugin fix')), false);
  assert.deepEqual(calls[0].options.stdio, ['pipe', 'pipe', 'ignore']);
});

test('the stdin request stays inside the byte budget when the prompt needs escaping', async () => {
  const child = fakeChild({ stdout: cliEnvelope({ freshness: 'live', recommendations: [] }) });
  const hooks = await makePlugin({ maxPromptBytes: 600, spawnOverride: spawnSequence([child]) });
  const prompt = 'fix "this"\n\u0001'.repeat(200);

  await runPrompt(hooks, { prompt });

  assert.ok(Buffer.byteLength(child.stdinPayload, 'utf8') <= 600);
  const sent = JSON.parse(child.stdinPayload).prompt;
  assert.ok(sent.length > 0);
  assert.ok(prompt.startsWith(sent));
});

test('a prompt over 10,000 characters is sent as its first 10,000', async () => {
  const child = fakeChild({ stdout: cliEnvelope({ freshness: 'live', recommendations: [] }) });
  const hooks = await makePlugin({ spawnOverride: spawnSequence([child]) });
  const prompt = 'implement the plugin fix '.repeat(1000);

  await runPrompt(hooks, { prompt });

  assert.equal(JSON.parse(child.stdinPayload).prompt, prompt.slice(0, 10_000));
});

test('a byte budget too small for any prompt fails open without spawning', async () => {
  const calls = [];
  const hooks = await makePlugin({ maxPromptBytes: 64, spawnOverride: spawnSequence([fakeChild()], calls) });
  const output = { system: [] };

  await runPrompt(hooks, {}, output);

  assert.equal(calls.length, 0);
  assert.equal(output.system[0], OUTAGE_FAIL_OPEN_FALLBACK_CONTEXT);
  assert.match(await status(hooks), /last_error_code=PROMPT_BUDGET/);
});

// The request is written before the spawn is known to have succeeded. A missing
// binary reports ENOENT afterwards, and the call must still settle.
test('a missing advisor binary fails open as a spawn error', async () => {
  const hooks = await makePlugin({ nodeBinaryOverride: '/nonexistent/advisor-node' });
  const output = { system: [] };

  await assert.doesNotReject(() => runPrompt(hooks, {}, output));

  assert.equal(output.system[0], OUTAGE_FAIL_OPEN_FALLBACK_CONTEXT);
  assert.match(await status(hooks), /last_error_code=SPAWN_ERROR/);
});

// The plugin spawns its CLI through a path relative to its own directory, so a
// missing link there fails every advisor call open while the spawn fakes pass.
test('the advisor CLI the plugin spawns exists on disk', async () => {
  const child = fakeChild({ stdout: cliEnvelope() });
  const calls = [];
  const hooks = await makePlugin({ spawnOverride: spawnSequence([child], calls) });

  await runPrompt(hooks);

  assert.equal(calls.length, 1);
  const cliPath = calls[0].args[0];
  assert.match(cliPath, /skill-advisor\.cjs$/);
  assert.equal(fs.existsSync(cliPath), true, `advisor CLI missing at ${cliPath}`);
});

test('missing prompts render the skipped head while disabled mode stays silent', async () => {
  const child = fakeChild({ stdout: bridgeEnvelope() });
  const hooks = await makePlugin({ spawnOverride: spawnSequence([child]) });
  const missing = await runPrompt(hooks, { prompt: undefined, sessionID: '__global__' });
  assert.equal(missing.system[0], SKIPPED_FALLBACK_CONTEXT);

  const disabledHooks = await makePlugin({ enabled: false, spawnOverride: spawnSequence([child]) });
  const disabled = await runPrompt(disabledHooks);
  assert.deepEqual(disabled.system, []);
});

test('CLI output is bounded and overflow terminates immediately', async () => {
  const child = fakeChild({
    stdout: cliEnvelope({ padding: 'x'.repeat(256 * 1024 + 1) }),
    close: false,
  });
  const hooks = await makePlugin({ spawnOverride: spawnSequence([child]) });

  const output = await runPrompt(hooks);

  assert.equal(output.system[0], OUTAGE_FAIL_OPEN_FALLBACK_CONTEXT);
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
  assert.equal(output.system[0], OUTAGE_FAIL_OPEN_FALLBACK_CONTEXT);
  assert.match(await status(hooks), /last_error_code=TIMEOUT/);

  const defaultHooks = await makePlugin({ enabled: false });
  assert.match(await status(defaultHooks), /bridge_timeout_ms=2500/);
});

test('multi-file freshness invalidates cache and ignores WAL-only mtime changes', async () => {
  const { root, advisorRoot, restoreDbDirEnv } = makeAdvisorFixture();
  try {
    const children = Array.from({ length: 8 }, () => fakeChild({ stdout: cliEnvelope({ freshness: 'live' }) }));
    const calls = [];
    const pluginModule = await loadPlugin();
    const hooks = await pluginModule.default.server({ directory: root }, {
      cacheTTLMs: 60_000,
      spawnOverride: spawnSequence(children, calls),
    });
    const prompt = { prompt: 'same prompt', sessionID: 'signature-session' };

    await runPrompt(hooks, prompt);
    await runPrompt(hooks, prompt);
    assert.equal(calls.length, 1, 'warm identical prompt should hit cache');

    writeFixtureFile(path.join(root, '.skilled', 'skills', 'demo', 'SKILL.md'), '# Demo changed\n');
    await runPrompt(hooks, prompt);
    writeFixtureFile(path.join(root, '.skilled', 'skills', 'demo', 'graph-metadata.json'), '{"name":"changed"}\n');
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
    restoreDbDirEnv();
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

test('the signature follows skills held only under the legacy source-root name', async () => {
  const { root, restoreDbDirEnv } = makeAdvisorFixture('.opencode');
  try {
    const children = Array.from({ length: 3 }, () => fakeChild({ stdout: cliEnvelope({ freshness: 'live' }) }));
    const calls = [];
    const pluginModule = await loadPlugin();
    const hooks = await pluginModule.default.server({ directory: root }, {
      cacheTTLMs: 60_000,
      spawnOverride: spawnSequence(children, calls),
    });
    const prompt = { prompt: 'same prompt', sessionID: 'legacy-root-session' };

    await runPrompt(hooks, prompt);
    await runPrompt(hooks, prompt);
    assert.equal(calls.length, 1, 'warm identical prompt should hit cache');

    writeFixtureFile(path.join(root, '.opencode', 'skills', 'demo', 'SKILL.md'), '# Demo changed\n');
    await runPrompt(hooks, prompt);
    assert.equal(calls.length, 2, 'a skill change under .opencode should invalidate cache');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    restoreDbDirEnv();
  }
});

test('a workspace without a source root is never served from cache', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'system-skill-advisor-no-source-'));
  try {
    const children = [fakeChild({ stdout: cliEnvelope({ freshness: 'live' }) }), fakeChild({ stdout: cliEnvelope({ freshness: 'live' }) })];
    const calls = [];
    const pluginModule = await loadPlugin();
    const hooks = await pluginModule.default.server({ directory: root }, {
      cacheTTLMs: 60_000,
      spawnOverride: spawnSequence(children, calls),
    });
    const prompt = { prompt: 'same prompt', sessionID: 'no-source-session' };

    await runPrompt(hooks, prompt);
    await runPrompt(hooks, prompt);
    assert.equal(calls.length, 2, 'an unsignable workspace must not reuse cached advice');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
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

test('concurrent unique advisor lookups keep at most two CLI children live', async () => {
  const calls = [];
  let liveChildren = 0;
  let maxLiveChildren = 0;
  const hooks = await makePlugin({
    spawnOverride: (binary, args, options) => {
      const child = fakeChild({ manual: true });
      calls.push({ binary, args, options, child });
      liveChildren += 1;
      maxLiveChildren = Math.max(maxLiveChildren, liveChildren);
      child.once('close', () => {
        liveChildren -= 1;
      });
      return child;
    },
  });
  const pending = Array.from({ length: 5 }, (_, index) => runPrompt(hooks, {
    sessionID: 'advisor-concurrency-session',
    prompt: `unique concurrency prompt ${index}`,
  }));
  const flush = () => new Promise((resolve) => setImmediate(resolve));
  const waitForCalls = async (expected) => {
    for (let attempt = 0; attempt < 100 && calls.length < expected; attempt += 1) {
      await flush();
    }
    assert.equal(calls.length, expected);
  };
  const release = (index) => {
    calls[index].child.stdout.emit('data', cliEnvelope({ freshness: 'live', recommendations: [] }));
    calls[index].child.emit('close', 0);
  };

  await flush();
  assert.equal(calls.length, 2);
  assert.equal(maxLiveChildren, 2);

  release(0);
  await waitForCalls(3);
  assert.equal(liveChildren, 2);

  release(1);
  await waitForCalls(4);
  assert.equal(liveChildren, 2);

  release(2);
  await waitForCalls(5);
  assert.equal(liveChildren, 2);

  release(3);
  await flush();
  assert.equal(liveChildren, 1);

  release(4);
  const outputs = await Promise.all(pending);
  assert.equal(maxLiveChildren, 2);
  for (const output of outputs) {
    assert.equal(output.system.length, 1);
  }
});

test('a queued lookup fails open at its queue deadline while the granted runs stay live', async () => {
  const { hooks, calls, flush, complete } = await holdAdvisorChildren(400);

  const held = [0, 1].map((index) => runPrompt(hooks, {
    sessionID: 'queue-deadline-held',
    prompt: `held slot prompt ${index}`,
  }));
  await flush();
  assert.equal(calls.length, 2);

  const queueSettled = [false, false, false];
  const queued = [0, 1, 2].map((index) => {
    const pending = runPrompt(hooks, {
      sessionID: `queue-deadline-${index}`,
      prompt: `queued lookup prompt ${index}`,
    });
    const record = () => { queueSettled[index] = true; };
    pending.then(record, record);
    return pending;
  });
  await flush();
  assert.equal(calls.length, 2, 'queued lookups must not spawn while both slots are held');

  // The queue waits before the held runs release, so the third queued lookup's
  // deadline lands inside the granted runs rather than at the same instant.
  await new Promise((resolve) => setTimeout(resolve, 40));
  assert.deepEqual(queueSettled, [false, false, false]);

  complete(0);
  complete(1);
  const heldOutputs = await Promise.all(held);
  for (const output of heldOutputs) {
    assert.notEqual(output.system[0], OUTAGE_FAIL_OPEN_FALLBACK_CONTEXT);
  }
  await flush();
  assert.equal(calls.length, 4, 'the first two queued lookups start once the slots free');

  const timedOut = await settleWithin(queued[2], 'third queued lookup');
  await flush();
  assert.equal(timedOut.system[0], OUTAGE_FAIL_OPEN_FALLBACK_CONTEXT);
  assert.match(await status(hooks), /last_error_code=QUEUE_TIMEOUT/);
  assert.deepEqual(queueSettled, [false, false, true]);
  assert.equal(calls.length, 4, 'a lookup past its queue deadline never spawns');

  complete(2);
  complete(3);
  await Promise.all(queued.slice(0, 2));
});

test('a queued lookup for a deleted session fails open on deletion', async () => {
  const { hooks, calls, flush, complete } = await holdAdvisorChildren(60_000);

  const held = [0, 1].map((index) => runPrompt(hooks, {
    sessionID: 'deletion-held',
    prompt: `deletion held prompt ${index}`,
  }));
  await flush();
  assert.equal(calls.length, 2);

  const queued = runPrompt(hooks, {
    sessionID: 'deletion-queued',
    prompt: 'deletion queued prompt',
  });
  await flush();
  assert.equal(calls.length, 2, 'a queued lookup holds no slot and spawns no child');

  await hooks.event({
    event: { type: 'session.deleted', properties: { info: { id: 'deletion-queued' } } },
  });

  const output = await settleWithin(queued, 'queued lookup for a deleted session');
  assert.equal(output.system[0], OUTAGE_FAIL_OPEN_FALLBACK_CONTEXT);
  assert.match(await status(hooks), /last_error_code=SESSION_DELETED/);
  assert.equal(calls.length, 2, 'the deleted session lookup never spawns');

  complete(0);
  complete(1);
  const heldOutputs = await Promise.all(held);
  for (const heldOutput of heldOutputs) {
    assert.notEqual(heldOutput.system[0], OUTAGE_FAIL_OPEN_FALLBACK_CONTEXT);
  }
});

test('a queue deadline leaves both slots free for later lookups', async () => {
  const { hooks, calls, flush, complete } = await holdAdvisorChildren(400);

  const held = [0, 1].map((index) => runPrompt(hooks, {
    sessionID: 'deadline-held',
    prompt: `deadline held prompt ${index}`,
  }));
  await flush();

  const queued = [0, 1, 2].map((index) => runPrompt(hooks, {
    sessionID: `deadline-queued-${index}`,
    prompt: `deadline queued prompt ${index}`,
  }));
  await flush();
  await new Promise((resolve) => setTimeout(resolve, 40));

  complete(0);
  complete(1);
  const heldOutputs = await Promise.all(held);
  for (const output of heldOutputs) {
    assert.match(output.system[0], /^Advisor:/);
    assert.notEqual(output.system[0], OUTAGE_FAIL_OPEN_FALLBACK_CONTEXT);
  }
  await flush();
  assert.equal(calls.length, 4);

  const timedOut = await settleWithin(queued[2], 'queued lookup at its deadline');
  assert.equal(timedOut.system[0], OUTAGE_FAIL_OPEN_FALLBACK_CONTEXT);

  // Both granted runs still hold their slots at the third deadline, so their
  // release is what has to leave the slot count at zero.
  complete(2);
  complete(3);
  await Promise.all(queued.slice(0, 2));

  const after = [0, 1].map((index) => runPrompt(hooks, {
    sessionID: `deadline-after-${index}`,
    prompt: `deadline after queue prompt ${index}`,
  }));
  await flush();
  assert.equal(calls.length, 6, 'both slots accept the next lookups without waiting');

  complete(4);
  complete(5);
  await Promise.all(after);
});

test('cache TTL starts when CLI work completes', async () => {
  const calls = [];
  const children = [
    fakeChild({ stdout: cliEnvelope({ freshness: 'live' }), delayMs: 40 }),
    fakeChild({ stdout: cliEnvelope({ freshness: 'live' }) }),
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

  assert.equal(output.system[0], OUTAGE_FAIL_OPEN_FALLBACK_CONTEXT);
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

test('Claude source clamps prompts, keeps fallback parity, and flushes fail-open output', () => {
  const hookSource = fs.readFileSync(CLAUDE_HOOK_PATH, 'utf8');
  const rendererSource = fs.readFileSync(RENDERER_PATH, 'utf8');

  assert.match(hookSource, /DEFAULT_CLAUDE_HOOK_TIMEOUT_MS = 2500/);
  assert.match(hookSource, /MAX_PROMPT_BYTES = 64 \* 1024/);
  assert.match(hookSource, /Buffer\.byteLength\(value\.slice/);
  assert.match(hookSource, /brief \?\? renderAdvisorFallbackDirective\(renderOptions, result\)/);
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
  const child = fakeChild({ stdout: cliEnvelope({ freshness: 'live', recommendations: [] }) });
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
    { transform: 'system-skill-advisor', outcome: 'delivered' },
    { transform: 'system-skill-advisor', outcome: 'suppressed_duplicate' },
  ]);
});

test('distinct advisor messages with identical text both receive full delivery', async () => {
  const previousLifecycleDedup = process.env.SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP;
  // Lifecycle dedup is off because it correctly reduces repeats to their head; this tests transform dedup alone.
  process.env.SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP = '0';
  try {
    const child = fakeChild({ stdout: cliEnvelope({ freshness: 'live', recommendations: [] }) });
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
  } finally {
    if (previousLifecycleDedup === undefined) {
      delete process.env.SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP;
    } else {
      process.env.SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP = previousLifecycleDedup;
    }
  }
});

test('flag-off advisor delivery preserves repeated output byte-for-byte', async () => {
  const previousLifecycleDedup = process.env.SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP;
  // Lifecycle dedup is off because it correctly reduces repeats to their head; this tests transform dedup alone.
  process.env.SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP = '0';
  try {
    const child = fakeChild({ stdout: cliEnvelope({ freshness: 'live', recommendations: [] }) });
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
  } finally {
    if (previousLifecycleDedup === undefined) {
      delete process.env.SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP;
    } else {
      process.env.SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP = previousLifecycleDedup;
    }
  }
});

test('unresolvable advisor identity fails open with full delivery', async () => {
  const previousLifecycleDedup = process.env.SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP;
  // Lifecycle dedup is off because it correctly reduces repeats to their head; this tests transform dedup alone.
  process.env.SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP = '0';
  try {
    const child = fakeChild({ stdout: cliEnvelope({ freshness: 'live', recommendations: [] }) });
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
  } finally {
    if (previousLifecycleDedup === undefined) {
      delete process.env.SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP;
    } else {
      process.env.SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP = previousLifecycleDedup;
    }
  }
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
    transform: 'system-skill-advisor',
    state,
  }).shouldDeliver, true);
  identityModule.commitTransformDelivery(identity, blockId, contentHash, {
    transform: 'system-skill-advisor',
    state,
  });
  assert.equal(identityModule.recordTransformContribution({
    identity,
    blockId,
    contentHash,
    transform: 'second-transform',
    state,
  }).shouldDeliver, false);
  identityModule.commitTransformDelivery(identity, blockId, contentHash, {
    transform: 'second-transform',
    state,
  });

  const receipt = identityModule.getMultiTransformReceipt(identity, state);
  assert.deepEqual(receipt.transforms.map((entry) => ({
    transform: entry.transform,
    blockId: entry.blockId,
    outcome: entry.outcome,
  })), [
    { transform: 'system-skill-advisor', blockId, outcome: 'delivered' },
    { transform: 'second-transform', blockId, outcome: 'suppressed_duplicate' },
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
    transform: 'system-skill-advisor',
    state,
  });
  const second = identityModule.recordTransformContribution({
    identity,
    blockId,
    contentHash,
    transform: 'second-transform',
    state,
  });
  assert.equal(first.shouldDeliver, true);
  assert.equal(second.shouldDeliver, false);
  assert.equal(second.contended, true);

  identityModule.commitTransformDelivery(identity, blockId, contentHash, {
    transform: 'system-skill-advisor',
    state,
  });
  const third = identityModule.recordTransformContribution({
    identity,
    blockId,
    contentHash,
    transform: 'second-transform',
    state,
  });
  assert.equal(third.shouldDeliver, false);
  assert.equal(third.duplicate, true);
});

test('consecutive signatures over unchanged files hash each source file once', async () => {
  const { root, advisorRoot, restoreDbDirEnv } = makeAdvisorFixture();
  const reads = [];
  try {
    const pluginModule = await loadSignatureProbePlugin();
    globalThis.__advisorSignatureReads = reads;
    const children = [
      fakeChild({ stdout: cliEnvelope({ freshness: 'live' }) }),
      fakeChild({ stdout: cliEnvelope({ freshness: 'live' }) }),
    ];
    const calls = [];
    const hooks = await pluginModule.default.server({ directory: root }, {
      spawnOverride: spawnSequence(children, calls),
    });

    await runPrompt(hooks, { prompt: 'first signature', sessionID: 'signature-read-session' });
    await runPrompt(hooks, { prompt: 'second signature', sessionID: 'signature-read-session' });

    assert.equal(calls.length, 2, 'distinct prompts should each compute the signature');
    const counts = new Map();
    for (const filePath of reads) {
      if (filePath.startsWith(`${root}${path.sep}`)) {
        counts.set(filePath, (counts.get(filePath) ?? 0) + 1);
      }
    }
    const skillRoot = path.join(root, '.skilled', 'skills');
    const trackedFiles = [
      path.join(skillRoot, 'demo', 'SKILL.md'),
      path.join(skillRoot, 'demo', 'graph-metadata.json'),
      path.join(skillRoot, 'system-spec-kit', 'SKILL.md'),
      path.join(advisorRoot, 'scripts', 'skill_advisor.py'),
      path.join(advisorRoot, 'scripts', 'skill_advisor_runtime.py'),
      path.join(advisorRoot, 'scripts', 'skill_graph_compiler.py'),
      path.join(advisorRoot, 'scripts', 'skill-graph.json'),
      path.join(advisorRoot, 'database', 'skill-graph.sqlite'),
    ];
    for (const filePath of trackedFiles) {
      assert.equal(
        counts.get(filePath),
        1,
        `${filePath} should be read once across two signatures`,
      );
    }
  } finally {
    delete globalThis.__advisorSignatureReads;
    fs.rmSync(root, { recursive: true, force: true });
    restoreDbDirEnv();
  }
});

test('changing one source file changes the signature without rehashing unchanged files', async () => {
  const { root, restoreDbDirEnv } = makeAdvisorFixture();
  const reads = [];
  try {
    const pluginModule = await loadSignatureProbePlugin();
    globalThis.__advisorSignatureReads = reads;
    const children = Array.from(
      { length: 3 },
      () => fakeChild({ stdout: cliEnvelope({ freshness: 'live' }) }),
    );
    const calls = [];
    const hooks = await pluginModule.default.server({ directory: root }, {
      cacheTTLMs: 60_000,
      spawnOverride: spawnSequence(children, calls),
    });
    const prompt = { prompt: 'same prompt', sessionID: 'signature-change-session' };
    const demoSkill = path.join(root, '.skilled', 'skills', 'demo', 'SKILL.md');

    await runPrompt(hooks, prompt);
    await runPrompt(hooks, prompt);
    assert.equal(calls.length, 1, 'unchanged sources keep the cached advice');

    const readsBeforeChange = reads.length;
    writeFixtureFile(demoSkill, '# Demo changed\n');

    await runPrompt(hooks, prompt);
    assert.equal(calls.length, 2, 'changed content must produce a new signature');

    const rehashed = reads.slice(readsBeforeChange)
      .filter((filePath) => filePath.startsWith(`${root}${path.sep}`));
    assert.deepEqual(rehashed, [demoSkill], 'only the changed file is read again');
  } finally {
    delete globalThis.__advisorSignatureReads;
    fs.rmSync(root, { recursive: true, force: true });
    restoreDbDirEnv();
  }
});
