// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode v2 Bridge Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

function createV2Context() {
  const registrations = [];
  const toolHooks = new Map();
  const sessionHooks = new Map();
  const context = {
    location: { directory: '/workspace/project' },
    event: {},
    tool: {},
    session: {},
  };

  function register(kind, handler) {
    const registration = {
      kind,
      handler,
      disposed: false,
      async dispose() {
        registration.disposed = true;
      },
    };
    registrations.push(registration);
    return Promise.resolve(registration);
  }

  context.tool.hook = (name, handler) => {
    toolHooks.set(name, handler);
    return register(`tool.${name}`, handler);
  };
  context.tool.transform = (transform) => {
    const editor = {
      tools: [],
      add(definition) {
        this.tools.push(definition);
      },
    };
    const returnedEditor = transform(editor);
    context.editor = editor;
    context.returnedEditor = returnedEditor;
    return register('tool.transform', transform);
  };
  context.session.hook = (name, handler) => {
    sessionHooks.set(name, handler);
    return register(`session.${name}`, handler);
  };

  return { context, registrations, toolHooks, sessionHooks };
}

async function forwardEventToV1(event) {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context } = createV2Context();
  let resolveReceived;
  const received = new Promise((resolve) => {
    resolveReceived = resolve;
  });

  context.event.subscribe = () => (async function* () {
    yield event;
  })();

  const plugin = dualPlugin('event-payload-test', async () => ({
    event: async ({ event: v1Event }) => resolveReceived(v1Event),
  }));
  const cleanup = await plugin.setup(context);

  try {
    return await received;
  } finally {
    await cleanup();
  }
}

test('session.created adds v1 session info while preserving v2 event data', async () => {
  const v1Event = await forwardEventToV1({
    type: 'session.created',
    data: { sessionID: 'session_created' },
  });

  assert.equal(v1Event.properties.info.id, 'session_created');
  assert.deepEqual(v1Event, {
    type: 'session.created',
    properties: { sessionID: 'session_created', info: { id: 'session_created' } },
  });
});

test('session events keep an existing info payload unchanged', async () => {
  const data = { sessionID: 'session_existing', info: { id: 'existing' } };
  const v1Event = await forwardEventToV1({ type: 'session.updated', data });

  assert.strictEqual(v1Event.properties, data);
});

test('message events do not gain session info', async () => {
  const data = { sessionID: 'session_message', messageID: 'message_1' };
  const v1Event = await forwardEventToV1({ type: 'message.updated', data });

  assert.strictEqual(v1Event.properties, data);
  assert.equal(Object.hasOwn(v1Event.properties, 'info'), false);
});

test('setup bridges mapped hooks, counts skipped keys, and cleans up registrations and events', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { z } = await import('zod');
  const { context, registrations, toolHooks, sessionHooks } = createV2Context();
  const event = {
    id: 'evt_1',
    created: 1,
    type: 'session.execution.started',
    location: { directory: '/workspace/project' },
    data: { sessionID: 'session_1' },
  };
  let eventSignal;
  let eventLoopStopped = false;
  let resolveEvent;
  const eventReceived = new Promise((resolve) => {
    resolveEvent = resolve;
  });
  const receivedEvents = [];
  const beforeArgs = { path: 'original.txt' };
  const updatedArgs = { path: 'updated.txt' };
  const toolResult = async (args) => `processed ${args.query}`;
  let beforePair;
  let afterPair;
  let systemPair;
  let disposeCalls = 0;

  context.event.subscribe = ({ signal }) => {
    eventSignal = signal;
    return (async function* () {
      yield event;
      await new Promise((resolve) => signal.addEventListener('abort', resolve, { once: true }));
      eventLoopStopped = true;
    })();
  };

  const plugin = dualPlugin('bridge-test', async (input) => {
    assert.deepEqual(input, {
      client: undefined,
      project: undefined,
      worktree: '/workspace/project',
      directory: '/workspace/project',
      experimental_workspace: undefined,
      serverUrl: undefined,
      $: undefined,
    });
    return {
      event: async ({ event: v1Event }) => {
        receivedEvents.push(v1Event);
        resolveEvent();
      },
      'tool.execute.before': async (inputPair, outputPair) => {
        beforePair = { input: inputPair, args: outputPair.args };
        outputPair.args = updatedArgs;
      },
      'tool.execute.after': async (inputPair, outputPair) => {
        afterPair = { input: inputPair, output: outputPair };
      },
      'experimental.chat.system.transform': async (inputPair, outputPair) => {
        systemPair = { input: inputPair, initialSystem: [...outputPair.system] };
        outputPair.system.push('First system note', 'Second system note');
      },
      tool: {
        example: {
          description: 'Example tool',
          args: { query: z.string() },
          execute: toolResult,
        },
      },
      'chat.message': async () => {},
      dispose: async () => {
        disposeCalls += 1;
      },
    };
  });

  assert.deepEqual(Object.keys(plugin), ['id', 'server', 'setup']);
  const cleanup = await plugin.setup(context);

  await eventReceived;
  assert.deepEqual(receivedEvents, [{
    type: event.type,
    properties: { ...event.data, info: { id: 'session_1' } },
  }]);
  assert.deepEqual([...toolHooks.keys()], ['execute.before', 'execute.after']);
  assert.deepEqual([...sessionHooks.keys()], ['context']);

  const beforeEvent = {
    tool: 'edit',
    sessionID: 'session_1',
    agent: 'agent_1',
    messageID: 'message_1',
    id: 'call_1',
    input: beforeArgs,
  };
  await toolHooks.get('execute.before')(beforeEvent);
  assert.deepEqual(beforePair, {
    input: { tool: 'edit', sessionID: 'session_1', callID: 'call_1' },
    args: beforeArgs,
  });
  assert.strictEqual(beforeEvent.input, updatedArgs);

  await toolHooks.get('execute.after')({
    tool: 'read',
    sessionID: 'session_1',
    agent: 'agent_1',
    messageID: 'message_2',
    id: 'call_2',
    input: { path: 'result.txt' },
    status: 'completed',
    result: { content: 'read complete', metadata: { source: 'test' } },
  });
  assert.deepEqual(afterPair, {
    input: {
      tool: 'read',
      sessionID: 'session_1',
      callID: 'call_2',
      args: { path: 'result.txt' },
    },
    output: { title: '', output: 'read complete', metadata: { source: 'test' } },
  });

  const contextEvent = { sessionID: 'session_1', system: [] };
  await sessionHooks.get('context')(contextEvent);
  assert.deepEqual(systemPair, {
    input: { sessionID: 'session_1' },
    initialSystem: [],
  });
  assert.deepEqual(contextEvent.system, [
    { type: 'text', text: 'First system note' },
    { type: 'text', text: 'Second system note' },
  ]);

  const registeredTool = context.editor.tools[0];
  assert.equal(registeredTool.name, 'example');
  assert.equal(registeredTool.description, 'Example tool');
  assert.equal(registeredTool.input.type, 'object');
  assert.equal(registeredTool.input.properties.query.type, 'string');
  assert.notStrictEqual(registeredTool.execute, toolResult);
  assert.strictEqual(context.returnedEditor, context.editor);
  assert.deepEqual(cleanup.skippedKeys, ['chat.message']);
  assert.equal(cleanup.skippedKeys.length, 1);

  await cleanup();
  assert.equal(eventSignal.aborted, true);
  assert.equal(eventLoopStopped, true);
  assert.equal(registrations.length, 4);
  assert.equal(registrations.every((registration) => registration.disposed), true);
  assert.equal(disposeCalls, 1);
});

test('the v2 handler rejects when the v1 hook throws so the host denies the tool call', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context, toolHooks } = createV2Context();
  const plugin = dualPlugin('deny-test', async () => ({
    'tool.execute.before': async () => {
      throw new Error('Denied by v1 hook');
    },
  }));
  const cleanup = await plugin.setup(context);

  await assert.rejects(
    toolHooks.get('execute.before')({ tool: 'edit', sessionID: 'session_1', id: 'call_1', input: {} }),
    /Denied by v1 hook/,
  );
  await cleanup();
});

test('execute.after maps a v2 error result to v1 output', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context, toolHooks } = createV2Context();
  let receivedOutput;
  const plugin = dualPlugin('error-result-test', async () => ({
    'tool.execute.after': async (_input, output) => {
      receivedOutput = output;
    },
  }));
  const cleanup = await plugin.setup(context);
  const error = new Error('Tool failed');

  await toolHooks.get('execute.after')({
    tool: 'read',
    sessionID: 'session_1',
    id: 'call_1',
    input: {},
    status: 'error',
    error,
  });

  assert.equal(receivedOutput.title, '');
  assert.equal(receivedOutput.output, 'Tool failed');
  assert.strictEqual(receivedOutput.metadata.error, error);
  await cleanup();
});

test('execute.after maps title, output, and metadata from a v2 result', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context, toolHooks } = createV2Context();
  let receivedOutput;
  const plugin = dualPlugin('titled-result-test', async () => ({
    'tool.execute.after': async (_input, output) => {
      receivedOutput = output;
    },
  }));
  const cleanup = await plugin.setup(context);

  await toolHooks.get('execute.after')({
    tool: 'read',
    sessionID: 'session_1',
    id: 'call_1',
    input: {},
    status: 'completed',
    result: { title: 'Read file', output: 'file contents', metadata: { source: 'test' } },
  });

  assert.deepEqual(receivedOutput, {
    title: 'Read file',
    output: 'file contents',
    metadata: { source: 'test' },
  });
  await cleanup();
});

test('execute.after defaults output fields when the v2 result is absent', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context, toolHooks } = createV2Context();
  let receivedOutput;
  const plugin = dualPlugin('absent-result-test', async () => ({
    'tool.execute.after': async (_input, output) => {
      receivedOutput = output;
    },
  }));
  const cleanup = await plugin.setup(context);

  await toolHooks.get('execute.after')({
    tool: 'read',
    sessionID: 'session_1',
    id: 'call_1',
    input: {},
    status: 'completed',
  });

  assert.deepEqual(receivedOutput, { title: '', output: '', metadata: {} });
  await cleanup();
});

test('v1 tool string results convert to v2 content results', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context } = createV2Context();
  const plugin = dualPlugin('string-tool-result-test', async () => ({
    tool: {
      example: {
        description: 'Example tool',
        args: {},
        execute: async () => 'plain output',
      },
    },
  }));
  const cleanup = await plugin.setup(context);
  const execute = context.editor.tools[0].execute;

  assert.deepEqual(await execute({}, {
    sessionID: 'session_1',
    messageID: 'message_1',
    agent: 'agent_1',
    id: 'call_1',
    signal: new AbortController().signal,
    progress: async () => {},
  }), { content: 'plain output' });
  await cleanup();
});

test('v1 tool object results convert output and title metadata to v2 results', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { z } = await import('zod');
  const { context } = createV2Context();
  const plugin = dualPlugin('object-tool-result-test', async () => ({
    tool: {
      example: {
        description: 'Example tool',
        args: { query: z.string() },
        execute: async () => ({
          title: 'V1 title',
          output: 'V1 output',
          metadata: { source: 'v1' },
        }),
      },
    },
  }));
  const cleanup = await plugin.setup(context);

  assert.deepEqual(await context.editor.tools[0].execute({ query: 'test' }, {
    sessionID: 'session_1',
    messageID: 'message_1',
    agent: 'agent_1',
    id: 'call_1',
    signal: new AbortController().signal,
    progress: async () => {},
  }), {
    content: 'V1 output',
    metadata: { source: 'v1', title: 'V1 title' },
  });
  await cleanup();
});

test('v1 tool execute receives adapted context fields and preserved v2 fields', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { z } = await import('zod');
  const { context } = createV2Context();
  const abortController = new AbortController();
  const progressUpdates = [];
  const progress = async (update) => {
    progressUpdates.push(update);
  };
  let receivedContext;
  const plugin = dualPlugin('tool-context-test', async () => ({
    tool: {
      example: {
        description: 'Example tool',
        args: { query: z.string() },
        execute: async (_args, toolContext) => {
          receivedContext = toolContext;
          return 'complete';
        },
      },
    },
  }));
  const cleanup = await plugin.setup(context);
  context.location.directory = '/workspace/changed-after-setup';
  const v2Context = {
    sessionID: 'session_1',
    messageID: 'message_1',
    agent: 'agent_1',
    id: 'call_1',
    signal: abortController.signal,
    progress,
    directory: '/v2/directory',
    worktree: '/v2/worktree',
    retained: 'v2 field',
  };

  await context.editor.tools[0].execute({ query: 'test' }, v2Context);

  assert.equal(receivedContext.sessionID, 'session_1');
  assert.equal(receivedContext.messageID, 'message_1');
  assert.equal(receivedContext.agent, 'agent_1');
  assert.strictEqual(receivedContext.abort, abortController.signal);
  assert.equal(receivedContext.directory, '/workspace/project');
  assert.equal(receivedContext.worktree, '/workspace/project');
  assert.strictEqual(receivedContext.signal, abortController.signal);
  assert.strictEqual(receivedContext.progress, progress);
  assert.equal(receivedContext.retained, 'v2 field');

  const update = { title: 'Progress', metadata: { current: 1 } };
  await receivedContext.metadata(update);
  assert.deepEqual(progressUpdates, [update]);
  await assert.rejects(
    receivedContext.ask({ permission: 'file.read', patterns: [], always: [], metadata: {} }),
    /ask is not available on OpenCode 2/,
  );
  await cleanup();
});

test('system transform receives the model when the v2 context event includes one', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context, sessionHooks } = createV2Context();
  let receivedInput;
  const plugin = dualPlugin('context-model-test', async () => ({
    'experimental.chat.system.transform': async (input) => {
      receivedInput = input;
    },
  }));
  const cleanup = await plugin.setup(context);
  const model = { providerID: 'openai', modelID: 'gpt-test' };

  await sessionHooks.get('context')({ sessionID: 'session_1', model, system: [] });

  assert.deepEqual(receivedInput, { sessionID: 'session_1', model });
  await cleanup();
});

test('cleanup returns the same promise when called more than once', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context } = createV2Context();
  const plugin = dualPlugin('cleanup-promise-test', async () => ({}));
  const cleanup = await plugin.setup(context);

  const firstCleanup = cleanup();
  assert.strictEqual(cleanup(), firstCleanup);
  await firstCleanup;
});

test('cleanup rejects when a registered dispose rejects', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context, registrations } = createV2Context();
  const plugin = dualPlugin('cleanup-dispose-test', async () => ({
    'tool.execute.before': async () => {},
  }));
  const cleanup = await plugin.setup(context);
  const disposeError = new Error('Registration dispose failed');
  registrations[0].dispose = async () => {
    throw disposeError;
  };

  await assert.rejects(cleanup(), (error) => error === disposeError);
});

test('setup failure cleans registered hooks and rethrows the original error', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context, registrations } = createV2Context();
  const setupError = new Error('Context hook registration failed');
  context.session.hook = () => {
    throw setupError;
  };
  const plugin = dualPlugin('setup-failure-test', async () => ({
    'tool.execute.before': async () => {},
    'experimental.chat.system.transform': async () => {},
  }));

  await assert.rejects(plugin.setup(context), (error) => error === setupError);
  assert.equal(registrations.length, 1);
  assert.equal(registrations[0].disposed, true);
});

test('execute.before leaves the original args untouched when the v1 hook does not change them', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context, toolHooks } = createV2Context();
  const args = { path: 'original.txt' };
  let receivedArgs;
  const plugin = dualPlugin('unchanged-args-test', async () => ({
    'tool.execute.before': async (_input, output) => {
      receivedArgs = output.args;
    },
  }));
  const cleanup = await plugin.setup(context);
  const event = {
    tool: 'edit',
    sessionID: 'session_1',
    id: 'call_1',
    input: args,
  };

  await toolHooks.get('execute.before')(event);

  assert.strictEqual(event.input, args);
  assert.strictEqual(receivedArgs, args);
  await cleanup();
});

test('tool identity preserves the v1 helper contract', async () => {
  const { tool } = await import('../lib/tool-identity.js');
  const definition = { description: 'Example', args: {} };

  assert.strictEqual(tool(definition), definition);
  assert.equal(typeof tool.schema.object, 'function');
  assert.equal(typeof tool.schema.toJSONSchema, 'function');
});
