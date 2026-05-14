// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Dispatch Tests
// ───────────────────────────────────────────────────────────────

import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockScan = vi.fn().mockResolvedValue({ content: [{ type: 'text', text: '{"status":"ok","tool":"scan"}' }] });
const mockQuery = vi.fn().mockResolvedValue({ content: [{ type: 'text', text: '{"status":"ok","tool":"query"}' }] });
const mockStatus = vi.fn().mockResolvedValue({ content: [{ type: 'text', text: '{"status":"ok","tool":"status"}' }] });
const mockValidate = vi.fn().mockResolvedValue({ content: [{ type: 'text', text: '{"status":"ok","tool":"validate"}' }] });

vi.mock('../../handlers/skill-graph/index.js', () => ({
  handleSkillGraphScan: mockScan,
  handleSkillGraphQuery: mockQuery,
  handleSkillGraphStatus: mockStatus,
  handleSkillGraphValidate: mockValidate,
}));

const { dispatchTool } = await import('../../advisor-server.js');

describe('system_skill_advisor skill_graph_* dispatch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('routes all four skill_graph_* tools to advisor-local handlers', async () => {
    await expect(dispatchTool('skill_graph_scan', { skillsRoot: '.opencode/skills' })).resolves.toMatchObject({
      content: [{ type: 'text', text: expect.stringContaining('"scan"') }],
    });
    await expect(dispatchTool('skill_graph_query', { queryType: 'hub_skills' })).resolves.toMatchObject({
      content: [{ type: 'text', text: expect.stringContaining('"query"') }],
    });
    await expect(dispatchTool('skill_graph_status', {})).resolves.toMatchObject({
      content: [{ type: 'text', text: expect.stringContaining('"status"') }],
    });
    await expect(dispatchTool('skill_graph_validate', {})).resolves.toMatchObject({
      content: [{ type: 'text', text: expect.stringContaining('"validate"') }],
    });

    expect(mockScan).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledTimes(1);
    expect(mockValidate).toHaveBeenCalledTimes(1);
  });

  it('returns query validation errors before calling the query handler', async () => {
    const result = await dispatchTool('skill_graph_query', {});

    expect(result?.content[0].text).toContain('Missing required field: queryType');
    expect(mockQuery).not.toHaveBeenCalled();
  });
});
