// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Proxy Tests
// ───────────────────────────────────────────────────────────────

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  handleTool,
  resetSkillGraphProxyForTests,
  setSkillGraphForwarderForTests,
} from '../tools/skill-graph-tools.js';

function parsePayload(result: { content: Array<{ type: string; text: string }> } | null): Record<string, unknown> {
  expect(result).not.toBeNull();
  return JSON.parse(result!.content[0].text) as Record<string, unknown>;
}

describe('spec_kit_memory skill_graph_* proxy', () => {
  beforeEach(() => {
    resetSkillGraphProxyForTests();
  });

  afterEach(() => {
    resetSkillGraphProxyForTests();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('forwards proxy calls to the advisor MCP boundary', async () => {
    const forwarder = vi.fn().mockResolvedValue({
      content: [{ type: 'text' as const, text: '{"status":"ok","server":"system_skill_advisor"}' }],
    });
    setSkillGraphForwarderForTests(forwarder);

    const result = await handleTool('skill_graph_query', { queryType: 'hub_skills' });

    expect(forwarder).toHaveBeenCalledWith('skill_graph_query', { queryType: 'hub_skills' });
    expect(parsePayload(result)).toEqual({ status: 'ok', server: 'system_skill_advisor' });
  });

  it('logs the deprecation notice only once per process', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    setSkillGraphForwarderForTests(vi.fn().mockResolvedValue({
      content: [{ type: 'text' as const, text: '{"status":"ok"}' }],
    }));

    await handleTool('skill_graph_status', {});
    await handleTool('skill_graph_validate', {});

    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy.mock.calls[0]?.[0]).toContain('spec_kit_memory.skill_graph_* is deprecated');
  });

  it('returns a prompt-safe unavailable response when advisor forwarding fails', async () => {
    setSkillGraphForwarderForTests(vi.fn().mockRejectedValue(new Error('advisor down')));

    const payload = parsePayload(await handleTool('skill_graph_status', {}));

    expect(payload).toMatchObject({
      ok: false,
      advisory: true,
      tool: 'skill_graph_status',
      server: 'system_skill_advisor',
    });
    expect(String(payload.detail)).toContain('advisor down');
  });

  it('returns a timeout response after 10 seconds', async () => {
    vi.useFakeTimers();
    setSkillGraphForwarderForTests(vi.fn(() => new Promise(() => undefined)));

    const pending = handleTool('skill_graph_validate', {});
    await vi.advanceTimersByTimeAsync(10_000);
    const payload = parsePayload(await pending);

    expect(payload).toMatchObject({
      ok: false,
      advisory: true,
      tool: 'skill_graph_validate',
      server: 'system_skill_advisor',
    });
    expect(String(payload.detail)).toContain('timed out after 10000ms');
  });
});
