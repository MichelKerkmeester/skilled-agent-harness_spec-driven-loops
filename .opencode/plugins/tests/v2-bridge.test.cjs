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

async function forwardEventsToV1(events) {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context } = createV2Context();
  const receivedEvents = [];
  let finishStream;
  const streamFinished = new Promise((resolve) => {
    finishStream = resolve;
  });

  context.event.subscribe = () => (async function* () {
    try {
      yield* events;
    } finally {
      finishStream();
    }
  })();

  const plugin = dualPlugin('event-payload-test', async () => ({
    event: async ({ event: v1Event }) => receivedEvents.push(v1Event),
  }));
  const cleanup = await plugin.setup(context);

  try {
    await streamFinished;
    return receivedEvents;
  } finally {
    await cleanup();
  }
}

async function forwardEventToV1(event) {
  return (await forwardEventsToV1([event]))[0];
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
  const v1Events = await forwardEventsToV1([{ type: 'session.updated', data }]);

  assert.deepEqual(v1Events.map((event) => event.type), ['session.created', 'session.updated']);
  assert.deepEqual(v1Events[0], {
    type: 'session.created',
    properties: { sessionID: 'session_existing', info: { id: 'session_existing' } },
  });
  assert.strictEqual(v1Events[1].properties, data);
});

test('message events do not gain session info', async () => {
  const data = { sessionID: 'session_message', messageID: 'message_1' };
  const v1Event = await forwardEventToV1({ type: 'message.updated', data });

  assert.strictEqual(v1Event.properties, data);
  assert.equal(Object.hasOwn(v1Event.properties, 'info'), false);
});

test('session.messages adapts v2 context entries to the v1 data envelope', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context } = createV2Context();
  const v2Messages = [
    { type: 'assistant', id: 'message_old', content: [{ type: 'text', text: 'Old answer' }] },
    { type: 'user', id: 'message_user', text: 'Use the current file' },
    {
      type: 'assistant',
      id: 'message_assistant',
      content: [
        { type: 'reasoning', text: 'Private reasoning' },
        { type: 'text', text: 'First answer' },
        { type: 'text', text: 'Second answer' },
      ],
    },
    { type: 'idle', id: 'message_idle' },
  ];
  let receivedInput;
  let client;
  context.session.context = async (input) => {
    receivedInput = input;
    return v2Messages;
  };
  const plugin = dualPlugin('messages-client-test', async (input) => {
    client = input.client;
    return {};
  });
  const cleanup = await plugin.setup(context);

  const response = await client.session.messages({
    path: { id: 'session_1' },
    query: { directory: '/workspace/project', limit: 3 },
  });

  assert.deepEqual(receivedInput, { sessionID: 'session_1' });
  assert.deepEqual(response, {
    data: [
      {
        info: { id: 'message_user', role: 'user', sessionID: 'session_1' },
        parts: [{ type: 'text', text: 'Use the current file' }],
      },
      {
        info: { id: 'message_assistant', role: 'assistant', sessionID: 'session_1' },
        parts: [
          { type: 'text', text: 'First answer' },
          { type: 'text', text: 'Second answer' },
        ],
      },
      {
        info: { id: 'message_idle', sessionID: 'session_1' },
        parts: [],
      },
    ],
  });
  await cleanup();
});

test('session.promptAsync queues v1 text through v2 session.prompt', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context } = createV2Context();
  let receivedInput;
  let client;
  context.session.prompt = async (input) => {
    receivedInput = input;
    return { id: 'inbox_1' };
  };
  const plugin = dualPlugin('prompt-async-client-test', async (input) => {
    client = input.client;
    return {};
  });
  const cleanup = await plugin.setup(context);

  const response = await client.session.promptAsync({
    path: { id: 'session_1' },
    query: { directory: '/workspace/project' },
    body: {
      messageID: 'message_1',
      parts: [
        { type: 'text', text: 'First line' },
        { type: 'text', text: 'Second line' },
      ],
    },
  });

  assert.equal(response, undefined);
  assert.deepEqual(receivedInput, {
    sessionID: 'session_1',
    id: 'message_1',
    text: 'First line\nSecond line',
    delivery: 'queue',
  });
  await cleanup();
});

test('session create, prompt, and delete map to v2 session methods', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context } = createV2Context();
  let createInput;
  let generateInput;
  let removeInput;
  let client;
  context.session.create = async (input) => {
    createInput = input;
    return { id: 'session_verifier' };
  };
  context.session.generate = async (input) => {
    generateInput = input;
    return { text: '{"verdict":"met"}' };
  };
  context.session.remove = async (input) => {
    removeInput = input;
  };
  const plugin = dualPlugin('session-methods-client-test', async (input) => {
    client = input.client;
    return {};
  });
  const cleanup = await plugin.setup(context);

  const created = await client.session.create({
    query: { directory: '/workspace/project' },
    body: {},
  });
  const prompted = await client.session.prompt({
    path: { id: 'session_verifier' },
    query: { directory: '/workspace/project' },
    body: { parts: [{ type: 'text', text: 'Return a JSON verdict.' }], tools: {} },
  });
  await client.session.delete({
    path: { id: 'session_verifier' },
    query: { directory: '/workspace/project' },
  });

  assert.deepEqual(createInput, { location: { directory: '/workspace/project' } });
  assert.deepEqual(created, { data: { id: 'session_verifier' } });
  assert.deepEqual(generateInput, {
    sessionID: 'session_verifier',
    prompt: 'Return a JSON verdict.',
  });
  assert.deepEqual(prompted, {
    data: {
      info: { role: 'assistant' },
      parts: [{ type: 'text', text: '{"verdict":"met"}' }],
    },
  });
  assert.deepEqual(removeInput, { sessionID: 'session_verifier' });
  await cleanup();
});

test('session client methods reject when their v2 session member is missing', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context } = createV2Context();
  let client;
  const plugin = dualPlugin('missing-session-method-test', async (input) => {
    client = input.client;
    return {};
  });
  const cleanup = await plugin.setup(context);
  const missingMethods = [
    ['messages', 'context', { path: { id: 'session_1' } }],
    [
      'promptAsync',
      'prompt',
      { path: { id: 'session_1' }, body: { parts: [{ type: 'text', text: 'Queue' }] } },
    ],
    ['create', 'create', { body: {} }],
    [
      'prompt',
      'generate',
      { path: { id: 'session_1' }, body: { parts: [{ type: 'text', text: 'Generate' }] } },
    ],
    ['delete', 'remove', { path: { id: 'session_1' } }],
  ];

  for (const [clientMethod, v2Method, input] of missingMethods) {
    await assert.rejects(
      client.session[clientMethod](input),
      new RegExp(`session\\.${v2Method} is not available on OpenCode 2`),
    );
  }
  await cleanup();
});

test('execution and compaction events emit their v1 aliases once', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context } = createV2Context();
  const receivedEvents = [];
  const events = [
    { type: 'session.execution.succeeded', data: { sessionID: 'session_execution' } },
    {
      type: 'session.compaction.ended',
      data: { sessionID: 'session_compaction', reason: 'manual' },
    },
    { type: 'session.updated', data: { sessionID: 'session_unrelated' } },
    { type: 'message.updated', data: { sessionID: 'session_message', messageID: 'message_1' } },
  ];
  let finishStream;
  const streamFinished = new Promise((resolve) => {
    finishStream = resolve;
  });
  context.event.subscribe = () => (async function* () {
    try {
      yield* events;
    } finally {
      finishStream();
    }
  })();
  const plugin = dualPlugin('event-alias-test', async () => ({
    event: async ({ event }) => {
      receivedEvents.push(event);
    },
  }));
  const cleanup = await plugin.setup(context);
  await streamFinished;
  await cleanup();

  assert.deepEqual(receivedEvents, [
    {
      type: 'session.created',
      properties: { sessionID: 'session_execution', info: { id: 'session_execution' } },
    },
    {
      type: 'session.execution.succeeded',
      properties: { sessionID: 'session_execution', info: { id: 'session_execution' } },
    },
    {
      type: 'session.idle',
      properties: { sessionID: 'session_execution', info: { id: 'session_execution' } },
    },
    {
      type: 'session.created',
      properties: { sessionID: 'session_compaction', info: { id: 'session_compaction' } },
    },
    {
      type: 'session.compaction.ended',
      properties: {
        sessionID: 'session_compaction',
        reason: 'manual',
        info: { id: 'session_compaction' },
      },
    },
    {
      type: 'session.compacted',
      properties: { sessionID: 'session_compaction', info: { id: 'session_compaction' } },
    },
    {
      type: 'session.created',
      properties: { sessionID: 'session_unrelated', info: { id: 'session_unrelated' } },
    },
    {
      type: 'session.updated',
      properties: { sessionID: 'session_unrelated', info: { id: 'session_unrelated' } },
    },
    {
      type: 'message.updated',
      properties: { sessionID: 'session_message', messageID: 'message_1' },
    },
  ]);
  assert.equal(receivedEvents.filter((event) => event.type === 'session.idle').length, 1);
  assert.equal(receivedEvents.filter((event) => event.type === 'session.compacted').length, 1);
});

test('session.idle alias then native event delivers one idle event', async () => {
  const receivedEvents = await forwardEventsToV1([
    { type: 'session.execution.succeeded', data: { sessionID: 'session_alias_first' } },
    { type: 'session.idle', data: { sessionID: 'session_alias_first' } },
  ]);

  assert.equal(receivedEvents.filter((event) => event.type === 'session.idle').length, 1);
});

test('native session.idle then alias delivers one idle event', async () => {
  const receivedEvents = await forwardEventsToV1([
    { type: 'session.idle', data: { sessionID: 'session_native_first' } },
    { type: 'session.execution.succeeded', data: { sessionID: 'session_native_first' } },
  ]);

  assert.equal(receivedEvents.filter((event) => event.type === 'session.idle').length, 1);
});

test('session.idle alias state resets for each execution turn and remains session-scoped', async () => {
  const receivedEvents = await forwardEventsToV1([
    { type: 'session.execution.succeeded', data: { sessionID: 'session_two_turns' } },
    { type: 'session.execution.succeeded', data: { sessionID: 'session_other' } },
    { type: 'session.execution.started', data: { sessionID: 'session_two_turns' } },
    { type: 'session.execution.succeeded', data: { sessionID: 'session_two_turns' } },
  ]);
  const idleSessionIDs = receivedEvents
    .filter((event) => event.type === 'session.idle')
    .map((event) => event.properties.sessionID);

  assert.deepEqual(idleSessionIDs, ['session_two_turns', 'session_other', 'session_two_turns']);
});

test('session.compacted aliases deduplicate and reset for each compaction', async () => {
  const receivedEvents = await forwardEventsToV1([
    { type: 'session.compaction.ended', data: { sessionID: 'session_compactions' } },
    { type: 'session.compacted', data: { sessionID: 'session_compactions' } },
    { type: 'session.compaction.started', data: { sessionID: 'session_compactions' } },
    { type: 'session.compaction.ended', data: { sessionID: 'session_compactions' } },
  ]);

  assert.equal(receivedEvents.filter((event) => event.type === 'session.compacted').length, 2);
});

test('session.deleted clears the session event alias state', async () => {
  const receivedEvents = await forwardEventsToV1([
    { type: 'session.execution.succeeded', data: { sessionID: 'session_deleted' } },
    { type: 'session.deleted', data: { sessionID: 'session_deleted' } },
    { type: 'session.execution.succeeded', data: { sessionID: 'session_deleted' } },
  ]);

  assert.equal(receivedEvents.filter((event) => event.type === 'session.idle').length, 2);
});

test('a session event before session.created announces the session first', async () => {
  const receivedEvents = await forwardEventsToV1([
    { type: 'session.execution.started', data: { sessionID: 'ses_a' } },
  ]);

  assert.deepEqual(receivedEvents.map((event) => event.type), [
    'session.created',
    'session.execution.started',
  ]);
  assert.deepEqual(receivedEvents[0], {
    type: 'session.created',
    properties: { sessionID: 'ses_a', info: { id: 'ses_a' } },
  });
});

test('a later session.created does not announce an already announced session', async () => {
  const receivedEvents = await forwardEventsToV1([
    { type: 'session.execution.started', data: { sessionID: 'ses_a' } },
    { type: 'session.created', data: { sessionID: 'ses_a' } },
  ]);

  assert.equal(
    receivedEvents.filter((event) => event.type === 'session.created').length,
    1,
  );
  assert.deepEqual(receivedEvents.map((event) => event.type), [
    'session.created',
    'session.execution.started',
  ]);
});

test('a leading session.created is delivered once without a synthesized duplicate', async () => {
  const receivedEvents = await forwardEventsToV1([
    { type: 'session.created', data: { sessionID: 'ses_b', parentID: 'ses_parent' } },
    { type: 'session.execution.started', data: { sessionID: 'ses_b' } },
  ]);

  assert.deepEqual(receivedEvents.map((event) => event.type), [
    'session.created',
    'session.execution.started',
  ]);
  assert.deepEqual(receivedEvents[0], {
    type: 'session.created',
    properties: { sessionID: 'ses_b', parentID: 'ses_parent', info: { id: 'ses_b' } },
  });
  assert.equal(
    receivedEvents.filter((event) => event.type === 'session.created').length,
    1,
  );
});

test('a system transform before the stream announces its session once', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context, sessionHooks } = createV2Context();
  const receivedEvents = [];
  const order = [];
  let releaseStream;
  let finishStream;
  const streamGate = new Promise((resolve) => {
    releaseStream = resolve;
  });
  const streamFinished = new Promise((resolve) => {
    finishStream = resolve;
  });
  context.event.subscribe = () => (async function* () {
    try {
      await streamGate;
      yield { type: 'session.execution.started', data: { sessionID: 'ses_c' } };
    } finally {
      finishStream();
    }
  })();
  const plugin = dualPlugin('context-announce-test', async () => ({
    event: async ({ event }) => {
      receivedEvents.push(event);
      order.push(`event:${event.type}`);
    },
    'experimental.chat.system.transform': async () => {
      order.push('transform');
    },
  }));
  const cleanup = await plugin.setup(context);

  try {
    await sessionHooks.get('context')({ sessionID: 'ses_c', system: [] });
    assert.deepEqual(order, ['event:session.created', 'transform']);

    releaseStream();
    await streamFinished;

    assert.deepEqual(receivedEvents.map((event) => event.type), [
      'session.created',
      'session.execution.started',
    ]);
    assert.equal(
      receivedEvents.filter((event) => event.type === 'session.created').length,
      1,
    );
  } finally {
    await cleanup();
  }
});

test('a system transform waits for an announcement the stream already started', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context, sessionHooks } = createV2Context();
  const order = [];
  let releaseCreated;
  let createdStarted;
  let finishStream;
  const createdGate = new Promise((resolve) => {
    releaseCreated = resolve;
  });
  const createdBegun = new Promise((resolve) => {
    createdStarted = resolve;
  });
  const streamFinished = new Promise((resolve) => {
    finishStream = resolve;
  });
  context.event.subscribe = () => (async function* () {
    try {
      yield { type: 'session.execution.started', data: { sessionID: 'ses_d' } };
    } finally {
      finishStream();
    }
  })();
  const plugin = dualPlugin('context-wait-test', async () => ({
    event: async ({ event }) => {
      if (event.type === 'session.created') {
        createdStarted();
        await createdGate;
      }
      order.push(`event:${event.type}`);
    },
    'experimental.chat.system.transform': async () => {
      order.push('transform');
    },
  }));
  const cleanup = await plugin.setup(context);

  try {
    await createdBegun;
    const transformDone = sessionHooks.get('context')({ sessionID: 'ses_d', system: [] });
    await new Promise((resolve) => setImmediate(resolve));
    assert.deepEqual(order, []);

    releaseCreated();
    await transformDone;
    await streamFinished;
    assert.equal(order.indexOf('event:session.created') < order.indexOf('transform'), true);
    assert.equal(order.filter((entry) => entry === 'event:session.created').length, 1);
  } finally {
    releaseCreated();
    await cleanup();
  }
});

test('a system transform waits for a real session.created already being delivered', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context, sessionHooks } = createV2Context();
  const receivedEvents = [];
  const order = [];
  let releaseCreated;
  let createdStarted;
  let finishStream;
  const createdGate = new Promise((resolve) => {
    releaseCreated = resolve;
  });
  const createdBegun = new Promise((resolve) => {
    createdStarted = resolve;
  });
  const streamFinished = new Promise((resolve) => {
    finishStream = resolve;
  });
  context.event.subscribe = () => (async function* () {
    try {
      yield { type: 'session.created', data: { sessionID: 'ses_r', parentID: 'p' } };
    } finally {
      finishStream();
    }
  })();
  const plugin = dualPlugin('context-wait-real-created-test', async () => ({
    event: async ({ event }) => {
      receivedEvents.push(event);
      if (event.type === 'session.created') {
        createdStarted();
        await createdGate;
      }
      order.push(`event:${event.type}`);
    },
    'experimental.chat.system.transform': async () => {
      order.push('transform');
    },
  }));
  const cleanup = await plugin.setup(context);

  try {
    await createdBegun;
    const transformDone = sessionHooks.get('context')({ sessionID: 'ses_r', system: [] });
    await new Promise((resolve) => setImmediate(resolve));
    assert.deepEqual(order, []);

    releaseCreated();
    await transformDone;
    await streamFinished;

    assert.equal(order.filter((entry) => entry === 'event:session.created').length, 1);
    assert.equal(order.indexOf('event:session.created') < order.indexOf('transform'), true);
    assert.equal(
      receivedEvents.filter((event) => event.type === 'session.created').length,
      1,
    );
    assert.equal(receivedEvents[0].properties.parentID, 'p');
  } finally {
    releaseCreated();
    await cleanup();
  }
});

test('a tool named constructor reaches the plugin as a plain string', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context, toolHooks } = createV2Context();
  let receivedPair;
  const plugin = dualPlugin('constructor-name-test', async () => ({
    'tool.execute.before': async (input, output) => {
      receivedPair = { input, args: output.args };
    },
  }));
  const cleanup = await plugin.setup(context);

  await toolHooks.get('execute.before')({
    tool: 'constructor',
    sessionID: 'ses_x',
    agent: 'build',
    messageID: 'msg_y',
    id: 'call_1',
    input: {},
  });

  assert.equal(receivedPair.input.tool, 'constructor');
  assert.equal(typeof receivedPair.input.tool, 'string');
  await cleanup();
});

test('a transform without an event hook does not synthesize an event', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context, sessionHooks } = createV2Context();
  let transformed = false;
  const plugin = dualPlugin('no-event-hook-transform-test', async () => ({
    'experimental.chat.system.transform': async () => {
      transformed = true;
    },
  }));
  const cleanup = await plugin.setup(context);

  try {
    await sessionHooks.get('context')({ sessionID: 'ses_no_event', system: [] });
    assert.equal(transformed, true);
  } finally {
    await cleanup();
  }
});

test('session.deleted allows the same session to be announced again', async () => {
  const receivedEvents = await forwardEventsToV1([
    { type: 'session.execution.started', data: { sessionID: 'ses_a' } },
    { type: 'session.deleted', data: { sessionID: 'ses_a' } },
    { type: 'session.execution.started', data: { sessionID: 'ses_a' } },
  ]);
  const announcements = receivedEvents.filter((event) => event.type === 'session.created');

  assert.equal(announcements.length, 2);
  assert.deepEqual(
    announcements.map((event) => event.properties.sessionID),
    ['ses_a', 'ses_a'],
  );
});

test('session.text.ended maps to a v1 assistant text-part event', async () => {
  const receivedEvents = await forwardEventsToV1([{
    type: 'session.text.ended',
    data: {
      sessionID: 'session_text',
      assistantMessageID: 'assistant_text',
      ordinal: 1,
      text: 'The assistant completed the goal.',
    },
  }]);

  assert.deepEqual(
    receivedEvents.map((event) => event.type),
    ['session.created', 'session.text.ended', 'message.part.updated'],
  );
  assert.deepEqual(receivedEvents[0], {
    type: 'session.created',
    properties: { sessionID: 'session_text', info: { id: 'session_text' } },
  });
  assert.deepEqual(receivedEvents[2], {
    type: 'message.part.updated',
    properties: {
      sessionID: 'session_text',
      part: {
        type: 'text',
        text: 'The assistant completed the goal.',
        sessionID: 'session_text',
        messageID: 'assistant_text',
        role: 'assistant',
      },
    },
  });
});

test('session.step.ended maps to a v1 message update with token usage fields', async () => {
  const tokens = {
    input: 12,
    output: 5,
    reasoning: 2,
    cache: { read: 3, write: 1 },
  };
  const receivedEvents = await forwardEventsToV1([{
    type: 'session.step.ended',
    data: {
      sessionID: 'session_step',
      assistantMessageID: 'assistant_step',
      finish: 'stop',
      cost: 0.25,
      tokens,
    },
  }]);

  assert.deepEqual(
    receivedEvents.map((event) => event.type),
    ['session.created', 'session.step.ended', 'message.updated'],
  );
  assert.deepEqual(receivedEvents[0], {
    type: 'session.created',
    properties: { sessionID: 'session_step', info: { id: 'session_step' } },
  });
  assert.deepEqual(receivedEvents[2], {
    type: 'message.updated',
    properties: {
      sessionID: 'session_step',
      info: {
        id: 'assistant_step',
        sessionID: 'session_step',
        role: 'assistant',
        cost: 0.25,
        tokens,
      },
    },
  });
});

test('session.step.ended carries created as the completed time', async () => {
  const created = 1792528288311;
  const receivedEvents = await forwardEventsToV1([{
    type: 'session.step.ended',
    created,
    data: {
      sessionID: 'ses_x',
      assistantMessageID: 'msg_a',
      finish: 'tool-calls',
      cost: 0.0005,
      tokens: { input: 4014, output: 48, reasoning: 0, cache: { read: 8064, write: 0 } },
    },
  }]);
  const messageUpdated = receivedEvents.find((event) => event.type === 'message.updated');

  assert.equal(messageUpdated.properties.sessionID, 'ses_x');
  assert.deepEqual(messageUpdated.properties.info.time, { completed: created });
  assert.equal(messageUpdated.properties.info.sessionID, 'ses_x');
});

test('session.step.ended without a created time omits info.time', async () => {
  const receivedEvents = await forwardEventsToV1([{
    type: 'session.step.ended',
    data: { sessionID: 'ses_no_time', assistantMessageID: 'msg_no_time' },
  }]);
  const messageUpdated = receivedEvents.find((event) => event.type === 'message.updated');

  assert.equal(Object.hasOwn(messageUpdated.properties.info, 'time'), false);
  assert.equal(messageUpdated.properties.sessionID, 'ses_no_time');
});

test('a user inbox item emits the user message then its text part in order', async () => {
  const created = 1792528284181;
  const receivedEvents = await forwardEventsToV1([
    {
      id: 'evt_1',
      created,
      type: 'session.inbox.enqueued',
      data: {
        sessionID: 'ses_x',
        inboxID: 'msg_u',
        item: { type: 'user', payload: { text: 'Step 1: run ...' }, delivery: 'queue' },
      },
    },
  ]);

  assert.deepEqual(
    receivedEvents.map((event) => event.type),
    ['session.created', 'session.inbox.enqueued', 'message.updated', 'message.part.updated'],
  );
  assert.deepEqual(receivedEvents[2], {
    type: 'message.updated',
    properties: {
      sessionID: 'ses_x',
      info: { id: 'msg_u', sessionID: 'ses_x', role: 'user', time: { created } },
    },
  });
  assert.deepEqual(receivedEvents[3], {
    type: 'message.part.updated',
    properties: {
      sessionID: 'ses_x',
      part: {
        type: 'text',
        text: 'Step 1: run ...',
        sessionID: 'ses_x',
        messageID: 'msg_u',
      },
    },
  });
});

test('a non-user inbox item maps to nothing beyond the original event', async () => {
  const receivedEvents = await forwardEventsToV1([
    {
      id: 'evt_2',
      type: 'session.inbox.enqueued',
      data: {
        sessionID: 'ses_x',
        inboxID: 'msg_synthetic',
        item: { type: 'synthetic', payload: { text: 'ignored' }, delivery: 'queue' },
      },
    },
  ]);

  assert.deepEqual(receivedEvents.map((event) => event.type), [
    'session.created',
    'session.inbox.enqueued',
  ]);
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
    const { client, ...legacyInput } = input;
    assert.deepEqual(legacyInput, {
      project: undefined,
      worktree: '/workspace/project',
      directory: '/workspace/project',
      experimental_workspace: undefined,
      serverUrl: undefined,
      $: undefined,
    });
    assert.deepEqual(Object.keys(client.session), [
      'messages',
      'promptAsync',
      'create',
      'prompt',
      'delete',
    ]);
    return {
      event: async ({ event: v1Event }) => {
        receivedEvents.push(v1Event);
        if (receivedEvents.length === 2) resolveEvent();
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
  assert.deepEqual(receivedEvents, [
    {
      type: 'session.created',
      properties: { sessionID: 'session_1', info: { id: 'session_1' } },
    },
    {
      type: event.type,
      properties: { ...event.data, info: { id: 'session_1' } },
    },
  ]);
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

test('execute.before presents a v2 shell call to the plugin as bash', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context, toolHooks } = createV2Context();
  let receivedPair;
  const plugin = dualPlugin('shell-name-test', async () => ({
    'tool.execute.before': async (input, output) => {
      receivedPair = { input, args: output.args };
    },
  }));
  const cleanup = await plugin.setup(context);

  await toolHooks.get('execute.before')({
    tool: 'shell',
    sessionID: 'ses_x',
    agent: 'build',
    messageID: 'msg_y',
    id: 'call_1',
    input: { command: 'echo probe-123' },
  });

  assert.equal(receivedPair.input.tool, 'bash');
  assert.deepEqual(receivedPair.args, { command: 'echo probe-123' });
  await cleanup();
});

test('execute.before leaves a non-aliased tool and its args unchanged', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context, toolHooks } = createV2Context();
  const args = { path: 'result.txt' };
  let receivedPair;
  const plugin = dualPlugin('read-name-test', async () => ({
    'tool.execute.before': async (input, output) => {
      receivedPair = { input, args: output.args };
    },
  }));
  const cleanup = await plugin.setup(context);
  const event = {
    tool: 'read',
    sessionID: 'ses_x',
    agent: 'build',
    messageID: 'msg_y',
    id: 'call_1',
    input: args,
  };

  await toolHooks.get('execute.before')(event);

  assert.equal(receivedPair.input.tool, 'read');
  assert.strictEqual(receivedPair.args, args);
  assert.strictEqual(event.input, args);
  await cleanup();
});

test('execute.before presents a v2 subagent call as task with subagent_type', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context, toolHooks } = createV2Context();
  let receivedPair;
  const plugin = dualPlugin('subagent-name-test', async () => ({
    'tool.execute.before': async (input, output) => {
      receivedPair = { input, args: output.args };
    },
  }));
  const cleanup = await plugin.setup(context);
  const event = {
    tool: 'subagent',
    sessionID: 'ses_x',
    agent: 'build',
    messageID: 'msg_y',
    id: 'call_1',
    input: { agent: 'general', description: 'Reply OK', prompt: 'Reply with the single word: OK' },
  };

  await toolHooks.get('execute.before')(event);

  assert.equal(receivedPair.input.tool, 'task');
  assert.equal(receivedPair.args.subagent_type, 'general');
  assert.equal(receivedPair.args.agent, 'general');
  assert.equal(receivedPair.args.description, 'Reply OK');
  assert.equal(Object.hasOwn(event.input, 'subagent_type'), false);
  assert.equal(event.input.agent, 'general');
  await cleanup();
});

test('execute.before writes a changed subagent_type back to agent', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context, toolHooks } = createV2Context();
  const plugin = dualPlugin('subagent-override-test', async () => ({
    'tool.execute.before': async (_input, output) => {
      output.args = { ...output.args, subagent_type: 'review' };
    },
  }));
  const cleanup = await plugin.setup(context);
  const event = {
    tool: 'subagent',
    sessionID: 'ses_x',
    agent: 'build',
    messageID: 'msg_y',
    id: 'call_1',
    input: { agent: 'general', description: 'Reply OK', prompt: 'Reply with the single word: OK' },
  };

  await toolHooks.get('execute.before')(event);

  assert.equal(event.input.agent, 'review');
  assert.equal(Object.hasOwn(event.input, 'subagent_type'), false);
  assert.equal(event.input.description, 'Reply OK');
  await cleanup();
});

test('execute.after gives a v2 shell call the v1 string output', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context, toolHooks } = createV2Context();
  let receivedOutput;
  const plugin = dualPlugin('shell-output-test', async () => ({
    'tool.execute.after': async (_input, output) => {
      receivedOutput = output;
    },
  }));
  const cleanup = await plugin.setup(context);

  await toolHooks.get('execute.after')({
    tool: 'shell',
    sessionID: 'ses_x',
    agent: 'build',
    messageID: 'msg_y',
    id: 'call_1',
    input: { command: 'echo probe-123' },
    status: 'completed',
    result: {
      output: { exit: 0, truncated: false, output: 'probe-123\n', status: 'completed' },
      content: [{ type: 'text', text: 'probe-123\n' }],
      metadata: { status: 'completed', truncated: false, exit: 0 },
    },
  });

  assert.equal(typeof receivedOutput.output, 'string');
  assert.equal(receivedOutput.output, 'probe-123\n');
  assert.deepEqual(receivedOutput.metadata, { status: 'completed', truncated: false, exit: 0 });
  await cleanup();
});

test('a v1 hook refusal for bash reaches the host for a v2 shell call', async () => {
  const { dualPlugin } = await import('../lib/v2-bridge.js');
  const { context, toolHooks } = createV2Context();
  let receivedTool;
  const plugin = dualPlugin('shell-deny-test', async () => ({
    'tool.execute.before': async (input) => {
      receivedTool = input.tool;
      throw new Error('Denied by v1 hook');
    },
  }));
  const cleanup = await plugin.setup(context);

  await assert.rejects(
    toolHooks.get('execute.before')({
      tool: 'shell',
      sessionID: 'ses_x',
      agent: 'build',
      messageID: 'msg_y',
      id: 'call_1',
      input: { command: 'echo probe-123' },
    }),
    /Denied by v1 hook/,
  );
  assert.equal(receivedTool, 'bash');
  await cleanup();
});
