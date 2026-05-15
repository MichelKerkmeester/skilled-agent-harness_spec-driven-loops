// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Dispatch Tests
// ───────────────────────────────────────────────────────────────

import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockScan = vi.fn().mockResolvedValue({ content: [{ type: 'text', text: '{"status":"ok","tool":"scan"}' }] });
const mockQuery = vi.fn().mockResolvedValue({ content: [{ type: 'text', text: '{"status":"ok","tool":"query"}' }] });
const mockStatus = vi.fn().mockResolvedValue({ content: [{ type: 'text', text: '{"status":"ok","tool":"status"}' }] });
const mockValidate = vi.fn().mockResolvedValue({ content: [{ type: 'text', text: '{"status":"ok","tool":"validate"}' }] });
const mockAdvisorRecommend = vi.fn().mockResolvedValue({ content: [{ type: 'text', text: '{"status":"ok","tool":"recommend"}' }] });
const mockAdvisorRebuild = vi.fn().mockResolvedValue({ content: [{ type: 'text', text: '{"status":"ok","tool":"rebuild"}' }] });
const mockAdvisorStatus = vi.fn().mockResolvedValue({ content: [{ type: 'text', text: '{"status":"ok","tool":"advisor-status"}' }] });
const mockAdvisorValidate = vi.fn().mockResolvedValue({ content: [{ type: 'text', text: '{"status":"ok","tool":"advisor-validate"}' }] });

vi.mock('../../handlers/skill-graph/index.js', () => ({
  handleSkillGraphScan: mockScan,
  handleSkillGraphQuery: mockQuery,
  handleSkillGraphStatus: mockStatus,
  handleSkillGraphValidate: mockValidate,
}));

vi.mock('../../handlers/index.js', () => ({
  handleAdvisorRecommend: mockAdvisorRecommend,
  handleAdvisorRebuild: mockAdvisorRebuild,
  handleAdvisorStatus: mockAdvisorStatus,
  handleAdvisorValidate: mockAdvisorValidate,
}));

const { dispatchTool } = await import('../../advisor-server.js');

describe('mk_skill_advisor dispatch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('routes all eight public tools to advisor-local handlers', async () => {
    await expect(dispatchTool('advisor_recommend', { prompt: 'use sk-code' })).resolves.toMatchObject({
      content: [{ type: 'text', text: expect.stringContaining('"recommend"') }],
    });
    await expect(dispatchTool('advisor_rebuild', {})).resolves.toMatchObject({
      content: [{ type: 'text', text: expect.stringContaining('"rebuild"') }],
    });
    await expect(dispatchTool('advisor_status', {})).resolves.toMatchObject({
      content: [{ type: 'text', text: expect.stringContaining('"advisor-status"') }],
    });
    await expect(dispatchTool('advisor_validate', {})).resolves.toMatchObject({
      content: [{ type: 'text', text: expect.stringContaining('"advisor-validate"') }],
    });
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

    expect(mockAdvisorRecommend).toHaveBeenCalledTimes(1);
    expect(mockAdvisorRebuild).toHaveBeenCalledTimes(1);
    expect(mockAdvisorStatus).toHaveBeenCalledTimes(1);
    expect(mockAdvisorValidate).toHaveBeenCalledTimes(1);
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
