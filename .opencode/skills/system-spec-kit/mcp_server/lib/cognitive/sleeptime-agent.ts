// ───────────────────────────────────────────────────────────────────
// MODULE: Sleeptime Agent
// ───────────────────────────────────────────────────────────────────

import { isSleeptimeLiveWriteEnabled } from '../search/search-flags.js';
import {
  runSleeptimeGovernor,
  type SleeptimeGovernorResult,
  type SleeptimeStepProvider,
  type SleeptimeToolExecutor,
} from './sleeptime-governor.js';

/* ───────────────────────────────────────────────────────────────
   1. TYPE DEFINITIONS
──────────────────────────────────────────────────────────────── */

export interface SleeptimeTranscriptMessage {
  readonly index: number;
  readonly role: string;
  readonly content: string;
}

export interface SleeptimeRange {
  readonly startIndex: number;
  readonly endIndex: number;
  readonly context: string;
}

export interface SleeptimeShadowRecord {
  readonly runId: string;
  readonly mode: 'shadow' | 'live';
  readonly ranges: readonly SleeptimeRange[];
  readonly wouldArchiveCount: number;
  readonly liveWriteAttempted: boolean;
}

export interface SleeptimeAgentInput {
  readonly runId: string;
  readonly transcript: readonly SleeptimeTranscriptMessage[];
  readonly mode?: 'shadow' | 'live';
  readonly maxSteps?: number;
  readonly costCeiling?: number;
  readonly rangeSelector?: (transcript: readonly SleeptimeTranscriptMessage[]) => readonly SleeptimeRange[];
  readonly archiveWriter?: (ranges: readonly SleeptimeRange[]) => Promise<unknown> | unknown;
}

export interface SleeptimeAgentResult {
  readonly status: 'disabled' | 'no-op' | 'shadow-recorded' | 'live-written' | 'aborted-partial' | 'forced-terminal';
  readonly governor: SleeptimeGovernorResult;
  readonly shadowRecord: SleeptimeShadowRecord | null;
}

/* ───────────────────────────────────────────────────────────────
   2. HELPERS
──────────────────────────────────────────────────────────────── */

function selectWholeTranscriptRange(
  transcript: readonly SleeptimeTranscriptMessage[],
): readonly SleeptimeRange[] {
  if (transcript.length === 0) return [];
  const first = transcript[0];
  const last = transcript[transcript.length - 1];
  return [{
    startIndex: first.index,
    endIndex: last.index,
    context: transcript.map((message) => `${message.role}: ${message.content}`).join('\n'),
  }];
}

function extractRanges(result: unknown): readonly SleeptimeRange[] {
  if (!Array.isArray(result)) return [];
  return result.filter((range): range is SleeptimeRange => {
    if (typeof range !== 'object' || range === null) return false;
    const candidate = range as Record<string, unknown>;
    return typeof candidate.startIndex === 'number'
      && typeof candidate.endIndex === 'number'
      && typeof candidate.context === 'string';
  });
}

function buildAgentStepProvider(): SleeptimeStepProvider {
  return (state) => {
    if (state.stepIndex === 0) {
      return { kind: 'tool_call', tool: 'select_ranges' };
    }
    return {
      kind: 'terminal',
      result: extractRanges(state.observations[state.observations.length - 1]?.result),
    };
  };
}

/* ───────────────────────────────────────────────────────────────
   3. CORE LOGIC
──────────────────────────────────────────────────────────────── */

/** Run the default-off sleep-time reorganization scaffold in shadow-first mode. */
export async function runSleeptimeAgent(input: SleeptimeAgentInput): Promise<SleeptimeAgentResult> {
  if (input.transcript.length === 0) {
    const governor = await runSleeptimeGovernor({
      stepProvider: () => ({ kind: 'terminal', result: [] }),
      toolExecutor: () => null,
      allowedTools: new Set<string>(),
      allowEmptyTerminal: true,
    });
    return {
      status: governor.status === 'disabled' ? 'disabled' : 'no-op',
      governor,
      shadowRecord: null,
    };
  }

  const rangeSelector = input.rangeSelector ?? selectWholeTranscriptRange;
  const toolExecutor: SleeptimeToolExecutor = ({ tool }) => {
    if (tool !== 'select_ranges') {
      throw new Error(`Unsupported sleep-time tool: ${tool}`);
    }
    return rangeSelector(input.transcript);
  };

  const governor = await runSleeptimeGovernor({
    stepProvider: buildAgentStepProvider(),
    toolExecutor,
    allowedTools: new Set(['select_ranges']),
    maxSteps: input.maxSteps,
    costCeiling: input.costCeiling,
  });

  if (governor.status === 'disabled') {
    return { status: 'disabled', governor, shadowRecord: null };
  }
  if (governor.status === 'forced-terminal') {
    return { status: 'forced-terminal', governor, shadowRecord: null };
  }
  if (governor.status === 'aborted-partial') {
    return { status: 'aborted-partial', governor, shadowRecord: null };
  }

  const ranges = extractRanges(governor.result);
  const liveWrite = input.mode === 'live' && isSleeptimeLiveWriteEnabled();
  const shadowRecord: SleeptimeShadowRecord = {
    runId: input.runId,
    mode: liveWrite ? 'live' : 'shadow',
    ranges,
    wouldArchiveCount: ranges.length,
    liveWriteAttempted: liveWrite,
  };

  if (liveWrite && input.archiveWriter) {
    await input.archiveWriter(ranges);
    return { status: 'live-written', governor, shadowRecord };
  }

  return { status: 'shadow-recorded', governor, shadowRecord };
}
