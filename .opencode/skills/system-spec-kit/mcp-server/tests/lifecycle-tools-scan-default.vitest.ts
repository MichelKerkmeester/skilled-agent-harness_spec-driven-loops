// ───────────────────────────────────────────────────────────────
// MODULE: Lifecycle Tools — memory_index_scan background default
// ───────────────────────────────────────────────────────────────
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ───────────────────────────────────────────────────────────────
// 1. TEST DOUBLES
// ───────────────────────────────────────────────────────────────

const { mockHandleMemoryIndexScan } = vi.hoisted(() => ({
  mockHandleMemoryIndexScan: vi.fn(async () => ({
    content: [{ type: 'text', text: JSON.stringify({ data: { jobId: 'job-1', state: 'queued' }, meta: { tool: 'memory_index_scan' } }) }],
    isError: false,
  })),
}));

vi.mock('../handlers/index.js', () => ({
  handleMemoryIndexScan: mockHandleMemoryIndexScan,
  handleMemoryIndexScanStatus: vi.fn(),
  handleMemoryIndexScanCancel: vi.fn(),
  handleMemoryIngestStart: vi.fn(),
  handleMemoryIngestStatus: vi.fn(),
  handleMemoryIngestCancel: vi.fn(),
  handleTaskPreflight: vi.fn(),
  handleTaskPostflight: vi.fn(),
  handleGetLearningHistory: vi.fn(),
  handleEvalRunAblation: vi.fn(),
  handleEvalReportingDashboard: vi.fn(),
  handleSessionHealth: vi.fn(),
  handleSessionResume: vi.fn(),
  handleSessionBootstrap: vi.fn(),
}));

import { handleTool } from '../tools/lifecycle-tools';

// ───────────────────────────────────────────────────────────────
// 2. TESTS
// ───────────────────────────────────────────────────────────────

describe('lifecycle-tools memory_index_scan background default (REQ-009)', () => {
  beforeEach(() => {
    mockHandleMemoryIndexScan.mockClear();
  });

  it('defaults background to true when the caller omits it entirely', async () => {
    await handleTool('memory_index_scan', {});

    expect(mockHandleMemoryIndexScan).toHaveBeenCalledTimes(1);
    expect(mockHandleMemoryIndexScan.mock.calls[0][0]).toMatchObject({ background: true });
  });

  it('respects an explicit background: false (old synchronous path still reachable)', async () => {
    await handleTool('memory_index_scan', { background: false });

    expect(mockHandleMemoryIndexScan.mock.calls[0][0]).toMatchObject({ background: false });
  });

  it('respects an explicit background: true unchanged', async () => {
    await handleTool('memory_index_scan', { background: true, force: true });

    expect(mockHandleMemoryIndexScan.mock.calls[0][0]).toMatchObject({ background: true, force: true });
  });

  it('preserves other args alongside the injected default', async () => {
    await handleTool('memory_index_scan', { specFolder: 'system-speckit/example', force: true });

    expect(mockHandleMemoryIndexScan.mock.calls[0][0]).toMatchObject({
      specFolder: 'system-speckit/example',
      force: true,
      background: true,
    });
  });
});
