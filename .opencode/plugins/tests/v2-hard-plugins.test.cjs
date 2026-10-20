// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode V2 Hard Plugin Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { after, test } = require('node:test');
const { pathToFileURL } = require('node:url');

const { readInventory } = require('./helpers/plugin-inventory.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PLUGIN_DIR = path.resolve(__dirname, '..');
const TEST_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'v2-hard-plugins-'));
const GOAL_STATE_DIR = path.join(TEST_ROOT, 'goal-state');
const ORIGINAL_GOAL_STATE_DIR = process.env.OPENCODE_GOAL_STATE_DIR;

process.env.OPENCODE_GOAL_STATE_DIR = GOAL_STATE_DIR;

const PLUGINS = [
  {
    name: 'system-completion-sentinel',
    file: 'system-completion-sentinel.js',
    registrations: [['event', 'subscribe']],
  },
  {
    name: 'system-spec-gate',
    file: 'system-spec-gate.js',
    registrations: [
      ['event', 'subscribe'],
      ['session', 'hook', 'context'],
      ['tool', 'hook', 'execute.before'],
    ],
  },
  {
    name: 'system-skill-advisor',
    file: 'system-skill-advisor.js',
    registrations: [
      ['event', 'subscribe'],
      ['session', 'hook', 'context'],
      ['tool', 'transform'],
    ],
  },
  {
    name: 'opencode-goal',
    file: 'opencode-goal.js',
    registrations: [
      ['event', 'subscribe'],
      ['tool', 'transform'],
    ],
  },
  {
    name: 'sk-vision',
    file: 'sk-vision.js',
    registrations: [['command', 'transform']],
  },
];

after(() => {
  if (ORIGINAL_GOAL_STATE_DIR === undefined) {
    delete process.env.OPENCODE_GOAL_STATE_DIR;
  } else {
    process.env.OPENCODE_GOAL_STATE_DIR = ORIGINAL_GOAL_STATE_DIR;
  }
  fs.rmSync(TEST_ROOT, { recursive: true, force: true });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

function makeProjectDirectory(label) {
  return fs.mkdtempSync(path.join(TEST_ROOT, label + '-'));
}

async function loadPlugin(file) {
  const pluginUrl = pathToFileURL(path.join(PLUGIN_DIR, file)).href;
  return (await import(pluginUrl)).default;
}

function assertPluginDefinition(plugin, name) {
  assert.ok(
    plugin !== null && typeof plugin === 'object' && !Array.isArray(plugin),
    name + ' default export must be a non-function object',
  );
  assert.equal(typeof plugin.id, 'string', name + ' must have a string id');
  assert.equal(typeof plugin.setup, 'function', name + ' must have a setup function');
  assert.equal(typeof plugin.server, 'function', name + ' must have a server function');
}

function createEventStream(signal) {
  const events = [];
  const readers = [];
  let isClosed = false;

  const close = () => {
    if (isClosed) return;
    isClosed = true;
    for (const queued of events.splice(0)) queued.resolve();
    while (readers.length > 0) readers.shift()({ done: true });
    signal?.removeEventListener('abort', close);
  };

  const stream = {
    [Symbol.asyncIterator]() {
      return this;
    },
    next() {
      if (events.length > 0) {
        const queued = events.shift();
        queued.resolve();
        return Promise.resolve({ value: queued.value, done: false });
      }
      if (isClosed) return Promise.resolve({ done: true });
      return new Promise((resolve) => readers.push(resolve));
    },
    return() {
      close();
      return Promise.resolve({ done: true });
    },
    push(value) {
      if (isClosed) return Promise.resolve();
      return new Promise((resolve) => {
        const queued = { value, resolve };
        if (readers.length > 0) {
          const read = readers.shift();
          resolve();
          read({ value, done: false });
        } else {
          events.push(queued);
        }
      });
    },
  };

  if (signal?.aborted) close();
  else signal?.addEventListener('abort', close, { once: true });

  return stream;
}

function createEditor(definitions) {
  return {
    add(definition) {
      definitions.set(definition.name, definition);
    },
    list() {
      return [...definitions.values()];
    },
    get(name) {
      return definitions.get(name);
    },
    namespace() {},
    update(name, update) {
      const definition = definitions.get(name);
      if (definition) update(definition);
    },
    remove(name) {
      definitions.delete(name);
    },
  };
}

function createV2Context({ directory, contextMessages = [] }) {
  const registrations = [];
  const eventStreams = [];
  const tools = new Map();
  const commands = new Map();
  const sessionCalls = {
    context: [],
    prompt: [],
    create: [],
    generate: [],
    remove: [],
  };

  const disposable = () => ({ dispose: async () => {} });
  const register = (surface, member, args, handler) => {
    registrations.push({ surface, member, args, handler });
    return disposable();
  };

  const context = {
    location: { directory },
    event: {
      subscribe(options = {}) {
        registrations.push({ surface: 'event', member: 'subscribe', args: [options] });
        const stream = createEventStream(options.signal);
        eventStreams.push(stream);
        return stream;
      },
    },
    tool: {
      hook(name, handler, options) {
        return register('tool', 'hook', [name, options], handler);
      },
      async transform(transformer) {
        register('tool', 'transform', [], transformer);
        await transformer(createEditor(tools));
        return disposable();
      },
    },
    session: {
      hook(name, handler, options) {
        return register('session', 'hook', [name, options], handler);
      },
      async context(input) {
        sessionCalls.context.push(input);
        return typeof contextMessages === 'function'
          ? contextMessages(input)
          : contextMessages;
      },
      async prompt(input) {
        sessionCalls.prompt.push(input);
        return {
          id: 'inbox-item',
          sessionID: input.sessionID,
          delivery: input.delivery,
        };
      },
      async create(input = {}) {
        sessionCalls.create.push(input);
        return { id: 'created-session' };
      },
      async generate(input) {
        sessionCalls.generate.push(input);
        return { text: '{"verdict":"not_met","confidence":0,"reason":"incomplete"}' };
      },
      async remove(input) {
        sessionCalls.remove.push(input);
      },
    },
    command: {
      async transform(transformer) {
        register('command', 'transform', [], transformer);
        await transformer(createEditor(commands));
        return disposable();
      },
    },
  };

  async function publishEvent(event) {
    assert.ok(eventStreams.length > 0, 'plugin must subscribe before receiving an event');
    const barrier = {
      id: 'test-barrier',
      type: 'session.status',
      created: new Date().toISOString(),
      data: {
        sessionID: event.data.sessionID,
        status: { type: 'busy' },
      },
    };
    await Promise.all(eventStreams.map(async (stream) => {
      await stream.push(event);
      await stream.push(barrier);
    }));
  }

  return {
    context,
    registrations,
    sessionCalls,
    tools,
    commands,
    publishEvent,
  };
}

function hasRegistration(fixture, [surface, member, firstArgument]) {
  return fixture.registrations.some((registration) => (
    registration.surface === surface
    && registration.member === member
    && (firstArgument === undefined || registration.args[0] === firstArgument)
  ));
}

async function withEnvironment(values, callback) {
  const previous = new Map();
  for (const [name, value] of Object.entries(values)) {
    previous.set(name, process.env[name]);
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
  try {
    return await callback();
  } finally {
    for (const [name, value] of previous) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
}

function v2Event(type, data, id) {
  return {
    id,
    type,
    created: new Date().toISOString(),
    data,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. REGISTRATION CASES
// ─────────────────────────────────────────────────────────────────────────────

for (const pluginCase of PLUGINS) {
  test(pluginCase.name + ' exports and registers v2 hooks', async () => {
    const projectDir = makeProjectDirectory('registration');
    let cleanup;
    const fixture = createV2Context({ directory: projectDir });

    try {
      const plugin = await loadPlugin(pluginCase.file);
      assertPluginDefinition(plugin, pluginCase.name);

      cleanup = await plugin.setup(fixture.context);

      assert.equal(typeof cleanup, 'function', pluginCase.name + ' setup must return cleanup');
      assert.ok(fixture.registrations.length > 0, pluginCase.name + ' must register v2 hooks');
      for (const expected of pluginCase.registrations) {
        assert.ok(
          hasRegistration(fixture, expected),
          pluginCase.name + ' must register ' + expected.join('.'),
        );
      }
    } finally {
      try {
        if (cleanup) await cleanup();
      } finally {
        fs.rmSync(projectDir, { recursive: true, force: true });
      }
    }
  });
}

test('every native-dual exception has a hard-plugin case', () => {
  for (const stem of readInventory().nativeDual) {
    assert.ok(
      PLUGINS.some((pluginCase) => pluginCase.name === stem),
      stem + ' is a native-dual exception without a v2 registration case',
    );
  }
});

test('every hard-plugin case names a plugin in the inventory', () => {
  const inventory = readInventory();
  const knownPlugins = [...inventory.bridged, ...inventory.nativeDual];
  for (const pluginCase of PLUGINS) {
    assert.ok(
      knownPlugins.includes(pluginCase.name),
      pluginCase.name + ' has a case but no plugin file',
    );
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. BEHAVIOUR CASES
// ─────────────────────────────────────────────────────────────────────────────

test('system-completion-sentinel records an advisory after a completed session event', async () => {
  const projectDir = makeProjectDirectory('sentinel');
  const sessionID = 'sentinel-session';
  const specFolder = 'specs/001-demo';
  const claimText = 'The work for ' + specFolder + ' is complete.';
  fs.mkdirSync(path.join(projectDir, specFolder), { recursive: true });

  const fixture = createV2Context({
    directory: projectDir,
    contextMessages: [{
      id: 'assistant-message',
      type: 'assistant',
      content: [{ type: 'text', text: claimText }],
    }],
  });
  let cleanup;

  try {
    await withEnvironment({
      SYSTEM_HOOKS_DISABLED: undefined,
      MK_HOOKS_DISABLED: undefined,
      SYSTEM_COMPLETION_SENTINEL_DISABLED: undefined,
      SYSTEM_SPECKIT_COMPLETION_DISABLED: undefined,
      MK_COMPLETION_DISABLED: undefined,
      MK_COMPLETION_SENTINEL_DISABLED: undefined,
      MK_SPECKIT_COMPLETION_DISABLED: undefined,
    }, async () => {
      const plugin = await loadPlugin('system-completion-sentinel.js');
      assertPluginDefinition(plugin, 'system-completion-sentinel');
      cleanup = await plugin.setup(fixture.context);

      await fixture.publishEvent(v2Event(
        'session.execution.succeeded',
        { sessionID },
        'sentinel-completion-event',
      ));

      const logPath = path.join(
        projectDir,
        '.skilled',
        'logs',
        'completion-sentinel-advisories.log',
      );
      const log = fs.readFileSync(logPath, 'utf8');
      assert.match(
        log,
        /claimed done but no implementation-summary\.md recorded in specs\/001-demo/,
      );
      assert.ok(fixture.sessionCalls.context.some((input) => input.sessionID === sessionID));
    });
  } finally {
    try {
      if (cleanup) await cleanup();
    } finally {
      fs.rmSync(projectDir, { recursive: true, force: true });
    }
  }
});

test('system-spec-gate rejects a denied write through execute.before', async () => {
  const projectDir = makeProjectDirectory('spec-gate');
  const sessionID = 'spec-gate-session';
  fs.mkdirSync(path.join(projectDir, 'src'), { recursive: true });
  fs.writeFileSync(
    path.join(projectDir, 'src', 'login.ts'),
    'export const login = true;\n',
    'utf8',
  );

  const fixture = createV2Context({
    directory: projectDir,
    contextMessages: [{
      id: 'user-message',
      type: 'user',
      text: 'fix the login bug',
    }],
  });
  let cleanup;

  try {
    await withEnvironment({
      SYSTEM_HOOKS_DISABLED: undefined,
      MK_HOOKS_DISABLED: undefined,
      SYSTEM_SPEC_GATE_DISABLED: undefined,
      MK_SPEC_GATE_DISABLED: undefined,
      SPECKIT_SPEC_GATE_DISABLED: undefined,
      SYSTEM_SPEC_GATE_ENFORCE: '1',
      AI_SESSION_CHILD: undefined,
    }, async () => {
      const plugin = await loadPlugin('system-spec-gate.js');
      assertPluginDefinition(plugin, 'system-spec-gate');
      cleanup = await plugin.setup(fixture.context);

      const contextRegistration = fixture.registrations.find((registration) => (
        registration.surface === 'session'
        && registration.member === 'hook'
        && registration.args[0] === 'context'
      ));
      const toolRegistration = fixture.registrations.find((registration) => (
        registration.surface === 'tool'
        && registration.member === 'hook'
        && registration.args[0] === 'execute.before'
      ));
      assert.ok(contextRegistration, 'spec gate must register a v2 context hook');
      assert.ok(toolRegistration, 'spec gate must register execute.before');

      await contextRegistration.handler({
        sessionID,
        agent: 'test-agent',
        model: { providerID: 'test-provider', modelID: 'test-model' },
        system: [],
        messages: [],
        options: {},
        tools: {},
      });
      await assert.rejects(
        () => toolRegistration.handler({
          tool: 'write',
          sessionID,
          agent: 'build',
          messageID: 'assistant-message',
          id: 'write-call',
          input: { filePath: 'src/login.ts' },
        }),
        /system-spec-gate:/,
      );
    });
  } finally {
    try {
      if (cleanup) await cleanup();
    } finally {
      fs.rmSync(projectDir, { recursive: true, force: true });
    }
  }
});

test('opencode-goal queues its continuation through session.prompt', async () => {
  const projectDir = makeProjectDirectory('goal');
  const sessionID = 'goal-continuation-session';
  const fixture = createV2Context({ directory: projectDir });
  let cleanup;

  try {
    await withEnvironment({
      SYSTEM_HOOKS_DISABLED: undefined,
      MK_HOOKS_DISABLED: undefined,
      OPENCODE_GOAL_DISABLED: undefined,
      OPENCODE_GOAL_PLUGIN_DISABLED: undefined,
      MK_GOAL_DISABLED: undefined,
      MK_GOAL_PLUGIN_DISABLED: undefined,
      OPENCODE_GOAL_AUTONOMY: 'active',
    }, async () => {
      const plugin = await loadPlugin('opencode-goal.js');
      assertPluginDefinition(plugin, 'opencode-goal');
      cleanup = await plugin.setup(fixture.context);

      const goalTool = fixture.tools.get('opencode_goal');
      assert.ok(goalTool && typeof goalTool.execute === 'function');
      await goalTool.execute(
        { action: 'set', objective: 'Finish the requested implementation' },
        {
          sessionID,
          directory: projectDir,
          signal: new AbortController().signal,
          progress: async () => {},
        },
      );

      await fixture.publishEvent(v2Event(
        'session.execution.succeeded',
        { sessionID },
        'goal-completion-event',
      ));

      assert.equal(fixture.sessionCalls.prompt.length, 1);
      assert.equal(fixture.sessionCalls.prompt[0].sessionID, sessionID);
      assert.equal(fixture.sessionCalls.prompt[0].delivery, 'queue');
    });
  } finally {
    try {
      if (cleanup) await cleanup();
    } finally {
      fs.rmSync(projectDir, { recursive: true, force: true });
    }
  }
});

test('opencode-goal records v2 assistant evidence and token usage from session events', async () => {
  const projectDir = makeProjectDirectory('goal-events');
  const sessionID = 'goal-events-session';
  const fixture = createV2Context({ directory: projectDir });
  let cleanup;

  try {
    await withEnvironment({
      SYSTEM_HOOKS_DISABLED: undefined,
      MK_HOOKS_DISABLED: undefined,
      OPENCODE_GOAL_DISABLED: undefined,
      OPENCODE_GOAL_PLUGIN_DISABLED: undefined,
      MK_GOAL_DISABLED: undefined,
      MK_GOAL_PLUGIN_DISABLED: undefined,
      OPENCODE_GOAL_AUTONOMY: 'active',
    }, async () => {
      const plugin = await loadPlugin('opencode-goal.js');
      assertPluginDefinition(plugin, 'opencode-goal');
      cleanup = await plugin.setup(fixture.context);

      const goalTool = fixture.tools.get('opencode_goal');
      assert.ok(goalTool && typeof goalTool.execute === 'function');
      await goalTool.execute(
        { action: 'set', objective: 'Record assistant evidence and usage' },
        {
          sessionID,
          directory: projectDir,
          signal: new AbortController().signal,
          progress: async () => {},
        },
      );

      const goalCoreUrl = pathToFileURL(
        path.join(PLUGIN_DIR, 'lib', 'opencode-goal-core.js'),
      ).href;
      const goalCoreModule = await import(goalCoreUrl);
      const goalCore = goalCoreModule.getGoalCore(plugin.server);
      assert.equal(
        (await goalCore.readGoal(sessionID, { stateDir: GOAL_STATE_DIR })).status,
        'active',
      );

      const assistantMessageID = 'goal-events-assistant';
      const assistantText = 'The goal was completed successfully.';
      await fixture.publishEvent(v2Event(
        'session.text.ended',
        { sessionID, assistantMessageID, ordinal: 1, text: assistantText },
        'goal-text-ended-event',
      ));
      await fixture.publishEvent(v2Event(
        'session.step.ended',
        {
          sessionID,
          assistantMessageID,
          finish: 'stop',
          cost: 0.001,
          tokens: {
            input: 9,
            output: 4,
            reasoning: 0,
            cache: { read: 0, write: 0 },
          },
        },
        'goal-step-ended-event',
      ));

      const goalState = await goalCore.readGoal(sessionID, { stateDir: GOAL_STATE_DIR });
      assert.equal(goalState.lastEvidence, assistantText);
      assert.ok(goalState.tokensUsed > 0);
    });
  } finally {
    try {
      if (cleanup) await cleanup();
    } finally {
      fs.rmSync(projectDir, { recursive: true, force: true });
    }
  }
});

test('system-skill-advisor clears session transform dedup after compaction', async () => {
  const projectDir = makeProjectDirectory('skill-advisor');
  const sessionID = 'advisor-compaction-session';
  const fixture = createV2Context({ directory: projectDir });
  const identityModuleUrl = pathToFileURL(
    path.join(PLUGIN_DIR, 'lib', 'opencode-message-identity.js'),
  ).href;
  const messageIdentity = await import(identityModuleUrl);
  let cleanup;

  try {
    await withEnvironment({
      SYSTEM_HOOKS_DISABLED: undefined,
      MK_HOOKS_DISABLED: undefined,
      SYSTEM_SKILL_ADVISOR_HOOK_DISABLED: undefined,
      SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED: undefined,
      SPECKIT_SKILL_ADVISOR_HOOK_DISABLED: undefined,
      SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED: undefined,
    }, async () => {
      messageIdentity.clearTransformDedupState();
      const identity = messageIdentity.resolveMessageIdentity({
        sessionID,
        messageID: 'assistant-message',
        transformCallOrdinal: 1,
      });
      const blockId = 'advisor-directive';
      const contentHash = messageIdentity.hashPolicyBlockContent(blockId, 'directive', 0);

      assert.ok(identity);
      assert.ok(contentHash);
      assert.equal(
        messageIdentity.checkAndRegisterDelivery(identity, blockId, contentHash, 'test-transform'),
        false,
      );
      assert.equal(
        messageIdentity.isTransformDuplicate(identity, blockId, contentHash, 'test-transform'),
        true,
      );

      const plugin = await loadPlugin('system-skill-advisor.js');
      assertPluginDefinition(plugin, 'system-skill-advisor');
      cleanup = await plugin.setup(fixture.context);
      await fixture.publishEvent(v2Event(
        'session.compaction.ended',
        { sessionID, reason: 'manual', text: 'Summary', recent: [] },
        'advisor-compaction-event',
      ));

      assert.equal(
        messageIdentity.isTransformDuplicate(identity, blockId, contentHash, 'test-transform'),
        false,
      );
    });
  } finally {
    try {
      if (cleanup) await cleanup();
    } finally {
      messageIdentity.clearTransformDedupState();
      fs.rmSync(projectDir, { recursive: true, force: true });
    }
  }
});
