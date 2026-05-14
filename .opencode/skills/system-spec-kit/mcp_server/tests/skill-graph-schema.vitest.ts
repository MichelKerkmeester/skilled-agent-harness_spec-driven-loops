// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Bridge Schema Tests
// ───────────────────────────────────────────────────────────────

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  handleTool,
  resetSkillGraphProxyForTests,
  setSkillGraphForwarderForTests,
  TOOL_NAMES,
} from '../tools/skill-graph-tools.js';

beforeEach(() => {
  resetSkillGraphProxyForTests();
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
  resetSkillGraphProxyForTests();
  vi.restoreAllMocks();
});

describe('spec_kit_memory skill_graph_* bridge routing', () => {
  it('TOOL_NAMES contains all four bridge skill_graph_* tool names', () => {
    expect(TOOL_NAMES.has('skill_graph_scan')).toBe(true);
    expect(TOOL_NAMES.has('skill_graph_query')).toBe(true);
    expect(TOOL_NAMES.has('skill_graph_status')).toBe(true);
    expect(TOOL_NAMES.has('skill_graph_validate')).toBe(true);
    expect(TOOL_NAMES.size).toBe(4);
  });

  it('returns null for unknown tool names', async () => {
    const forwarder = vi.fn();
    setSkillGraphForwarderForTests(forwarder);

    const result = await handleTool('unknown_tool', {});

    expect(result).toBeNull();
    expect(forwarder).not.toHaveBeenCalled();
  });

  it('forwards skill_graph_scan arguments through the bridge', async () => {
    const forwarder = vi.fn().mockResolvedValue({
      content: [{ type: 'text' as const, text: '{"status":"ok"}' }],
    });
    setSkillGraphForwarderForTests(forwarder);

    await handleTool('skill_graph_scan', { skillsRoot: '/custom/path' });

    expect(forwarder).toHaveBeenCalledWith('skill_graph_scan', { skillsRoot: '/custom/path' });
  });

  it('forwards skill_graph_query arguments through the bridge', async () => {
    const forwarder = vi.fn().mockResolvedValue({
      content: [{ type: 'text' as const, text: '{"status":"ok"}' }],
    });
    setSkillGraphForwarderForTests(forwarder);

    await handleTool('skill_graph_query', {
      queryType: 'hub_skills',
      minInbound: 5,
      limit: 20,
    });

    expect(forwarder).toHaveBeenCalledWith('skill_graph_query', {
      queryType: 'hub_skills',
      minInbound: 5,
      limit: 20,
    });
  });
});
