import { createRequire } from 'node:module';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const proxy = require('../../../../bin/lib/launcher-session-proxy.cjs') as {
  createClassifyFrame: (options?: { replayableToolNames?: Set<string>; unsafeToolNames?: Set<string> }) => (frame: string) => boolean;
  __testing: { classifyFrame: (frame: string) => boolean };
};
// The launcher guards its main() behind require.main, so importing it here only exposes the wiring
// (it does not spawn the daemon).
const codeIndex = require('../../../../bin/mk-code-index-launcher.cjs') as {
  classifyCodeIndexFrame: (frame: string) => boolean;
  bridgeStdioThroughSessionProxy: (socketPath: string, options?: Record<string, unknown>) => unknown;
  CODE_INDEX_REPLAYABLE_TOOL_NAMES: Set<string>;
  CODE_INDEX_UNSAFE_TOOL_NAMES: Set<string>;
};

const toolCall = (name: string) => JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name } });
const method = (m: string) => JSON.stringify({ jsonrpc: '2.0', id: 1, method: m });

describe('createClassifyFrame (generic replay classifier factory)', () => {
  it('honors a custom replayable set and rejects everything else', () => {
    const classify = proxy.createClassifyFrame({ replayableToolNames: new Set(['x_tool']) });
    expect(classify(toolCall('x_tool'))).toBe(true);
    expect(classify(toolCall('memory_search'))).toBe(false);
  });

  it('treats a custom unsafe tool as non-replayable even if also listed replayable', () => {
    const classify = proxy.createClassifyFrame({
      replayableToolNames: new Set(['both']),
      unsafeToolNames: new Set(['both']),
    });
    // unsafe wins: a mutating tool must never be replayed across a reattach.
    expect(classify(toolCall('both'))).toBe(false);
  });

  it('replays shared protocol methods regardless of the tool set', () => {
    const classify = proxy.createClassifyFrame({ replayableToolNames: new Set() });
    expect(classify(method('initialize'))).toBe(true);
    expect(classify(method('ping'))).toBe(true);
    expect(classify(method('notifications/cancelled'))).toBe(true);
  });

  it('leaves the default (mk-spec-memory) classifier unchanged', () => {
    const mem = proxy.__testing.classifyFrame;
    expect(mem(toolCall('memory_search'))).toBe(true);
    expect(mem(toolCall('memory_delete'))).toBe(false);
    expect(mem(toolCall('code_graph_query'))).toBe(false);
  });
});

describe('mk-code-index reconnecting-proxy classifier', () => {
  it('replays read-only structural queries', () => {
    for (const name of ['code_graph_query', 'code_graph_context', 'code_graph_status', 'code_graph_classify_query_intent', 'code_graph_verify', 'detect_changes']) {
      expect(codeIndex.classifyCodeIndexFrame(toolCall(name))).toBe(true);
    }
  });

  it('never replays graph-mutating tools', () => {
    // A full scan or an apply mutates the graph; the client must re-drive these on a recycle, not the proxy.
    for (const name of ['code_graph_scan', 'code_graph_apply']) {
      expect(codeIndex.classifyCodeIndexFrame(toolCall(name))).toBe(false);
    }
  });

  it('does not treat mk-spec-memory tools as replayable (correct set isolation)', () => {
    expect(codeIndex.classifyCodeIndexFrame(toolCall('memory_search'))).toBe(false);
    expect(codeIndex.classifyCodeIndexFrame(toolCall('memory_save'))).toBe(false);
  });

  it('exposes the reconnecting bridge wrapper the launcher wires into maybeBridgeLeaseHolder', () => {
    expect(typeof codeIndex.bridgeStdioThroughSessionProxy).toBe('function');
  });

  it('keeps the replayable and unsafe sets disjoint', () => {
    const overlap = [...codeIndex.CODE_INDEX_REPLAYABLE_TOOL_NAMES].filter((t) => codeIndex.CODE_INDEX_UNSAFE_TOOL_NAMES.has(t));
    expect(overlap).toEqual([]);
  });
});
