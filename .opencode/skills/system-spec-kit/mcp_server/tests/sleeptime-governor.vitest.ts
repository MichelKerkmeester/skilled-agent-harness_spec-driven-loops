import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  runSleeptimeGovernor,
  SLEEPTIME_HARD_STEP_LIMIT,
  type SleeptimeStepProvider,
  type SleeptimeToolExecutor,
} from '../lib/cognitive/sleeptime-governor.js';
import { runSleeptimeAgent } from '../lib/cognitive/sleeptime-agent.js';

const CONSOLIDATION_FLAG = 'SPECKIT_SLEEPTIME_CONSOLIDATION';
const LIVE_WRITE_FLAG = 'SPECKIT_SLEEPTIME_LIVE_WRITE';

function alwaysCall(tool: string): SleeptimeStepProvider {
  return () => ({ kind: 'tool_call', tool });
}

function echoExecutor(result: unknown = 'ok'): SleeptimeToolExecutor {
  return ({ tool }) => ({ tool, result });
}

describe('sleeptime-governor', () => {
  const originalConsolidationFlag = process.env[CONSOLIDATION_FLAG];
  const originalLiveWriteFlag = process.env[LIVE_WRITE_FLAG];

  beforeEach(() => {
    delete process.env[CONSOLIDATION_FLAG];
    delete process.env[LIVE_WRITE_FLAG];
  });

  afterEach(() => {
    if (originalConsolidationFlag === undefined) delete process.env[CONSOLIDATION_FLAG];
    else process.env[CONSOLIDATION_FLAG] = originalConsolidationFlag;
    if (originalLiveWriteFlag === undefined) delete process.env[LIVE_WRITE_FLAG];
    else process.env[LIVE_WRITE_FLAG] = originalLiveWriteFlag;
  });

  it('fails closed when the sleep-time flag is off', async () => {
    let providerCalls = 0;

    const result = await runSleeptimeGovernor({
      stepProvider: () => {
        providerCalls += 1;
        return { kind: 'tool_call', tool: 'select_ranges' };
      },
      toolExecutor: echoExecutor(),
      allowedTools: new Set(['select_ranges']),
    });

    expect(result.status).toBe('disabled');
    expect(result.stopReason).toBe('flag_disabled');
    expect(result.steps).toBe(0);
    expect(providerCalls).toBe(0);
  });

  it('forces terminal at the step cap and clamps extreme caps', async () => {
    const result = await runSleeptimeGovernor({
      stepProvider: alwaysCall('select_ranges'),
      toolExecutor: echoExecutor(),
      allowedTools: new Set(['select_ranges']),
      maxSteps: 10_000,
      bypassFlagGate: true,
    });

    expect(result.status).toBe('forced-terminal');
    expect(result.stopReason).toBe('step_cap');
    expect(result.steps).toBe(SLEEPTIME_HARD_STEP_LIMIT);
  });

  it('aborts at the cost ceiling with the best partial result', async () => {
    const result = await runSleeptimeGovernor({
      stepProvider: alwaysCall('select_ranges'),
      toolExecutor: echoExecutor('range-set'),
      allowedTools: new Set(['select_ranges']),
      maxSteps: 5,
      costCeiling: 3,
      costFn: () => 2,
      bypassFlagGate: true,
    });

    expect(result.status).toBe('aborted-partial');
    expect(result.stopReason).toBe('cost_ceiling');
    expect(result.result).toEqual({ tool: 'select_ranges', result: 'range-set' });
  });

  it('rejects a terminal step before any child work unless explicitly empty', async () => {
    const result = await runSleeptimeGovernor({
      stepProvider: () => ({ kind: 'terminal', result: 'too-soon' }),
      toolExecutor: echoExecutor(),
      allowedTools: new Set(['select_ranges']),
      bypassFlagGate: true,
    });

    expect(result.status).toBe('aborted-partial');
    expect(result.stopReason).toBe('early_terminal');
  });

  it('aborts when a tool is outside the allowlist', async () => {
    const result = await runSleeptimeGovernor({
      stepProvider: alwaysCall('delete_memory'),
      toolExecutor: echoExecutor(),
      allowedTools: new Set(['select_ranges']),
      bypassFlagGate: true,
    });

    expect(result.status).toBe('aborted-partial');
    expect(result.stopReason).toBe('acl_denied');
  });

  it('records shadow ranges and does not call the archive writer by default', async () => {
    process.env[CONSOLIDATION_FLAG] = 'true';
    const writer = vi.fn();

    const result = await runSleeptimeAgent({
      runId: 'run-1',
      transcript: [
        { index: 0, role: 'user', content: 'We decided to keep shadow mode.' },
        { index: 1, role: 'assistant', content: 'The governor bounds off-turn work.' },
      ],
      archiveWriter: writer,
    });

    expect(result.status).toBe('shadow-recorded');
    expect(result.shadowRecord).toMatchObject({
      runId: 'run-1',
      mode: 'shadow',
      wouldArchiveCount: 1,
      liveWriteAttempted: false,
    });
    expect(result.shadowRecord?.ranges[0]).toMatchObject({
      startIndex: 0,
      endIndex: 1,
    });
    expect(writer).not.toHaveBeenCalled();
  });

  it('requires a second explicit flag before live archival writes run', async () => {
    process.env[CONSOLIDATION_FLAG] = 'true';
    const writer = vi.fn();

    const shadowResult = await runSleeptimeAgent({
      runId: 'run-2',
      mode: 'live',
      transcript: [{ index: 0, role: 'user', content: 'Live mode requested.' }],
      archiveWriter: writer,
    });
    expect(shadowResult.status).toBe('shadow-recorded');
    expect(writer).not.toHaveBeenCalled();

    process.env[LIVE_WRITE_FLAG] = 'true';
    const liveResult = await runSleeptimeAgent({
      runId: 'run-3',
      mode: 'live',
      transcript: [{ index: 0, role: 'user', content: 'Live mode explicitly enabled.' }],
      archiveWriter: writer,
    });

    expect(liveResult.status).toBe('live-written');
    expect(writer).toHaveBeenCalledTimes(1);
  });
});
