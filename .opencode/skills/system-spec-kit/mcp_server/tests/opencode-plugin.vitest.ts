import path from 'node:path';

import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockedBridge = vi.hoisted(() => ({
  execFile: vi.fn(),
}));

vi.mock('node:child_process', () => ({
  execFile: mockedBridge.execFile,
}));

import mkCodeGraphPlugin from '../../../../plugins/mk-code-graph.js';
import { parseTransportPlan } from '../../../system-code-graph/mcp_server/plugin_bridges/mk-code-graph-transport.mjs';

function buildBridgeResponse() {
  return JSON.stringify({
    status: 'ok',
    data: {
      opencodeTransport: {
        interfaceVersion: '1.0',
        transportOnly: true,
        retrievalPolicyOwner: 'runtime',
        event: {
          hook: 'event',
          trackedPayloadKinds: ['resume'],
          summary: 'Track OpenCode routing hints',
        },
        systemTransform: {
          hook: 'experimental.chat.system.transform',
          title: 'OpenCode Startup Digest',
          payloadKind: 'resume',
          dedupeKey: 'system:resume',
          content: 'Summary: resume summary',
        },
        messagesTransform: [{
          hook: 'experimental.chat.messages.transform',
          title: 'OpenCode Retrieved Context',
          payloadKind: 'resume',
          dedupeKey: 'messages:resume:0',
          content: 'Summary: retrieved context',
        }],
        compaction: {
          hook: 'experimental.session.compacting',
          title: 'OpenCode Compaction Resume Note',
          payloadKind: 'resume',
          dedupeKey: 'compaction:resume',
          content: 'Summary: compaction note',
        },
      },
    },
  });
}

function mockBridgeSuccess(stdout = buildBridgeResponse()) {
  mockedBridge.execFile.mockImplementation((_file, _args, _options, callback) => {
    callback(null, stdout, '');
  });
}

function makeMessage(sessionID: string, messageID: string) {
  return {
    info: {
      id: messageID,
      sessionID,
    },
    parts: [],
  };
}

describe('mk-code-graph plugin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockBridgeSuccess();
  });

  it('injects the startup digest into the system prompt once per cache window', async () => {
    const hooks = await mkCodeGraphPlugin({ directory: process.cwd() }, { cacheTtlMs: 5000 });
    const output = { system: [] as string[] };

    await hooks['experimental.chat.system.transform']?.(
      { sessionID: 's1', model: { id: 'test-model' } as never },
      output,
    );
    await hooks['experimental.chat.system.transform']?.(
      { sessionID: 's1', model: { id: 'test-model' } as never },
      output,
    );

    expect(mockedBridge.execFile).toHaveBeenCalledTimes(1);
    expect(mockedBridge.execFile).toHaveBeenCalledWith(
      'node',
      expect.arrayContaining([
        expect.stringContaining('mk-code-graph-bridge.mjs'),
        '--minimal',
      ]),
      expect.objectContaining({ cwd: process.cwd() }),
      expect.any(Function),
    );
    expect(output.system).toHaveLength(1);
    expect(output.system[0]).toContain('OpenCode Startup Digest');
  });

  it('initializes missing host output arrays before compact injection', async () => {
    const hooks = await mkCodeGraphPlugin({ directory: process.cwd() }, { cacheTtlMs: 5000 });
    const systemOutput = {} as { system?: string[] };
    const compactOutput = { context: null } as unknown as { context: string[] };

    await hooks['experimental.chat.system.transform']?.(
      { sessionID: 's-output-guard', model: { id: 'test-model' } as never },
      systemOutput as never,
    );
    await hooks['experimental.session.compacting']?.(
      { sessionID: 's-output-guard-compact' },
      compactOutput,
    );

    expect(systemOutput.system).toHaveLength(1);
    expect(systemOutput.system?.[0]).toContain('OpenCode Startup Digest');
    expect(compactOutput.context).toHaveLength(1);
    expect(compactOutput.context[0]).toContain('OpenCode Compaction Resume Note');
  });

  it('normalizes object-shaped session IDs for compact cache keys', async () => {
    const hooks = await mkCodeGraphPlugin({ directory: process.cwd() }, { cacheTtlMs: 5000 });
    const firstOutput = { system: [] as string[] };
    const secondOutput = { system: [] as string[] };

    await hooks['experimental.chat.system.transform']?.(
      { sessionID: { b: 2, a: 1 }, model: { id: 'test-model' } as never },
      firstOutput,
    );
    await hooks['experimental.chat.system.transform']?.(
      { sessionID: { a: 1, b: 2 }, model: { id: 'test-model' } as never },
      secondOutput,
    );

    expect(mockedBridge.execFile).toHaveBeenCalledTimes(1);
    expect(firstOutput.system[0]).toContain('OpenCode Startup Digest');
    expect(secondOutput.system[0]).toContain('OpenCode Startup Digest');
  });

  it('exports only the default plugin factory so the loader treats nothing else as a plugin', async () => {
    const pluginModule = await import('../../../../plugins/mk-code-graph.js');

    expect(Object.keys(pluginModule).sort()).toEqual(['default']);
    expect(pluginModule.default).toBeTypeOf('function');
  });

  // SKIP: requires live opencode bridge executable behavior — defer to integration env
  it.skip('parses the real minimal bridge stdout without a mocked transport payload', async () => {
    const { spawnSync } = await vi.importActual<typeof import('node:child_process')>('node:child_process');
    const workspaceRoot = path.resolve(process.cwd(), '../../../..');
    const bridgePath = path.join(workspaceRoot, '.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs');

    const result = spawnSync(process.execPath, [bridgePath, '--minimal'], {
      cwd: workspaceRoot,
      encoding: 'utf8',
      env: process.env,
      timeout: 15000,
      maxBuffer: 1024 * 1024,
    });

    expect(result.status).toBe(0);
    const plan = parseTransportPlan(result.stdout.trim());
    expect(plan?.transportOnly).toBe(true);
    expect(plan?.messagesTransform.length).toBeGreaterThan(0);
  });

  it('returns null for non-string parser input', () => {
    expect(parseTransportPlan({ directory: process.cwd() } as never)).toBeNull();
  });

  it('adds schema-aligned synthetic text parts and avoids duplicates', async () => {
    const hooks = await mkCodeGraphPlugin({ directory: process.cwd() }, { cacheTtlMs: 5000 });
    const output = {
      messages: [makeMessage('s2', 'm1')],
    };

    await hooks['experimental.chat.messages.transform']?.({}, output as never);
    await hooks['experimental.chat.messages.transform']?.({}, output as never);

    expect(mockedBridge.execFile).toHaveBeenCalledTimes(1);
    expect(output.messages[0].parts).toHaveLength(1);
    expect(output.messages[0].parts[0]).toMatchObject({
      sessionID: 's2',
      messageID: 'm1',
      type: 'text',
      text: 'OpenCode Retrieved Context\nSummary: retrieved context',
      synthetic: true,
      metadata: {
        mkCodeGraph: 'messages:resume:0',
      },
    });
  });

  it('skips message injection for tool-bearing message anchors', async () => {
    const hooks = await mkCodeGraphPlugin({ directory: process.cwd() }, { cacheTtlMs: 5000 });
    const output = {
      messages: [{
        info: {
          id: 'm-tool',
          sessionID: 's-tool',
        },
        parts: [{
          id: 'tool-part-1',
          sessionID: 's-tool',
          messageID: 'm-tool',
          type: 'tool',
          callID: 'call-1',
          tool: 'session_bootstrap',
          state: {
            status: 'completed',
            input: {},
            output: 'ok',
            metadata: {},
            time: { start: 1, end: 2 },
          },
        }],
      }],
    };

    await hooks['experimental.chat.messages.transform']?.({}, output as never);

    expect(mockedBridge.execFile).not.toHaveBeenCalled();
    expect(output.messages[0].parts).toHaveLength(1);
    expect(output.messages[0].parts[0]).toMatchObject({ type: 'tool' });
  });

  it('adds a compaction note and invalidates cache on session events', async () => {
    const hooks = await mkCodeGraphPlugin({ directory: process.cwd() }, { cacheTtlMs: 5000 });
    const output = { context: [] as string[] };

    await hooks['experimental.session.compacting']?.({ sessionID: 's3' }, output);
    await hooks['experimental.session.compacting']?.({ sessionID: 's3' }, output);

    expect(mockedBridge.execFile).toHaveBeenCalledTimes(1);
    expect(output.context).toHaveLength(1);
    expect(output.context[0]).toContain('OpenCode Compaction Resume Note');

    await hooks.event?.({
      event: {
        type: 'session.deleted',
        properties: {
          info: {
            id: 's3',
          },
        },
      } as never,
    });

    await hooks['experimental.session.compacting']?.({ sessionID: 's3' }, { context: [] });
    expect(mockedBridge.execFile).toHaveBeenCalledTimes(2);
  });

  it('exposes a status tool for plugin diagnostics', async () => {
    const hooks = await mkCodeGraphPlugin(
      { directory: process.cwd() },
      { cacheTtlMs: 7777, bridgeTimeoutMs: 1234, nodeBinary: 'node-custom' },
    );
    await hooks['experimental.chat.system.transform']?.(
      { sessionID: 's4', model: { id: 'test-model' } as never },
      { system: [] },
    );
    const status = await hooks.tool?.mk_code_graph_status.execute({});

    expect(status).toContain('plugin_id=mk-code-graph');
    expect(status).toContain('cache_ttl_ms=7777');
    expect(status).toContain('resume_mode=minimal');
    expect(status).toContain('messages_transform_enabled=true');
    expect(status).toContain('messages_transform_mode=schema_aligned');
    expect(status).toContain('runtime_ready=true');
    expect(status).toContain('node_binary=node-custom');
    expect(status).toContain('bridge_timeout_ms=1234');
    expect(status).toContain('last_runtime_error=none');
  });

  it('skips injection when the bridge process fails', async () => {
    mockedBridge.execFile.mockImplementation((_file, _args, _options, callback) => {
      callback(new Error('NODE_MODULE_VERSION mismatch'), '', '');
    });

    const hooks = await mkCodeGraphPlugin({ directory: process.cwd() }, { cacheTtlMs: 5000 });
    const output = { system: [] as string[] };

    await hooks['experimental.chat.system.transform']?.(
      { sessionID: 's5', model: { id: 'test-model' } as never },
      output,
    );

    expect(output.system).toHaveLength(0);

    const status = await hooks.tool?.mk_code_graph_status.execute({});
    expect(status).toContain('runtime_ready=false');
    expect(status).toContain('last_runtime_error=NODE_MODULE_VERSION mismatch');
  });

  it('emits a stderr diagnostic when bridge stdout cannot be parsed as a transport plan', async () => {
    const stderrWrite = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    mockBridgeSuccess(JSON.stringify({ status: 'ok', data: {} }));
    // The bridge-skip diagnostic stays silent unless debug output is opted in,
    // so exercise the stderr path under the debug flag while still asserting the
    // failure surfaces through the status tool regardless.
    const prevDebug = process.env.MK_CODE_GRAPH_DEBUG;
    process.env.MK_CODE_GRAPH_DEBUG = '1';

    const hooks = await mkCodeGraphPlugin({ directory: process.cwd() }, { cacheTtlMs: 5000 });
    const output = { system: [] as string[] };

    try {
      await hooks['experimental.chat.system.transform']?.(
        { sessionID: 's-missing-transport', model: { id: 'test-model' } as never },
        output,
      );

      expect(output.system).toHaveLength(0);
      expect(stderrWrite).toHaveBeenCalledWith(
        expect.stringContaining('Bridge response missing data.opencodeTransport; plugin injection will no-op'),
      );

      const status = await hooks.tool?.mk_code_graph_status.execute({});
      expect(status).toContain('runtime_ready=false');
      expect(status).toContain('last_runtime_error=Bridge response missing data.opencodeTransport; plugin injection will no-op');
    } finally {
      if (prevDebug === undefined) {
        delete process.env.MK_CODE_GRAPH_DEBUG;
      } else {
        process.env.MK_CODE_GRAPH_DEBUG = prevDebug;
      }
      stderrWrite.mockRestore();
    }
  });
});
